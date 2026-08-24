<?php

namespace App\Services\Notifications;

use App\Models\DevolucionProveedor;
use App\Models\User;
use App\Services\WebSocket\DevolucionProveedorWebSocketService;
use Illuminate\Support\Collection;

/**
 * Servicio orquestador de notificaciones de devoluciones de proveedores
 */
class DevolucionProveedorNotificationService
{
    protected DatabaseNotificationService $dbNotificationService;
    protected DevolucionProveedorWebSocketService $wsService;

    public function __construct(
        DatabaseNotificationService $dbNotificationService,
        DevolucionProveedorWebSocketService $wsService
    ) {
        $this->dbNotificationService = $dbNotificationService;
        $this->wsService = $wsService;
    }

    /**
     * Notificar registro de devolución de proveedor
     */
    public function notifyRegistered(DevolucionProveedor $devolucion): bool
    {
        // 1. Obtener usuarios a notificar
        $users = $this->getUsersForRegistered($devolucion);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD
        $totalDevuelto = $devolucion->detalles->sum('cantidad_devuelta');
        $this->dbNotificationService->create($userIds, 'devolucion_proveedor.registrada', [
            'devolucion_id' => $devolucion->id,
            'proveedor_nombre' => $devolucion->prestamo->proveedor->nombre ?? 'Proveedor',
            'cliente_nombre' => $devolucion->prestamo->proveedor->nombre ?? 'Proveedor',
            'cliente_id' => $devolucion->prestamo->proveedor_id,
            'total_devuelto' => (int) $totalDevuelto,
            'fecha_devolucion' => $devolucion->fecha_devolucion?->format('d/m/Y'),
            'estado' => $devolucion->prestamo->estado,
        ], [
            'devolucion_proveedor_id' => $devolucion->id,
            'prestamo_proveedor_id' => $devolucion->prestamo_proveedor_id,
        ]);

        // 3. Enviar notificación WebSocket
        return $this->wsService->notifyRegistered($devolucion);
    }

    /**
     * Usuarios para notificar cuando se registra una devolución de proveedor
     * Criterio: Admins, Cajeros, Choferes involucrados, usuario que registró
     */
    private function getUsersForRegistered(DevolucionProveedor $devolucion): Collection
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
        if ($devolucion->prestamo && $devolucion->prestamo->chofer_id) {
            $chofer = User::where('id', $devolucion->prestamo->chofer_id)
                ->where('activo', true)
                ->first();
            if ($chofer) {
                $users->push($chofer);
            }
        }

        // 4. Chofer registrado en la devolución
        if ($devolucion->chofer_id && $devolucion->chofer_id !== $devolucion->prestamo->chofer_id) {
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
