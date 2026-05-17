<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserChoferPreferencia;
use Illuminate\Http\Request;

class ChoferPreferenciaController extends Controller
{
    /**
     * Display a listing of chofer preferences for the current user.
     */
    public function index()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['preferencias' => []], 401);
        }

        $preferencias = UserChoferPreferencia::where('user_id', $user->id)
            ->orderBy('frecuencia', 'desc')
            ->orderBy('fecha_uso', 'desc')
            ->get(['chofer_id', 'fecha_uso', 'frecuencia']);

        return response()->json(['preferencias' => $preferencias]);
    }

    /**
     * Store/update a chofer preference (record usage).
     */
    public function store(Request $request)
    {
        $request->validate([
            'chofer_id' => 'required|integer|exists:empleados,id',
        ]);

        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Find or create the preference record
        $preferencia = UserChoferPreferencia::firstOrCreate(
            ['user_id' => $user->id, 'chofer_id' => $request->chofer_id],
            ['frecuencia' => 0]
        );

        // Increment frequency and update last used date
        $preferencia->increment('frecuencia');
        $preferencia->update(['fecha_uso' => now()]);

        return response()->json(['message' => 'Preferencia guardada'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
