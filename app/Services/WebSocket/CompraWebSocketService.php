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
     * Destinatarios (los calcula CompraNotificationService):
     * - Internos: admin, manager, cajero, preventista + usuario que aprobó (datos completos)
     * - Clientes: SOLO "hay nuevo stock" (sin cantidades)
     *
     * @param int[] $userIdsInternos
     * @param int[] $userIdsClientes
     */
    public function notifyCompleted($compra, array $userIdsInternos = [], array $userIdsClientes = []): bool
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

        // 3️⃣ Internos (con datos completos) y clientes (datos reducidos): una petición HTTP por grupo,
        // por user_id para que coincida exactamente con las notificaciones guardadas en BD
        $okInternos = empty($userIdsInternos)
            || $this->notifyMultiChannel('stock.disponible', $eventDataInternos, $userIdsInternos);

        $okClientes = empty($userIdsClientes)
            || $this->notifyMultiChannel('stock.disponible', $eventDataCliente, $userIdsClientes);

        return $okInternos && $okClientes;
    }
}
