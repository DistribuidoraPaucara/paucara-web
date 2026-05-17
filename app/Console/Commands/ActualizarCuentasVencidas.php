<?php

namespace App\Console\Commands;

use App\Models\CuentaPorPagar;
use Illuminate\Console\Command;

class ActualizarCuentasVencidas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cuentas:actualizar-vencidas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza el estado y días vencidos de las cuentas por pagar';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Actualizando cuentas por pagar vencidas...');

        $cuentasActualizadas = 0;

        CuentaPorPagar::where('estado', '!=', 'PAGADO')
            ->chunk(100, function ($cuentas) use (&$cuentasActualizadas) {
                foreach ($cuentas as $cuenta) {
                    $diasVencido = 0;
                    $nuevoEstado = $cuenta->estado;

                    if ($cuenta->estaVencido()) {
                        $diasVencido = now()->diffInDays($cuenta->fecha_vencimiento);
                        $nuevoEstado = 'VENCIDO';
                    }

                    if ($cuenta->estaPagado()) {
                        $nuevoEstado = 'PAGADO';
                        $diasVencido = 0;
                    }

                    if ($cuenta->saldo_pendiente > 0 &&
                        $cuenta->saldo_pendiente < $cuenta->monto_original &&
                        ! $cuenta->estaVencido()) {
                        $nuevoEstado = 'PARCIAL';
                    }

                    if ($cuenta->estado !== $nuevoEstado || $cuenta->dias_vencido !== $diasVencido) {
                        $cuenta->update([
                            'estado' => $nuevoEstado,
                            'dias_vencido' => $diasVencido,
                        ]);
                        $cuentasActualizadas++;
                    }
                }
            });

        $this->info("Se actualizaron {$cuentasActualizadas} cuentas por pagar.");

        return 0;
    }
}
