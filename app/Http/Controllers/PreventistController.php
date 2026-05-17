<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador de Dashboard para Preventista
 * Muestra información de clientes, comisiones y proformas
 */
class PreventistController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        $datosPrventista = [
            'clientes_asignados' => 0,
            'ventas_mes' => 0,
            'comision_generada' => 0,
            'proformas_pendientes' => 0,
        ];

        return Inertia::render('preventista/dashboard', [
            'datosPrventista' => $datosPrventista,
            'periodo' => 'mes_actual',
            'titulo' => 'Dashboard Preventista',
            'descripcion' => 'Resumen de clientes, ventas y comisiones',
        ]);
    }
}
