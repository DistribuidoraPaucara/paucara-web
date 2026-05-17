<?php

namespace App\Http\Controllers;

use App\Models\BannerPublicitario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class BannerPublicitarioAdminController extends Controller
{
    /**
     * Mostrar lista de banners publicitarios
     */
    public function index(Request $request)
    {
        $query = BannerPublicitario::query();

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'LIKE', "%{$search}%")
                    ->orWhere('descripcion', 'LIKE', "%{$search}%");
            });
        }

        // Filtro por estado
        if ($request->filled('estado')) {
            $estado = $request->input('estado');
            if ($estado === 'activo') {
                $query->where('activo', true);
            } elseif ($estado === 'inactivo') {
                $query->where('activo', false);
            }
        }

        // Filtro por vigencia
        if ($request->filled('vigencia')) {
            $vigencia = $request->input('vigencia');
            $hoy = Carbon::today();

            if ($vigencia === 'vigente') {
                $query->activos()
                    ->where(function ($q) use ($hoy) {
                        $q->whereNull('fecha_inicio')->orWhere('fecha_inicio', '<=', $hoy);
                    })
                    ->where(function ($q) use ($hoy) {
                        $q->whereNull('fecha_fin')->orWhere('fecha_fin', '>=', $hoy);
                    });
            } elseif ($vigencia === 'proximo') {
                $query->activos()->where('fecha_inicio', '>', $hoy);
            } elseif ($vigencia === 'vencido') {
                $query->where('fecha_fin', '<', $hoy);
            }
        }

        // Ordenar
        $query->orderBy('orden', 'asc')->orderBy('created_at', 'desc');

        // Paginar
        $banners = $query->paginate(15)->withQueryString();

        // Enriquecer datos
        $banners = $banners->through(function ($banner) {
            return [
                'id' => $banner->id,
                'titulo' => $banner->titulo,
                'descripcion' => $banner->descripcion,
                'imagen' => $banner->imagen,
                'nombre_archivo' => $banner->nombre_archivo,
                'url_imagen' => $banner->urlImagen,
                'fecha_inicio' => $banner->fecha_inicio,
                'fecha_fin' => $banner->fecha_fin,
                'activo' => $banner->activo,
                'orden' => $banner->orden,
                'estado_vigencia' => $banner->estadoVigencia,
                'esta_vigente' => $banner->estaVigente,
                'created_at' => $banner->created_at,
                'updated_at' => $banner->updated_at,
            ];
        });

        // Calcular estadísticas
        $estadisticas = [
            'total' => BannerPublicitario::count(),
            'activos' => BannerPublicitario::where('activo', true)->count(),
            'inactivos' => BannerPublicitario::where('activo', false)->count(),
            'vigentes' => BannerPublicitario::vigentes()->count(),
        ];

        return Inertia::render('admin/banners-publicitarios', [
            'banners' => $banners,
            'estadisticas' => $estadisticas,
            'filters' => [
                'search' => $request->input('search'),
                'estado' => $request->input('estado'),
                'vigencia' => $request->input('vigencia'),
            ],
        ]);
    }

    /**
     * Guardar un nuevo banner
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'imagen' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'activo' => 'nullable|boolean',
            'orden' => 'nullable|integer|min:0',
        ]);

        try {
            // Subir imagen
            $file = $request->file('imagen');
            // ✅ CORREGIDO (2026-03-03): Usar hashName() para evitar nombres demasiado largos
            // hashName() genera un nombre único y corto: {hash}.{extension}
            // Ejemplo: 5d41402abc4b2a76b9719d911017c592.jpg
            $nombreArchivo = $file->hashName();
            $ruta = $file->storeAs('banners-publicitarios', $nombreArchivo, 'public');

            // Crear banner
            $banner = BannerPublicitario::create([
                'titulo' => $validated['titulo'],
                'descripcion' => $validated['descripcion'] ?? null,
                'imagen' => $ruta,
                'nombre_archivo' => $file->getClientOriginalName(),  // Guardar nombre original para referencia
                'fecha_inicio' => $validated['fecha_inicio'] ?? null,
                'fecha_fin' => $validated['fecha_fin'] ?? null,
                'activo' => $validated['activo'] ?? true,
                'orden' => $validated['orden'] ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Banner creado exitosamente',
                'data' => [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'descripcion' => $banner->descripcion,
                    'imagen' => $banner->imagen,
                    'url_imagen' => $banner->urlImagen,
                    'fecha_inicio' => $banner->fecha_inicio,
                    'fecha_fin' => $banner->fecha_fin,
                    'activo' => $banner->activo,
                    'orden' => $banner->orden,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear banner: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar un banner
     */
    public function update(Request $request, BannerPublicitario $banner)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'activo' => 'nullable|boolean',
            'orden' => 'nullable|integer|min:0',
        ]);

        try {
            // Si hay imagen nueva, eliminar la anterior
            if ($request->hasFile('imagen')) {
                if (Storage::disk('public')->exists($banner->imagen)) {
                    Storage::disk('public')->delete($banner->imagen);
                }

                $file = $request->file('imagen');
                // ✅ CORREGIDO (2026-03-03): Usar hashName() para evitar nombres demasiado largos
                $nombreArchivo = $file->hashName();
                $ruta = $file->storeAs('banners-publicitarios', $nombreArchivo, 'public');

                $validated['imagen'] = $ruta;
                $validated['nombre_archivo'] = $file->getClientOriginalName();  // Guardar nombre original para referencia
            }

            $banner->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Banner actualizado exitosamente',
                'data' => [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'descripcion' => $banner->descripcion,
                    'imagen' => $banner->imagen,
                    'url_imagen' => $banner->urlImagen,
                    'fecha_inicio' => $banner->fecha_inicio,
                    'fecha_fin' => $banner->fecha_fin,
                    'activo' => $banner->activo,
                    'orden' => $banner->orden,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar banner: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle el estado activo de un banner
     */
    public function toggleActivo(BannerPublicitario $banner)
    {
        try {
            $banner->update(['activo' => !$banner->activo]);

            return response()->json([
                'success' => true,
                'message' => 'Banner ' . ($banner->activo ? 'activado' : 'desactivado') . ' exitosamente',
                'data' => [
                    'id' => $banner->id,
                    'activo' => $banner->activo,
                    'estado_vigencia' => $banner->estadoVigencia,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar banner: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar el orden de los banners
     */
    public function actualizarOrden(Request $request)
    {
        $validated = $request->validate([
            'banderas' => 'required|array',
            'banderas.*' => 'required|integer|exists:banners_publicitarios,id',
        ]);

        try {
            foreach ($validated['banderas'] as $orden => $id) {
                BannerPublicitario::find($id)->update(['orden' => $orden]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Orden actualizado exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar orden: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un banner
     */
    public function destroy(BannerPublicitario $banner)
    {
        try {
            // Eliminar imagen de storage
            if (Storage::disk('public')->exists($banner->imagen)) {
                Storage::disk('public')->delete($banner->imagen);
            }

            $banner->delete();

            return response()->json([
                'success' => true,
                'message' => 'Banner eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar banner: ' . $e->getMessage(),
            ], 500);
        }
    }
}
