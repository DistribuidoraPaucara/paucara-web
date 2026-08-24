<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de devoluciones
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con devoluciones de préstamos
 */
class DevolucionWebSocketService extends BaseWebSocketService
{
    /**
     * ✅ Notificar registro de devolución a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Admins (web)
     * - Cajeros (web)
     * - Choferes (web/mobile)
     */
    public function notifyRegistered($devolucion): bool
    {
        $totalDevuelto = $devolucion->detalles->sum('cantidad_devuelta');

        $eventData = [
            'devolucion_id' => $devolucion->id,
            'prestamo_id' => $devolucion->prestamo_cliente_id,
            'prestamo_numero' => $devolucion->prestamo->numero ?? 'N/A',
            'cliente' => [
                'id' => $devolucion->prestamo->cliente_id,
                'nombre' => $devolucion->prestamo->cliente?->nombre ?? 'Cliente',
                'apellido' => $devolucion->prestamo->cliente?->apellido ?? '',
            ],
            'chofer' => [
                'id' => $devolucion->prestamo->chofer_id,
                'nombre' => $devolucion->prestamo->chofer?->name ?? 'Chofer',
            ],
            'fecha_devolucion' => $devolucion->fecha_devolucion?->format('d/m/Y H:i'),
            'total_devuelto' => (int) $totalDevuelto,
            'cantidad_items' => $devolucion->detalles->count(),
            'estado_prestamo' => $devolucion->prestamo->estado,
            'monto_garantia_devuelta' => (float) $devolucion->monto_garantia_devuelta_total,
            'items' => ($devolucion->detalles ?? collect())->map(function ($detalle) {
                return [
                    'prestable_nombre' => $detalle->detallePrestamoCliente->prestable?->nombre ?? 'Prestable',
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

        // 👤 Agregar chofer del préstamo
        if ($devolucion->prestamo && $devolucion->prestamo->chofer_id) {
            $userIds[] = $devolucion->prestamo->chofer_id;
        }

        // 👤 Agregar chofer de la devolución (si es diferente)
        if ($devolucion->chofer_id && $devolucion->chofer_id !== $devolucion->prestamo->chofer_id) {
            $userIds[] = $devolucion->chofer_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('devolucion.registrada', $eventData, array_unique($userIds), $roles);
    }
}
