<?php

namespace App\Services\Notifications;

use App\Models\DevolucionEvento;
use App\Models\User;
use App\Services\WebSocket\DevolucionEventoWebSocketService;
use Illuminate\Support\Collection;

/**
 * Servicio orquestador de notificaciones de devoluciones de eventos
 */
class DevolucionEventoNotificationService
{
    protected DatabaseNotificationService $dbNotificationService;
    protected DevolucionEventoWebSocketService $wsService;

    public function __construct(
        DatabaseNotificationService $dbNotificationService,
        DevolucionEventoWebSocketService $wsService
    ) {
        $this->dbNotificationService = $dbNotificationService;
        $this->wsService = $wsService;
    }

    /**
     * Notificar registro de devolución de evento
     */
    public function notifyRegistered(DevolucionEvento $devolucion): bool
    {
        // 1. Obtener usuarios a notificar
        $users = $this->getUsersForRegistered($devolucion);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD
        $totalDevuelto = $devolucion->detalles->sum('cantidad_devuelta');
        $this->dbNotificationService->create($userIds, 'devolucion_evento.registrada', [
            'devolucion_id' => $devolucion->id,
            'evento_nombre' => $devolucion->prestamoEvento->nombre_evento ?? 'Evento',
            'cliente_nombre' => $devolucion->prestamoEvento->cliente->nombre ?? 'Cliente',
            'cliente_id' => $devolucion->prestamoEvento->cliente_id,
            'total_devuelto' => (int) $totalDevuelto,
            'fecha_devolucion' => $devolucion->fecha_devolucion?->format('d/m/Y'),
            'estado' => $devolucion->prestamoEvento->estado,
        ], [
            'devolucion_evento_id' => $devolucion->id,
            'prestamo_evento_id' => $devolucion->prestamo_evento_id,
        ]);

        // 3. Enviar notificación WebSocket
        return $this->wsService->notifyRegistered($devolucion);
    }

    /**
     * Usuarios para notificar cuando se registra una devolución de evento
     * Criterio: Admins, Cajeros, Choferes involucrados, usuario que registró
     */
    private function getUsersForRegistered(DevolucionEvento $devolucion): Collection
    {
        $users = collect();

        // 1. Admins, Cajeros, Managers
        $staffUsers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['admin', 'cajero', 'manager', 'Admin', 'Cajero', 'Manager']);
        })->where('activo', true)->get();
        $users = $users->merge($staffUsers);

        // 2. Usuario que registró la devolución (created_by)
        if ($devolucion->created_by) {
            $creator = User::where('id', $devolucion->created_by)
                ->where('activo', true)
                ->first();
            if ($creator) {
                $users->push($creator);
            }
        }

        // 3. Chofer que realizó la devolución (del préstamo)
        if ($devolucion->prestamoEvento && $devolucion->prestamoEvento->chofer_id) {
            $chofer = User::where('id', $devolucion->prestamoEvento->chofer_id)
                ->where('activo', true)
                ->first();
            if ($chofer) {
                $users->push($chofer);
            }
        }

        // 4. Chofer registrado en la devolución
        if ($devolucion->chofer_id && $devolucion->chofer_id !== $devolucion->prestamoEvento->chofer_id) {
            $choferDev = User::where('id', $devolucion->chofer_id)
                ->where('activo', true)
                ->first();
            if ($choferDev) {
                $users->push($choferDev);
            }
        }

        return $users->unique('id');
    }
}
