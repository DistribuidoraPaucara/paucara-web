<?php
namespace App\Policies;

use App\Models\User;
use App\Models\VisitaPreventistaCliente;

class VisitaPreventistaPolicy
{
    /**
     * Super Admin tiene acceso total
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin') || $user->hasRole('super admin')) {
            return true;
        }

        return null;
    }

    /**
     * Ver listado de visitas
     */
    public function viewAny(User $user): bool
    {
        // Admin y Preventista pueden ver listados
        return $user->hasAnyRole(['Admin', 'Preventista', 'admin', 'preventista']);
    }

    /**
     * Ver una visita específica
     */
    public function view(User $user, VisitaPreventistaCliente $visita): bool
    {
        // Admin ve todas
        if ($user->hasRole('Admin') || $user->hasRole('admin')) {
            return true;
        }

        // Preventista solo ve SUS visitas
        if ($user->hasRole('Preventista') || $user->hasRole('preventista')) {
            return $user->empleado?->id === $visita->preventista_id;
        }

        return false;
    }

    /**
     * Crear nueva visita
     */
    public function create(User $user): bool
    {
        // Solo preventistas pueden crear visitas
        return ($user->hasRole('Preventista') || $user->hasRole('preventista')) &&
        $user->empleado !== null;
    }

    /**
     * Editar visita (solo dentro de X horas de creada)
     */
    public function update(User $user, VisitaPreventistaCliente $visita): bool
    {
        // Preventista puede editar solo SUS visitas
        if (! ($user->hasRole('Preventista') || $user->hasRole('preventista'))) {
            return false;
        }

        if ($user->empleado?->id !== $visita->preventista_id) {
            return false;
        }

        // Solo se puede editar dentro de las 2 horas siguientes
        $limiteEdicion = $visita->created_at->addHours(2);

        return now()->lte($limiteEdicion);
    }

    /**
     * Eliminar visita (solo Super Admin)
     */
    public function delete(User $user, VisitaPreventistaCliente $visita): bool
    {
        return $user->hasRole('Super Admin') || $user->hasRole('super admin');
    }
}
