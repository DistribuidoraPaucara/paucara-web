<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\Almacen;

/**
 * AlmacenController - CRUD de Almacenes
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * Reducción: ~80 líneas → 50 líneas (-37%)
 */
class AlmacenController extends Controller
{
    use SimpleCrudController;

    protected function getModel(): string
    {
        return Almacen::class;
    }

    protected function getRouteName(): string
    {
        return 'almacenes';
    }

    protected function getViewPath(): string
    {
        return 'almacenes';
    }

    protected function getResourceName(): string
    {
        return 'almacenes';
    }

    protected function getValidationRules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'responsable' => ['nullable', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'activo' => ['boolean'],
        ];
    }

    /**
     * Override para cargar conteo de sectores en el listado
     */
    public function index(\Illuminate\Http\Request $request): \Inertia\Response
    {
        $modelClass = $this->getModel();
        $q = $request->string('q');

        // Construir query con búsqueda opcional y cargar relaciones
        $items = $modelClass::query()
            ->withCount('sectores') // ✅ Cargar conteo de sectores
            ->when($q, function ($query) use ($q, $modelClass) {
                // Usar searchByName scope si el modelo lo tiene
                if (method_exists($modelClass, 'searchByName')) {
                    return $query->searchByName($q);
                }
                // Fallback: búsqueda manual
                return $query->whereRaw('LOWER(nombre) like ?', ['%' . strtolower($q) . '%']);
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return inertia($this->getViewPath() . '/index', [
            $this->getResourceName() => $items,
            'filters' => ['q' => $q],
        ]);
    }
}
