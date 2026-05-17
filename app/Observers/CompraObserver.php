<?php

namespace App\Observers;

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\TipoPago;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompraObserver
{
    /**
     * Handle the Compra "created" event.
     */
    public function created(Compra $compra): void
    {
        try {
            $this->manejarCuentaPorPagar($compra);
        } catch (\Exception $e) {
            Log::error('Error en CompraObserver::created', [
                'compra_id' => $compra->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // No lanzar excepción para evitar interrumpir la creación de la compra
        }
    }

    /**
     * Handle the Compra "updated" event.
     */
    public function updated(Compra $compra): void
    {
        try {
            // Si cambió el estado a RECIBIDO
            if ($compra->wasChanged('estado_documento_id')) {
                $estadoRecibido = \App\Models\EstadoDocumento::where('codigo', 'RECIBIDO')->first();

                if ($estadoRecibido && $compra->estado_documento_id == $estadoRecibido->id) {
                    // Manejar cuenta por pagar para créditos
                    $this->manejarCuentaPorPagar($compra);

                    // NOTA: La actualización de stock se maneja desde el CompraController
                    // para evitar duplicación de inventario
                }
            }
        } catch (\Exception $e) {
            Log::error('Error en CompraObserver::updated', [
                'compra_id' => $compra->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // No lanzar excepción para evitar interrumpir la actualización de la compra
        }
    }

    /**
     * Manejar la creación de cuenta por pagar para compras a crédito
     */
    private function manejarCuentaPorPagar(Compra $compra): void
    {
        // Solo crear cuenta por pagar si es compra a crédito y está en estado RECIBIDO
        $tipoPagoCredito = TipoPago::where('codigo', 'CREDITO')->first();
        $estadoRecibido = \App\Models\EstadoDocumento::where('codigo', 'RECIBIDO')->first();

        // Validar que existan los registros necesarios
        if (!$tipoPagoCredito || !$estadoRecibido) {
            Log::warning('No se encontraron registros de TipoPago CREDITO o EstadoDocumento RECIBIDO', [
                'compra_id' => $compra->id,
            ]);
            return;
        }

        if ($compra->tipo_pago_id == $tipoPagoCredito->id &&
            $compra->estado_documento_id == $estadoRecibido->id) {

            // Verificar si ya existe una cuenta por pagar usando count() para evitar carga de relación
            $existeCuentaPorPagar = CuentaPorPagar::where('compra_id', $compra->id)->exists();

            if (!$existeCuentaPorPagar) {
                CuentaPorPagar::create([
                    'compra_id' => $compra->id,
                    'monto_original' => $compra->total,
                    'saldo_pendiente' => $compra->total,
                    'fecha_vencimiento' => $this->calcularFechaVencimiento($compra),
                    'estado' => 'PENDIENTE',
                ]);

                Log::info('Cuenta por pagar creada', [
                    'compra_id' => $compra->id,
                    'monto' => $compra->total,
                ]);
            }
        }
    }

    /**
     * Calcular fecha de vencimiento (30 días por defecto)
     */
    private function calcularFechaVencimiento(Compra $compra): Carbon
    {
        // Validar que la fecha sea válida
        if (!$compra->fecha) {
            return Carbon::now()->addDays(30);
        }

        try {
            return Carbon::parse($compra->fecha)->addDays(30);
        } catch (\Exception $e) {
            Log::warning('Error al parsear fecha de compra, usando fecha actual', [
                'compra_id' => $compra->id,
                'fecha' => $compra->fecha,
                'error' => $e->getMessage(),
            ]);
            return Carbon::now()->addDays(30);
        }
    }
}
