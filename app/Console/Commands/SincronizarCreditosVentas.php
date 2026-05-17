<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\CuentaPorCobrar;
use App\Services\CreditoService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SincronizarCreditosVentas extends Command
{
    protected $signature = 'creditos:sincronizar-ventas {--venta-ids=}';

    protected $description = 'Sincroniza ventas con política CREDITO que no tienen CuentaPorCobrar registrada';

    protected CreditoService $creditoService;

    public function __construct(CreditoService $creditoService)
    {
        parent::__construct();
        $this->creditoService = $creditoService;
    }

    public function handle()
    {
        $this->info('🔄 Iniciando sincronización de créditos de ventas...\n');

        // Obtener IDs específicas si se proporcionan
        $ventaIds = $this->option('venta-ids');

        $query = Venta::where('politica_pago', 'CREDITO');

        if ($ventaIds) {
            $ids = explode(',', $ventaIds);
            $query->whereIn('id', $ids);
            $this->info("📌 Sincronizando ventas específicas: " . implode(', ', $ids) . "\n");
        } else {
            $this->info("📌 Sincronizando TODAS las ventas con política CREDITO\n");
        }

        $ventas = $query->get();

        if ($ventas->isEmpty()) {
            $this->warn('ℹ️ No hay ventas con política CREDITO para sincronizar.');
            return;
        }

        $this->info("📊 Total de ventas encontradas: {$ventas->count()}\n");

        $sincronizadas = 0;
        $yaExisten = 0;
        $errores = 0;

        foreach ($ventas as $venta) {
            try {
                // Verificar si ya tiene CuentaPorCobrar
                if ($venta->cuentaPorCobrar()->exists()) {
                    $this->line("⏭️  Venta #{$venta->id} (#{$venta->numero}): Ya tiene CuentaPorCobrar");
                    $yaExisten++;
                    continue;
                }

                // Obtener días de vencimiento
                $cliente = $venta->cliente;
                $diasVencimiento = $cliente->dias_credito ?? 30;

                $this->line("⏳ Sincronizando Venta #{$venta->id} (#{$venta->numero}) - Cliente: {$cliente->nombre}");

                // Crear CuentaPorCobrar
                $cuenta = $this->creditoService->crearCuentaPorCobrar($venta, $diasVencimiento);

                $this->line("   ✅ CuentaPorCobrar creada (ID: {$cuenta->id})", 'info');
                $this->line("   💰 Monto: Bs. {$cuenta->monto_original}", 'info');
                $this->line("   📅 Vencimiento: {$cuenta->fecha_vencimiento->toDateString()}\n");

                $sincronizadas++;

            } catch (\Exception $e) {
                $this->line("   ❌ Error: {$e->getMessage()}\n", 'error');
                Log::error('Error sincronizando venta', [
                    'venta_id' => $venta->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                $errores++;
            }
        }

        // Resumen
        $this->newLine();
        $this->info('═══════════════════════════════════════════');
        $this->info('📊 RESUMEN DE SINCRONIZACIÓN');
        $this->info('═══════════════════════════════════════════');
        $this->line("✅ Sincronizadas: $sincronizadas");
        $this->line("⏭️  Ya existían: $yaExisten");
        $this->line("❌ Errores: $errores");
        $this->info('═══════════════════════════════════════════');

        if ($sincronizadas > 0) {
            $this->info("\n✨ ¡Sincronización completada exitosamente!");
            Log::info('Sincronización de créditos de ventas completada', [
                'sincronizadas' => $sincronizadas,
                'ya_existentes' => $yaExisten,
                'errores' => $errores,
            ]);
        }
    }
}
