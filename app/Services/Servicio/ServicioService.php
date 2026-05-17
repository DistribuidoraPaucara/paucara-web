<?php

namespace App\Services\Servicio;

use App\DTOs\Servicio\CrearServicioDTO;
use App\Models\Servicio;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Services\Traits\ManagesTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ServicioService
{
    use ManagesTransactions;

    /**
     * Crear un servicio y registrar ingreso en caja
     */
    public function crear(CrearServicioDTO $dto, int $cajaId): Servicio
    {
        Log::info('🔄 [ServicioService::crear] Iniciando creación de servicio', [
            'cliente_id' => $dto->cliente_id,
            'monto' => $dto->monto,
            'tipo_pago_id' => $dto->tipo_pago_id,
        ]);

        return $this->transaction(function () use ($dto, $cajaId) {
            // Crear servicio
            $servicio = Servicio::create([
                'numero' => Servicio::generarNumero(),
                'fecha' => now()->toDateString(),
                'cliente_id' => $dto->cliente_id,
                'usuario_id' => Auth::id(),
                'caja_id' => $cajaId,
                'descripcion' => $dto->descripcion,
                'monto' => $dto->monto,
                'tipo_pago_id' => $dto->tipo_pago_id,
                'observaciones' => $dto->observaciones,
            ]);

            Log::info('✅ [ServicioService::crear] Servicio creado', [
                'servicio_id' => $servicio->id,
                'numero' => $servicio->numero,
            ]);

            // Registrar movimiento en caja
            $this->registrarMovimientoCaja($servicio, $cajaId);

            Log::info('✅ [ServicioService::crear] Servicio completado', [
                'servicio_id' => $servicio->id,
                'numero' => $servicio->numero,
                'monto' => $servicio->monto,
            ]);

            return $servicio->load(['cliente', 'usuario', 'tipoPago']);
        });
    }

    /**
     * Registrar movimiento de caja para el servicio
     */
    private function registrarMovimientoCaja(Servicio $servicio, int $cajaId): void
    {
        // Obtener tipo de operación SERVICIO
        $tipoOperacion = TipoOperacionCaja::where('codigo', 'SERVICIO')->first();

        if (!$tipoOperacion) {
            Log::warning("⚠️ [ServicioService] Tipo de operación 'SERVICIO' no encontrado");
            return;
        }

        if (!$cajaId) {
            Log::error('❌ [ServicioService] No hay caja_id - El middleware debería haberlo validado', [
                'user_id' => Auth::id(),
            ]);
            return;
        }

        MovimientoCaja::create([
            'caja_id' => $cajaId,
            'user_id' => Auth::id(),
            'fecha' => now(),
            'monto' => $servicio->monto, // Positivo = ingreso
            'observaciones' => 'Servicio: ' . $servicio->descripcion,
            'numero_documento' => $servicio->numero,
            'tipo_operacion_id' => $tipoOperacion->id,
            'tipo_pago_id' => $servicio->tipo_pago_id,
        ]);

        Log::info('✅ [ServicioService] Movimiento de caja registrado', [
            'servicio_numero' => $servicio->numero,
            'monto' => $servicio->monto,
            'caja_id' => $cajaId,
        ]);
    }
}
