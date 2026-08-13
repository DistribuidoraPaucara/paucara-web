<?php
namespace App\Services\Venta;

use App\DTOs\Venta\CrearVentaDTO;
use App\DTOs\Venta\VentaResponseDTO;
use App\Exceptions\Stock\StockInsuficientException;
use App\Exceptions\Venta\EstadoInvalidoException;
use App\Models\EstadoDocumento;
use App\Models\Venta;
use App\Services\Stock\StockService;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use App\Services\MovimientoPrestableService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
/**
 * VentaService - Lógica de negocio para Ventas
 *
 * RESPONSABILIDADES:
 * ✓ Crear ventas
 * ✓ Aprobar/rechazar ventas
 * ✓ Cambiar estado de ventas
 * ✓ Consultar ventas
 * ✓ Coordinar con Stock y Contabilidad
 *
 * NO RESPONSABILIDADES:
 * ✗ HTTP/Controllers (eso es del Controller)
 * ✗ Formateo de respuesta (eso es del Controller)
 * ✗ Validación de Request (eso es de Form Request)
 * ✗ Transacciones (las maneja, pero no crea)
 */
class VentaService
{
    use ManagesTransactions, LogsOperations;

    public function __construct(
        private StockService $stockService,
        private ContabilidadService $contabilidadService,
        private VentaDistribucionService $ventaDistribucionService,
        private MovimientoPrestableService $movimientoPrestableService,
    ) {}

