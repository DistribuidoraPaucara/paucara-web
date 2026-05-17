<?php

namespace App\Http\Controllers;

use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\MovimientoInventario;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReporteController extends Controller
{
    /**
     * Reporte de ventas por producto
     * Muestra todas las ventas de un producto con filtros por fecha
     */
    public function ventasPorProducto(Request $request)
    {
        $productos = Producto::orderBy('nombre')->get();

        $productoId = $request->input('producto_id');
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        $fechaEspecifica = $request->input('fecha_especifica');

        $ventas = collect();
        $totalProducto = [
            'cantidad_vendida' => 0,
            'cantidad_devuelta' => 0,
            'cantidad_neta' => 0,
            'monto_total' => 0,
            'monto_devuelto' => 0,
            'monto_neto' => 0,
        ];

        if ($productoId) {
            // Validar que el producto exista
            $producto = Producto::findOrFail($productoId);

            // ✅ NUEVO (2026-04-28): Traer TODOS los detalles del período
            // Procesaremos en PHP para evitar problemas con JSON en PostgreSQL
            $query = DetalleVenta::with([
                'venta' => fn($q) => $q->with('cliente'),
                'producto'
            ]);

            // Aplicar filtro de fechas
            if ($fechaEspecifica) {
                $fecha = Carbon::parse($fechaEspecifica)->startOfDay();
                $query->whereDate('created_at', $fecha);
            } elseif ($fechaInicio && $fechaFin) {
                $inicio = Carbon::parse($fechaInicio)->startOfDay();
                $fin = Carbon::parse($fechaFin)->endOfDay();
                $query->whereBetween('created_at', [$inicio, $fin]);
            }

            $todosDetalles = $query->orderByDesc('created_at')->get();

            // ✅ NUEVO (2026-04-28): Filtrar en PHP - productos DIRECTOS + dentro de COMBOS
            $detalles = collect();

            foreach ($todosDetalles as $detalle) {
                // Caso 1: Venta DIRECTA del producto
                if ($detalle->producto_id == $productoId) {
                    $detalle->_tipo_venta = 'DIRECTA';
                    $detalles->push($detalle);
                }
                // Caso 2: Venta de COMBO que contiene el producto
                else {
                    $comboItems = $detalle->combo_items_seleccionados ?? [];
                    foreach ($comboItems as $item) {
                        // Buscar por producto_id (es la clave correcta en el JSON)
                        if (isset($item['producto_id']) && $item['producto_id'] == $productoId) {
                            $detalle->_tipo_venta = 'DENTRO DE COMBO';
                            $detalles->push($detalle);
                            break;
                        }
                    }
                }
            }

            // ✅ NUEVO (2026-04-28): Agrupar detalles por venta_id para mostrar UNA SOLA FILA POR VENTA
            $detallesAgrupados = $detalles->groupBy('venta_id');

            foreach ($detallesAgrupados as $venta_id => $detalles_grupo) {
                // Calcular cantidad total vendida para esta venta (suma de todos los detalles)
                $cantidadVendidaTotal = 0;
                $cantidadDevueltaTotal = 0;
                $montoVendidoTotal = 0;
                $montoDevueltoTotal = 0;
                $precioPromedio = 0;
                $tiposVenta = collect();

                foreach ($detalles_grupo as $detalle) {
                    $cantidadDevuelta = (float) ($detalle->cantidad_devuelta ?? 0);
                    $precioUnitario = (float) $detalle->precio_unitario;
                    $cantidadVendida = (float) $detalle->cantidad;

                    // Detectar tipo de venta
                    $esCombo = $detalle->_tipo_venta === 'DENTRO DE COMBO';
                    $tiposVenta->push($detalle->_tipo_venta);

                    if ($esCombo && !empty($detalle->combo_items_seleccionados)) {
                        // El detalle es un COMBO: buscar el producto dentro del JSON
                        $productoEnCombo = null;
                        foreach ($detalle->combo_items_seleccionados as $item) {
                            if ($item['producto_id'] == $productoId) {
                                $productoEnCombo = $item;
                                break;
                            }
                        }

                        if ($productoEnCombo) {
                            $cantidadVendida = (float) $detalle->cantidad * (float) ($productoEnCombo['cantidad'] ?? 1);
                            if (isset($productoEnCombo['precio_unitario'])) {
                                $precioUnitario = (float) $productoEnCombo['precio_unitario'];
                            }
                        }
                    }

                    $cantidadVendidaTotal += $cantidadVendida;
                    $cantidadDevueltaTotal += $cantidadDevuelta;
                    $montoVendidoTotal += $cantidadVendida * $precioUnitario;
                    $montoDevueltoTotal += $cantidadDevuelta * $precioUnitario;
                    $precioPromedio = $precioUnitario;
                }

                $cantidadNetaTotal = $cantidadVendidaTotal - $cantidadDevueltaTotal;
                $montoVendidoTotal = round($montoVendidoTotal, 2);
                $montoDevueltoTotal = round($montoDevueltoTotal, 2);
                $montoNetoTotal = round($cantidadNetaTotal * $precioPromedio, 2);

                // ✅ NUEVO (2026-04-28): Obtener movimiento de inventario para esta venta
                // Busca por fecha y tipo, ya que referencia_id puede estar en NULL
                $primerDetalle = $detalles_grupo->first();
                $ventaFecha = $primerDetalle->venta->created_at;
                $numeroVenta = $primerDetalle->venta->numero;

                // Buscar movimiento para venta aprobada (SALIDA_VENTA, CONSUMO_RESERVA)
                $movimiento = MovimientoInventario::whereHas('stockProducto', function($q) use ($productoId) {
                    $q->where('producto_id', $productoId);
                })
                    ->whereIn('tipo', ['SALIDA_VENTA', 'CONSUMO_RESERVA', 'ENTRADA_DEVOLUCION', 'ENTRADA_AJUSTE'])
                    // Buscar en rango amplio de tiempo (hasta 2 horas después)
                    ->whereBetween('created_at', [
                        $ventaFecha->copy()->subMinutes(30),
                        $ventaFecha->copy()->addHours(2)
                    ])
                    ->orderByDesc('created_at')
                    ->first();

                // Si no encuentra movimiento reciente, buscar en observación (si contiene el número de venta)
                if (!$movimiento && !empty($numeroVenta)) {
                    $movimiento = MovimientoInventario::whereHas('stockProducto', function($q) use ($productoId) {
                        $q->where('producto_id', $productoId);
                    })
                        ->where('numero_documento', 'LIKE', '%' . $numeroVenta . '%')
                        ->orderByDesc('created_at')
                        ->first();
                }

                // Determinar tipo de venta (si tiene COMBO, mostrar COMBO, sino DIRECTA)
                $tipoVentaPrincipal = $tiposVenta->contains('DENTRO DE COMBO') ? 'DENTRO DE COMBO' : 'DIRECTA';

                // ✅ NUEVO (2026-04-28): Usar valores del movimiento de inventario directamente
                // La cantidad del movimiento ya refleja el signo (negativo para salida, positivo para entrada)
                $cantidadMovimiento = $movimiento?->cantidad ?? 0;
                $totalAnterior = $movimiento?->cantidad_total_anterior ?? 0;
                $totalPosterior = $movimiento?->cantidad_total_posterior ?? 0;

                $ventaData = [
                    'detalle_id' => $primerDetalle->id,
                    'numero_venta' => $primerDetalle->venta->numero,
                    'venta_id' => $primerDetalle->venta->id,
                    'cliente' => $primerDetalle->venta->cliente->nombre ?? 'N/A',
                    'fecha' => $primerDetalle->venta->created_at->format('d/m/Y H:i'),
                    'cantidad_vendida' => $cantidadMovimiento,  // ✅ CAMBIO: Usar cantidad del movimiento (con signo)
                    'cantidad_devuelta' => $cantidadDevueltaTotal,
                    'cantidad_neta' => $cantidadNetaTotal,
                    'precio_unitario' => $precioPromedio,
                    'monto_vendido' => $montoVendidoTotal,
                    'monto_devuelto' => $montoDevueltoTotal,
                    'monto_neto' => $montoNetoTotal,
                    'estado' => $primerDetalle->venta->estado ?? 'N/A',
                    'tipo_venta' => $tipoVentaPrincipal,
                    // Stock anterior y posterior del movimiento (directamente de la BD)
                    'total_anterior' => $totalAnterior,
                    'total_posterior' => $totalPosterior,
                    'disponible_anterior' => $movimiento?->cantidad_disponible_anterior ?? 0,
                    'disponible_posterior' => $movimiento?->cantidad_disponible_posterior ?? 0,
                    'reservado_anterior' => $movimiento?->cantidad_reservada_anterior ?? 0,
                    'reservado_posterior' => $movimiento?->cantidad_reservada_posterior ?? 0,
                ];

                $ventas->push($ventaData);

                // Acumular totales
                $totalProducto['cantidad_vendida'] += $cantidadVendidaTotal;
                $totalProducto['cantidad_devuelta'] += $cantidadDevueltaTotal;
                $totalProducto['cantidad_neta'] += $cantidadNetaTotal;
                $totalProducto['monto_total'] += $montoVendidoTotal;
                $totalProducto['monto_devuelto'] += $montoDevueltoTotal;
                $totalProducto['monto_neto'] += $montoNetoTotal;
            }
        }

        return Inertia::render('reportes/ventas-por-producto', [
            'productos' => $productos,
            'productoSeleccionado' => $productoId ? Producto::find($productoId) : null,
            'ventas' => $ventas,
            'filtros' => [
                'producto_id' => $productoId,
                'fecha_especifica' => $fechaEspecifica,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
            ],
            'totalProducto' => $totalProducto,
        ]);
    }

    /**
     * Pantalla de impresión de reportes con filtros por fecha
     */
    public function impresionReportes()
    {
        return Inertia::render('reportes/impresion-reportes');
    }
}
