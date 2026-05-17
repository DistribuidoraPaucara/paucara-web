<?php

namespace App\Services\Notifications;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Servicio para manejar notificaciones persistentes en la base de datos
 *
 * Este servicio es genérico y puede ser usado por cualquier tipo de notificación
 * (proformas, Envíos, Pagos, etc.)
 */
class DatabaseNotificationService
{
    /**
     * Crear una notificación en la base de datos
     *
     * @param int|array $userIds ID(s) de usuario(s) a notificar
     * @param string $type Tipo de notificación (ej: 'proforma.creada', 'envio.programado')
     * @param array $data Datos de la notificación
     * @param array $relatedIds IDs relacionados (opcional: proforma_id, venta_id, envio_id, etc.)
     * @return bool
     */
    public function create($userIds, string $type, array $data, array $relatedIds = []): bool
    {
        try {
            // Convertir a array si es un solo ID
            $userIds = is_array($userIds) ? $userIds : [$userIds];

            foreach ($userIds as $userId) {
                Notification::create(array_merge([
                    'user_id' => $userId,
                    'type' => $type,
                    'data' => $data,
                ], $relatedIds)); // Merge con IDs relacionados (proforma_id, venta_id, etc.)
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error al crear notificación en BD', [
                'type' => $type,
                'user_ids' => $userIds,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Crear notificación para múltiples usuarios basados en roles
     *
     * @param array $roles Array de roles (ej: ['admin', 'manager', 'preventista'])
     * @param string $type Tipo de notificación
     * @param array $data Datos de la notificación
     * @param array $relatedIds IDs relacionados
     * @return bool
     */
    public function createForRoles(array $roles, string $type, array $data, array $relatedIds = []): bool
    {
        try {
            $users = User::whereHas('roles', function ($q) use ($roles) {
                $q->whereIn('name', $roles);
            })->where('activo', true)->get();

            $userIds = $users->pluck('id')->toArray();

            return $this->create($userIds, $type, $data, $relatedIds);
        } catch (\Exception $e) {
            Log::error('Error al crear notificación por roles', [
                'roles' => $roles,
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Obtener notificaciones no leídas del usuario
     */
    public function getUnreadNotifications(User $user, int $limit = 50): Collection
    {
        return Notification::where('user_id', $user->id)
            ->unread()
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Obtener todas las notificaciones del usuario
     */
    public function getAllNotifications(User $user, int $limit = 50): Collection
    {
        return Notification::where('user_id', $user->id)
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Marcar notificación como leída
     */
    public function markAsRead(Notification $notification): void
    {
        $notification->markAsRead();
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->unread()
            ->update([
                'read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Eliminar notificación
     */
    public function deleteNotification(Notification $notification): void
    {
        $notification->delete();
    }

    /**
     * Eliminar todas las notificaciones de un usuario
     */
    public function deleteAllNotifications(User $user): int
    {
        return Notification::where('user_id', $user->id)->delete();
    }

    /**
     * Obtener estadísticas de notificaciones
     */
    public function getNotificationStats(User $user): array
    {
        return [
            'total' => Notification::where('user_id', $user->id)->count(),
            'unread' => Notification::where('user_id', $user->id)->unread()->count(),
            'read' => Notification::where('user_id', $user->id)->read()->count(),
        ];
    }
}
