<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "creating" event.
     * Auto-asigna la empresa del usuario autenticado al nuevo usuario
     */
    public function creating(User $user): void
    {
        // Si empresa_id no está asignado y hay usuario autenticado
        if (!$user->empresa_id && auth()->check()) {
            $user->empresa_id = auth()->user()->empresa_id;
        }
    }
}
