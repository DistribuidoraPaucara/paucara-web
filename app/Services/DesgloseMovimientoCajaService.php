<?php

namespace App\Services;

use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoPago;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class DesgloseMovimientoCajaService
{
    /**
     * ✅ NUEVO: Obtener desglose de movimientos de caja por tipo de pago
     * Separa entradas (ingresos) y salidas (egresos) en Efectivo y Transferencia
     */
    public function obtenerDesgloseMovimientos(AperturaCaja $apertura): array
    {
        $movimientos = $apertura->movimientoCaja()
            ->with('tipoPago', 'tipoOperacion')
            ->get();

        // Obtener IDs de tipos de pago
        $idEfectivo = TipoPago::where('codigo', 'EFECTIVO')->first()?->id;
        $idTransferencia = TipoPago::where('codigo', 'TRANSFERENCIA/QR')->first()?->id;

        // Inicializar totales
        $desglose = [
            'entradas' => [
                'efectivo' => 0,
                'transferencia' => 0,
                'total' => 0,
            ],
            'salidas' => [
                'efectivo' => 0,
                'transferencia' => 0,
                'total' => 0,
            ],
            'totales' => [
                'efectivo' => 0,
                'transferencia' => 0,
                'general' => 0,
            ],
        ];

        // Procesar cada movimiento
        foreach ($movimientos as $mov) {
            $monto = floatval($mov->monto);
            $direccion = $mov->tipoOperacion?->direccion ?? '';

            // Clasificar por tipo de pago y dirección
            if ($mov->tipo_pago_id === $idEfectivo) {
                if ($direccion === 'ENTRADA') {
                    $desglose['entradas']['efectivo'] += $monto;
                } elseif ($direccion === 'SALIDA') {
                    $desglose['salidas']['efectivo'] += $monto;
                }
                $desglose['totales']['efectivo'] += $monto;
            } elseif ($mov->tipo_pago_id === $idTransferencia) {
                if ($direccion === 'ENTRADA') {
                    $desglose['entradas']['transferencia'] += $monto;
                } elseif ($direccion === 'SALIDA') {
                    $desglose['salidas']['transferencia'] += $monto;
                }
                $desglose['totales']['transferencia'] += $monto;
            }
        }

        // Calcular totales
        $desglose['entradas']['total'] = $desglose['entradas']['efectivo'] + $desglose['entradas']['transferencia'];
        $desglose['salidas']['total'] = $desglose['salidas']['efectivo'] + $desglose['salidas']['transferencia'];
        $desglose['totales']['general'] = $desglose['totales']['efectivo'] + $desglose['totales']['transferencia'];

        return $desglose;
    }

    /**
     * ✅ NUEVO: Obtener desglose de movimientos para un usuario en una fecha específica
     */
    public function obtenerDesgloseMovimientosDelDia(int $userId, ?\DateTime $fecha = null): array
    {
        if (!$fecha) {
            $fecha = now();
        }

        $apertura = AperturaCaja::where('user_id', $userId)
            ->whereDate('fecha', $fecha->toDateString())
            ->first();

        if (!$apertura) {
            return $this->obtenerEstructuraVacia();
        }

        return $this->obtenerDesgloseMovimientos($apertura);
    }

    /**
     * ✅ NUEVO: Estructura vacía para cuando no hay movimientos
     */
    private function obtenerEstructuraVacia(): array
    {
        return [
            'entradas' => [
                'efectivo' => 0,
                'transferencia' => 0,
                'total' => 0,
            ],
            'salidas' => [
                'efectivo' => 0,
                'transferencia' => 0,
                'total' => 0,
            ],
            'totales' => [
                'efectivo' => 0,
                'transferencia' => 0,
                'general' => 0,
            ],
        ];
    }
}
