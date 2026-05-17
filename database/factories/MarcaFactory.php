<?php

namespace Database\Factories;

use App\Models\Marca;
use Illuminate\Database\Eloquent\Factories\Factory;

class MarcaFactory extends Factory
{
    protected $model = Marca::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->company(),
            'descripcion' => $this->faker->sentence(),
            'activo' => true,
            'fecha_creacion' => now(),
        ];
    }

    public function inactivo()
    {
        return $this->state(fn () => ['activo' => false]);
    }
}
