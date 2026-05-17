<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ReservaController extends Controller
{
    /**
     * Mostrar página de gestión de reservas de proformas
     * GET /reservas
     */
    public function index(): Response
    {
        return Inertia::render('reservas/index', [
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'href' => route('dashboard')],
                ['label' => 'Reservas', 'href' => route('reservas.index')],
            ],
        ]);
    }
}
