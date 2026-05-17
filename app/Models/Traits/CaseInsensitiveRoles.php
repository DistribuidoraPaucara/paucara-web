<?php

namespace App\Models\Traits;

/**
 * ============================================
 * TRAIT: CaseInsensitiveRoles
 * ============================================
 *
 * Proporciona validación case-insensitive para roles.
 * Sobrepasa el método hasRole de Spatie\Permission\Traits\HasRoles
 * para permitir búsquedas insensibles a mayúsculas/minúsculas.
 *
 * PROBLEMA: Inconsistencia de case sensitivity
 * - Algunos lugares usan 'Chofer', otros 'chofer'
 * - Spatie por defecto es case-sensitive
 *
 * SOLUCIÓN:
 * - Normaliza roles a minúsculas antes de comparar
 * - Compatible con arrays de roles
 * - Compatibilidad total con hasRole() existente
 *
 * EJEMPLOS:
 *   $user->hasRole('chofer');      // ✅ Encuentra 'Chofer'
 *   $user->hasRole('CHOFER');      // ✅ Encuentra 'Chofer'
 *   $user->hasRole(['chofer', 'admin']); // ✅ Encuentra cualquiera
 *   $user->hasRole('Chofer');      // ✅ Encuentra 'Chofer' (caso original)
 *
 * @package App\Models\Traits
 * @author Desarrollo
 * @since 2026-02-08
 */
trait CaseInsensitiveRoles
{
    /**
     * Verifica si el usuario tiene un rol específico.
     * Operación case-insensitive.
     *
     * Sobrepasa el método de Spatie\Permission\Traits\HasRoles
     * para hacer la comparación insensible a mayúsculas.
     *
     * NOTA: Maneja tanto strings como objetos Role (necesario para hasPermissionViaRole de Spatie)
     *
     * @param string|array|\Illuminate\Database\Eloquent\Collection $roles Rol, roles o colección a verificar
     * @param string|null $guard Guard a usar (por defecto de config)
     * @return bool true si tiene el rol, false en otro caso
     */
    public function hasRole($roles, $guard = null): bool
    {
        // Si $roles es null o colección vacía, retornar false
        if (is_null($roles)) {
            return false;
        }

        // Manejar Colecciones (Laravel Collection) - extraer objetos directamente
        if ($roles instanceof \Illuminate\Database\Eloquent\Collection) {
            $rolesToCheck = $roles->all(); // Obtener array de objetos
        } elseif (is_array($roles)) {
            $rolesToCheck = $roles;
        } else {
            $rolesToCheck = [$roles];
        }

        // Extraer nombres de roles (manejar tanto strings como objetos Role)
        $normalizedRolesToCheck = array_map(function ($role) {
            // Si es un objeto con propiedad 'name', usar eso
            if (is_object($role)) {
                if (method_exists($role, 'getAttribute')) {
                    // Es un Eloquent Model
                    return strtolower($role->getAttribute('name'));
                } elseif (property_exists($role, 'name')) {
                    return strtolower($role->name);
                }
            }
            // Si es un array con clave 'name'
            if (is_array($role) && isset($role['name'])) {
                return strtolower($role['name']);
            }
            // Si es string, convertir a minúsculas
            if (is_string($role)) {
                return strtolower($role);
            }
            // Para otros casos, intentar convertir a string
            return strtolower((string) $role);
        }, $rolesToCheck);

        // Obtener los roles del usuario y normalizarlos
        $userRoles = $this->roles()->pluck('name')->toArray();
        $normalizedUserRoles = array_map('strtolower', $userRoles);

        // Verificar si al menos uno de los roles solicitados está en los roles del usuario
        return !empty(array_intersect($normalizedRolesToCheck, $normalizedUserRoles));
    }

    /**
     * Verifica si el usuario tiene todos los roles especificados.
     * Operación case-insensitive.
     *
     * @param string|array|\Illuminate\Database\Eloquent\Collection $roles Rol, roles o colección a verificar
     * @param string|null $guard Guard a usar
     * @return bool true si tiene todos, false en otro caso
     */
    public function hasAllRoles($roles, $guard = null): bool
    {
        if (is_null($roles)) {
            return false;
        }

        // Manejar Colecciones - extraer objetos directamente
        if ($roles instanceof \Illuminate\Database\Eloquent\Collection) {
            $rolesToCheck = $roles->all();
        } elseif (is_array($roles)) {
            $rolesToCheck = $roles;
        } else {
            $rolesToCheck = [$roles];
        }

        // Extraer nombres de roles (manejar tanto strings como objetos Role)
        $normalizedRolesToCheck = array_map(function ($role) {
            if (is_object($role)) {
                if (method_exists($role, 'getAttribute')) {
                    return strtolower($role->getAttribute('name'));
                } elseif (property_exists($role, 'name')) {
                    return strtolower($role->name);
                }
            }
            if (is_array($role) && isset($role['name'])) {
                return strtolower($role['name']);
            }
            if (is_string($role)) {
                return strtolower($role);
            }
            return strtolower((string) $role);
        }, $rolesToCheck);

        $userRoles = $this->roles()->pluck('name')->toArray();
        $normalizedUserRoles = array_map('strtolower', $userRoles);

        // Todos deben estar presentes
        return count(array_intersect($normalizedRolesToCheck, $normalizedUserRoles)) === count($normalizedRolesToCheck);
    }

    /**
     * Verifica si el usuario tiene alguno de los roles (al menos uno).
     * Alias para hasRole() pero más explícito.
     * Operación case-insensitive.
     *
     * @param string|array|\Illuminate\Database\Eloquent\Collection $roles Rol, roles o colección a verificar
     * @param string|null $guard Guard a usar
     * @return bool true si tiene al menos uno, false en otro caso
     */
    public function hasAnyRole($roles, $guard = null): bool
    {
        return $this->hasRole($roles, $guard);
    }
}
