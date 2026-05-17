<?php

namespace App\Services;

use App\Models\AperturaCaja;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Service para obtener la caja abierta del usuario actual
 *
 * Reutilizable en cualquier controller o service que necesite
 * verificar si el usuario tiene una caja abierta
 */
class CajaAbiertaService
{
    /**
     * Obtener la apertura abierta del usuario actual
     *
     * @return AperturaCaja|null
     */
    public function obtenerAperturaAbierta(): ?AperturaCaja
    {
        $usuario = Auth::user();

        if (!$usuario) {
            Log::warning('CajaAbiertaService: Usuario no autenticado');
            return null;
        }

        $apertura = AperturaCaja::where('user_id', $usuario->id)
            ->abiertas() // Usa el scope que busca sin cierre
            ->latest()
            ->first();

        if ($apertura) {
            Log::debug('✅ CajaAbiertaService: Apertura abierta encontrada', [
                'user_id' => $usuario->id,
                'caja_id' => $apertura->caja_id,
                'apertura_id' => $apertura->id,
                'fecha' => $apertura->fecha,
            ]);
        } else {
            Log::debug('⚠️ CajaAbiertaService: No hay caja abierta para el usuario', [
                'user_id' => $usuario->id,
            ]);
        }

        return $apertura;
    }

    /**
     * Obtener el ID de la caja abierta del usuario actual
     *
     * @return int|null
     */
    public function obtenerCajaIdAbierta(): ?int
    {
        return $this->obtenerAperturaAbierta()?->caja_id;
    }

    /**
     * Verificar si el usuario tiene una caja abierta
     *
     * @return bool
     */
    public function tieneCajaAbierta(): bool
    {
        return $this->obtenerAperturaAbierta() !== null;
    }

    /**
     * Obtener la apertura abierta O lanzar excepción si no existe
     *
     * @throws \RuntimeException
     * @return AperturaCaja
     */
    public function obtenerAperturaAbertaOFail(): AperturaCaja
    {
        $apertura = $this->obtenerAperturaAbierta();

        if (!$apertura) {
            $usuario = Auth::user();
            Log::error('CajaAbiertaService: Usuario intenta crear venta sin caja abierta', [
                'user_id' => $usuario?->id,
                'usuario' => $usuario?->name,
            ]);

            throw new \RuntimeException(
                'No tienes una caja abierta. Abre una caja antes de registrar ventas.'
            );
        }

        return $apertura;
    }

    /**
     * ✅ NUEVO (2026-03-09): Obtener resumen de movimientos agrupado por tipo de pago
     *
     * Útil para el cuadre de caja: saber cuánto hay en efectivo, QR, transferencia, etc
     *
     * @return array Formato: [
     *     'total_general' => 1200.00,
     *     'por_tipo_pago' => [
     *         ['tipo_pago_id' => 1, 'nombre' => 'Efectivo', 'total' => 500.00],
     *         ['tipo_pago_id' => 3, 'nombre' => 'QR Code', 'total' => 700.00],
     *     ]
     * ]
     */
    public function obtenerResumenMovimientosPorTipoPago(): array
    {
        $apertura = $this->obtenerAperturaAbierta();

        if (!$apertura) {
            return [
                'total_general' => 0,
                'por_tipo_pago' => [],
            ];
        }

        // Obtener movimientos de la caja abierta, agrupados por tipo_pago_id
        $movimientos = \App\Models\MovimientoCaja::where('caja_id', $apertura->caja_id)
            ->whereDate('fecha', today())  // Solo movimientos de hoy
            ->with('tipoPago')  // Cargar relación con TipoPago
            ->get()
            ->groupBy('tipo_pago_id');

        $totalGeneral = 0;
        $porTipoPago = [];

        foreach ($movimientos as $tipoPagoId => $movs) {
            $subtotal = $movs->sum('monto');
            $totalGeneral += $subtotal;

            // Obtener nombre del tipo de pago
            $tipoPago = $movs->first()?->tipoPago;

            $porTipoPago[] = [
                'tipo_pago_id' => $tipoPagoId,
                'nombre' => $tipoPago?->nombre ?? 'Desconocido',
                'total' => (float) $subtotal,
                'cantidad_movimientos' => $movs->count(),
            ];
        }

        // Ordenar por nombre para consistencia
        usort($porTipoPago, fn($a, $b) => strcmp($a['nombre'], $b['nombre']));

        Log::debug('💰 CajaAbiertaService: Resumen de movimientos por tipo de pago', [
            'apertura_id' => $apertura->id,
            'total_general' => $totalGeneral,
            'cantidad_tipos_pago' => count($porTipoPago),
        ]);

        return [
            'total_general' => (float) $totalGeneral,
            'por_tipo_pago' => $porTipoPago,
        ];
    }
}
