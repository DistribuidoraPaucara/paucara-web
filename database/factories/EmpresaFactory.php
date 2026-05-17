<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Empresa>
 */
class EmpresaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre_comercial' => $this->faker->company(),
            'razon_social' => $this->faker->company() . ' S.A.',
            'nit' => $this->faker->unique()->numerify('##############'),
            'telefono' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->companyEmail(),
            'sitio_web' => $this->faker->url(),
            'direccion' => $this->faker->address(),
            'ciudad' => 'La Paz',
            'pais' => 'Bolivia',
            'logo_principal' => null,
            'logo_compacto' => null,
            'logo_footer' => null,
            'configuracion_impresion' => [],
            'mensaje_footer' => 'Gracias por su compra',
            'mensaje_legal' => 'Términos y condiciones',
            'activo' => true,
            'es_principal' => false,
        ];
    }
}
