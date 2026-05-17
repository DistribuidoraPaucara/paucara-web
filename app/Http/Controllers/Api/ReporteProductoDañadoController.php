<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReporteProductoDanado;
use App\Models\ReporteProductoDañadoImagen;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReporteProductoDañadoController extends Controller
{
    /**
     * Listar reportes de productos dañados
     * GET /api/reportes-productos-danados
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $query = ReporteProductoDanado::with(['venta', 'cliente', 'usuario', 'imagenes']);

            // Filtros
            if ($request->has('estado')) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('cliente_id')) {
                $query->where('cliente_id', $request->cliente_id);
            }

            if ($request->has('venta_id')) {
                $query->where('venta_id', $request->venta_id);
            }

            if ($request->has('desde') && $request->has('hasta')) {
                $query->whereBetween('fecha_reporte', [
                    $request->desde,
                    $request->hasta,
                ]);
            }

            // Ordenamiento
            $orderBy = $request->get('orderBy', 'created_at');
            $orderDir = $request->get('orderDir', 'desc');
            $query->orderBy($orderBy, $orderDir);

            $reportes = $query->paginate($request->get('perPage', 20));

            return response()->json([
                'success' => true,
                'data' => $reportes,
                'message' => 'Reportes obtenidos correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al obtener reportes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reportes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear un nuevo reporte
     * POST /api/reportes-productos-danados
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'venta_id' => 'required|exists:ventas,id',
                'observaciones' => 'required|string|min:10|max:1000',
            ]);

            $user = Auth::user();
            $venta = Venta::findOrFail($request->venta_id);

            // Crear el reporte
            $reporte = ReporteProductoDanado::create([
                'venta_id' => $request->venta_id,
                'cliente_id' => $venta->cliente_id,
                'usuario_id' => $user->id,
                'observaciones' => $request->observaciones,
                'estado' => 'pendiente',
                'fecha_reporte' => now()->toDateString(),
            ]);

            return response()->json([
                'success' => true,
                'data' => $reporte->load(['venta', 'cliente', 'usuario', 'imagenes']),
                'message' => 'Reporte creado correctamente',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error al crear reporte: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear reporte: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ver detalles de un reporte
     * GET /api/reportes-productos-danados/{id}
     */
    public function show($id)
    {
        try {
            $reporte = ReporteProductoDanado::with(['venta', 'cliente', 'usuario', 'imagenes'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $reporte,
                'message' => 'Reporte obtenido correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al obtener reporte: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reporte: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar estado del reporte
     * PATCH /api/reportes-productos-danados/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'estado' => 'required|in:pendiente,en_revision,aprobado,rechazado',
                'notas_respuesta' => 'nullable|string|max:1000',
            ]);

            $reporte = ReporteProductoDanado::findOrFail($id);
            $reporte->update($validated);

            return response()->json([
                'success' => true,
                'data' => $reporte->load(['venta', 'cliente', 'usuario', 'imagenes']),
                'message' => 'Reporte actualizado correctamente',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar reporte: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar reporte: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Subir imagen para un reporte
     * POST /api/reportes-productos-danados/{id}/imagenes
     */
    public function subirImagen(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB máximo
                'descripcion' => 'nullable|string|max:255',
            ]);

            $reporte = ReporteProductoDanado::findOrFail($id);

            if ($request->hasFile('imagen')) {
                $archivo = $request->file('imagen');
                $nombreArchivo = time() . '_' . uniqid() . '.' . $archivo->getClientOriginalExtension();

                // Guardar en storage/app/public/reportes-danados
                $ruta = $archivo->storeAs(
                    'reportes-danados/' . $reporte->id,
                    $nombreArchivo,
                    'public'
                );

                // Crear registro de imagen
                $imagen = ReporteProductoDañadoImagen::create([
                    'reporte_id' => $reporte->id,
                    'ruta_imagen' => $ruta,
                    'nombre_archivo' => $nombreArchivo,
                    'descripcion' => $request->get('descripcion'),
                    'fecha_carga' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'data' => $imagen,
                    'message' => 'Imagen subida correctamente',
                ], 201);
            }

            return response()->json([
                'success' => false,
                'message' => 'No se envió ninguna imagen',
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error al subir imagen: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al subir imagen: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar una imagen del reporte
     * DELETE /api/reportes-productos-danados/imagenes/{imagenId}
     */
    public function eliminarImagen($imagenId)
    {
        try {
            $imagen = ReporteProductoDañadoImagen::findOrFail($imagenId);

            // Eliminar archivo del storage
            if (Storage::disk('public')->exists($imagen->ruta_imagen)) {
                Storage::disk('public')->delete($imagen->ruta_imagen);
            }

            $imagen->delete();

            return response()->json([
                'success' => true,
                'message' => 'Imagen eliminada correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar imagen: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar imagen: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un reporte
     * DELETE /api/reportes-productos-danados/{id}
     */
    public function destroy($id)
    {
        try {
            $reporte = ReporteProductoDanado::findOrFail($id);

            // Eliminar todas las imágenes
            foreach ($reporte->imagenes as $imagen) {
                if (Storage::disk('public')->exists($imagen->ruta_imagen)) {
                    Storage::disk('public')->delete($imagen->ruta_imagen);
                }
            }

            $reporte->delete();

            return response()->json([
                'success' => true,
                'message' => 'Reporte eliminado correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al eliminar reporte: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar reporte: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener reportes de una venta específica
     * GET /api/ventas/{ventaId}/reportes
     */
    public function reportesPorVenta($ventaId)
    {
        try {
            $reportes = ReporteProductoDanado::where('venta_id', $ventaId)
                ->with(['cliente', 'usuario', 'imagenes'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reportes,
                'message' => 'Reportes obtenidos correctamente',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al obtener reportes por venta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reportes: ' . $e->getMessage(),
            ], 500);
        }
    }
}
