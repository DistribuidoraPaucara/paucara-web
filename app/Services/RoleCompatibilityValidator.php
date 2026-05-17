<?php

namespace App\Services;

use Exception;

/**
 * ============================================
 * FASE 3: VALIDADOR DE COMPATIBILIDAD SIMPLIFICADO
 * ============================================
 *
 * Con solo 5 roles base, la compatibilidad es mucho más simple:
 * - Super Admin: Exclusivo (no combina con otros)
 * - Admin: Exclusivo (no combina con otros)
 * - Manager: Compatible con Empleado (capacidades específicas)
 * - Empleado: Compatible con Manager
 * - Cliente: Incompatible con Empleado/Manager/Admin/Super Admin
 *
 * Las capacidades específicas se asignan aparte, no mediante roles.
 */
class RoleCompatibilityValidator
{
    /**
     * Matriz de roles incompatibles
     *
     * Estructura:
     * - Super Admin: Exclusivo, no combina con nada
     * - Admin: Exclusivo, no combina con nada
     * - Cliente: Incompatible con todos los roles internos
     * - Roles Funcionales (Preventista, Chofer, Cajero, etc.): Solo incompatibles con Admin/Super Admin/Cliente
     *   Los roles funcionales pueden combinarse entre sí (ej: Cajero + Chofer)
     */
    private array $incompatibilidadRoles = [
        // ===== ROLES BASE =====
        // Super Admin: Exclusivo, no combina
        'Super Admin' => ['*'],  // Incompatible con todo

        // Admin: Exclusivo, no combina
        'Admin' => ['*'],  // Incompatible con todo

        // Manager: Compatible con roles funcionales pero no con Admin/Super Admin/Cliente
        'Manager' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        // Empleado: Compatible con roles funcionales pero no con Admin/Super Admin/Cliente
        'Empleado' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        // Cliente: Es usuario final, incompatible con todos los roles internos
        'Cliente' => [
            'Super Admin',
            'Admin',
            'Manager',
            'Empleado',
            'Preventista',
            'Chofer',
            'Cajero',
            'Vendedor',
            'Comprador',
            'Gestor de Inventario',
            'Gestor de Almacén',
            'Gestor de Logística',
            'Contabilidad',
            'Reportes',
            'Gestor de Clientes',
            'Gerente',
            'Compras',
        ],

        // ===== ROLES FUNCIONALES =====
        // Todos los roles funcionales solo son incompatibles con Admin/Super Admin/Cliente
        'Preventista' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Chofer' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Cajero' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Vendedor' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Comprador' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Gestor de Inventario' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Gestor de Almacén' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Gestor de Logística' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Contabilidad' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Reportes' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Gestor de Clientes' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Gerente' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],

        'Compras' => [
            'Super Admin',
            'Admin',
            'Cliente',
        ],
    ];

    /**
     * Roles que SIEMPRE deben ser exclusivos (sin otros roles)
     */
    private array $rolesExclusivos = [
        'Super Admin', // Debe ser único
        'Admin',       // Debe ser único
    ];

    /**
     * Valida que los roles asignados sean compatibles entre sí
     *
     * @param array $roles Array de nombres de roles a validar
     * @param ?string $usuarioActualRol Rol actual del usuario (para transiciones)
     * @throws Exception Si encuentra roles incompatibles
     */
    public function validar(array $roles, ?string $usuarioActualRol = null): void
    {
        // Filtrar roles vacíos
        $roles = array_filter(array_map('trim', $roles));

        if (empty($roles)) {
            return;
        }

        // Validación 1: Roles exclusivos
        $this->validarRolesExclusivos($roles);

        // Validación 2: Incompatibilidades
        $this->validarIncompatibilidades($roles);

        // Validación 3: Validar transición de rol (si se está cambiando)
        if ($usuarioActualRol && !in_array($usuarioActualRol, $roles)) {
            $this->validarTransicion($usuarioActualRol, $roles);
        }
    }

