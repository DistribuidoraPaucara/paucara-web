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
        // Obtener todos los clientes asignados al preventista
        $clientes = Cliente::where('preventista_id', $preventista->id)
            ->with('localidad')
            ->get();

        // Calcular estadísticas
        $totalClientes = $clientes->count();
        $clientesActivos = $clientes->where('activo', true)->count();
        $clientesInactivos = $totalClientes - $clientesActivos;

        // Porcentajes
        $porcentajeActivos = $totalClientes > 0
            ? round(($clientesActivos / $totalClientes) * 100, 2)
            : 0;
        $porcentajeInactivos = $totalClientes > 0
            ? round(($clientesInactivos / $totalClientes) * 100, 2)
            : 0;

        // ✅ MODIFICADO: Obtener primeros 3 clientes para reactivar (si hay inactivos)
        // O si no hay inactivos, mostrar primeros 3 clientes activos como muestra
        $clientesInactivos = $clientes->where('activo', false);

        if ($clientesInactivos->count() > 0) {
            // Si hay clientes inactivos, mostrar los primeros para reactivar
            $clientesParaMostrar = $clientesInactivos
                ->slice(0, 3)
                ->values();
        } else {
            // Si todos están activos, mostrar los primeros 3 activos
            $clientesParaMostrar = $clientes
                ->where('activo', true)
                ->slice(0, 3)
                ->values();
        }

        $clientesParaReactivar = $clientesParaMostrar
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre,
                    'razon_social' => $cliente->razon_social,
                    'telefono' => $cliente->telefono,
                    'email' => $cliente->email,
                    'localidad' => $cliente->localidad?->nombre,
                    'activo' => $cliente->activo,
                ];
            })
            ->toArray();

        return [
            'total_clientes' => $totalClientes,
            'clientes_activos' => $clientesActivos,
            'clientes_inactivos' => $clientesInactivos->count(),
            'porcentaje_activos' => $porcentajeActivos,
            'porcentaje_inactivos' => $porcentajeInactivos,
            'clientes_para_reactivar' => $clientesParaReactivar,
            'clientes_para_reactivar_count' => count($clientesParaReactivar),
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
