<?php

namespace App\Console\Commands;

use App\Models\Pago;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class GenerarNumeroPagos extends Command
{
    protected $signature = 'pagos:generar-numeros';

    protected $description = 'Genera números únicos para pagos existentes que no tienen numero_pago asignado';

    public function handle()
    {
        $this->info('🔄 Iniciando generación de números de pago...');

        // Obtener pagos sin numero_pago
        $pagosaSinNumero = Pago::whereNull('numero_pago')
            ->orderBy('created_at')
            ->get();

        if ($pagosaSinNumero->isEmpty()) {
            $this->info('✅ No hay pagos sin número de pago. ¡Todo está actualizado!');
            return;
        }

        $total = $pagosaSinNumero->count();
        $this->info("📊 Encontrados {$total} pago(s) sin número asignado");

        // Agrupar por fecha para generar números secuenciales por día
        $pagosPorFecha = $pagosaSinNumero->groupBy(function ($pago) {
            return $pago->created_at->format('Ymd');
        });

        $contadorTotal = 0;

        foreach ($pagosPorFecha as $fecha => $pagosDia) {
            $secuencial = 1;

            foreach ($pagosDia as $pago) {
                $numeroPago = sprintf('PAGO-%s-%05d', $fecha, $secuencial);

                try {
                    $pago->update(['numero_pago' => $numeroPago]);
                    $this->line("✅ Pago #{$pago->id} → {$numeroPago}");
                    $contadorTotal++;
                    $secuencial++;
                } catch (\Exception $e) {
                    $this->error("❌ Error al actualizar pago #{$pago->id}: " . $e->getMessage());
                }
            }
        }

        $this->info("✨ Completado: {$contadorTotal} pago(s) actualizados con éxito");
    }
}
