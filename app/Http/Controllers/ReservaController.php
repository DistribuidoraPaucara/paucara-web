<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use App\Models\ReservaProforma;
use App\Models\StockProducto;
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

    /**
     * Reservas de un producto: stock por almacén, reservas activas e historial (liberadas, consumidas).
     * GET /reservas/producto/{producto}
     */
    public function showPorProducto(Request $request, Producto $producto): Response
    {
        $stock = StockProducto::with('almacen:id,nombre')
            ->where('producto_id', $producto->id)
            ->get()
            ->map(fn ($s) => [
                'almacen'    => $s->almacen?->nombre,
                'cantidad'   => (float) $s->cantidad,
                'disponible' => (float) $s->cantidad_disponible,
                'reservada'  => (float) $s->cantidad_reservada,
            ])
            ->values()
            ->all();

        $busqueda = trim((string) $request->input('busqueda', ''));

        $base = ReservaProforma::with([
                'proforma.cliente:id,nombre',
                'proforma.venta:id,numero',
                'stockProducto.almacen:id,nombre',
            ])
            ->whereHas('stockProducto', fn ($q) => $q->where('producto_id', $producto->id))
            ->orderByDesc('fecha_reserva');

        $mapear = fn ($r) => [
            'id'                 => $r->id,
            'estado'             => $r->estado,
            'cantidad_reservada' => (float) $r->cantidad_reservada,
            'fecha_reserva'      => $r->fecha_reserva?->toIso8601String(),
            'fecha_expiracion'   => $r->fecha_expiracion?->toIso8601String(),
            'proforma_id'        => $r->proforma_id,
            'proforma_numero'    => $r->proforma?->numero,
            'cliente_nombre'     => $r->proforma?->cliente?->nombre,
            'venta_id'           => $r->proforma?->venta?->id,
            'venta_numero'       => $r->proforma?->venta?->numero,
            'almacen'            => $r->stockProducto?->almacen?->nombre,
        ];

        // Activas: todas (normalmente pocas)
        $activas = (clone $base)->where('estado', ReservaProforma::ACTIVA)->get()->map($mapear)->values()->all();

        // Historial: paginado y con búsqueda (proforma, cliente, venta o id de venta)
        $historialQuery = (clone $base)->where('estado', '!=', ReservaProforma::ACTIVA);

        if ($busqueda !== '') {
            $like = "%{$busqueda}%";
            $historialQuery->where(function ($q) use ($like, $busqueda) {
                $q->whereHas('proforma', fn ($p) => $p->where('numero', 'ilike', $like)
                        ->orWhereHas('cliente', fn ($c) => $c->where('nombre', 'ilike', $like)))
                    ->orWhereHas('proforma.venta', fn ($v) => $v->where('numero', 'ilike', $like));

                if (ctype_digit($busqueda)) {
                    $q->orWhereHas('proforma.venta', fn ($v) => $v->where('id', (int) $busqueda));
                }
            });
        }

        $historial = $historialQuery->paginate(10)->withQueryString()->through($mapear);

        return Inertia::render('reservas/producto', [
            'producto' => [
                'id'     => $producto->id,
                'nombre' => $producto->nombre,
                'sku'    => $producto->sku,
                'unidad' => $producto->unidad?->nombre,
            ],
            'stock'     => $stock,
            'activas'   => $activas,
            'historial' => $historial,
            'busqueda'  => $busqueda,
        ]);
    }
}
