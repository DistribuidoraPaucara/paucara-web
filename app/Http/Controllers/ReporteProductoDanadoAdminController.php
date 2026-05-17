<?php

namespace App\Http\Controllers;

use App\Models\ReporteProductoDanado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReporteProductoDanadoAdminController extends Controller
{
    /**
     * Mostrar lista de reportes de productos dañados
     */
    public function index(Request $request)
    {
        $query = ReporteProductoDanado::with([
            'venta',
            'cliente',
            'usuario',
            'imagenes'
        ]);

        // Filtro por estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('cliente', function ($clientQuery) use ($search) {
                    $clientQuery->where('nombre', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('venta', function ($ventaQuery) use ($search) {
                    $ventaQuery->where('numero', 'LIKE', "%{$search}%");
                })
                ->orWhere('observaciones', 'LIKE', "%{$search}%");
            });
        }

        // Ordenar por más reciente
        $query->orderBy('created_at', 'desc');

        // Paginar
        $reportes = $query->paginate(15)->withQueryString();

        // Calcular estadísticas
        $estadisticas = [
            'total_reportes' => ReporteProductoDanado::count(),
            'pendientes' => ReporteProductoDanado::where('estado', 'pendiente')->count(),
            'en_revision' => ReporteProductoDanado::where('estado', 'en_revision')->count(),
            'aprobados' => ReporteProductoDanado::where('estado', 'aprobado')->count(),
            'rechazados' => ReporteProductoDanado::where('estado', 'rechazado')->count(),
        ];

        // Enriquecer datos (usa through para mantener estructura de paginación)
        $reportes = $reportes->through(function ($reporte) {
            return [
                'id' => $reporte->id,
                'venta_id' => $reporte->venta_id,
                'numero_venta' => $reporte->venta?->numero ?? 'Desconocida',
                'cliente_id' => $reporte->cliente_id,
                'nombre_cliente' => $reporte->cliente?->nombre ?? 'Cliente desconocido',
                'observaciones' => $reporte->observaciones,
                'estado' => $reporte->estado,
                'estado_descripcion' => $reporte->estadoDescripcion,
                'notas_respuesta' => $reporte->notas_respuesta,
                'fecha_reporte' => $reporte->fecha_reporte,
                'created_at' => $reporte->created_at,
                'updated_at' => $reporte->updated_at,
                'imagenes' => $reporte->imagenes->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'ruta_imagen' => $img->ruta_imagen,
                        'nombre_archivo' => $img->nombre_archivo,
                        'descripcion' => $img->descripcion,
                    ];
                })->toArray(),
            ];
        });

        return Inertia::render('admin/reportes-productos-danados', [
            'reportes' => $reportes,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Obtener detalle de un reporte
     */
    public function show(ReporteProductoDanado $reporteProductoDanado)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $reporteProductoDanado->id,
                'venta_id' => $reporteProductoDanado->venta_id,
                'cliente_id' => $reporteProductoDanado->cliente_id,
                'observaciones' => $reporteProductoDanado->observaciones,
                'estado' => $reporteProductoDanado->estado,
                'notas_respuesta' => $reporteProductoDanado->notas_respuesta,
                'fecha_reporte' => $reporteProductoDanado->fecha_reporte,
                'created_at' => $reporteProductoDanado->created_at,
                'updated_at' => $reporteProductoDanado->updated_at,
                'venta' => $reporteProductoDanado->venta,
                'cliente' => $reporteProductoDanado->cliente,
                'usuario' => $reporteProductoDanado->usuario,
                'imagenes' => $reporteProductoDanado->imagenes,
            ],
        ]);
    }

    /**
     * Actualizar estado de un reporte
     */
    public function update(Request $request, ReporteProductoDanado $reporteProductoDanado)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,en_revision,aprobado,rechazado',
            'notas_respuesta' => 'nullable|string|max:1000',
        ]);

        $reporteProductoDanado->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Reporte actualizado exitosamente',
            'data' => $reporteProductoDanado,
        ]);
    }

    /**
     * Eliminar un reporte
     */
    public function destroy(ReporteProductoDanado $reporteProductoDanado)
    {
        $reporteProductoDanado->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reporte eliminado exitosamente',
        ]);
    }
}
