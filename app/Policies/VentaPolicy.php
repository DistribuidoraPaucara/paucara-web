<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Venta;
use App\Services\AbacService;

/**
 * ============================================
 * FASE 4: POLÍTICAS CON ABAC
 * VentaPolicy - Control de acceso a Ventas
 * ============================================
 *
 * Exemplifica filtrado por zona de venta.
 * Un vendedor solo puede ver/editar ventas de su zona.
 */
class VentaPolicy
{
    protected AbacService $abacService;

    public function __construct(AbacService $abacService)
    {
        $this->abacService = $abacService;
    }

    /**
     * Super Admin bypass
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }
        return null;
    }

    /**
     * Ver una venta individual
     * Usuario debe tener acceso a la zona de la venta
     */
    public function view(User $user, Venta $venta): bool
    {
        // Si el usuario es el vendedor de la venta
        if ($venta->vendedor_id === $user->id) {
            return true;
        }

        // Verificar si el usuario tiene zona compatible
        return $this->abacService->puedeAcceder($user, 'venta', $venta->zona ?? $venta->zona_id);
    }

    /**
     * Crear venta (requiere capacidad ventas y zona asignada)
     */
    public function create(User $user): bool
    {
        // Necesita rol de empleado
        if (!$user->esEmpleado()) {
            return false;
        }

        // Necesita capacidad de ventas
        if (!$user->hasPermissionTo('ver_ventas')) {
            return false;
        }

        // Necesita tener asignada una zona
        $zona = $this->abacService->obtenerAtributoPrimario($user, 'zona');
        return $zona !== null;
    }

    /**
     * Editar venta
     */
    public function update(User $user, Venta $venta): bool
    {
        // Solo Admin, Manager o el vendedor original pueden editar
        if ($user->hasRole(['Admin', 'Manager'])) {
            return true;
        }

        if ($venta->vendedor_id === $user->id) {
            return true;
        }

        // Otros vendedores: solo si es de su zona
        return $this->abacService->puedeAcceder($user, 'venta', $venta->zona ?? $venta->zona_id);
    }

    /**
     * Eliminar venta
     * Solo admin o manager
     */
    public function delete(User $user, Venta $venta): bool
    {
        return $user->hasRole(['Admin', 'Manager']);
    }

    /**
     * Verificar atributo de zona antes de acceso a datos sensibles
     */
    public function viewSensitiveData(User $user, Venta $venta): bool
    {
        // El vendedor puede ver sus propios datos
        if ($venta->vendedor_id === $user->id) {
            return true;
        }

        // Manager de su zona
        if ($user->hasRole('Manager')) {
            return $this->abacService->puedeAcceder($user, 'venta', $venta->zona ?? $venta->zona_id);
        }

        return false;
    }
}
