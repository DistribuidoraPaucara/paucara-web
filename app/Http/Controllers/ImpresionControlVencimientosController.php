<?php

namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\StockProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ImpresionControlVencimientosController extends Controller
{
    public function imprimir(Request $request)
    {
        try {
            ini_set('memory_limit', '3072M');

            // Obtener filtros de la URL
            $almacenId = $request->integer('almacen_id');
            $estado = (string) $request->string('estado', 'todos');
            $busqueda = (string) $request->string('busqueda', '');
            $soloConStock = $request->boolean('solo_con_stock', false);

            // Construir query igual que en InventarioController::controlVencimientos
            $query = StockProducto::with(['producto.categoria', 'almacen'])
                ->withoutTrashed()
                ->whereNotNull('fecha_vencimiento')
                ->whereHas('producto', function ($q) {
                    $q->where('activo', true);
                })
                ->orderBy('fecha_vencimiento');

            // Filtro por almacén
            if ($almacenId) {
                $query->where('almacen_id', $almacenId);
            }

            // Filtro por búsqueda de producto
            if ($busqueda) {
                $query->whereHas('producto', function ($q) use ($busqueda) {
                    $q->where('nombre', 'like', "%{$busqueda}%");
                });
            }

            // Filtro por stock disponible
            if ($soloConStock) {
                $query->where('cantidad', '>', 0);
            }

            $stocks = $query->get()
                ->map(function ($stock) {
                    $diasParaVencer = now()->diffInDays($stock->fecha_vencimiento, false);

                    return [
                        'id'                   => $stock->id,
                        'producto'             => [
                            'id'        => $stock->producto->id,
                            'nombre'    => $stock->producto->nombre,
                            'sku'       => $stock->producto->sku,
                            'categoria' => [
                                'nombre' => $stock->producto->categoria->nombre ?? 'Sin categoría',
                            ],
                        ],
                        'almacen'              => [
                            'id'     => $stock->almacen->id,
                            'nombre' => $stock->almacen->nombre,
                        ],
                        'lote'                 => $stock->lote,
                        'stock_actual'         => $stock->cantidad,
                        'cantidad_disponible'  => $stock->cantidad_disponible,
                        'cantidad_reservada'   => $stock->cantidad_reservada,
                        'fecha_vencimiento'    => $stock->fecha_vencimiento,
                        'dias_para_vencer'     => $diasParaVencer,
                        'estado_vencimiento'   => $this->obtenerEstadoVencimiento($diasParaVencer),
                    ];
                });

            // Filtro por estado
            if ($estado && $estado !== 'todos') {
                $stocks = $stocks->filter(function ($stock) use ($estado) {
                    return $stock['estado_vencimiento'] === $estado;
                });
            }

            // Obtener información del filtro de almacén
            $almacenFiltro = null;
            if ($almacenId) {
                $almacen = Almacen::find($almacenId);
                $almacenFiltro = $almacen?->nombre;
            }

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            $vistaMap = [
                'A4' => 'impresion.control-vencimientos.hoja-completa',
            ];

            $vista = $vistaMap[$formato] ?? 'impresion.control-vencimientos.hoja-completa';

            $datos = [
                'productos'        => $stocks->values(),
                'almacenFiltro'    => $almacenFiltro,
                'estadoFiltro'     => $estado !== 'todos' ? $estado : null,
                'busquedaFiltro'   => $busqueda ?: null,
                'soloConStock'     => $soloConStock,
                'empresa'          => auth()->user()->empresa ?? \App\Models\Empresa::first(),
                'fecha_impresion'  => now(),
                'usuario'          => auth()->user()->name ?? null,
            ];

            $html = view($vista, $datos)->render();

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
            $pdf->getDomPDF()->setBasePath(public_path());

            $dompdf = $pdf->getDomPDF();
            $options = $dompdf->getOptions();
            $options->setChroot(public_path());
            $options->setLogOutputFile(storage_path('logs/dompdf.log'));

            $nombreArchivo = 'control-vencimientos-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'stream') {
                return $pdf->stream($nombreArchivo);
            } else {
                return $pdf->download($nombreArchivo);
            }

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir control de vencimientos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }

    /**
     * Helper: Obtener estado de vencimiento
     */
    private function obtenerEstadoVencimiento(int $dias): string
    {
        if ($dias < 0) {
            return 'vencido';
        } elseif ($dias <= 7) {
            return 'critico';
        } elseif ($dias <= 15) {
            return 'urgente';
        } elseif ($dias <= 30) {
            return 'atencion';
        } else {
            return 'vigente';
        }
    }
}
