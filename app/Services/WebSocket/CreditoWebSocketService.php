<?php

namespace App\Services\WebSocket;

use App\Models\Cliente;
use App\Models\CuentaPorCobrar;
use App\Models\Pago;

/**
 * Servicio especializado para notificaciones WebSocket de Créditos
 *
 * Extiende BaseWebSocketService para heredar:
 * - Método send() con reintentos
 * - Configuración de URL y timeout
 * - Headers de autenticación
 */
class CreditoWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar creación de cuenta por cobrar (crédito creado)
     *
     * Endpoint: POST /notify/credito-creado
     */
    public function notifyCreated(CuentaPorCobrar $cuenta): bool
    {
        return $this->send('notify/credito-creado', [
            'cuenta_por_cobrar_id' => $cuenta->id,
            'cliente_id' => $cuenta->cliente_id,
            'cliente_nombre' => $cuenta->cliente?->nombre ?? 'Cliente',
            'venta_id' => $cuenta->venta_id,
            'numero_venta' => $cuenta->venta?->numero ?? '',
            'monto_original' => (float) $cuenta->monto_original,
            'saldo_pendiente' => (float) $cuenta->saldo_pendiente,
            'fecha_vencimiento' => $cuenta->fecha_vencimiento->toIso8601String(),
            'dias_vencido' => $cuenta->dias_vencido,
            'estado' => $cuenta->estado,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar pago registrado de crédito
     *
     * Endpoint: POST /notify/credito-pago-registrado
     */
    public function notifyPagoRegistrado(Pago $pago, CuentaPorCobrar $cuenta): bool
    {
        return $this->send('notify/credito-pago-registrado', [
            'pago_id' => $pago->id,
            'cuenta_por_cobrar_id' => $cuenta->id,
            'cliente_id' => $cuenta->cliente_id,
            'cliente_nombre' => $cuenta->cliente?->nombre ?? 'Cliente',
            'venta_id' => $cuenta->venta_id,
            'numero_venta' => $cuenta->venta?->numero ?? '',
            'monto' => (float) $pago->monto,
            'saldo_restante' => (float) $cuenta->saldo_pendiente,
            'metodo_pago' => $pago->tipoPago?->nombre ?? 'efectivo',
            'numero_recibo' => $pago->numero_recibo ?? '',
            'usuario_nombre' => $pago->usuario?->name ?? 'Sistema',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar crédito vencido
     *
     * Endpoint: POST /notify/credito-vencido
     */
    public function notifyVencido(CuentaPorCobrar $cuenta): bool
    {
        return $this->send('notify/credito-vencido', [
            'cuenta_por_cobrar_id' => $cuenta->id,
            'cliente_id' => $cuenta->cliente_id,
            'cliente_nombre' => $cuenta->cliente?->nombre ?? 'Cliente',
            'venta_id' => $cuenta->venta_id,
            'numero_venta' => $cuenta->venta?->numero ?? '',
            'saldo_pendiente' => (float) $cuenta->saldo_pendiente,
            'dias_vencido' => $cuenta->dias_vencido,
            'fecha_vencimiento' => $cuenta->fecha_vencimiento->toIso8601String(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar crédito crítico (cliente con >80% de utilización)
     *
     * Endpoint: POST /notify/credito-critico
     */
    public function notifyCritico(Cliente $cliente, float $porcentaje, float $saldoDisponible): bool
    {
        return $this->send('notify/credito-critico', [
            'cliente_id' => $cliente->id,
            'cliente_nombre' => $cliente->nombre ?? 'Cliente',
            'limite_credito' => (float) $cliente->limite_credito,
            'saldo_disponible' => (float) $saldoDisponible,
            'porcentaje_utilizado' => round($porcentaje, 2),
            'cantidad_cuentas_pendientes' => $cliente->cuentasPorCobrar->count(),
            'monto_total_pendiente' => (float) $cliente->cuentasPorCobrar->sum('saldo_pendiente'),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
