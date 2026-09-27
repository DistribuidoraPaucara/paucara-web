<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de compras
 *
 * Notifica a TODOS pero con datos diferentes:
 * - Roles internos: ven cantidades, lotes, vencimientos
 * - Cliente: solo ve "Nuevo stock" SIN cantidades
 */
class CompraWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar nuevo stock disponible
     *
     * Destinatarios:
     * - Roles internos: admin, manager, cajero, preventista, chofer (datos completos)
     * - Cliente: SOLO "hay nuevo stock" (sin cantidades)
     */
    public function notifyCompleted($compra): bool
    {
        // Información COMPLETA de productos (con cantidades)
        $productosCompleto = ($compra->detalles ?? collect())->map(function ($item) {
            return [
                'producto_id' => $item->producto_id,
                'producto_nombre' => $item->producto?->nombre ?? 'Producto',
                'sku' => $item->producto?->sku ?? 'N/A',
                'cantidad_llegada' => (float) $item->cantidad,
                'lote' => $item->lote,
                'fecha_vencimiento' => $item->fecha_vencimiento,
            ];
        })->toArray();

        // Información REDUCIDA para cliente (SOLO nombres, SIN cantidades)
        $productosParaCliente = ($compra->detalles ?? collect())->map(function ($item) {
            return [
                'producto_id' => $item->producto_id,
                'producto_nombre' => $item->producto?->nombre ?? 'Producto',
                'sku' => $item->producto?->sku ?? 'N/A',
            ];
        })->toArray();

        // 1️⃣ Datos para roles internos (COMPLETOS)
        $eventDataInternos = [
            'titulo' => '📦 Nuevo Stock Disponible',
            'compra_numero' => $compra->numero,
            'proveedor' => [
                'id' => $compra->proveedor_id,
                'nombre' => $compra->proveedor?->nombre ?? 'Proveedor',
            ],
            'productos' => $productosCompleto,
            'cantidad_productos' => count($productosCompleto),
            'cantidad_total_items' => collect($productosCompleto)->sum('cantidad_llegada'),
            'fecha_ingreso' => $compra->created_at?->toIso8601String(),
        ];

        // 2️⃣ Datos para cliente (REDUCIDOS)
        $eventDataCliente = [
            'titulo' => '📦 Nuevo Stock Disponible',
            'compra_numero' => $compra->numero,
            'proveedor' => [
                'id' => $compra->proveedor_id,
                'nombre' => $compra->proveedor?->nombre ?? 'Proveedor',
            ],
            'productos' => $productosParaCliente,
            'cantidad_productos' => count($productosParaCliente),
            'fecha_ingreso' => $compra->created_at?->toIso8601String(),
            'show_quantities' => false,  // Flag para el cliente: NO mostrar cantidades
        ];

        // 3️⃣ Obtener client user_id
        $clienteUserId = $compra->cliente?->user_id;

        // 4️⃣ Enviar a roles internos (con datos completos)
        $this->notifyMultiChannel(
            'stock.disponible',
            $eventDataInternos,
            [],  // Sin user_ids específicos
            ['admin', 'manager', 'cajero', 'preventista', 'chofer']
        );

        // 5️⃣ Enviar al cliente POR SEPARADO (con datos reducidos)
        if ($clienteUserId) {
            $this->notifyUser(
                $clienteUserId,
                'stock.disponible',
                $eventDataCliente
            );
        }

        return true;
    }
}
