<?php

namespace App\Services\Stock;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Pest\Support\Str;

/**
 * ✅ NUEVO (2026-03-27): Servicio centralizado para registrar movimientos de inventario
 *
 * Propósito: Registrar movimientos AGRUPADOS por producto, no por lote
 * - Un movimiento = un producto + un documento
 * - Detalles por lote guardados en JSON
 *
 * Reutilizable desde:
 * - Proformas (reserva, liberación, consumo)
 * - Ventas (salida, devolución)
 * - Compras (entrada)
 * - Ajustes de inventario
 * - Mermas
 * - Transferencias
 */
class MovimientoInventarioService
{
    /**
     * Registrar un movimiento AGRUPADO por producto
     *
     * @param int $producto_id - ID del producto
     * @param int $almacen_id - ID del almacén
     * @param string $tipo - Tipo de movimiento (RESERVA_PROFORMA, SALIDA_VENTA, etc)
     * @param float $cantidad - Cantidad total (puede ser negativa para salida)
     * @param string $numero_documento - Número de documento de referencia
     * @param array $detallesLotes - Detalles por lote
     *   [
     *     ['stock_producto_id' => 1, 'lote' => 'A', 'cantidad' => 5, 'cantidad_anterior' => 10, 'cantidad_posterior' => 5],
     *     ['stock_producto_id' => 2, 'lote' => 'B', 'cantidad' => 3, 'cantidad_anterior' => 24, 'cantidad_posterior' => 21],
     *   ]
     * @param array $opciones - Opciones adicionales
     *   - referencia_tipo: 'proforma', 'venta', etc
     *   - referencia_id: ID de la referencia
     *   - observacion_extra: Observación adicional (se mergeará con JSON)
     *
     * @return MovimientoInventario El movimiento creado
     */
    public function registrarMovimientoAgrupado(
        int $producto_id,
        int $almacen_id,
        string $tipo,
        string $referencia_tipo,
        float $cantidad,
        string $numero_documento,
        array $detallesLotes = [],
        array $opciones = []
    ): MovimientoInventario {
        try {
            // Obtener producto
            $producto = Producto::findOrFail($producto_id);

            // ✅ CORREGIDO (2026-03-28): Usar totales GENERALES si se proporcionan en opciones
            // Si no, calcular sumando detalles de lotes (fallback para compatibilidad)
            $cantidadTotalAnterior = 0;
            $cantidadTotalPosterior = 0;
            $cantidadDisponibleAnterior = 0;
            $cantidadDisponiblePosterior = 0;
            $cantidadReservadaAnterior = 0;
            $cantidadReservadaPosterior = 0;

            // Primero, intentar usar totales proporcionados en opciones (tienen prioridad)
            if (!empty($opciones['totales_previos'])) {
                $cantidadTotalAnterior = $opciones['totales_previos']['cantidad_total_anterior'] ?? 0;
                $cantidadDisponibleAnterior = $opciones['totales_previos']['cantidad_disponible_anterior'] ?? 0;
                $cantidadReservadaAnterior = $opciones['totales_previos']['cantidad_reservada_anterior'] ?? 0;
            }

            if (!empty($opciones['totales_posteriores'])) {
                $cantidadTotalPosterior = $opciones['totales_posteriores']['cantidad_total_posterior'] ?? 0;
                $cantidadDisponiblePosterior = $opciones['totales_posteriores']['cantidad_disponible_posterior'] ?? 0;
                $cantidadReservadaPosterior = $opciones['totales_posteriores']['cantidad_reservada_posterior'] ?? 0;
            } else if (!empty($detallesLotes) && !empty($opciones['totales_previos'])) {
                // Si tenemos totales anteriores pero no posteriores, calcular posteriores
                $cantidadTotalPosterior = $cantidadTotalAnterior + $cantidad;
                // Para disponible y reservada, usar detalles de lotes como fallback
                foreach ($detallesLotes as $detalle) {
                    $cantidadDisponiblePosterior += $detalle['cantidad_disponible_posterior'] ?? 0;
                    $cantidadReservadaPosterior += $detalle['cantidad_reservada_posterior'] ?? 0;
                }
            } else if (!empty($detallesLotes)) {
                // FALLBACK: Si no hay opciones, sumar detalles de lotes (para compatibilidad)
                foreach ($detallesLotes as $detalle) {
                    $cantidadTotalAnterior += $detalle['cantidad_total_anterior'] ?? $detalle['cantidad_anterior'] ?? 0;
                    $cantidadTotalPosterior += $detalle['cantidad_total_posterior'] ?? $detalle['cantidad_posterior'] ?? 0;
                    $cantidadDisponibleAnterior += $detalle['cantidad_disponible_anterior'] ?? 0;
                    $cantidadDisponiblePosterior += $detalle['cantidad_disponible_posterior'] ?? 0;
                    $cantidadReservadaAnterior += $detalle['cantidad_reservada_anterior'] ?? 0;
                    $cantidadReservadaPosterior += $detalle['cantidad_reservada_posterior'] ?? 0;
                }
            } else {
                // FALLBACK: Si no hay detalles, obtener del stock actual
                $stockTotal = StockProducto::where('producto_id', $producto_id)
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad');

                $cantidadTotalAnterior = $stockTotal;
                $cantidadTotalPosterior = $stockTotal + $cantidad;

                $cantidadDisponibleAnterior = StockProducto::where('producto_id', $producto_id)
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad_disponible');

                $cantidadDisponiblePosterior = $cantidadDisponibleAnterior - abs($cantidad);
            }

            // Construir JSON de observación
            $observacion = [
                'evento' => $this->obtenerEventoDesdeType($tipo),
                'numero_documento' => $numero_documento,
                'producto_id' => $producto_id,
                'producto_nombre' => $producto->nombre,
                'cantidad_total' => abs($cantidad),
                'cantidad_total_anterior' => $cantidadTotalAnterior,
                'cantidad_total_posterior' => $cantidadTotalPosterior,
                'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                'cantidad_lotes' => count($detallesLotes),
            ];

            // Agregar detalles por lote
            if (!empty($detallesLotes)) {
                $observacion['detalles_lotes'] = array_map(function ($detalle) {
                    return [
                        'stock_producto_id' => $detalle['stock_producto_id'] ?? null,
                        'lote' => $detalle['lote'] ?? null,
                        'cantidad' => $detalle['cantidad'] ?? 0,
                        'cantidad_total_anterior' => $detalle['cantidad_total_anterior'] ?? $detalle['cantidad_anterior'] ?? 0,
                        'cantidad_total_posterior' => $detalle['cantidad_total_posterior'] ?? $detalle['cantidad_posterior'] ?? 0,
                        'cantidad_disponible_anterior' => $detalle['cantidad_disponible_anterior'] ?? 0,
                        'cantidad_disponible_posterior' => $detalle['cantidad_disponible_posterior'] ?? 0,
                        'cantidad_reservada_anterior' => $detalle['cantidad_reservada_anterior'] ?? 0,
                        'cantidad_reservada_posterior' => $detalle['cantidad_reservada_posterior'] ?? 0,
                    ];
                }, $detallesLotes);
            }

            // Mergecar observación extra si existe
            if (!empty($opciones['observacion_extra'])) {
                $observacion = array_merge($observacion, (array) $opciones['observacion_extra']);
            }

            // Usar el primer stock_producto_id de los detalles (para compatibilidad)
            $stock_producto_id = !empty($detallesLotes) ? $detallesLotes[0]['stock_producto_id'] : null;

            // Crear movimiento AGRUPADO
            $movimiento = MovimientoInventario::create([
                'stock_producto_id' => $stock_producto_id,
                'cantidad' => $cantidad, // Cantidad neta (puede ser negativa)
                'cantidad_anterior' => $cantidadTotalAnterior,
                'cantidad_posterior' => $cantidadTotalPosterior,
                // 6 columnas de auditoría
                'cantidad_total_anterior' => $cantidadTotalAnterior,
                'cantidad_total_posterior' => $cantidadTotalPosterior,
                'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                'tipo' => $tipo,
                'numero_documento' => $numero_documento,
                'referencia_tipo' => $referencia_tipo,
                'referencia_id' => $opciones['referencia_id'] ?? null,
                'observacion' => json_encode($observacion),
                'user_id' => Auth::id() ?? 1,
                'fecha' => now(),
            ]);

            Log::info('✅ [MovimientoInventarioService] Movimiento agrupado registrado', [
                'movimiento_id' => $movimiento->id,
                'producto_id' => $producto_id,
                'tipo' => $tipo,
                'numero_documento' => $numero_documento,
                'cantidad' => $cantidad,
                'cantidad_lotes' => count($detallesLotes),
            ]);

            return $movimiento;

        } catch (\Exception $e) {
            Log::error('❌ [MovimientoInventarioService] Error registrando movimiento agrupado', [
                'producto_id' => $producto_id,
                'tipo' => $tipo,
                'numero_documento' => $numero_documento,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Obtener descripción legible del evento desde el tipo de movimiento
     */
    private function obtenerEventoDesdeType(string $tipo): string
    {
        $eventos = [
            'RESERVA_PROFORMA' => 'Reserva de proforma',
            'LIBERACION_RESERVA' => 'Liberación de reserva',
            'CONSUMO_RESERVA' => 'Consumo de reserva',
            'ENTRADA_COMPRA' => 'Entrada por compra',
            'ENTRADA_AJUSTE' => 'Entrada por ajuste',
            'SALIDA_VENTA' => 'Salida por venta',
            'SALIDA_AJUSTE' => 'Salida por ajuste',
            'SALIDA_MERMA' => 'Salida por merma',
            'TRANSFERENCIA' => 'Transferencia',
        ];

        return $eventos[$tipo] ?? 'Movimiento de inventario';
    }
}
