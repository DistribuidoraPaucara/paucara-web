<?php

namespace App\Services;

use App\Events\CreditoCreado;
use App\Models\Cliente;
use App\Models\Venta;
use App\Models\CuentaPorCobrar;

class CreditoService
{
    /**
     * Validar si el cliente tiene crédito disponible para el monto especificado
     *
     * @return array ['valido' => bool, 'errores' => string[], 'saldo_disponible' => float]
     */
    public function validarCreditoDisponible(Cliente $cliente, float $monto): array
    {
        $errores = [];

        // Validar que el cliente esté habilitado para crédito
        if (!$cliente->puede_tener_credito) {
            $errores[] = "El cliente '{$cliente->nombre}' no está habilitado para realizar compras a crédito.";
        }

        // Validar que el cliente esté activo
        if (!$cliente->activo) {
            $errores[] = "El cliente '{$cliente->nombre}' está inactivo. No puede realizar compras a crédito.";
        }

        // Calcular saldo disponible
        $saldoDisponible = $cliente->calcularSaldoDisponible();

        // Validar que el monto no exceda el saldo disponible
        if ($monto > $saldoDisponible) {
            $errores[] = "El monto (Bs {$monto}) excede el saldo disponible de crédito (Bs {$saldoDisponible}).";
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores,
            'saldo_disponible' => $saldoDisponible,
            'saldo_utilizado' => $cliente->limite_credito - $saldoDisponible,
            'limite_credito' => $cliente->limite_credito,
        ];
    }

    /**
     * Crear una cuenta por cobrar cuando se crea una venta con crédito
     */
    public function crearCuentaPorCobrar(
        Venta $venta,
        ?int $diasVencimiento = 7,
    ): CuentaPorCobrar {
        $cuentaPorCobrar = CuentaPorCobrar::create([
            'venta_id' => $venta->id,
            'cliente_id' => $venta->cliente_id,
            'monto_original' => $venta->total,
            'saldo_pendiente' => $venta->total,
            'fecha_vencimiento' => now()->addDays($diasVencimiento),
            'dias_vencido' => 0,
            'estado' => 'pendiente',
        ]);

        // Registrar en auditoría del cliente
        $venta->cliente->registrarCambio(
            'crear_cuenta_cobrar',
            [
                'monto' => $venta->total,
                'venta_id' => $venta->id,
                'numero_venta' => $venta->numero,
            ],
            'Venta a crédito registrada'
        );

        // ✅ NUEVO: Disparar evento para notificación WebSocket
        event(new CreditoCreado($cuentaPorCobrar));

        return $cuentaPorCobrar;
    }

    /**
     * Obtener el porcentaje de utilización de crédito del cliente
     */
    public function obtenerPorcentajeUtilizacion(Cliente $cliente): float
    {
        if ($cliente->limite_credito <= 0) {
            return 0;
        }

        $saldoUtilizado = $cliente->limite_credito - $cliente->calcularSaldoDisponible();

        return round(($saldoUtilizado / $cliente->limite_credito) * 100, 2);
    }

    /**
     * Determinar el estado del crédito del cliente
     */
    public function determinarEstadoCredito(Cliente $cliente): string
    {
        if (!$cliente->puede_tener_credito) {
            return 'deshabilitado';
        }

        $porcentaje = $this->obtenerPorcentajeUtilizacion($cliente);

        if ($porcentaje > 100) {
            return 'excedido';
        } elseif ($porcentaje > 80) {
            return 'critico';
        } elseif ($porcentaje > 0) {
            return 'en_uso';
        }

        return 'disponible';
    }
}
