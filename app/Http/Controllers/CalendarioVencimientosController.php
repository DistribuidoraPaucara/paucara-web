<?php

namespace App\Http\Controllers;

use App\Models\PrestamoCliente;
use App\Models\PrestamoEvento;
use App\Models\PrestamoProveedor;
use App\Models\CuentaPorCobrar;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * CalendarioVencimientosController
 *
 * Calendario unificado de vencimientos:
 * - Préstamos (cliente, evento, proveedor)
 * - Cuentas por cobrar
 */
class CalendarioVencimientosController extends Controller
{
    /**
     * GET /admin/calendario-vencimientos
     */
    public function dashboard(): InertiaResponse
    {
        return Inertia::render('admin/calendario-vencimientos', [
            'mesActual' => now()->format('Y-m'),
        ]);
    }

    /**
     * Obtener calendario unificado de vencimientos
     *
     * GET /api/calendario-vencimientos?mes=2026-08&tipo=prestamos,cuentas&estado=activo
     */
    public function obtenerVencimientos(Request $request): JsonResponse
    {
        try {
            $mes = $request->input('mes', now()->format('Y-m'));
            $tipo = $request->input('tipo', 'prestamos,cuentas');
            $estado = $request->input('estado', '');
            $busqueda = $request->input('busqueda', '');

            $tipos = array_filter(explode(',', $tipo));
            $estados = array_filter(explode(',', $estado));

            $fechaInicio = Carbon::createFromFormat('Y-m', $mes)->startOfMonth();
            $fechaFin = $fechaInicio->copy()->endOfMonth();

            $vencimientos = [];

            // Préstamos Cliente
            if (in_array('prestamos', $tipos)) {
                $prestamosCliente = PrestamoCliente::query()
                    ->with('cliente')
                    ->whereBetween('fecha_esperada_devolucion', [$fechaInicio, $fechaFin])
                    ->when($busqueda, fn($q) =>
                        $q->whereHas('cliente', fn($sq) =>
                            $sq->where('nombre', 'like', "%{$busqueda}%")
                        )
                    )
                    ->when($estados, fn($q) => $q->whereIn('estado', $estados))
                    ->get()
                    ->map(fn($p) => [
                        'id' => $p->id,
                        'tipo' => 'prestamo_cliente',
                        'categoria' => '📦 Préstamo Cliente',
                        'fecha' => $p->fecha_esperada_devolucion->format('Y-m-d'),
                        'nombre' => $p->cliente?->nombre ?? 'N/A',
                        'estado' => $p->estado,
                        'monto' => $p->monto_garantia,
                        'cantidad_items' => $p->detalles()->count(),
                        'referencia' => "Préstamo #{$p->id}",
                        'observaciones' => $p->observaciones,
                        'link' => route('prestamos.clientes.show', $p->id),
                    ]);
                $vencimientos = array_merge($vencimientos, $prestamosCliente->toArray());
            }

            // Préstamos Evento
            if (in_array('prestamos', $tipos)) {
                $prestamosEvento = PrestamoEvento::query()
                    ->with('cliente')
                    ->whereBetween(DB::raw("COALESCE(fecha_entrega, fecha_esperada_devolucion)"), [$fechaInicio, $fechaFin])
                    ->when($busqueda, fn($q) =>
                        $q->where('nombre_evento', 'like', "%{$busqueda}%")
                            ->orWhere('encargado_evento', 'like', "%{$busqueda}%")
                    )
                    ->when($estados, fn($q) => $q->whereIn('estado', $estados))
                    ->get()
                    ->map(fn($p) => [
                        'id' => $p->id,
                        'tipo' => 'prestamo_evento',
                        'categoria' => '🎉 Préstamo Evento',
                        'fecha' => ($p->fecha_entrega ?? $p->fecha_esperada_devolucion)->format('Y-m-d'),
                        'nombre' => $p->nombre_evento ?? 'Evento sin nombre',
                        'estado' => $p->estado,
                        'monto' => $p->monto_garantia,
                        'cantidad_items' => $p->cantidad,
                        'referencia' => "Evento #{$p->id}",
                        'observaciones' => $p->observaciones,
                        'link' => route('prestamos.eventos.show', $p->id),
                    ]);
                $vencimientos = array_merge($vencimientos, $prestamosEvento->toArray());
            }

            // Préstamos Proveedor
            if (in_array('prestamos', $tipos)) {
                $prestamosProveedor = PrestamoProveedor::query()
                    ->with('proveedor')
                    ->whereBetween('fecha_esperada_devolucion', [$fechaInicio, $fechaFin])
                    ->when($busqueda, fn($q) =>
                        $q->whereHas('proveedor', fn($sq) =>
                            $sq->where('nombre', 'like', "%{$busqueda}%")
                        )
                    )
                    ->when($estados, fn($q) => $q->whereIn('estado', $estados))
                    ->get()
                    ->map(fn($p) => [
                        'id' => $p->id,
                        'tipo' => 'prestamo_proveedor',
                        'categoria' => '🏭 Préstamo Proveedor',
                        'fecha' => $p->fecha_esperada_devolucion->format('Y-m-d'),
                        'nombre' => $p->proveedor?->nombre ?? 'N/A',
                        'estado' => $p->estado,
                        'monto' => $p->monto_garantia,
                        'cantidad_items' => $p->detalles()->count(),
                        'referencia' => "Préstamo #{$p->id}",
                        'observaciones' => $p->observaciones,
                        'link' => route('prestamos.proveedores.show', $p->id),
                    ]);
                $vencimientos = array_merge($vencimientos, $prestamosProveedor->toArray());
            }

            // Cuentas por Cobrar
            if (in_array('cuentas', $tipos)) {
                $cuentasPorCobrar = CuentaPorCobrar::query()
                    ->with('cliente', 'venta')
                    ->whereBetween('fecha_vencimiento', [$fechaInicio, $fechaFin])
                    ->when($busqueda, fn($q) =>
                        $q->whereHas('cliente', fn($sq) =>
                            $sq->where('nombre', 'like', "%{$busqueda}%")
                        )
                    )
                    ->when($estados, fn($q) => $q->whereIn('estado', $estados))
                    ->get()
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'tipo' => 'cuenta_por_cobrar',
                        'categoria' => '💰 Cuenta por Cobrar',
                        'fecha' => $c->fecha_vencimiento->format('Y-m-d'),
                        'nombre' => $c->cliente?->nombre ?? 'N/A',
                        'estado' => $c->estado,
                        'monto' => $c->saldo,
                        'cantidad_items' => $c->venta?->detalles()->count() ?? 0,
                        'referencia' => $c->referencia_documento ?? "CxC #{$c->id}",
                        'observaciones' => $c->descripcion,
                        'link' => route('ventas.show', $c->venta_id),
                    ]);
                $vencimientos = array_merge($vencimientos, $cuentasPorCobrar->toArray());
            }

            // Ordenar por fecha
            usort($vencimientos, fn($a, $b) => strcmp($a['fecha'], $b['fecha']));

            return response()->json([
                'success' => true,
                'data' => $vencimientos,
                'mes' => $mes,
                'total' => count($vencimientos),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
