<?php
namespace App\Services\Logistica;

use App\DTOs\Logistica\EntregaResponseDTO;
use App\Exceptions\Venta\EstadoInvalidoException;
use App\Models\Entrega;
use App\Models\EntregaEstadoHistorial;
use App\Models\Venta;
use App\Services\Stock\StockService;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use App\Services\WebSocket\EntregaWebSocketService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * EntregaService - Logística de entregas
 *
 * RESPONSABILIDADES:
 * ✓ Crear entregas desde ventas
 * ✓ Cambiar estado de entregas
 * ✓ Asignar chofer y vehículo
 * ✓ Registrar ubicación
 * ✓ Confirmar/rechazar entrega
 * ✓ Mantener historial de estados
 *
 * INVARIANTE: ÚNICO punto donde cambia estado de Entrega
 */
class EntregaService
{
    use ManagesTransactions, LogsOperations;

    /**
     * DEPRECATED: Usar validación dinámica desde EstadoLogistica::puedeTransicionarA()
     *
     * Este array se mantiene SOLO para compatibilidad con flujos legacy (EN_CAMINO, etc.)
     * FASE 1: Los nuevos flujos (PREPARACION_CARGA, LISTO_PARA_ENTREGA, EN_TRANSITO)
     * validan dinámicamente desde la BD.
     */
    private static array $transicionesValidas = [
        'PROGRAMADO' => ['ASIGNADA', 'CANCELADA'], // Nuevo estado inicial
        'PENDIENTE'  => ['ASIGNADA', 'CANCELADA'], // Legacy
        'ASIGNADA'   => ['EN_CAMINO', 'PROGRAMADO', 'PENDIENTE', 'CANCELADA'],
        'EN_CAMINO'  => ['LLEGO', 'NOVEDAD', 'CANCELADA'],
        'LLEGO'      => ['ENTREGADO', 'NOVEDAD', 'CANCELADA'],
        'ENTREGADO'  => [],
        'NOVEDAD'    => ['ASIGNADA', 'CANCELADA'], // Para reintentar
        'CANCELADA'  => [],
        // Legacy states
        'ENTREGADA'  => [],
        'RECHAZADA'  => ['ASIGNADA'],
    ];

    public function __construct(
        private StockService $stockService,
        private \App\Services\RutaOptimizer $rutaOptimizer,
        private EntregaWebSocketService $webSocketService,
        private ReporteCargoService $reporteCargoService,
        private SincronizacionVentaEntregaService $sincronizador,
    ) {}

    /**
     * ═══════════════════════════════════════════════════════════════════
     * MÉTODO CENTRALIZADO - FASE 1: Cambio de estado normalizado
     * ═══════════════════════════════════════════════════════════════════
     *
     * RESPONSABILIDAD ÚNICA: Cambiar estado de entrega con validación dinámica
     *
     * Flujo garantizado:
     * 1. Obtener estado nuevo desde BD (tabla estados_logistica)
     * 2. Validar transición dinámicamente (puedeTransicionarA)
     * 3. Actualizar estado_entrega_id y estado (ENUM legacy)
     * 4. Registrar en historial
     * 5. Sincronizar estado de ventas
     * 6. Disparar evento centralizado
     *
     * ✅ REDUCE DUPLICACIÓN: 4 métodos ahora reutilizan esto
     * ✅ VALIDACIÓN DINÁMICA: Desde BD, no hardcoded
     * ✅ SINCRONIZACIÓN AUTOMÁTICA: Ventas se sincronizan siempre
     * ✅ EVENTOS GARANTIZADOS: Cada cambio dispara evento
     */
    protected function cambiarEstadoNormalizado(
        Entrega $entrega,
        string $codigoEstadoNuevo,
        array $datosAdicionales = [],
        string $razon = ''
    ): Entrega {
        return $this->transaction(function () use (
            $entrega,
            $codigoEstadoNuevo,
            $datosAdicionales,
            $razon
        ) {
            // 1️⃣ Obtener estado nuevo desde BD
            $estadoNuevo = \App\Models\EstadoLogistica::where('codigo', $codigoEstadoNuevo)
                ->where('categoria', 'entrega')
                ->firstOrFail();

            // 2️⃣ Validar transición dinámicamente
            if (! $entrega->estadoEntrega->puedeTransicionarA($estadoNuevo)) {
                throw EstadoInvalidoException::transicionInvalida(
                    'Entrega',
                    $entrega->id,
                    $entrega->estadoEntrega->codigo,
                    $codigoEstadoNuevo
                );
            }

            // 3️⃣ Guardar estado anterior para sincronización
            $estadoAnterior = $entrega->estadoEntrega;

            // 4️⃣ Actualizar entrega (FK normalizado + ENUM legacy)
            $entrega->update([
                'estado_entrega_id' => $estadoNuevo->id,
                'estado'            => $codigoEstadoNuevo, // Mantener ENUM para retrocompatibilidad
                 ...$datosAdicionales,
            ]);

            // 5️⃣ Registrar en historial
            $this->registrarCambioEstado(
                $entrega,
                $estadoAnterior->codigo,
                $codigoEstadoNuevo,
                $razon
            );

            // 6️⃣ Sincronizar estado de ventas automáticamente
            $this->sincronizador->alCambiarEstadoEntrega(
                $entrega,
                $estadoAnterior->codigo,
                $codigoEstadoNuevo
            );

            // 7️⃣ Disparar evento centralizado
            event(new \App\Events\EntregaEstadoCambiado(
                $entrega,
                $estadoAnterior,
                $estadoNuevo,
                $razon
            ));

            return $entrega->refresh();
        });
    }

