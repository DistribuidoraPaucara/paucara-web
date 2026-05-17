<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Empresa;

class ImpresionProformasController extends Controller
{
    /**
     * Renderizar reporte de proformas (batch)
     * Usa template específica para colecciones de proformas
     * Sigue el mismo patrón que ImpresionVentasController
     */
    public function imprimir(Request $request): Response
    {
        try {
            $proformas = collect(session('proformas_impresion', []));
            $filtros = session('proformas_filtros', []);

            // Obtener empresa del usuario autenticado
            $empresa = auth()->user()->empresa ?? Empresa::first();

            \Log::info('🖨️ [ImpresionProformasController::imprimir] Generando reporte de proformas', [
                'cantidad_proformas' => $proformas->count(),
                'filtros' => $filtros,
                'empresa_id' => $empresa?->id,
            ]);

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            // Limpiar sesión
            session()->forget(['proformas_impresion', 'proformas_filtros']);

            // Mapear formato a vista específica para batch (colecciones)
            $vistaMap = [
                'A4'        => 'proformas.imprimir.listado-a4',
                'TICKET_80' => 'proformas.imprimir.ticket-80',
                'TICKET_58' => 'proformas.imprimir.ticket-58',
            ];

            $vista = $vistaMap[$formato] ?? 'proformas.imprimir.listado-a4';

            // ✅ Ordenar ascendentemente por ID
            $proformasOrdenadas = $proformas->sortBy('id');

            // Renderizar vista HTML con las proformas
            $html = view($vista, [
                'proformas' => $proformasOrdenadas,
                'filtros' => $filtros,
                'empresa' => $empresa,
                'titulo' => 'Reporte de Proformas',
            ])->render();

            // Convertir HTML a PDF usando DomPDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);

            $nombreArchivo = 'reporte-proformas-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            }

            // Retornar PDF para visualización en navegador
            return $pdf->stream($nombreArchivo);

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir reporte de proformas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }
}
