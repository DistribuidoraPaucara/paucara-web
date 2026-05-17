<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\PrecioProducto;
use Illuminate\Database\Seeder;

class CompletarTiposPreciosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Completando tipos de precios a productos existentes...');

        // Obtener productos activos
        $productos = Producto::where('activo', true)->get();
        $tiposPrecios = TipoPrecio::where('activo', true)->get();

        $this->command->line("📦 Procesando {$productos->count()} productos...");
        $this->command->line("💰 Tipos de precio disponibles: {$tiposPrecios->count()}");
        $this->command->newLine();

        $totalCreados = 0;
        $totalProductosActualizados = 0;

        foreach ($productos as $producto) {
            // Obtener tipos de precio que ya tiene el producto
            $tiposExistentes = $producto->precios()
                ->pluck('tipo_precio_id')
                ->toArray();

            // Identificar tipos de precio faltantes
            $tiposFaltantes = $tiposPrecios
                ->whereNotIn('id', $tiposExistentes)
                ->values();

            if ($tiposFaltantes->isNotEmpty()) {
                $totalProductosActualizados++;

                $this->command->line("  📝 {$producto->nombre} - Agregando {$tiposFaltantes->count()} tipos de precio");

                foreach ($tiposFaltantes as $tipoPrecio) {
                    PrecioProducto::create([
                        'producto_id'          => $producto->id,
                        'tipo_precio_id'       => $tipoPrecio->id,
                        'precio'               => 0,
                        'activo'               => true,
                        'es_precio_base'       => $tipoPrecio->es_precio_base,
                        'margen_ganancia'      => 0,
                        'porcentaje_ganancia'  => 0,
                        'motivo_cambio'        => 'Creado automáticamente por CompletarTiposPreciosSeeder',
                    ]);
                    $totalCreados++;
                }
            }
        }

        $this->command->newLine();
        $this->command->info("✅ Proceso completado!");
        $this->command->line("  • Productos actualizados: {$totalProductosActualizados}");
        $this->command->line("  • Precios creados: {$totalCreados}");
    }
}
