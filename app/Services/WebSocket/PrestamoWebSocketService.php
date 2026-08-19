<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de préstamos
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con préstamos
 */
class PrestamoWebSocketService extends BaseWebSocketService
{
    /**
     * ✅ Notificar creación de préstamo a cliente a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente propietario (mobile/web)
     */
    public function notifyPrestamoClienteCreated($prestamo): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'cliente_id' => $prestamo->cliente_id,
            'cliente_nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
            'cliente' => [
                'id' => $prestamo->cliente_id,
                'nombre' => $prestamo->cliente?->nombre ?? 'Cliente',
                'apellido' => $prestamo->cliente?->apellido ?? '',
            ],
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'fecha_creacion' => $prestamo->created_at?->toIso8601String(),
            'tipo' => 'prestamo_cliente',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 📱 Agregar cliente específico si tiene user_id
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.cliente.creado', $eventData, array_unique($userIds), $roles);
    }

    /**
     * ✅ Notificar creación de préstamo a evento a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Usuario creador
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente propietario (cliente eventos, ID=51)
     */
    public function notifyPrestamoEventoCreated($prestamo): bool
    {
        // Calcular cantidad total prestada
        $cantidadTotal = ($prestamo->detalles ?? collect())
            ->sum('cantidad_prestada');

        $eventData = [
            'id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'cantidad' => (int) $cantidadTotal,
            'estado' => $prestamo->estado,
            'encargado_evento' => $prestamo->encargado_evento,
            'items' => ($prestamo->detalles ?? collect())->map(function ($item) {
                return [
                    'prestable_id' => $item->prestable_id,
                    'prestable_nombre' => $item->prestable?->nombre ?? 'Prestable',
                    'cantidad_prestada' => (int) $item->cantidad_prestada,
                ];
            })->toArray(),
            'creador' => [
                'id' => $prestamo->created_by,
                'name' => $prestamo->creador?->name ?? 'Sistema',
            ],
            'fecha_creacion' => $prestamo->created_at?->toIso8601String(),
            'tipo' => 'prestamo_evento',
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar usuario creador
        if ($prestamo->created_by) {
            $userIds[] = $prestamo->created_by;
        }

        // 📱 Agregar cliente eventos si tiene user_id
        if ($prestamo->cliente?->user_id) {
            $userIds[] = $prestamo->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('prestamo.evento.creado', $eventData, array_unique($userIds), $roles);
    }
}
