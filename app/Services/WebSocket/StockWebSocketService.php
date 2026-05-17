<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de Stock
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con inventario
 */
class StockWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar actualización de stock de producto
     */
    public function notifyUpdated($producto, ?int $stockAnterior = null): bool
    {
        return $this->send('notify/stock-updated', [
            'producto_id' => $producto->id,
            'nombre' => $producto->nombre,
            'sku' => $producto->sku ?? null,
            'stock_anterior' => $stockAnterior,
            'stock_nuevo' => $producto->stock_total ?? 0,
            'disponible' => ($producto->stock_total ?? 0) > 0,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar reserva de stock
     */
    public function notifyReserved($proforma): bool
    {
        return $this->send('notify/stock-reserved', [
            'proforma_id' => $proforma->id,
            'proforma_numero' => $proforma->numero,
            'cliente_id' => $proforma->cliente_id,
            'items' => ($proforma->detalles ?? collect())->map(function ($item) {
                return [
                    'producto_id' => $item->producto_id,
                    'producto_nombre' => $item->producto?->nombre ?? 'Producto',
                    'cantidad_reservada' => $item->cantidad,
                ];
            })->toArray(),
            'fecha_reserva' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar que una reserva está por vencer
     */
    public function notifyReservationExpiring(array $reservationData): bool
    {
        return $this->send('notify/reservation-expiring', [
            'proforma_id' => $reservationData['proforma_id'],
            'proforma_numero' => $reservationData['proforma_numero'] ?? null,
            'cliente_id' => $reservationData['cliente_id'],
            'expires_at' => $reservationData['expires_at'],
            'minutes_remaining' => $reservationData['minutes_remaining'] ?? null,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar stock bajo (alerta)
     */
    public function notifyLowStock($producto, int $stockMinimo): bool
    {
        return $this->send('notify/stock-bajo', [
            'producto_id' => $producto->id,
            'nombre' => $producto->nombre,
            'sku' => $producto->sku ?? null,
            'stock_actual' => $producto->stock_total ?? 0,
            'stock_minimo' => $stockMinimo,
            'criticidad' => $producto->stock_total <= ($stockMinimo * 0.5) ? 'alta' : 'media',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar producto agotado
     */
    public function notifyOutOfStock($producto): bool
    {
        return $this->send('notify/stock-agotado', [
            'producto_id' => $producto->id,
            'nombre' => $producto->nombre,
            'sku' => $producto->sku ?? null,
            'stock_actual' => 0,
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
