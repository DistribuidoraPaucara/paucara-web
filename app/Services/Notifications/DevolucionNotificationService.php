<?php

namespace App\Services\Notifications;

use App\Models\DevolucionCliente;
use App\Models\User;
use App\Services\WebSocket\DevolucionWebSocketService;
use Illuminate\Support\Collection;

/**
 * Servicio orquestador de notificaciones de devoluciones
 *
 * Este servicio coordina entre:
 * - Notificaciones en BD (DatabaseNotificationService)
 * - Notificaciones en tiempo real (DevolucionWebSocketService)
 *
 * Responsabilidad única: Lógica de negocio de notificaciones de devoluciones
 */
class DevolucionNotificationService
{
    protected DatabaseNotificationService $dbNotificationService;
    protected DevolucionWebSocketService $wsService;

    public function __construct(
        DatabaseNotificationService $dbNotificationService,
        DevolucionWebSocketService $wsService
    ) {
        $this->dbNotificationService = $dbNotificationService;
        $this->wsService = $wsService;
    }

    /**
     * Notificar registro de devolución
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyRegistered(DevolucionCliente $devolucion): bool
    {
        // 1. Obtener usuarios a notificar
        $users = $this->getUsersForRegistered($devolucion);
        $userIds = $users->pluck('id')->toArray();

        \Illuminate\Support\Facades\Log::info('📢 DevolucionNotificationService - Usuarios a notificar', [
            'devolucion_id' => $devolucion->id,
            'created_by' => $devolucion->created_by,
            'usuarios_count' => count($userIds),
            'usuarios_ids' => $userIds,
            'todos_usuarios' => $users->map(fn($u) => ['id' => $u->id, 'name' => $u->name])->toArray(),
        ]);

        // 2. Guardar en BD (persistente)
        $totalDevuelto = $devolucion->detalles->sum('cantidad_devuelta');
        $this->dbNotificationService->create($userIds, 'devolucion.registrada', [
            'devolucion_id' => $devolucion->id,
            'prestamo_numero' => $devolucion->prestamo->numero ?? 'N/A',
            'cliente_nombre' => $devolucion->prestamo->cliente->nombre ?? 'Cliente',
            'cliente_id' => $devolucion->prestamo->cliente_id,
            'total_devuelto' => (int) $totalDevuelto,
            'fecha_devolucion' => $devolucion->fecha_devolucion?->format('d/m/Y'),
            'estado' => $devolucion->prestamo->estado,
        ], [
            'devolucion_id' => $devolucion->id,
            'prestamo_id' => $devolucion->prestamo_cliente_id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyRegistered($devolucion);
    }

    // ========================================
    // MÉTODOS PRIVADOS - LÓGICA DE USUARIOS
    // ========================================

    /**
     * Usuarios para notificar cuando se REGISTRA una devolución
     * Criterio: Admins, Cajeros, Choferes involucrados, usuario que registró
     */
    private function getUsersForRegistered(DevolucionCliente $devolucion): Collection
    {
        $users = collect();

        // 1. Admins, Cajeros, Managers (staff)
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
        if ($devolucion->prestamo && $devolucion->prestamo->chofer_id) {
            $chofer = User::where('id', $devolucion->prestamo->chofer_id)
                ->where('activo', true)
                ->first();
            if ($chofer) {
                $users->push($chofer);
            }
        }

        // 4. Chofer registrado en la devolución (si aplica)
        if ($devolucion->chofer_id && $devolucion->chofer_id !== $devolucion->prestamo->chofer_id) {
            $choferDevoluc = User::where('id', $devolucion->chofer_id)
                ->where('activo', true)
                ->first();
            if ($choferDevoluc) {
                $users->push($choferDevoluc);
            }
        }

        return $users->unique('id');
    }
}
