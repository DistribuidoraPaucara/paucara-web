<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cliente;
use App\Services\AbacService;

/**
 * ============================================
 * POLÍTICAS DE CLIENTE - CONTROL DE ACCESO GRANULAR
 * ============================================
 *
 * Control de acceso basado en:
 * - Super-Admin: Acceso total a cualquier operación
 * - Admin: Acceso total a cualquier operación (crear, editar, eliminar, etc.)
 * - Preventista: Gestión completa solo de SUS clientes (preventista_id)
 * - Cliente: Ver solo su propio registro
 */
class ClientePolicy
{
    protected AbacService $abacService;

    public function __construct(AbacService $abacService)
    {
        $this->abacService = $abacService;
    }

    /**
     * ✅ ACTUALIZADO: Super Admin y Admin pueden hacer cualquier gestión sobre clientes
     */
    public function before(User $user, string $ability): ?bool
    {
        // ✅ Super-Admin: acceso total
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // ✅ Admin (cualquier variante): acceso total a cualquier gestión de clientes
        if ($user->hasRole(['Admin', 'admin'])) {
            return true;
        }

        return null;
    }

    /**
     * ✅ Ver un cliente individual
     *
     * Reglas:
     * - Cliente logueado: ve solo sus propios datos
     * - Preventista: puede ver:
     *   1. Clientes asignados a él (preventista_id)
     *   2. Cualquier cliente activo (para seleccionar en carrito)
     */
    public function view(User $user, Cliente $cliente): bool
    {
        // Cliente puede ver sus propios datos (si tiene usuario asociado)
        if ($user->cliente && $user->cliente->id === $cliente->id) {
            return true;
        }

        // ✅ Preventista (cualquier variante):
        if ($user->hasRole(['Preventista', 'preventista'])) {
            // 1️⃣ VER clientes asignados a él (preventista_id coincide)
            if ($user->empleado?->id === $cliente->preventista_id) {
                return true;
            }

            // 2️⃣ TAMBIÉN puede ver clientes activos (para seleccionar en carrito)
            if ($cliente->activo) {
                return true;
            }

            return false;
        }

        // Fallback a ABAC (zona) si no tiene preventista_id
        $zona = $cliente->zona_id ?? $cliente->zona;
        if ($zona) {
            return $this->abacService->puedeAcceder($user, 'cliente', $zona);
        }

        return $user->esEmpleado() ?? false;
    }

    /**
     * ✅ Listar clientes
     */
    public function viewAny(User $user): bool
    {
        // Preventista, Admin, Super-Admin pueden listar
        return $user->hasRole(['Preventista', 'preventista', 'admin', 'Admin', 'super-admin', 'Super Admin']) ||
               $user->esEmpleado() ?? false;
    }

    /**
     * ✅ Crear cliente
     * Super-Admin, Admin y Preventista pueden crear
     */
    public function create(User $user): bool
    {
        // ✅ Preventista (cualquier variante) con permiso
        if ($user->hasRole(['Preventista', 'preventista'])) {
            return $user->hasPermissionTo('clientes.create') ||
                   $user->hasPermissionTo('clientes.manage');
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Editar cliente
     * Super-Admin, Admin: editan cualquier cliente
     * Preventista: solo SUS clientes
     */
    public function update(User $user, Cliente $cliente): bool
    {
        // ✅ Preventista (cualquier variante): editar solo SUS clientes
        if ($user->hasRole(['Preventista', 'preventista'])) {
            // Verificar que sea el preventista asignado al cliente
            if ($user->empleado?->id !== $cliente->preventista_id) {
                return false;
            }

            // Verificar permisos: clientes.edit-own O clientes.manage
            return $user->hasPermissionTo('clientes.edit-own') ||
                   $user->hasPermissionTo('clientes.manage');
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Eliminar cliente
     * Super-Admin, Admin: eliminan cualquier cliente
     * Preventista: solo SUS clientes
     */
    public function delete(User $user, Cliente $cliente): bool
    {
        // ✅ Preventista (cualquier variante): eliminar solo SUS clientes
        if ($user->hasRole(['Preventista', 'preventista'])) {
            if ($user->empleado?->id !== $cliente->preventista_id) {
                return false;
            }
            return $user->hasPermissionTo('clientes.delete-own') ||
                   $user->hasPermissionTo('clientes.manage');
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Bloquear cliente
     * Super-Admin, Admin: bloquean cualquier cliente
     * Preventista: solo SUS clientes
     */
    public function block(User $user, Cliente $cliente): bool
    {
        // ✅ Preventista (cualquier variante): bloquear solo SUS clientes
        if ($user->hasRole(['Preventista', 'preventista'])) {
            if ($user->empleado?->id !== $cliente->preventista_id) {
                return false;
            }
            return $user->hasPermissionTo('clientes.block-own') ||
                   $user->hasPermissionTo('clientes.manage');
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Ver auditoría
     * Super-Admin, Admin: ver auditoría de cualquier cliente
     * Preventista: solo de SUS clientes
     */
    public function audit(User $user, Cliente $cliente): bool
    {
        // ✅ Preventista (cualquier variante): ver auditoría solo de SUS clientes
        if ($user->hasRole(['Preventista', 'preventista'])) {
            if ($user->empleado?->id !== $cliente->preventista_id) {
                return false;
            }
            return $user->hasPermissionTo('clientes.audit-own') ||
                   $user->hasPermissionTo('clientes.manage');
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Cambiar estado
     * Super-Admin, Admin: cambiar estado de cualquier cliente
     * Preventista: solo de SUS clientes
     */
    public function changeState(User $user, Cliente $cliente): bool
    {
        // ✅ Preventista (cualquier variante): cambiar estado solo de SUS clientes
        if ($user->hasRole(['Preventista', 'preventista'])) {
            return $user->empleado?->id === $cliente->preventista_id;
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Restaurar cliente eliminado
     * Super-Admin, Admin: restaurar cualquier cliente
     * Preventista: solo SUS clientes
     */
    public function restore(User $user, Cliente $cliente): bool
    {
        // ✅ Preventista (cualquier variante): restaurar solo SUS clientes
        if ($user->hasRole(['Preventista', 'preventista'])) {
            return $user->empleado?->id === $cliente->preventista_id;
        }

        // Super-Admin y Admin son autorizados en before()
        return false;
    }

    /**
     * ✅ Eliminar permanentemente
     * Super-Admin y Admin: eliminar permanentemente
     */
    public function forceDelete(User $user, Cliente $cliente): bool
    {
        // ✅ Super-Admin y Admin (ambos tienen acceso por before())
        return $user->hasRole(['Super Admin', 'Admin', 'admin']);
    }
}
