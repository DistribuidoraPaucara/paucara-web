<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\TipoPago;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * TipoPagoController - CRUD de Tipos de Pago
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * Reducción: ~80 líneas → 60 líneas (-25%)
 * Nota: Sobrescribe index() para búsqueda en múltiples campos
 */
class TipoPagoController extends Controller
{
    use SimpleCrudController;

    protected function getModel(): string
    {
        return TipoPago::class;
    }

    protected function getRouteName(): string
    {
        return 'tipos-pago';
    }

    protected function getViewPath(): string
    {
        return 'tipos-pago';
    }

    protected function getResourceName(): string
    {
        return 'tipos_pago';
    }

    protected function getValidationRules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:255'],
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['sometimes', 'boolean'],
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
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return inertia($this->getViewPath() . '/index', [
            $this->getResourceName() => $items,
            'filters' => ['q' => $q],
        ]);
    }

    /**
     * Override: mostrar formulario de edición con prop name camelCase
     */
    public function edit($id): Response
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);

        return inertia($this->getViewPath() . '/form', [
            'tipoPago' => $item,
        ]);
    }

    /**
     * Override: actualizar con validación correcta del código único
     */
    public function update(Request $request, $id)
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);

        // Validar datos con unique constraint excluyendo el ID actual
        $data = $request->validate([
            'codigo' => ['required', 'string', 'max:255', 'unique:tipos_pago,codigo,' . $id . ',id'],
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['sometimes', 'boolean'],
        ]);

        $item->update($data);

        return $this->redirectToIndexWithSuccess('actualizada');
    }
}
