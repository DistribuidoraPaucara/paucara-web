<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Entrega;
use App\Models\PlantillaImpresion;
use App\Models\ReporteCarga;
use App\Models\ReporteCargaDetalle;
use App\Services\ImpresionService;
use App\Services\Logistica\ReporteCargoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ReporteCargoController extends Controller
{
    public function __construct(
        private ReporteCargoService $reporteService,
        private ImpresionService $impresionService,
    ) {}

    /**
     * POST /api/reportes-carga
     * Generar un nuevo reporte de carga desde una entrega
     */
    public function generarReporte(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'entrega_id' => 'required|exists:entregas,id',
                'vehiculo_id' => 'nullable|exists:vehiculos,id',
                'descripcion' => 'nullable|string|max:500',
                'peso_total_kg' => 'nullable|numeric|min:0',
                'volumen_total_m3' => 'nullable|numeric|min:0',
            ]);

            $entrega = Entrega::findOrFail($validated['entrega_id']);

            $reporte = $this->reporteService->generarReporteDesdeEntrega(
                $entrega,
                $validated
            );

            return response()->json([
                'success' => true,
                'message' => 'Reporte de carga generado exitosamente',
                'data' => $this->formatearReporte($reporte),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generando reporte de carga: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * GET /api/reportes-carga/{reporte}
     * Obtener detalles de un reporte de carga
     */
    public function show(ReporteCarga $reporte): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $this->formatearReporte($reporte->load('detalles.producto')),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo reporte: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * PATCH /api/reportes-carga/{reporte}/detalles/{detalle}
     * Actualizar cantidad cargada de un detalle
     */
    public function actualizarDetalle(Request $request, ReporteCarga $reporte, ReporteCargaDetalle $detalle): JsonResponse
    {
        try {
            // Verificar que el detalle pertenece al reporte
            if ($detalle->reporte_carga_id !== $reporte->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Detalle no pertenece a este reporte',
                ], 422);
            }

            $validated = $request->validate([
                'cantidad_cargada' => 'required|integer|min:0',
                'notas' => 'nullable|string|max:500',
            ]);

            $detalle = $this->reporteService->actualizarCantidadCargada(
                $detalle,
                $validated['cantidad_cargada']
            );

            if ($validated['notas'] ?? null) {
                $detalle->update(['notas' => $validated['notas']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detalle actualizado exitosamente',
                'data' => $detalle,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error actualizando detalle: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/reportes-carga/{reporte}/detalles/{detalle}/verificar
     * Marcar un detalle como verificado
     */
    public function verificarDetalle(Request $request, ReporteCarga $reporte, ReporteCargaDetalle $detalle): JsonResponse
    {
        try {
            // Verificar que el detalle pertenece al reporte
            if ($detalle->reporte_carga_id !== $reporte->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Detalle no pertenece a este reporte',
                ], 422);
            }

            $validated = $request->validate([
                'notas' => 'nullable|string|max:500',
            ]);

            $detalle = $this->reporteService->verificarDetalle(
                $detalle,
                $validated['notas'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Detalle verificado exitosamente',
                'data' => $detalle,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error verificando detalle: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/reportes-carga/{reporte}/confirmar
     * Confirmar la carga completa del reporte
     */
    public function confirmarCarga(ReporteCarga $reporte): JsonResponse
    {
        try {
            $reporte = $this->reporteService->confirmarCarga($reporte);

            return response()->json([
                'success' => true,
                'message' => 'Carga confirmada exitosamente',
                'data' => $this->formatearReporte($reporte),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error confirmando carga: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/reportes-carga/{reporte}/listo-para-entrega
     * Marcar reporte como listo para entrega (después de completar carga)
     */
    public function marcarListoParaEntrega(ReporteCarga $reporte): JsonResponse
    {
        try {
            $reporte = $this->reporteService->marcarListoParaEntrega($reporte);

            return response()->json([
                'success' => true,
                'message' => 'Entrega marcada como lista para partida',
                'data' => $this->formatearReporte($reporte),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error marcando como listo: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * POST /api/reportes-carga/{reporte}/cancelar
     * Cancelar un reporte de carga
     */
    public function cancelarReporte(Request $request, ReporteCarga $reporte): JsonResponse
    {
        try {
            $validated = $request->validate([
                'razon' => 'nullable|string|max:500',
            ]);

            $reporte = $this->reporteService->cancelarReporte($reporte, $validated['razon'] ?? null);

            return response()->json([
                'success' => true,
                'message' => 'Reporte cancelado exitosamente',
                'data' => $this->formatearReporte($reporte),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error cancelando reporte: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * GET /api/reportes-carga/{reporte}/descargar
     * Descargar reporte de carga como PDF
     *
     * Query Parameters:
     *  - formato: 'A4'|'TICKET_80'|'TICKET_58' (default: TICKET_58)
     *  - accion: 'download'|'stream' (default: download)
     */
    public function descargar(ReporteCarga $reporte, Request $request)
    {
        try {
            $formato = $request->input('formato', 'TICKET_58'); // Default: más usado
            $accion = $request->input('accion', 'download');

            // Cargar relaciones necesarias
            $reporte->load([
                'entrega.venta.cliente',
                'entrega.proforma.cliente',
                'entrega.chofer',
                'vehiculo',
                'generador',
                'detalles.producto',
            ]);

            // Usar ImpresionService en lugar de PDF directo
            $pdf = $this->impresionService->generarPDF(
                'reporte_carga',  // Tipo de documento
                $reporte,         // Datos
                $formato          // Formato solicitado
            );

            $nombreArchivo = "Reporte-Carga-{$reporte->numero_reporte}_{$formato}.pdf";

            // Retornar según acción
            return $accion === 'stream'
                ? $pdf->stream($nombreArchivo)
                : $pdf->download($nombreArchivo);

        } catch (\Exception $e) {
            \Log::error('Error descargando reporte de carga', [
                'reporte_id' => $reporte->id,
                'formato' => $request->input('formato'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error descargando reporte: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * GET /api/reportes-carga/formatos-disponibles
     * Obtener lista de formatos de impresión disponibles
     */
    public function formatosDisponibles(): JsonResponse
    {
        try {
            $formatos = $this->impresionService->obtenerFormatosDisponibles('reporte_carga');

            return response()->json([
                'success' => true,
                'data' => $formatos,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error obteniendo formatos disponibles', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener formatos disponibles',
            ], 500);
        }
    }

    /**
     * GET /api/reportes-carga/{reporte}/preview
     * Vista previa HTML del reporte antes de imprimir
     *
     * Query Parameters:
     *  - formato: 'A4'|'TICKET_80'|'TICKET_58' (default: A4)
     */
    public function preview(ReporteCarga $reporte, Request $request)
    {
        try {
            $formato = $request->input('formato', 'A4');

            // Obtener plantilla según formato
            $plantilla = PlantillaImpresion::obtenerDefault('reporte_carga', $formato);

            if (!$plantilla) {
                abort(404, "No existe plantilla para formato {$formato}");
            }

            // Cargar relaciones
            $reporte->load([
                'entrega.venta.cliente',
                'entrega.proforma.cliente',
                'entrega.chofer',
                'vehiculo',
                'generador',
                'detalles.producto',
            ]);

            $empresa = \App\Models\Empresa::principal();

            // Renderizar vista Blade directamente
            return view($plantilla->vista_blade, [
                'documento' => $reporte,
                'reporte' => $reporte,
                'detalles' => $reporte->detalles,
                'empresa' => $empresa,
                'plantilla' => $plantilla,
                'fecha_impresion' => now(),
                'usuario' => auth()->user(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en preview de reporte', [
                'reporte_id' => $reporte->id,
                'error' => $e->getMessage(),
            ]);

            return response()->view('errors.500', [
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Formatear datos de reporte para respuesta
     */
    private function formatearReporte(ReporteCarga $reporte): array
    {
        $reporte->load([
            'entrega',
            'vehiculo',
            'venta',
            'generador',
            'confirmador',
            'detalles.producto',
            'detalles.verificador',
        ]);

        return [
            'id' => $reporte->id,
            'numero_reporte' => $reporte->numero_reporte,
            'entrega_id' => $reporte->entrega_id,
            'vehiculo_id' => $reporte->vehiculo_id,
            'venta_id' => $reporte->venta_id,
            'estado' => $reporte->estado,
            'descripcion' => $reporte->descripcion,
            'peso_total_kg' => (float) $reporte->peso_total_kg,
            'volumen_total_m3' => (float) $reporte->volumen_total_m3,
            'fecha_generacion' => $reporte->fecha_generacion?->toIso8601String(),
            'fecha_confirmacion' => $reporte->fecha_confirmacion?->toIso8601String(),
            'generado_por' => $reporte->generador?->name,
            'confirmado_por' => $reporte->confirmador?->name,
            'porcentaje_cargado' => $reporte->porcentaje_cargado,
            'resumen' => $reporte->obtenerResumenCarga(),
            'detalles' => $reporte->detalles->map(fn($d) => [
                'id' => $d->id,
                'producto_id' => $d->producto_id,
                'producto' => $d->producto?->nombre,
                'cantidad_solicitada' => $d->cantidad_solicitada,
                'cantidad_cargada' => $d->cantidad_cargada,
                'diferencia' => $d->diferencia,
                'peso_kg' => (float) $d->peso_kg,
                'porcentaje_cargado' => $d->porcentaje_cargado,
                'verificado' => $d->verificado,
                'verificado_por' => $d->verificador?->name,
                'fecha_verificacion' => $d->fecha_verificacion?->toIso8601String(),
                'notas' => $d->notas,
            ])->toArray(),
        ];
    }
}