    /**
     * Crear entregas desde una venta
     *
     * Se ejecuta después de que la venta es aprobada
     */
    public function crearDesdeVenta(Venta $venta): array
    {
        $entregas = $this->transaction(function () use ($venta) {
            $entregas = [];

            // Si la venta no requiere entrega (venta mostrador), no crear
            if (! $venta->requiere_envio) {
                return $entregas;
            }

            // Crear una entrega por cada dirección de entrega
            $direccion = $venta->direccion_entrega;

            // Obtener el estado inicial PREPARACION_CARGA desde estados_logistica
            $estadoInicial = \App\Models\EstadoLogistica::where('codigo', 'PREPARACION_CARGA')
                ->where('categoria', 'entrega')
                ->first();

            if (! $estadoInicial) {
                Log::error('❌ Estado PREPARACION_CARGA no encontrado en estados_logistica', [
                    'venta_id' => $venta->id,
                ]);
                return $entregas;
            }

            $entrega = Entrega::create([
                'venta_id'            => $venta->id,
                'estado'              => 'PROGRAMADO',       // Mantener estado ENUM
                'estado_entrega_id'   => $estadoInicial->id, // ✅ FK a estados_logistica con ID de PREPARACION_CARGA
                'direccion'           => $direccion,
                'fecha_programada'    => $venta->fecha_entrega_programada ?? now()->addDays(3),
                'usuario_asignado_id' => Auth::id(),
            ]);

            // Registrar en historial
            $this->registrarCambioEstado(
                $entrega,
                null,
                $estadoProgramado->codigo, // ✅ Usar el estado válido
                'Entrega creada desde venta'
            );

            $entregas[] = $entrega;

            return $entregas;
        });

        $this->logSuccess('Entregas creadas desde venta', [
            'venta_id' => $venta->id,
            'entregas' => count($entregas),
        ]);

        return $entregas;
    }

