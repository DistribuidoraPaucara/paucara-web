<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ImpresionStockController extends Controller
{
    /**
     * Imprimir listado de stock en diferentes formatos (PDF)
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function imprimir(Request $request)
    {
        try {
            // Aumentar límite de memoria para DomPDF
            // PHP restaura automáticamente después de la request
            ini_set('memory_limit', '3072M');

            // Obtener datos del filtro y stock de la sesión
            $stock = session('stock_impresion', []);
            $almacenFiltro = session('almacen_filtro', null);
            $busquedaFiltro = session('busqueda_filtro', null);

            // Convertir a Collection para poder usar métodos como sum()
            // Ordenar alfabéticamente por nombre del producto
            $stock = collect($stock)->sortBy('producto_nombre');

            // Obtener empresa del usuario autenticado
            $empresa = auth()->user()->empresa ?? Empresa::first();

            \Log::info('🖨️ [ImpresionStockController::imprimir] Generando reporte de stock', [
                'cantidad_items' => $stock->count(),
                'almacen_filtro' => $almacenFiltro,
                'empresa_id' => $empresa?->id,
                'memory_limit_actual' => ini_get('memory_limit'),
            ]);

            // Obtener formato solicitado
            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            // Mapear formato a vista
            $vistaMap = [
                'A4'        => 'impresion.stock.hoja-completa',
                'TICKET_80' => 'impresion.stock.ticket-80',
                'TICKET_58' => 'impresion.stock.ticket-58',
            ];

            $vista = $vistaMap[$formato] ?? 'impresion.stock.hoja-completa';

            // Datos para la vista
            $datos = [
                'stock'            => $stock,
                'almacenFiltro'    => $almacenFiltro,
                'busquedaFiltro'   => $busquedaFiltro,
                'empresa'          => $empresa,
                'fecha_impresion'  => now(),
                'usuario'          => auth()->user()->name ?? null,
            ];

            // Limpiar sesión después de usar los datos
            session()->forget(['stock_impresion', 'almacen_filtro', 'busqueda_filtro']);

            // Renderizar vista HTML
            $html = view($vista, $datos)->render();

            // Convertir HTML a PDF usando DomPDF con opciones optimizadas
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
            $pdf->getDomPDF()->setBasePath(public_path());

            // Optimizaciones para memoria
            $dompdf = $pdf->getDomPDF();
            $options = $dompdf->getOptions();
            $options->setChroot(public_path());
            $options->setLogOutputFile(storage_path('logs/dompdf.log'));

            $nombreArchivo = 'reporte-stock-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'stream') {
                return $pdf->stream($nombreArchivo);
            } else {
                return $pdf->download($nombreArchivo);
            }

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir reporte de stock', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }

    /**
     * Vista previa del listado de stock
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function preview(Request $request)
    {
        $request->merge(['accion' => 'stream']);
        return $this->imprimir($request);
    }
}
