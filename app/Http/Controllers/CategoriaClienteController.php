<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\CategoriaCliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoriaClienteController extends Controller
{
    /**
     * Mostrar página de gestión de categorías (Web)
     */
    public function index(): Response
    {
        $categorias = CategoriaCliente::withCount('clientes')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/categorias-cliente', [
            'categorias' => $categorias,
        ]);
    }

    /**
     * Lista categorías de cliente (API)
     */
    public function indexApi(Request $request): JsonResponse
    {
        $q = (string) $request->string('q');
        $soloActivas = $request->boolean('solo_activas', false);
        $perPage = $request->integer('per_page', 15);

        $query = CategoriaCliente::query()
            ->when($q, function ($qbuilder) use ($q) {
                $searchLower = strtolower($q);
                $qbuilder->where(function ($sub) use ($searchLower) {
                    $sub->whereRaw('LOWER(clave) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(nombre) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(descripcion) like ?', ["%$searchLower%"]);
                });
            })
            ->when($soloActivas, fn ($qbuilder) => $qbuilder->where('activo', true))
            ->orderBy('nombre');

        if ($request->boolean('all')) {
            return ApiResponse::success($query->get());
        }

        return ApiResponse::success($query->paginate($perPage)->withQueryString());
    }

    /**
     * Crear categoría (API)
     */
    public function storeApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'clave' => ['required', 'string', 'max:50', 'alpha_dash', 'unique:categorias_cliente,clave'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $data['activo'] = $data['activo'] ?? true;

        $categoria = CategoriaCliente::create($data);

        return ApiResponse::success($categoria, 'Categoría creada exitosamente', 201);
    }

    /**
     * Mostrar categoría (API)
     */
    public function showApi(CategoriaCliente $categoria): JsonResponse
    {
        // Incluir conteo de clientes asociados como información útil
        $categoria->loadCount('clientes');

        return ApiResponse::success($categoria);
    }

    /**
     * Actualizar categoría (API)
     */
    public function updateApi(Request $request, CategoriaCliente $categoria): JsonResponse
    {
        $data = $request->validate([
            'clave' => ['sometimes', 'required', 'string', 'max:50', 'alpha_dash', Rule::unique('categorias_cliente', 'clave')->ignore($categoria->id)],
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $categoria->update($data);

        return ApiResponse::success($categoria->fresh(), 'Categoría actualizada exitosamente');
    }

    /**
     * Eliminar categoría (API)
     */
    public function destroyApi(CategoriaCliente $categoria): JsonResponse
    {
        // Evitar eliminar si tiene clientes asociados: en ese caso, solo desactivar
        if ($categoria->clientes()->exists()) {
            $categoria->update(['activo' => false]);

            return ApiResponse::success(null, 'Categoría desactivada (tiene clientes asociados)');
        }

        $categoria->delete();

        return ApiResponse::success(null, 'Categoría eliminada exitosamente');
    }
}
