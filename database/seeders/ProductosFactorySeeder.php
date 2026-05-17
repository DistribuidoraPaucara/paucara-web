<?php
namespace Database\Seeders;

use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\TipoPrecio;
use App\Models\UnidadMedida;
use Illuminate\Database\Seeder;

class ProductosFactorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener entidades existentes
        $categorias     = Categoria::where('activo', true)->get();
        $marcas         = Marca::where('activo', true)->get();
        $unidadesMedida = UnidadMedida::where('activo', true)->get();
        $almacenes      = Almacen::where('activo', true)->get();
        $tiposPrecios   = TipoPrecio::where('activo', true)->orderBy('orden')->get();

        if ($categorias->isEmpty() || $marcas->isEmpty() || $unidadesMedida->isEmpty()) {
            $this->command->error('No se encontraron categorías, marcas o unidades de medida activas. Ejecute primero ProductosEjemploSeeder.');
            return;
        }

        // Crear 20 productos adicionales usando factories
        Producto::factory()
            ->count(20)
            ->create()
            ->each(function ($producto) use ($tiposPrecios, $almacenes) {
                // Generar precio base de costo
                $precioCosto = fake()->randomFloat(2, 5.00, 100.00);

                // Crear precios para cada tipo de precio
                foreach ($tiposPrecios as $tipoPrecio) {
                    $precio = $precioCosto;
                    if ($tipoPrecio->codigo !== 'COSTO') {
                        $precio = $precioCosto * (1 + ($tipoPrecio->porcentaje_ganancia / 100));
                    }

                    PrecioProducto::create([
                        'producto_id'         => $producto->id,
                        'tipo_precio_id'      => $tipoPrecio->id,
                        'nombre'              => $tipoPrecio->nombre,
                        'precio'              => round($precio, 2),
                        'margen_ganancia'     => $tipoPrecio->codigo === 'COSTO' ? 0 : round($precio - $precioCosto, 2),
                        'porcentaje_ganancia' => $tipoPrecio->porcentaje_ganancia,
                        'es_precio_base'      => $tipoPrecio->es_precio_base,
                        'fecha_inicio'        => now(),
                        'activo'              => true,
                        'tipo_cliente'        => $tipoPrecio->codigo === 'MAYORISTA' ? 'mayorista' : 'general',
                    ]);
                }

                // Crear stock en almacenes
                foreach ($almacenes as $almacen) {
                    $cantidadStock = fake()->numberBetween(
                        $producto->stock_minimo + 5,
                        $producto->stock_maximo - 20
                    );

                    StockProducto::create([
                        'producto_id'         => $producto->id,
                        'almacen_id'          => $almacen->id,
                        'cantidad'            => $cantidadStock,
                        'fecha_actualizacion' => now(),
                        'lote'                => 'LF' . now()->format('Ymd') . '-' . str_pad($producto->id, 4, '0', STR_PAD_LEFT),
                        'fecha_vencimiento'   => fake()->dateTimeBetween('+3 months', '+18 months')->format('Y-m-d'),
                        'cantidad_reservada'  => 0,
                        'cantidad_disponible' => $cantidadStock,
                    ]);
                }

                $this->command->info("Producto factory creado: {$producto->nombre}");
            });

        $this->command->info('✅ ProductosFactorySeeder completado exitosamente!');
    }
}
