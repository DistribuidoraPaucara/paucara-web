<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de proformas
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con proformas
 */
class ProformaWebSocketService extends BaseWebSocketService
{
    /**
     * ✅ MEJORADO: Notificar creación de proforma a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Admins (web)
     * - Cajeros (web)
     * - Cliente propietario (mobile/web)
     * - Preventista que creó (web)
     */
    public function notifyCreated($proforma): bool
    {
        $eventData = [
            'id' => $proforma->id,
            'numero' => $proforma->numero,
            'cliente_id' => $proforma->cliente_id,
            'clienteNombre' => $proforma->cliente?->nombre ?? 'Cliente',
            'cliente' => [
                'id' => $proforma->cliente_id,
                'nombre' => $proforma->cliente?->nombre ?? 'Cliente',
                'apellido' => $proforma->cliente?->apellido ?? '',
                'telefono' => $proforma->cliente?->telefono ?? null,
            ],
            'subtotal' => (float) $proforma->subtotal,
            'impuesto' => (float) $proforma->impuesto,
            'total' => (float) $proforma->total,
            'estado' => $proforma->estado,
            'items' => ($proforma->detalles ?? collect())->map(function ($item) {
                return [
                    'producto_id' => $item->producto_id,
                    'producto_nombre' => $item->producto?->nombre ?? 'Producto',
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => (float) $item->precio_unitario,
                    'subtotal' => (float) $item->subtotal,
                ];
            })->toArray(),
            'fecha_creacion' => $proforma->created_at?->toIso8601String(),
            'fecha_vencimiento' => $proforma->fecha_vencimiento?->toIso8601String(),
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'cajero', 'manager', 'preventista'];

        // 📱 Agregar cliente específico si tiene user_id
        if ($proforma->cliente?->user_id) {
            $userIds[] = $proforma->cliente->user_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('proforma.creada', $eventData, $userIds, $roles);
    }

    /**
     * ✅ MEJORADO: Notificar aprobación de proforma a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Cliente propietario (mobile/web)
     * - Preventista que creó (web)
     * - Admins/Managers/Cajeros (web) para supervisión
     */
    public function notifyApproved($proforma): bool
    {
        $eventData = [
            'id' => $proforma->id,
            'numero' => $proforma->numero,
            'cliente_id' => $proforma->cliente_id,
            'clienteNombre' => $proforma->cliente?->nombre ?? 'Cliente',
            'estado' => $proforma->estado,
            'total' => (float) $proforma->total,
            'usuario_aprobador' => [
                'id' => $proforma->usuario_aprobador_id,
                'name' => $proforma->usuarioAprobador?->name ?? 'Sistema',
            ],
            'comentarios' => $proforma->comentario_aprobacion,
            'fecha_aprobacion' => $proforma->fecha_aprobacion?->toIso8601String(),
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'manager', 'cajero'];

        // 📱 Agregar cliente si tiene user_id
        if ($proforma->cliente?->user_id) {
            $userIds[] = $proforma->cliente->user_id;
        }

        // 👤 Agregar preventista creador si existe
        if ($proforma->usuario_creador_id) {
            $userIds[] = $proforma->usuario_creador_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('proforma.aprobada', $eventData, $userIds, $roles);
    }

    /**
     * ✅ MEJORADO: Notificar rechazo de proforma a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Cliente propietario (CRÍTICO: debe saber que fue rechazada)
     * - Preventista que creó (CRÍTICO: debe saber que fue rechazada)
     * - Admins/Managers/Cajeros (web) para supervisión
     */
    public function notifyRejected($proforma, ?string $motivoRechazo = null): bool
    {
        $eventData = [
            'id' => $proforma->id,
            'numero' => $proforma->numero,
            'cliente_id' => $proforma->cliente_id,
            'clienteNombre' => $proforma->cliente?->nombre ?? 'Cliente',
            'estado' => $proforma->estado,
            'usuario_rechazador' => [
                'id' => $proforma->usuario_aprobador_id ?? auth()->id(),
                'name' => $proforma->usuarioAprobador?->name ?? auth()->user()?->name ?? 'Sistema',
            ],
            'motivo_rechazo' => $motivoRechazo ?? 'Sin motivo especificado',
            'fecha_rechazo' => now()->toIso8601String(),
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'manager', 'cajero'];

        // 📱 Agregar cliente si tiene user_id (CRÍTICO)
        if ($proforma->cliente?->user_id) {
            $userIds[] = $proforma->cliente->user_id;
        }

        // 👤 Agregar preventista creador si existe (CRÍTICO)
        if ($proforma->usuario_creador_id) {
            $userIds[] = $proforma->usuario_creador_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('proforma.rechazada', $eventData, $userIds, $roles);
    }

    /**
     * ✅ MEJORADO: Notificar conversión de proforma a venta a MÚLTIPLES CANALES
     * Notifica simultáneamente a:
     * - Cliente propietario (mobile/web): "Tu pedido ha sido confirmado"
     * - Preventista que creó (web): "Tu proforma fue convertida"
     * - Logística (web): "Hay una nueva venta para preparar"
     * - Cobradores (web): "Hay una nueva venta para cobrar"
     * - Admins/Managers (web) para supervisión
     */
    public function notifyConverted($proforma, $venta): bool
    {
        $eventData = [
            'proforma_id' => $proforma->id,
            'proforma_numero' => $proforma->numero,
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero ?? null,
            'cliente_id' => $proforma->cliente_id,
            'clienteNombre' => $proforma->cliente?->nombre ?? 'Cliente',
            'total' => (float) $proforma->total,
            'fecha_conversion' => now()->toIso8601String(),
        ];

        // 🎯 Recopilar usuarios y roles a notificar
        $userIds = [];
        $roles = ['admin', 'manager', 'logistica', 'cobrador'];

        // 📱 Agregar cliente si tiene user_id (propietario del pedido)
        if ($proforma->cliente?->user_id) {
            $userIds[] = $proforma->cliente->user_id;
        }

        // 👤 Agregar preventista creador si existe (quería saber que se convirtió)
        if ($proforma->usuario_creador_id) {
            $userIds[] = $proforma->usuario_creador_id;
        }

        // ✅ Enviar a múltiples canales en un solo evento
        return $this->notifyMultiChannel('proforma.convertida', $eventData, $userIds, $roles);
    }

    /**
     * ✅ NUEVO: Notificar directamente al cliente cuando su proforma se convierte a venta
     * Incluye user_id para enrutamiento correcto en WebSocket
     */
    public function notifyClientConverted($proforma, $venta): bool
    {
        return $this->send('notify/cliente-proforma-converted', [
            'cliente_id' => $proforma->cliente_id,
            'user_id' => $proforma->cliente?->user_id, // ✅ CRÍTICO: user_id es el ID real del usuario conectado
            'cliente_nombre' => $proforma->cliente?->nombre ?? 'Cliente',
            'proforma_id' => $proforma->id,
            'proforma_numero' => $proforma->numero,
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero ?? null,
            'total' => (float) $venta->total ?? (float) $proforma->total,
            'fecha_conversion' => now()->toIso8601String(),
            'tipo_notificacion' => 'cliente', // Identificar que es para el cliente
        ]);
    }

    /**
     * ✅ NUEVO: Notificar actualización de proforma
     */
    public function notifyUpdated($proforma): bool
    {
        return $this->send('notify/proforma-updated', [
            'id' => $proforma->id,
            'numero' => $proforma->numero,
            'cliente_id' => $proforma->cliente_id,
            'user_id' => $proforma->cliente?->user_id,
            'cliente' => [
                'id' => $proforma->cliente_id,
                'nombre' => $proforma->cliente?->nombre ?? 'Cliente',
                'apellido' => $proforma->cliente?->apellido ?? '',
            ],
            'subtotal' => (float) $proforma->subtotal,
            'impuesto' => (float) $proforma->impuesto,
            'total' => (float) $proforma->total,
            'estado' => $proforma->estado,
            'tipo_entrega' => $proforma->tipo_entrega,
            'politica_pago' => $proforma->politica_pago,
            'fecha_entrega_solicitada' => $proforma->fecha_entrega_solicitada?->toIso8601String(),
            'hora_entrega_solicitada' => $proforma->hora_entrega_solicitada,
            'hora_entrega_solicitada_fin' => $proforma->hora_entrega_solicitada_fin,
            'items' => ($proforma->detalles ?? collect())->map(function ($item) {
                return [
                    'producto_id' => $item->producto_id,
                    'producto_nombre' => $item->producto?->nombre ?? 'Producto',
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => (float) $item->precio_unitario,
                    'subtotal' => (float) $item->subtotal,
                ];
            })->toArray(),
            'fecha_actualizacion' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar actualización de coordinación de entrega
     */
    public function notifyCoordination($proforma, int $usuarioId): bool
    {
        return $this->send('notify/proforma-coordination', [
            'id' => $proforma->id,
            'numero' => $proforma->numero,
            'cliente_id' => $proforma->cliente_id,
            'usuario_actualizo' => [
                'id' => $usuarioId,
                'name' => \App\Models\User::find($usuarioId)?->name ?? 'Sistema',
            ],
            'coordinacion_actualizada_en' => $proforma->coordinacion_actualizada_en?->toIso8601String(),
            'numero_intentos_contacto' => $proforma->numero_intentos_contacto ?? 0,
            'resultado_ultimo_intento' => $proforma->resultado_ultimo_intento,
            'fecha_entrega_confirmada' => $proforma->fecha_entrega_confirmada?->toIso8601String(),
            'hora_entrega_confirmada' => $proforma->hora_entrega_confirmada,
            'entregado_en' => $proforma->entregado_en?->toIso8601String(),
            'entregado_a' => $proforma->entregado_a,
            'observaciones_entrega' => $proforma->observaciones_entrega,
        ]);
    }
}
