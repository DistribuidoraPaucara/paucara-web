<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\Notifications\DatabaseNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controlador API para gestión de notificaciones
 *
 * Proporciona endpoints para que Flutter y otras apps consulten
 * y gestionen las notificaciones persistentes de los usuarios
 */
class NotificationController extends Controller
{
    public function __construct(
        private DatabaseNotificationService $notificationService
    ) {}

    /**
     * Listar todas las notificaciones del usuario autenticado
     *
     * GET /api/notificaciones
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $limit = $request->input('limit', 50);

            $notifications = $this->notificationService->getAllNotifications($user, $limit);

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'meta' => [
                    'total' => $notifications->count(),
                    'limit' => $limit,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo notificaciones', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener notificaciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar solo notificaciones no leídas
     *
     * GET /api/notificaciones/no-leidas
     */
    public function unread(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $notifications = $this->notificationService->getUnreadNotifications($user);

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'meta' => [
                    'total' => $notifications->count(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo notificaciones no leídas', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener notificaciones no leídas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marcar una notificación como leída
     *
     * POST /api/notificaciones/{notification}/marcar-leida
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Verificar que la notificación pertenece al usuario autenticado
            if ($notification->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para modificar esta notificación',
                ], 403);
            }

            $this->notificationService->markAsRead($notification);

            return response()->json([
                'success' => true,
                'message' => 'Notificación marcada como leída',
                'data' => $notification->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error marcando notificación como leída', [
                'notification_id' => $notification->id ?? null,
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al marcar notificación como leída',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marcar una notificación como no leída
     *
     * POST /api/notificaciones/{notification}/marcar-no-leida
     */
    public function markAsUnread(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Verificar que la notificación pertenece al usuario autenticado
            if ($notification->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para modificar esta notificación',
                ], 403);
            }

            $notification->markAsUnread();

            return response()->json([
                'success' => true,
                'message' => 'Notificación marcada como no leída',
                'data' => $notification->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error marcando notificación como no leída', [
                'notification_id' => $notification->id ?? null,
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al marcar notificación como no leída',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     *
     * POST /api/notificaciones/marcar-todas-leidas
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $this->notificationService->markAllAsRead($user);

            return response()->json([
                'success' => true,
                'message' => 'Todas las notificaciones han sido marcadas como leídas',
            ]);
        } catch (\Exception $e) {
            Log::error('Error marcando todas las notificaciones como leídas', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al marcar todas las notificaciones como leídas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar una notificación
     *
     * DELETE /api/notificaciones/{notification}
     */
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Verificar que la notificación pertenece al usuario autenticado
            if ($notification->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar esta notificación',
                ], 403);
            }

            $this->notificationService->deleteNotification($notification);

            return response()->json([
                'success' => true,
                'message' => 'Notificación eliminada correctamente',
            ]);
        } catch (\Exception $e) {
            Log::error('Error eliminando notificación', [
                'notification_id' => $notification->id ?? null,
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar notificación',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar todas las notificaciones del usuario
     *
     * DELETE /api/notificaciones/eliminar-todas
     */
    public function destroyAll(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $count = $this->notificationService->deleteAllNotifications($user);

            return response()->json([
                'success' => true,
                'message' => 'Todas las notificaciones han sido eliminadas',
                'data' => [
                    'deleted_count' => $count,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error eliminando todas las notificaciones', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar todas las notificaciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de notificaciones
     *
     * GET /api/notificaciones/estadisticas
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $stats = $this->notificationService->getNotificationStats($user);

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo estadísticas de notificaciones', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas de notificaciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener notificaciones por tipo
     *
     * GET /api/notificaciones/por-tipo/{type}
     */
    public function byType(Request $request, string $type): JsonResponse
    {
        try {
            $user = $request->user();
            $limit = $request->input('limit', 50);

            $notifications = Notification::where('user_id', $user->id)
                ->where('type', $type)
                ->latest()
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'meta' => [
                    'type' => $type,
                    'total' => $notifications->count(),
                    'limit' => $limit,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo notificaciones por tipo', [
                'user_id' => $request->user()->id ?? null,
                'type' => $type,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener notificaciones por tipo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener una notificación específica
     *
     * GET /api/notificaciones/{notification}
     */
    public function show(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Verificar que la notificación pertenece al usuario autenticado
            if ($notification->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para ver esta notificación',
                ], 403);
            }

            // Cargar relaciones si existen
            $notification->load(['user', 'proforma', 'venta']);

            return response()->json([
                'success' => true,
                'data' => $notification,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo notificación', [
                'notification_id' => $notification->id ?? null,
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener notificación',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
