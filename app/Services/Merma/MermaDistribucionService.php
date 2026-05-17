<?php

namespace App\Services\Merma;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Services\Stock\MovimientoInventarioService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ✅ NUEVO (2026-03-27): Servicio centralizado para registrar mermas AGRUPADAS
 *
 * Propósito: Registrar movimientos de merma AGRUPADOS por producto, no por lote
 * - Un movimiento = un producto + un número de merma
 * - Detalles por lote guardados en JSON
 *
 * DIFERENCIA CON MERMA ACTUAL:
 * - Antes: Un MovimientoInventario por cada lote mermeado (FIFO distribution)
 * - Ahora: UN MovimientoInventario por producto (aunque tenga múltiples lotes)
 * - Los detalles de cada lote van en JSON para auditoria completa
 */
class MermaDistribucionService
{
    /**
     * Inyectar el servicio centralizado
     */
    private MovimientoInventarioService $movimientoService;

    public function __construct()
    {
        $this->movimientoService = new MovimientoInventarioService();
    }

    /**
     * ✅ NUEVO (2026-03-27): Registrar mermas AGRUPADAS por producto
     *
     * FLUJO:
     * 1. Para cada producto a mermar:
     *    a. Distribuir cantidad entre lotes usando FIFO
     *    b. Recolectar detalles de todos los lotes mermeados
     *    c. Registrar UN SOLO movimiento agrupado SALIDA_MERMA
     * 2. Retornar movimientos creados
     *
     * @param array $productos Array de productos a mermar: [['producto_id' => X, 'cantidad' => Y, 'costo_unitario' => Z, 'stock_producto_id' => A (opcional)], ...]
     * @param string $numeroMerma Referencia para movimiento (ej: MERMA-001)
     * @param int $almacenId ID del almacén
     * @param string $motivo Motivo de la merma
     * @param int $usuarioId ID del usuario que registra
     * @return array Movimientos creados en movimientos_inventario (AGRUPADOS por producto)
     * @throws Exception Si hay error en proceso
     */
    public function registrarMermasAgrupadas(
        array $productos,
        string $numeroMerma,
        int $almacenId,
        string $motivo,
        int $usuarioId
    ): array {
        Log::info('🔄 [MermaDistribucionService::registrarMermasAgrupadas] Iniciando mermas agrupadas', [
            'numero_merma' => $numeroMerma,
            'cantidad_productos' => count($productos),
            'almacen_id' => $almacenId,
            'motivo' => $motivo,
            'timestamp' => now()->toIso8601String(),
        ]);

        $movimientos = [];
        $costoTotalMerma = 0;

        return DB::transaction(function () use ($productos, $numeroMerma, $almacenId, $motivo, $usuarioId, &$movimientos, &$costoTotalMerma) {
            // Procesar cada producto a mermar
            foreach ($productos as $productoData) {
                $productoId = $productoData['producto_id'];
                $producto = Producto::findOrFail($productoId);
                $cantidadAMermar = (float) ($productoData['cantidad'] ?? 0);
                $costoUnitario = (float) ($productoData['costo_unitario'] ?? 0);

                Log::debug('🔄 [MermaDistribucionService] Procesando producto', [
                    'producto_id' => $productoId,
                    'producto_nombre' => $producto->nombre,
                    'cantidad_a_mermar' => $cantidadAMermar,
                ]);

                // Buscar stocks disponibles (FIFO)
                $stockProductos = null;
                if (!empty($productoData['stock_producto_id'])) {
                    // Si se especifica lote específico, usar ese
                    $stockProducto = StockProducto::where('id', $productoData['stock_producto_id'])
                        ->where('almacen_id', $almacenId)
                        ->lockForUpdate()
                        ->first();

                    if (!$stockProducto) {
                        throw new Exception("Lote no encontrado para producto ID {$productoId}");
                    }
                    $stockProductos = collect([$stockProducto]);
                } else {
                    // Si NO se especifica lote, buscar TODOS los lotes (FIFO)
                    $stockProductos = StockProducto::where('producto_id', $productoId)
                        ->where('almacen_id', $almacenId)
                        ->where('cantidad', '>', 0)
                        ->orderBy('id', 'asc')  // FIFO: primero creado
                        ->lockForUpdate()
                        ->get();

                    if ($stockProductos->isEmpty()) {
                        throw new Exception("Stock no encontrado para producto ID {$productoId}");
                    }
                }

                // Validar stock disponible
                $stockTotal = $stockProductos->sum('cantidad');
                if ($stockTotal < $cantidadAMermar) {
                    throw new Exception(
                        "Stock insuficiente para {$producto->nombre}. " .
                        "Disponible: {$stockTotal}, Solicitado: {$cantidadAMermar}"
                    );
                }

                // Distribuir merma entre lotes usando FIFO
                $cantidadRestante = (float) $cantidadAMermar;
                $detallesLotes = [];
                $cantidadTotalAnterior = 0;
                $cantidadTotalPosterior = 0;

                foreach ($stockProductos as $lote) {
                    if ($cantidadRestante <= 0) {
                        break;
                    }

                    $cantidadAMermarDelLote = min($cantidadRestante, (float) $lote->cantidad);

                    // Capturar ANTES
                    $cantidadAnterior = (float) $lote->cantidad;
                    $cantidadDisponibleAnterior = (float) $lote->cantidad_disponible;
                    $cantidadReservadaAnterior = (float) $lote->cantidad_reservada;

                    // Actualizar stock
                    $lote->decrement('cantidad', $cantidadAMermarDelLote);
                    $lote->decrement('cantidad_disponible', $cantidadAMermarDelLote);

                    // Recargar para obtener DESPUÉS
                    $lote->refresh();
                    $cantidadPosterior = (float) $lote->cantidad;
                    $cantidadDisponiblePosterior = (float) $lote->cantidad_disponible;
                    $cantidadReservadaPosterior = (float) $lote->cantidad_reservada;

                    // Recolectar detalle de este lote
                    $detallesLotes[] = [
                        'stock_producto_id' => $lote->id,
                        'lote' => $lote->lote,
                        'cantidad' => $cantidadAMermarDelLote,
                        'cantidad_total_anterior' => $cantidadAnterior,
                        'cantidad_total_posterior' => $cantidadPosterior,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                        'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                        'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                        'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                    ];

                    $cantidadRestante -= $cantidadAMermarDelLote;
                    $cantidadTotalAnterior = $cantidadAnterior;
                    $cantidadTotalPosterior = $cantidadPosterior;

                    // Acumular costo de merma
                    $costoTotalMerma += ($cantidadAMermarDelLote * $costoUnitario);

                    Log::debug('📦 [MermaDistribucionService] Lote mermeado', [
                        'merma' => $numeroMerma,
                        'stock_producto_id' => $lote->id,
                        'producto_id' => $productoId,
                        'lote' => $lote->lote,
                        'cantidad_merma' => $cantidadAMermarDelLote,
                    ]);
                }

                // Crear UN SOLO movimiento agrupado para este producto
                $movimiento = $this->movimientoService->registrarMovimientoAgrupado(
                    producto_id: $productoId,
                    almacen_id: $almacenId,
                    tipo: MovimientoInventario::TIPO_SALIDA_MERMA,
                    referencia_tipo: 'merma',  // ✅ CORREGIDO (2026-04-05): Parámetro requerido
                    cantidad: -$cantidadAMermar,  // Negativo para salida
                    numero_documento: $numeroMerma,
                    detallesLotes: $detallesLotes,
                    opciones: [
                        // 'referencia_tipo' => 'merma',  // ← Movido a parámetro directo
                        'referencia_id' => null,
                        'observacion_extra' => [
                            'motivo' => $motivo,
                            'costo_unitario' => $costoUnitario,
                            'costo_total_producto' => ($cantidadAMermar * $costoUnitario),
                        ]
                    ]
                );

                Log::info('✅ [MermaDistribucionService] Movimiento agrupado registrado', [
                    'merma' => $numeroMerma,
                    'producto_id' => $productoId,
                    'movimiento_id' => $movimiento->id,
                    'cantidad_lotes' => count($detallesLotes),
                    'cantidad_total' => $cantidadAMermar,
                ]);

                $movimientos[] = $movimiento;
            }

            Log::info('✅ [MermaDistribucionService::registrarMermasAgrupadas] Mermas completadas', [
                'numero_merma' => $numeroMerma,
                'movimientos_creados' => count($movimientos),
                'costo_total_merma' => $costoTotalMerma,
                'almacen_id' => $almacenId,
                'timestamp' => now()->toIso8601String(),
            ]);

            return [
                'movimientos' => $movimientos,
                'costo_total' => $costoTotalMerma,
            ];
        });
    }
}
