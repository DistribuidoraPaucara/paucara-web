<?php
namespace App\Services\Notifications;

use App\Models\PrestamoCliente;
use App\Models\PrestamoEvento;
use App\Models\PrestamoProveedor;
use App\Services\WebSocket\PrestamoWebSocketService;

/**
 * Servicio orquestador de notificaciones de préstamos
 *
 * Este servicio coordina entre:
 * - Notificaciones en BD (DatabaseNotificationService)
 * - Notificaciones en tiempo real (PrestamoWebSocketService)
 *
 * Responsabilidad única: Lógica de negocio de notificaciones de préstamos
 */
class PrestamoNotificationService
{
    protected DatabaseNotificationService $dbNotificationService;
    protected PrestamoWebSocketService $wsService;

    public function __construct(
        DatabaseNotificationService $dbNotificationService,
        PrestamoWebSocketService $wsService
    ) {
        $this->dbNotificationService = $dbNotificationService;
        $this->wsService             = $wsService;
    }

    /**
     * Notificar creación de préstamo a cliente
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyPrestamoClienteCreated(PrestamoCliente $prestamo): bool
    {
        // 1. Obtener usuarios a notificar
        $users   = $this->getUsersForPrestamoCliente($prestamo);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD (persistente)
        $this->dbNotificationService->create($userIds, 'prestamo.cliente.creado', [
            'prestamo_id'     => $prestamo->id,
            'cliente_id'      => $prestamo->cliente_id,
            'cliente_nombre'  => $prestamo->cliente->nombre ?? 'Cliente',
            'cantidad'        => $prestamo->cantidad,
            'detalles_count'  => $prestamo->detalles->count(),
            'estado'          => $prestamo->estado,
            'creador_nombre'  => $prestamo->creador?->name ?? 'Sistema',
        ], [
            'prestamo_id' => $prestamo->id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyPrestamoClienteCreated($prestamo);
    }

    /**
     * Notificar creación de préstamo a evento
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyPrestamoEventoCreated(PrestamoEvento $prestamo): bool
    {
        // 1. Obtener usuarios a notificar
        $users   = $this->getUsersForPrestamoEvento($prestamo);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD (persistente)
        $this->dbNotificationService->create($userIds, 'prestamo.evento.creado', [
            'prestamo_id'     => $prestamo->id,
            'nombre_evento'   => $prestamo->nombre_evento,
            'cantidad'        => $prestamo->cantidad,
            'detalles_count'  => $prestamo->detalles->count(),
            'estado'          => $prestamo->estado,
            'creador_nombre'  => $prestamo->creador?->name ?? 'Sistema',
        ], [
            'prestamo_id' => $prestamo->id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyPrestamoEventoCreated($prestamo);
    }

    /**
     * Obtener usuarios a notificar para préstamo a cliente
     * - Usuario creador
     * - Admins
     * - Cajeros
     * - Cliente (si tiene user_id)
     */
    private function getUsersForPrestamoCliente(PrestamoCliente $prestamo)
    {
        $userIds = [];

        // Usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // Buscar todos los admins y cajeros
        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        // Cliente (si tiene user_id)
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // Obtener usuarios completos
        return \App\Models\User::whereIn('id', array_unique(array_filter($userIds)))->get();
    }

    /**
     * Obtener usuarios a notificar para préstamo a evento
     * - Usuario creador
     * - Admins
     * - Cajeros
     * - Cliente (si tiene user_id)
     */
    private function getUsersForPrestamoEvento(PrestamoEvento $prestamo)
    {
        $userIds = [];

        // Usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // Buscar todos los admins y cajeros
        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        // Cliente (si tiene user_id)
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // Obtener usuarios completos
        return \App\Models\User::whereIn('id', array_unique(array_filter($userIds)))->get();
    }

    /**
     * Notificar creación de préstamo a proveedor
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyPrestamoProveedorCreated(PrestamoProveedor $prestamo): bool
    {
        // 1. Obtener usuarios a notificar
        $users   = $this->getUsersForPrestamoProveedor($prestamo);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD (persistente)
        $this->dbNotificationService->create($userIds, 'prestamo.proveedor.creado', [
            'prestamo_id'     => $prestamo->id,
            'proveedor_id'    => $prestamo->proveedor_id,
            'proveedor_nombre' => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'cantidad'        => $prestamo->detalles->count(),
            'estado'          => $prestamo->estado,
            'creador_nombre'  => $prestamo->creador?->name ?? 'Sistema',
        ], [
            'prestamo_id' => $prestamo->id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyPrestamoProveedorCreated($prestamo);
    }

    /**
     * Obtener usuarios a notificar para préstamo a proveedor
     * - Usuario creador
     * - Admins
     * - Cajeros
     * - Proveedor (si tiene user_id)
     */
    private function getUsersForPrestamoProveedor(PrestamoProveedor $prestamo)
    {
        $userIds = [];

        // Usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // Buscar todos los admins y cajeros
        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        // Proveedor (si tiene user_id)
        if ($prestamo->proveedor?->user_id) {
            $userIds[] = $prestamo->proveedor->user_id;
        }

        // Obtener usuarios completos
        return \App\Models\User::whereIn('id', array_unique(array_filter($userIds)))->get();
    }
}
