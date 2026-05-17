<?php
namespace App\Models\Traits;

use Illuminate\Support\Facades\Log;

/**
 * Trait para manejar roles dinámicos en el modelo Empleado
 * NOTA: Ya no usa TipoEmpleado, solo roles de Spatie
 */
trait RolesFuncionalesTrait
{
    /**
     * Boot del trait para registrar eventos
     */
    public static function bootRolesFuncionalesTrait()
    {
        // Podríamos implementar eventos aquí si es necesario
    }

    /**
     * Verifica si el empleado tiene un rol específico
     */
    public function tieneRol(string $rol): bool
    {
        return $this->user && $this->user->hasRole($rol);
    }

    /**
     * Obtiene todos los roles del empleado
     */
    public function obtenerRoles(): array
    {
        if (! $this->user) {
            return [];
        }

        return $this->user->roles->pluck('name')->toArray();
    }

    /**
     * Verifica si el empleado tiene alguno de los roles especificados
     */
    public function tieneAlgunRol(array $roles): bool
    {
        if (! $this->user) {
            return false;
        }

        return $this->user->hasAnyRole($roles);
    }

    /**
     * Verifica si el empleado tiene todos los roles especificados
     */
    public function tieneTodosRoles(array $roles): bool
    {
        if (! $this->user) {
            return false;
        }

        return $this->user->hasAllRoles($roles);
    }
}
