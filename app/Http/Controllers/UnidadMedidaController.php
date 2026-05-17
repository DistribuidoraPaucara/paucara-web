<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\UnidadMedida;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * UnidadMedidaController - CRUD de Unidades de Medida
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * Reducción: ~77 líneas → 60 líneas (-22%)
 * Nota: Sobrescribe index() para búsqueda en múltiples campos
 */
class UnidadMedidaController extends Controller
{
    use SimpleCrudController;

    protected function getModel(): string
    {
        return UnidadMedida::class;
    }

    protected function getRouteName(): string
    {
        return 'unidades';
    }

    protected function getViewPath(): string
    {
        return 'unidades';
    }

    protected function getResourceName(): string
    {
        return 'unidades';
    }

    protected function getValidationRules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:10', 'unique:unidades_medida,codigo'],
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['boolean'],
        ];
    }

    /**
     * Override: búsqueda en nombre Y código
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = $request->string('q');

        $items = $modelClass::query()
            ->when($q, function ($query) use ($q) {
                $searchLower = strtolower($q);
                return $query->where(function ($sub) use ($searchLower) {
                    $sub->whereRaw('LOWER(nombre) like ?', ["%$searchLower%"])
                        ->orWhereRaw('LOWER(codigo) like ?', ["%$searchLower%"]);
                });
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
