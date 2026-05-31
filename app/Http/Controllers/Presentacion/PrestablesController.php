<?php

namespace App\Http\Controllers\Presentacion;

use App\Http\Controllers\Controller;
use App\Models\Prestable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrestablesController extends Controller
{
    public function index()
    {
        return Inertia::render('prestamos/prestables/index');
    }

    public function create()
    {
        return Inertia::render('prestamos/prestables/create');
    }

    public function edit(Prestable $prestable)
    {
        $prestable->load([
            'producto:id,nombre,sku',
            'precios',
            'condiciones',
            'prestablePadre:id,nombre,codigo',
            'productos:id,nombre,sku',
        ]);

        return Inertia::render('prestamos/prestables/edit', [
            'prestable' => $prestable,
        ]);
    }

    public function show(Prestable $prestable)
    {
        $prestable->load([
            'producto:id,nombre,sku',
            'precios',
            'condiciones',
            'prestablePadre:id,nombre,codigo',
            'productos:id,nombre,sku',
        ]);

        return Inertia::render('prestamos/prestables/show', [
            'prestable' => $prestable,
        ]);
    }
}
