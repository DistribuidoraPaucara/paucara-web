<?php

namespace App\Http\Controllers;

use App\Models\Moneda;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MonedaController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q');
        $query = Moneda::query();

        // Filtro de búsqueda usando 'q' como parámetro estándar
        if ($q) {
            $query->where(function ($subQuery) use ($q) {
                $subQuery->where('nombre', 'ilike', "%{$q}%")
                    ->orWhere('codigo', 'ilike', "%{$q}%")
                    ->orWhere('simbolo', 'ilike', "%{$q}%");
            });
        }

        // Otros filtros opcionales (mantienen compatibilidad)
        if ($request->has('activo')) {
            $query->where('activo', $request->boolean('activo'));
        }

        if ($request->has('es_moneda_base')) {
            $query->where('es_moneda_base', $request->boolean('es_moneda_base'));
        }

        // Ordenamiento por defecto
        $query->orderBy('id', 'desc');

        $monedas = $query->paginate(10)->withQueryString();

        return Inertia::render('monedas/index', [
            'monedas' => $monedas,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('monedas/create', [
            'moneda' => new Moneda,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:monedas,nombre',
            'codigo' => 'required|string|size:3|unique:monedas,codigo',
            'simbolo' => 'required|string|max:5',
            'tasa_cambio' => 'required|numeric|min:0.000001',
            'es_moneda_base' => 'boolean',
            'activo' => 'boolean',
        ]);

        // Convertir código a mayúsculas
        $validated['codigo'] = strtoupper($validated['codigo']);

        $moneda = Moneda::create($validated);

        return redirect()->route('monedas.index')
            ->with('success', 'Moneda creada exitosamente.');
    }

    public function show(Moneda $moneda)
    {
        return Inertia::render('monedas/show', [
            'moneda' => $moneda,
        ]);
    }

    public function edit(Moneda $moneda)
    {
        return Inertia::render('monedas/edit', [
            'moneda' => $moneda,
        ]);
    }

    public function update(Request $request, Moneda $moneda)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:50', Rule::unique('monedas')->ignore($moneda->id)],
            'codigo' => ['required', 'string', 'size:3', Rule::unique('monedas')->ignore($moneda->id)],
            'simbolo' => 'required|string|max:5',
            'tasa_cambio' => 'required|numeric|min:0.000001',
            'es_moneda_base' => 'boolean',
            'activo' => 'boolean',
        ]);

        // Convertir código a mayúsculas
        $validated['codigo'] = strtoupper($validated['codigo']);

        $moneda->update($validated);

        return redirect()->route('monedas.index')
            ->with('success', 'Moneda actualizada exitosamente.');
    }

    public function destroy(Moneda $moneda)
    {
        // Verificar si la moneda está siendo usada
        if ($moneda->preciosProductos()->count() > 0) {
            return back()->withErrors(['error' => 'No se puede eliminar la moneda porque está siendo utilizada en precios de productos.']);
        }

        // No permitir eliminar la moneda base si es la única
        if ($moneda->es_moneda_base && Moneda::count() == 1) {
            return back()->withErrors(['error' => 'No se puede eliminar la única moneda del sistema.']);
        }

        $moneda->delete();

        return redirect()->route('monedas.index')
            ->with('success', 'Moneda eliminada exitosamente.');
    }

    // Métodos API adicionales
    public function activas()
    {
        $monedas = Moneda::activas()->orderBy('nombre')->get();

        return response()->json($monedas);
    }

    public function convertir(Request $request)
    {
        $validated = $request->validate([
            'monto' => 'required|numeric|min:0',
            'moneda_origen_id' => 'required|exists:monedas,id',
            'moneda_destino_id' => 'required|exists:monedas,id',
        ]);

        $monedaOrigen = Moneda::find($validated['moneda_origen_id']);
        $monedaDestino = Moneda::find($validated['moneda_destino_id']);

        try {
            $montoConvertido = Moneda::convertir(
                $validated['monto'],
                $monedaOrigen,
                $monedaDestino
            );

            return response()->json([
                'monto_original' => $validated['monto'],
                'monto_convertido' => $montoConvertido,
                'moneda_origen' => [
                    'nombre' => $monedaOrigen->nombre,
                    'codigo' => $monedaOrigen->codigo,
                    'simbolo' => $monedaOrigen->simbolo,
                ],
                'moneda_destino' => [
                    'nombre' => $monedaDestino->nombre,
                    'codigo' => $monedaDestino->codigo,
                    'simbolo' => $monedaDestino->simbolo,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function toggleActivo(Moneda $moneda)
    {
        $moneda->update(['activo' => ! $moneda->activo]);

        $status = $moneda->activo ? 'activada' : 'desactivada';

        return redirect()->back()
            ->with('success', "Moneda {$status} exitosamente.");
    }

    public function establecerBase(Moneda $moneda)
    {
        if (! $moneda->activo) {
            return back()->withErrors(['error' => 'No se puede establecer como base una moneda inactiva.']);
        }

        $moneda->update(['es_moneda_base' => true]);

        return redirect()->back()
            ->with('success', 'Moneda establecida como base exitosamente.');
    }
}
