<?php
namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Localidad;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocalidadController extends Controller
{
    /**
     * API: Listar todas las localidades activas
     */
    public function indexApi(Request $request): JsonResponse
    {
        $localidades = Localidad::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo']);

        return ApiResponse::success($localidades);
    }

    /**
     * Web: Obtener localidades activas para selects (sin requerir auth adicional)
     */
    public function getActiveLocalidades(Request $request): JsonResponse
    {
        $localidades = Localidad::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo']);

        return response()->json([
            'success' => true,
            'data'    => $localidades,
        ]);
    }

    /**
     * API: Mostrar localidad específica
     */
    public function showApi(Localidad $localidad): JsonResponse
    {
        return ApiResponse::success($localidad);
    }

    /**
     * API: Crear nueva localidad
     */
    public function storeApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:localidades,nombre'],
            'codigo' => ['required', 'string', 'max:10', 'unique:localidades,codigo', 'alpha'],
            'activo' => ['boolean'],
        ]);

        $data['activo'] = $data['activo'] ?? true;

        try {
            $localidad = Localidad::create($data);

            return ApiResponse::success(
                $localidad,
                'Localidad creada exitosamente',
                201
            );
        } catch (\Exception $e) {
            return ApiResponse::error('Error al crear localidad: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Actualizar localidad
     */
    public function updateApi(Request $request, Localidad $localidad): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:255', 'unique:localidades,nombre,' . $localidad->id],
            'codigo' => ['sometimes', 'required', 'string', 'max:10', 'unique:localidades,codigo,' . $localidad->id, 'alpha'],
            'activo' => ['boolean'],
        ]);

        try {
            $localidad->update($data);

            return ApiResponse::success(
                $localidad->fresh(),
                'Localidad actualizada exitosamente'
            );
        } catch (\Exception $e) {
            return ApiResponse::error('Error al actualizar localidad: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Eliminar localidad
     */
    public function destroyApi(Localidad $localidad): JsonResponse
    {
        try {
            // Verificar si tiene clientes asociados
            if ($localidad->clientes()->exists()) {
                return ApiResponse::error('No se puede eliminar una localidad que tiene clientes asociados', 400);
            }

            $localidad->delete();

            return ApiResponse::success(null, 'Localidad eliminada exitosamente');
        } catch (\Exception $e) {
            return ApiResponse::error('Error al eliminar localidad: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Métodos web (vistas Inertia.js)
     */
    public function index(Request $request): \Inertia\Response
    {
        $q           = $request->string('q');
        $localidades = Localidad::query()
            ->when($q, function ($qq) use ($q) {
                $searchLower = strtolower($q);
                $qq->whereRaw('LOWER(nombre) like ?', ["%$searchLower%"]);
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return \Inertia\Inertia::render('localidades/index', [
            'localidades' => $localidades,
            'filters'     => ['q' => $q],
        ]);
    }

    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('localidades/form', [
            'localidad' => null,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:localidades,nombre'],
            'codigo' => ['required', 'string', 'max:10', 'unique:localidades,codigo', 'alpha'],
            'activo' => ['boolean'],
        ]);

        $data['activo'] = $data['activo'] ?? true;
        Localidad::create($data);

        return redirect()->route('localidades.index')->with('success', 'Localidad creada exitosamente');
    }

    public function show(Localidad $localidad): \Inertia\Response
    {
        return \Inertia\Inertia::render('localidades/show', [
            'localidad' => $localidad,
        ]);
    }

    public function edit(Localidad $localidad): \Inertia\Response
    {
        return \Inertia\Inertia::render('localidades/form', [
            'localidad' => $localidad,
        ]);
    }

    public function update(Request $request, Localidad $localidad): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['sometimes', 'required', 'string', 'max:255', 'unique:localidades,nombre,' . $localidad->id],
            'codigo' => ['sometimes', 'required', 'string', 'max:10', 'unique:localidades,codigo,' . $localidad->id, 'alpha'],
            'activo' => ['boolean'],
        ]);

        $localidad->update($data);

        return redirect()->route('localidades.index')->with('success', 'Localidad actualizada exitosamente');
    }

    public function destroy(Localidad $localidad): \Illuminate\Http\RedirectResponse
    {
        try {
            // Verificar si tiene clientes asociados
            if ($localidad->clientes()->exists()) {
                return redirect()->back()->with('error', 'No se puede eliminar una localidad que tiene clientes asociados');
            }

            $localidad->delete();

            return redirect()->route('localidades.index')->with('success', 'Localidad eliminada exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar localidad: ' . $e->getMessage());
        }
    }
}
