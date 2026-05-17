<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Pedido;
use App\Services\AbacService;

/**
 * ============================================
 * FASE 4: POLÍTICAS CON ABAC
 * PedidoPolicy - Control de acceso a Pedidos
 * ============================================
 *
 * Exemplifica filtrado por sucursal/departamento.
 * Un usuario solo puede ver pedidos de su sucursal.
 */
class PedidoPolicy
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
     * Ver un pedido individual
     * Usuario debe tener acceso a la sucursal del pedido
     */
    public function view(User $user, Pedido $pedido): bool
    {
        return $this->abacService->puedeAcceder($user, 'pedido', $pedido->sucursal ?? $pedido->sucursal_id);
    }

    /**
     * Listar pedidos
     * Devuelve solo pedidos de las sucursales del usuario
     */
    public function viewAny(User $user): bool
    {
        // Todos los empleados pueden listar
        return $user->esEmpleado();
    }

    /**
     * Crear pedido en una sucursal específica
     */
    public function create(User $user): bool
    {
        // Requiere ser empleado
        if (!$user->esEmpleado()) {
            return false;
        }

        // Requiere tener sucursal asignada
        $sucursal = $this->abacService->obtenerAtributoPrimario($user, 'sucursal');
        return $sucursal !== null;
    }

    /**
     * Editar pedido
     */
    public function update(User $user, Pedido $pedido): bool
    {
        // Manager siempre puede editar
        if ($user->hasRole('Manager')) {
            return true;
        }

        // Otros empleados solo si es de su sucursal
        return $this->abacService->puedeAcceder($user, 'pedido', $pedido->sucursal ?? $pedido->sucursal_id);
    }

    /**
     * Confirmar/Procesar pedido
     * Requiere rol especial
     */
    public function approve(User $user, Pedido $pedido): bool
    {
        if (!$user->hasPermissionTo('confirmar_pedidos')) {
            return false;
        }

        return $this->abacService->puedeAcceder($user, 'pedido', $pedido->sucursal ?? $pedido->sucursal_id);
    }

    /**
     * Eliminar pedido
     * Solo admin
     */
    public function delete(User $user, Pedido $pedido): bool
    {
        return $user->hasRole('Admin');
    }
}
