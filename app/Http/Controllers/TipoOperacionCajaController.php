<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\TipoOperacionCaja;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * TipoOperacionCajaController - CRUD de Tipos de Operación de Caja
 *
 * ✅ Usa SimpleCrudController trait
 */
class TipoOperacionCajaController extends Controller
{
    use SimpleCrudController;

    /**
     * Retorna el modelo a usar
     */
    protected function getModel(): string
    {
        return TipoOperacionCaja::class;
    }

    /**
     * Retorna el nombre de las rutas
     */
    protected function getRouteName(): string
    {
        return 'tipo-operacion-caja';
    }

    /**
     * Retorna el path de las vistas
     */
    protected function getViewPath(): string
    {
        return 'admin/tipo-operacion-caja';
    }

    /**
     * Retorna el nombre del recurso
     */
    protected function getResourceName(): string
    {
        return 'tipo-operacion-caja';
    }

    /**
     * Retorna las reglas de validación
     */
    protected function getValidationRules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:50'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'direccion' => ['nullable', 'string', 'max:50'],
            'activo' => ['boolean'],
        ];
    }

    /**
     * Sobrescribir para pasar datos en el formato esperado por el componente
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = trim((string) ($request->input('search') ?? $request->input('q') ?? ''));
        $direccion = trim((string) ($request->input('direccion') ?? ''));

        \Log::info('TipoOperacionCaja Index - Parametros recibidos', [
            'search' => $q,
            'direccion' => $direccion,
            'search_empty' => empty($q),
            'direccion_empty' => empty($direccion),
        ]);

        $query = $modelClass::query();

        if (!empty($q)) {
            \Log::info('Aplicando búsqueda', ['search' => $q]);
            // Usar scope searchByName
            \Log::info('Usando scope searchByName');
            $query = $query->searchByName($q);
        }

        if (!empty($direccion)) {
            \Log::info('Aplicando filtro dirección', ['direccion' => $direccion]);
            $query = $query->where('direccion', $direccion);
        }

        $paginated = $query->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        \Log::info('TipoOperacionCaja Index - Datos obtenidos', [
            'total' => $paginated->total(),
            'count' => $paginated->count(),
            'items_count' => count($paginated->items()),
            'first_item' => $paginated->items()[0] ?? null,
            'query_string' => $query->toSql(),
        ]);

        return inertia($this->getViewPath() . '/index', [
            $this->getResourceName() => $paginated->items(),
            'pagination' => [
                'total' => $paginated->total(),
                'count' => $paginated->count(),
                'per_page' => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'links' => $paginated->linkCollection()->toArray(),
            ],
            'filters' => ['q' => $q],
        ]);
    }
}
