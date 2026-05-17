<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pago;
use App\Models\CuentaPorCobrar;

class RegularizarPagoCuentas extends Command
{
    protected $signature = 'pagos:regularizar-cuentas {--dry-run : Simular sin hacer cambios}';
    protected $description = 'Vincula todos los pagos con sus cuentas por cobrar basándose en venta_id';

    public function handle()
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('🔍 Modo SIMULACIÓN - No se realizarán cambios');
            $this->line('');
        }

        // Obtener todos los pagos sin cuenta_por_cobrar_id
        $pagosSinAsociar = Pago::whereNull('cuenta_por_cobrar_id')
            ->with('venta')
            ->orderBy('id')
            ->get();

        if ($pagosSinAsociar->isEmpty()) {
            $this->info('✅ Todos los pagos ya están asociados correctamente!');
            return Command::SUCCESS;
        }

        $this->info('📋 Regularizando ' . $pagosSinAsociar->count() . ' pagos...');
        $this->line('');

        $actualizados = 0;
        $noEncontrados = 0;
        $errores = [];

        foreach ($pagosSinAsociar as $pago) {
            // Buscar la cuenta por cobrar correspondiente
            $cuenta = CuentaPorCobrar::where('venta_id', $pago->venta_id)
                ->first();

            if ($cuenta) {
                $this->line(sprintf(
                    "✅ Pago #%d: Venta #%s → Cuenta #%d (Monto: %.2f)",
                    $pago->id,
                    $pago->venta?->numero ?? 'N/A',
                    $cuenta->id,
                    $pago->monto
                ));

                if (!$dryRun) {
                    $pago->update(['cuenta_por_cobrar_id' => $cuenta->id]);
                }

                $actualizados++;
            } else {
                $this->line(sprintf(
                    "⚠️  Pago #%d: Venta #%s → NO ENCONTRADA (Monto: %.2f)",
                    $pago->id,
                    $pago->venta?->numero ?? 'N/A',
                    $pago->monto
                ));

                $noEncontrados++;
                $errores[] = [
                    'pago_id' => $pago->id,
                    'venta_id' => $pago->venta_id,
                    'razon' => 'Venta no tiene cuenta por cobrar asociada'
                ];
            }
        }

        $this->line('');
        $this->info('=== RESUMEN ===');
        $this->info("Pagos actualizados: {$actualizados}");
        $this->warn("Pagos no encontrados: {$noEncontrados}");

        if (!empty($errores)) {
            $this->line('');
            $this->warn('⚠️  Pagos con problemas:');
            foreach ($errores as $error) {
                $this->line(sprintf(
                    "   - Pago #%d (Venta #%d): %s",
                    $error['pago_id'],
                    $error['venta_id'],
                    $error['razon']
                ));
            }
        }

        if ($dryRun) {
            $this->info('');
            $this->comment('💡 Para ejecutar realmente, corre: php artisan pagos:regularizar-cuentas');
        } else {
            $this->line('');
            $this->info('✨ Regularización completada!');
        }

        return Command::SUCCESS;
    }
}
