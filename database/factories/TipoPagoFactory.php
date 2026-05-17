<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TipoPago>
 */
class TipoPagoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipos = [
            ['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo'],
            ['codigo' => 'TRANSFERENCIA', 'nombre' => 'Transferencia Bancaria'],
            ['codigo' => 'CHEQUE', 'nombre' => 'Cheque'],
            ['codigo' => 'TARJETA', 'nombre' => 'Tarjeta de Crédito/Débito'],
        ];

        $tipo = fake()->randomElement($tipos);

        return [
            'codigo' => $tipo['codigo'],
            'nombre' => $tipo['nombre'],
        ];
    }

    /**
     * Tipo de pago en efectivo
     */
    public function efectivo(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'codigo' => 'EFECTIVO',
                'nombre' => 'Efectivo',
            ];
        });
    }

    /**
     * Tipo de pago por transferencia
     */
    public function transferencia(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'codigo' => 'TRANSFERENCIA',
                'nombre' => 'Transferencia Bancaria',
            ];
        });
    }

    /**
     * Tipo de pago con cheque
     */
    public function cheque(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'codigo' => 'CHEQUE',
                'nombre' => 'Cheque',
            ];
        });
    }

    /**
     * Tipo de pago con tarjeta
     */
    public function tarjeta(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'codigo' => 'TARJETA',
                'nombre' => 'Tarjeta de Crédito/Débito',
            ];
        });
    }
}
