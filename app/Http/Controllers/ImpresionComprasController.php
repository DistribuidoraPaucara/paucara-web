<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\Response;
use App\Models\Empresa;
use App\Services\ImpresionService;
use App\Models\Compra;

class ImpresionComprasController extends Controller
{
    /**
     * Imprimir compra individual
     * Ruta: GET /compras/{id}/imprimir?formato=A4&accion=stream
     */
    public function imprimirIndividual(Compra $compra, Request $request): Response
    {
        try {
            // Aumentar límite de memoria para DomPDF
            // PHP restaura automáticamente después de la request
            ini_set('memory_limit', '3072M');

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'stream');

            \Log::info('🖨️ [ImpresionComprasController::imprimirIndividual] Generando PDF de compra', [
                'compra_id' => $compra->id,
                'formato' => $formato,
                'accion' => $accion,
                'usuario_id' => auth()->id(),
                'memory_limit_actual' => ini_get('memory_limit'),
            ]);

            // Usar ImpresionService para generar PDF
            $impresionService = app(ImpresionService::class);
            $pdf = $impresionService->imprimirCompra($compra, $formato);

            $nombreArchivo = "compra-{$compra->numero}-" . now()->format('YmdHis') . '.pdf';

            if ($accion === 'stream') {
                return $pdf->stream($nombreArchivo);
            } else {
                return $pdf->download($nombreArchivo);
            }

        } catch (\Exception $e) {
            \Log::error('❌ [ImpresionComprasController::imprimirIndividual] Error', [
                'error' => $e->getMessage(),
                'compra_id' => $compra->id,
            ]);
            return response("Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Renderizar reporte de compras (batch)
     * Usa template específica para colecciones de compras
     */
    public function imprimir(Request $request): Response
    {
        try {
            $compras = collect(session('compras_impresion', []));
            $filtros = session('compras_filtros', []);

            // Obtener empresa del usuario autenticado
            $empresa = auth()->user()->empresa ?? Empresa::first();

            \Log::info('🖨️ [ImpresionComprasController::imprimir] Generando reporte de compras', [
                'cantidad_compras' => $compras->count(),
                'filtros' => $filtros,
                'empresa_id' => $empresa?->id,
            ]);

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            // Limpiar sesión
            session()->forget(['compras_impresion', 'compras_filtros']);

            // Mapear formato a vista específica para batch (colecciones)
            $vistaMap = [
                'A4'        => 'impresion.compras.hoja-completa-compras',
                'TICKET_80' => 'impresion.compras.ticket-80',
                'TICKET_58' => 'impresion.compras.ticket-58',
            ];

            $vista = $vistaMap[$formato] ?? 'impresion.compras.hoja-completa-compras';

            // Renderizar vista HTML con las compras
            $html = view($vista, [
                'compras' => $compras,
                'filtros' => $filtros,
                'empresa' => $empresa,
            ])->render();

            // Convertir HTML a PDF usando DomPDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);

            $nombreArchivo = 'reporte-compras-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            }

            // Retornar PDF para visualización en navegador
            return $pdf->stream($nombreArchivo);

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir reporte de compras', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }
}
