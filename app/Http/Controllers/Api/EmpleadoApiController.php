<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmpleadoApiController extends Controller
{
    /**
     * Determina el rol funcional basado en un cargo
     * NOTA: Ya no se usa TipoEmpleado, solo roles de Spatie
     */
    public function determinarRol(Request $request)
    {
        $request->validate([
            'cargo' => 'required|string|max:100',
        ]);

        $cargo = $request->input('cargo');

        // Mapeo simple de cargo a rol
        $mapeoCargosRoles = [
            'Chofer'                 => 'Chofer',
            'Conductor'              => 'Chofer',
            'Cajero'                 => 'Cajero',
            'Vendedor'               => 'Vendedor',
            'Comprador'              => 'Comprador',
            'Gestor de Almacén'      => 'Gestor de Almacén',
            'Supervisor'             => 'Supervisor',
            'Gerente'                => 'Gerente',
            'Logístico'              => 'Logística',
        ];

        $rol = $mapeoCargosRoles[$cargo] ?? null;

        return response()->json([
            'cargo' => $cargo,
            'rol'   => $rol,
        ]);
    }
}
