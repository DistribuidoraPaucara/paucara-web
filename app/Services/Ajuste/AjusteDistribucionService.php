<?php

namespace App\Services\Ajuste;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Services\Stock\MovimientoInventarioService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ✅ NUEVO (2026-03-27): Servicio centralizado para registrar ajustes AGRUPADOS
 *
 * Propósito: Registrar movimientos de ajuste AGRUPADOS por producto, no por lote
 * - Un movimiento = un producto + un número de ajuste
 * - Detalles por lote guardados en JSON
 *
 * DIFERENCIA CON AJUSTE ACTUAL:
 * - Antes: Un MovimientoInventario por cada lote ajustado
 * - Ahora: UN MovimientoInventario por producto (aunque tenga múltiples lotes ajustados)
 * - Los detalles de cada lote van en JSON para auditoria completa
 */
class AjusteDistribucionService
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
     * ✅ NUEVO (2026-03-27): Registrar ajustes AGRUPADOS por producto
     *
     * FLUJO:
     * 1. Agrupar ajustes por producto_id (usando StockProducto→producto_id)
     * 2. Para cada producto:
     *    a. Recolectar detalles de todos los lotes a ajustar
     *    b. Actualizar cantidad en cada StockProducto
     *    c. Registrar UN SOLO movimiento agrupado (ENTRADA o SALIDA según balance neto)
     * 3. Retornar movimientos creados
     *
     * @param array $ajustes Array de ajustes: [['stock_producto_id' => X, 'nueva_cantidad' => Y, 'observacion' => '...'], ...]
     * @param string $numeroAjuste Referencia para movimiento (ej: AJU-001)
     * @param int $almacenId ID del almacén
     * @param int $usuarioId ID del usuario que registra
     * @return array Movimientos creados en movimientos_inventario (AGRUPADOS por producto)
     * @throws Exception Si hay error en proceso
     */
    public function registrarAjustesAgrupados(
        array $ajustes,
        string $numeroAjuste,
        int $almacenId,
        int $usuarioId
    ): array {
        Log::info('🔄 [AjusteDistribucionService::registrarAjustesAgrupados] Iniciando ajustes agrupados', [
            'numero_ajuste' => $numeroAjuste,
            'cantidad_ajustes' => count($ajustes),
            'almacen_id' => $almacenId,
            'timestamp' => now()->toIso8601String(),
        ]);

        $movimientos = [];

        return DB::transaction(function () use ($ajustes, $numeroAjuste, $almacenId, $usuarioId, &$movimientos) {
            // Agrupar ajustes por producto_id (extraer del StockProducto)
            $ajustesPorProducto = [];

            foreach ($ajustes as $ajuste) {
                $stockProducto = StockProducto::findOrFail($ajuste['stock_producto_id']);
                $productoId = $stockProducto->producto_id;

                if (!isset($ajustesPorProducto[$productoId])) {
                    $ajustesPorProducto[$productoId] = [];
                }

                // Agregar información del stock_producto al ajuste
                $ajuste['stock_producto'] = $stockProducto;
                $ajustesPorProducto[$productoId][] = $ajuste;
            }

            // Procesar cada producto
            foreach ($ajustesPorProducto as $productoId => $ajustesProducto) {
                $producto = Producto::findOrFail($productoId);

                Log::debug('🔄 [AjusteDistribucionService] Procesando producto', [
                    'producto_id' => $productoId,
                    'producto_nombre' => $producto->nombre,
                    'cantidad_lotes' => count($ajustesProducto),
                ]);

                // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO ANTES de procesar lotes
                $totalProductoAntes = (float) StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad');

                $totalDisponibleAntes = (float) StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_disponible');

                $totalReservadoAntes = (float) StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_reservada');

                $diferenciaTotalProducto = 0;  // Balance neto del producto
                $detallesLotes = [];
                $cantidadTotalAnterior = 0;
                $cantidadTotalPosterior = 0;

                // Procesar cada lote del producto a ajustar
                foreach ($ajustesProducto as $ajuste) {
                    $stockProducto = $ajuste['stock_producto'];
                    $nuevaCantidad = (float) ($ajuste['nueva_cantidad'] ?? 0);
                    $observacion = $ajuste['observacion'] ?? 'Ajuste de inventario';

                    // Capturar ANTES (por lote)
                    $cantidadAnterior = (float) $stockProducto->cantidad;
                    $cantidadDisponibleAnterior = (float) $stockProducto->cantidad_disponible;
                    $cantidadReservadaAnterior = (float) $stockProducto->cantidad_reservada;

                    // Calcular diferencia para este lote
                    $diferencia = $nuevaCantidad - $cantidadAnterior;

                    // Actualizar stock_producto
                    $stockProducto->update([
                        'cantidad' => $nuevaCantidad,
                        'cantidad_disponible' => $nuevaCantidad - $cantidadReservadaAnterior,  // Disponible = Total - Reservada
                    ]);

                    // Recargar para obtener DESPUÉS
                    $stockProducto->refresh();
                    $cantidadPosterior = (float) $stockProducto->cantidad;
                    $cantidadDisponiblePosterior = (float) $stockProducto->cantidad_disponible;
                    $cantidadReservadaPosterior = (float) $stockProducto->cantidad_reservada;

                    // Recolectar detalle de este lote
                    $detallesLotes[] = [
                        'stock_producto_id' => $stockProducto->id,
                        'lote' => $stockProducto->lote,
                        'cantidad' => $diferencia,  // Diferencia (puede ser positiva o negativa)
                        'cantidad_anterior' => $cantidadAnterior,
                        'cantidad_posterior' => $cantidadPosterior,
                        'cantidad_total_anterior' => $cantidadAnterior,
                        'cantidad_total_posterior' => $cantidadPosterior,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                        'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                        'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                        'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                        'observacion' => $observacion,
                    ];

                    // Acumular diferencia total del producto
                    $diferenciaTotalProducto += $diferencia;
                    $cantidadTotalAnterior = $cantidadAnterior;
                    $cantidadTotalPosterior = $cantidadPosterior;

                    Log::debug('📦 [AjusteDistribucionService] Lote ajustado', [
                        'ajuste' => $numeroAjuste,
                        'stock_producto_id' => $stockProducto->id,
                        'producto_id' => $productoId,
                        'lote' => $stockProducto->lote,
                        'diferencia' => $diferencia,
                        'cantidad_anterior' => $cantidadAnterior,
                        'cantidad_posterior' => $cantidadPosterior,
                    ]);
                }

                // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO DESPUÉS de procesar todos los lotes
                $totalProductoDespues = (float) StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad');

                $totalDisponibleDespues = (float) StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_disponible');

                $totalReservadoDespues = (float) StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_reservada');

                // ✅ Determinar tipo de movimiento basado en balance NETO del producto
                $tipo = $diferenciaTotalProducto >= 0 ?
                    MovimientoInventario::TIPO_ENTRADA_AJUSTE :
                    MovimientoInventario::TIPO_SALIDA_AJUSTE;

                // Crear UN SOLO movimiento agrupado para este producto
                $movimiento = $this->movimientoService->registrarMovimientoAgrupado(
                    producto_id: $productoId,
                    almacen_id: $almacenId,
                    tipo: $tipo,
                    referencia_tipo: 'ajuste',  // ✅ CORREGIDO (2026-04-05): Parámetro requerido
                    cantidad: $diferenciaTotalProducto,  // Balance neto (puede ser + o -)
                    numero_documento: $numeroAjuste,
                    detallesLotes: $detallesLotes,
                    opciones: [
                        // 'referencia_tipo' => 'ajuste',  // ← Movido a parámetro directo
                        'referencia_id' => null,
                        // ✅ CORREGIDO (2026-04-05): Pasar totales del PRODUCTO COMPLETO
                        'totales_previos' => [
                            'cantidad_total_anterior' => $totalProductoAntes,
                            'cantidad_disponible_anterior' => $totalDisponibleAntes,
                            'cantidad_reservada_anterior' => $totalReservadoAntes,
                        ],
                        'totales_posteriores' => [
                            'cantidad_total_posterior' => $totalProductoDespues,
                            'cantidad_disponible_posterior' => $totalDisponibleDespues,
                            'cantidad_reservada_posterior' => $totalReservadoDespues,
                        ],
                    ]
                );

                Log::info('✅ [AjusteDistribucionService] Movimiento agrupado registrado', [
                    'ajuste' => $numeroAjuste,
                    'producto_id' => $productoId,
                    'movimiento_id' => $movimiento->id,
                    'cantidad_lotes' => count($detallesLotes),
                    'diferencia_total' => $diferenciaTotalProducto,
                    'tipo' => $tipo,
                ]);

                $movimientos[] = $movimiento;
            }

            Log::info('✅ [AjusteDistribucionService::registrarAjustesAgrupados] Ajustes completados', [
                'numero_ajuste' => $numeroAjuste,
                'movimientos_creados' => count($movimientos),
                'almacen_id' => $almacenId,
                'timestamp' => now()->toIso8601String(),
            ]);

            return $movimientos;
        });
    }
}
