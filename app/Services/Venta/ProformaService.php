<?php
namespace App\Services\Venta;

use App\DTOs\Venta\CrearProformaDTO;
use App\DTOs\Venta\ProformaResponseDTO;
use App\Events\ProformaRechazada;
use App\Exceptions\Caja\CajaNoAbiertaException;
use App\Exceptions\Stock\StockInsuficientException;
use App\Exceptions\Venta\EstadoInvalidoException;
use App\Models\Cliente;
use App\Models\DetalleProforma;
use App\Models\Proforma;
use App\Services\Reservas\ReservaDistribucionService;
use App\Services\Stock\StockService;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ProformaService - ÚNICA FUENTE DE VERDAD para Proformas
 *
 * RESPONSABILIDADES:
 * ✓ Crear proformas (con reserva de stock)
 * ✓ Aprobar proformas (mantiene reserva)
 * ✓ Rechazar proformas (libera reserva)
 * ✓ Convertir a venta (consume reserva)
 * ✓ Extender validez
 * ✓ Validar disponibilidad
 *
 * INVARIANTE: Reserva de stock SÍ se maneja aquí
 *
 * FLUJO DE ESTADOS:
 * PENDIENTE → APROBADA → CONVERTIDA (a Venta)
 *         ↘ RECHAZADA
 *         ↘ VENCIDA
 */
class ProformaService
{
    use ManagesTransactions, LogsOperations;

    private static array $transicionesValidas = [
        'PENDIENTE'  => ['APROBADA', 'RECHAZADA'],
        'APROBADA'   => ['CONVERTIDA', 'RECHAZADA'],
        'CONVERTIDA' => [],
        'RECHAZADA'  => [],
        'VENCIDA'    => [],
    ];

    public function __construct(
        private StockService $stockService,
        private VentaService $ventaService,
    ) {}

    /**
     * ✅ NUEVO: Obtener ID del tipo de precio por defecto (VENTA)
     *
     * Centraliza la lógica para obtener el tipo_precio_id por defecto
     * que se usa cuando:
     * - Creando una nueva proforma (create)
     * - Editando una proforma (edit)
     * - Mostrando detalles (show)
     *
     * Si un detalle_proforma NO tiene tipo_precio_id asignado,
     * se usa este default para pre-seleccionar el tipo de precio en el frontend
     *
     * @return int ID del tipo_precio con codigo='VENTA', o 1 como fallback
     */
    public function obtenerIdTipoPrecioDefault(): int
    {
        // Obtener el tipo_precio con codigo 'VENTA'
        $tipoPrecioVenta = \App\Models\TipoPrecio::porCodigo('VENTA');

        if ($tipoPrecioVenta) {
            return $tipoPrecioVenta->id;
        }

        // Fallback: retornar el primer tipo_precio activo
        $tipoPrecioFallback = \App\Models\TipoPrecio::activos()
            ->orderBy('orden', 'asc')
            ->first();

        return $tipoPrecioFallback?->id ?? 1;
    }

