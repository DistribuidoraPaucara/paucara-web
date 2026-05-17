<?php

namespace Database\Factories;

use App\Models\Zona;
use App\Models\Empleado;
use Illuminate\Database\Eloquent\Factories\Factory;

class ZonaFactory extends Factory
{
    protected $model = Zona::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->unique()->city() . ' Zona',
            'codigo' => strtoupper($this->faker->unique()->lexify('??')),
            'descripcion' => $this->faker->sentence(),
            'latitud_centro' => $this->faker->latitude(-22, -10),
            'longitud_centro' => $this->faker->longitude(-69, -57),
            'tiempo_estimado_entrega' => $this->faker->numberBetween(30, 180),
            'activa' => true,
        ];
    }
}
