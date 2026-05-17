<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoAjusteInventario;
use Illuminate\Http\Request;

class TipoAjusteInventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => TipoAjusteInventario::where('activo', true)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clave'           => 'required|string|unique:tipos_ajuste_inventario,clave',
            'label'           => 'required|string',
            'tipo_operacion'  => 'required|in:entrada,salida,ambos',
            'descripcion'     => 'nullable|string',
            'color'           => 'nullable|string',
            'bg_color'        => 'nullable|string',
            'text_color'      => 'nullable|string',
            'activo'          => 'boolean',
        ]);
        $tipoAjuste = TipoAjusteInventario::create($validated);
        return response()->json(['data' => $tipoAjuste], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoAjusteInventario $tipoAjusteInventario)
    {
        return response()->json(['data' => $tipoAjusteInventario]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipoAjusteInventario $tipoAjusteInventario)
    {
        $validated = $request->validate([
            'clave'           => 'sometimes|required|string|unique:tipos_ajuste_inventario,clave,' . $tipoAjusteInventario->id,
            'label'           => 'sometimes|required|string',
            'tipo_operacion'  => 'sometimes|required|in:entrada,salida,ambos',
            'descripcion'     => 'nullable|string',
            'color'           => 'nullable|string',
            'bg_color'        => 'nullable|string',
            'text_color'      => 'nullable|string',
            'activo'          => 'boolean',
        ]);
        $tipoAjusteInventario->update($validated);
        return response()->json(['data' => $tipoAjusteInventario]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoAjusteInventario $tipoAjusteInventario)
    {
        $tipoAjusteInventario->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
