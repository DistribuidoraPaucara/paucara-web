<?php

namespace App\Http\Controllers\Prestamos;

use App\Http\Controllers\Controller;
use App\Models\PrestamoCliente;
use App\Models\PrestamoProveedor;
use Inertia\Inertia;

class AlertasController extends Controller
{
    /**
     * GET /prestamos/alertas
     * Página de alertas de préstamos
     */
    public function alertas()
    {
        $hoy = now();

        // Obtener préstamos de clientes vencidos/próximos a vencer
        $prestamosClientes = PrestamoCliente::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->whereNotNull('fecha_esperada_devolucion')
            ->with(['cliente', 'detalles.prestable', 'chofer'])
            ->orderByDesc('fecha_esperada_devolucion')
            ->get()
            ->map(function ($prestamo) use ($hoy) {
                $diasDiferencia = $hoy->diffInDays($prestamo->fecha_esperada_devolucion);

                // Calcular urgencia
                $urgencia = 'normal';
                if ($diasDiferencia < 0) {
                    $diasVencidos = abs($diasDiferencia);
                    if ($diasVencidos > 30) {
                        $urgencia = 'critico';
                    } elseif ($diasVencidos >= 14) {
                        $urgencia = 'urgente';
                    } else {
                        $urgencia = 'vencido';
                    }
                } elseif ($diasDiferencia <= 7) {
                    $urgencia = 'vencido'; // Próximo a vencer en menos de 7 días
                }

                $cantidadPendiente = $prestamo->detalles->sum('cantidad_prestada');

                return [
                    'id' => $prestamo->id,
                    'tipo' => 'cliente',
                    'nombre' => $prestamo->cliente->nombre,
                    'razon_social' => $prestamo->cliente->razon_social,
                    'prestable_nombre' => $prestamo->detalles->first()?->prestable->nombre,
                    'cantidad_pendiente' => $cantidadPendiente,
                    'fecha_esperada_devolucion' => $prestamo->fecha_esperada_devolucion?->format('Y-m-d'),
                    'dias_vencidos' => abs($diasDiferencia),
                    'estado' => $prestamo->estado,
                    'chofer' => $prestamo->chofer?->name,
                    'urgencia' => $urgencia,
                ];
            });

        // Obtener préstamos de proveedores vencidos/próximos a vencer
        $prestamosProveedores = PrestamoProveedor::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->whereNotNull('fecha_esperada_devolucion')
            ->with(['proveedor', 'detalles.prestable'])
            ->orderByDesc('fecha_esperada_devolucion')
            ->get()
            ->map(function ($prestamo) use ($hoy) {
                $diasDiferencia = $hoy->diffInDays($prestamo->fecha_esperada_devolucion);

                // Calcular urgencia
                $urgencia = 'normal';
                if ($diasDiferencia < 0) {
                    $diasVencidos = abs($diasDiferencia);
                    if ($diasVencidos > 30) {
                        $urgencia = 'critico';
                    } elseif ($diasVencidos >= 14) {
                        $urgencia = 'urgente';
                    } else {
                        $urgencia = 'vencido';
                    }
                } elseif ($diasDiferencia <= 7) {
                    $urgencia = 'vencido'; // Próximo a vencer en menos de 7 días
                }

                $cantidadPendiente = $prestamo->detalles->sum('cantidad_prestada');

                return [
                    'id' => $prestamo->id,
                    'tipo' => 'proveedor',
                    'nombre' => $prestamo->proveedor->nombre,
                    'razon_social' => $prestamo->proveedor->razon_social,
                    'prestable_nombre' => $prestamo->detalles->first()?->prestable->nombre,
                    'cantidad_pendiente' => $cantidadPendiente,
                    'fecha_esperada_devolucion' => $prestamo->fecha_esperada_devolucion?->format('Y-m-d'),
                    'dias_vencidos' => abs($diasDiferencia),
                    'estado' => $prestamo->estado,
                    'chofer' => null,
                    'urgencia' => $urgencia,
                ];
            });

        // Combinar y ordenar por urgencia
        $alertas = collect([...$prestamosClientes, ...$prestamosProveedores])
            ->sortBy(function ($alerta) {
                $urgencyOrder = ['critico' => 0, 'urgente' => 1, 'vencido' => 2, 'normal' => 3];
                return $urgencyOrder[$alerta['urgencia']] ?? 4;
            })
            ->values();

        // Contar por urgencia
        $resumen = [
            'total_alertas' => $alertas->count(),
            'criticas' => $alertas->where('urgencia', 'critico')->count(),
            'urgentes' => $alertas->where('urgencia', 'urgente')->count(),
            'vencidas' => $alertas->where('urgencia', 'vencido')->count(),
            'normales' => $alertas->where('urgencia', 'normal')->count(),
        ];

        return Inertia::render('prestamos/alertas', [
            'alertas' => $alertas,
            'resumen' => $resumen,
        ]);
    }
}