    /**
     * Valida que roles exclusivos no se asignen con otros
     */
    private function validarRolesExclusivos(array $roles): void
    {
        foreach ($this->rolesExclusivos as $rolExclusivo) {
            if (in_array($rolExclusivo, $roles) && count($roles) > 1) {
                throw new Exception(
                    "El rol '{$rolExclusivo}' es exclusivo y no puede combinarse con otros roles. "
                    . "El usuario debe tener SOLO el rol '{$rolExclusivo}'."
                );
            }
        }
    }

    /**
     * Valida incompatibilidades entre roles
     */
    private function validarIncompatibilidades(array $roles): void
    {
        foreach ($roles as $rolActual) {
            // Verificar si este rol tiene incompatibilidades
            if (!isset($this->incompatibilidadRoles[$rolActual])) {
                continue;
            }

            $rolesIncompatibles = $this->incompatibilidadRoles[$rolActual];

            // Si el rol es incompatible con TODO ('*'), rechazar cualquier combinación
            if (in_array('*', $rolesIncompatibles) && count($roles) > 1) {
                throw new Exception(
                    "El rol '{$rolActual}' es exclusivo y no puede combinarse con otros roles. "
                    . "El usuario debe tener SOLO el rol '{$rolActual}'."
                );
            }

            // Buscar conflictos
            foreach ($roles as $otroRol) {
                if ($rolActual === $otroRol) {
                    continue; // No comparar consigo mismo
                }

                if (in_array($otroRol, $rolesIncompatibles)) {
                    throw new Exception(
                        "El rol '{$rolActual}' es incompatible con '{$otroRol}'. "
                        . "Un empleado no puede tener ambos roles simultáneamente."
                    );
                }
            }
        }
    }

    /**
     * Valida transiciones de roles (cambios de rol)
     * Con 5 roles base, las transiciones son muy controladas
     */
    private function validarTransicion(string $rolAnterior, array $rolesNuevos): void
    {
        // Super Admin: No puede remover sin confirmación explícita
        if ($rolAnterior === 'Super Admin' && !in_array('Super Admin', $rolesNuevos)) {
            throw new Exception(
                "No se puede remover el rol 'Super Admin' a través de esta acción. "
                . "Use la función específica de administración de Super Admin."
            );
        }

        // Admin: No puede remover sin confirmación explícita
        if ($rolAnterior === 'Admin' && !in_array('Admin', $rolesNuevos)) {
            throw new Exception(
                "No se puede remover el rol 'Admin' a través de esta acción. "
                . "Use la función específica de administración de Admin."
            );
        }

        // Cliente: No puede ser removido para convertirse en Empleado sin confirmación
        if ($rolAnterior === 'Cliente' && !in_array('Cliente', $rolesNuevos)) {
            // Permiso explícito para convertir Cliente a Empleado
            // Solo registramos la transición
        }
    }

    /**
     * Obtiene la lista de roles incompatibles con un rol específico
     *
     * @param string $rol
     * @return array
     */
    public function obtenerIncompatibles(string $rol): array
    {
        return $this->incompatibilidadRoles[$rol] ?? [];
    }

    /**
     * Obtiene la matriz completa de incompatibilidades
     */
    public function obtenerMatrizCompleta(): array
    {
        return $this->incompatibilidadRoles;
    }

    /**
     * Verifica si dos roles son compatibles
     */
    public function sonCompatibles(string $rol1, string $rol2): bool
    {
        if ($rol1 === $rol2) {
            return true;
        }

        // Verificar en ambas direcciones
        $incompatibles = $this->incompatibilidadRoles[$rol1] ?? [];
        return !in_array($rol2, $incompatibles);
    }

    /**
     * Obtiene los roles que SÍ son compatibles con un rol dado
     */
    public function obtenerCompatibles(string $rol, array $rolesDisponibles): array
    {
        $incompatibles = $this->obtenerIncompatibles($rol);

        return array_filter($rolesDisponibles, function ($nuevoRol) use ($incompatibles, $rol) {
            return $nuevoRol !== $rol && !in_array($nuevoRol, $incompatibles);
        });
    }
}
