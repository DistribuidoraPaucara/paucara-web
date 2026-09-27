<?php
namespace App\Services\Notifications;

use App\Models\PrestamoCliente;
use App\Models\PrestamoEvento;
use App\Models\PrestamoProveedor;
use App\Models\DevolucionPrestamo;
use App\Models\DevolucionPrestamoEvento;
use App\Models\DevolucionPrestamoProveedor;
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
     * - Chofer (si está asignado)
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

        // Chofer asignado al préstamo
        if ($prestamo->chofer_id) {
            $userIds[] = $prestamo->chofer_id;
        }

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
     * - Chofer (si está asignado)
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

        // Chofer asignado al préstamo
        if ($prestamo->chofer_id) {
            $userIds[] = $prestamo->chofer_id;
        }

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

    /**
     * ✅ NUEVO: Notificar anulación de préstamo a cliente
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyPrestamoClienteAnulado(PrestamoCliente $prestamo, ?string $razonAnulacion = null): bool
    {
        // 1. Obtener usuarios a notificar
        $users   = $this->getUsersForPrestamoCliente($prestamo);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD (persistente)
        $this->dbNotificationService->create($userIds, 'prestamo.cliente.anulado', [
            'prestamo_id'       => $prestamo->id,
            'cliente_id'        => $prestamo->cliente_id,
            'cliente_nombre'    => $prestamo->cliente->nombre ?? 'Cliente',
            'cantidad'          => $prestamo->cantidad,
            'detalles_count'    => $prestamo->detalles->count(),
            'estado'            => $prestamo->estado,
            'razon_anulacion'   => $razonAnulacion,
            'creador_nombre'    => $prestamo->creador?->name ?? 'Sistema',
            'anulador_id'       => auth()->id(),
            'anulador_nombre'   => auth()->user()?->name ?? 'Sistema',
        ], [
            'prestamo_id' => $prestamo->id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyPrestamoClienteAnulado($prestamo, $razonAnulacion);
    }

    /**
     * ✅ NUEVO: Notificar anulación de préstamo a evento
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyPrestamoEventoAnulado(PrestamoEvento $prestamo, ?string $razonAnulacion = null): bool
    {
        // 1. Obtener usuarios a notificar
        $users   = $this->getUsersForPrestamoEvento($prestamo);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD (persistente)
        $this->dbNotificationService->create($userIds, 'prestamo.evento.anulado', [
            'prestamo_id'       => $prestamo->id,
            'nombre_evento'     => $prestamo->nombre_evento,
            'cantidad'          => $prestamo->cantidad,
            'detalles_count'    => $prestamo->detalles->count(),
            'estado'            => $prestamo->estado,
            'razon_anulacion'   => $razonAnulacion,
            'creador_nombre'    => $prestamo->creador?->name ?? 'Sistema',
            'anulador_id'       => auth()->id(),
            'anulador_nombre'   => auth()->user()?->name ?? 'Sistema',
        ], [
            'prestamo_id' => $prestamo->id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyPrestamoEventoAnulado($prestamo, $razonAnulacion);
    }

    /**
     * ✅ NUEVO: Notificar anulación de préstamo a proveedor
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyPrestamoProveedorAnulado(PrestamoProveedor $prestamo, ?string $razonAnulacion = null): bool
    {
        // 1. Obtener usuarios a notificar
        $users   = $this->getUsersForPrestamoProveedor($prestamo);
        $userIds = $users->pluck('id')->toArray();

        // 2. Guardar en BD (persistente)
        $this->dbNotificationService->create($userIds, 'prestamo.proveedor.anulado', [
            'prestamo_id'       => $prestamo->id,
            'proveedor_id'      => $prestamo->proveedor_id,
            'proveedor_nombre'  => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'cantidad'          => $prestamo->cantidad,
            'detalles_count'    => $prestamo->detalles->count(),
            'estado'            => $prestamo->estado,
            'razon_anulacion'   => $razonAnulacion,
            'creador_nombre'    => $prestamo->creador?->name ?? 'Sistema',
            'anulador_id'       => auth()->id(),
            'anulador_nombre'   => auth()->user()?->name ?? 'Sistema',
        ], [
            'prestamo_id' => $prestamo->id,
        ]);

        // 3. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyPrestamoProveedorAnulado($prestamo, $razonAnulacion);
    }

    /**
     * ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a cliente
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyDevolucionClienteRegistrada(DevolucionPrestamo $devolucion): bool
    {
        // 1. Obtener usuarios a notificar (admins, cajeros, creador del préstamo)
        $userIds = [];
        $prestamo = $devolucion->prestamoCliente;

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        // 2. Guardar en BD
        $this->dbNotificationService->create($userIds, 'devolucion.cliente.registrada', [
            'devolucion_id'         => $devolucion->id,
            'prestamo_id'           => $prestamo->id,
            'cliente_nombre'        => $prestamo->cliente?->nombre ?? 'Cliente',
            'cantidad_devuelto'     => $devolucion->cantidad_total ?? $devolucion->detalles->count(),
            'registrado_por'        => $devolucion->registrado_por_usuario_id,
            'registrado_por_nombre' => $devolucion->registradoPor?->name ?? 'Sistema',
        ], [
            'devolucion_id' => $devolucion->id,
        ]);

        // 3. Enviar notificación WebSocket
        return $this->wsService->notifyDevolucionClienteRegistrada($devolucion);
    }

    /**
     * ✅ NUEVO: Notificar cuando se anula una devolución de préstamo a cliente
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyDevolucionClienteAnulada(DevolucionPrestamo $devolucion, ?string $razonAnulacion = null): bool
    {
        // 1. Obtener usuarios a notificar
        $userIds = [];
        $prestamo = $devolucion->prestamoCliente;

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        // 2. Guardar en BD
        $this->dbNotificationService->create($userIds, 'devolucion.cliente.anulada', [
            'devolucion_id'         => $devolucion->id,
            'prestamo_id'           => $prestamo->id,
            'cliente_nombre'        => $prestamo->cliente?->nombre ?? 'Cliente',
            'cantidad_devuelto'     => $devolucion->cantidad_total ?? $devolucion->detalles->count(),
            'razon_anulacion'       => $razonAnulacion,
            'anulado_por_usuario_id' => auth()->id(),
            'anulado_por_nombre'    => auth()->user()?->name ?? 'Sistema',
        ], [
            'devolucion_id' => $devolucion->id,
        ]);

        // 3. Enviar notificación WebSocket
        return $this->wsService->notifyDevolucionClienteAnulada($devolucion, $razonAnulacion);
    }

    /**
     * ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a evento
     */
    public function notifyDevolucionEventoRegistrada(DevolucionPrestamoEvento $devolucion): bool
    {
        $userIds = [];
        $prestamo = $devolucion->prestamoEvento;

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        $this->dbNotificationService->create($userIds, 'devolucion.evento.registrada', [
            'devolucion_id'         => $devolucion->id,
            'prestamo_id'           => $prestamo->id,
            'nombre_evento'         => $prestamo->nombre_evento,
            'cantidad_devuelto'     => $devolucion->cantidad_total ?? $devolucion->detalles->count(),
            'registrado_por_nombre' => $devolucion->registradoPor?->name ?? 'Sistema',
        ], [
            'devolucion_id' => $devolucion->id,
        ]);

        return $this->wsService->notifyDevolucionEventoRegistrada($devolucion);
    }

    /**
     * ✅ NUEVO: Notificar cuando se anula una devolución de préstamo a evento
     */
    public function notifyDevolucionEventoAnulada(DevolucionPrestamoEvento $devolucion, ?string $razonAnulacion = null): bool
    {
        $userIds = [];
        $prestamo = $devolucion->prestamoEvento;

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        $this->dbNotificationService->create($userIds, 'devolucion.evento.anulada', [
            'devolucion_id'         => $devolucion->id,
            'prestamo_id'           => $prestamo->id,
            'nombre_evento'         => $prestamo->nombre_evento,
            'cantidad_devuelto'     => $devolucion->cantidad_total ?? $devolucion->detalles->count(),
            'razon_anulacion'       => $razonAnulacion,
            'anulado_por_nombre'    => auth()->user()?->name ?? 'Sistema',
        ], [
            'devolucion_id' => $devolucion->id,
        ]);

        return $this->wsService->notifyDevolucionEventoAnulada($devolucion, $razonAnulacion);
    }

    /**
     * ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a proveedor
     */
    public function notifyDevolucionProveedorRegistrada(DevolucionPrestamoProveedor $devolucion): bool
    {
        $userIds = [];
        $prestamo = $devolucion->prestamoProveedor;

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        $this->dbNotificationService->create($userIds, 'devolucion.proveedor.registrada', [
            'devolucion_id'         => $devolucion->id,
            'prestamo_id'           => $prestamo->id,
            'proveedor_nombre'      => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'cantidad_devuelto'     => $devolucion->cantidad_total ?? $devolucion->detalles->count(),
            'registrado_por_nombre' => $devolucion->registradoPor?->name ?? 'Sistema',
        ], [
            'devolucion_id' => $devolucion->id,
        ]);

        return $this->wsService->notifyDevolucionProveedorRegistrada($devolucion);
    }

    /**
     * ✅ NUEVO: Notificar cuando se anula una devolución de préstamo a proveedor
     */
    public function notifyDevolucionProveedorAnulada(DevolucionPrestamoProveedor $devolucion, ?string $razonAnulacion = null): bool
    {
        $userIds = [];
        $prestamo = $devolucion->prestamoProveedor;

        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        $staffUsers = \DB::table('users')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['admin', 'Admin', 'ADMIN', 'cajero', 'Cajero', 'CAJERO'])
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->distinct()
            ->pluck('users.id');

        $userIds = array_merge($userIds, $staffUsers->toArray());

        $this->dbNotificationService->create($userIds, 'devolucion.proveedor.anulada', [
            'devolucion_id'         => $devolucion->id,
            'prestamo_id'           => $prestamo->id,
            'proveedor_nombre'      => $prestamo->proveedor?->nombre ?? 'Proveedor',
            'cantidad_devuelto'     => $devolucion->cantidad_total ?? $devolucion->detalles->count(),
            'razon_anulacion'       => $razonAnulacion,
            'anulado_por_nombre'    => auth()->user()?->name ?? 'Sistema',
        ], [
            'devolucion_id' => $devolucion->id,
        ]);

        return $this->wsService->notifyDevolucionProveedorAnulada($devolucion, $razonAnulacion);
    }
}
