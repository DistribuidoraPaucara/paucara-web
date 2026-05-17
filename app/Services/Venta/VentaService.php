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
use Illuminate\Pagination\LengthAwarePaginator;
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
        // ✅ MODIFICADO: NO validar stock para CREDITO (son promesas de pago, no ventas inmediatas)
        $esCREDITO = strtoupper($dto->politica_pago ?? '') === 'CREDITO';

        // ✅ NUEVO (2026-05-08): Obtener si la empresa es farmacia
        $esFarmacia = (bool) auth()->user()?->empresa?->es_farmacia;

        // COMBO: expandir antes de validar y decrementar stock.
        // $dto->detalles se preserva sin cambios para DetalleVenta.
        $detallesParaStock = $this->stockService->expandirCombos($dto->detalles);

        if (!$esCREDITO) {
            Log::info('🔄 [VentaService::crear] Validando stock disponible con VentaDistribucionService', [
                'detalles_count' => count($dto->detalles),
                'politica_pago'  => $dto->politica_pago,
                'almacen_id'     => auth()->user()?->empresa?->almacen_id ?? 1,
                'es_farmacia'    => $esFarmacia,
            ]);

            // ✅ NUEVO (2026-02-11): Usar VentaDistribucionService para validar
            // ✅ MODIFICADO (2026-05-08): Pasar parámetro es_farmacia para permitir venta sin stock
            $validacionStock = $this->ventaDistribucionService->validarDisponible(
                $detallesParaStock,
                $esFarmacia
            );

            if (! $validacionStock['valido']) {
                Log::warning('❌ [VentaService::crear] Stock insuficiente', [
                    'detalles' => $validacionStock['detalles'],
                ]);
                throw StockInsuficientException::create($validacionStock['detalles']);
            }

            Log::info('✅ [VentaService::crear] Stock validado exitosamente con VentaDistribucionService');
        } else {
            Log::info('⏭️ [VentaService::crear] Saltando validación de stock (CREDITO permite stock negativo)', [
                'politica_pago' => $dto->politica_pago,
            ]);
        }

        // 3. Crear dentro de transacción
        // ✅ NUEVO: Pasar $esCREDITO al closure para permitir stock negativo
        // ✅ NUEVO (2026-05-08): Pasar $esFarmacia para permitir venta sin stock en farmacia
        $venta = $this->transaction(function () use ($dto, $cajaId, $esCREDITO, $detallesParaStock, $esFarmacia) {
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

            // ✅ CORREGIDO (2026-05-04): Asignar estado_logistico_id = PENDIENTE_ENVIO si no viene especificado
            // Esto permite que la venta aparezca inmediatamente en searchVentas para crear entregas
            $estadoLogisticoId = $dto->estado_logistico_id;
            if (!$estadoLogisticoId) {
                $estadoPendienteEnvio = \App\Models\EstadoLogistica::where('codigo', 'PENDIENTE_ENVIO')
                    ->where('categoria', 'venta_logistica')
                    ->first();
                $estadoLogisticoId = $estadoPendienteEnvio?->id;
                Log::info('📦 [VentaService::crear] Estado logístico asignado a PENDIENTE_ENVIO (por defecto)', [
                    'estado_id' => $estadoLogisticoId,
                    'codigo'    => 'PENDIENTE_ENVIO',
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

                \App\Models\DetalleVenta::create([
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
                            'incluido' => $item['incluido'] ?? false,
                        ];
                    }, $comboItemsSeleccionados) : null, // ✅ NUEVO: Items del combo seleccionados
                ]);
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
                'permite_stock_negativo' => $esCREDITO,
            ]);

            $movimientosStock = $this->ventaDistribucionService->consumirStock(
                $detallesParaStock,
                $venta->numero,
                permitirStockNegativo: $esCREDITO,  // ✅ Permite stock negativo para CREDITO
                esFarmacia: $esFarmacia              // ✅ NUEVO (2026-05-08): Permite venta sin stock en farmacia
            );

            // ✅ NUEVO (2026-03-28): Validar que se registraron movimientos para TODOS los productos
            // Esto evita que quedenventas sin movimientos de inventario
            $cantidadProductosUnicos = collect($detallesParaStock)
                ->pluck('producto_id')
                ->unique()
                ->count();

            if (count($movimientosStock) != $cantidadProductosUnicos) {
                Log::error('❌ [VentaService::crear] Discrepancia de movimientos', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'productos_esperados' => $cantidadProductosUnicos,
                    'movimientos_creados' => count($movimientosStock),
                    'detalles' => $detallesParaStock,
                ]);

                throw new \Exception(
                    "Error crítico: Se esperaban {$cantidadProductosUnicos} movimientos de inventario " .
                    "pero solo se registraron " . count($movimientosStock) . ". " .
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
            event(new \App\Events\VentaCreada($venta));

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
            'detalles.producto', // ✅ Incluir productos de detalles
            'cliente',
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
    public function listar(int $perPage = 15, array $filtros = [], string $sortBy = 'id', string $sortOrder = 'desc'): LengthAwarePaginator
    {
        return $this->read(function () use ($perPage, $filtros, $sortBy, $sortOrder) {
            // ✅ ACTUALIZADO: Cargar todas las relaciones necesarias para el frontend
            // Incluye estadoLogistica para mostrar estado de entregas en tabla
            $query = Venta::with([
                'cliente',
                'estadoDocumento',
                'usuario',
                'moneda',
                'direccionCliente.localidad', // ✅ Cargar localidad de la dirección para mapas
                'estadoLogistica',            // ✅ NUEVO: Para mostrar estado logístico en tabla
                'detalles.producto',          // ✅ RECOMENDADO: Para verificar peso_total_estimado si es necesario
                'proforma',                   // ✅ NUEVO: Cargar relación de proforma (si existe)
                'confirmaciones',             // ✅ NUEVO: Cargar confirmación de entrega (entregas_venta_confirmaciones)
                'preventista',                // ✅ NUEVO (2026-03-01): Cargar preventista responsable
                'entrega.chofer',             // ✅ NUEVO (2026-03-03): Cargar entrega asignada y su chofer
                'entrega.vehiculo',           // ✅ NUEVO (2026-03-03): Cargar vehículo de la entrega
            ])
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
                        // ✅ PRIORIDAD 2: Si no es numérico, buscar por campos textuales (evitar error de tipo bigint)
                        : $q->whereHas('cliente', fn($qCli) =>
                            $qCli->where('codigo_cliente', 'like', '%' . $clienteId . '%')
                                ->orWhere('nombre', 'like', '%' . $clienteId . '%')
                                ->orWhere('nit', 'like', '%' . $clienteId . '%')
                                ->orWhere('telefono', 'like', '%' . $clienteId . '%')
                        )
                )
                ->when($filtros['busqueda_cliente'] ?? null, fn($q, $busqueda) =>
                    // ✅ PRIORIDAD 1: Si es numérico, buscar por ID exacto
                    is_numeric($busqueda) && (int)$busqueda > 0
                        ? $q->where('cliente_id', (int)$busqueda)
                        // ✅ PRIORIDAD 2: Si no es numérico, buscar por campos textuales
                        : $q->whereHas('cliente', fn($qCli) =>
                            $qCli->where('codigo_cliente', 'like', '%' . $busqueda . '%')
                                ->orWhere('nombre', 'like', '%' . $busqueda . '%')
                                ->orWhere('nit', 'like', '%' . $busqueda . '%')
                                ->orWhere('telefono', 'like', '%' . $busqueda . '%')
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
                            $subQuery->where('numero', 'like', $search . '%')
                                ->orWhereHas('cliente', fn($qCli) =>
                                    $qCli->where('nombre', 'like', '%' . $search . '%')
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

            // ✅ NUEVO: Aplicar ordenamiento dinámico con validación
            // Campos permitidos para ordenamiento: id, created_at, updated_at, fecha, numero, total, estado
            $camposPermitidos = ['id', 'created_at', 'updated_at', 'fecha', 'numero', 'total', 'estado'];
            $sortBy = in_array(strtolower($sortBy), $camposPermitidos) ? $sortBy : 'id';
            $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'asc' : 'desc';

            $resultado = $query
                ->orderBy($sortBy, $sortOrder)
                ->paginate($perPage);

            // ✅ DEBUG: Verificar que las relaciones se cargaron correctamente
            Log::debug('📦 VentaService::listar - Primeras ventas cargadas', [
                'total'                   => $resultado->total(),
                'primera_venta_id'        => $resultado->first()?->id ?? 'N/A',
                'tiene_direccion_cliente' => $resultado->first()?->direccionCliente ? 'SÍ' : 'NO',
                'tiene_estadoLogistica'   => $resultado->first()?->estadoLogistica ? 'SÍ' : 'NO',
                'tiene_entrega'           => $resultado->first()?->entrega ? 'SÍ' : 'NO',  // ✅ NUEVO (2026-03-03)
                'latitud'                 => $resultado->first()?->direccionCliente?->latitud ?? 'N/A',
                'longitud'                => $resultado->first()?->direccionCliente?->longitud ?? 'N/A',
                'sort_by'                 => $sortBy,
                'sort_order'              => $sortOrder,
            ]);

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
}
