<?php

namespace App\Http\Controllers;

use App\Models\PrestamoCliente;
use App\Models\PrestamoEvento;
use App\Models\PrestamoProveedor;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PrestamosCalendarioController extends Controller
{
    /**
     * Mostrar página de calendario de préstamos
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('prestamos/calendario', [
            'mesActual' => now()->format('Y-m'),
        ]);
    }

    /**
     * Obtener préstamos del mes para el calendario
     *
     * GET /api/prestamos/calendario?mes=2026-08&tipo=cliente,evento,proveedor&estado=activo
     *
     * RESPUESTA:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 123,
     *       "tipo": "cliente",
     *       "fecha": "2026-08-25",
     *       "nombre": "Juan Pérez",
     *       "estado": "activo",
     *       "cantidad_items": 5,
     *       "monto_garantia": 500.00,
     *       "observaciones": "Entrega confirmada"
     *     }
     *   ]
     * }
     */
    public function obtenerPrestamosDelMes(Request $request): JsonResponse
    {
        try {
            $mes = $request->input('mes', now()->format('Y-m'));
            $tipo = $request->input('tipo', 'cliente,evento,proveedor');
            $estado = $request->input('estado', '');
            $busqueda = $request->input('busqueda', '');

            // Parsear parámetros
            $tipos = array_filter(explode(',', $tipo));
            $estados = array_filter(explode(',', $estado));

            // Convertir mes a rango de fechas
            $fechaInicio = Carbon::createFromFormat('Y-m', $mes)->startOfMonth();
            $fechaFin = $fechaInicio->copy()->endOfMonth();

            $prestamos = [];

            // Préstamos Cliente
            if (in_array('cliente', $tipos)) {
                $queryCliente = PrestamoCliente::query()
                    ->with('cliente')
                    ->whereBetween('fecha_esperada_devolucion', [$fechaInicio, $fechaFin]);

                if ($busqueda) {
                    $queryCliente->whereHas('cliente', fn($q) =>
                        $q->where('nombre', 'like', "%{$busqueda}%")
                            ->orWhere('nit', 'like', "%{$busqueda}%")
                    );
                }

                if ($estados) {
                    $queryCliente->whereIn('estado', $estados);
                }

                $prestamosCliente = $queryCliente->get()->map(fn($p) => [
                    'id' => $p->id,
                    'tipo' => 'cliente',
                    'tabla' => 'prestamo_cliente',
                    'fecha' => $p->fecha_esperada_devolucion->format('Y-m-d'),
                    'nombre' => $p->cliente?->nombre ?? 'N/A',
                    'estado' => $p->estado,
                    'cantidad_items' => $p->detalles()->count(),
                    'monto_garantia' => $p->monto_garantia,
                    'observaciones' => $p->observaciones,
                    'fecha_prestamo' => $p->fecha_prestamo->format('Y-m-d'),
                ]);

                $prestamos = array_merge($prestamos, $prestamosCliente->toArray());
            }

            // Préstamos Evento
            if (in_array('evento', $tipos)) {
                $queryEvento = PrestamoEvento::query()
                    ->with('cliente')
                    ->whereBetween(DB::raw("COALESCE(fecha_entrega, fecha_esperada_devolucion)"), [$fechaInicio, $fechaFin]);

                if ($busqueda) {
                    $queryEvento->where('nombre_evento', 'like', "%{$busqueda}%")
                        ->orWhere('encargado_evento', 'like', "%{$busqueda}%")
                        ->orWhereHas('cliente', fn($q) =>
                            $q->where('nombre', 'like', "%{$busqueda}%")
                        );
                }

                if ($estados) {
                    $queryEvento->whereIn('estado', $estados);
                }

                $prestamosEvento = $queryEvento->get()->map(fn($p) => [
                    'id' => $p->id,
                    'tipo' => 'evento',
                    'tabla' => 'prestamo_evento',
                    'fecha' => ($p->fecha_entrega ?? $p->fecha_esperada_devolucion)->format('Y-m-d'),
                    'nombre' => $p->nombre_evento ?? 'Evento sin nombre',
                    'encargado' => $p->encargado_evento,
                    'estado' => $p->estado,
                    'cantidad_items' => $p->cantidad,
                    'monto_garantia' => $p->monto_garantia,
                    'observaciones' => $p->observaciones ?? '',
                    'fecha_prestamo' => $p->fecha_prestamo->format('Y-m-d'),
                ]);

                $prestamos = array_merge($prestamos, $prestamosEvento->toArray());
            }

            // Préstamos Proveedor
            if (in_array('proveedor', $tipos)) {
                $queryProveedor = PrestamoProveedor::query()
                    ->with('proveedor')
                    ->whereBetween('fecha_esperada_devolucion', [$fechaInicio, $fechaFin]);

                if ($busqueda) {
                    $queryProveedor->whereHas('proveedor', fn($q) =>
                        $q->where('nombre', 'like', "%{$busqueda}%")
                            ->orWhere('nit', 'like', "%{$busqueda}%")
                    );
                }

                if ($estados) {
                    $queryProveedor->whereIn('estado', $estados);
                }

                $prestamosProveedor = $queryProveedor->get()->map(fn($p) => [
                    'id' => $p->id,
                    'tipo' => 'proveedor',
                    'tabla' => 'prestamo_proveedor',
                    'fecha' => $p->fecha_esperada_devolucion->format('Y-m-d'),
                    'nombre' => $p->proveedor?->nombre ?? 'N/A',
                    'estado' => $p->estado,
                    'cantidad_items' => $p->detalles()->count(),
                    'monto_garantia' => $p->monto_garantia,
                    'observaciones' => $p->observaciones,
                    'fecha_prestamo' => $p->fecha_prestamo->format('Y-m-d'),
                ]);

                $prestamos = array_merge($prestamos, $prestamosProveedor->toArray());
            }

            // Ordenar por fecha
            usort($prestamos, fn($a, $b) => strcmp($a['fecha'], $b['fecha']));

            return response()->json([
                'success' => true,
                'data' => $prestamos,
                'mes' => $mes,
                'total' => count($prestamos),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener préstamos: ' . $e->getMessage(),
            ], 500);
        }
    }
}
