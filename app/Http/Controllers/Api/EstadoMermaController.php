<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstadoMerma;
use Illuminate\Http\Request;

class EstadoMermaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => \App\Models\EstadoMerma::where('activo', true)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clave'      => 'required|string|unique:estado_mermas,clave',
            'label'      => 'required|string',
            'color'      => 'nullable|string',
            'bg_color'   => 'nullable|string',
            'text_color' => 'nullable|string',
            'actions'    => 'nullable|array',
            'activo'     => 'boolean',
        ]);
        if (isset($validated['actions'])) {
            $validated['actions'] = json_encode($validated['actions']);
        }
        $estadoMerma = \App\Models\EstadoMerma::create($validated);
        return response()->json(['data' => $estadoMerma], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EstadoMerma $estadoMerma)
    {
        return response()->json(['data' => $estadoMerma]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EstadoMerma $estadoMerma)
    {
        $validated = $request->validate([
            'clave'      => 'sometimes|required|string|unique:estado_mermas,clave,' . $estadoMerma->id,
            'label'      => 'sometimes|required|string',
            'color'      => 'nullable|string',
            'bg_color'   => 'nullable|string',
            'text_color' => 'nullable|string',
            'actions'    => 'nullable|array',
            'activo'     => 'boolean',
        ]);
        if (isset($validated['actions'])) {
            $validated['actions'] = json_encode($validated['actions']);
        }
        $estadoMerma->update($validated);
        return response()->json(['data' => $estadoMerma]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EstadoMerma $estadoMerma)
    {
        $estadoMerma->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
