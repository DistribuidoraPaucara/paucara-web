<?php

namespace App\Http\Controllers\Prestamos;

use App\Http\Controllers\Controller;
use App\Models\AlmacenPrestable;
use App\Models\PrestamoCliente;
use App\Models\PrestamoProveedor;
use App\Models\PrestableStock;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * GET /prestamos/dashboard
     * Dashboard principal de préstamos
     */
    public function dashboard()
    {
        $almacenCanastillasEmbases = 3; // Almacén fijo para prestables

        // Contar préstamos activos
        $prestamosClientesActivos = PrestamoCliente::where('estado', 'ACTIVO')->count();
        $prestamosProveedoresActivos = PrestamoProveedor::where('estado', 'ACTIVO')->count();

        // Calcular totales
        $totalPrestadoClientes = PrestamoCliente::where('estado', '!=', 'COMPLETAMENTE_DEVUELTO')
            ->whereHas('detalles')
            ->with('detalles')
            ->get()
            ->sum(function ($prestamo) {
                return $prestamo->detalles->sum('cantidad_prestada');
            });

        $totalDeudaProveedores = PrestamoProveedor::where('estado', '!=', 'COMPLETAMENTE_DEVUELTO')
            ->where('es_compra', true)
            ->whereHas('detalles')
            ->with('detalles')
            ->get()
            ->sum(function ($prestamo) {
                return $prestamo->detalles->sum('cantidad_prestada');
            });

        // Contar devoluciones vencidas y próximas a vencer
        $hoy = now();
        $diasAlerta = 7;

        $devolucionesVencidas = PrestamoCliente::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->where('fecha_esperada_devolucion', '<', $hoy)
            ->count();

        $devolucionesProximas = PrestamoCliente::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->where('fecha_esperada_devolucion', '>=', $hoy)
            ->where('fecha_esperada_devolucion', '<', $hoy->copy()->addDays($diasAlerta))
            ->count();

        // Obtener distribución de stock
        $stocks = PrestableStock::where('almacenes_prestables_id', $almacenCanastillasEmbases)->get();

        $distribucion = [
            'disponible' => $stocks->sum('cantidad_disponible'),
            'en_prestamo' => $stocks->sum('cantidad_en_prestamo_cliente') + $stocks->sum('cantidad_que_debo_devolver'),
            'vendido' => $stocks->sum('cantidad_vendida'),
            'deuda_proveedores' => $stocks->sum('cantidad_que_debo_devolver'),
        ];

        // Obtener préstamos vencidos
        $prestamosVencidos = PrestamoCliente::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->where('fecha_esperada_devolucion', '<', $hoy)
            ->with(['cliente', 'detalles.prestable'])
            ->orderBy('fecha_esperada_devolucion', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($prestamo) use ($hoy) {
                $diasVencidos = $hoy->diffInDays($prestamo->fecha_esperada_devolucion);
                return [
                    'id' => $prestamo->id,
                    'cliente_nombre' => $prestamo->cliente->nombre,
                    'proveedor_nombre' => null,
                    'monto_garantia' => $prestamo->monto_garantia,
                    'fecha_esperada_devolucion' => $prestamo->fecha_esperada_devolucion->format('Y-m-d'),
                    'estado' => $prestamo->estado,
                    'dias_vencidos' => $diasVencidos,
                    'tipo' => 'cliente',
                ];
            });

        // Obtener préstamos próximos a vencer
        $prestamosProximos = PrestamoCliente::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->where('fecha_esperada_devolucion', '>=', $hoy)
            ->where('fecha_esperada_devolucion', '<', $hoy->copy()->addDays($diasAlerta + 7))
            ->with(['cliente', 'detalles.prestable'])
            ->orderBy('fecha_esperada_devolucion', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($prestamo) use ($hoy) {
                $diasRestantes = $hoy->diffInDays($prestamo->fecha_esperada_devolucion);
                return [
                    'id' => $prestamo->id,
                    'cliente_nombre' => $prestamo->cliente->nombre,
                    'proveedor_nombre' => null,
                    'monto_garantia' => $prestamo->monto_garantia,
                    'fecha_esperada_devolucion' => $prestamo->fecha_esperada_devolucion->format('Y-m-d'),
                    'estado' => $prestamo->estado,
                    'dias_vencidos' => -$diasRestantes, // negativo para próximos
                    'tipo' => 'cliente',
                ];
            });

        return Inertia::render('prestamos/dashboard', [
            'resumen' => [
                'prestamos_clientes_activos' => $prestamosClientesActivos,
                'prestamos_proveedores_activos' => $prestamosProveedoresActivos,
                'total_prestado_clientes' => $totalPrestadoClientes,
                'total_deuda_proveedores' => $totalDeudaProveedores,
                'devoluciones_vencidas' => $devolucionesVencidas,
                'devoluciones_proximas_vencer' => $devolucionesProximas,
            ],
            'distribucion' => $distribucion,
            'prestamos_vencidos' => $prestamosVencidos,
            'prestamos_proximos_vencer' => $prestamosProximos,
        ]);
    }
}
