<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Empleado;

class PreventistStatisticsService
{
    /**
     * Obtener estadísticas completas del preventista para el dashboard
     * Retorna los datos que necesita la app móvil al loguear
     */
    public static function getStatsForLogin(Empleado $preventista): array
    {
        // ✅ NUEVO: Contar clientes totales en la BD
        $totalClientesBD = Cliente::count();

        // Obtener clientes asignados a este preventista
        $clientesAsignados = Cliente::where('preventista_id', $preventista->id)
            ->with('localidad')
            ->get();

        // Calcular estadísticas de clientes asignados
        $totalClientesAsignados = $clientesAsignados->count();
        $clientesActivos = $clientesAsignados->where('activo', true)->count();
        $clientesInactivos = $totalClientesAsignados - $clientesActivos;

        // ✅ NUEVO: Calcular la diferencia entre total en BD y asignados a este preventista
        $clientesSinAsignar = $totalClientesBD - $totalClientesAsignados;

        // Porcentajes
        $porcentajeActivos = $totalClientesAsignados > 0
            ? round(($clientesActivos / $totalClientesAsignados) * 100, 2)
            : 0;
        $porcentajeInactivos = $totalClientesAsignados > 0
            ? round(($clientesInactivos / $totalClientesAsignados) * 100, 2)
            : 0;

        return [
            'total_clientes_bd' => $totalClientesBD,
            'total_clientes_asignados' => $totalClientesAsignados,
            'clientes_sin_asignar' => $clientesSinAsignar,
            'clientes_activos' => $clientesActivos,
            'clientes_inactivos' => $clientesInactivos,
            'porcentaje_activos' => $porcentajeActivos,
            'porcentaje_inactivos' => $porcentajeInactivos,
        ];
    }

    /**
     * Obtener solo los clientes asignados al preventista
     * Útil para la app móvil cuando navega a la sección de clientes
     */
    public static function getClientesAsignados(Empleado $preventista, int $page = 1, int $perPage = 20, ?string $search = null): array
    {
        $query = Cliente::where('preventista_id', $preventista->id);

        // Si hay búsqueda, filtrar por nombre, razon_social, telefono o email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('razon_social', 'like', "%{$search}%")
                  ->orWhere('telefono', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Obtener total antes de paginar
        $total = $query->count();

        // Paginar
        $clientes = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->with('localidad')
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre,
                    'razon_social' => $cliente->razon_social,
                    'telefono' => $cliente->telefono,
                    'email' => $cliente->email,
                    'localidad_id' => $cliente->localidad_id,
                    'localidad' => $cliente->localidad?->nombre,
                    'activo' => $cliente->activo,
                    'limite_credito' => $cliente->limite_credito,
                ];
            })
            ->toArray();

        return [
            'data' => $clientes,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
            'last_page' => ceil($total / $perPage),
        ];
    }

    /**
     * Obtener estadísticas de comisión del preventista
     * (Puede expandirse para incluir datos de ventas, proformas, etc.)
     */
    public static function getComisiones(Empleado $preventista, ?string $mes = null): array
    {
        // Placeholder para futuras estadísticas de comisión
        // Se pueden agregar cálculos basados en ventas del preventista
        return [
            'total_comision_mes' => 0,
            'total_ventas_mes' => 0,
            'numero_ventas' => 0,
        ];
    }
}
