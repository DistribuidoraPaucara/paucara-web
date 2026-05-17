<?php

namespace App\Http\Controllers;

class DetalleVentaController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:ventas.detalles.index')->only('index', 'show');
        $this->middleware('permission:ventas.detalles.store')->only('store');
        $this->middleware('permission:ventas.detalles.update')->only('update');
        $this->middleware('permission:ventas.detalles.destroy')->only('destroy');
    }
}