    /**
     * Asignar chofer y vehículo a una entrega
     *
     * Soporta tanto estado PROGRAMADO (nuevo) como PENDIENTE (legacy)
     */
    public function asignarChoferVehiculo(
        int $entregaId,
        int $choferId,
        int $vehiculoId,
    ): EntregaResponseDTO {
        $entrega = $this->transaction(function () use (
            $entregaId,
            $choferId,
            $vehiculoId
        ) {
            $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

            // Validar transición (soporta PROGRAMADO y PENDIENTE)
            if (! in_array($entrega->estado, ['PROGRAMADO', 'PENDIENTE'])) {
                throw EstadoInvalidoException::transicionInvalida(
                    'Entrega',
                    $entregaId,
                    $entrega->estado,
                    'ASIGNADA'
                );
            }

            // Validar que chofer y vehículo existan y estén disponibles
            // chofer_id en entregas apunta a users.id (User con rol Chofer)
            $choferUser = \App\Models\User::with('empleado')->findOrFail($choferId);
            $vehiculo   = \App\Models\Vehiculo::findOrFail($vehiculoId);

            // Validar que el usuario tenga asociado un empleado (chofer)
            if (! $choferUser->empleado) {
                throw new \Exception("Usuario {$choferUser->name} no tiene datos de empleado");
            }

            $choferEmpleado = $choferUser->empleado;

            // Validar estado del chofer
            if ($choferEmpleado->estado !== 'activo') {
                throw new \Exception("Chofer {$choferEmpleado->nombre} no está activo");
            }

            // Validar licencia (si está configurada)
            if ($choferEmpleado->licencia && $choferEmpleado->fecha_vencimiento_licencia) {
                if ($choferEmpleado->fecha_vencimiento_licencia < now()) {
                    throw new \Exception("Chofer {$choferEmpleado->nombre} tiene licencia vencida");
                }
            }

            // Validar estado del vehículo (case-insensitive)
            if (strtolower($vehiculo->estado) !== 'disponible') {
                throw new \Exception("Vehículo {$vehiculo->placa} no está disponible");
            }

            // Guardar estado anterior para historial
            $estadoAnterior = $entrega->estado;

            // Actualizar entrega
            $entrega->update([
                'chofer_id'        => $choferId,
                'vehiculo_id'      => $vehiculoId,
                'estado'           => 'ASIGNADA',
                'fecha_asignacion' => now(),
            ]);

            // Registrar cambio de estado
            $this->registrarCambioEstado(
                $entrega,
                $estadoAnterior,
                'ASIGNADA',
                "Asignado chofer: {$choferEmpleado->nombre}, Vehículo: {$vehiculo->placa}"
            );

            return $entrega;
        });

        $this->logSuccess('Entrega asignada', [
            'entrega_id'  => $entregaId,
            'chofer_id'   => $choferId,
            'vehiculo_id' => $vehiculoId,
        ]);

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Iniciar entrega LEGACY - Cambiar a "EN_CAMINO"
     *
     * ⚠️ DEPRECATED: Este flujo es legacy (ASIGNADA → EN_CAMINO)
     * Para nuevas implementaciones usar iniciarTransito() que es el flujo actual:
     *   LISTO_PARA_ENTREGA → EN_TRANSITO
     *
     * El chofer inicia la ruta de entrega
     * CRÍTICO: Aquí se reduce el stock de la venta
     *
     * @deprecated Use iniciarTransito() instead (FASE 1 - nuevo flujo)
     */
    public function iniciarEntrega(int $entregaId): EntregaResponseDTO
    {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        // Lógica específica: reducir stock
        $venta = $entrega->venta;
        if ($venta && $venta->detalles && ! in_array($venta->estado, ['PENDIENTE', 'BORRADOR'], true)) {
            $this->procesarStockEntrega($entrega, 'reducir');
        }

        // Usar método centralizado para cambio de estado
        $entrega = $this->cambiarEstadoNormalizado(
            $entrega,
            'EN_CAMINO',
            ['fecha_inicio' => now()],
            'Chofer inicia ruta de entrega (LEGACY) - Stock reducido'
        );

        $this->logSuccess('Entrega iniciada (legacy) y stock reducido', ['entrega_id' => $entregaId]);

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Registrar llegada del chofer - Cambiar a "LLEGO"
     *
     * El chofer llegó a la ubicación del cliente
     * ✅ REFACTORIZADO FASE 1: Usa método centralizado
     */
    public function registrarLlegada(int $entregaId): EntregaResponseDTO
    {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        // Usar método centralizado para cambio de estado
        $entrega = $this->cambiarEstadoNormalizado(
            $entrega,
            'LLEGO',
            ['fecha_llegada' => now()],
            'Chofer llegó a ubicación del cliente'
        );

        $this->logSuccess('Llegada registrada', ['entrega_id' => $entregaId]);

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Confirmar entrega exitosa - Cambiar a "ENTREGADO"
     *
     * El cliente recibió la mercadería satisfactoriamente
     * ✅ REFACTORIZADO FASE 1: Usa método centralizado
     *
     * @param int $entregaId ID de la entrega
     * @param string|null $fotoEntregaUrl URL de la foto de la entrega
     */
    public function confirmar(
        int $entregaId,
        ?string $fotoEntregaUrl = null,
    ): EntregaResponseDTO {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        // Actualizar con registros de foto
        $datosAdicionales = [
            'fecha_entrega'    => now(),
            'foto_entrega_url' => $fotoEntregaUrl,
        ];

        // Usar método centralizado para cambio de estado
        $entrega = $this->cambiarEstadoNormalizado(
            $entrega,
            'ENTREGADO',
            $datosAdicionales,
            'Entrega confirmada por cliente - Mercadería recibida satisfactoriamente'
        );

        $this->logSuccess('Entrega confirmada', [
            'entrega_id' => $entregaId,
            'con_foto'   => $fotoEntregaUrl !== null,
        ]);

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Reportar novedad en entrega - Cambiar a "NOVEDAD"
     *
     * El chofer reporta un problema: cliente ausente, dirección incorrecta, rechazo, etc.
     * ✅ REFACTORIZADO FASE 1: Usa método centralizado
     *
     * @param int $entregaId ID de la entrega
     * @param string $motivoNovedad Descripción de la novedad
     * @param bool $devolverStock Si debe revertir el stock (default: false, solo para rechazos definitivos)
     */
    public function reportarNovedad(
        int $entregaId,
        string $motivoNovedad,
        bool $devolverStock = false,
    ): EntregaResponseDTO {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        // Lógica específica: revertir stock SOLO si es rechazo definitivo
        if ($devolverStock) {
            $venta = $entrega->venta;
            if ($venta && $venta->detalles && ! \in_array($venta->estado, ['PENDIENTE', 'BORRADOR'], true)) {
                $this->stockService->devolverStock(
                    $venta->detalles->toArray(),
                    "ENTREGA#{$entregaId}-NOVEDAD",
                    $venta->almacen_id ?? null
                );
            }
        }

        // Usar método centralizado para cambio de estado
        $entrega = $this->cambiarEstadoNormalizado(
            $entrega,
            'NOVEDAD',
            ['motivo_novedad' => $motivoNovedad],
            "Novedad reportada: {$motivoNovedad}"
        );

        $this->logSuccess('Novedad reportada', [
            'entrega_id'      => $entregaId,
            'motivo'          => $motivoNovedad,
            'stock_revertido' => $devolverStock,
        ]);

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Rechazar entrega (legacy - compatibility)
     *
     * @deprecated Use reportarNovedad() instead
     */
    public function rechazar(int $entregaId, string $razon): EntregaResponseDTO
    {
        return $this->reportarNovedad($entregaId, $razon, devolverStock: true);
    }

    /**
     * Obtener una entrega
     */
    public function obtener(int $entregaId): EntregaResponseDTO
    {
        $entrega = Entrega::with([
            'venta',
            'chofer',
            'vehiculo',
            'ubicaciones',
        ])->findOrFail($entregaId);

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Optimizar asignación de múltiples entregas usando FFD + Nearest Neighbor
     *
     * Este método agrupa entregas por capacidad de vehículo y optimiza rutas por distancia
     *
     * @param array $entregaIds IDs de entregas a asignar
     * @param float $capacidadMaxVehiculo Capacidad estándar de vehículos (kg)
     * @return array ['rutas' => [...], 'estadisticas' => [...]]
     */
    public function optimizarAsignacionMasiva(array $entregaIds, float $capacidadMaxVehiculo = 1000): array
    {
        // Cargar entregas con relaciones necesarias
        $entregas = Entrega::with(['ventas.cliente', 'ventas.direccionCliente'])
            ->whereIn('id', $entregaIds)
            ->whereIn('estado', ['PROGRAMADO', 'PENDIENTE'])
            ->get();

        if ($entregas->isEmpty()) {
            return [
                'rutas'        => [],
                'estadisticas' => [
                    'total_entregas' => 0,
                    'rutas_creadas'  => 0,
                ],
            ];
        }

        // Preparar datos para algoritmo
        $entregasParaOptimizar = $entregas->map(function ($entrega) {
            $primeraVenta = $entrega->ventas?->first();
            $direccion    = $primeraVenta?->direccionCliente ?? null;

            return [
                'id'         => $entrega->id,
                'entrega_id' => $entrega->id,
                'venta_id'   => $primeraVenta?->id,
                'cliente_id' => $primeraVenta?->cliente_id,
                'peso'       => $entrega->peso_kg ?? 10, // Default 10kg si no está configurado
                'peso_kg'    => $entrega->peso_kg ?? 10,
                'lat'        => $direccion?->latitud ?? -17.3895, // Default: Cochabamba centro
                'lon'        => $direccion?->longitud ?? -66.1568,
                'direccion'  => $primeraVenta?->direccion ?? $direccion?->direccion ?? 'Sin dirección',
            ];
        })->toArray();

        // Ejecutar optimización
        $resultado = $this->rutaOptimizer->optimizarMultiplesRutas(
            $entregasParaOptimizar,
            $capacidadMaxVehiculo
        );

        // Agregar información adicional a cada ruta
        foreach ($resultado['rutas'] as &$ruta) {
            $ruta['entregas_ids']        = array_column($ruta['ruta'], 'entrega_id');
            $ruta['sugerencia_vehiculo'] = $this->sugerirVehiculo($ruta['peso_total_bin']);
            $ruta['sugerencia_chofer']   = $this->sugerirChofer();
        }
        unset($ruta);

        return $resultado;
    }

    /**
     * Sugerir vehículo basado en peso total
     */
    private function sugerirVehiculo(float $pesoTotal): ?array
    {
        $vehiculo = \App\Models\Vehiculo::where('estado', 'disponible')
            ->where('capacidad_kg', '>=', $pesoTotal)
            ->orderBy('capacidad_kg', 'asc')
            ->first();

        if (! $vehiculo) {
            return null;
        }

        return [
            'id'           => $vehiculo->id,
            'placa'        => $vehiculo->placa,
            'marca'        => $vehiculo->marca,
            'modelo'       => $vehiculo->modelo,
            'capacidad_kg' => $vehiculo->capacidad_kg,
        ];
    }

    /**
     * Sugerir chofer disponible
     *
     * Retorna un empleado (chofer) activo con licencia válida
     * El 'id' retornado es el user_id (para asignar a chofer_id en entregas)
     */
    private function sugerirChofer(): ?array
    {
        $chofer = \App\Models\Empleado::with('user')
            ->where('estado', 'activo')
            ->whereNotNull('licencia')
            ->where(function ($q) {
                $q->whereNull('fecha_vencimiento_licencia')
                    ->orWhere('fecha_vencimiento_licencia', '>=', now());
            })
            ->first();

        if (! $chofer || ! $chofer->user) {
            return null;
        }

        return [
            'id'       => $chofer->user_id, // Retornar user_id, no empleado.id
            'nombre'   => $chofer->nombre,
            'licencia' => $chofer->licencia,
        ];
    }

    /**
     * Validar si una transición de estado es válida
     *
     * @throws EstadoInvalidoException
     */
    private function validarTransicion(string $estadoActual, string $estadoNuevo): void
    {
        $permitidas = self::$transicionesValidas[$estadoActual] ?? [];

        if (! \in_array($estadoNuevo, $permitidas, true)) {
            throw EstadoInvalidoException::transicionInvalida(
                'Entrega',
                0,
                $estadoActual,
                $estadoNuevo
            );
        }
    }

    /**
     * Registrar cambio de estado en historial
     *
     * IMPORTANTE: Se ejecuta DENTRO de una transacción
     */
    private function registrarCambioEstado(
        Entrega $entrega,
        ?string $estadoAnterior,
        string $estadoNuevo,
        string $razon = '',
    ): EntregaEstadoHistorial {
        // Para operaciones en lote, no asignamos usuario_id ya que es una operación del sistema
        // El campo es nullable, así evitamos validaciones que podrían fallar dentro de una transacción

        return EntregaEstadoHistorial::create([
            'entrega_id'      => $entrega->id,
            'estado_anterior' => $estadoAnterior,
            'estado_nuevo'    => $estadoNuevo,
            'comentario'      => $razon,
            'usuario_id'      => null,
        ]);
    }

    /**
     * Procesar stock para una entrega (reducir o restaurar)
     *
     * ⚠️ CRÍTICO: Se ejecuta DENTRO de una transacción
     *
     * @param Entrega $entrega Entrega a procesar
     * @param string $operacion 'reducir' o 'restaurar'
     */
    private function procesarStockEntrega(Entrega $entrega, string $operacion): void
    {
        $venta = $entrega->venta;
        if (! $venta || ! $venta->detalles) {
            return;
        }

        // Mapear detalles de venta a formato esperado por StockService
        $productos = $venta->detalles->map(function ($detalle) {
            return [
                'producto_id' => $detalle->producto_id,
                'cantidad'    => $detalle->cantidad,
            ];
        })->toArray();

        // Usar número de entrega como referencia
        $referencia = "ENTREGA#{$entrega->id}";

        // Obtener almacén para esta entrega
        $almacenId = $this->obtenerAlmacenParaEntrega($entrega);

        // Ejecutar operación
        if ($operacion === 'reducir') {
            $this->stockService->procesarSalidaVenta($productos, $referencia, $almacenId);
            $this->logSuccess('Stock reducido para entrega', [
                'entrega_id' => $entrega->id,
                'venta_id'   => $venta->id,
                'almacen_id' => $almacenId,
            ]);
        } elseif ($operacion === 'restaurar') {
            $this->stockService->devolverStock($productos, $referencia, $almacenId);
            $this->logSuccess('Stock restaurado para entrega', [
                'entrega_id' => $entrega->id,
                'venta_id'   => $venta->id,
                'almacen_id' => $almacenId,
            ]);
        }
    }

    /**
     * Crear entregas en lote desde múltiples ventas
     *
     * FASE 2: Creación masiva optimizada
     *
     * Flujo:
     * 1. Crear entregas para cada venta
     * 2. Asignar chofer y vehículo
     * 3. Opcionalmente optimizar rutas
     * 4. Retornar entregas creadas con información de optimización
     *
     * @param array $ventaIds IDs de ventas a procesar
     * @param int $vehiculoId ID del vehículo a usar
     * @param int $choferId ID del chofer a usar
     * @param bool $optimizar Si debe optimizar rutas (genera sugerencias)
     * @return array ['entregas' => [...], 'optimizacion' => [...], 'estadisticas' => [...]]
     */
    public function crearLote(
        array $ventaIds,
        int $vehiculoId,
        int $choferId,
        bool $optimizar = true,
        string $tipoReporte = 'individual',
        ?string $fechaProgramada = null,
        ?string $direccionEntrega = null
    ): array {
        $resultado = $this->transaction(function () use ($ventaIds, $vehiculoId, $choferId, $optimizar, $tipoReporte) {
            $entregasCreadas = collect(); // Usar Collection en lugar de array para acceso a métodos como count() y isEmpty()
            $errores         = [];

            // Validar vehículo y chofer
            $vehiculo = \App\Models\Vehiculo::findOrFail($vehiculoId);
            // ✅ CORREGIDO: Cargar User (chofer_id apunta a users.id) con su empleado
            $choferUser = \App\Models\User::with('empleado')->findOrFail($choferId);

            // Validar que el usuario tenga asociado un empleado
            if (! $choferUser->empleado) {
                throw new \Exception("Usuario {$choferUser->name} no tiene datos de empleado");
            }

            $choferEmpleado = $choferUser->empleado;

            // Validar estado del vehículo (case-insensitive)
            if (strtolower($vehiculo->estado) !== 'disponible') {
                throw new \Exception("Vehículo {$vehiculo->placa} no está disponible");
            }

            if ($choferEmpleado->estado !== 'activo') {
                throw new \Exception("Chofer {$choferEmpleado->nombre} no está activo");
            }

            // 1. Crear entregas desde ventas
            foreach ($ventaIds as $ventaId) {
                try {
                    $venta = Venta::with('direccionCliente')->findOrFail($ventaId);

                    // Obtener el estado inicial PROGRAMADO desde estados_logistica
                    $estadoProgramado = \App\Models\EstadoLogistica::where('codigo', 'PROGRAMADO')
                        ->where('categoria', 'entrega')
                        ->first();

                    // Crear una entrega por venta con todos los datos disponibles
                    // ✅ CORREGIDO: Removido 'usuario_asignado_id' que no existe en el modelo
                    // ✅ UNIFICACIÓN: Usar parámetros opcionales si se proporcionan (para caso single)
                    $entrega = Entrega::create([
                        'venta_id'             => $venta->id,
                        'estado'               => 'PROGRAMADO',
                        'estado_entrega_id'    => $estadoProgramado?->id, // ✅ FK a estados_logistica
                        'direccion_entrega'    => $direccionEntrega ?? $venta->direccion_entrega ?? $venta->direccionCliente?->direccion,
                        'direccion_cliente_id' => $venta->direccion_cliente_id,
                        'fecha_programada'     => $fechaProgramada ?? $venta->fecha_entrega_programada ?? now()->addDays(3),
                        'peso_kg'              => $venta->detalles->sum(fn($det) => $det->cantidad * 2) ?? 10,
                        'chofer_id'            => $choferId,
                        'vehiculo_id'          => $vehiculoId,
                    ]);

                    // Registrar en historial
                    $this->registrarCambioEstado(
                        $entrega,
                        null,
                        'PROGRAMADO',
                        'Entrega creada en lote'
                    );

                    // ✨ NUEVO: Disparar evento EntregaAsignada para notificar al chofer vía WebSocket
                    try {
                        event(new \App\Events\EntregaAsignada($entrega));

                        $this->logSuccess('Evento EntregaAsignada disparado - Notificación enviada al chofer', [
                            'entrega_id' => $entrega->id,
                            'numero_entrega' => $entrega->numero_entrega,
                            'chofer_id' => $choferId,
                        ]);
                    } catch (\Exception $e) {
                        $this->logError('Error disparando evento EntregaAsignada (continuando con creación)', [
                            'entrega_id' => $entrega->id,
                            'chofer_id' => $choferId,
                            'error' => $e->getMessage(),
                        ]);
                        // Continuar sin fallar, la entrega ya se creó correctamente
                    }

                    // FASE 3: Generar reporte individual si tipo_reporte === 'individual'
                    if ($tipoReporte === 'individual') {
                        try {
                            $reporte = $this->reporteCargoService->generarReporteDesdeEntrega(
                                $entrega,
                                [
                                    'vehiculo_id'   => $vehiculoId,
                                    'descripcion'   => "Reporte automático - Batch individual",
                                    'peso_total_kg' => $entrega->peso_kg,
                                ]
                            );

                            $this->logSuccess('Reporte individual generado', [
                                'entrega_id' => $entrega->id,
                                'reporte_id' => $reporte->id,
                            ]);
                        } catch (\Exception $e) {
                            // Log error pero continuar con las demás entregas
                            $this->logError('Error generando reporte individual', [
                                'entrega_id' => $entrega->id,
                                'error'      => $e->getMessage(),
                            ]);

                            $errores[] = [
                                'entrega_id' => $entrega->id,
                                'error'      => "Reporte no generado: {$e->getMessage()}",
                            ];
                        }
                    }

                    $entregasCreadas->push($entrega);
                } catch (\Exception $e) {
                    $errores[] = [
                        'venta_id' => $ventaId,
                        'error'    => $e->getMessage(),
                    ];
                }
            }

            // FASE 3: Generar reporte consolidado si tipo_reporte === 'consolidado'
            if ($tipoReporte === 'consolidado' && ! $entregasCreadas->isEmpty()) {
                try {
                    $reporteConsolidado = $this->reporteCargoService->generarReporteConsolidado(
                        $entregasCreadas->toArray(),
                        [
                            'vehiculo_id' => $vehiculoId,
                            'descripcion' => "Reporte consolidado - Batch ({$entregasCreadas->count()} entregas)",
                        ]
                    );

                    $this->logSuccess('Reporte consolidado generado', [
                        'reporte_id'     => $reporteConsolidado->id,
                        'entregas_count' => $entregasCreadas->count(),
                    ]);

                    // Agregar reporte_consolidado a la respuesta
                    // Se agregaré a la respuesta después de crear la respuesta base
                } catch (\Exception $e) {
                    $this->logError('Error generando reporte consolidado', [
                        'error' => $e->getMessage(),
                    ]);

                    $errores[] = [
                        'tipo'  => 'reporte_consolidado',
                        'error' => "Reporte consolidado no generado: {$e->getMessage()}",
                    ];
                }
            }

            // 2. Preparar respuesta
            $respuesta = [
                'entregas'     => $entregasCreadas,
                'estadisticas' => [
                    'total_creadas' => count($entregasCreadas),
                    'total_errores' => count($errores),
                    'peso_total'    => $entregasCreadas->sum('peso_kg'),
                    'vehiculo'      => [
                        'id'           => $vehiculo->id,
                        'placa'        => $vehiculo->placa,
                        'capacidad_kg' => $vehiculo->capacidad_kg,
                    ],
                    'chofer'        => [
                        'id'     => $choferUser->id,
                        'nombre' => $choferEmpleado->nombre,
                    ],
                ],
                'errores'      => $errores,
            ];

            // 3. Si se solicita optimización, calcular sugerencias de rutas
            if ($optimizar && ! $entregasCreadas->isEmpty()) {
                $entregaIds                = $entregasCreadas->pluck('id')->toArray();
                $optimizacion              = $this->optimizarAsignacionMasiva($entregaIds, $vehiculo->capacidad_kg);
                $respuesta['optimizacion'] = $optimizacion;
            }

            return $respuesta;
        });

        $this->logSuccess('Entregas en lote creadas - Notificaciones WebSocket enviadas', [
            'total'                => count($resultado['entregas']),
            'vehiculo_id'          => $vehiculoId,
            'chofer_id'            => $choferId,
            'eventos_disparados'   => count($resultado['entregas']),  // Eventos EntregaAsignada disparados
        ]);

        return $resultado;
    }

    /**
     * Obtener el almacén a usar para una entrega
     *
     * Prioridad:
     * 1. Almacén asociado a la venta
     * 2. Almacén principal configurado en sistema
     * 3. Primer almacén activo (fallback)
     *
     * @param Entrega $entrega
     * @return int ID del almacén
     */
    private function obtenerAlmacenParaEntrega(Entrega $entrega): int
    {
        // 1. Intentar obtener almacén de la venta
        $venta = $entrega->venta;
        if ($venta && isset($venta->almacen_id) && $venta->almacen_id) {
            return $venta->almacen_id;
        }

        // 2. Obtener almacén principal desde configuración
        $almacenPrincipalId = config('inventario.almacen_principal_id');
        if ($almacenPrincipalId) {
            return $almacenPrincipalId;
        }

        // 3. Fallback: primer almacén activo
        $almacen = \App\Models\Almacen::where('activo', true)->first();

        return $almacen ? $almacen->id : 1;
    }

    /**
     * Confirmar carga de una entrega (cambiar a EN_CARGA)
     *
     * Se ejecuta después de que el reporte de carga ha sido confirmado
     * Indica que la carga física está en progreso
     *
     * @param int $entregaId ID de la entrega
     * @return EntregaResponseDTO
     * @throws EstadoInvalidoException
     */
    public function confirmarCarga(int $entregaId): EntregaResponseDTO
    {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        // Cambiar a LISTO_PARA_ENTREGA (desde PREPARACION_CARGA o EN_CARGA)
        $entrega = $this->cambiarEstadoNormalizado(
            $entrega,
            Entrega::ESTADO_LISTO_PARA_ENTREGA,
            [
                'confirmado_carga_por'     => Auth::id(),
                'fecha_confirmacion_carga' => now(),
            ],
            'Carga confirmada - Listo para entrega'
        );

        // Recargar relaciones para WebSocket
        $entrega->load(['chofer', 'ventas.cliente', 'confirmadorCarga']);

        $this->logSuccess('Carga confirmada', ['entrega_id' => $entregaId]);

        // Notificar por WebSocket a chofer y cliente
        try {
            $this->webSocketService->notifyCargoConfirmado($entrega);
        } catch (\Exception $e) {
            $this->logError('Error enviando notificación WebSocket de carga confirmada', [
                'entrega_id' => $entregaId,
                'error'      => $e->getMessage(),
            ]);
        }

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Marcar entrega como lista para partida (después de completar carga)
     *
     * Transición: EN_CARGA → LISTO_PARA_ENTREGA
     * Indica que la carga está completa y lista para que el chofer inicie viaje
     *
     * @param int $entregaId ID de la entrega
     * @return EntregaResponseDTO
     * @throws EstadoInvalidoException
     */
    public function marcarListoParaEntrega(int $entregaId): EntregaResponseDTO
    {
        $entrega = $this->transaction(function () use ($entregaId) {
            $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

            // ✅ NUEVA LÓGICA: Aceptar PREPARACION_CARGA o EN_CARGA
            // El flujo ahora es: PREPARACION_CARGA → LISTO_PARA_ENTREGA
            // (antes era: EN_CARGA → LISTO_PARA_ENTREGA)
            $estadosValidos = [
                Entrega::ESTADO_PREPARACION_CARGA,
                Entrega::ESTADO_EN_CARGA,
            ];

            if (! in_array($entrega->estado, $estadosValidos)) {
                throw EstadoInvalidoException::transicionInvalida(
                    'Entrega',
                    $entregaId,
                    $entrega->estado,
                    Entrega::ESTADO_LISTO_PARA_ENTREGA
                );
            }

            $estadoAnterior = $entrega->estado;

            // Obtener el ID del estado LISTO_PARA_ENTREGA (ID 20)
            $estadoListoParaEntregaId = \App\Models\EstadoLogistica::where('codigo', 'LISTO_PARA_ENTREGA')
                ->where('categoria', 'entrega')
                ->value('id');

            if (! $estadoListoParaEntregaId) {
                throw new \Exception('Estado LISTO_PARA_ENTREGA no encontrado en tabla estados_logistica');
            }

            // ✅ Actualizar a LISTO_PARA_ENTREGA usando estado_entrega_id (FK normalizad)
            // También mantener el ENUM legacy por compatibilidad
            $entrega->update([
                'estado'            => Entrega::ESTADO_LISTO_PARA_ENTREGA,
                'estado_entrega_id' => $estadoListoParaEntregaId,
            ]);

            \Log::info('✅ [LISTO_ENTREGA] Entrega marcada como LISTO_PARA_ENTREGA', [
                'entrega_id'        => $entrega->id,
                'estado_anterior'   => $estadoAnterior,
                'estado_entrega_id' => $estadoListoParaEntregaId,
            ]);

            $this->registrarCambioEstado(
                $entrega,
                $estadoAnterior,
                Entrega::ESTADO_LISTO_PARA_ENTREGA,
                'Carga completada - Entrega lista para partida'
            );

            // ✅ NUEVO: Cambiar estado logístico de ventas de EN_PREPARACION a PENDIENTE_ENVIO
            // IMPORTANTE: Usar estado_logistico_id (FK a estados_logistica) en lugar de estado_logistico (string)

            // 1. Obtener ID del estado EN_PREPARACION (categoría: venta_logistica)
            $estadoEnPreparacionId = \App\Models\EstadoLogistica::where('codigo', 'EN_PREPARACION')
                ->where('categoria', 'venta_logistica')
                ->value('id');

            // 2. Obtener ID del estado PENDIENTE_ENVIO (categoría: venta_logistica)
            $estadoPendienteEnvioId = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE_ENVIO')
                ->where('categoria', 'venta_logistica')
                ->value('id');

            if (!$estadoEnPreparacionId || !$estadoPendienteEnvioId) {
                throw new \Exception('Estados EN_PREPARACION o PENDIENTE_ENVIO no encontrados en tabla estados_logistica (categoría: venta_logistica)');
            }

            // 3. Actualizar ventas usando estado_logistico_id
            // ✅ IMPORTANTE: Solo actualizar estado_logistico_id (FK a estados_logistica)
            // NO actualizar estado_logistico (esa columna NO existe en tabla ventas)
            $ventasActualizadas = $entrega->ventas()
                ->where('estado_logistico_id', $estadoEnPreparacionId)
                ->update([
                    'estado_logistico_id' => $estadoPendienteEnvioId,
                    'updated_at'          => now(),
                ]);

            \Log::info('✅ [LISTO_ENTREGA] Estados logísticos de ventas actualizados a PENDIENTE_ENVIO', [
                'entrega_id'           => $entrega->id,
                'cantidad_actualizadas' => $ventasActualizadas,
                'estado_logistico_id'  => $estadoPendienteEnvioId,
                'estado_anterior_id'   => $estadoEnPreparacionId,
            ]);

            // Recargar relaciones para WebSocket
            $entrega->load(['chofer', 'ventas.cliente', 'vehiculo']);

            return $entrega;
        });

        $this->logSuccess('Entrega marcada como lista para partida', ['entrega_id' => $entregaId]);

        // ✅ NOTA: Las notificaciones son manejadas automáticamente por EntregaObserver::updated()
        // El Observer dispara automáticamente:
        // - notifyEstadoSincronizado() para notificar a clientes y preventistas
        // - notifyEstadoConValidacionSLA() para validaciones especiales

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Iniciar tránsito de entrega con coordenadas GPS (cambiar a EN_TRANSITO)
     *
     * FLUJO PRINCIPAL FASE 1:
     * - Estado anterior: LISTO_PARA_ENTREGA
     * - Estado nuevo: EN_TRANSITO
     * - GPS: Captura ubicación inicial
     * - Sincronización: Ventas pasan a EN_TRANSITO automáticamente
     *
     * ✅ REFACTORIZADO FASE 1: Usa método centralizado + validación dinámica
     *
     * Se ejecuta cuando el chofer presiona "Iniciar Entrega" en la app
     * Requiere ubicación GPS inicial del chofer
     *
     * @param int $entregaId ID de la entrega
     * @param float $latitud Latitud inicial del chofer
     * @param float $longitud Longitud inicial del chofer
     * @return EntregaResponseDTO
     * @throws EstadoInvalidoException
     */
    public function iniciarTransito(int $entregaId, float $latitud, float $longitud): EntregaResponseDTO
    {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        // Usar método centralizado para cambio de estado con validación dinámica
        $entrega = $this->cambiarEstadoNormalizado(
            $entrega,
            'EN_TRANSITO',
            [
                'latitud_actual'         => $latitud,
                'longitud_actual'        => $longitud,
                'fecha_ultima_ubicacion' => now(),
            ],
            "Chofer iniciando tránsito - Ubicación inicial: ({$latitud}, {$longitud})"
        );

        $this->logSuccess('Entrega iniciada en tránsito', [
            'entrega_id' => $entregaId,
            'latitud'    => $latitud,
            'longitud'   => $longitud,
        ]);

        // Recargar relaciones para WebSocket
        $entrega->load(['chofer', 'ventas.cliente', 'vehiculo']);

        // Notificar por WebSocket a chofer y cliente
        try {
            $this->webSocketService->notifyInicioTransito($entrega, $latitud, $longitud);
        } catch (\Exception $e) {
            $this->logError('Error enviando notificación WebSocket de inicio de tránsito', [
                'entrega_id' => $entregaId,
                'error'      => $e->getMessage(),
            ]);
        }

        return EntregaResponseDTO::fromModel($entrega);
    }

    /**
     * Actualizar ubicación GPS actual de una entrega en tránsito
     *
     * @param int $entregaId ID de la entrega
     * @param float $latitud Latitud actual
     * @param float $longitud Longitud actual
     * @return void
     */
    public function actualizarUbicacionGPS(int $entregaId, float $latitud, float $longitud): void
    {
        $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

        if ($entrega->estado === Entrega::ESTADO_EN_TRANSITO) {
            $entrega->update([
                'latitud_actual'         => $latitud,
                'longitud_actual'        => $longitud,
                'fecha_ultima_ubicacion' => now(),
            ]);

            $this->logSuccess('Ubicación GPS actualizada', [
                'entrega_id' => $entregaId,
                'latitud'    => $latitud,
                'longitud'   => $longitud,
            ]);

            // Notificar por WebSocket a cliente sobre actualización de ubicación
            try {
                $this->webSocketService->notifyActualizacionUbicacion($entrega, $latitud, $longitud);
            } catch (\Exception $e) {
                $this->logError('Error enviando notificación WebSocket de actualización de ubicación', [
                    'entrega_id' => $entregaId,
                    'error'      => $e->getMessage(),
                ]);
            }
        }
    }
}
