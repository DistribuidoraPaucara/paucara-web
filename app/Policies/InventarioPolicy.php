<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Inventario;
use App\Services\AbacService;

/**
 * ============================================
 * FASE 4: POLÍTICAS CON ABAC
 * InventarioPolicy - Control de acceso a Inventario
 * ============================================
 *
 * Exemplifica uso de filtrarResourcesPorAtributos
 * para filtrar queries Eloquent directamente.
 * Un usuario solo ve inventario de su centro de distribución.
 */
class InventarioPolicy
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
     * Ver un item de inventario
     */
    public function view(User $user, Inventario $inventario): bool
    {
        return $this->abacService->puedeAcceder(
            $user,
            'producto',
            $inventario->centro_distribucion ?? $inventario->centro_distribucion_id
        );
    }

    /**
     * Listar inventario
     * IMPORTANTE: En el controlador, usar:
     * $query = Inventario::query();
     * $query = $abacService->filtrarResourcesPorAtributos(
     *     $query,
     *     $user,
     *     'centro_distribucion',  // nombre de columna
     *     'centro_distribucion'   // tipo de atributo ABAC
     * );
     * return $query->get();
     */
    public function viewAny(User $user): bool
    {
        return $user->esEmpleado();
    }

    /**
     * Actualizar stock
     * Requiere capacidad y acceso a centro_distribucion
     */
    public function update(User $user, Inventario $inventario): bool
    {
        // Requiere capacidad
        if (!$user->hasPermissionTo('actualizar_inventario')) {
            return false;
        }

        // Requiere acceso al centro de distribución
        return $this->abacService->puedeAcceder(
            $user,
            'producto',
            $inventario->centro_distribucion ?? $inventario->centro_distribucion_id
        );
    }

    /**
     * Crear producto en inventario
     */
    public function create(User $user): bool
    {
        // Requiere rol
        if (!$user->hasRole(['Admin', 'Manager'])) {
            return false;
        }

        // Requiere capacidad
        if (!$user->hasPermissionTo('crear_inventario')) {
            return false;
        }

        // Requiere tener centro de distribución asignado
        $centroDistribucion = $this->abacService->obtenerAtributoPrimario(
            $user,
            'centro_distribucion'
        );

        return $centroDistribucion !== null;
    }

    /**
     * Eliminar producto
     * Solo admin
     */
    public function delete(User $user, Inventario $inventario): bool
    {
        return $user->hasRole('Admin');
    }

    /**
     * Ver datos de costo (sensibles)
     */
    public function viewCostData(User $user, Inventario $inventario): bool
    {
        // Solo gerentes y admin
        if (!$user->hasRole(['Admin', 'Manager'])) {
            return false;
        }

        // Debe tener acceso al centro de distribución
        return $this->abacService->puedeAcceder(
            $user,
            'producto',
            $inventario->centro_distribucion ?? $inventario->centro_distribucion_id
        );
    }
}
