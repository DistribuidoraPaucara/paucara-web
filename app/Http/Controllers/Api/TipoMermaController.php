<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoMerma;
use Illuminate\Http\Request;

class TipoMermaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => \App\Models\TipoMerma::where('activo', true)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clave'               => 'required|string|unique:tipo_mermas,clave',
            'label'               => 'required|string',
            'descripcion'         => 'nullable|string',
            'color'               => 'nullable|string',
            'bg_color'            => 'nullable|string',
            'text_color'          => 'nullable|string',
            'requiere_aprobacion' => 'boolean',
            'activo'              => 'boolean',
        ]);
        $tipoMerma = \App\Models\TipoMerma::create($validated);
        return response()->json(['data' => $tipoMerma], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoMerma $tipoMerma)
    {
        return response()->json(['data' => $tipoMerma]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipoMerma $tipoMerma)
    {
        $validated = $request->validate([
            'clave'               => 'sometimes|required|string|unique:tipo_mermas,clave,' . $tipoMerma->id,
            'label'               => 'sometimes|required|string',
            'descripcion'         => 'nullable|string',
            'color'               => 'nullable|string',
            'bg_color'            => 'nullable|string',
            'text_color'          => 'nullable|string',
            'requiere_aprobacion' => 'boolean',
            'activo'              => 'boolean',
        ]);
        $tipoMerma->update($validated);
        return response()->json(['data' => $tipoMerma]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoMerma $tipoMerma)
    {
        $tipoMerma->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