    /**
     * Crear una venta
     *
     * FLUJO:
     * 1. Validar datos
     * 2. Validar stock disponible
     * 3. Crear Venta en DB (transacción)
     * 4. Crear DetalleVenta
     * 5. Consumir stock
     * 6. Crear asientos contables
     * 7. Emitir evento VentaCreada
     * 8. Retornar DTO
     *
     * @throws StockInsuficientException
     * @throws \InvalidArgumentException
     */
    public function crear(CrearVentaDTO $dto, ?int $cajaId = null): VentaResponseDTO
    {
        Log::info('🔄 [VentaService::crear] Iniciando creación de venta', [
            'cliente_id'                          => $dto->cliente_id,
            'cantidad_detalles'                   => count($dto->detalles),
            'total'                               => $dto->total,
            'almacen_id'                          => $dto->almacen_id,
            'estado_documento_id_recibido_en_dto' => $dto->estado_documento_id,
            'proforma_id'                         => $dto->proforma_id,
            'timestamp'                           => now()->toIso8601String(),
        ]);

        // 1. Validar datos
        Log::debug('✓ [VentaService::crear] Validando detalles DTO');
        $dto->validarDetalles();

        // 2. Validar stock ANTES de la transacción
        // ✅ CORREGIDO (2026-07-24): CRÉDITO debe validar stock como cualquier venta
        // Solo FARMACIAS pueden vender sin stock disponible
        $esFarmacia = (bool) auth()->user()?->empresa?->es_farmacia;

        // COMBO: expandir antes de validar y decrementar stock.
        // $dto->detalles se preserva sin cambios para DetalleVenta.
        $detallesParaStock = $this->stockService->expandirCombos($dto->detalles);

        Log::info('🔄 [VentaService::crear] Validando stock disponible con VentaDistribucionService', [
            'detalles_count' => count($dto->detalles),
            'politica_pago'  => $dto->politica_pago,
            'almacen_id'     => auth()->user()?->empresa?->almacen_id ?? 1,
            'es_farmacia'    => $esFarmacia,
        ]);

        // ✅ NUEVO (2026-02-11): Usar VentaDistribucionService para validar
        // ✅ CORREGIDO (2026-07-24): SIEMPRE validar stock (CRÉDITO no es excepción)
        // Solo permitir venta sin stock si es FARMACIA
        $validacionStock = $this->ventaDistribucionService->validarDisponible(
            $detallesParaStock,
            $esFarmacia
        );

        if (! $validacionStock['valido']) {
            Log::warning('❌ [VentaService::crear] Stock insuficiente', [
                'detalles' => $validacionStock['detalles'],
                'politica_pago' => $dto->politica_pago,
            ]);
            throw StockInsuficientException::create($validacionStock['detalles']);
        }

        Log::info('✅ [VentaService::crear] Stock validado exitosamente', [
            'politica_pago' => $dto->politica_pago,
            'es_farmacia' => $esFarmacia,
        ]);

        // 3. Crear dentro de transacción
        // ✅ CORREGIDO (2026-07-24): CRÉDITO ahora valida stock como cualquier venta
        $venta = $this->transaction(function () use ($dto, $cajaId, $detallesParaStock, $esFarmacia) {
            Log::debug('🔄 [VentaService::crear] Iniciando transacción', [
                'proforma_id' => $dto->proforma_id,
            ]);

            // ✅ NUEVO: Usar estado_documento_id del DTO si viene especificado
            // De lo contrario, usar el estado inicial (PENDIENTE)
            if ($dto->estado_documento_id) {
                $estadoDocumentoId = $dto->estado_documento_id;
                Log::info('📋 [VentaService::crear] Usando estado_documento_id del DTO', [
                    'estado_documento_id' => $estadoDocumentoId,
                ]);
            } else {
                $estadoDocumentoId = EstadoDocumento::obtenerEstadoInicial();
                Log::info('📋 [VentaService::crear] Usando estado inicial por defecto', [
                    'estado_documento_id' => $estadoDocumentoId,
                ]);
            }

            // Obtener moneda por defecto (BOB - Bolivianos)
            $monedaDefecto = \App\Models\Moneda::where('codigo', 'BOB')->first() ??
            \App\Models\Moneda::first();

            // ✅ CORREGIDO (2026-05-04): Asignar estado_logistico_id = SIN_ENTREGA si no viene especificado
            // Esto permite que la venta aparezca inmediatamente en searchVentas para crear entregas
            $estadoLogisticoId = $dto->estado_logistico_id;
            if (!$estadoLogisticoId) {
                $estadoSinEntrega = \App\Models\EstadoLogistica::where('codigo', 'SIN_ENTREGA')
                    ->where('categoria', 'venta_logistica')
                    ->first();
                $estadoLogisticoId = $estadoSinEntrega?->id;
                Log::info('📦 [VentaService::crear] Estado logístico asignado a SIN_ENTREGA (por defecto)', [
                    'estado_id' => $estadoLogisticoId,
                    'codigo'    => 'SIN_ENTREGA',
                    'razon'     => 'Permite que la venta aparezca en searchVentas para crear entregas',
                ]);
            }

                                       // ✅ MODIFICADO (2026-02-10): Estado pago siempre PENDIENTE para ventas nuevas
            // Las ventas se crean siempre sin pago (estado_pago = PENDIENTE)
            // El pago se registra después en movimientos_caja
            $estadoPago = 'PENDIENTE';
            Log::info('💰 [VentaService::crear] Estado pago: PENDIENTE (nuevas ventas siempre sin pago)', [
                'politica_pago' => $dto->politica_pago,
                'nota'          => 'El pago se registra después en movimientos_caja, no al crear',
            ]);

            // ✅ NUEVO (2026-03-02): Si tipo_pago NO es CRÉDITO y monto_pagado_inicial es 0
            // Automáticamente asignar monto_pagado = total
            // PERO: Si hay pagos_parciales, NO auto-asignar (será calculado desde los pagos)
            $montoPagado = $dto->monto_pagado_inicial ?? 0;
            $tipoPagoId = $dto->tipo_pago_id;

            // ✅ NUEVO (2026-03-09): Si hay pagos parciales, NO auto-asignar monto_pagado
            // Los movimientos se crearán desde los pagos parciales únicamente
            $tienePagesParciales = !empty($dto->pagos);

            if (!$tienePagesParciales && $tipoPagoId && $montoPagado <= 0) {
                $tipoPago = \App\Models\TipoPago::find($tipoPagoId);

                // ✅ CORREGIDO (2026-03-02): Si NO es CRÉDITO, auto-asignar total
                // Esto cubre: EFECTIVO, TRANSFERENCIA/QR, TARJETA, etc.
                if ($tipoPago && strtoupper($tipoPago->codigo) !== 'CREDITO') {
                    $montoPagado = $dto->total;
                    Log::info('💳 [VentaService::crear] Tipo pago NO-CRÉDITO sin monto → Auto-asignar total', [
                        'total'        => $dto->total,
                        'monto_pagado' => $montoPagado,
                        'tipo_pago_codigo' => $tipoPago->codigo,
                        'tipo_pago_nombre' => $tipoPago->nombre,
                        'nota' => 'Auto-asignado porque NO es CRÉDITO'
                    ]);
                }
            } else if ($tienePagesParciales) {
                Log::info('💳 [VentaService::crear] Hay pagos parciales → NO auto-asignar monto_pagado', [
                    'cantidad_pagos' => count($dto->pagos),
                    'nota' => 'Los movimientos se registrarán desde los pagos parciales'
                ]);
            }

            // 3.1 Crear Venta
            Log::debug('📝 [VentaService::crear] Creando registro de Venta en BD', [
                'cliente_id'          => $dto->cliente_id,
                'total'               => $dto->total,
                'monto_pagado'        => $montoPagado,
                'estado_documento_id' => $estadoDocumentoId,
            ]);

            $venta = Venta::create([
                'numero'                     => '0',  // ✅ TEMP: Se asignará al ID después de crear
                'cliente_id'                 => $dto->cliente_id,
                'usuario_id'                 => $dto->usuario_id ?? Auth::id(),
                'preventista_id'             => $dto->preventista_id, // ✅ NUEVO (2026-03-01): Preventista responsable
                'fecha'                      => $dto->fecha,
                'subtotal'                   => $dto->subtotal,
                'descuento'                  => $dto->descuento,  // ✅ NUEVO: Registrar descuento del frontend
                'impuesto'                   => $dto->impuesto,
                'total'                      => $dto->total,
                'peso_total_estimado'        => $dto->peso_total_estimado ?? 0, // ✅ NUEVO: Peso total calculado
                'estado_documento_id'        => $estadoDocumentoId,
                'moneda_id'                  => $monedaDefecto?->id ?? 1,
                'observaciones'              => $dto->observaciones,
                'almacen_id'                 => $dto->almacen_id,
                'proforma_id'                => $dto->proforma_id, // ✅ CORREGIDO (2026-02-10): direccion_cliente_id solo se requiere si requiere_envio=true
                'direccion_cliente_id'       => ($dto->requiere_envio && $dto->direccion_cliente_id) ? $dto->direccion_cliente_id : null,
                // Campos de logística
                'requiere_envio'             => $dto->requiere_envio,
                'canal_origen'               => $dto->canal_origen ?? 'WEB',
                'estado_logistico_id'        => $estadoLogisticoId,  // ✅ MODIFICADO (2026-02-10): Usa variable calculada (SIN_ENTREGA por defecto) 
                // Campos de política de pago
                'tipo_pago_id'               => $dto->tipo_pago_id,  // ✅ NUEVO: Tipo de pago seleccionado
                'politica_pago'              => $dto->politica_pago ?? 'CONTRA_ENTREGA',
                'estado_pago'                => $estadoPago,                                             // ✅ Dinámico según pago inicial
                'monto_pagado'               => $montoPagado,  // ✅ CORREGIDO (2026-03-02): Usa monto calculado (total si CONTADO sin pago)
                'monto_pendiente'            => max(0, ($dto->subtotal - ($dto->descuento ?? 0)) - $montoPagado), // Campos de SLA y compromisos de entrega
                'fecha_entrega_comprometida' => $dto->fecha_entrega_comprometida,
                'hora_entrega_comprometida'  => $dto->hora_entrega_comprometida,
                'ventana_entrega_ini'        => $dto->ventana_entrega_ini,
                'ventana_entrega_fin'        => $dto->ventana_entrega_fin,
                'idempotency_key'            => $dto->idempotency_key,
                'caja_id'                    => $cajaId, // ✅ NUEVO: Caja donde se registró la venta
                'entrega_id'                 => $dto->entrega_id, // ✅ NUEVO (2026-03-03): Entrega asignada (opcional)
            ]);

            // ✅ NUEVO: Asignar número de venta con formato VEN + FECHA + ID
            $numeroVenta = 'VEN' . now()->format('Ymd') . '-' . str_pad($venta->id, 4, '0', STR_PAD_LEFT);
            $venta->update(['numero' => $numeroVenta]);
            Log::info('✅ [VentaService::crear] Número de venta asignado con ID', [
                'venta_id'     => $venta->id,
                'venta_numero' => $numeroVenta,
            ]);

            // ✅ NOTA: cajaId ya está guardado en $venta->caja_id desde la creación (línea 221)
            // No necesitamos setAttribute(_caja_id) porque update() lo intenta persistir a BD

            // ✅ REFACTORIZADO (2026-04-30): NO crear MovimientoCaja aquí para pagos desglosados
            // Los pagos parciales se registran SOLO en detalles_pago_venta
            // UN SOLO MovimientoCaja se crea con el tipo_pago_id y monto total de la venta
            // Los detalles de pagos se manejan completamente en detalles_pago_venta

            if (!empty($dto->pagos)) {
                Log::info('💳 [VentaService::crear] Pagos desglosados recibi dos (se registran en detalles_pago_venta)', [
                    'venta_id' => $venta->id,
                    'cantidad_pagos' => count($dto->pagos),
                    'total_venta' => $venta->total,
                    'nota' => 'Los detalles se registran en VentaController mediante PagoVentaService',
                ]);

                // Calcular total pagado para validación
                $totalPagosRegistrados = array_sum(array_column($dto->pagos, 'monto'));

                if ($totalPagosRegistrados > 0) {
                    $venta->update([
                        'monto_pagado' => $totalPagosRegistrados,
                        'monto_pendiente' => max(0, $venta->total - $totalPagosRegistrados),
                    ]);

                    Log::info('✅ [VentaService::crear] Montos actualizados (pagos se registran en detalles_pago_venta)', [
                        'venta_id' => $venta->id,
                        'monto_pagado' => $totalPagosRegistrados,
                        'monto_pendiente' => max(0, $venta->total - $totalPagosRegistrados),
                        'cantidad_pagos_desglosados' => count($dto->pagos),
                    ]);
                }
            }

            // 3.2 Crear detalles
            Log::debug('📦 [VentaService::crear] Creando detalles de venta');
            $detallesCreados = [];  // ✅ NUEVO: Guardar detalles creados con sus IDs

            foreach ($dto->detalles as $detalle) {
                // ✅ MODIFICADO: Respetar el precio_unitario enviado desde el frontend
                // El descuento también se considera al calcular el subtotal
                $cantidad = $detalle['cantidad'] ?? 0;
                $precio = $detalle['precio_unitario'] ?? 0;
                $descuento = $detalle['descuento'] ?? 0;
                $subtotal = ($cantidad * $precio) - $descuento;

                // ✅ NUEVO: Preparar combo_items_seleccionados si existen
                $comboItemsSeleccionados = null;
                if (isset($detalle['combo_items_seleccionados']) && is_array($detalle['combo_items_seleccionados'])) {
                    // ✅ DEBUG: Ver qué llega del frontend
                    Log::debug('📦 [VentaService::crear] combo_items_seleccionados recibidos del frontend', [
                        'producto_id' => $detalle['producto_id'],
                        'items_recibidos' => $detalle['combo_items_seleccionados'],
                    ]);

                    // Filtrar solo items que están incluidos (incluido = true)
                    $comboItemsSeleccionados = array_filter($detalle['combo_items_seleccionados'], function($item) {
                        return ($item['incluido'] ?? false) === true;
                    });
                    // Reindexar array después de filter
                    $comboItemsSeleccionados = array_values($comboItemsSeleccionados);

                    Log::debug('📦 [VentaService::crear] Items del combo seleccionados', [
                        'producto_id' => $detalle['producto_id'],
                        'cantidad_items_seleccionados' => count($comboItemsSeleccionados),
                        'total_items' => count($detalle['combo_items_seleccionados']),
                        'items_después_filtro' => $comboItemsSeleccionados,
                    ]);
                }

                $detalleVenta = \App\Models\DetalleVenta::create([
                    'venta_id'           => $venta->id,
                    'producto_id'        => $detalle['producto_id'],
                    'cantidad'           => $cantidad,
                    'precio_unitario'    => $precio,
                    'descuento'          => $descuento,
                    'subtotal'           => $subtotal,
                    'tipo_precio_id'     => $detalle['tipo_precio_id'] ?? null,    // ✅ NUEVO: Tipo de precio seleccionado
                    'tipo_precio_nombre' => $detalle['tipo_precio_nombre'] ?? null, // ✅ NUEVO: Nombre del tipo de precio
                    'combo_items_seleccionados' => $comboItemsSeleccionados ? array_map(function($item) {
                        return [
                            'combo_item_id' => $item['combo_item_id'] ?? null,
                            'producto_id' => $item['producto_id'] ?? null,
                            'cantidad' => $item['cantidad'] ?? 0, // ✅ NUEVO (2026-03-28): Incluir cantidad para impresión
                            'precio_unitario' => $item['precio_unitario'] ?? 0, // ✅ NUEVO (2026-06-02): Incluir precio para mostrar en detalles
                            'incluido' => $item['incluido'] ?? false,
                        ];
                    }, $comboItemsSeleccionados) : null, // ✅ NUEVO: Items del combo seleccionados
                ]);

                // ✅ NUEVO (2026-07-24): Guardar detalle con su ID para pasar a consumirStock
                $detallesCreados[$detalle['producto_id']] = $detalleVenta->id;
            }
            Log::info('✅ [VentaService::crear] Detalles de venta creados', [
                'venta_id'          => $venta->id,
                'cantidad_detalles' => count($dto->detalles),
            ]);

            // ✅ NUEVO: Recalcular peso_total_estimado considerando combos
            // Si el DTO no vino con peso o vino con 0, calcular desde detalles
            if (($dto->peso_total_estimado ?? 0) <= 0) {
                $pesoTotalCalculado = 0;
                $detallesCreados = $venta->detalles()->get();

                foreach ($detallesCreados as $detalle) {
                    // Si el detalle tiene combo_items_seleccionados, calcular peso desde los items del combo
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
                        $pesoTotalCalculado += $pesoCombo * (float) $detalle->cantidad;
                    } else {
                        // Producto normal (no es combo o combo vacío)
                        $pesoProd = (float) ($detalle->producto?->peso_unitario ?? 0);
                        $pesoTotalCalculado += $pesoProd * (float) $detalle->cantidad;
                    }
                }

                Log::info("📊 [VentaService::crear] Peso recalculado para venta {$venta->id}: {$pesoTotalCalculado} kg (considerando combos)", [
                    'venta_id' => $venta->id,
                    'peso_anterior' => $dto->peso_total_estimado ?? 0,
                    'peso_calculado' => $pesoTotalCalculado,
                    'tiene_combos' => count(array_filter($detallesCreados->all(), fn($d) => !empty($d->combo_items_seleccionados))) > 0,
                ]);

                // Actualizar peso en la venta
                $venta->update(['peso_total_estimado' => $pesoTotalCalculado]);
            }

            // 3.3 Consumir stock usando VentaDistribucionService (centralizado FIFO)
            // ✅ NUEVO (2026-02-11): Usar VentaDistribucionService centralizado
            Log::debug('🔄 [VentaService::crear] Procesando salida de stock con VentaDistribucionService', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'politica_pago' => $dto->politica_pago,
                'es_farmacia' => $esFarmacia,
            ]);

            // ✅ NUEVO (2026-07-24): Enriquecer detalles con detalle_venta_id y combo_padre_id para venta_por_lotes
            $detallesParaStockEnriquecidos = array_map(function($item) use ($detallesCreados, $dto) {
                $productoId = $item['producto_id'] ?? $item['id'];

                // Buscar el detalle_venta_id del producto original (antes de expandir combo)
                $detalleVentaId = $detallesCreados[$productoId] ?? null;

                // Si es componente de un combo, buscar el combo padre en detalles originales
                $comboPadreId = null;
                if (isset($item['combo_padre_id'])) {
                    // Ya viene del expandirCombos con combo_padre_id
                    $comboPadreId = $item['combo_padre_id'];
                }

                return array_merge($item, [
                    'detalle_venta_id' => $detalleVentaId,
                    'combo_padre_id'   => $comboPadreId,
                ]);
            }, $detallesParaStock);

            // ✅ CORREGIDO (2026-07-24): CRÉDITO NO permite stock negativo (valida como cualquier venta)
            // Solo FARMACIA permite venta sin stock
            $movimientosStock = $this->ventaDistribucionService->consumirStock(
                $detallesParaStockEnriquecidos,  // ✅ MODIFICADO: Usar detalles enriquecidos
                $venta->numero,
                ventaId: $venta->id,                 // ✅ NUEVO (2026-06-29): Pasar venta_id para referencia_id
                permitirStockNegativo: false,        // ✅ CORREGIDO: CRÉDITO NO permite stock negativo
                esFarmacia: $esFarmacia              // ✅ NUEVO (2026-05-08): Permite venta sin stock en farmacia
            );

            // ✅ CORREGIDO (2026-06-29): Validar que todos los productos fueron procesados
            // Nota: Cantidad de movimientos ≠ cantidad de productos
            // Un producto puede estar en múltiples lotes → múltiples movimientos por un producto
            // Validar que se crearon movimientos (al menos uno por producto)
            $cantidadMovimientos = count($movimientosStock);
            $cantidadProductosUnicos = collect($detallesParaStock)
                ->pluck('producto_id')
                ->unique()
                ->count();

            // Validar que hay al menos tantos movimientos como productos
            // (pueden haber más si un producto está en múltiples lotes)
            if ($cantidadMovimientos < $cantidadProductosUnicos || $cantidadMovimientos === 0) {
                Log::error('❌ [VentaService::crear] Producto(s) sin movimiento de inventario', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'productos_esperados' => $cantidadProductosUnicos,
                    'movimientos_creados' => $cantidadMovimientos,
                    'detalles' => $detallesParaStock,
                ]);

                throw new \Exception(
                    "Error crítico: Se esperaban {$cantidadProductosUnicos} producto(s) pero " .
                    "solo se crearon {$cantidadMovimientos} movimiento(s). " .
                    "Venta {$venta->numero} requiere revisión manual."
                );
            }

