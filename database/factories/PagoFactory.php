<?php

namespace Database\Factories;

use App\Models\CuentaPorPagar;
use App\Models\Pago;
use App\Models\TipoPago;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pago>
 */
class PagoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cuenta_por_pagar_id' => CuentaPorPagar::factory(),
            'tipo_pago_id' => TipoPago::factory(),
            'monto' => fake()->randomFloat(2, 50, 5000),
            'fecha_pago' => fake()->dateTimeBetween('-30 days', 'now'),
            'numero_recibo' => fake()->optional()->regexify('REC-[0-9]{6}'),
            'numero_transferencia' => fake()->optional()->regexify('TRF-[0-9]{9}'),
            'numero_cheque' => fake()->optional()->regexify('CHQ-[0-9]{8}'),
            'observaciones' => fake()->optional()->sentence(),
            'usuario_id' => User::factory(),
        ];
    }

    /**
     * Pago en efectivo
     */
    public function efectivo(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'tipo_pago_id' => TipoPago::factory()->efectivo(),
                'numero_recibo' => fake()->regexify('REC-[0-9]{6}'),
                'numero_transferencia' => null,
                'numero_cheque' => null,
            ];
        });
    }

    /**
     * Pago por transferencia
     */
    public function transferencia(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'tipo_pago_id' => TipoPago::factory()->transferencia(),
                'numero_transferencia' => fake()->regexify('TRF-[0-9]{9}'),
                'numero_recibo' => null,
                'numero_cheque' => null,
            ];
        });
    }

    /**
     * Pago con cheque
     */
    public function cheque(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'tipo_pago_id' => TipoPago::factory()->cheque(),
                'numero_cheque' => fake()->regexify('CHQ-[0-9]{8}'),
                'numero_recibo' => null,
                'numero_transferencia' => null,
            ];
        });
    }

    /**
     * Pago del mes actual
     */
    public function mesActual(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'fecha_pago' => fake()->dateTimeBetween('first day of this month', 'now'),
            ];
        });
    }
}
