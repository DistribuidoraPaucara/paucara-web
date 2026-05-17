<?php

namespace Database\Factories;

use App\Models\Producto;
use App\Models\TipoPrecio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PrecioProducto>
 */
class PrecioProductoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'producto_id' => Producto::factory(),
            'tipo_precio_id' => TipoPrecio::factory(),
            'nombre' => fake()->words(2, true),
            'precio' => fake()->randomFloat(2, 10, 1000),
            'fecha_inicio' => now(),
            'fecha_fin' => null,
            'activo' => true,
            'tipo_cliente' => null,
            'margen_ganancia' => fake()->randomFloat(2, 0, 100),
            'porcentaje_ganancia' => fake()->randomFloat(2, 0, 50),
            'es_precio_base' => fake()->boolean(20), // 20% de probabilidad
            'motivo_cambio' => fake()->sentence(),
        ];
    }

    /**
     * Indicate that the precio should be precio base.
     */
    public function precioBase(): static
    {
        return $this->state(fn (array $attributes) => [
            'es_precio_base' => true,
        ]);
    }

    /**
     * Indicate that the precio should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }

    /**
     * Create precio for specific producto and tipo precio.
     */
    public function forProducto(Producto $producto): static
    {
        return $this->state(fn (array $attributes) => [
            'producto_id' => $producto->id,
        ]);
    }

    /**
     * Create precio for specific tipo precio.
     */
    public function forTipoPrecio(TipoPrecio $tipoPrecio): static
    {
        return $this->state(fn (array $attributes) => [
            'tipo_precio_id' => $tipoPrecio->id,
        ]);
    }
}
