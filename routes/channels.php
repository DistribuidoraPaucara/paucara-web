<?php

use App\Models\Proforma;
use App\Models\Entrega;
use App\Models\Ruta;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Broadcast Channels - SSOT + WebSocket Architecture
|--------------------------------------------------------------------------
|
| Canales de broadcasting para notificaciones en tiempo real
|
| TIPOS:
| 1. public.* - Acceso público (sin autenticación)
| 2. private.* - Requiere autenticación + autorización
| 3. presence.* - Canales con información de presencia
|
| PATRÓN:
| Service emite Event → Listener hace broadcast → Cliente recibe
*/

// ══════════════════════════════════════════════════════════════════
// CANALES DE USUARIO (Por defecto de Laravel)
// ══════════════════════════════════════════════════════════════════

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// ══════════════════════════════════════════════════════════════════
// CANALES PÚBLICOS - Sin autenticación requerida
// ══════════════════════════════════════════════════════════════════

/**
 * public.ventas.created - Nuevas ventas creadas
 */
Broadcast::channel('public.ventas.created', function () {
    return true;
});

/**
 * public.proformas.created - Nuevas proformas creadas
 */
Broadcast::channel('public.proformas.created', function () {
    return true;
});

/**
 * public.entregas.assigned - Entregas asignadas
 */
Broadcast::channel('public.entregas.assigned', function () {
    return true;
});

/**
 * public.rutas.planned - Rutas planificadas
 */
Broadcast::channel('public.rutas.planned', function () {
    return true;
});

/**
 * public.tracking.active - Tracking de entregas en vivo
 */
Broadcast::channel('public.tracking.active', function () {
    return true;
});

// ══════════════════════════════════════════════════════════════════
// CANALES PRIVADOS - Requiere autenticación + autorización
// ══════════════════════════════════════════════════════════════════

/**
 * private.user.{userId} - Notificaciones de usuario
 */
Broadcast::channel('private.user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

/**
 * private.org.{orgId} - Notificaciones de organización
 */
Broadcast::channel('private.org.{orgId}', function ($user, $orgId) {
    // TODO: Validar que pertenece a esa organización
    return Auth::check();
});

/**
 * private.chofer.{choferId} - Entregas asignadas al chofer
 */
Broadcast::channel('private.chofer.{choferId}', function ($user, $choferId) {
    return (int) $user->id === (int) $choferId ||
           $user->hasRole(['Supervisor', 'Admin']);
});

/**
 * private.ruta.{rutaId} - Detalles de ruta
 */
Broadcast::channel('private.ruta.{rutaId}', function ($user, $rutaId) {
    $ruta = Ruta::find($rutaId);
    if (!$ruta) return false;

    return (int) $user->id === (int) $ruta->chofer_id ||
           $user->hasRole(['Supervisor', 'Admin']);
});

/**
 * private.cliente.{clienteId} - Entregas del cliente
 */
Broadcast::channel('private.cliente.{clienteId}', function ($user, $clienteId) {
    return $user->cliente_id === (int) $clienteId ||
           $user->hasRole(['Supervisor', 'Admin', 'Vendedor']);
});

// ══════════════════════════════════════════════════════════════════
// CANALES LEGADOS - Mantener compatibilidad
// ══════════════════════════════════════════════════════════════════

/**
 * Canal para cliente: seguimiento de pedido
 * pedido.{proformaId}
 */
Broadcast::channel('pedido.{proformaId}', function ($user, $proformaId) {
    if (!Auth::check()) {
        return false;
    }

    try {
        $proforma = Proforma::find($proformaId);
        if (!$proforma) {
            return false;
        }

        // El usuario es cliente de la proforma O es admin/manager
        return $user->id === $proforma->cliente->user_id || $user->hasRole(['Admin', 'Manager']);
    } catch (\Exception $e) {
        return false;
    }
});

/**
 * Canal para seguimiento de entrega
 * entrega.{entregaId}
 */
Broadcast::channel('entrega.{entregaId}', function ($user, $entregaId) {
    if (!Auth::check()) {
        return false;
    }

    try {
        $entrega = Entrega::with('proforma')->find($entregaId);
        if (!$entrega) {
            return false;
        }

        // El usuario es cliente de la proforma, chofer asignado, O admin/manager
        return $user->id === $entrega->proforma->cliente->user_id ||
               ($entrega->chofer && $user->id === $entrega->chofer->user_id) ||
               $user->hasRole(['Admin', 'Manager']);
    } catch (\Exception $e) {
        return false;
    }
});

/**
 * Canal para chofer
 * chofer.{choferId}
 */
Broadcast::channel('chofer.{choferId}', function ($user, $choferId) {
    if (!Auth::check()) {
        return false;
    }

    try {
        $chofer = Chofer::find($choferId);
        if (!$chofer) {
            return false;
        }

        // El usuario es el chofer O es admin/manager
        return $user->id === $chofer->user_id || $user->hasRole(['Admin', 'Manager']);
    } catch (\Exception $e) {
        return false;
    }
});

/**
 * Canal para admin: todas las órdenes
 * admin.pedidos
 */
Broadcast::channel('admin.pedidos', function ($user) {
    if (!Auth::check()) {
        return false;
    }

    return $user->hasRole(['Admin', 'Manager']);
});
