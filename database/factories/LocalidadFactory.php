<?php

namespace Database\Factories;

use App\Models\Localidad;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocalidadFactory extends Factory
{
    protected $model = Localidad::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->unique()->city(),
            'codigo' => strtoupper($this->faker->unique()->lexify('???')),
            'activo' => true,
        ];
    }
}