            Log::info('✅ [VentaService::crear] Stock procesado exitosamente con VentaDistribucionService', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'movimientos_creados' => count($movimientosStock),
                'productos_procesados' => $cantidadProductosUnicos,
                'politica_pago' => $dto->politica_pago,
            ]);

            // 3.4 Crear asiento contable (COMENTADO: Se habilitará cuando CuentasContables esté configurado)
            // \Log::debug('🔄 [VentaService::crear] Creando asiento contable');
            // $this->contabilidadService->crearAsientoVenta($venta);
            Log::info('✅ [VentaService::crear] Asiento contable omitido (será habilitado después)');

            // 3.5 Generar token de acceso público
            Log::debug('🔐 [VentaService::crear] Generando token de acceso público');
            \App\Models\VentaAccessToken::create([
                'venta_id'  => $venta->id,
                'token'     => \App\Models\VentaAccessToken::generateToken(),
                'is_active' => true,
            ]);
            Log::info('✅ [VentaService::crear] Token de acceso creado');

            // 3.6 Emitir evento (DESPUÉS de que todo esté persisted)
            Log::debug('📢 [VentaService::crear] Disparando evento VentaCreada');
            // ✅ NUEVO (2026-07-24): Pasar flag de pagos desglosados para que el listener lo sepa
            $tienePagosDesglosados = !empty($dto->pagos);
            event(new \App\Events\VentaCreada($venta, $tienePagosDesglosados));

            return $venta;
        });

        // 4. Log de éxito
        Log::info('✅ [VentaService::crear] Venta creada exitosamente', [
            'venta_id'   => $venta->id,
            'cliente_id' => $venta->cliente_id,
            'total'      => $venta->total,
            'timestamp'  => now()->toIso8601String(),
        ]);

        // 5. Retornar DTO
        return VentaResponseDTO::fromModel($venta);
    }

    /**
     * Aprobar una venta (cambiar de PENDIENTE a APROBADA)
     *
     * @throws EstadoInvalidoException
     */
    public function aprobar(int $ventaId): VentaResponseDTO
    {
        $venta = $this->transaction(function () use ($ventaId) {
            // Obtener con lock pesimista
            $venta = Venta::lockForUpdate()->findOrFail($ventaId);

            // Validar transición de estado
            if ($venta->estado !== 'Pendiente') {
                throw EstadoInvalidoException::transicionInvalida(
                    'Venta',
                    $ventaId,
                    $venta->estado,
                    'Aprobado'
                );
            }

            // Cambiar estado
            $venta->update(['estado_documento_id' => EstadoDocumento::where('nombre', 'Aprobado')->first()->id]);

            // Emitir evento
            event(new \App\Events\VentaAprobada($venta));

            return $venta;
        });

        $this->logSuccess('Venta aprobada', ['venta_id' => $ventaId]);

        return VentaResponseDTO::fromModel($venta);
    }

    /**
     * Rechazar una venta (cambiar a RECHAZADA)
     *
     * Implica revertir stock, contabilidad, etc
     *
     * @throws EstadoInvalidoException
     */
    public function rechazar(int $ventaId, string $motivo = ''): VentaResponseDTO
    {
        $venta = $this->transaction(function () use ($ventaId, $motivo) {
            $venta = Venta::lockForUpdate()->findOrFail($ventaId);

            // Si ya está en estado final, no se puede rechazar
            if (in_array($venta->estado, ['Facturado', 'Anulado', 'Cancelado'])) {
                throw EstadoInvalidoException::transicionInvalida(
                    'Venta',
                    $ventaId,
                    $venta->estado,
                    'Cancelado'
                );
            }

            // Revertir stock si ya se consumió
            if ($venta->estado === 'Aprobado') {
                // ✅ CORREGIDO (2026-04-05): Usar VentaDistribucionService para registrar totales correctos
                // StockService::devolverStock() solo registra por lote (incorrecto)
                // VentaDistribucionService::devolverStock() registra totales del producto (correcto)
                $this->ventaDistribucionService->devolverStock($venta->numero);
            }

            // Cambiar estado a Cancelado
            $estadoCancelado = EstadoDocumento::where('nombre', 'Cancelado')->first();
            $venta->update([
                'estado_documento_id' => $estadoCancelado->id,
                'observaciones'       => ($venta->observaciones ?? '') . "\nMotivo rechazo: {$motivo}",
            ]);

            // Emitir evento
            event(new \App\Events\VentaRechazada($venta, $motivo));

            return $venta;
        });

        $this->logSuccess('Venta rechazada', [
            'venta_id' => $ventaId,
            'motivo'   => $motivo,
        ]);

        return VentaResponseDTO::fromModel($venta);
    }

    /**
     * Obtener una venta por ID
     */
    public function obtener(int $ventaId): VentaResponseDTO
    {
        $venta = $this->read(fn() => Venta::with([
            'detalles.producto.prestables', // ✅ ACTUALIZADO: Incluir prestables relacionados para cargar en préstamos
            'cliente.localidad',             // ✅ ACTUALIZADO: Cargar localidad del cliente
            'cliente.direcciones',           // ✅ ACTUALIZADO: Cargar direcciones del cliente
            'cliente.user',                  // ✅ ACTUALIZADO: Cargar usuario asociado al cliente
            'cliente.categorias',            // ✅ ACTUALIZADO: Cargar categorías del cliente
            'usuario',
            'estadoDocumento',
            'moneda',
            'tipoPago',
            'proforma',
            'direccionCliente.localidad', // ✅ Cargar localidad para mapas
            'estadoLogistica',            // ✅ NUEVO: Estado logístico
            'confirmaciones',             // ✅ NUEVO: Cargar confirmación de entrega (entregas_venta_confirmaciones)
            'detallesPagoVenta.tipoPago', // ✅ NUEVO: Detalles de pagos con tipo de pago
        ])->findOrFail($ventaId));

        return VentaResponseDTO::fromModel($venta);
    }

    /**
     * Listar ventas con paginación
     *
     * @param int $perPage
     * @param array $filtros Puede incluir: estado, estado_documento_id, cliente_id, usuario_id, fecha_desde, fecha_hasta, numero, search, monto_min, monto_max, moneda_id
     */
    public function listar(int $perPage = 15, array $filtros = [], string $sortBy = 'id', string $sortOrder = 'desc'): Paginator | LengthAwarePaginator
    {
        return $this->read(function () use ($perPage, $filtros, $sortBy, $sortOrder) {
            // ✅ OPTIMIZACIÓN (2026-08-12): Detectar si hay filtros de búsqueda
            // Si NO hay filtros, limitar a últimas 200 ventas para evitar cargar 4000+ registros
            $tieneFiltrosBusqueda = !empty(array_filter([
                $filtros['id'] ?? null,
                $filtros['id_desde'] ?? null,
                $filtros['id_hasta'] ?? null,
                $filtros['estado'] ?? null,
                $filtros['estado_documento_id'] ?? null,
                $filtros['cliente_id'] ?? null,
                $filtros['busqueda_cliente'] ?? null,
                $filtros['usuario_id'] ?? null,
                $filtros['tipo_pago_id'] ?? null,
                $filtros['preventista_id'] ?? null,
                $filtros['fecha_desde'] ?? null,
                $filtros['fecha_hasta'] ?? null,
                $filtros['numero'] ?? null,
                $filtros['search'] ?? null,
                $filtros['monto_min'] ?? null,
                $filtros['monto_max'] ?? null,
                $filtros['moneda_id'] ?? null,
                $filtros['tipo_venta'] ?? null,
                $filtros['estado_pago'] ?? null,
                $filtros['estado_logistico'] ?? null,
            ]));

            // ✅ ACTUALIZADO: Crear query SIN with() para que paginate() cuente correctamente
            // Las relaciones se cargarán DESPUÉS de paginar
            $query = Venta::query()
                ->when($filtros['id'] ?? null, fn($q, $id) =>
                    $q->where('id', $id)
                )
                ->when($filtros['id_desde'] ?? null, fn($q, $idDesde) =>
                    $q->where('id', '>=', (int)$idDesde)
                )
                ->when($filtros['id_hasta'] ?? null, fn($q, $idHasta) =>
                    $q->where('id', '<=', (int)$idHasta)
                )
                ->when($filtros['estado'] ?? null, fn($q, $estado) =>
                    $q->where('estado', $estado)
                )
                ->when($filtros['estado_documento_id'] ?? null, fn($q, $estadoId) =>
                    $q->where('estado_documento_id', $estadoId)
                )
                ->when($filtros['cliente_id'] ?? null, fn($q, $clienteId) =>
                    // ✅ PRIORIDAD 1: Si es numérico, buscar por ID exacto
                    is_numeric($clienteId) && (int)$clienteId > 0
                        ? $q->where('cliente_id', (int)$clienteId)
                        // ✅ PRIORIDAD 2: Si no es numérico, buscar por campos textuales (case insensitive)
                        : $q->whereHas('cliente', fn($qCli) =>
                            $qCli->whereRaw('LOWER(codigo_cliente) like ?', ['%' . strtolower($clienteId) . '%'])
                                ->orWhereRaw('LOWER(nombre) like ?', ['%' . strtolower($clienteId) . '%'])
                                ->orWhereRaw('LOWER(nit) like ?', ['%' . strtolower($clienteId) . '%'])
                                ->orWhereRaw('LOWER(telefono) like ?', ['%' . strtolower($clienteId) . '%'])
                        )
                )
                ->when($filtros['busqueda_cliente'] ?? null, fn($q, $busqueda) =>
                    // ✅ PRIORIDAD 1: Si es numérico, buscar por ID exacto
                    is_numeric($busqueda) && (int)$busqueda > 0
                        ? $q->where('cliente_id', (int)$busqueda)
                        // ✅ PRIORIDAD 2: Si no es numérico, buscar por campos textuales (case insensitive)
                        : $q->whereHas('cliente', fn($qCli) =>
                            $qCli->whereRaw('LOWER(codigo_cliente) like ?', ['%' . strtolower($busqueda) . '%'])
                                ->orWhereRaw('LOWER(nombre) like ?', ['%' . strtolower($busqueda) . '%'])
                                ->orWhereRaw('LOWER(nit) like ?', ['%' . strtolower($busqueda) . '%'])
                                ->orWhereRaw('LOWER(telefono) like ?', ['%' . strtolower($busqueda) . '%'])
                        )
                )
                ->when($filtros['usuario_id'] ?? null, fn($q, $usuarioId) =>
                    $q->where('usuario_id', $usuarioId)
                )
                ->when($filtros['tipo_pago_id'] ?? null, fn($q, $tipoPagoId) =>
                    $q->where('tipo_pago_id', $tipoPagoId)  // ✅ NUEVO: Filtro por tipo de pago
                )
                ->when($filtros['preventista_id'] ?? null, fn($q, $preventistaId) =>
                    $q->where('preventista_id', $preventistaId)  // ✅ NUEVO (2026-03-01): Filtro por preventista
                )
                ->when($filtros['fecha_desde'] ?? null, fn($q, $fecha) =>
                    $q->where('created_at', '>=', $fecha . ' 00:00:00')
                )
                ->when($filtros['fecha_hasta'] ?? null, fn($q, $fecha) =>
                    $q->where('created_at', '<=', $fecha . ' 23:59:59')
                )
                ->when($filtros['numero'] ?? null, fn($q, $numero) =>
                    $q->where('numero', 'like', '%' . $numero . '%')
                )
                ->when($filtros['search'] ?? null, fn($q, $search) =>
                    $q->where(function ($subQuery) use ($search) {
                        // Si el término es un número, buscar por ID exacto primero
                        if (is_numeric($search)) {
                            $subQuery->where('id', '=', (int)$search)
                                ->orWhere('numero', '=', $search); // Búsqueda exacta por número
                        } else {
                            // Para términos no numéricos, buscar al inicio del número (más exacto que parcial)
                            $subQuery->whereRaw('LOWER(numero) like ?', [strtolower($search) . '%'])
                                ->orWhereHas('cliente', fn($qCli) =>
                                    $qCli->whereRaw('LOWER(nombre) like ?', ['%' . strtolower($search) . '%'])
                                );
                        }
                    })
                )
                ->when($filtros['monto_min'] ?? null, fn($q, $monto) =>
                    $q->where('total', '>=', $monto)
                )
                ->when($filtros['monto_max'] ?? null, fn($q, $monto) =>
                    $q->where('total', '<=', $monto)
                )
                ->when($filtros['moneda_id'] ?? null, fn($q, $monedaId) =>
                    $q->where('moneda_id', $monedaId)
                )
                ->when($filtros['tipo_venta'] ?? null, fn($q, $tipoVenta) =>
                    $tipoVenta === 'delivery'
                        ? $q->where('requiere_envio', true)
                        : ($tipoVenta === 'presencial' ? $q->where('requiere_envio', false) : $q)
                )
            // ✅ NUEVO: Filtro de estado de pago (para Flutter app)
                ->when($filtros['estado_pago'] ?? null, fn($q, $estadoPago) =>
                    $q->where('estado_pago', $estadoPago)
                )
            // ✅ NUEVO: Filtro de estado logístico (para Flutter app)
            // Filtrar por código de estado_logistica a través de la relación
                ->when($filtros['estado_logistico'] ?? null, fn($q, $estadoLogistico) =>
                    $q->whereHas('estadoLogistica', fn($subQ) =>
                        $subQ->where('codigo', $estadoLogistico)
                    )
                );

            // ✅ OPTIMIZACIÓN (2026-08-12): Si NO hay filtros de búsqueda, limitar a últimas 200 ventas
            // Esto acelera significativamente el listado inicial sin afectar búsquedas filtradas
            if (!$tieneFiltrosBusqueda) {
                // Obtener el ID mínimo de las últimas 200 ventas ordenadas DESC
                $idMinimoDe200 = Venta::orderBy('id', 'desc')
                    ->limit(200)
                    ->min('id');

                if ($idMinimoDe200) {
                    $query->where('id', '>=', $idMinimoDe200);
                    Log::debug('⚡ [VentaService::listar] Listado sin filtros → Limitando a últimas 200 ventas', [
                        'id_minimo' => $idMinimoDe200,
                        'razon' => 'Sin filtros de búsqueda, para optimizar rendimiento con 4000+ registros',
                    ]);
                }
            }

            // ✅ NUEVO: Aplicar ordenamiento dinámico con validación
            // Campos permitidos para ordenamiento: id, created_at, updated_at, fecha, numero, total, estado
            $camposPermitidos = ['id', 'created_at', 'updated_at', 'fecha', 'numero', 'total', 'estado'];
            $sortBy = in_array(strtolower($sortBy), $camposPermitidos) ? $sortBy : 'id';
            $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'asc' : 'desc';

            // ✅ CORREGIDO (2026-08-13): Usar simplePaginate() cuando NO hay filtros
            // Esto evita el count() de todos los registros
            $paginationMethod = $tieneFiltrosBusqueda ? 'paginate' : 'simplePaginate';

            $resultado = $query
                ->orderBy($sortBy, $sortOrder)
                ->{$paginationMethod}($perPage);

            // ✅ Cargar relaciones DESPUÉS de paginar (para cada item en la colección)
            $resultado->getCollection()->transform(function ($venta) {
                return $venta->load([
                    'cliente.localidad',
                    'cliente.direcciones',
                    'cliente.user',
                    'cliente.categorias',
                    'estadoDocumento',
                    'usuario',
                    'moneda',
                    'direccionCliente.localidad',
                    'estadoLogistica',
                    'detalles.producto',
                    'proforma',
                    'confirmaciones',
                    'preventista',
                    'entrega.chofer',
                    'entrega.vehiculo',
                ]);
            });

            return $resultado;
        });
    }

    /**
     * Registrar pago en venta
     *
     * @throws EstadoInvalidoException
     */
    public function registrarPago(int $ventaId, float $monto): VentaResponseDTO
    {
        $venta = $this->transaction(function () use ($ventaId, $monto) {
            $venta = Venta::lockForUpdate()->findOrFail($ventaId);

            // Validar que esté en estado para pagar
            if (! in_array($venta->estado, ['ENTREGADA', 'PAGADA'])) {
                throw EstadoInvalidoException::transicionInvalida(
                    'Venta',
                    $ventaId,
                    $venta->estado,
                    'PAGADA'
                );
            }

            // Crear registro de pago
            \App\Models\Pago::create([
                'venta_id'   => $ventaId,
                'usuario_id' => Auth::id(),
                'monto'      => $monto,
                'fecha'      => now(),
            ]);

            // Calcular total pagado
            $totalPagado = $venta->pagos()->sum('monto') + $monto;

            // Si está completamente pagada, cambiar estado
            if ($totalPagado >= $venta->total) {
                $venta->update(['estado' => 'PAGADA']);
                event(new \App\Events\VentaPagada($venta, $monto));
            }

            return $venta;
        });

        $this->logSuccess('Pago registrado en venta', [
            'venta_id' => $ventaId,
            'monto'    => $monto,
        ]);

        return VentaResponseDTO::fromModel($venta);
    }

    /**
     * Procesar prestables cuando se vende un producto relacionado
     *
     * Si el producto vendido está relacionado con prestables:
     * - Disminuye cantidad_disponible (se prestan canastillas nuevas)
     * - Aumenta cantidad_sin_liquido (cliente devuelve canastillas vacías)
     * - Registra movimiento en movimientos_prestables
     */
    public function procesarPrestablesEnVenta(Venta $venta): void
    {
        try {
            $almacenId = auth()->user()?->empresa?->almacen_id ?? 1;

            foreach ($venta->detalles as $detalle) {
                // Obtener prestables relacionados con este producto
                $prestables = \App\Models\Prestable::whereHas('productosRelacionados', function ($query) use ($detalle) {
                    $query->where('producto_id', $detalle->producto_id);
                })->get();

                // Procesar cada prestable relacionado
                foreach ($prestables as $prestable) {
                    // Obtener capacidad de la canastilla
                    // Si el prestable es una canastilla, usar su capacidad
                    // Si es un embase, buscar la canastilla asociada
                    $canastilla = null;
                    if ($prestable->capacidad) {
                        $canastilla = $prestable;
                    } else {
                        // Es un embase, buscar la canastilla donde embase_asociado_id = prestable->id
                        $canastilla = \App\Models\Prestable::where('embase_asociado_id', $prestable->id)->first();
                    }

                    $capacidadCanastilla = $canastilla?->capacidad ?? 1;
                    $cantidadPrestable = $detalle->cantidad * $capacidadCanastilla;

                    // Obtener o crear registro de stock para este prestable en el almacén
                    $stockPrestable = \App\Models\PrestableStock::firstOrCreate(
                        [
                            'prestable_id' => $prestable->id,
                            'almacenes_prestables_id' => $almacenId,
                        ],
                        [
                            'cantidad_disponible' => 0,
                            'cantidad_sin_liquido' => 0,
                            'cantidad_cliente_deudor' => 0,
                            'cantidad_cliente_devuelto' => 0,
                            'cantidad_cliente_dañada' => 0,
                            'cantidad_evento_deudor' => 0,
                            'cantidad_evento_devuelto' => 0,
                            'cantidad_evento_dañada' => 0,
                            'cantidad_proveedor_acreedor' => 0,
                            'cantidad_proveedor_devuelto' => 0,
                            'cantidad_proveedor_dañada' => 0,
                        ]
                    );

                    // Guardar valores anteriores
                    $disponibleAnterior = $stockPrestable->cantidad_disponible;
                    $sinLiquidoAnterior = $stockPrestable->cantidad_sin_liquido ?? 0;

                    // Actualizar stock explícitamente:
                    // - Disminuir disponible (se prestan canastillas nuevas)
                    // - Aumentar sin_liquido (cliente devuelve canastillas vacías)
                    // Cantidad = cantidad_vendida * capacidad_canastilla
                    $stockPrestable->update([
                        'cantidad_disponible' => $stockPrestable->cantidad_disponible - $cantidadPrestable,
                        'cantidad_sin_liquido' => ($stockPrestable->cantidad_sin_liquido ?? 0) + $cantidadPrestable,
                    ]);
                    $stockPrestable->refresh();

                    // Registrar movimiento
                    $this->movimientoPrestableService->registrarMovimiento([
                        'prestable_stock_id' => $stockPrestable->id,
                        'almacenes_prestables_id' => $almacenId,
                        'usuario_id' => Auth::id(),
                        'tipo' => 'VENTA_PRODUCTO',
                        'cantidad' => 0, // El cambio neto es 0 (baja disponible, sube sin_liquido)
                        'disponible_anterior' => $disponibleAnterior,
                        'disponible_posterior' => $stockPrestable->cantidad_disponible,
                        'cantidad_sin_liquido_anterior' => $sinLiquidoAnterior,
                        'cantidad_sin_liquido_posterior' => $stockPrestable->cantidad_sin_liquido,
                        'motivo' => 'Venta de productos relacionados',
                        'numero_referencia' => $venta->numero,
                        'referencia_tipo' => 'VENTA',
                        'referencia_id' => $venta->id,
                        'observaciones' => "Cliente compró {$detalle->cantidad}x{$detalle->producto->nombre}. Devuelve {$cantidadPrestable} {$prestable->nombre} vacíos (sin_liquido+) y se le prestan {$cantidadPrestable} nuevos (disponible-)",
                    ]);

                    Log::info('✅ Prestable procesado en venta', [
                        'venta_id' => $venta->id,
                        'prestable_id' => $prestable->id,
                        'prestable_nombre' => $prestable->nombre,
                        'producto_id' => $detalle->producto_id,
                        'producto_cantidad' => $detalle->cantidad,
                        'capacidad_canastilla' => $capacidadCanastilla,
                        'cantidad_prestable' => $cantidadPrestable,
                        'disponible_antes' => $disponibleAnterior,
                        'disponible_despues' => $stockPrestable->cantidad_disponible,
                        'sin_liquido_antes' => $sinLiquidoAnterior,
                        'sin_liquido_despues' => $stockPrestable->cantidad_sin_liquido,
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('❌ Error procesando prestables en venta', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
