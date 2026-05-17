<?php

namespace Database\Factories;

use App\Models\Almacen;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Almacen>
 */
class AlmacenFactory extends Factory
{
    protected $model = Almacen::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->words(2, true),
            'direccion' => fake()->address(),
            'responsable' => fake()->name(),
            'telefono' => fake()->phoneNumber(),
            'activo' => true,
        ];
    }
}
