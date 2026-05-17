<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador de Dashboard para Chofer
 * Muestra información de rutas y entregas del chofer
 */
class ChoferController extends Controller
{
    /**
     * Dashboard específico para Chofer
     */
    public function dashboard(Request $request)
    {
        $user = Auth::user();

        // Datos de prueba - en producción obtendrías datos reales
        $datosChofer = [
            'rutas_hoy' => 0,
            'entregas_completadas' => 0,
            'entregas_pendientes' => 0,
            'km_recorridos' => 0,
            'ultima_ruta' => null,
        ];

        return Inertia::render('chofer/dashboard', [
            'datosChofer' => $datosChofer,
            'periodo' => 'hoy',
            'titulo' => 'Dashboard Chofer',
            'descripcion' => 'Resumen de rutas y entregas asignadas',
        ]);
    }
}
