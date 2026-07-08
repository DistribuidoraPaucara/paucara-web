<?php

namespace App\Services;

use App\Models\EntregaVentaConfirmacion;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class EntregaReporteService
{
    /**
     * Obtener reporte de confirmaciones de entrega por chofer
     * Filtra por rango de fecha (día 1 a hoy) y usuario registrador
     * Agrupa productos entregados en cada venta con estados válidos
     *
     * @param int $chofer User ID del chofer (confirmado_por)
     * @param string|null $fechaDesde Fecha inicio (default: primer día del mes)
     * @param string|null $fechaHasta Fecha fin (default: hoy)
     * @return array Reporte con resumen y productos agrupados
     */
    public function generarReporteConfirmaciones(int $chofer, ?string $fechaDesde = null, ?string $fechaHasta = null): array
    {
        // Definir rango de fechas (día 1 del mes a hoy)
        $fechaDesde = $fechaDesde ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $fechaHasta = $fechaHasta ?? Carbon::now()->format('Y-m-d');

        // Estados válidos para contar en el reporte
        $estadosValidos = ['COMPLETA', 'DEVOLUCION_PARCIAL'];

        // Obtener confirmaciones del chofer en el rango de fechas
        $confirmaciones = $this->obtenerConfirmacionesFiltradas(
            $chofer,
            $fechaDesde,
            $fechaHasta,
            $estadosValidos
        );

        // Calcular resumen general
        $resumen = $this->calcularResumen($confirmaciones, $estadosValidos);

        // Agrupar productos por venta entregada
        $productosAgrupados = $this->agruparProductosPorVenta($confirmaciones, $estadosValidos);

        // Resumen de productos con sumatoria
        $productosResumen = $this->sumarizarProductos($productosAgrupados);

        return [
            'filtros' => [
                'chofer_id' => $chofer,
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ],
            'resumen' => $resumen,
            'productos_resumen' => $productosResumen,
            'productos_por_venta' => $productosAgrupados,
        ];
    }

    /**
     * Obtener confirmaciones filtradas
     */
    private function obtenerConfirmacionesFiltradas(
        int $chofer,
        string $fechaDesde,
        string $fechaHasta,
        array $estadosValidos
    ): Collection {
        return EntregaVentaConfirmacion::where('confirmado_por', $chofer)
            ->whereBetween('confirmado_en', [
                $fechaDesde . ' 00:00:00',
                $fechaHasta . ' 23:59:59',
            ])
            ->whereIn('tipo_confirmacion', $estadosValidos)
            ->with([
                'venta.cliente',
                'venta.detalles.producto',
                'entrega',
                'confirmadoPor',
            ])
            ->orderByDesc('confirmado_en')
            ->get();
    }

    /**
     * Calcular resumen general de confirmaciones
     */
    private function calcularResumen(Collection $confirmaciones, array $estadosValidos): array
    {
        $resumen = [
            'total_confirmaciones' => $confirmaciones->count(),
            'confirmaciones_completas' => 0,
            'devoluciones_parciales' => 0,
            'total_ventas' => 0,
            'total_productos' => 0,
            'total_monetario' => 0.00,
            'total_devuelto' => 0.00,
        ];

        foreach ($confirmaciones as $confirmacion) {
            // Contar por tipo
            if ($confirmacion->tipo_confirmacion === 'COMPLETA') {
                $resumen['confirmaciones_completas']++;
            } elseif ($confirmacion->tipo_confirmacion === 'DEVOLUCION_PARCIAL') {
                $resumen['devoluciones_parciales']++;
            }

            // Contar venta única (si no está repetida)
            $resumen['total_ventas']++;

            // Acumular total de venta
            if ($confirmacion->venta) {
                $resumen['total_monetario'] += (float) $confirmacion->venta->total;

                // Contar productos en la venta
                $resumen['total_productos'] += $confirmacion->venta->detalles->count();

                // Acumular devoluciones
                if ($confirmacion->tipo_confirmacion === 'DEVOLUCION_PARCIAL') {
                    $resumen['total_devuelto'] += (float) $confirmacion->monto_devuelto ?? 0;
                }
            }
        }

        return $resumen;
    }

    /**
     * Agrupar productos por venta entregada
     */
    private function agruparProductosPorVenta(Collection $confirmaciones, array $estadosValidos): array
    {
        $productosAgrupados = [];

        foreach ($confirmaciones as $confirmacion) {
            if (!$confirmacion->venta) {
                continue;
            }

            $ventaId = $confirmacion->venta->id;

            if (!isset($productosAgrupados[$ventaId])) {
                $productosAgrupados[$ventaId] = [
                    'venta_id' => $ventaId,
                    'numero_venta' => $confirmacion->venta->numero,
                    'cliente' => [
                        'id' => $confirmacion->venta->cliente?->id,
                        'nombre' => $confirmacion->venta->cliente?->nombre,
                        'nit' => $confirmacion->venta->cliente?->nit,
                    ],
                    'total_venta' => (float) $confirmacion->venta->total,
                    'tipo_confirmacion' => $confirmacion->tipo_confirmacion,
                    'confirmado_en' => $confirmacion->confirmado_en,
                    'monto_devuelto' => (float) ($confirmacion->monto_devuelto ?? 0),
                    'productos' => [],
                ];
            }

            // Agregar productos de esta venta
            foreach ($confirmacion->venta->detalles as $detalle) {
                $productoId = $detalle->producto_id;

                if (!isset($productosAgrupados[$ventaId]['productos'][$productoId])) {
                    $productosAgrupados[$ventaId]['productos'][$productoId] = [
                        'producto_id' => $productoId,
                        'nombre' => $detalle->producto?->nombre,
                        'sku' => $detalle->producto?->sku,
                        'unidad_medida' => $detalle->producto?->unidad?->nombre ?? 'Unidad',
                        'cantidad' => 0.00,
                        'precio_unitario' => (float) $detalle->precio_unitario,
                        'subtotal' => 0.00,
                    ];
                }

                $productosAgrupados[$ventaId]['productos'][$productoId]['cantidad'] += (float) $detalle->cantidad;
                $productosAgrupados[$ventaId]['productos'][$productoId]['subtotal'] += (float) $detalle->subtotal;
            }

            // Convertir array de productos a valores indexados
            $productosAgrupados[$ventaId]['productos'] = array_values($productosAgrupados[$ventaId]['productos']);
        }

        // Convertir array de ventas a valores indexados
        return array_values($productosAgrupados);
    }

    /**
     * Sumarizar productos agrupados globalmente con totales
     */
    private function sumarizarProductos(array $productosAgrupados): array
    {
        $productosResumen = [];

        foreach ($productosAgrupados as $ventaAgrupada) {
            foreach ($ventaAgrupada['productos'] as $producto) {
                $productoId = $producto['producto_id'];

                if (!isset($productosResumen[$productoId])) {
                    $productosResumen[$productoId] = [
                        'producto_id' => $productoId,
                        'nombre' => $producto['nombre'],
                        'sku' => $producto['sku'],
                        'unidad_medida' => $producto['unidad_medida'],
                        'cantidad_total' => 0.00,
                        'valor_total' => 0.00,
                    ];
                }

                $productosResumen[$productoId]['cantidad_total'] += $producto['cantidad'];
                $productosResumen[$productoId]['valor_total'] += $producto['subtotal'];
            }
        }

        // Convertir a array indexado y ordenar por cantidad descendente
        return collect($productosResumen)
            ->sortByDesc('cantidad_total')
            ->values()
            ->toArray();
    }
}
