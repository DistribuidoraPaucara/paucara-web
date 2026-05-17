<?php

namespace App\Http\Controllers;

use App\Models\TipoAjusteInventario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TipoAjusteInventarioController extends Controller
{
    public function index(Request $request): Response
    {
        $q = $request->string('q');
        $items = TipoAjusteInventario::query()
            ->when($q, function ($qq) use ($q) {
                $searchLower = strtolower($q);
                $qq->whereRaw('LOWER(clave) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(label) like ?', ["%$searchLower%"])
                    ->orWhereRaw('LOWER(descripcion) like ?', ["%$searchLower%"]);
            })
            ->orderBy('clave', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('inventario/tipos-ajuste-inventario/index', [
            'tiposAjusteInventario' => $items,
            'filters' => ['q' => $q],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventario/tipos-ajuste-inventario/form', [
            'tipoAjusteInventario' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'clave' => ['required', 'string', 'max:50', 'unique:tipos_ajuste_inventario,clave'],
            'label' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'activo' => ['boolean'],
        ]);
        $data['activo'] = $data['activo'] ?? true;
        TipoAjusteInventario::create($data);

        return redirect()->route('tipos-ajuste-inventario.index')->with('success', 'Tipo de ajuste creado');
    }

    public function edit(TipoAjusteInventario $tipoAjusteInventario): Response
    {
        return Inertia::render('inventario/tipos-ajuste-inventario/form', [
            'tipoAjusteInventario' => $tipoAjusteInventario,
        ]);
    }

    public function update(Request $request, TipoAjusteInventario $tipoAjusteInventario): RedirectResponse
    {
        $data = $request->validate([
            'clave' => ['required', 'string', 'max:50', 'unique:tipos_ajuste_inventario,clave,'.$tipoAjusteInventario->id],
            'label' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'activo' => ['boolean'],
        ]);
        $tipoAjusteInventario->update($data);

        return redirect()->route('tipos-ajuste-inventario.index')->with('success', 'Tipo de ajuste actualizado');
    }

    public function destroy(TipoAjusteInventario $tipoAjusteInventario): RedirectResponse
    {
        $tipoAjusteInventario->delete();

        return redirect()->route('tipos-ajuste-inventario.index')->with('success', 'Tipo de ajuste eliminado');
    }
}
