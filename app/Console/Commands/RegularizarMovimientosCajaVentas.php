<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\AperturaCaja;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegularizarMovimientosCajaVentas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:regularizar-movimientos-caja-ventas
                            {--fecha-desde= : Fecha desde (YYYY-MM-DD)}
                            {--fecha-hasta= : Fecha hasta (YYYY-MM-DD)}
                            {--usuario-id= : Filtrar por usuario ID}
                            {--dry-run : Solo mostrar qué se haría sin ejecutar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regulariza ventas sin movimiento de caja (para ventas con monto_pagado > 0 o tipo_pago NO-CRÉDITO)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Iniciando regularización de movimientos de caja...');

        $dryRun = $this->option('dry-run');
        $fechaDesde = $this->option('fecha-desde');
        $fechaHasta = $this->option('fecha-hasta');
        $usuarioId = $this->option('usuario-id');

        // 1. Construir query para buscar ventas sin movimiento de caja
        $query = Venta::whereDoesntHave('movimientoCaja')  // SIN movimiento de caja
            ->where(function ($q) {
                // Donde: monto_pagado > 0 O tipo_pago NO es CRÉDITO
                $q->where('monto_pagado', '>', 0)
                  ->orWhereHas('tipoPago', function ($subQ) {
                      $subQ->where('codigo', '!=', 'CREDITO');
                  });
            })
            ->with(['cliente', 'usuario', 'tipoPago', 'estadoDocumento']);

        // Aplicar filtros
        if ($fechaDesde) {
            $query->where('fecha', '>=', $fechaDesde);
            $this->info("📅 Filtro: Desde {$fechaDesde}");
        }
        if ($fechaHasta) {
            $query->where('fecha', '<=', $fechaHasta);
            $this->info("📅 Filtro: Hasta {$fechaHasta}");
        }
        if ($usuarioId) {
            $query->where('usuario_id', $usuarioId);
            $this->info("👤 Filtro: Usuario ID {$usuarioId}");
        }

        $ventas = $query->orderBy('fecha', 'desc')->get();

        if ($ventas->isEmpty()) {
            $this->info('✅ No hay ventas para regularizar.');
            return 0;
        }

        $this->info("\n📊 Encontradas " . $ventas->count() . " ventas sin movimiento de caja\n");

        // 2. Mostrar resumen
        $table = [];
        foreach ($ventas as $venta) {
            $table[] = [
                'ID' => $venta->id,
                'Número' => $venta->numero,
                'Fecha' => $venta->fecha->format('Y-m-d'),
                'Cliente' => $venta->cliente?->nombre ?? 'N/A',
                'Monto Pagado' => $venta->monto_pagado,
                'Total' => $venta->total,
                'Tipo Pago' => $venta->tipoPago?->nombre ?? 'N/A',
            ];
        }

        $this->table(['ID', 'Número', 'Fecha', 'Cliente', 'Monto Pagado', 'Total', 'Tipo Pago'], $table);

        // 3. Confirmar antes de proceder
        if (!$dryRun) {
            if (!$this->confirm("\n¿Deseas crear los movimientos de caja para estas ventas?")) {
                $this->info('❌ Operación cancelada.');
                return 1;
            }
        } else {
            $this->info('🔍 Modo DRY-RUN: No se ejecutarán cambios');
        }

        // 4. Procesar cada venta
        $exitosas = 0;
        $errores = 0;

        foreach ($ventas as $venta) {
            try {
                // Obtener tipo de operación
                $tipoPago = $venta->tipoPago;
                $esCREDITO = $tipoPago && strtoupper($tipoPago->codigo) === 'CREDITO';

                $codigoTipoOperacion = $esCREDITO ? 'CREDITO' : 'VENTA';
                $tipoOperacion = TipoOperacionCaja::where('codigo', $codigoTipoOperacion)->first();

                if (!$tipoOperacion) {
                    $this->error("   ❌ Venta #{$venta->numero}: Tipo operación {$codigoTipoOperacion} no existe");
                    $errores++;
                    continue;
                }

                // Obtener caja abierta (considerando cajas abiertas hace varios días)
                // ✅ CORREGIDO: Busca aperturas sin cierre, abierta antes o igual a fecha de venta
                $cajaAbierta = AperturaCaja::where('user_id', $venta->usuario_id)
                    ->where('fecha', '<=', $venta->fecha)  // Apertura antes o igual a venta
                    ->abiertas()  // Scope: whereDoesntHave('cierre') - sin cierre
                    ->orderByDesc('fecha')  // Más reciente
                    ->first();

                if (!$cajaAbierta) {
                    $this->error("   ❌ Venta #{$venta->numero}: No hay caja abierta (sin cierre, abierta antes/igual a {$venta->fecha->format('Y-m-d')}) para usuario {$venta->usuario_id}");
                    $errores++;
                    continue;
                }

                // ✅ CORREGIDO (2026-03-02): Usar misma lógica que VentaService
                // Si tipo_pago NO es CRÉDITO y monto_pagado = 0 → usar total
                // Si tipo_pago ES CRÉDITO → usar monto_pagado (será 0 para crédito puro)
                $montoARegistrar = $venta->monto_pagado;

                if (!$esCREDITO && $montoARegistrar <= 0) {
                    // No es crédito y no hay monto pagado → usar el total
                    $montoARegistrar = $venta->total;
                }

                // Saltar solo si monto = 0 y ES CRÉDITO (crédito puro sin pago)
                if ($montoARegistrar <= 0) {
                    $this->warn("   ⏭️  Venta #{$venta->numero}: Monto ≤ 0, omitida (crédito puro sin pago)");
                    continue;
                }

                if ($dryRun) {
                    $this->info("   ✅ [DRY-RUN] Venta #{$venta->numero}: Crearía movimiento de {$montoARegistrar} (caja: {$cajaAbierta->caja?->nombre})");
                } else {
                    // Crear movimiento
                    MovimientoCaja::create([
                        'caja_id' => $cajaAbierta->caja_id,
                        'user_id' => $venta->usuario_id,
                        'tipo_operacion_id' => $tipoOperacion->id,
                        'tipo_pago_id' => $venta->tipo_pago_id,
                        'numero_documento' => $venta->numero,
                        'monto' => $montoARegistrar,
                        'fecha' => now(),
                        'observaciones' => "[REGULARIZADO] Venta #{$venta->numero} - Creada directamente (movimiento de caja faltante)",
                        'venta_id' => $venta->id,
                    ]);

                    $this->info("   ✅ Venta #{$venta->numero}: Movimiento creado de {$montoARegistrar}");
                    $exitosas++;
                }

            } catch (\Exception $e) {
                $this->error("   ❌ Venta #{$venta->numero}: {$e->getMessage()}");
                Log::error("Error regularizando venta {$venta->numero}", ['error' => $e->getMessage()]);
                $errores++;
            }
        }

        // 5. Resumen final
        $this->newLine();
        $this->info("📊 RESUMEN:");
        $this->info("   ✅ Exitosas: {$exitosas}");
        $this->info("   ❌ Errores: {$errores}");
        $this->info("   ⏭️  Omitidas: " . ($ventas->count() - $exitosas - $errores));

        if ($dryRun) {
            $this->warn("\n🔍 Modo DRY-RUN: Ejecuta sin --dry-run para aplicar cambios");
        }

        return 0;
    }
}
