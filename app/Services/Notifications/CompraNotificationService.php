<?php
namespace App\Services\Notifications;

use App\Models\Cliente;
use App\Models\Compra;
use App\Models\User;
use App\Services\WebSocket\CompraWebSocketService;
use Illuminate\Support\Facades\Log;

/**
 * Servicio orquestador de notificaciones de compras
 *
 * Coordina entre:
 * - Notificaciones en BD (DatabaseNotificationService)
 * - Notificaciones en tiempo real (CompraWebSocketService)
 *
 * Destinatarios (todos por user_id):
 * - Internos: usuarios activos con rol admin, manager, cajero o preventista,
 *   más el usuario autenticado que creó/aprobó la compra → VEN CANTIDADES
 * - Clientes: todos los clientes activos con usuario activo → SIN cantidades (solo "hay nuevo stock")
 */
class CompraNotificationService
{
    /** Roles internos que reciben el detalle completo de la compra */
    private const ROLES_INTERNOS = ['admin', 'manager', 'cajero', 'preventista'];

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
     * Notificar nuevo stock disponible al aprobar una compra
     *
     * @param int|null $usuarioId Usuario autenticado que creó/aprobó la compra
     */
    public function notifyCompleted(Compra $compra, ?int $usuarioId = null): bool
    {
        // 1. Internos + usuario autenticado
        $userIdsInternos = $this->getUserIdsInternos();
        if ($usuarioId) {
            $userIdsInternos[] = $usuarioId;
        }
        $userIdsInternos = array_values(array_unique($userIdsInternos));

        // 2. Clientes (si un usuario es interno y cliente a la vez, recibe solo la versión interna)
        $userIdsClientes = array_values(array_diff($this->getUserIdsClientes(), $userIdsInternos));

        $base = [
            'titulo'             => '📦 Nuevo Stock Disponible',
            'compra_id'          => $compra->id,
            'compra_numero'      => $compra->numero,
            'proveedor_nombre'   => $compra->proveedor->nombre ?? 'Proveedor',
            'cantidad_productos' => $compra->detalles->count(),
        ];

        // 3. Guardar en BD: internos con cantidades, clientes sin cantidades
        $this->dbNotificationService->createBulk($userIdsInternos, 'stock.disponible', $base + [
            'productos' => $compra->detalles->map(fn($detalle) => [
                'nombre'   => $detalle->producto?->nombre ?? 'Producto',
                'cantidad' => $detalle->cantidad,
            ])->toArray(),
        ]);

        $this->dbNotificationService->createBulk($userIdsClientes, 'stock.disponible', $base + [
            'productos' => $compra->detalles->map(fn($detalle) => [
                'nombre' => $detalle->producto?->nombre ?? 'Producto',
            ])->toArray(),
            'show_quantities' => false,
        ]);

        Log::info('📦 Notificación de nuevo stock', [
            'compra_numero'    => $compra->numero,
            'usuario_id'       => $usuarioId,
            'total_internos'   => count($userIdsInternos),
            'total_clientes'   => count($userIdsClientes),
        ]);

        // 4. Tiempo real vía WebSocket
        return $this->wsService->notifyCompleted($compra, $userIdsInternos, $userIdsClientes);
    }

    /** IDs de usuarios activos con rol interno */
    private function getUserIdsInternos(): array
    {
        return User::whereHas('roles', fn($query) => $query->whereIn('name', self::ROLES_INTERNOS))
            ->where('activo', true)
            ->pluck('id')
            ->all();
    }

    /** IDs de usuario de todos los clientes activos que tienen cuenta de usuario activa */
    private function getUserIdsClientes(): array
    {
        return Cliente::where('activo', true)
            ->whereNotNull('user_id')
            ->whereHas('user', fn($query) => $query->where('activo', true))
            ->distinct()
            ->pluck('user_id')
            ->all();
    }
}
