<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TipoPrecio>
 */
class TipoPrecioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'codigo' => fake()->unique()->word(),
            'nombre' => fake()->words(2, true),
            'descripcion' => fake()->sentence(),
            'color' => fake()->hexColor(),
            'es_ganancia' => fake()->boolean(),
            'es_precio_base' => fake()->boolean(20), // 20% de probabilidad de ser precio base
            'porcentaje_ganancia' => fake()->randomFloat(2, 0, 100),
            'orden' => fake()->numberBetween(1, 100),
            'activo' => true,
            'es_sistema' => false,
            'configuracion' => [],
        ];
    }

    /**
     * Indicate that the tipo precio should be precio base.
     */
    public function precioBase(): static
    {
        return $this->state(fn (array $attributes) => [
            'es_precio_base' => true,
        ]);
    }

    /**
     * Indicate that the tipo precio should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }
}
