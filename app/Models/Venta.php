<?php
namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use App\Models\Traits\ManageEstadosLogisticos;
use App\Services\StockService;
use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;

class Venta extends Model
{
    use HasFactory, GeneratesSequentialCode, ManageEstadosLogisticos;

    protected $fillable = [
        'numero',
        'fecha',
        'subtotal',
        'descuento',
        'impuesto',
        'total',
        'peso_total_estimado',  // ✅ NUEVO: Peso total en kg (cantidad * peso_producto)
        'observaciones',
        'observaciones_logistica',  // ✅ NUEVO: Observaciones sobre entrega (completa, incidentes, etc.)
        'cliente_id',
        'usuario_id',
        'preventista_id',  // ✅ NUEVO: User con rol de preventista
        'estado_documento_id',
        'moneda_id',
        'proforma_id',
        'tipo_pago_id',
        'tipo_documento_id',
        'direccion_cliente_id',
        'caja_id',  // ✅ NUEVO: Caja en la que se realizó la venta
        // Campos para logística
        'requiere_envio',
        'canal_origen',
        'tipo_entrega',  // NUEVO: DELIVERY o PICKUP
        'estado_logistico_id',
        'empresa_logistica_id',  // ✅ NUEVO: Empresa de logística seleccionada
        'entrega_id',    // NUEVO - FASE 3: FK a entregas (relación 1:N)
        // Campos para confirmación de pickup
        'pickup_confirmado_cliente_en',      // NUEVO
        'pickup_confirmado_cliente_por_id',  // NUEVO
        'pickup_confirmado_empleado_en',     // NUEVO
        'pickup_confirmado_empleado_por_id', // NUEVO
        // Campos de política de pago
        'politica_pago',
        'estado_pago',
        'monto_pagado',
        'monto_pendiente',
        // Campos de SLA y compromisos de entrega
        'fecha_entrega_comprometida',
        'hora_entrega_comprometida',
        'ventana_entrega_ini',
        'ventana_entrega_fin',
        'idempotency_key',
        'fue_on_time',
        'minutos_retraso',
    ];

    protected function casts(): array
    {
        return [
            'fecha'          => 'date',
            'subtotal'       => 'decimal:2',
            'descuento'      => 'decimal:2',
            'impuesto'       => 'decimal:2',
            'total'          => 'decimal:2',
            'peso_total_estimado' => 'decimal:2',  // ✅ NUEVO: Peso en kg con 2 decimales
            'requiere_envio' => 'boolean',
            'monto_pagado'   => 'decimal:2',
            'monto_pendiente' => 'decimal:2',
            'fecha_entrega_comprometida' => 'date',
            'hora_entrega_comprometida' => 'datetime:H:i:s',
            'ventana_entrega_ini' => 'datetime:H:i:s',
            'ventana_entrega_fin' => 'datetime:H:i:s',
            'fue_on_time' => 'boolean',
            // Casts para confirmación de pickup
            'pickup_confirmado_cliente_en' => 'datetime',
            'pickup_confirmado_empleado_en' => 'datetime',
        ];
    }

