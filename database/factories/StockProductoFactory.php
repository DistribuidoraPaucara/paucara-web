<?php

namespace Database\Factories;

use App\Models\Almacen;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockProducto>
 */
class StockProductoFactory extends Factory
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
            'almacen_id' => Almacen::factory(),
            'cantidad' => fake()->numberBetween(0, 100),
            'cantidad_reservada' => 0,
            'cantidad_disponible' => function (array $attributes) {
                return $attributes['cantidad'] - $attributes['cantidad_reservada'];
            },
            'fecha_actualizacion' => now(),
            'lote' => fake()->optional()->word(),
            'fecha_vencimiento' => fake()->optional()->dateTimeBetween('now', '+2 years'),
        ];
    }

    /**
     * Create stock for specific producto.
     */
    public function forProducto(Producto $producto): static
    {
        return $this->state(fn (array $attributes) => [
            'producto_id' => $producto->id,
        ]);
    }

    /**
     * Create stock for specific almacen.
     */
    public function forAlmacen(Almacen $almacen): static
    {
        return $this->state(fn (array $attributes) => [
            'almacen_id' => $almacen->id,
        ]);
    }

    /**
     * Create stock with specific quantity.
     */
    public function withQuantity(int $cantidad): static
    {
        return $this->state(fn (array $attributes) => [
            'cantidad' => $cantidad,
            'cantidad_disponible' => $cantidad,
        ]);
    }

    /**
     * Create stock with expiration date.
     */
    public function expiring(): static
    {
        return $this->state(fn (array $attributes) => [
            'fecha_vencimiento' => fake()->dateTimeBetween('now', '+1 year'),
        ]);
    }

    /**
     * Create stock that's expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'fecha_vencimiento' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }
}
