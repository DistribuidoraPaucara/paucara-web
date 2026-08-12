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

    /**
     * ✅ NUEVO: Notificar que una venta fue confirmada como entregada por el chofer
     * - Guarda en BD para todos los usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     * - Notifica a cliente, preventista, admins y cajeros
     */
    public function notifyVentaConfirmadaEntregada(
        Venta $venta,
        Entrega $entrega,
        $confirmacion,
        string $tipoEntrega = 'COMPLETA',
        ?string $tipoNovedad = null,
        ?string $estadoPago = 'PAGADO',
        ?float $totalRecibido = 0
    ): bool {
        try {
            // 1. Obtener usuarios a notificar
            $users = $this->getUsersForVentaConfirmadaEntregada($venta, $entrega);
            $userIds = $users->pluck('id')->toArray();

            Log::info('📢 EntregaNotificationService::notifyVentaConfirmadaEntregada - Usuarios a notificar', [
                'venta_id' => $venta->id,
                'cantidad_usuarios' => count($userIds),
                'usuarios' => $userIds,
            ]);

            // Preparar el mensaje según tipo de entrega
            $mensaje = $this->generarMensajeEntregaConfirmada($venta, $entrega, $tipoEntrega, $tipoNovedad, $estadoPago, $totalRecibido);

            // 2. Guardar en BD (persistente) - SOLO información logística, sin pago
            $this->dbNotificationService->create($userIds, 'venta.confirmada.entregada', [
                'venta_numero' => $venta->numero,
                'venta_id' => $venta->id,
                'cliente_nombre' => $venta->cliente?->nombre ?? 'Cliente',
                'cliente_id' => $venta->cliente_id,
                'entrega_numero' => $entrega->numero_entrega,
                'entrega_id' => $entrega->id,
                'chofer_nombre' => $entrega->chofer?->name ?? 'Chofer',
                'total' => (float) $venta->total,
                'tipo_confirmacion' => $tipoEntrega,  // COMPLETA, RECHAZADO, DEVOLUCION_PARCIAL, CLIENTE_CERRADO, NO_CONTACTADO
                'tipo_novedad' => $tipoNovedad,       // Para referencia interna si hay
                'mensaje' => $mensaje,
                'preventista_id' => $venta->preventista_id,
            ], [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
            ]);

            Log::info('✅ Notificación guardada en BD', [
                'venta_id' => $venta->id,
                'cantidad_notificaciones' => count($userIds),
            ]);

            // 3. Enviar notificación en tiempo real vía WebSocket
            $result = $this->wsService->notifyVentaEntregada(
                venta: $venta,
                entrega: $entrega,
                cliente: $venta->cliente,
                tipoEntrega: $tipoEntrega,
                tipoNovedad: $tipoNovedad,
                confirmacion: $confirmacion,
                estadoPago: $estadoPago,
                totalRecibido: $totalRecibido
            );

            Log::info('✅ Notificación WebSocket enviada', [
                'venta_id' => $venta->id,
                'resultado' => $result,
            ]);

            return $result;

        } catch (\Exception $e) {
            Log::error('❌ Error en notifyVentaConfirmadaEntregada', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Obtener usuarios para notificar cuando se CONFIRMA una venta como ENTREGADA
     *
     * Usuarios clave:
     * - Cliente: Quiere saber que su venta fue entregada
     * - Preventista: Quiere saber que su venta fue entregada
     * - Admins/Managers: Supervisión
     * - Cajeros: Control de pago
     */
    private function getUsersForVentaConfirmadaEntregada(Venta $venta, Entrega $entrega): Collection
    {
        $users = collect();

        try {
            // 1. Cliente propietario (es el más importante)
            if ($venta->cliente && $venta->cliente->user_id) {
                $clienteUser = User::where('id', $venta->cliente->user_id)
                    ->where('activo', true)
                    ->first();
                if ($clienteUser) {
                    $users->push($clienteUser);
                    Log::info('👤 Cliente agregado a notificación', [
                        'cliente_id' => $venta->cliente->id,
                        'user_id' => $clienteUser->id,
                    ]);
                }
            }

            // 2. Preventista que creó la venta (si existe)
            if ($venta->preventista_id) {
                $preventista = User::where('id', $venta->preventista_id)
                    ->where('activo', true)
                    ->first();
                if ($preventista) {
                    $users->push($preventista);
                    Log::info('📊 Preventista agregado a notificación', [
                        'preventista_id' => $venta->preventista_id,
                    ]);
                }
            }

            // 3. Admins y Managers (supervisión de entregas)
            $staffUsers = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['admin', 'manager', 'Admin', 'Manager', 'Gestor de Logística', 'gestor de logística']);
            })->where('activo', true)->get();

            if ($staffUsers->count() > 0) {
                $users = $users->merge($staffUsers);
                Log::info('👨‍💼 Admins/Managers agregados a notificación', [
                    'cantidad' => $staffUsers->count(),
                ]);
            }

            // 4. Cajeros (control de pago)
            $cajeros = User::whereHas('roles', function ($q) {
                $q->whereIn('name', ['cajero', 'Cajero']);
            })->where('activo', true)->get();

            if ($cajeros->count() > 0) {
                $users = $users->merge($cajeros);
                Log::info('💳 Cajeros agregados a notificación', [
                    'cantidad' => $cajeros->count(),
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Error en getUsersForVentaConfirmadaEntregada', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $users->unique('id');
    }

    /**
     * ✅ ACTUALIZADO: Generar mensaje personalizado basado SOLO en tipo_confirmacion
     * Sin información de pago - enfocado en estado logístico
     */
    private function generarMensajeEntregaConfirmada(
        Venta $venta,
        Entrega $entrega,
        string $tipoEntrega,
        ?string $tipoNovedad,
        ?string $estadoPago,
        ?float $totalRecibido
    ): string {
        $clienteNombre = $venta->cliente?->nombre ?? 'Cliente';
        $choferNombre = $entrega->chofer?->name ?? 'Chofer';
        $ventaNumero = $venta->numero ?? 'N/A';

        // Mapeo directo de tipo_confirmacion (que viene en $tipoEntrega)
        // COMPLETA, RECHAZADO, DEVOLUCION_PARCIAL, CLIENTE_CERRADO, NO_CONTACTADO

        return match ($tipoEntrega) {
            'COMPLETA' => "✅ Tu pedido #{$ventaNumero} fue entregado correctamente. Chofer: {$choferNombre}",

            'RECHAZADO' => "❌ Tu pedido #{$ventaNumero} fue rechazado. Por favor contacta con nuestro equipo de logística.",

            'DEVOLUCION_PARCIAL' => "⚠️ Tu pedido #{$ventaNumero} tiene una devolución parcial de productos. Nos contactaremos pronto.",

            'CLIENTE_CERRADO' => "🏪 Tu local estaba cerrado al momento de la entrega de pedido #{$ventaNumero}. Reintentar pronto.",

            'NO_CONTACTADO' => "📞 No pudimos contactarte para la entrega de pedido #{$ventaNumero}. Nos contactaremos pronto.",

            default => "ℹ️ Actualización en tu pedido #{$ventaNumero}. Por favor consulta el estado en la app."
        };
    }

    /**
     * ✅ NUEVO: Notificar cuando entrega está lista para entrega
     * Notifica al usuario creador de la entrega
     */
    public function notifyEntregaListoParaEntrega(Entrega $entrega): bool
    {
        try {
            $usuario = $entrega->creador; // Usuario que creó la entrega

            if (!$usuario) {
                Log::warning('EntregaNotificationService::notifyEntregaListoParaEntrega - No hay creador', [
                    'entrega_id' => $entrega->id,
                ]);
                return true;
            }

            $choferNombre = $entrega->chofer?->name ?? 'Asignado';
            $mensaje = "📤 La entrega {$entrega->numero_entrega} está lista para salir. Chofer: {$choferNombre}";

            // Guardar en BD
            $this->dbNotificationService->create([$usuario->id], 'entrega.listo_para_entrega', [
                'entrega_numero' => $entrega->numero_entrega,
                'entrega_id' => $entrega->id,
                'chofer_nombre' => $choferNombre,
                'chofer_id' => $entrega->chofer_id,
                'vehiculo_placa' => $entrega->vehiculo?->placa ?? 'Vehículo',
                'ventas_count' => $entrega->ventas()->count() ?? 0,
                'mensaje' => $mensaje,
            ], [
                'entrega_id' => $entrega->id,
            ]);

            // Enviar WebSocket
            $this->wsService->notifyEntregaListoParaEntrega($entrega);

            Log::info('✅ EntregaNotificationService::notifyEntregaListoParaEntrega enviado', [
                'entrega_id' => $entrega->id,
                'creador_id' => $usuario->id,
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyEntregaListoParaEntrega', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar al cliente cuando su venta/entrega está lista
     * Notifica al cliente propietario de la venta
     */
    public function notifyClienteEntregaListo(Venta $venta, Entrega $entrega): bool
    {
        try {
            $cliente = $venta->cliente;

            if (!$cliente || !$cliente->user_id) {
                Log::warning('EntregaNotificationService::notifyClienteEntregaListo - Cliente sin user_id', [
                    'venta_id' => $venta->id,
                    'cliente_id' => $venta->cliente_id,
                ]);
                return true;
            }

            // Validar que el user_id existe en tabla users
            $userExists = User::where('id', $cliente->user_id)->exists();
            if (!$userExists) {
                Log::warning('notifyClienteEntregaListo: user_id no existe en tabla users', [
                    'venta_id' => $venta->id,
                    'cliente_id' => $venta->cliente_id,
                    'user_id_cliente' => $cliente->user_id,
                ]);
                return true;
            }

            $vehiculoPlaca = $entrega->vehiculo?->placa ?? 'Vehículo';
            $choferNombre = $entrega->chofer?->name ?? 'Chofer';
            $mensaje = "📤 Tu pedido #{$venta->numero} está en el camión y será entregado pronto. Vehículo: {$vehiculoPlaca}";

            // Guardar en BD
            $this->dbNotificationService->create([$cliente->user_id], 'cliente.entrega_listo', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'entrega_id' => $entrega->id,
                'entrega_numero' => $entrega->numero_entrega,
                'cliente_nombre' => $cliente->nombre,
                'cliente_id' => $cliente->id,
                'chofer_nombre' => $choferNombre,
                'vehiculo_placa' => $vehiculoPlaca,
                'total' => (float) $venta->total,
                'mensaje' => $mensaje,
            ], [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
            ]);

            // Enviar WebSocket
            $this->wsService->notifyClienteEntregaListo($venta, $entrega);

            Log::info('✅ EntregaNotificationService::notifyClienteEntregaListo enviado', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'cliente_id' => $cliente->id,
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyClienteEntregaListo', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar que una venta fue confirmada como entregada
     * Notifica al creador de la entrega (logística/admin)
     */
    public function notifyVentaConfirmadaEntrega(Venta $venta, Entrega $entrega, $confirmacion): bool
    {
        try {
            $usuario = $entrega->creador;

            if (!$usuario) {
                Log::warning('EntregaNotificationService::notifyVentaConfirmadaEntrega - No hay creador', [
                    'entrega_id' => $entrega->id,
                    'venta_id' => $venta->id,
                ]);
                return true;
            }

            $tipoConfirmacion = $confirmacion->tipo_confirmacion;
            $clienteNombre = $venta->cliente?->nombre ?? 'Cliente';
            $ventaNumero = $venta->numero;

            $mensaje = match ($tipoConfirmacion) {
                'COMPLETA' => "✅ Venta {$ventaNumero} entregada a {$clienteNombre}",
                'RECHAZADO' => "❌ Venta {$ventaNumero} fue rechazada por {$clienteNombre}",
                'DEVOLUCION_PARCIAL' => "⚠️ Venta {$ventaNumero} devolución parcial de {$clienteNombre}",
                'CLIENTE_CERRADO' => "🏪 Venta {$ventaNumero} - local cerrado en {$clienteNombre}",
                'NO_CONTACTADO' => "📞 Venta {$ventaNumero} - no se contactó a {$clienteNombre}",
                default => "Venta {$ventaNumero} confirmada"
            };

            // Guardar en BD
            $this->dbNotificationService->create([$usuario->id], 'venta.confirmada.entrega', [
                'venta_numero' => $ventaNumero,
                'venta_id' => $venta->id,
                'cliente_nombre' => $clienteNombre,
                'cliente_id' => $venta->cliente_id,
                'entrega_numero' => $entrega->numero_entrega,
                'entrega_id' => $entrega->id,
                'tipo_confirmacion' => $tipoConfirmacion,
                'mensaje' => $mensaje,
            ], [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
            ]);

            // Enviar WebSocket
            $this->wsService->notifyVentaConfirmadaEntrega($venta, $entrega, $confirmacion);

            Log::info('✅ EntregaNotificationService::notifyVentaConfirmadaEntrega enviado', [
                'entrega_id' => $entrega->id,
                'venta_id' => $venta->id,
                'tipo_confirmacion' => $tipoConfirmacion,
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyVentaConfirmadaEntrega', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar al cliente que su venta fue confirmada como entregada
     * Envía solo el tipo_confirmacion sin información de pago
     */
    public function notifyClienteVentaConfirmada(Venta $venta, Entrega $entrega, $confirmacion): bool
    {
        try {
            $cliente = $venta->cliente;

            if (!$cliente || !$cliente->user_id) {
                Log::warning('EntregaNotificationService::notifyClienteVentaConfirmada - Cliente sin user_id', [
                    'venta_id' => $venta->id,
                    'cliente_id' => $venta->cliente_id,
                ]);
                return true;
            }

            $tipoConfirmacion = $confirmacion->tipo_confirmacion;
            $ventaNumero = $venta->numero;
            $choferNombre = $entrega->chofer?->name ?? 'Chofer';

            $mensaje = match ($tipoConfirmacion) {
                'COMPLETA' => "✅ Tu pedido #{$ventaNumero} fue entregado correctamente.",
                'RECHAZADO' => "❌ Tu pedido #{$ventaNumero} fue rechazado.",
                'DEVOLUCION_PARCIAL' => "⚠️ Tu pedido #{$ventaNumero} tiene devolución parcial de productos.",
                'CLIENTE_CERRADO' => "🏪 Tu local estaba cerrado. Reintentar la entrega de pedido #{$ventaNumero}.",
                'NO_CONTACTADO' => "📞 No pudimos contactarte para la entrega de pedido #{$ventaNumero}.",
                default => "Actualización en tu pedido #{$ventaNumero}"
            };

            // Guardar en BD
            $this->dbNotificationService->create([$cliente->user_id], 'cliente.venta.confirmada', [
                'venta_numero' => $ventaNumero,
                'venta_id' => $venta->id,
                'cliente_nombre' => $cliente->nombre,
                'cliente_id' => $cliente->id,
                'entrega_numero' => $entrega->numero_entrega,
                'entrega_id' => $entrega->id,
                'tipo_confirmacion' => $tipoConfirmacion,
                'chofer_nombre' => $choferNombre,
                'mensaje' => $mensaje,
            ], [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
            ]);

            // Enviar WebSocket
            $this->wsService->notifyClienteVentaConfirmada($venta, $entrega, $confirmacion);

            Log::info('✅ EntregaNotificationService::notifyClienteVentaConfirmada enviado', [
                'venta_id' => $venta->id,
                'cliente_id' => $cliente->id,
                'tipo_confirmacion' => $tipoConfirmacion,
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyClienteVentaConfirmada', [
                'venta_id' => $venta->id,
                'cliente_id' => $venta->cliente_id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar al preventista que su venta fue confirmada como entregada
     */
    public function notifyPreventistaVentaConfirmada(Venta $venta, Entrega $entrega, $confirmacion, $preventista): bool
    {
        try {
            if (!$preventista || !$preventista->id) {
                Log::warning('EntregaNotificationService::notifyPreventistaVentaConfirmada - Preventista sin ID', [
                    'venta_id' => $venta->id,
                    'preventista_id' => $preventista?->id,
                ]);
                return true;
            }

            $tipoConfirmacion = $confirmacion->tipo_confirmacion;
            $ventaNumero = $venta->numero;
            $clienteNombre = $venta->cliente?->nombre ?? 'Cliente';
            $choferNombre = $entrega->chofer?->name ?? 'Chofer';

            $mensaje = match ($tipoConfirmacion) {
                'COMPLETA' => "✅ Tu venta #{$ventaNumero} a {$clienteNombre} fue confirmada como entregada.",
                'RECHAZADO' => "❌ Tu venta #{$ventaNumero} a {$clienteNombre} fue rechazada.",
                'DEVOLUCION_PARCIAL' => "⚠️ Tu venta #{$ventaNumero} a {$clienteNombre} tiene devolución parcial.",
                'CLIENTE_CERRADO' => "🏪 Tu venta #{$ventaNumero} a {$clienteNombre} - local cerrado.",
                'NO_CONTACTADO' => "📞 Tu venta #{$ventaNumero} a {$clienteNombre} - no contactado.",
                default => "Actualización en tu venta #{$ventaNumero}"
            };

            // Guardar en BD
            $this->dbNotificationService->create([$preventista->id], 'preventista.venta.confirmada', [
                'venta_numero' => $ventaNumero,
                'venta_id' => $venta->id,
                'cliente_nombre' => $clienteNombre,
                'cliente_id' => $venta->cliente_id,
                'entrega_numero' => $entrega->numero_entrega,
                'entrega_id' => $entrega->id,
                'tipo_confirmacion' => $tipoConfirmacion,
                'chofer_nombre' => $choferNombre,
                'preventista_id' => $preventista->id,
                'mensaje' => $mensaje,
            ], [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
            ]);

            // Enviar WebSocket
            $this->wsService->notifyPreventistaVentaConfirmada($venta, $entrega, $confirmacion, $preventista);

            Log::info('✅ EntregaNotificationService::notifyPreventistaVentaConfirmada enviado', [
                'venta_id' => $venta->id,
                'preventista_id' => $preventista->id,
                'tipo_confirmacion' => $tipoConfirmacion,
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyPreventistaVentaConfirmada', [
                'venta_id' => $venta->id,
                'preventista_id' => $preventista?->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar a preventista, managers y admins cuando una venta está EN_TRANSITO
     */
    public function notifyVentaEnTransito(Venta $venta, Entrega $entrega, $user, $tipo = 'preventista'): bool
    {
        try {
            if (!$user || !$user->id) {
                return true;
            }

            $choferNombre = $entrega->chofer?->name ?? 'Chofer asignado';
            $mensaje = "🚚 Venta #{$venta->numero} está EN_TRANSITO - Sus productos están en camino. Chofer: {$choferNombre}";

            // Guardar en BD
            $this->dbNotificationService->create([$user->id], 'venta.en-transito', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'entrega_id' => $entrega->id,
                'entrega_numero' => $entrega->numero_entrega,
                'cliente_nombre' => $venta->cliente?->nombre,
                'cliente_id' => $venta->cliente_id,
                'chofer_nombre' => $choferNombre,
                'chofer_id' => $entrega->chofer_id,
                'total' => (float) $venta->total,
                'mensaje' => $mensaje,
                'tipo_notificacion' => $tipo,
            ], [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
            ]);

            // Enviar WebSocket
            $this->wsService->notifyVentaEnTransito($venta, $entrega, $user, $tipo);

            Log::info('✅ EntregaNotificationService::notifyVentaEnTransito enviado', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'user_id' => $user->id,
                'tipo' => $tipo,
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyVentaEnTransito', [
                'venta_id' => $venta->id,
                'entrega_id' => $entrega->id,
                'user_id' => $user?->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar al cliente que su entrega salió a entrega (mensaje amigable)
     * Usa el método existente notifyVentaEnTransito() que ya está configurado
     */
    public function notifyClienteEntregaSalidoAEntrega(Venta $venta, Entrega $entrega): bool
    {
        try {
            $cliente = $venta->cliente;

            if (!$cliente || !$cliente->user_id) {
                Log::warning('notifyClienteEntregaSalidoAEntrega: Cliente sin user_id válido', [
                    'venta_id' => $venta->id,
                    'cliente_id' => $venta->cliente_id,
                ]);
                return true;
            }

            // Validar que el user_id existe en tabla users
            $userExists = User::where('id', $cliente->user_id)->exists();
            if (!$userExists) {
                Log::warning('notifyClienteEntregaSalidoAEntrega: user_id no existe en tabla users', [
                    'venta_id' => $venta->id,
                    'cliente_id' => $venta->cliente_id,
                    'user_id_cliente' => $cliente->user_id,
                ]);
                return true;
            }

            // Reutilizar el método existente notifyVentaEnTransito que ya funciona
            return $this->notifyVentaEnTransito($venta, $entrega, $cliente, 'cliente');

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyClienteEntregaSalidoAEntrega', [
                'venta_id' => $venta->id,
                'cliente_id' => $venta->cliente_id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * ✅ NUEVO: Notificar al preventista que su venta salió a entrega
     * Usa el método existente notifyVentaEnTransito() que ya está configurado
     */
    public function notifyPreventistaEntregaSalidoAEntrega(Venta $venta, Entrega $entrega, $preventista): bool
    {
        try {
            if (!$preventista || !$preventista->id) {
                return true;
            }

            // Reutilizar el método existente notifyVentaEnTransito que ya funciona
            return $this->notifyVentaEnTransito($venta, $entrega, $preventista, 'preventista');

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaNotificationService::notifyPreventistaEntregaSalidoAEntrega', [
                'venta_id' => $venta->id,
                'preventista_id' => $preventista?->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
