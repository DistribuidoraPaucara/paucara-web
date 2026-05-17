<?php

namespace Database\Factories;

use App\Models\Vehiculo;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehiculoFactory extends Factory
{
    protected $model = Vehiculo::class;

    public function definition(): array
    {
        return [
            'placa' => strtoupper(fake()->bothify('???-###')),
            'marca' => fake()->randomElement(['Toyota', 'Ford', 'Chevrolet', 'Nissan', 'Mitsubishi']),
            'modelo' => fake()->randomElement(['Hilux', 'Ranger', 'D-Max', 'Frontier', 'L200']),
            'anho' => fake()->numberBetween(2015, 2024),
            'capacidad_kg' => fake()->randomElement([1000, 1500, 2000, 2500, 3000]),
            'capacidad_volumen' => fake()->randomElement([10, 15, 20, 25, 30]),
            'estado' => Vehiculo::DISPONIBLE,
            'activo' => true,
            'chofer_asignado_id' => null,
            'observaciones' => null,
        ];
    }

    public function disponible(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => Vehiculo::DISPONIBLE,
            'activo' => true,
        ]);
    }

    public function enRuta(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => Vehiculo::EN_RUTA,
        ]);
    }

    public function enMantenimiento(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => Vehiculo::MANTENIMIENTO,
        ]);
    }

    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }
}
