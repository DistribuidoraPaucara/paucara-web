<?php

namespace App\Console\Commands;

use App\Events\CreditoVencido;
use App\Models\CuentaPorCobrar;
use Illuminate\Console\Command;

class DetectarCuentasVencidas extends Command
{
    protected $signature = 'creditos:detectar-vencidas';

    protected $description = 'Detecta y actualiza cuentas por cobrar que han vencido (más de 7 días)';

    public function handle()
    {
        $this->info("🔍 Detectando cuentas vencidas...\n");

        $ahora = now();

        // Obtener cuentas con saldo pendiente
        $cuentasPendientes = CuentaPorCobrar::where('saldo_pendiente', '>', 0)->get();

        if ($cuentasPendientes->isEmpty()) {
            $this->info('✅ No hay cuentas pendientes.');
            return;
        }

        $this->info("📊 Verificando {$cuentasPendientes->count()} cuentas pendientes...\n");

        $actualizadas = 0;
        $vencidas = 0;
        $porVencer = 0;
        $alDia = 0;
        $eventosVencidos = 0;

        $detallesVencidas = [];

        foreach ($cuentasPendientes as $cuenta) {
            $diasRestantes = (int) $cuenta->fecha_vencimiento->diffInDays($ahora, false);
            $diasVencido = max(0, (int) (-$diasRestantes));

            // Actualizar dias_vencido en BD si cambió
            if ($cuenta->dias_vencido !== $diasVencido) {
                $cuenta->update(['dias_vencido' => $diasVencido]);
                $actualizadas++;
            }

            // Clasificar
            if ($diasVencido > 0) {
                $vencidas++;
                $detallesVencidas[] = $cuenta;
                $estado = "🔴 VENCIDA";

                // 📢 Disparar evento de crédito vencido
                event(new CreditoVencido($cuenta));
                $eventosVencidos++;
            } elseif ($diasRestantes <= 3) {
                $porVencer++;
                $estado = "🟡 POR VENCER";
            } else {
                $alDia++;
                $estado = "🟢 AL DÍA";
            }

            $cliente = $cuenta->cliente->nombre ?? 'Cliente';
            $venta = $cuenta->venta->numero ?? 'Venta?';

            if ($diasVencido > 0 || $diasRestantes <= 3) {
                $this->line("$estado | Cuenta #{$cuenta->id} | {$venta} | {$cliente}");
                $this->line("       Venta: Bs. {$cuenta->saldo_pendiente} | Vencimiento: {$cuenta->fecha_vencimiento->toDateString()}");
                if ($diasVencido > 0) {
                    $this->line("       ⚠️  Vencida hace $diasVencido día(s)\n");
                } else {
                    $this->line("       ⏰ Vence en $diasRestantes día(s)\n");
                }
            }
        }

        // Resumen
        $this->newLine();
        $this->info('═══════════════════════════════════════════');
        $this->info('📊 RESUMEN DE VENCIMIENTOS');
        $this->info('═══════════════════════════════════════════');
        $this->line("🔴 Vencidas: $vencidas");
        $this->line("🟡 Por vencer (≤ 3 días): $porVencer");
        $this->line("🟢 Al día: $alDia");
        $this->line("📝 Actualizadas: $actualizadas");
        $this->line("📢 Eventos disparados: $eventosVencidos");
        $this->info('═══════════════════════════════════════════');

        // Detalles de vencidas
        if (!empty($detallesVencidas)) {
            $this->warn("\n⚠️  DETALLES DE CUENTAS VENCIDAS:\n");
            foreach ($detallesVencidas as $cuenta) {
                $diasVencido = $cuenta->dias_vencido;
                $cliente = $cuenta->cliente->nombre;
                $venta = $cuenta->venta->numero;
                $monto = $cuenta->saldo_pendiente;
                $this->line("   • Venta $venta | Cliente: $cliente | Monto: Bs. $monto | Vencida hace $diasVencido día(s)");
            }
        }

        if ($vencidas > 0 || $porVencer > 0) {
            $this->info("\n✨ Reporte generado. Se recomienda tomar acciones de cobranza.");
        } else {
            $this->info("\n✅ Todas las cuentas están al día.");
        }
    }
}