    /**
     * ✅ NUEVO: Accessor para obtener el código de estado logístico desde la relación
     *
     * Convierte estado_logistico_id (FK) a estado_logistico (código)
     * Permite que el frontend acceda a $venta->estado_logistico
     * en lugar de $venta->estadoLogistica->codigo
     */
    protected function estadoLogistico(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Acceder a la relación estadoLogistica (no a este accessor para evitar recursión)
                $relacion = $this->getAttribute('estadoLogistica');
                if ($relacion) {
                    return $relacion->codigo ?? 'SIN_ENTREGA';
                }
                return 'SIN_ENTREGA';
            }
        );
    }

    /**
     * ✅ Accessor para obtener el nombre del estado desde la relación estadoDocumento
     *
     * Convierte estado_documento_id (FK) a estado (nombre)
     * Permite acceder a $venta->estado en lugar de $venta->estadoDocumento->nombre
     */
    protected function estado(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Acceder a la relación estadoDocumento
                $relacion = $this->getAttribute('estadoDocumento');
                if ($relacion) {
                    return $relacion->nombre;
                }
                return null;
            }
        );
    }

    protected static function booted()
    {
        // Después de crear una venta, generar movimientos automáticamente
        static::created(function ($venta) {
            // ⚠️ CAMBIO CRÍTICO: Solo procesar stock si:
            // 1. NO requiere envío (para ventas con envío, se procesa al iniciar preparación)
            // 2. NO viene de una proforma (el stock ya fue consumido al convertir)
            //
            // IMPORTANTE: Si viene de proforma, las reservas ya se consumieron
            // en ProformaController::convertirAVenta() mediante $proforma->consumirReservas()
            if (!$venta->requiere_envio && !$venta->proforma_id) {
                $venta->procesarMovimientosStock();
            }

            // TODO: Generar movimientos contables cuando CuentaContable esté completamente configurado
            // Por ahora, solo generar movimientos de caja
            // $venta->generarAsientoContable();

            // ✅ DESACTIVADO (2026-03-02): El listener RegisterCajaMovementFromVentaListener es más robusto
            // Evitar duplicados: listener crea movimiento, no el método booted
            // try {
            //     $venta->generarMovimientoCaja();
            // } catch (\Exception $e) {
            //     \Illuminate\Support\Facades\Log::error("Error generando movimiento de caja para venta {$venta->numero}: " . $e->getMessage());
            // }
        });

        // Antes de eliminar una venta, revertir movimientos
        static::deleting(function ($venta) {
            $venta->revertirMovimientosStock();
            $venta->eliminarAsientoContable();
        });
    }

    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ✅ NUEVO: Relación con el preventista (User con rol de preventista)
     */
    public function preventista()
    {
        return $this->belongsTo(User::class, 'preventista_id');
    }

    public function estadoDocumento()
    {
        return $this->belongsTo(EstadoDocumento::class);
    }

    public function moneda()
    {
        return $this->belongsTo(Moneda::class);
    }

    public function proforma()
    {
        return $this->belongsTo(Proforma::class);
    }

    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function detalles()
    {
        return $this->hasMany(DetalleVenta::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    public function detallesPagoVenta()
    {
        return $this->hasMany(DetallePagoVenta::class);
    }

    public function cuentaPorCobrar()
    {
        return $this->hasOne(CuentaPorCobrar::class);
    }

    public function movimientoCaja()
    {
        return $this->hasOne(MovimientoCaja::class, 'numero_documento', 'numero');
    }

    public function asientoContable()
    {
        return $this->morphOne(AsientoContable::class, 'asientable');
    }

    /**
     * Entregas asociadas a esta venta (NUEVA ARQUITECTURA - FASE 3)
     *
     * RELACIÓN 1:N: Una venta pertenece a UNA entrega
     *
     * MIGRACIÓN:
     * - FASE 1: N:M via pivot table (entrega_venta) ← LEGACY
     * - FASE 3: 1:N via FK entrega_id (relación actual) ← ACTUAL
     *
     * USO:
     *   $venta->entrega              // Obtener entrega asignada
     *   $venta->entrega->estado      // Estado actual
     *   $venta->entrega->chofer      // Chofer asignado
     *
     * NOTA: El método legacy $venta->entregas() (N:M) se mantiene
     *       para compatibilidad temporal pero será deprecado en FASE 3b
     */
    public function entrega()
    {
        return $this->belongsTo(Entrega::class, 'entrega_id');
    }

    /**
     * ✅ NUEVA FASE 3: Entregas asociadas a esta venta (N:M via pivot)
     *
     * Relación N:M via pivot table entrega_venta
     * Una venta puede estar en múltiples entregas consolidadas
     *
     * Se usa para:
     * - Sincronizar estados cuando entrega cambia
     * - Rastrear múltiples entregas de una venta
     * - Consolidar cargas (múltiples ventas en una entrega)
     */
    public function entregas()
    {
        return $this->belongsToMany(
            Entrega::class,
            'entrega_venta',      // tabla pivot
            'venta_id',           // FK en pivot hacia ventas
            'entrega_id'          // FK en pivot hacia entregas
        )
        ->withPivot([
            'orden',
            'confirmado_por',
            'fecha_confirmacion',
            'notas',
            'created_at',
            'updated_at',
        ])
        ->orderByPivot('orden');  // Usar orderByPivot para evitar ambiguous column
    }

    /**
     * Entregas asociadas a esta venta (LEGACY - FASE 1)
     *
     * ⚠️ DEPRECADO en FASE 3: Usar $venta->entregas() en su lugar
     *
     * Relación N:M via pivot table entrega_venta
     * Se mantiene por compatibilidad durante transición
     *
     * SERÁ ELIMINADA cuando se dropee tabla pivot en FASE 3b
     */
    public function entregasLegacy()
    {
        return $this->entregas();  // Redirigir a la relación nueva
    }

    /**
     * Dirección de cliente asociada a esta venta
     */
    public function direccionCliente()
    {
        return $this->belongsTo(\App\Models\DireccionCliente::class, 'direccion_cliente_id');
    }

    /**
     * Usuario que confirmó el pickup desde el cliente (app)
     */
    public function pickupConfirmadoClientePor()
    {
        return $this->belongsTo(User::class, 'pickup_confirmado_cliente_por_id');
    }

    /**
     * Usuario que confirmó el pickup desde el empleado (almacén)
     */
    public function pickupConfirmadoEmpleadoPor()
    {
        return $this->belongsTo(User::class, 'pickup_confirmado_empleado_por_id');
    }

    /**
     * Relación con el estado logístico (FK)
     */
    public function estadoLogistica()
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_logistico_id');
    }

    /**
     * ✅ NUEVO: Relación con la empresa de logística
     */
    public function empresaLogistica()
    {
        return $this->belongsTo(Empresa::class, 'empresa_logistica_id');
    }

    /**
     * Relación con el token de acceso público
     */
    public function accessToken()
    {
        return $this->hasOne(VentaAccessToken::class);
    }

    /**
     * Devoluciones asociadas a esta venta
     */
    public function devoluciones()
    {
        return $this->hasMany(Devolucion::class);
    }

    /**
     * Métodos de Utilidad para Logística
     */

    /**
     * Obtener información de entregas y estado logístico
     */
    public function obtenerDetalleLogistico(): array
    {
        $sincronizador = app(\App\Services\Logistica\SincronizacionVentaEntregaService::class);
        return $sincronizador->obtenerDetalleEntregas($this);
    }

    /**
     * Verificar si la venta está siendo entregada
     */
    public function estaBeingDelivered(): bool
    {
        return in_array($this->estado_logistico, [
            'EN_PREPARACION',
            'EN_TRANSITO',
        ]);
    }

    /**
     * Verificar si la entrega fue completada
     */
    public function wasDelivered(): bool
    {
        return $this->estado_logistico === 'ENTREGADA';
    }

    /**
     * Verificar si hay problemas en la entrega
     */
    public function hasDeliveryProblems(): bool
    {
        return $this->estado_logistico === 'PROBLEMAS';
    }

    /**
     * Obtener estado logístico legible
     */
    public function getEstadoLogisticoLabel(): string
    {
        $labels = [
            'SIN_ENTREGA' => 'Sin Entrega',
            'PROGRAMADO' => 'Programado',
            'EN_PREPARACION' => 'En Preparación',
            'EN_TRANSITO' => 'En Tránsito',
            'ENTREGADA' => 'Entregada',
            'PROBLEMAS' => 'Con Problemas',
            'CANCELADA' => 'Cancelada',
        ];

        return $labels[$this->estado_logistico] ?? 'Desconocido';
    }

    /**
     * Obtener color para representar estado logístico
     */
    public function getEstadoLogisticoColor(): string
    {
        $colors = [
            'SIN_ENTREGA' => 'gray',
            'PROGRAMADO' => 'blue',
            'EN_PREPARACION' => 'yellow',
            'EN_TRANSITO' => 'purple',
            'ENTREGADA' => 'green',
            'PROBLEMAS' => 'red',
            'CANCELADA' => 'dark',
        ];

        return $colors[$this->estado_logistico] ?? 'gray';
    }

    // Constantes para el nuevo sistema
    const CANAL_APP_EXTERNA = 'APP_EXTERNA';

    const CANAL_WEB = 'WEB';

    const CANAL_PRESENCIAL = 'PRESENCIAL';

    // Tipos de entrega
    const TIPO_DELIVERY = 'DELIVERY';

    const TIPO_PICKUP = 'PICKUP';

    // Políticas de pago
    const POLITICA_CONTRA_ENTREGA = 'CONTRA_ENTREGA';

    const POLITICA_ANTICIPADO_100 = 'ANTICIPADO_100';

    const POLITICA_MEDIO_MEDIO = 'MEDIO_MEDIO';

    const POLITICA_CREDITO = 'CREDITO';

    // Estados Logísticos
    const ESTADO_LOGISTICO_SIN_ENTREGA = 'SIN_ENTREGA';
    const ESTADO_LOGISTICO_PROGRAMADO = 'PROGRAMADO';
    const ESTADO_LOGISTICO_EN_PREPARACION = 'EN_PREPARACION';
    const ESTADO_LOGISTICO_EN_TRANSITO = 'EN_TRANSITO';
    const ESTADO_LOGISTICO_ENTREGADA = 'ENTREGADA';
    const ESTADO_LOGISTICO_PROBLEMAS = 'PROBLEMAS';
    const ESTADO_LOGISTICO_CANCELADA = 'CANCELADA';

    // Estados específicos para PICKUP
    const ESTADO_LOGISTICO_PENDIENTE_RETIRO = 'PENDIENTE_RETIRO';
    const ESTADO_LOGISTICO_RETIRADO = 'RETIRADO';

    const ESTADO_PENDIENTE_ENVIO = 'PENDIENTE_ENVIO';

    const ESTADO_PREPARANDO = 'PREPARANDO';

    const ESTADO_ENVIADO = 'ENVIADO';

    const ESTADO_ENTREGADO = 'ENTREGADO';

    // Nuevos métodos para logística
    public function puedeEnviarse(): bool
    {
        return $this->requiere_envio &&
        $this->estado_logistico === self::ESTADO_PENDIENTE_ENVIO &&
        $this->estadoDocumento &&
        $this->estadoDocumento->nombre === 'CONFIRMADO';
    }

    public function programarEnvio(array $datos): Envio
    {
        return Envio::create([
            'numero_envio'      => Envio::generarNumeroEnvio(),
            'venta_id'          => $this->id,
            'vehiculo_id'       => $datos['vehiculo_id'],
            'chofer_id'         => $datos['chofer_id'],
            'fecha_programada'  => $datos['fecha_programada'],
            'direccion_entrega' => $this->cliente->direccion ?? $datos['direccion_entrega'],
            'estado'            => Envio::PROGRAMADO,
        ]);
    }

    public function esDeAppExterna(): bool
    {
        return $this->canal_origen === self::CANAL_APP_EXTERNA;
    }

    public function esPickup(): bool
    {
        return $this->tipo_entrega === self::TIPO_PICKUP;
    }

    public function esDelivery(): bool
    {
        return $this->tipo_entrega === self::TIPO_DELIVERY;
    }

    // ✅ Helpers para política de pago
    public function esContraEntrega(): bool
    {
        return $this->politica_pago === self::POLITICA_CONTRA_ENTREGA;
    }

    public function esAnticipadoCompleto(): bool
    {
        return $this->politica_pago === self::POLITICA_ANTICIPADO_100;
    }

    public function esMedioMedio(): bool
    {
        return $this->politica_pago === self::POLITICA_MEDIO_MEDIO;
    }

    public function solicitaCredito(): bool
    {
        return $this->politica_pago === self::POLITICA_CREDITO;
    }

    public function puedeConfirmarsePickupPorCliente(): bool
    {
        return $this->esPickup()
            && $this->estado_logistico === self::ESTADO_LOGISTICO_PENDIENTE_RETIRO
            && !$this->pickup_confirmado_cliente_en;
    }

    public function puedeConfirmarsePickupPorEmpleado(): bool
    {
        return $this->esPickup()
            && $this->estado_logistico === self::ESTADO_LOGISTICO_PENDIENTE_RETIRO
            && !$this->pickup_confirmado_empleado_en;
    }

    public function pickupCompletamenteConfirmado(): bool
    {
        return $this->pickup_confirmado_cliente_en !== null
            && $this->pickup_confirmado_empleado_en !== null;
    }

    // Scopes para el nuevo sistema
    public function scopeQueRequierenEnvio($query)
    {
        return $query->where('requiere_envio', true);
    }

    public function scopeDeAppExterna($query)
    {
        return $query->where('canal_origen', self::CANAL_APP_EXTERNA);
    }

    public function scopePendientesDeEnvio($query)
    {
        return $query->where('estado_logistico', self::ESTADO_PENDIENTE_ENVIO);
    }

    /**
     * Generar número automático para la venta con protección contra race conditions
     *
     * ✅ CONSOLIDADO: Usa GeneratesSequentialCode trait
     * Formato: VEN + FECHA_ACTUAL + SECUENCIAL (6 dígitos)
     * Ejemplo: VEN20250000001
     */
    public static function generarNumero(): string
    {
        return static::generateSequentialCode('VEN', 'numero', true, 'Ymd', 6);
    }

    /**
     * Validar stock disponible antes de crear la venta
     */
    public function validarStock(int $almacenId = 1): array
    {
        $stockService = app(StockService::class);

        $productos = $this->detalles->map(function ($detalle) {
            return [
                'producto_id' => $detalle->producto_id,
                'cantidad'    => $detalle->cantidad,
            ];
        })->toArray();

        return $stockService->validarStockDisponible($productos, $almacenId);
    }

    /**
     * Procesar movimientos de stock automáticamente
     *
     * IMPORTANTE: No validar stock aquí - procesarSalidaVenta() ya lo hace CON LOCK
     * Eliminar la validación previa previene race conditions TOC/TOU
     */
    public function procesarMovimientosStock(int $almacenId = 1): void
    {
        if ($this->detalles->isEmpty()) {
            return;
        }

        $stockService = app(StockService::class);

        $productos = $this->detalles->map(function ($detalle) {
            return [
                'producto_id' => $detalle->producto_id,
                'cantidad'    => $detalle->cantidad,
            ];
        })->toArray();

        // Después de construir $productos y antes del try:
        $productosParaStock = $stockService->expandirCombos($productos);

        try {
            // ✅ CORRECCIÓN CR#1: NO validar stock aquí
            // La validación ocurre DENTRO de procesarSalidaVenta() con lockForUpdate()
            // Esto previene race conditions TOC/TOU

            // Procesar salida de stock (incluye validación con lock)
            $stockService->procesarSalidaVenta($productosParaStock, $this->numero, $almacenId);

        } catch (Exception $e) {
            Log::error("Error procesando stock para venta {$this->numero}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Revertir movimientos de stock al eliminar venta
     *
     * IMPORTANTE: Actualiza tanto cantidad como cantidad_disponible
     */
    public function revertirMovimientosStock(): void
    {
        // ✅ REFACTORIZADO (2026-03-27): Revertir movimientos de venta AGRUPADOS
        // Busca AMBOS tipos de movimiento:
        // - SALIDA_VENTA: Ventas creadas directamente (sin proforma)
        // - CONSUMO_RESERVA: Ventas convertidas desde proforma

        $movimientos = MovimientoInventario::where('numero_documento', $this->numero)
            ->whereIn('tipo', [
                MovimientoInventario::TIPO_SALIDA_VENTA,
                'CONSUMO_RESERVA'
            ])
            ->lockForUpdate()
            ->get();

        if ($movimientos->isEmpty()) {
            Log::warning('⚠️ No hay movimientos de venta para revertir', [
                'venta' => $this->numero,
            ]);
            return;
        }

        DB::transaction(function () use ($movimientos) {
            // Agrupar movimientos por producto
            $movimientosPorProducto = $movimientos->groupBy(function ($mov) {
                // Si el movimiento tiene JSON con detalles_lotes (agregado)
                // extraer producto_id del stock_producto del primer detalle
                if ($mov->stockProducto) {
                    return $mov->stockProducto->producto_id;
                }
                return null;
            })->filter();

            foreach ($movimientosPorProducto as $productoId => $productosMovimientos) {
                $detallesLotes = [];
                $cantidadTotalARevertir = 0;
                $almacenId = null;

                // Procesar todas los movimientos de este producto
                foreach ($productosMovimientos as $movimiento) {
                    $cantidadADevolver = abs($movimiento->cantidad);
                    $stock = $movimiento->stockProducto;
                    $almacenId = $stock->almacen_id;

                    // ✅ Si el movimiento es AGRUPADO (tiene detalles_lotes en JSON)
                    // extraer los detalles y revertirvarios lotes
                    $observacionData = $movimiento->observacion ? json_decode($movimiento->observacion, true) : [];

                    if (!empty($observacionData['detalles_lotes'])) {
                        // Movimiento AGRUPADO: procesar cada lote del JSON
                        foreach ($observacionData['detalles_lotes'] as $detalleJson) {
                            $stock_id = $detalleJson['stock_producto_id'] ?? null;
                            $stockLote = \App\Models\StockProducto::find($stock_id);

                            if (!$stockLote) {
                                Log::warning('Stock producto no encontrado al revertir', [
                                    'stock_producto_id' => $stock_id,
                                    'venta' => $this->numero,
                                ]);
                                continue;
                            }

                            $cantidadLote = abs($detalleJson['cantidad'] ?? 0);
                            $cantidadAnterior = (float) ($detalleJson['cantidad_total_anterior'] ?? 0);
                            $cantidadDisponibleAnterior = (float) ($detalleJson['cantidad_disponible_anterior'] ?? 0);
                            $cantidadReservadaAnterior = (float) ($detalleJson['cantidad_reservada_anterior'] ?? 0);

                            // Restaurar stock: incrementar cantidad y cantidad_disponible
                            $stockLote->increment('cantidad', $cantidadLote);
                            $stockLote->increment('cantidad_disponible', $cantidadLote);

                            // Recargar para obtener DESPUÉS
                            $stockLote->refresh();
                            $cantidadPosterior = (float) $stockLote->cantidad;
                            $cantidadDisponiblePosterior = (float) $stockLote->cantidad_disponible;
                            $cantidadReservadaPosterior = (float) $stockLote->cantidad_reservada;

                            // Agregar detalle para movimiento agrupado de reversión
                            $detallesLotes[] = [
                                'stock_producto_id' => $stockLote->id,
                                'lote' => $stockLote->lote,
                                'cantidad' => $cantidadLote,  // Positivo: entrada (reversión)
                                'cantidad_total_anterior' => $cantidadAnterior,
                                'cantidad_total_posterior' => $cantidadPosterior,
                                'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                                'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                                'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                                'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                            ];

                            $cantidadTotalARevertir += $cantidadLote;

                            // Eliminar lote si queda en 0
                            if ($cantidadPosterior <= 0) {
                                Log::info('Eliminando lote por anulación de venta', [
                                    'venta' => $this->numero,
                                    'stock_producto_id' => $stockLote->id,
                                    'producto_id' => $stockLote->producto_id,
                                    'lote' => $stockLote->lote,
                                ]);

                                // Eliminar movimientos asociados primero (FK constraint)
                                \App\Models\MovimientoInventario::where('stock_producto_id', $stockLote->id)
                                    ->forceDelete();

                                $stockLote->forceDelete();
                            }
                        }
                    } else {
                        // Movimiento ANTIGUO (per-lote): procesar directamente
                        $cantidadAnterior = (float) $stock->cantidad;
                        $cantidadDisponibleAnterior = (float) $stock->cantidad_disponible;
                        $cantidadReservadaAnterior = (float) $stock->cantidad_reservada;

                        // Restaurar stock
                        $stock->increment('cantidad', $cantidadADevolver);
                        $stock->increment('cantidad_disponible', $cantidadADevolver);

                        // Recargar
                        $stock->refresh();
                        $cantidadPosterior = (float) $stock->cantidad;
                        $cantidadDisponiblePosterior = (float) $stock->cantidad_disponible;
                        $cantidadReservadaPosterior = (float) $stock->cantidad_reservada;

                        $detallesLotes[] = [
                            'stock_producto_id' => $stock->id,
                            'lote' => $stock->lote,
                            'cantidad' => $cantidadADevolver,
                            'cantidad_total_anterior' => $cantidadAnterior,
                            'cantidad_total_posterior' => $cantidadPosterior,
                            'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                            'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                            'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                            'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                        ];

                        $cantidadTotalARevertir += $cantidadADevolver;

                        if ($cantidadPosterior <= 0) {
                            Log::info('Eliminando lote por anulación de venta', [
                                'venta' => $this->numero,
                                'stock_producto_id' => $stock->id,
                            ]);

                            \App\Models\MovimientoInventario::where('stock_producto_id', $stock->id)
                                ->forceDelete();

                            $stock->forceDelete();
                        }
                    }
                }

                // ✅ REFACTORIZADO (2026-03-27): Crear UN SOLO movimiento ENTRADA_AJUSTE agregado
                if ($cantidadTotalARevertir > 0 && $almacenId) {
                    $movimientoService = new \App\Services\Stock\MovimientoInventarioService();
                    $movimiento = $movimientoService->registrarMovimientoAgrupado(
                        $productoId,
                        $almacenId,
                        MovimientoInventario::TIPO_ENTRADA_AJUSTE,
                        'venta_anulacion',  // ✅ CORREGIDO (2026-04-05): Parámetro requerido
                        $cantidadTotalARevertir,  // Positivo: entrada/reversión
                        $this->numero . '-REV',
                        $detallesLotes,
                        [
                            // 'referencia_tipo' => 'venta_anulacion',  // ← Movido a parámetro directo
                            'referencia_id' => $this->id,
                            'observacion_extra' => [
                                'venta_numero' => $this->numero,
                                'venta_id' => $this->id,
                                'motivo' => 'Reversión por anulación de venta',
                            ]
                        ]
                    );

                    Log::info('✅ Movimiento de reversión agrupado registrado', [
                        'venta' => $this->numero,
                        'producto_id' => $productoId,
                        'movimiento_id' => $movimiento->id,
                        'cantidad_lotes' => count($detallesLotes),
                        'cantidad_total' => $cantidadTotalARevertir,
                    ]);
                }
            }

            Log::info('✅ Movimientos de venta revertidos exitosamente (AGRUPADOS)', [
                'venta' => $this->numero,
                'movimientos_procesados' => $movimientos->count(),
                'productos_revertidos' => count($movimientosPorProducto),
            ]);
        });
    }

    /**
     * Revertir movimiento de caja al anular venta
     *
     * Crea un movimiento de egreso (monto negativo) para compensar el ingreso original
     */
    public function revertirMovimientoCaja(): void
    {
        if (!$this->movimientoCaja) {
            return;
        }

        try {
            $movimientoOriginal = $this->movimientoCaja;

            // Obtener el tipo de operación ANULACION para la reversión
            $tipoOperacionAnulacion = TipoOperacionCaja::where('codigo', 'ANULACION')->firstOrFail();

            // 1️⃣ Crear movimiento de reversión con monto negativo (para el movimiento principal de la venta)
            MovimientoCaja::create([
                'caja_id'             => $movimientoOriginal->caja_id,
                'user_id'             => Auth::id(),
                'fecha'               => now(),
                'monto'               => -abs($movimientoOriginal->monto), // Negativo para restar
                'observaciones'       => "Anulación de venta #{$this->numero}",
                'numero_documento'    => $this->numero . '-ANU',
                'tipo_operacion_id'   => $tipoOperacionAnulacion->id,
                'tipo_pago_id'        => $movimientoOriginal->tipo_pago_id, // Mantener mismo tipo de pago
                'venta_id'            => $this->id,
            ]);

            Log::info('Movimiento de caja revertido por anulación de venta', [
                'venta'                  => $this->numero,
                'movimiento_original_id' => $movimientoOriginal->id,
                'monto_original'         => $movimientoOriginal->monto,
                'monto_reversa'          => -abs($movimientoOriginal->monto),
            ]);

            // 2️⃣ ✅ NUEVO (2026-05-04): Anular movimientos de VUELTO asociados a la venta
            // Si la venta tuvo vuelto (cambio), también debe anularse
            $movimientosVuelto = MovimientoCaja::where('venta_id', $this->id)
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->where('tipo_operacion_caja.codigo', 'VUELTO')
                ->select('movimientos_caja.*')
                ->get();

            if ($movimientosVuelto->isNotEmpty()) {
                foreach ($movimientosVuelto as $vueltoOriginal) {
                    // El vuelto está registrado como negativo, pero para anularlo necesitamos su opuesto
                    // Vuelto original: -14 (salida)
                    // Anulación de vuelto: +14 (entrada/reversión)
                    MovimientoCaja::create([
                        'caja_id'             => $vueltoOriginal->caja_id,
                        'user_id'             => Auth::id(),
                        'fecha'               => now(),
                        'monto'               => abs($vueltoOriginal->monto), // Positivo (opuesto del vuelto)
                        'observaciones'       => "Anulación de vuelto - venta #{$this->numero}",
                        'numero_documento'    => $this->numero . '-VUELTO-ANU',
                        'tipo_operacion_id'   => $tipoOperacionAnulacion->id,
                        'venta_id'            => $this->id,
                    ]);

                    Log::info('✅ Movimiento de vuelto anulado al anular venta', [
                        'venta'                  => $this->numero,
                        'movimiento_vuelto_id'   => $vueltoOriginal->id,
                        'monto_vuelto_original'  => $vueltoOriginal->monto,
                        'monto_anulacion_vuelto' => abs($vueltoOriginal->monto),
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error al revertir movimiento de caja para venta ' . $this->numero, [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Obtener resumen de stock afectado
     */
    public function obtenerResumenStock(): array
    {
        $movimientos = MovimientoInventario::where('numero_documento', $this->numero)
            ->with(['stockProducto.producto', 'stockProducto.almacen'])
            ->get();

        return $movimientos->map(function ($movimiento) {
            return [
                'producto'        => $movimiento->stockProducto->producto->nombre,
                'almacen'         => $movimiento->stockProducto->almacen->nombre,
                'cantidad_movida' => abs($movimiento->cantidad),
                'stock_anterior'  => $movimiento->cantidad_anterior,
                'stock_actual'    => $movimiento->cantidad_posterior,
            ];
        })->toArray();
    }

    /**
     * Generar asiento contable automático
     */
    public function generarAsientoContable(): void
    {
        try {
            // No crear asiento si ya existe
            if ($this->asientoContable) {
                return;
            }

            AsientoContable::crearParaVenta($this);

            Log::info("Asiento contable generado para venta {$this->numero}");
        } catch (Exception $e) {
            Log::error("Error generando asiento contable para venta {$this->numero}: " . $e->getMessage());
        }
    }

    /**
     * Eliminar asiento contable
     */
    public function eliminarAsientoContable(): void
    {
        try {
            if ($this->asientoContable) {
                $this->asientoContable->delete();
                Log::info("Asiento contable eliminado para venta {$this->numero}");
            }
        } catch (Exception $e) {
            Log::error("Error eliminando asiento contable para venta {$this->numero}: " . $e->getMessage());
        }
    }

    /**
     * Generar movimiento de caja automático
     *
     * ✅ MEJORADO: Ahora acepta cajaId desde el controller via _caja_id attribute
     * Si no se proporciona, busca automáticamente la caja abierta del usuario
     */
    public function generarMovimientoCaja(): void
    {
        try {
            // ✅ CORREGIDO (2026-03-02): Crear movimiento si hay monto_pagado > 0, sin restricción de tipo de pago
            // Antes: Solo creaba para CONTADO, ahora: crea para cualquier tipo de pago si pagó algo
            if (($this->monto_pagado ?? 0) <= 0) {
                Log::debug("No hay monto_pagado para venta {$this->numero}, no se crea movimiento de caja");
                return;
            }

            // No crear movimiento si ya existe
            if ($this->movimientoCaja) {
                return;
            }

            // ✅ Obtener cajaId: primero del controller (via _caja_id), luego de la base de datos
            $cajaId = $this->getAttribute('_caja_id');

            if (!$cajaId) {
                // ✅ DEBUG COMPLETO: Verificar todas las cajas abiertas
                Log::warning("🔍 [generarMovimientoCaja] BUSCANDO CAJA ABIERTA - INICIO DEBUG", [
                    'usuario_id_venta' => $this->usuario_id,
                    'fecha_venta' => $this->fecha,
                ]);

                // 1. Ver TODAS las aperturas del usuario (sin filtros)
                $todasAperturas = AperturaCaja::where('user_id', $this->usuario_id)->get();
                Log::warning("📋 TODAS LAS APERTURAS DEL USUARIO:", [
                    'cantidad' => $todasAperturas->count(),
                    'aperturas' => $todasAperturas->map(fn($a) => [
                        'id' => $a->id,
                        'caja_id' => $a->caja_id,
                        'fecha' => $a->fecha,
                        'tiene_cierre' => $a->cierre()->exists(),
                    ])->toArray()
                ]);

                // 2. Ver TODAS las aperturas abiertas (sin cierre)
                $aperturasAbiertas = AperturaCaja::where('user_id', $this->usuario_id)
                    ->abiertas()
                    ->get();
                Log::warning("🔓 APERTURAS ABIERTAS (sin cierre):", [
                    'cantidad' => $aperturasAbiertas->count(),
                    'aperturas' => $aperturasAbiertas->map(fn($a) => [
                        'id' => $a->id,
                        'caja_id' => $a->caja_id,
                        'fecha' => $a->fecha,
                    ])->toArray()
                ]);

                // 3. Buscar con filtro de fecha
                $cajaAbierta = AperturaCaja::where('user_id', $this->usuario_id)
                    ->where('fecha', '<=', $this->fecha)  // ✅ Apertura antes o igual a la fecha de venta
                    ->abiertas()  // ✅ Usa scope: whereDoesntHave('cierre') - cajas SIN cierre
                    ->orderByDesc('fecha')  // ✅ Obtiene la apertura más reciente
                    ->first();

                if (!$cajaAbierta) {
                    Log::error("❌ NO HAY CAJA ABIERTA PARA GENERAR MOVIMIENTO DE VENTA {$this->numero}", [
                        'usuario_id' => $this->usuario_id,
                        'fecha_venta' => $this->fecha,
                        'nota' => 'Se requiere: user_id coincida, fecha_apertura <= fecha_venta, sin cierre'
                    ]);

                    return;
                }

                Log::info("✅ CAJA ABIERTA ENCONTRADA PARA VENTA {$this->numero}", [
                    'caja_id' => $cajaAbierta->caja_id,
                    'apertura_fecha' => $cajaAbierta->fecha,
                    'venta_fecha' => $this->fecha,
                    'dias_abierta' => $this->fecha->diffInDays($cajaAbierta->fecha),
                    'usuario_id' => $this->usuario_id
                ]);

                $cajaId = $cajaAbierta->caja_id;
            }

            // Obtener tipo de operación para venta
            $tipoOperacion = TipoOperacionCaja::where('codigo', 'VENTA')->first();

            if (! $tipoOperacion) {
                Log::warning('No existe tipo de operación VENTA para movimiento de caja');

                return;
            }

            // ✅ ACTUALIZADO (2026-05-03): Usar total de la venta (independiente de monto_pagado)
            MovimientoCaja::create([
                'caja_id'           => $cajaId,
                'tipo_operacion_id' => $tipoOperacion->id,
                'numero_documento'  => $this->numero,
                'descripcion'       => "Venta #{$this->numero} - Cliente: {$this->cliente?->nombre}",
                'monto'             => $this->total,  // ✅ Registra total de la venta (no monto pagado)
                'fecha'             => $this->fecha,
                'user_id'           => $this->usuario_id,
                'venta_id'          => $this->id,              // ✅ Asignar ID de venta
                'tipo_pago_id'      => $this->tipo_pago_id,    // ✅ Asignar tipo de pago
            ]);

            Log::info("Movimiento de caja generado para venta {$this->numero}", [
                'monto_registrado_en_caja' => $this->total,  // ✅ Total de la venta
                'monto_pagado_por_cliente' => $this->monto_pagado,  // Información adicional
                'total_venta' => $this->total,
                'tipo_pago' => $this->tipoPago?->nombre,
            ]);
        } catch (Exception $e) {
            Log::error("Error generando movimiento de caja para venta {$this->numero}: " . $e->getMessage());
        }
    }

    // ========== NUEVAS RELACIONES ==========

    /**
     * Relación con tipo de pago
     */
    public function tipoPago()
    {
        return $this->belongsTo(TipoPago::class);
    }

    /**
     * Relación con tipo de documento
     */
    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    /**
     * Relación many-to-many con impuestos
     */
    public function impuestos()
    {
        return $this->belongsToMany(Impuesto::class, 'venta_impuestos')
            ->withPivot(['base_imponible', 'porcentaje_aplicado', 'monto_impuesto'])
            ->withTimestamps();
    }

    /**
     * Relación hasMany con venta_impuestos (tabla pivot)
     */
    public function ventaImpuestos()
    {
        return $this->hasMany(VentaImpuesto::class);
    }

    /**
     * Relación con libro de ventas IVA
     */
    public function libroVentasIva()
    {
        return $this->hasOne(LibroVentasIva::class);
    }

    /**
     * Relación con factura electrónica
     */
    public function facturaElectronica()
    {
        return $this->hasOne(FacturaElectronica::class);
    }

    /**
     * Confirmaciones de entrega para esta venta
     *
     * Registros de confirmación de esta venta cuando fue entregada
     * Incluye fotos, firma digital, contexto de entrega (tienda abierta, cliente presente)
     * y motivos de rechazo si aplica
     *
     * Uso:
     *   $venta->confirmaciones              // Todas las confirmaciones
     *   $venta->confirmaciones()->first()   // Última confirmación (o la principal)
     */
    public function confirmaciones()
    {
        return $this->hasMany(EntregaVentaConfirmacion::class);
    }
}
