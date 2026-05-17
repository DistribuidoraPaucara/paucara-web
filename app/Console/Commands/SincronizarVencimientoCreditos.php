<?php

namespace App\Console\Commands;

use App\Models\CuentaPorCobrar;
use Illuminate\Console\Command;

class SincronizarVencimientoCreditos extends Command
{
    protected $signature = 'creditos:sincronizar-vencimiento {--dias=7}';

    protected $description = 'Sincroniza las fechas de vencimiento de cuentas por cobrar a 7 días desde su creación';

    public function handle()
    {
        $diasCredito = (int) $this->option('dias');

        $this->info("🔄 Sincronizando fechas de vencimiento...\n");
        $this->info("📌 Política: Todos los créditos vencen en $diasCredito días desde su creación\n");

        // Obtener todas las cuentas por cobrar
        $cuentas = CuentaPorCobrar::all();

        if ($cuentas->isEmpty()) {
            $this->warn('ℹ️ No hay cuentas por cobrar para sincronizar.');
            return;
        }

        $this->info("📊 Total de cuentas: {$cuentas->count()}\n");

        $actualizadas = 0;
        $yaCorrectas = 0;
        $errores = 0;

        foreach ($cuentas as $cuenta) {
            try {
                // Calcular fecha de vencimiento correcta: creación + 7 días
                $fechaVencimientoCorrecta = $cuenta->created_at->copy()->addDays($diasCredito);
                $fechaActual = $cuenta->fecha_vencimiento;

                // Si ya coincide, continuar
                if ($fechaActual->format('Y-m-d') === $fechaVencimientoCorrecta->format('Y-m-d')) {
                    $this->line("✓ Cuenta #{$cuenta->id} - Ya tiene vencimiento correcto ({$fechaVencimientoCorrecta->toDateString()})");
                    $yaCorrectas++;
                    continue;
                }

                // Actualizar fecha de vencimiento
                $this->line("⏳ Actualizando Cuenta #{$cuenta->id}");
                $this->line("   ├─ Creada: {$cuenta->created_at->toDateString()}");
                $this->line("   ├─ Vencimiento anterior: {$fechaActual->toDateString()}");

                $cuenta->update([
                    'fecha_vencimiento' => $fechaVencimientoCorrecta,
                    'dias_vencido' => $this->calcularDiasVencido($fechaVencimientoCorrecta),
                ]);

                $this->line("   └─ ✅ Vencimiento actualizado a: {$fechaVencimientoCorrecta->toDateString()}\n", 'info');
                $actualizadas++;

            } catch (\Exception $e) {
                $this->line("   ❌ Error: {$e->getMessage()}\n", 'error');
                $errores++;
            }
        }

        // Resumen
        $this->newLine();
        $this->info('═══════════════════════════════════════════');
        $this->info('📊 RESUMEN DE SINCRONIZACIÓN');
        $this->info('═══════════════════════════════════════════');
        $this->line("✅ Actualizadas: $actualizadas");
        $this->line("✓  Ya correctas: $yaCorrectas");
        $this->line("❌ Errores: $errores");
        $this->info('═══════════════════════════════════════════');

        // Verificar cuentas vencidas
        $venturedidas = CuentaPorCobrar::where('dias_vencido', '>', 0)->count();
        if ($venturedidas > 0) {
            $this->warn("\n⚠️  CUENTAS VENCIDAS DETECTADAS: $venturedidas");
        }
    }

    private function calcularDiasVencido($fechaVencimiento)
    {
        $ahora = now();
        if ($ahora->isAfter($fechaVencimiento)) {
            return (int) $ahora->diffInDays($fechaVencimiento);
        }
        return 0;
    }
}
