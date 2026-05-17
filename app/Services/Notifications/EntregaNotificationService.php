<?php

namespace App\Services\Notifications;

use App\Models\Entrega;
use App\Models\Venta;
use App\Models\User;
use App\Services\WebSocket\EntregaWebSocketService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Servicio orquestador de notificaciones de entregas
 *
 * Este servicio coordina entre:
 * - Notificaciones en BD (DatabaseNotificationService)
 * - Notificaciones en tiempo real (EntregaWebSocketService)
 *
 * Responsabilidad única: Lógica de negocio de notificaciones de entregas
 */
class EntregaNotificationService
{
    protected DatabaseNotificationService $dbNotificationService;
    protected EntregaWebSocketService $wsService;

    public function __construct(
        DatabaseNotificationService $dbNotificationService,
        EntregaWebSocketService $wsService
    ) {
        $this->dbNotificationService = $dbNotificationService;
        $this->wsService = $wsService;
    }

    /**
     * ✅ NUEVO: Notificar creación de entrega
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyCreated(Entrega $entrega): bool
    {
        try {
            // 1. Obtener usuarios a notificar
            $users   = $this->getUsersForCreated($entrega);
            $userIds = $users->pluck('id')->toArray();

            if (empty($userIds)) {
                Log::warning('EntregaNotificationService::notifyCreated - No hay usuarios para notificar', [
                    'entrega_id' => $entrega->id,
                ]);
                return true;
            }

            // 2. Guardar en BD (persistente)
            $this->dbNotificationService->create($userIds, 'entrega.creada', [
                'entrega_numero'  => $entrega->numero_entrega,
                'entrega_id'      => $entrega->id,
                'chofer_nombre'   => $entrega->chofer?->name ?? 'Sin asignar',
                'chofer_id'       => $entrega->chofer_id,
                'vehiculo_placa'  => $entrega->vehiculo?->placa ?? 'Sin vehículo',
                'ventas_count'    => $entrega->ventas()->count() ?? 0,
                'estado'          => $entrega->estado,
            ], [
                'entrega_id' => $entrega->id,
            ]);

            // 3. Enviar notificación en tiempo real vía WebSocket
            $this->wsService->notifyCreated($entrega);

            Log::info('✅ EntregaNotificationService::notifyCreated enviado', [
                'entrega_id' => $entrega->id,
                'usuarios_notificados' => count($userIds),
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyCreated', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar cambio de estado de entrega
     * - Cuando el chofer marca la entrega como LISTO_PARA_ENTREGA, EN_TRANSITO, etc.
     * - Se notifica a clientes, preventistas, admins, cajeros y creador
     */
    public function notifyEstadoSincronizado(Entrega $entrega, string $estadoNuevo, ?string $estadoAnterior = null): bool
    {
        try {
            // 1. Obtener usuarios a notificar
            $users   = $this->getUsersForEstadoSincronizado($entrega);
            $userIds = $users->pluck('id')->toArray();

            if (empty($userIds)) {
                Log::warning('EntregaNotificationService::notifyEstadoSincronizado - No hay usuarios para notificar', [
                    'entrega_id' => $entrega->id,
                    'estado_nuevo' => $estadoNuevo,
                ]);
                return true;
            }

            // 2. Guardar en BD (persistente)
            $this->dbNotificationService->create($userIds, 'entrega.estado_cambio', [
                'entrega_numero'   => $entrega->numero_entrega,
                'entrega_id'       => $entrega->id,
                'estado_anterior'  => $estadoAnterior,
                'estado_nuevo'     => $estadoNuevo,
                'chofer_nombre'    => $entrega->chofer?->name ?? 'Sin asignar',
                'chofer_id'        => $entrega->chofer_id,
                'vehiculo_placa'   => $entrega->vehiculo?->placa ?? 'Sin vehículo',
                'cantidad_ventas'  => $entrega->ventas()->count() ?? 0,
                'monto_total'      => $entrega->ventas()->sum('total') ?? 0,
            ], [
                'entrega_id' => $entrega->id,
            ]);

            // 3. Enviar notificación en tiempo real vía WebSocket
            $this->wsService->notifyEstadoSincronizado($entrega, $estadoNuevo, $estadoAnterior);

            Log::info('✅ EntregaNotificationService::notifyEstadoSincronizado enviado', [
                'entrega_id' => $entrega->id,
                'estado_nuevo' => $estadoNuevo,
                'usuarios_notificados' => count($userIds),
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyEstadoSincronizado', [
                'entrega_id' => $entrega->id,
                'estado_nuevo' => $estadoNuevo,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar asignación de chofer a entrega (alias del anterior para consistencia)
     * - Se notifica al chofer que fue asignado
     * - Se notifica a admins y creador
     */
    public function notifyChoferAsignado(Entrega $entrega): bool
    {
        try {
            // 1. Obtener usuarios a notificar
            $users   = $this->getUsersForChoferAsignado($entrega);
            $userIds = $users->pluck('id')->toArray();

            if (empty($userIds)) {
                Log::warning('EntregaNotificationService::notifyChoferAsignado - No hay usuarios para notificar', [
                    'entrega_id' => $entrega->id,
                ]);
                return true;
            }

            // 2. Guardar en BD (persistente)
            $this->dbNotificationService->create($userIds, 'entrega.chofer_asignado', [
                'entrega_numero'  => $entrega->numero_entrega,
                'entrega_id'      => $entrega->id,
                'chofer_nombre'   => $entrega->chofer?->name ?? 'Sin asignar',
                'chofer_id'       => $entrega->chofer_id,
                'vehiculo_placa'  => $entrega->vehiculo?->placa ?? 'Sin vehículo',
                'ventas_count'    => $entrega->ventas()->count() ?? 0,
                'peso_kg'         => $entrega->peso_total ?? 0,
                'volumen_m3'      => $entrega->volumen_total ?? 0,
            ], [
                'entrega_id' => $entrega->id,
            ]);

            // 3. Enviar notificación en tiempo real vía WebSocket
            $this->wsService->notifyChoferAsignado($entrega);

            Log::info('✅ EntregaNotificationService::notifyChoferAsignado enviado', [
                'entrega_id' => $entrega->id,
                'chofer_id' => $entrega->chofer_id,
                'usuarios_notificados' => count($userIds),
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyChoferAsignado', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ ANTERIOR: Notificar al chofer que le fue asignada una entrega (mantener para compatibilidad)
     */
    public function notifyChoferEntregaAsignada(Entrega $entrega): bool
    {
        return $this->notifyChoferAsignado($entrega);
    }

    /**
     * Notificar que una venta fue asignada a una entrega
     * Notifica al cliente y al preventista
     */
    public function notifyVentaAsignada(Venta $venta, Entrega $entrega): bool
    {
        try {
            // 1. Obtener usuarios a notificar
            $users = $this->getUsersForVentaAsignada($venta);
            $userIds = $users->pluck('id')->toArray();

            Log::info('📢 [EntregaNotificationService::notifyVentaAsignada] Notificando usuarios', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'usuarios_count' => count($userIds),
                'usuarios_ids' => $userIds,
            ]);

            // 2. Guardar en BD para usuarios relevantes
            if (!empty($userIds)) {
                $this->dbNotificationService->create($userIds, 'entrega.venta_asignada', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'entrega_id' => $entrega->id,
                    'entrega_numero' => $entrega->numero_entrega,
                    'cliente_nombre' => $venta->cliente?->nombre ?? 'Cliente',
                    'cliente_id' => $venta->cliente_id,
                    'total' => (float) $venta->total,
                    'chofer_nombre' => $entrega->chofer?->name ?? 'Chofer asignado',
                    'vehiculo_placa' => $entrega->vehiculo?->placa ?? 'Vehículo',
                ], [
                    'venta_id' => $venta->id,
                    'entrega_id' => $entrega->id,
                ]);
            }

            // 3. Enviar notificación en tiempo real vía WebSocket
            return $this->wsService->notifyVentaAsignada($venta, $entrega);

        } catch (\Exception $e) {
            Log::error('❌ [EntregaNotificationService::notifyVentaAsignada] Error', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    // ========================================
    // MÉTODOS PRIVADOS - LÓGICA DE USUARIOS
    // ========================================

    /**
     * ✅ NUEVO: Usuarios para notificar cuando se CREA una entrega
     * Criterio: Admins, Managers, Logística, Creador y Clientes de las ventas
     */
    private function getUsersForCreated(Entrega $entrega): Collection
    {
        $users = collect();

        try {
            // 1. Admins, Managers, Logística (staff de entregas)
            $staffUsers = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['admin', 'manager', 'logistica', 'Admin', 'Manager', 'Logistica']);
            })->where('activo', true)->get();
            $users = $users->merge($staffUsers);

            // 2. Usuario que creó la entrega (creador)
            if ($entrega->created_by) {
                $creador = User::where('id', $entrega->created_by)
                    ->where('activo', true)
                    ->first();
                if ($creador) {
                    $users->push($creador);
                }
            }

            // 3. Clientes de las ventas en la entrega
            $clientes = $entrega->ventas()
                ->whereHas('cliente', function ($q) {
                    $q->whereNotNull('user_id');
                })
                ->get()
                ->pluck('cliente.user_id')
                ->unique()
                ->filter();

            foreach ($clientes as $clienteUserId) {
                $clienteUser = User::where('id', $clienteUserId)
                    ->where('activo', true)
                    ->first();
                if ($clienteUser) {
                    $users->push($clienteUser);
                }
            }

        } catch (\Exception $e) {
            Log::error('Error en getUsersForCreated', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $users->unique('id');
    }

    /**
     * ✅ NUEVO: Usuarios para notificar cuando CAMBIA ESTADO de entrega
     * Criterio:
     * - Clientes de las ventas en la entrega
     * - Preventistas asociados a las ventas
     * - Admins
     * - Cajeros
     * - Creador de la entrega
     */
    private function getUsersForEstadoSincronizado(Entrega $entrega): Collection
    {
        $users = collect();

        try {
            // 1. Clientes de las ventas
            $ventasConCliente = $entrega->ventas()
                ->with('cliente')
                ->get();

            foreach ($ventasConCliente as $venta) {
                if ($venta->cliente && $venta->cliente->user_id) {
                    $clienteUser = User::where('id', $venta->cliente->user_id)
                        ->where('activo', true)
                        ->first();
                    if ($clienteUser) {
                        $users->push($clienteUser);
                    }
                }

                // 2. Preventistas asociados a las ventas
                if ($venta->preventista_id) {
                    $preventista = User::where('id', $venta->preventista_id)
                        ->where('activo', true)
                        ->first();
                    if ($preventista) {
                        $users->push($preventista);
                    }
                }
            }

            // 3. Admins y Cajeros
            $adminsCajeros = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['admin', 'cajero', 'Admin', 'Cajero']);
            })->where('activo', true)->get();
            $users = $users->merge($adminsCajeros);

            // 4. Creador de la entrega
            if ($entrega->created_by) {
                $creador = User::where('id', $entrega->created_by)
                    ->where('activo', true)
                    ->first();
                if ($creador) {
                    $users->push($creador);
                }
            }

        } catch (\Exception $e) {
            Log::error('Error en getUsersForEstadoSincronizado', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $users->unique('id');
    }

    /**
     * ✅ NUEVO: Usuarios para notificar cuando se ASIGNA CHOFER
     * Criterio:
     * - El chofer asignado
     * - Admins
     * - Creador de la entrega
     */
    private function getUsersForChoferAsignado(Entrega $entrega): Collection
    {
        $users = collect();

        try {
            // 1. Chofer asignado (user_id del chofer)
            if ($entrega->chofer_id) {
                $chofer = User::where('id', $entrega->chofer_id)
                    ->where('activo', true)
                    ->first();
                if ($chofer) {
                    $users->push($chofer);
                }
            }

            // 2. Admins
            $admins = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['admin', 'Admin']);
            })->where('activo', true)->get();
            $users = $users->merge($admins);

            // 3. Creador de la entrega
            if ($entrega->created_by) {
                $creador = User::where('id', $entrega->created_by)
                    ->where('activo', true)
                    ->first();
                if ($creador) {
                    $users->push($creador);
                }
            }

        } catch (\Exception $e) {
            Log::error('Error en getUsersForChoferAsignado', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $users->unique('id');
    }

    /**
     * ✅ ANTERIOR: Usuarios para notificar cuando una venta es asignada a entrega
     * Criterio: Cliente propietario, Preventista asignado, Admins, Managers
     */
    private function getUsersForVentaAsignada(Venta $venta): Collection
    {
        $users = collect();

        try {
            // 1. Admins y managers (supervisión)
            $staffUsers = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['admin', 'manager', 'Admin', 'Manager']);
            })->where('activo', true)->get();
            $users = $users->merge($staffUsers);

            // 2. Preventista asignado a la venta
            if ($venta->preventista_id) {
                $preventista = User::where('id', $venta->preventista_id)
                    ->where('activo', true)
                    ->first();
                if ($preventista) {
                    $users->push($preventista);
                }
            }

            // 3. Cliente propietario de la venta (si tiene usuario asociado)
            if ($venta->cliente && $venta->cliente->user_id) {
                $clienteUser = User::where('id', $venta->cliente->user_id)
                    ->where('activo', true)
                    ->first();
                if ($clienteUser) {
                    $users->push($clienteUser);
                }
            }

        } catch (\Exception $e) {
            Log::error('Error en getUsersForVentaAsignada', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $users->unique('id');
    }
}
