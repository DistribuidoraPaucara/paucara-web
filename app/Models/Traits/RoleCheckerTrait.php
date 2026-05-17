<?php

namespace App\Models\Traits;

/**
 * ============================================
 * TRAIT: RoleCheckerTrait
 * ============================================
 *
 * Proporciona métodos mejorados para verificar roles
 * de forma consistente en toda la aplicación.
 *
 * Elimina la necesidad de buscar 'admin', 'Admin', 'ADMIN'
 * en múltiples archivos.
 *
 * USO:
 *   // En lugar de:
 *   $user->hasRole(['admin', 'Admin', 'ADMIN', 'manager', 'Manager'])
 *
 *   // Usa:
 *   $user->isAdmin()
 *   $user->isManager()
 *   $user->isAnyAdminRole()  // Admin O Manager O Super Admin
 */
trait RoleCheckerTrait
{
    /**
     * Verifica si el usuario es un administrador (cualquier nivel)
     *
     * Retorna true si tiene: Super Admin, Admin O Manager
     */
    public function isAnyAdminRole(): bool
    {
        return $this->hasAnyRole(['Super Admin', 'Admin', 'Manager']);
    }

    /**
     * Verifica si el usuario es Admin (excluye Super Admin)
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('Admin');
    }

    /**
     * Verifica si el usuario es Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('Super Admin');
    }

    /**
     * Verifica si el usuario es Manager
     */
    public function isManager(): bool
    {
        return $this->hasRole('Manager');
    }

    /**
     * Verifica si el usuario es Cajero
     */
    public function isCajero(): bool
    {
        return $this->hasRole('Cajero');
    }

    /**
     * Verifica si el usuario es Chofer
     */
    public function isChofer(): bool
    {
        return $this->hasRole('Chofer');
    }

    /**
     * Verifica si el usuario es Preventista
     */
    public function isPreventista(): bool
    {
        return $this->hasRole('Preventista');
    }

    /**
     * Verifica si el usuario es Gestor de Logística
     */
    public function isGestorLogistica(): bool
    {
        return $this->hasRole('Gestor de Logística');
    }

    /**
     * Verifica si el usuario es Gestor de Almacén
     */
    public function isGestorAlmacen(): bool
    {
        return $this->hasRole('Gestor de Almacén');
    }

    /**
     * Verifica si el usuario es Vendedor
     */
    public function isVendedor(): bool
    {
        return $this->hasRole('Vendedor');
    }

    /**
     * Verifica si el usuario es Comprador
     */
    public function isComprador(): bool
    {
        return $this->hasRole('Comprador');
    }

    /**
     * Verifica si el usuario es Cliente
     */
    public function isCliente(): bool
    {
        return $this->hasRole('Cliente');
    }

    /**
     * Verifica si el usuario tiene acceso administrativo o de gestión
     *
     * Incluye: Super Admin, Admin, Manager, Gestor de Logística, Gestor de Almacén
     */
    public function hasAdminAccess(): bool
    {
        return $this->hasAnyRole([
            'Super Admin',
            'Admin',
            'Manager',
            'Gestor de Logística',
            'Gestor de Almacén',
        ]);
    }

    /**
     * Obtiene una descripción legible del/de los rol(es) del usuario
     *
     * Retorna: "Super Admin, Admin, Manager" o "Cajero"
     */
    public function getRolesLabel(): string
    {
        return $this->roles->pluck('name')->implode(', ') ?: 'Sin rol asignado';
    }

    /**
     * Retorna solo los nombres de los roles como array
     * (Evita colisión con HasRoles::getRoleNames de Spatie)
     *
     * Retorna array: ['Super Admin', 'Admin', 'Manager']
     */
    public function getAllRoles(): array
    {
        return $this->roles->pluck('name')->toArray();
    }

    /**
     * Verifica si el usuario tiene EXACTAMENTE un rol específico
     * (NO múltiples roles con ese nombre)
     *
     * Ejemplo: $user->hasExactlyRole('Cajero') -> true si SOLO es Cajero
     */
    public function hasExactlyRole(string $role): bool
    {
        return $this->roles->count() === 1 && $this->hasRole($role);
    }

    /**
     * Obtiene el rol "principal" del usuario (el primero en la lista)
     *
     * Útil cuando un usuario tiene múltiples roles pero uno es el principal
     */
    public function getPrimaryRole(): ?string
    {
        return $this->roles->first()?->name;
    }
}
