<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class EgresosAnalisisController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:cajas.index');
    }

    /**
     * GET /cajas/egresos
     * Mostrar página de análisis de egresos (React component)
     */
    public function index()
    {
        return Inertia::render('Egresos/Index');
    }
}
