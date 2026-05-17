<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\Response;
use App\Models\Empresa;
use App\Services\ImpresionService;

class ImpresionVentasController extends Controller
{
    /**
     * Renderizar venta individual
     */
    public function imprimirIndividual(\App\Models\Venta $venta, Request $request): Response
    {
        try {
            // Obtener empresa del usuario autenticado
            $empresa = auth()->user()->empresa ?? Empresa::first();

            \Log::info('🖨️ [ImpresionVentasController::imprimirIndividual] Generando PDF de venta individual', [
                'venta_id' => $venta->id,
                'empresa_id' => $empresa?->id,
                'formato' => $request->get('formato'),
            ]);

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            // Usar ImpresionService para generar PDF
            $impresionService = app(ImpresionService::class);
            $pdf = $impresionService->imprimirVenta($venta, $formato);

            $nombreArchivo = 'venta-' . $venta->numero . '-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            }

            // Retornar PDF para visualización en navegador
            return $pdf->stream($nombreArchivo);

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir venta individual', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }

    /**
     * Renderizar reporte de ventas (batch)
     * Usa template específica para colecciones de ventas
     */
    public function imprimir(Request $request): Response
    {
        try {
            $ventas = collect(session('ventas_impresion', []));
            $filtros = session('ventas_filtros', []);

            // Obtener empresa del usuario autenticado
            $empresa = auth()->user()->empresa ?? Empresa::first();

            \Log::info('🖨️ [ImpresionVentasController::imprimir] Generando reporte de ventas', [
                'cantidad_ventas' => $ventas->count(),
                'filtros' => $filtros,
                'empresa_id' => $empresa?->id,
            ]);

            $formato = $request->get('formato', 'A4');
            $accion = $request->get('accion', 'download');

            // Limpiar sesión
            session()->forget(['ventas_impresion', 'ventas_filtros']);

            // Mapear formato a vista específica para batch (colecciones)
            $vistaMap = [
                'A4'        => 'impresion.ventas.hoja-completa-ventas',
                'TICKET_80' => 'impresion.ventas.ticket-80',
                'TICKET_58' => 'impresion.ventas.ticket-58',
            ];

            $vista = $vistaMap[$formato] ?? 'impresion.ventas.hoja-completa-ventas';

            // ✅ ACTUALIZADO (2026-02-24): Aplicar ordenamiento dinámico según filtros
            // Si los filtros incluyen sort_by y sort_order, usarlos; si no, usar DESC por ID
            $sortBy = $filtros['sort_by'] ?? 'id';
            $sortOrder = $filtros['sort_order'] ?? 'desc';

            // Validar campos permitidos para ordenamiento
            $camposPermitidos = ['id', 'created_at', 'updated_at', 'fecha', 'numero', 'total', 'estado'];
            $sortBy = in_array(strtolower($sortBy), $camposPermitidos) ? $sortBy : 'id';
            $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'asc' : 'desc';

            // Aplicar ordenamiento a la colección
            if ($sortOrder === 'asc') {
                $ventasOrdenadas = $ventas->sortBy($sortBy);
            } else {
                $ventasOrdenadas = $ventas->sortByDesc($sortBy);
            }

            // Renderizar vista HTML con las ventas
            $html = view($vista, [
                'ventas' => $ventasOrdenadas,
                'filtros' => $filtros,
                'empresa' => $empresa,
            ])->render();

            // Convertir HTML a PDF usando DomPDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);

            $nombreArchivo = 'reporte-ventas-' . now()->format('YmdHis') . '.pdf';

            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            }

            // Retornar PDF para visualización en navegador
            return $pdf->stream($nombreArchivo);

        } catch (\Exception $e) {
            \Log::error('❌ Error al imprimir reporte de ventas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response("Error al generar el reporte: " . $e->getMessage(), 500);
        }
    }
}