    /**
     * Listar proformas con filtros
     */
    public function listar(int $perPage = 15, array $filtros = [])
    {
        $query = Proforma::query();

        // Filtrar por estado
        if (! empty($filtros['estado'])) {
            $query->where('estado', $filtros['estado']);
        }

        // Filtrar por cliente
        if (! empty($filtros['cliente_id'])) {
            $query->where('cliente_id', $filtros['cliente_id']);
        }

        // Buscar por número o cliente
        if (! empty($filtros['q'])) {
            $search = $filtros['q'];
            $query->where(function ($q) use ($search) {
                $q->where('numero', 'like', "%{$search}%")
                    ->orWhereHas('cliente', function ($q) use ($search) {
                        $q->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        return $query->with([
                'cliente',           // Relación con cliente
                'detalles',          // Detalles de productos
                'usuarioCreador',    // ✅ NUEVO: Usuario que creó la proforma
                'estadoLogistica',   // ✅ NUEVO: Estado actual de la proforma (desde estados_logistica tabla con categoria='proforma')
                'venta',             // ✅ NUEVO: Venta asociada cuando proforma está CONVERTIDA
            ])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Crear una proforma
     *
     * FLUJO:
     * 1. Validar stock disponible
     * 2. Crear proforma
     * 3. Crear detalles
     * 4. RESERVAR stock (diferencia clave con Venta)
     * 5. Emitir evento ProformaCreada
     *
     * @throws StockInsuficientException
     */
    public function crear(CrearProformaDTO $dto): ProformaResponseDTO
    {
        // ✅ CERTIFICACIÓN: Usuario autenticado actual
        $usuarioCreadorId = Auth::id();
        if (!$usuarioCreadorId) {
            throw new \Exception('Usuario autenticado requerido para crear proforma');
        }

        // 1. Validar datos
        $dto->validarDetalles();

        // 2. Validar política de pago (si es CREDITO, validar permisos del cliente)
        if ($dto->politica_pago === Proforma::POLITICA_CREDITO) {
            $cliente = Cliente::findOrFail($dto->cliente_id);

            if (! $cliente->puede_tener_credito) {
                throw new \Exception(
                    "El cliente '{$cliente->nombre}' no tiene permiso para solicitar crédito"
                );
            }

            if (! $cliente->limite_credito || $cliente->limite_credito <= 0) {
                throw new \Exception(
                    "El cliente '{$cliente->nombre}' no tiene límite de crédito configurado"
                );
            }
        }

        // 3. Validar stock ANTES de transacción (SOLO si NO es BORRADOR)
        // 🔧 Usar almacén del usuario autenticado (consistencia con convertirAVenta)
        $almacenId  = auth()->user()?->empresa?->almacen_id ?? 2;

        // ✅ BORRADOR: No validar stock ya que es solo para verificar totales
        // ✅ PENDIENTE: Validar stock para asegurar disponibilidad
        if ($dto->estado_inicial !== 'BORRADOR') {
            // ✅ COMBO: Expandir combos a sus componentes ANTES de validar (OPCIÓN 2 - stock de componentes solo)
            // $dto->detalles se preserva sin cambios para DetalleProforma
            $detallesParaValidacion = $this->stockService->expandirCombos($dto->detalles);

            $validacion = $this->stockService->validarDisponible(
                $detallesParaValidacion,
                $almacenId
            );

            if (! $validacion->esValida()) {
                throw StockInsuficientException::create($validacion->detalles);
            }
        }

        // 3. Crear dentro de transacción
        $proforma = $this->transaction(function () use ($dto, $almacenId, $usuarioCreadorId) {
            // 3.1 Obtener el estado inicial (BORRADOR o PENDIENTE)
            $estadoInicial = \App\Models\EstadoLogistica::where('codigo', $dto->estado_inicial ?? 'BORRADOR')
                ->where('categoria', 'proforma')
                ->where('activo', true)
                ->first();

            // Fallback a BORRADOR si no existe el estado
            if (!$estadoInicial) {
                $estadoInicial = \App\Models\EstadoLogistica::where('codigo', 'BORRADOR')
                    ->where('categoria', 'proforma')
                    ->first();
            }

            // ✅ NUEVO (2026-04-06): Debug log para verificar preventista_id
            Log::debug('🔍 [ProformaService::crear] DTO recibido', [
                'preventista_id' => $dto->preventista_id,
                'requiere_envio' => $dto->requiere_envio,
                'tipo_entrega' => $dto->tipo_entrega,
                'canal_origen' => $dto->canal_origen,
            ]);

            // 3.2 Crear Proforma
            $proforma = Proforma::create([
                'numero'             => $this->generarNumero(),
                'cliente_id'         => $dto->cliente_id,
                'usuario_creador_id' => $usuarioCreadorId,  // ✅ Usuario que crea
                'preventista_id'     => $dto->preventista_id,  // ✅ NUEVO: Preventista asignado
                'fecha'              => $dto->fecha,
                'fecha_vencimiento'  => $dto->fecha_vencimiento,
                'subtotal'           => $dto->subtotal,
                'impuesto'           => $dto->impuesto,
                'total'              => $dto->total,
                'estado_proforma_id' => $estadoInicial->id,  // ✅ Estado elegido por usuario
                'observaciones'      => $dto->observaciones,
                'canal_origen'       => $dto->canal_origen ?? 'WEB',  // ✅ CORREGIDO (2026-04-06): Usar canal_origen
                'politica_pago'      => $dto->politica_pago ?? 'CONTRA_ENTREGA',
                'moneda_id'          => 1, // ✅ Bolivianos por defecto
                // ✅ NUEVOS CAMPOS (2026-04-06): Detalles de envío
                'requiere_envio'     => $dto->requiere_envio ?? false,
                'fecha_entrega_solicitada' => $dto->fecha_entrega_solicitada,
                'hora_entrega_solicitada' => $dto->hora_entrega_solicitada,
                'hora_entrega_solicitada_fin' => $dto->hora_entrega_solicitada_fin,
                'tipo_entrega'       => $dto->tipo_entrega ?? 'DELIVERY',
                'direccion_entrega_solicitada_id' => $dto->direccion_entrega_solicitada_id,
            ]);

            // 3.3 Crear detalles
            foreach ($dto->detalles as $detalle) {
                // ✅ NUEVO: Preparar combo_items_seleccionados (mismo patrón que VentaService)
                $comboItemsSeleccionados = null;
                if (isset($detalle['combo_items_seleccionados']) && is_array($detalle['combo_items_seleccionados'])) {
                    // Filtrar solo items que están incluidos (incluido = true)
                    $comboItemsSeleccionados = array_filter($detalle['combo_items_seleccionados'], function($item) {
                        return ($item['incluido'] ?? false) === true;
                    });
                    // Reindexar array después de filter
                    $comboItemsSeleccionados = array_values($comboItemsSeleccionados);

                    Log::debug('📦 [ProformaService::crear] Items del combo seleccionados', [
                        'producto_id' => $detalle['producto_id'],
                        'cantidad_items_seleccionados' => count($comboItemsSeleccionados),
                        'total_items' => count($detalle['combo_items_seleccionados']),
                    ]);
                }

                DetalleProforma::create([
                    'proforma_id'     => $proforma->id,
                    'producto_id'     => $detalle['producto_id'],
                    'cantidad'        => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal'        => $detalle['cantidad'] * $detalle['precio_unitario'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'] ?? null,
                    // ✅ NUEVO: Agregar campos faltantes para coincidencia con DetalleVenta
                    'tipo_precio_id' => $detalle['tipo_precio_id'] ?? null,
                    'tipo_precio_nombre' => $detalle['tipo_precio_nombre'] ?? null,
                    'combo_items_seleccionados' => $comboItemsSeleccionados ? array_map(function($item) {
                        return [
                            'combo_item_id' => $item['combo_item_id'] ?? null,
                            'producto_id' => $item['producto_id'] ?? null,
                            'incluido' => $item['incluido'] ?? false,
                        ];
                    }, $comboItemsSeleccionados) : null,
                ]);
            }

            // 3.4 RESERVAR stock SOLO si estado inicial es PENDIENTE
            if ($dto->estado_inicial === 'PENDIENTE') {
                Log::info('🔄 [ProformaService::crear] Reservando stock para proforma PENDIENTE', [
                    'proforma_id' => $proforma->id,
                ]);

                if (! $proforma->reservarStock()) {
                    throw new \Exception(
                        'No se pudo reservar el stock requerido para la proforma. Verifica disponibilidad.'
                    );
                }

                Log::info('✅ [ProformaService::crear] Stock reservado exitosamente', [
                    'proforma_id' => $proforma->id,
                ]);
            } else {
                Log::info('📝 [ProformaService::crear] Proforma creada en BORRADOR sin reserva de stock', [
                    'proforma_id' => $proforma->id,
                    'estado' => 'BORRADOR',
                    'preventista_id' => $dto->preventista_id,
                ]);
            }

            // 3.5 Emitir evento
            event(new \App\Events\ProformaCreada($proforma));

            return $proforma;
        });

        $this->logSuccess('Proforma creada', [
            'proforma_id' => $proforma->id,
            'numero'      => $proforma->numero,
        ]);

        return ProformaResponseDTO::fromModel($proforma);
    }

    /**
     * Aprobar una proforma
     *
     * Mantiene la reserva de stock (no la consume)
     * La consumición ocurre al convertir a venta
     *
     * @throws EstadoInvalidoException
     */
    public function aprobar(int $proformaId): ProformaResponseDTO
    {
        $proforma = $this->transaction(function () use ($proformaId) {
            $proforma = Proforma::lockForUpdate()->findOrFail($proformaId);

            $this->validarTransicion($proforma->estado, 'APROBADA');

            // Validar que reserva siga vigente
            if ($proforma->fecha_vencimiento < now()) {
                throw new \Exception('Proforma vencida, no puede ser aprobada');
            }

            // ✅ Obtener el estado APROBADA (ID=2 en estados_logistica, categoría: proforma)
            $estadoAprobada = \App\Models\EstadoLogistica::where('codigo', 'APROBADA')
                ->where('categoria', 'proforma')
                ->where('activo', true)
                ->first();

            $proforma->update(['estado_proforma_id' => $estadoAprobada?->id ?? 2]);

            event(new \App\Events\ProformaAprobada($proforma));

            return $proforma;
        });

        $this->logSuccess('Proforma aprobada', ['proforma_id' => $proformaId]);

        return ProformaResponseDTO::fromModel($proforma);
    }

    /**
     * Presentar una proforma (BORRADOR → PENDIENTE + Reservar Stock)
     *
     * Cambia el estado de BORRADOR a PENDIENTE y RESERVA el stock
     * cuando entra en el flujo normal de aprobación.
     *
     * @throws EstadoInvalidoException
     * @throws \Exception si falla la reserva de stock
     */
    public function presentarProforma(int $proformaId): ProformaResponseDTO
    {
        $proforma = $this->transaction(function () use ($proformaId) {
            $proforma = Proforma::lockForUpdate()->findOrFail($proformaId);

            // ✅ Validar que esté en estado BORRADOR
            if ($proforma->estado !== 'BORRADOR') {
                throw new EstadoInvalidoException(
                    "No se puede presentar una proforma en estado {$proforma->estado}. Debe estar en BORRADOR."
                );
            }

            // ✅ Validar que tenga al menos un detalle
            if ($proforma->detalles()->count() === 0) {
                throw new DomainException('No puede presentar una proforma sin detalles');
            }

            // ✅ RESERVAR STOCK (ahora sí, cuando se presenta)
            \Log::info('🔄 [ProformaService::presentarProforma] Reservando stock para proforma presentada', [
                'proforma_id' => $proformaId,
            ]);

            if (! $proforma->reservarStock()) {
                throw new \Exception(
                    'No se pudo reservar el stock requerido. Verifica disponibilidad.'
                );
            }

            \Log::info('✅ [ProformaService::presentarProforma] Stock reservado exitosamente', [
                'proforma_id' => $proformaId,
            ]);

            // ✅ Obtener el estado PENDIENTE
            $estadoPendiente = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE')
                ->where('categoria', 'proforma')
                ->where('activo', true)
                ->first();

            // ✅ Cambiar a PENDIENTE
            $proforma->update(['estado_proforma_id' => $estadoPendiente?->id ?? 1]);

            // ✅ Registrar en historial
            \Log::info('📋 [ProformaService::presentarProforma] Proforma presentada para aprobación', [
                'proforma_id' => $proformaId,
                'proforma_numero' => $proforma->numero,
                'cliente_id' => $proforma->cliente_id,
                'total' => $proforma->total,
                'stock_reservado' => true,
            ]);

            return $proforma;
        });

        $this->logSuccess('Proforma presentada para aprobación con stock reservado', ['proforma_id' => $proformaId]);

        return ProformaResponseDTO::fromModel($proforma);
    }

    /**
     * Rechazar una proforma
     *
     * Libera la reserva de stock
     *
     * @throws EstadoInvalidoException
     */
    public function rechazar(int $proformaId, string $motivo = ''): ProformaResponseDTO
    {
        $proforma = $this->transaction(function () use ($proformaId, $motivo) {
            $proforma = Proforma::lockForUpdate()->findOrFail($proformaId);

            $this->validarTransicion($proforma->estado, 'RECHAZADA');

            // ✅ Liberar TODAS las reservas usando ReservaDistribucionService
            $distribucionService = new ReservaDistribucionService();
            $resultadoLiberacion = $distribucionService->liberarTodasLasReservas(
                $proforma,
                "Rechazo de proforma: {$motivo}"
            );

            if (!$resultadoLiberacion['success']) {
                Log::warning('⚠️ Advertencia al liberar reservas en rechazo de proforma', [
                    'proforma_id' => $proformaId,
                    'error' => $resultadoLiberacion['error'] ?? 'Error desconocido',
                ]);
            } else {
                Log::info('✅ Reservas liberadas exitosamente en rechazo de proforma', [
                    'proforma_id' => $proformaId,
                    'cantidad_liberada' => $resultadoLiberacion['cantidad_liberada'],
                    'reservas_liberadas' => $resultadoLiberacion['reservas_liberadas'],
                ]);
            }

            // ✅ Obtener el estado RECHAZADA (ID=3 en estados_logistica, categoría: proforma)
            $estadoRechazada = \App\Models\EstadoLogistica::where('codigo', 'RECHAZADA')
                ->where('categoria', 'proforma')
                ->where('activo', true)
                ->first();

            // ✅ Usar updateQuietly() para NO disparar el observer (ya liberamos reservas arriba)
            $proforma->updateQuietly([
                'estado_proforma_id' => $estadoRechazada?->id ?? 3,
                'observaciones'      => ($proforma->observaciones ?? '') . "\nMotivo rechazo: {$motivo}",
            ]);

            // ✅ NUEVO: Disparar evento de notificación a cliente y preventista
            event(new \App\Events\ProformaRechazada($proforma, $motivo));

            return $proforma;
        });

        $this->logSuccess('Proforma rechazada', [
            'proforma_id' => $proformaId,
            'motivo'      => $motivo,
        ]);

        return ProformaResponseDTO::fromModel($proforma);
    }

    /**
     * Convertir proforma a venta
     *
     * FLUJO:
     * 1. Validar estado de proforma (debe ser APROBADA)
     * 2. Validar que stock reservado siga disponible
     * 3. Crear venta desde proforma
     * 4. Consumir stock (usa StockService)
     * 5. Liberar reserva de proforma
     * 6. Marcar proforma como CONVERTIDA
     *
     * @throws EstadoInvalidoException
     * @throws StockInsuficientException
     */
    public function convertirAVenta(int $proformaId): \App\DTOs\Venta\VentaResponseDTO
    {
        $ventaDTO = $this->transaction(function () use ($proformaId) {
            Log::info('🔄 [ProformaService::convertirAVenta] Iniciando transacción', [
                'proforma_id' => $proformaId,
                'timestamp'   => now()->toIso8601String(),
            ]);

            $proforma = Proforma::lockForUpdate()->with('detalles')->findOrFail($proformaId);

            Log::info('📋 [ProformaService::convertirAVenta] Proforma cargada', [
                'proforma_id' => $proformaId,
                'estado'      => $proforma->estado,
                'numero'      => $proforma->numero,
                'cliente_id'  => $proforma->cliente_id,
                'total'       => $proforma->total,
            ]);

            // ✅ SIMPLIFICADO: Aceptar tanto PENDIENTE como APROBADA
            // Esto permite convertir directamente sin paso de aprobación manual
            if (! in_array($proforma->estado, ['PENDIENTE', 'APROBADA'])) {
                Log::warning('⚠️ [ProformaService::convertirAVenta] Estado inválido', [
                    'proforma_id'     => $proformaId,
                    'estado_actual'   => $proforma->estado,
                    'estado_esperado' => 'PENDIENTE o APROBADA',
                ]);
                throw EstadoInvalidoException::transicionInvalida(
                    'Proforma',
                    $proformaId,
                    $proforma->estado,
                    'CONVERTIDA'
                );
            }

            // Validar que siga vigente
            if ($proforma->fecha_vencimiento < now()) {
                Log::warning('⚠️ [ProformaService::convertirAVenta] Proforma vencida', [
                    'proforma_id'       => $proformaId,
                    'fecha_vencimiento' => $proforma->fecha_vencimiento,
                ]);
                throw new \Exception('Proforma vencida, no puede ser convertida');
            }

            // Preparar datos para crear venta
            // ✅ IMPORTANTE: Incluir combo_items_seleccionados para que expandirCombos()
            //    solo reduzca stock de los items seleccionados por el cliente
            $detalles = $proforma->detalles->map(fn($det) => [
                'producto_id'              => $det->producto_id,
                'cantidad'                 => $det->cantidad,
                'precio_unitario'          => $det->precio_unitario,
                'combo_items_seleccionados' => $det->combo_items_seleccionados, // ← Items seleccionados del combo
            ])->toArray();

            // ✅ NUEVO: Calcular peso total desde detalles
            // Fórmula: pesoTotal = Σ(cantidad × peso_producto)
            // ✅ MEJORADO: Considerar pesos de productos dentro de combos
            $pesoTotal = 0;
            foreach ($proforma->detalles as $detalle) {
                // Si el detalle contiene combo_items_seleccionados, calcular peso desde los items del combo
                if (!empty($detalle->combo_items_seleccionados) && is_array($detalle->combo_items_seleccionados)) {
                    $pesoCombo = 0;
                    foreach ($detalle->combo_items_seleccionados as $comboItem) {
                        if (isset($comboItem['producto_id'])) {
                            $productoCombo = \App\Models\Producto::find($comboItem['producto_id']);
                            if ($productoCombo) {
                                $pesoCombo += (float) ($productoCombo->peso_unitario ?? 0);
                            }
                        }
                    }
                    $pesoTotal += $pesoCombo * (float) $detalle->cantidad;
                } else {
                    // Producto normal (no es combo o combo vacío)
                    $pesoProducto  = $detalle->producto?->peso ?? 0;
                    $pesoTotal    += $detalle->cantidad * $pesoProducto;
                }
            }

            Log::info('📦 [ProformaService::convertirAVenta] Detalles preparados', [
                'proforma_id'         => $proformaId,
                'cantidad_detalles'   => count($detalles),
                'peso_total_estimado' => $pesoTotal,
                'detalles'            => $detalles,
            ]);

            // Crear venta (StockService consume stock dentro)
            Log::info('🔄 [ProformaService::convertirAVenta] Llamando a VentaService::crear()', [
                'proforma_id' => $proformaId,
                'cliente_id'  => $proforma->cliente_id,
                'total'       => $proforma->total,
            ]);

            // Determinar si requiere envío basado en las direcciones de la proforma
            $requiereEnvio = $this->determinarSiRequiereEnvio($proforma);

            // Obtener política de pago (puede venir del cliente o usar default)
            $politicaPago = $this->obtenerPoliticaPago($proforma);

            // ✅ NUEVO: Validar que hay caja abierta si requiere pago inmediato
            // Políticas que requieren pago en efectivo/caja abierta:
            // - ANTICIPADO_100: 100% al contado
            // - MEDIO_MEDIO: 50% ahora + 50% al recibir
            $politicasQueRequierenCaja = [
                Proforma::POLITICA_ANTICIPADO_100,
                Proforma::POLITICA_MEDIO_MEDIO,
            ];

            if (in_array($politicaPago, $politicasQueRequierenCaja)) {
                $usuarioActual = Auth::user();
                $empleado      = $usuarioActual?->empleado;

                // Verificar que el usuario es cajero con caja abierta
                if (! $empleado || ! $empleado->esCajero() || ! $empleado->tieneCajaAbierta()) {
                    $descripcionPolitica = $politicaPago === Proforma::POLITICA_ANTICIPADO_100
                        ? 'AL CONTADO (100% ANTICIPADO)'
                        : 'MEDIO-MEDIO (50% AHORA + 50% AL RECIBIR)';

                    Log::warning('⚠️ [ProformaService::convertirAVenta] Intento de conversión sin caja abierta', [
                        'proforma_id'        => $proformaId,
                        'politica_pago'      => $politicaPago,
                        'usuario_id'         => $usuarioActual?->id,
                        'es_cajero'          => $empleado?->esCajero() ?? false,
                        'tiene_caja_abierta' => $empleado?->tieneCajaAbierta() ?? false,
                    ]);

                    throw CajaNoAbiertaException::conDetalles(
                        operacion: "Convertir proforma a venta (pago $descripcionPolitica)",
                        usuarioId: $usuarioActual?->id,
                        extra: [
                            'proforma_id'   => $proformaId,
                            'politica_pago' => $politicaPago,
                            'motivo'        => "Esta proforma tiene política de pago $descripcionPolitica que requiere caja abierta",
                        ]
                    );
                }

                Log::info('✅ [ProformaService::convertirAVenta] Validación de caja exitosa', [
                    'proforma_id'   => $proformaId,
                    'politica_pago' => $politicaPago,
                    'usuario_id'    => $usuarioActual->id,
                    'caja_id'       => $empleado->cajaAbierta()?->id,
                ]);
            }

            // Calcular ventanas de entrega
            $ventanas = $this->calcularVentanasEntrega($proforma);

            // Obtener dirección de entrega confirmada (prioridad) o solicitada
            $direccionClienteId = $proforma->direccion_entrega_confirmada_id ?? $proforma->direccion_entrega_solicitada_id;

            // ✅ NUEVO: Obtener el estado APROBADO para la venta creada desde proforma
            $estadoAprobado = \App\Models\EstadoDocumento::where('codigo', 'APROBADO')
                ->where('activo', true)
                ->first();

            $estadoDocumentoIdFinal = $estadoAprobado?->id ?? 3;
            Log::info('📋 [ProformaService::convertirAVenta] Estado APROBADO obtenido', [
                'estado_documento_id_encontrado' => $estadoAprobado?->id,
                'estado_documento_id_final'      => $estadoDocumentoIdFinal,
                'estado_codigo'                  => $estadoAprobado?->codigo ?? 'FALLBACK A 3',
            ]);

            // ✅ NUEVO: Obtener montos pagados en la aprobación (si los hay)
            // Esto permite saber si hubo pago inicial cuando se aprobó
            $montoPagadoInicial = 0;
            // Por ahora, asumimos que si se pagó, se registró como Pago en la BD
            // En futuro, esto podría venir del registro de aprobación
            Log::info('💰 [ProformaService::convertirAVenta] Monto pagado inicial', [
                'monto_pagado' => $montoPagadoInicial,
                'nota'         => 'Será actualizado cuando se implemente registro de pagos en aprobación',
            ]);

            $ventaDTO = $this->ventaService->crear(
                new \App\DTOs\Venta\CrearVentaDTO(
                    cliente_id: $proforma->cliente_id,
                    fecha: now()->toDateString(),
                    detalles: $detalles,
                    subtotal: $proforma->subtotal,
                    impuesto: $proforma->impuesto,
                    total: $proforma->total,
                    peso_total_estimado: $pesoTotal, // ✅ NUEVO: Pasar peso calculado
                                                     // 🔧 Obtener almacén del usuario autenticado (no de la proforma)
                    almacen_id: auth()->user()?->empresa?->almacen_id ?? 2,
                    observaciones: "Convertida desde proforma #{$proforma->numero}",
                    usuario_id: Auth::id(),
                    proforma_id: $proforma->id,
                    // Dirección de entrega
                    direccion_cliente_id: $direccionClienteId,
                    // Campos de logística
                    requiere_envio: $requiereEnvio,
                    canal_origen: $proforma->canal_origen ?? 'WEB',
                    estado_logistico_id: $this->obtenerEstadoLogisticoInicial($requiereEnvio),
                    // Campos de política de pago
                    politica_pago: $politicaPago,
                    // ✅ estado_pago se calcula dinámicamente en VentaService basado en monto_pagado_inicial
                    // Campos de SLA y compromisos de entrega
                    fecha_entrega_comprometida: $proforma->fecha_entrega_confirmada,
                    hora_entrega_comprometida: $proforma->hora_entrega_confirmada
                        ? (is_string($proforma->hora_entrega_confirmada)
                            ? $proforma->hora_entrega_confirmada
                            : $proforma->hora_entrega_confirmada->format('H:i:s'))
                        : null,
                    ventana_entrega_ini: $ventanas['inicio'],
                    ventana_entrega_fin: $ventanas['fin'],
                    idempotency_key: "proforma-{$proforma->id}-" . now()->timestamp,
                    // ✅ NUEVO: Estado APROBADO para venta desde proforma aprobada
                    estado_documento_id: $estadoDocumentoIdFinal,
                    // ✅ NUEVO: Monto pagado inicial (si lo hay)
                    monto_pagado_inicial: $montoPagadoInicial > 0 ? $montoPagadoInicial : null,
                )
            );

            // Obtener el código del estado logístico asignado (para logging)
            $estadoLogisticoInfo = $ventaDTO->estado_logistico_id
                ? \App\Models\EstadoLogistica::find($ventaDTO->estado_logistico_id)?->codigo
                : 'SIN_LOGISTICA';

            Log::info('✅ [ProformaService::convertirAVenta] Venta creada exitosamente', [
                'proforma_id'             => $proformaId,
                'venta_id'                => $ventaDTO->id,
                'venta_numero'            => $ventaDTO->numero,
                'requiere_envio'          => $requiereEnvio,
                'estado_logistico_id'     => $ventaDTO->estado_logistico_id,
                'estado_logistico_codigo' => $estadoLogisticoInfo,
            ]);

            Log::debug('🔍 [ProformaService::convertirAVenta] Punto crítico: verificando proforma..', [
                'proforma_id'                => $proformaId,
                'proforma_estado_en_memoria' => $proforma->estado,
            ]);

            // ✅ REFACTORIZADO (2026-03-27): Consumir reservas de stock (AGRUPADAS)
            // Esto marca las reservas_proforma como consumidas
            Log::info('🔄 [ProformaService::convertirAVenta] Consumiendo reservas de stock (AGRUPADAS)', [
                'proforma_id'       => $proformaId,
                'venta_numero'      => $ventaDTO->numero,
                'transaction_level' => DB::transactionLevel(),
            ]);

            try {
                // ✅ NUEVO: Usar servicio centralizado para consumir reservas agrupadas
                $reservaService = new \App\Services\Reservas\ReservaDistribucionService();
                $resultadoConsumir = $reservaService->consumirReservasAgrupadas($proforma, $ventaDTO->numero);

                if (!$resultadoConsumir['success']) {
                    throw new \Exception($resultadoConsumir['error'] ?? 'Error desconocido al consumir reservas');
                }

                Log::info('✅ consumirReservasAgrupadas() completado', [
                    'proforma_id' => $proformaId,
                    'venta_numero' => $ventaDTO->numero,
                    'cantidad_consumida' => $resultadoConsumir['cantidad_consumida'],
                    'reservas_consumidas' => $resultadoConsumir['reservas_consumidas'],
                ]);
            } catch (\Exception $e) {
                Log::error('❌ consumirReservasAgrupadas() lanzó excepción', [
                    'proforma_id' => $proformaId,
                    'venta_numero' => $ventaDTO->numero,
                    'error'       => $e->getMessage(),
                    'trace'       => $e->getTraceAsString(),
                ]);
                throw $e;
            }

            Log::info('✅ [ProformaService::convertirAVenta] Reservas de stock consumidas (AGRUPADAS)', [
                'proforma_id' => $proformaId,
                'venta_numero' => $ventaDTO->numero,
            ]);

            // Marcar proforma como convertida
            // 🔧 Usar el ID correcto del estado (4 = CONVERTIDA en estados_logistica)
            // ✅ Usar updateQuietly() para NO disparar el observer (ya consumimos reservas arriba)
            $proforma->updateQuietly(['estado_proforma_id' => 4]);

            Log::info('✅ [ProformaService::convertirAVenta] Proforma marcada como CONVERTIDA', [
                'proforma_id' => $proformaId,
            ]);

            // Obtener el modelo Venta desde la BD (necesario para el evento)
            // Ya que VentaService retorna un DTO, necesitamos el modelo real
            $ventaModel = \App\Models\Venta::find($ventaDTO->id);

            // Disparar evento de proforma convertida
            if ($ventaModel) {
                Log::debug('📢 [ProformaService::convertirAVenta] Disparando evento ProformaConvertida');
                event(new \App\Events\ProformaConvertida($proforma, $ventaModel));
            } else {
                Log::warning('⚠️ [ProformaService::convertirAVenta] No se pudo obtener el modelo Venta para el evento', [
                    'proforma_id' => $proformaId,
                    'venta_id'    => $ventaDTO->id,
                ]);
            }

            return $ventaDTO;
        });

        $this->logSuccess('Proforma convertida a venta', [
            'proforma_id' => $proformaId,
        ]);

        return $ventaDTO;
    }

    /**
     * Obtener una proforma
     *
     * ✅ SIMPLIFICADO: Cargar reservas_proforma para mostrar qué está reservado
     */
    public function obtener(int $proformaId): ProformaResponseDTO
    {
        $proforma = Proforma::with([
            'detalles.producto.categoria',
            'detalles.producto.marca',
            // ✅ NUEVO: Cargar stock y almacén para mostrar en la tabla
            'detalles.producto.stock',
            // ✅ NUEVO: Cargar unidad de medida del PRODUCTO para ProductosTable (relación se llama "unidad")
            'detalles.producto.unidad',
            // ✅ NUEVO: Cargar precios del PRODUCTO para select de tipos de precio (con su relación tipoPrecio)
            'detalles.producto.precios.tipoPrecio',
            // ✅ CRÍTICO (2026-02-17): Cargar comboItems para mostrar componentes del combo en ProductosTable
            'detalles.producto.comboItems.producto',
            'detalles.producto.comboItems.producto.unidad', // ✅ NUEVO (2026-02-18): Cargar unidad para comboItems (unidad_medida_nombre)
            'detalles.producto.comboItems.producto.stock', // ✅ NUEVO (2026-02-18): Cargar stock para comboItems (stock_disponible, stock_total)
            'detalles.producto.comboItems.tipoPrecio', // ← NUEVO: para tipo_precio_nombre
            // ✅ SIMPLIFICADO: Cargar reservas_proforma de esta proforma
            'reservas',
            'cliente',
            'direccionSolicitada',
            'direccionConfirmada',
            'moneda',
            'usuarioCreador',
            // ✅ CRÍTICO: Cargar estado_logistica para mostrar en Show.tsx
            'estadoLogistica',
            // ✅ NUEVO: Cargar venta si la proforma fue convertida (para mostrar ID y número de venta)
            'venta',
        ])->findOrFail($proformaId);

        return ProformaResponseDTO::fromModel($proforma);
    }

    /**
     * Extender validez de proforma
     */
    public function extenderValidez(int $proformaId, int $dias = 15): ProformaResponseDTO
    {
        $proforma = $this->transaction(function () use ($proformaId, $dias) {
            $proforma = Proforma::lockForUpdate()->findOrFail($proformaId);

            if ($proforma->estado !== 'PENDIENTE' && $proforma->estado !== 'APROBADA') {
                throw new \Exception(
                    "Solo se puede extender validez de proformas PENDIENTE o APROBADA"
                );
            }

            $nuevaFechaVencimiento = $proforma->fecha_vencimiento->addDays($dias);

            $proforma->update(['fecha_vencimiento' => $nuevaFechaVencimiento]);

            // ✅ Actualizar también reservas (usar ReservaProforma, no ReservaStock)
            \App\Models\ReservaProforma::where('proforma_id', $proformaId)
                ->update(['fecha_expiracion' => $nuevaFechaVencimiento]);

            return $proforma;
        });

        $this->logSuccess('Validez de proforma extendida', [
            'proforma_id' => $proformaId,
            'dias'        => $dias,
        ]);

        return ProformaResponseDTO::fromModel($proforma);
    }

    /**
     * Validar transición de estado
     *
     * @throws EstadoInvalidoException
     */
    private function validarTransicion(string $estadoActual, string $estadoNuevo): void
    {
        $permitidas = self::$transicionesValidas[$estadoActual] ?? [];

        if (! in_array($estadoNuevo, $permitidas)) {
            throw EstadoInvalidoException::transicionInvalida(
                'Proforma',
                0,
                $estadoActual,
                $estadoNuevo
            );
        }
    }

    /**
     * Generar número secuencial de proforma
     */
    private function generarNumero(): string
    {
        $year  = now()->year;
        $count = Proforma::whereYear('created_at', $year)->count() + 1;

        return sprintf('PF-%d-%06d', $year, $count);
    }

    /**
     * Determinar si la venta requiere envío
     *
     * Lógica:
     * - Si tiene dirección de entrega confirmada → requiere envío
     * - Si el cliente está fuera de la ciudad → requiere envío
     * - Si es de canal APP_EXTERNA → generalmente requiere envío
     */
    private function determinarSiRequiereEnvio(Proforma $proforma): bool
    {
        // Si tiene dirección de entrega confirmada, requiere envío
        if ($proforma->direccion_entrega_confirmada_id) {
            return true;
        }

        // Si tiene dirección solicitada, requiere envío
        if ($proforma->direccion_entrega_solicitada_id) {
            return true;
        }

        // Si es de app externa, generalmente requiere envío
        if ($proforma->canal_origen === Proforma::CANAL_APP_EXTERNA) {
            return true;
        }

        // Si el cliente tiene localidad fuera de la ciudad base, requiere envío
        if ($proforma->cliente && $proforma->cliente->localidad_id) {
            // Aquí podrías agregar lógica para verificar si la localidad requiere envío
            // Por ahora, asumimos que si tiene localidad, probablemente requiere envío
            return true;
        }

        // Por defecto, no requiere envío (venta en mostrador)
        return false;
    }

    /**
     * Obtener política de pago para la venta
     *
     * Prioridad:
     * 1. Política de la proforma (establecida en el formulario)
     * 2. Política específica del cliente (si existe en tabla clientes)
     * 3. Política por categoría de cliente
     * 4. Default: CONTRA_ENTREGA
     */
    private function obtenerPoliticaPago(Proforma $proforma): string
    {
        // 1. Si la proforma tiene una política explícita, usarla
        if ($proforma->politica_pago && in_array($proforma->politica_pago, [
            \App\Models\Proforma::POLITICA_CONTRA_ENTREGA,
            \App\Models\Proforma::POLITICA_ANTICIPADO_100,
            \App\Models\Proforma::POLITICA_MEDIO_MEDIO,
            \App\Models\Proforma::POLITICA_CREDITO,
        ])) {
            return $proforma->politica_pago;
        }

        // TODO: Cuando se agregue campo politica_pago en tabla clientes
        // if ($proforma->cliente && $proforma->cliente->politica_pago) {
        //     return $proforma->cliente->politica_pago;
        // }

        // TODO: Cuando se agregue política por categoría
        // if ($proforma->cliente && $proforma->cliente->categorias->isNotEmpty()) {
        //     $categoria = $proforma->cliente->categorias->first();
        //     if ($categoria->politica_pago_default) {
        //         return $categoria->politica_pago_default;
        //     }
        // }

        // Default: CONTRA_ENTREGA (pago al recibir)
        return 'CONTRA_ENTREGA';
    }

    /**
     * Calcular ventanas de entrega basadas en la hora comprometida
     *
     * Si hay hora confirmada, genera una ventana de ±1 hora
     * Si no hay hora, retorna null para ambas
     */
    private function calcularVentanasEntrega(Proforma $proforma): array
    {
        if (! $proforma->hora_entrega_confirmada) {
            return [
                'inicio' => null,
                'fin'    => null,
            ];
        }

        // Crear ventana de ±1 hora alrededor de la hora comprometida
        // 🔧 Convertir string a Carbon si es necesario (ahora que el cast es 'string')
        $horaConfirmada = $proforma->hora_entrega_confirmada;
        if (is_string($horaConfirmada)) {
            $horaConfirmada = \Carbon\Carbon::createFromFormat('H:i:s', $horaConfirmada);
        }

        $horaInicio = $horaConfirmada->copy()->subHour();
        $horaFin    = $horaConfirmada->copy()->addHour();

        return [
            'inicio' => $horaInicio->format('H:i:s'),
            'fin'    => $horaFin->format('H:i:s'),
        ];
    }

    /**
     * Obtener el estado logístico inicial para una venta recién creada desde proforma
     *
     * Estados iniciales:
     * - Si requiere envío: PENDIENTE_ENVIO
     * - Si es retiro: PENDIENTE_RETIRO
     * - Si no requiere logística: null
     *
     * @param bool $requiereEnvio Si la venta requiere envío/logística
     * @return int|null ID del estado logístico inicial, o null si no requiere logística
     */
    private function obtenerEstadoLogisticoInicial(bool $requiereEnvio): ?int
    {
        if (! $requiereEnvio) {
            return null; // Venta de mostrador, no requiere logística
        }

        // Por defecto, usar PENDIENTE_ENVIO para ventas que requieren envío
        $estadoId = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE_ENVIO')
            ->where('categoria', 'venta_logistica')
            ->value('id');

        if (! $estadoId) {
            Log::error('❌ [ProformaService] Estado PENDIENTE_ENVIO no encontrado en estados_logistica', [
                'categoria' => 'venta_logistica',
                'codigo'    => 'PENDIENTE_ENVIO',
            ]);

            // Fallback a PENDIENTE_RETIRO si PENDIENTE_ENVIO no existe
            $estadoId = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE_RETIRO')
                ->where('categoria', 'venta_logistica')
                ->value('id');
        }

        if (! $estadoId) {
            Log::error('❌ [ProformaService] No hay estados logísticos disponibles', [
                'categoria' => 'venta_logistica',
            ]);
        }

        return $estadoId;
    }
}
