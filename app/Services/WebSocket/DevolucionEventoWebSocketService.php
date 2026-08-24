<?php

namespace App\Services\WebSocket;

use App\Models\DevolucionEvento;

/**
 * Servicio que envía notificaciones de devoluciones de eventos por WebSocket
 * Extiende BaseWebSocketService para usar infraestructura compartida
 */
class DevolucionEventoWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar registro de devolución de evento a múltiples canales
     * Notifica simultáneamente a: Admins, Cajeros, Choferes
     */
    public function notifyRegistered(DevolucionEvento $devolucion): bool
    {
        $totalDevuelto = $devolucion->detalles->sum('cantidad_devuelta');

        $eventData = [
            'devolucion_id' => $devolucion->id,
            'prestamo_id' => $devolucion->prestamo_evento_id,
            'prestamo_numero' => $devolucion->prestamoEvento->numero ?? 'N/A',
            'nombre_evento' => $devolucion->prestamoEvento->nombre_evento ?? 'Evento',
            'cliente' => [
                'id' => $devolucion->prestamoEvento->cliente_id,
                'nombre' => $devolucion->prestamoEvento->cliente?->nombre ?? 'Cliente',
                'apellido' => $devolucion->prestamoEvento->cliente?->apellido ?? '',
            ],
            'chofer' => [
                'id' => $devolucion->prestamoEvento->chofer_id,
                'nombre' => $devolucion->prestamoEvento->chofer?->name ?? 'Chofer',
            ],
            'fecha_devolucion' => $devolucion->fecha_devolucion?->format('d/m/Y H:i'),
            'total_devuelto' => (int) $totalDevuelto,
            'cantidad_items' => $devolucion->detalles->count(),
            'estado_evento' => $devolucion->prestamoEvento->estado,
            'monto_garantia_devuelta' => (float) $devolucion->monto_garantia_devuelta_total,
            'items' => ($devolucion->detalles ?? collect())->map(function ($detalle) {
                return [
                    'prestable_nombre' => $detalle->prestamoEventoDetalle->prestable?->nombre ?? 'Prestable',
                    'cantidad_devuelta' => $detalle->cantidad_devuelta,
                    'cantidad_dañada' => $detalle->cantidad_dañada_total,
                    'total' => $detalle->cantidad_devuelta + $detalle->cantidad_dañada_total,
                ];
            })->toArray(),
            'created_at' => $devolucion->created_at?->toIso8601String(),
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager'];

        // 👤 Agregar chofer del evento
        if ($devolucion->prestamoEvento && $devolucion->prestamoEvento->chofer_id) {
            $userIds[] = $devolucion->prestamoEvento->chofer_id;
        }

        // 👤 Agregar chofer de la devolución (si es diferente)
        if ($devolucion->chofer_id && $devolucion->chofer_id !== $devolucion->prestamoEvento->chofer_id) {
            $userIds[] = $devolucion->chofer_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        // Usa config('websocket.url') del .env automáticamente desde BaseWebSocketService
        return $this->notifyMultiChannel('devolucion_evento.registrada', $eventData, array_unique($userIds), $roles);
    }
}
