<?php

namespace App\Http\Controllers;

use App\Models\Egreso;
use App\Models\TipoOperacionCaja;
use App\Models\TipoPago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EgresosController extends Controller
{
    /**
     * Mostrar listado de egresos
     */
    public function index()
    {
        $egresos = Egreso::with(['tipoOperacion', 'estadoDocumento', 'usuario'])
            ->orderBy('fecha', 'desc')
            ->paginate(15);

        return Inertia::render('Egresos/Index', [
            'egresos' => $egresos,
        ]);
    }

    /**
     * Mostrar formulario para crear egreso
     */
    public function create()
    {
        $tipos_operacion = TipoOperacionCaja::where('activo', true)->get();
        $tipos_pago = TipoPago::where('activo', true)->get();

        return Inertia::render('Egresos/Create', [
            'tipos_operacion' => $tipos_operacion,
            'tipos_pago' => $tipos_pago,
        ]);
    }

    /**
     * Mostrar detalle de un egreso
     */
    public function show(Egreso $egreso)
    {
        $egreso->load([
            'tipoOperacion',
            'estadoDocumento',
            'usuario',
            'detalles',
            'detallesPago.tipoPago'
        ]);

        return Inertia::render('Egresos/Show', [
            'egreso' => $egreso,
        ]);
    }
}
