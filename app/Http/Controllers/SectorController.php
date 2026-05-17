<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use App\Models\Almacen;
use App\Http\Traits\SimpleCrudController;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Response;

class SectorController extends Controller
{
    use SimpleCrudController;

    protected function getModel(): string
    {
        return Sector::class;
    }

    protected function getRouteName(): string
    {
        return 'sectores';
    }

    protected function getViewPath(): string
    {
        return 'sectores';
    }

    protected function getResourceName(): string
    {
        return 'sectores';
    }

    protected function getValidationRules(): array
    {
        return [
            'almacen_id' => ['required', 'integer', 'exists:almacenes,id'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'stock_minimo' => ['sometimes', 'integer', 'min:0'],
            'stock_maximo' => ['sometimes', 'integer', 'min:0', 'gte:stock_minimo'],
        ];
    }

    /**
     * Override para cargar relaciones en el índice
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = $request->string('q');

        // Construir query con búsqueda opcional y cargar relaciones
        $items = $modelClass::query()
            ->with('almacen') // ✅ Cargar la relación almacén
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

    /**
     * Override para obtener datos al editar
     */
    protected function getShowData($resource)
    {
        return $resource->load('almacen', 'stockProductos');
    }

    /**
     * Override para crear - incluir almacenes en extraData
     */
    public function create(): Response
    {
        $almacenes = Almacen::where('activo', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($almacen) => [
                'id' => $almacen->id,
                'value' => $almacen->id,
                'label' => $almacen->nombre,
                'nombre' => $almacen->nombre,
            ]);

        return inertia($this->getViewPath() . '/form', [
            $this->getSingularResourceName() => null,
            'almacenes' => $almacenes,
        ]);
    }

    /**
     * Override para editar - incluir almacenes en extraData
     */
    public function edit($id): Response
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);

        $almacenes = Almacen::where('activo', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn($almacen) => [
                'id' => $almacen->id,
                'value' => $almacen->id,
                'label' => $almacen->nombre,
                'nombre' => $almacen->nombre,
            ]);

        return inertia($this->getViewPath() . '/form', [
            $this->getSingularResourceName() => $item,
            'almacenes' => $almacenes,
        ]);
    }
}
