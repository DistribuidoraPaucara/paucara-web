<?php

namespace App\Http\Controllers;

use App\Models\ReporteCarga;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

/**
 * ReporteCargaPdfController - Generar PDFs de reportes de carga
 *
 * RESPONSABILIDADES:
 * ✓ Generar PDF del reporte con sus detalles
 * ✓ Generar PDF con todas las entregas del reporte
 * ✓ Descargar o ver en navegador
 */
class ReporteCargaPdfController extends Controller
{
    /**
     * Generar y descargar PDF del reporte de carga
     *
     * GET /api/reportes/{reporte}/pdf
     *
     * @param ReporteCarga $reporte
     * @return Response PDF o descarga
     */
    public function generarPdf(ReporteCarga $reporte)
    {
        try {
            // Cargar relaciones necesarias
            $reporte->load([
                'entregas' => function ($query) {
                    $query->orderBy('reporte_carga_entregas.orden');
                },
                'entregas.ventas.cliente',
                'entregas.ventas.detalles.producto',
                'vehiculo',
                'detalles.producto',
            ]);

            // Preparar datos para el PDF
            $data = [
                'reporte' => $reporte,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name', 'Distribuidora Paucara'),
            ];

            // Generar PDF
            $pdf = Pdf::loadView('reportes.reporte-carga-pdf', $data)
                ->setPaper('A4')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // Retornar como descarga
            return $pdf->download("reporte-{$reporte->numero_reporte}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generando PDF',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generar y descargar PDF del reporte con entregas detalladas
     *
     * GET /api/reportes/{reporte}/pdf-detallado
     *
     * @param ReporteCarga $reporte
     * @return Response PDF o descarga
     */
    public function generarPdfDetallado(ReporteCarga $reporte)
    {
        try {
            // Cargar relaciones necesarias
            $reporte->load([
                'entregas' => function ($query) {
                    $query->orderBy('reporte_carga_entregas.orden');
                },
                'entregas.ventas.cliente',
                'entregas.ventas.detalles.producto',
                'entregas.chofer',
                'entregas.vehiculo',
                'vehiculo',
                'detalles.producto',
            ]);

            // Preparar datos para el PDF
            $data = [
                'reporte' => $reporte,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name', 'Distribuidora Paucara'),
                'detallado' => true,
            ];

            // Generar PDF
            $pdf = Pdf::loadView('reportes.reporte-carga-pdf', $data)
                ->setPaper('A4')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // Retornar como descarga
            return $pdf->download("reporte-detallado-{$reporte->numero_reporte}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generando PDF detallado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Vista previa del PDF en el navegador (sin descargar)
     *
     * GET /api/reportes/{reporte}/pdf-preview
     *
     * @param ReporteCarga $reporte
     * @return Response PDF para ver en navegador
     */
    public function previewPdf(ReporteCarga $reporte)
    {
        try {
            // Cargar relaciones necesarias
            $reporte->load([
                'entregas' => function ($query) {
                    $query->orderBy('reporte_carga_entregas.orden');
                },
                'entregas.ventas.cliente',
                'entregas.ventas.detalles.producto',
                'vehiculo',
                'detalles.producto',
            ]);

            // Preparar datos para el PDF
            $data = [
                'reporte' => $reporte,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name', 'Distribuidora Paucara'),
            ];

            // Generar PDF
            $pdf = Pdf::loadView('reportes.reporte-carga-pdf', $data)
                ->setPaper('A4')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // Retornar como stream (abre en navegador)
            return $pdf->stream("reporte-{$reporte->numero_reporte}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generando vista previa',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
