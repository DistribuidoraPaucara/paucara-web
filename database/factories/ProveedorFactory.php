<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proveedor>
 */
class ProveedorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->company(),
            'razon_social' => $this->faker->company().' S.R.L.',
            'nit' => $this->faker->numerify('##########'),
            'telefono' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'direccion' => $this->faker->address(),
            'contacto' => $this->faker->name(),
            'activo' => true,
        ];
    }
}
