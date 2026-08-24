<?php

namespace App\Services\WebSocket;

use App\Models\DevolucionProveedor;

/**
 * Servicio que envía notificaciones de devoluciones de proveedores por WebSocket
 * Extiende BaseWebSocketService para usar infraestructura compartida
 */
class DevolucionProveedorWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar registro de devolución de proveedor a múltiples canales
     * Notifica simultáneamente a: Admins, Cajeros, Choferes
     */
    public function notifyRegistered(DevolucionProveedor $devolucion): bool
    {
        $totalDevuelto = $devolucion->detalles->sum('cantidad_devuelta');

        $eventData = [
            'devolucion_id' => $devolucion->id,
            'prestamo_id' => $devolucion->prestamo_proveedor_id,
            'prestamo_numero' => $devolucion->prestamo->id ?? 'N/A',
            'proveedor_nombre' => $devolucion->prestamo->proveedor?->nombre ?? 'Proveedor',
            'proveedor' => [
                'id' => $devolucion->prestamo->proveedor_id,
                'nombre' => $devolucion->prestamo->proveedor?->nombre ?? 'Proveedor',
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
                    'prestable_nombre' => $detalle->detallePrestamoProveedor->prestable?->nombre ?? 'Prestable',
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
        // Usa config('websocket.url') del .env automáticamente desde BaseWebSocketService
        return $this->notifyMultiChannel('devolucion_proveedor.registrada', $eventData, array_unique($userIds), $roles);
    }
}
