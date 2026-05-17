<?php
namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Producto>
 */
class ProductoFactory extends Factory
{
    protected $model = Producto::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre'                   => fake()->words(3, true),
            'descripcion'              => fake()->sentence(),
            'peso'                     => fake()->randomFloat(2, 0.1, 100),
            'unidad_medida_id'         => \App\Models\UnidadMedida::inRandomOrder()->first()?->id ?? \App\Models\UnidadMedida::factory(),
            'codigo_barras'            => fake()->ean13(),
            'codigo_qr'                => fake()->uuid(),
            'stock_minimo'             => fake()->numberBetween(5, 20),
            'stock_maximo'             => fake()->numberBetween(50, 200),
            'activo'                   => true,
            'fecha_creacion'           => now(),
            'es_alquilable'            => false,
            'categoria_id'             => \App\Models\Categoria::inRandomOrder()->first()?->id ?? \App\Models\Categoria::factory(),
            'marca_id'                 => \App\Models\Marca::inRandomOrder()->first()?->id ?? \App\Models\Marca::factory(),
            'controlar_stock'          => true,
            'permitir_venta_sin_stock' => false,
        ];
    }
}
