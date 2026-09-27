<?php
namespace App\Services\Notifications;

use App\Models\Compra;
use App\Models\User;
use App\Services\WebSocket\CompraWebSocketService;
use Illuminate\Support\Collection;

/**
 * Servicio orquestador de notificaciones de compras
 *
 * Coordina entre:
 * - Notificaciones en BD (DatabaseNotificationService)
 * - Notificaciones en tiempo real (CompraWebSocketService)
 *
 * Destinatarios:
 * - Roles internos: admin, manager, cajero, preventista, chofer (VEN CANTIDADES)
 * - Cliente: SÍ recibe notificación pero SIN cantidades (solo "hay nuevo stock")
 */
class CompraNotificationService
{
    protected DatabaseNotificationService $dbNotificationService;
    protected CompraWebSocketService $wsService;

    public function __construct(
        DatabaseNotificationService $dbNotificationService,
        CompraWebSocketService $wsService
    ) {
        $this->dbNotificationService = $dbNotificationService;
        $this->wsService             = $wsService;
    }

    /**
     * Notificar nuevo stock disponible
     * - Usuarios internos: ven detalles completos (cantidades, lotes, vencimientos)
     * - Cliente: solo ve "Hay nuevo stock" SIN cantidades
     * - Guarda en BD para todos
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function notifyCompleted(Compra $compra): bool
    {
        // 1. Obtener usuarios internos (roles de negocio)
        $usersInternos = $this->getUsersInternos();
        $userIdsInternos = $usersInternos->pluck('id')->toArray();

        // 2. Obtener cliente (si tiene user_id)
        $clienteUserId = $compra->cliente?->user_id;

        // 3. Todos los destinatarios
        $todosUserIds = array_unique(array_filter(array_merge($userIdsInternos, [$clienteUserId])));

        // 4. Crear mensaje de notificación por cada producto
        $productosInfo = $compra->detalles->map(function ($detalle) {
            return [
                'nombre' => $detalle->producto?->nombre ?? 'Producto',
                'cantidad' => $detalle->cantidad,
            ];
        })->toArray();

        // 5. Guardar en BD (persistente) - TODOS reciben la notificación
        $this->dbNotificationService->create($todosUserIds, 'stock.disponible', [
            'titulo'          => '📦 Nuevo Stock Disponible',
            'proveedor_nombre' => $compra->proveedor->nombre ?? 'Proveedor',
            'compra_numero'   => $compra->numero,
            'productos'       => $productosInfo,
            'cantidad_productos' => $compra->detalles->count(),
        ], [
            'compra_id' => $compra->id,
        ]);

        // 6. Enviar notificación en tiempo real vía WebSocket
        return $this->wsService->notifyCompleted($compra);
    }

    /**
     * Obtener usuarios internos
     * Retorna: Admins, Managers, Cajeros, Preventistas, Choferes
     */
    private function getUsersInternos(): Collection
    {
        return User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'manager', 'cajero', 'preventista', 'chofer']);
        })
        ->where('activo', true)
        ->select(['id', 'name', 'email'])
        ->get();
    }
}
