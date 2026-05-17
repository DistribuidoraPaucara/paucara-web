<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Compra;

/**
 * ============================================
 * CompraPolicy - Control de acceso a Compras
 * ============================================
 *
 * Define los permisos para ver, editar y eliminar compras.
 * Admin y Super Admin tienen acceso completo.
 */
class CompraPolicy
{
    /**
     * Super Admin bypass - permite acceso total
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole(['Super Admin', 'Admin'])) {
            return true;
        }
        return null;
    }

    /**
     * Ver una compra individual
     */
    public function view(User $user, Compra $compra): bool
    {
        // El usuario creador puede ver sus compras
        if ($compra->user_id === $user->id) {
            return true;
        }

        // Usuarios con permiso de ver compras
        return $user->hasPermissionTo('compras.show');
    }

    /**
     * Crear compra
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('compras.store');
    }

    /**
     * Editar compra
     */
    public function update(User $user, Compra $compra): bool
    {
        // Solo el usuario creador puede editar
        if ($compra->user_id === $user->id) {
            return $user->hasPermissionTo('compras.update');
        }

        // Admin tiene acceso total
        return $user->hasPermissionTo('compras.update');
    }

    /**
     * Eliminar compra
     */
    public function delete(User $user, Compra $compra): bool
    {
        return $user->hasPermissionTo('compras.destroy');
    }
}
