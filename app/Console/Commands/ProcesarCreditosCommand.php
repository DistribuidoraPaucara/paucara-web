<?php

namespace App\Console\Commands;

use App\Events\CreditoCritico;
use App\Events\CreditoVencido;
use App\Models\Cliente;
use App\Models\CuentaPorCobrar;
use App\Services\CreditoService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Comando que procesa créditos para detectar vencidos y críticos
 *
 * Ejecuta tareas:
 * - Actualiza días_vencido en cuentas vencidas
 * - Detecta créditos vencidos y dispara evento
 * - Detecta clientes con crédito crítico (>80%) y dispara evento
 */
class ProcesarCreditosCommand extends Command
{
    protected $signature = 'creditos:procesar {--force : Forzar procesamiento incluso en producción}';
    protected $description = 'Procesa créditos vencidos y detecta clientes con crédito crítico';

    protected CreditoService $creditoService;

    public function __construct(CreditoService $creditoService)
    {
        parent::__construct();
        $this->creditoService = $creditoService;
    }

    public function handle()
    {
        $this->info('🔄 Procesando créditos...');
        Log::info('🔄 Comando ProcesarCreditos iniciado');

        $cuentasActualizadas = 0;
        $eventosVencidoDisparados = 0;
        $eventosCriticoDisparados = 0;

        try {
            // 1. Procesar cuentas vencidas
            $this->info('');
            $this->info('📅 Procesando cuentas vencidas...');

            $cuentasVencidas = CuentaPorCobrar::vencidas()
                ->pendientes()
                ->with(['cliente', 'venta'])
                ->get();

            foreach ($cuentasVencidas as $cuenta) {
                $diasVencido = now()->diffInDays($cuenta->fecha_vencimiento);

                // Solo actualizar si cambió
                if ($cuenta->dias_vencido !== $diasVencido) {
                    $cuenta->update(['dias_vencido' => $diasVencido]);
                    $cuentasActualizadas++;

                    // Disparar evento solo la primera vez que se vence
                    if ($cuenta->dias_vencido == 0 && $diasVencido > 0) {
                        event(new CreditoVencido($cuenta));
                        $eventosVencidoDisparados++;

                        $this->line("  ⚠️  Cuenta #{$cuenta->id} - Cliente: {$cuenta->cliente?->nombre} - Vencido hace {$diasVencido} días");
                    }
                }
            }

            $this->info("✅ {$cuentasActualizadas} cuentas actualizadas");
            $this->info("📢 {$eventosVencidoDisparados} eventos de vencimiento disparados");

            // 2. Procesar clientes con crédito crítico (>80%)
            $this->info('');
            $this->info('🔴 Detectando clientes con crédito crítico (>80%)...');

            $clientesCriticos = Cliente::where('activo', true)
                ->where('puede_tener_credito', true)
                ->where('limite_credito', '>', 0)
                ->with(['cuentasPorCobrar' => function ($q) {
                    $q->where('saldo_pendiente', '>', 0);
                }])
                ->get()
                ->filter(function ($cliente) {
                    $porcentaje = $this->creditoService->obtenerPorcentajeUtilizacion($cliente);
                    return $porcentaje > 80;
                });

            foreach ($clientesCriticos as $cliente) {
                $porcentaje = $this->creditoService->obtenerPorcentajeUtilizacion($cliente);
                $saldoDisponible = $cliente->calcularSaldoDisponible();

                // Disparar evento
                event(new CreditoCritico($cliente, $porcentaje, $saldoDisponible));
                $eventosCriticoDisparados++;

                $this->line("  🔴 Cliente: {$cliente->nombre} - Utilización: {$porcentaje}% - Disponible: Bs {$saldoDisponible}");
            }

            $this->info("📢 {$eventosCriticoDisparados} eventos de crédito crítico disparados");

            // 3. Resumen final
            $this->info('');
            $this->info('─────────────────────────────────────────');
            $this->info("📊 RESUMEN:");
            $this->info("  • Cuentas actualizadas: {$cuentasActualizadas}");
            $this->info("  • Eventos vencido: {$eventosVencidoDisparados}");
            $this->info("  • Eventos crítico: {$eventosCriticoDisparados}");
            $this->info('─────────────────────────────────────────');
            $this->info('');
            $this->info('✅ Procesamiento completado exitosamente');

            Log::info('✅ Comando ProcesarCreditos completado', [
                'cuentas_actualizadas' => $cuentasActualizadas,
                'eventos_vencido' => $eventosVencidoDisparados,
                'eventos_critico' => $eventosCriticoDisparados,
            ]);

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error procesando créditos: ' . $e->getMessage());
            Log::error('❌ Error en comando ProcesarCreditos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }
}
