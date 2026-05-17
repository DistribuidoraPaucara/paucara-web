<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\Response;
use App\Models\Empresa;

class ImpresionMovimientosController extends Controller
{
    /**
     * Renderizar reporte de movimientos de inventario (batch)
     * Usa template específica para colecciones de movimientos
     */
    public function imprimir(Request $request): Response
    {
        try {
            $movimientos = collect(session('movimientos_impresion', []));
            $filtros = session('movimientos_filtros', []);

            // Obtener empresa del usuario autenticado
            $empresa = auth()->user()->empresa ?? Empresa::first();

            \Log::info('🖨️ [ImpresionMovimientosController::imprimir] Generando reporte de movimientos', [
                'cantidad_movimientos' => $movimientos->count(),
                'filtros' => $filtros,
                'empresa_id' => $empresa?->id,
            ]);

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            // Limpiar sesión
            session()->forget(['movimientos_impresion', 'movimientos_filtros']);

            // Mapear formato a vista específica para batch (colecciones)
            $vistaMap = [
                'A4'        => 'impresion.movimientos.hoja-completa-movimientos',
                'TICKET_80' => 'impresion.movimientos.ticket-80',
                'TICKET_58' => 'impresion.movimientos.ticket-58',
            ];

            $vista = $vistaMap[$formato] ?? 'impresion.movimientos.hoja-completa-movimientos';

            // Renderizar vista HTML con los movimientos
            $html = view($vista, [
                'movimientos' => $movimientos,
                'filtros' => $filtros,
                'empresa' => $empresa,
            ])->render();

            // Convertir HTML a PDF usando DomPDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);

            $nombreArchivo = 'reporte-movimientos-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            }

            // Retornar PDF para visualización en navegador
            return $pdf->stream($nombreArchivo);

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir reporte de movimientos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }
}
