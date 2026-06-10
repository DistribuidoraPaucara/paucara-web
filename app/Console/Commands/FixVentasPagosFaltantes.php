<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\DetallePagoVenta;
use App\Models\MovimientoCaja;
use App\Services\PagoVentaService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FixVentasPagosFaltantes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ventas:fix-pagos-faltantes {--fecha= : Filtrar por fecha específica (YYYY-MM-DD)} {--desde= : Ventas desde esta fecha} {--hasta= : Ventas hasta esta fecha}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Arregla ventas sin tipo_pago_id y sin registro en DetallePagoVenta. Asigna tipo_pago_id=1 por defecto.';

    protected PagoVentaService $pagoVentaService;

    public function __construct(PagoVentaService $pagoVentaService)
    {
        parent::__construct();
        $this->pagoVentaService = $pagoVentaService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Iniciando arreglo de ventas sin pagos...');

        // Construir query
        $query = Venta::with('detallesPagoVenta');

        // Filtros por fecha
        if ($this->option('fecha')) {
            $fecha = $this->option('fecha');
            $query->whereDate('fecha', $fecha);
            $this->info("📌 Filtrando: Ventas del {$fecha}");
        } elseif ($this->option('desde') || $this->option('hasta')) {
            if ($this->option('desde')) {
                $query->whereDate('fecha', '>=', $this->option('desde'));
                $this->info("📌 Desde: {$this->option('desde')}");
            }
            if ($this->option('hasta')) {
                $query->whereDate('fecha', '<=', $this->option('hasta'));
                $this->info("📌 Hasta: {$this->option('hasta')}");
            }
        } else {
            $this->info('📌 Procesando: Todas las ventas');
        }

        // Obtener ventas sin tipo_pago_id O sin registros en DetallePagoVenta (excluyendo CRÉDITO)
        $query->where(function ($q) {
            $q->whereNull('tipo_pago_id')
              ->orWhereDoesntHave('detallesPagoVenta');
        });

        // Excluir ventas que ya están a CRÉDITO correctamente
        $query->whereHas('tipoPago', function ($q) {
            $q->where('codigo', '!=', 'CREDITO');
        }, '>=', 1)->orWhereNull('tipo_pago_id');

        $ventasProblematicas = $query->get();

        if ($ventasProblematicas->isEmpty()) {
            $this->info('✅ No hay ventas con pagos faltantes');
            return;
        }

        $this->info("📊 Total de ventas a arreglar: {$ventasProblematicas->count()}");

        $arregladas = 0;
        $sinTipoPago = 0;
        $sinDetallePago = 0;
        $movimientosActualizados = 0;
        $errores = [];

        $bar = $this->output->createProgressBar($ventasProblematicas->count());
        $bar->start();

        foreach ($ventasProblematicas as $venta) {
            try {
                $bar->advance();

                // Caso 1: Sin tipo_pago_id
                if (!$venta->tipo_pago_id) {
                    $venta->update(['tipo_pago_id' => 1]);
                    $venta->refresh();
                    $sinTipoPago++;

                    Log::info('✅ [FixVentasPagosFaltantes] tipo_pago_id asignado', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'tipo_pago_id_asignado' => 1,
                    ]);
                }

                // Caso 2: Sin registro en DetallePagoVenta (y no es CRÉDITO)
                $esCredito = $venta->tipoPago && strtoupper($venta->tipoPago->codigo) === 'CREDITO';

                if (!$esCredito && $venta->detallesPagoVenta->isEmpty()) {
                    // Crear el registro de pago
                    DetallePagoVenta::create([
                        'venta_id' => $venta->id,
                        'tipo_pago_id' => $venta->tipo_pago_id,
                        'monto' => $venta->total,
                        'fecha_pago' => $venta->fecha,
                        'observaciones' => 'Pago registrado automáticamente (arregle de datos inconsistentes)',
                    ]);

                    $sinDetallePago++;

                    Log::info('✅ [FixVentasPagosFaltantes] DetallePagoVenta creado', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'tipo_pago_id' => $venta->tipo_pago_id,
                        'monto' => $venta->total,
                    ]);
                }

                // Caso 3: Actualizar movimientos_caja si existen para esta venta
                $movimientosVenta = MovimientoCaja::where('venta_id', $venta->id)
                    ->whereNull('tipo_pago_id')
                    ->get();

                if ($movimientosVenta->isNotEmpty()) {
                    foreach ($movimientosVenta as $movimiento) {
                        $movimiento->update(['tipo_pago_id' => $venta->tipo_pago_id]);
                        $movimientosActualizados++;

                        Log::info('✅ [FixVentasPagosFaltantes] MovimientoCaja actualizado', [
                            'movimiento_id' => $movimiento->id,
                            'venta_id' => $venta->id,
                            'tipo_pago_id' => $venta->tipo_pago_id,
                        ]);
                    }
                }

                $arregladas++;

            } catch (\Exception $e) {
                $errores[] = "Venta #{$venta->numero}: {$e->getMessage()}";

                Log::error('❌ [FixVentasPagosFaltantes] Error', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $bar->finish();
        $this->newLine(2);

        // Resultados
        $this->info('✅ RESULTADOS:');
        $this->line("   Total ventas arregladas: <fg=green>{$arregladas}</>");
        $this->line("   Con tipo_pago_id asignado: <fg=cyan>{$sinTipoPago}</>");
        $this->line("   Con DetallePagoVenta creado: <fg=cyan>{$sinDetallePago}</>");
        $this->line("   Movimientos de caja actualizados: <fg=cyan>{$movimientosActualizados}</>");

        if (!empty($errores)) {
            $this->warn("\n⚠️ ERRORES (" . count($errores) . "):");
            foreach ($errores as $error) {
                $this->line("   - {$error}");
            }
        }

        $this->info("\n✨ Completado");
    }
}
