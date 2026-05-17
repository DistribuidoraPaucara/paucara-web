<?php

namespace Database\Factories;

use App\Models\UnidadMedida;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnidadMedidaFactory extends Factory
{
    protected $model = UnidadMedida::class;

    public function definition()
    {
        return [
            'codigo' => strtoupper($this->faker->unique()->lexify('??')),
            'nombre' => $this->faker->randomElement(['Unidad', 'Kilogramo', 'Metro', 'Litro', 'Pieza']),
            'activo' => true,
        ];
    }

    public function inactivo()
    {
        return $this->state(fn () => ['activo' => false]);
    }
}
