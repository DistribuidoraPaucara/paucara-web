<?php

namespace App\Services\WebSocket;

use App\Models\Venta;
use App\Models\EstadoLogistica;

/**
 * VentaWebSocketService
 *
 * Servicio especializado para notificaciones WebSocket de ventas
 * Centralizado en tabla estados_logistica
 *
 * RESPONSABILIDADES:
 * ✓ Notificar al cliente cambios de estado de su venta
 * ✓ Notificar al admin cambios de estado de cualquier venta
 * ✓ Usar estados_logistica como fuente centralizada
 * ✓ Incluir información de entrega si la venta está siendo entregada
 *
 * DESTINATARIOS:
 * - Cliente (via cliente.{cliente_id})
 * - Admin (via admin.logistica)
 * - Chofer si la entrega está asignada (via chofer.{chofer_id})
 */
class VentaWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar cambio de estado de venta
     *
     * FLUJO:
     * 1. Se llama cuando VentaEstadoCambiado event es procesado
     * 2. Envía HTTP POST a Node.js WebSocket
     * 3. Node.js emite a todos los interesados (cliente, admin, chofer)
     *
     * @param Venta $venta
     * @param EstadoLogistica|null $estadoAnterior Puede ser null en primera creación
     * @param EstadoLogistica|null $estadoNuevo
     * @param string $razon Motivo del cambio (ej: "Asignación de entrega")
     */
    public function notifyEstadoCambiado(
        Venta $venta,
        ?EstadoLogistica $estadoAnterior,
        ?EstadoLogistica $estadoNuevo,
        string $razon = 'Cambio de estado'
    ): bool {
        if (!$estadoNuevo) {
            \Log::warning('VentaWebSocketService: Estado nuevo es null', [
                'venta_id' => $venta->id,
            ]);
            return false;
        }

        // Obtener datos de entrega si existe
        $entregaData = null;
        if ($venta->entrega_id && $venta->entrega) {
            $entregaData = [
                'id' => $venta->entrega->id,
                'numero' => $venta->entrega->numero ?? "#E-{$venta->entrega->id}",
                'chofer' => $venta->entrega->chofer ? [
                    'id' => $venta->entrega->chofer->id,
                    'nombre' => $venta->entrega->chofer->user->nombre ?? 'Chofer sin nombre',
                ] : null,
                'vehiculo' => $venta->entrega->vehiculo ? [
                    'placa' => $venta->entrega->vehiculo->placa,
                    'marca' => $venta->entrega->vehiculo->marca,
                ] : null,
                'estado' => $venta->entrega->estado,
            ];
        }

        // Enviar notificación al WebSocket
        return $this->send('notify/venta-estado-cambio', [
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'cliente_id' => $venta->cliente_id,
            'user_id' => $venta->cliente?->user_id,
            'cliente' => $venta->cliente ? [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->nombre,
            ] : null,
            'estado_anterior' => $estadoAnterior ? [
                'id' => $estadoAnterior->id,
                'codigo' => $estadoAnterior->codigo,
                'nombre' => $estadoAnterior->nombre,
                'color' => $estadoAnterior->color,
                'icono' => $estadoAnterior->icono,
            ] : null,
            'estado_nuevo' => [
                'id' => $estadoNuevo->id,
                'codigo' => $estadoNuevo->codigo,
                'nombre' => $estadoNuevo->nombre,
                'color' => $estadoNuevo->color,
                'icono' => $estadoNuevo->icono,
                'es_estado_final' => $estadoNuevo->es_estado_final ?? false,
            ],
            'entrega' => $entregaData,
            'razon' => $razon,
            'total' => $venta->total,
            'fecha_cambio' => now()->toIso8601String(),
            'categoria' => 'venta_logistica', // ← Identificar que es estado de venta
        ]);
    }

    /**
     * Notificar que venta está en tránsito
     * (Notificación especial con enfoque en tracking)
     */
    public function notifyEnTransito(Venta $venta, ?EstadoLogistica $estadoTransito = null): bool
    {
        if (!$estadoTransito) {
            $estadoTransito = \App\Models\EstadoLogistica::where('codigo', 'EN_TRANSITO')
                ->where('categoria', 'venta_logistica')
                ->first();
        }

        if (!$estadoTransito) {
            return false;
        }

        return $this->send('notify/venta-en-transito', [
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'cliente_id' => $venta->cliente_id,
            'user_id' => $venta->cliente?->user_id,
            'estado_codigo' => 'EN_TRANSITO',
            'estado_nombre' => 'En Tránsito',
            'cliente' => $venta->cliente ? [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->nombre,
            ] : null,
            'entrega' => $venta->entrega ? [
                'id' => $venta->entrega->id,
                'numero' => $venta->entrega->numero,
                'chofer' => $venta->entrega->chofer ? [
                    'nombre' => $venta->entrega->chofer->user->nombre ?? 'Chofer',
                    'telefono' => $venta->entrega->chofer->user->telefono ?? null,
                ] : null,
                'vehiculo' => $venta->entrega->vehiculo ? [
                    'placa' => $venta->entrega->vehiculo->placa,
                ] : null,
            ] : null,
            'mensaje' => 'Tu venta está en camino',
            'fecha_cambio' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar que venta fue entregada
     */
    public function notifyEntregada(Venta $venta, ?EstadoLogistica $estadoEntregado = null): bool
    {
        if (!$estadoEntregado) {
            $estadoEntregado = \App\Models\EstadoLogistica::where('codigo', 'ENTREGADA')
                ->where('categoria', 'venta_logistica')
                ->first();
        }

        if (!$estadoEntregado) {
            return false;
        }

        return $this->send('notify/venta-entregada', [
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'cliente_id' => $venta->cliente_id,
            'user_id' => $venta->cliente?->user_id,
            'estado_codigo' => 'ENTREGADA',
            'estado_nombre' => 'Entregada',
            'cliente' => $venta->cliente ? [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->nombre,
            ] : null,
            'entrega' => $venta->entrega ? [
                'id' => $venta->entrega->id,
                'numero' => $venta->entrega->numero,
            ] : null,
            'total' => $venta->total,
            'mensaje' => 'Tu venta ha sido entregada',
            'fecha_entrega' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar problemas en entrega
     */
    public function notifyProblema(Venta $venta, string $motivo = 'Problema en entrega'): bool
    {
        $estadoProblema = \App\Models\EstadoLogistica::where('codigo', 'PROBLEMAS')
            ->where('categoria', 'venta_logistica')
            ->first();

        if (!$estadoProblema) {
            return false;
        }

        return $this->send('notify/venta-problema', [
            'venta_id' => $venta->id,
            'venta_numero' => $venta->numero,
            'cliente_id' => $venta->cliente_id,
            'user_id' => $venta->cliente?->user_id,
            'estado_codigo' => 'PROBLEMAS',
            'estado_nombre' => 'Problemas',
            'color' => $estadoProblema->color,
            'cliente' => $venta->cliente ? [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->nombre,
            ] : null,
            'motivo' => $motivo,
            'entrega' => $venta->entrega ? [
                'id' => $venta->entrega->id,
                'numero' => $venta->entrega->numero,
            ] : null,
            'mensaje' => 'Hay un problema con tu entrega',
            'fecha_cambio' => now()->toIso8601String(),
        ]);
    }
}
