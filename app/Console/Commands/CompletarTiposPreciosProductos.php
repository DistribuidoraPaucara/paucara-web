<?php

namespace App\Console\Commands;

use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\PrecioProducto;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CompletarTiposPreciosProductos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'productos:completar-tipos-precios {--dry-run : Simular sin guardar cambios} {--margen=30 : Porcentaje de margen de ganancia (default: 30%)}';

    /**
     * The name and description of the console command.
     *
     * @var string
     */
    protected $description = 'Completa todos los tipos de precios a los productos existentes en la BD';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $porcentajeMargen = (float) $this->option('margen');

        $this->info('🚀 Iniciando proceso de completar tipos de precios...');
        $this->newLine();

        if ($dryRun) {
            $this->warn('⚠️  MODO SIMULACIÓN: Los cambios NO serán guardados');
            $this->newLine();
        }

        $this->info("📊 Configuración:");
        $this->line("  • Porcentaje de margen: <fg=cyan>{$porcentajeMargen}%</>");
        $this->newLine();

        // Obtener productos activos
        $productos = Producto::where('activo', true)
            ->orderBy('nombre')
            ->get();

        $this->info("📦 Total de productos activos: {$productos->count()}");

        // Obtener tipos de precio activos
        $tiposPrecios = TipoPrecio::where('activo', true)
            ->orderBy('nombre')
            ->get();

        $this->info("💰 Total de tipos de precio activos: {$tiposPrecios->count()}");
        $this->newLine();

        $totalCreados = 0;
        $totalProductosActualizados = 0;
        $totalProductosSinPrecio = 0;

        // Progress bar
        $bar = $this->output->createProgressBar($productos->count());
        $bar->start();

        foreach ($productos as $producto) {
            // ✅ Obtener el precio de costo (tipo_precio_id = 1)
            $precioCostoRecord = PrecioProducto::where('producto_id', $producto->id)
                ->where('tipo_precio_id', 1)
                ->first();

            $precioCosto = $precioCostoRecord ? $precioCostoRecord->precio : 0;

            // ✅ Para cada tipo de precio, crear o actualizar
            foreach ($tiposPrecios as $tipoPrecio) {
                // No actualizar el precio de costo (tipo_precio_id = 1)
                if ($tipoPrecio->id == 1) {
                    continue;
                }

                // Calcular precio de venta con margen
                $precioVenta = $precioCosto > 0
                    ? $precioCosto * (1 + ($porcentajeMargen / 100))
                    : 0;

                // Calcular margen de ganancia en valor absoluto
                $margenGanancia = $precioVenta - $precioCosto;

                // ✅ Verificar si el precio ya existe
                $precioExistente = PrecioProducto::where('producto_id', $producto->id)
                    ->where('tipo_precio_id', $tipoPrecio->id)
                    ->first();

                $esNuevo = !$precioExistente;

                if (!$dryRun) {
                    // ✅ Usar updateOrCreate para actualizar si existe, crear si no
                    PrecioProducto::updateOrCreate(
                        [
                            'producto_id'    => $producto->id,
                            'tipo_precio_id' => $tipoPrecio->id,
                        ],
                        [
                            'precio'               => $precioVenta,
                            'activo'               => true,
                            'es_precio_base'       => $tipoPrecio->es_precio_base,
                            'margen_ganancia'      => $margenGanancia,
                            'porcentaje_ganancia'  => $porcentajeMargen,
                            'motivo_cambio'        => "Actualizado automáticamente con margen del {$porcentajeMargen}% sobre precio de costo",
                        ]
                    );

                    // Contar solo si es nuevo
                    if ($esNuevo) {
                        $totalCreados++;
                        if ($precioCosto == 0) {
                            $totalProductosSinPrecio++;
                        }
                    }

                    // Contar producto actualizado solo una vez
                    if ($esNuevo) {
                        $totalProductosActualizados++;
                    }
                } else {
                    // En modo simulación
                    if ($esNuevo) {
                        $totalCreados++;
                        if ($precioCosto == 0) {
                            $totalProductosSinPrecio++;
                        }
                        $totalProductosActualizados++;
                    }
                }
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        // Resumen
        $this->info('✅ Proceso completado!');
        $this->newLine();
        $this->line("📊 Resumen:");
        $this->line("  • Productos actualizados: <fg=cyan>{$totalProductosActualizados}</>");
        $this->line("  • Precios creados: <fg=green>{$totalCreados}</>");

        if ($totalProductosSinPrecio > 0) {
            $this->line("  • ⚠️  Productos sin precio de costo: <fg=yellow>{$totalProductosSinPrecio}</> (creados con precio 0)");
        }

        $this->newLine();

        if ($dryRun) {
            $this->warn('ℹ️  Esto fue una SIMULACIÓN. Para guardar los cambios, ejecuta:');
            $this->info("   php artisan productos:completar-tipos-precios --margen={$porcentajeMargen}");
        } else {
            $this->info('🎉 Todos los tipos de precios han sido completados exitosamente!');
            if ($totalProductosSinPrecio > 0) {
                $this->warn("⚠️  Nota: {$totalProductosSinPrecio} precios fueron creados con valor 0 porque el producto no tiene precio de costo definido.");
                $this->line('   Completa los precios de costo en esos productos para que se calculen correctamente.');
            }
        }
    }
}
