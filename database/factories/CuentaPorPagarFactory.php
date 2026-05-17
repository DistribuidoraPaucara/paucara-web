<?php

namespace Database\Factories;

use App\Models\Compra;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CuentaPorPagar>
 */
class CuentaPorPagarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $montoOriginal = fake()->randomFloat(2, 100, 10000);
        $saldoPendiente = fake()->randomFloat(2, 0, $montoOriginal);

        return [
            'compra_id' => Compra::factory(),
            'monto_original' => $montoOriginal,
            'saldo_pendiente' => $saldoPendiente,
            'fecha_vencimiento' => fake()->dateTimeBetween('now', '+90 days'),
            'estado' => $saldoPendiente == 0 ? 'PAGADO' :
            ($saldoPendiente == $montoOriginal ? 'PENDIENTE' : 'PARCIAL'),
            'observaciones' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Estado pendiente completo
     */
    public function pendiente(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'saldo_pendiente' => $attributes['monto_original'],
                'estado' => 'PENDIENTE',
            ];
        });
    }

    /**
     * Estado pagado completo
     */
    public function pagado(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'saldo_pendiente' => 0,
                'estado' => 'PAGADO',
            ];
        });
    }

    /**
     * Estado parcialmente pagado
     */
    public function parcial(): static
    {
        return $this->state(function (array $attributes) {
            $saldoParcial = $attributes['monto_original'] * fake()->randomFloat(2, 0.1, 0.9);

            return [
                'saldo_pendiente' => $saldoParcial,
                'estado' => 'PARCIAL',
            ];
        });
    }

    /**
     * Cuenta vencida
     */
    public function vencido(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'fecha_vencimiento' => fake()->dateTimeBetween('-30 days', '-1 day'),
                'saldo_pendiente' => fake()->randomFloat(2, 1, $attributes['monto_original']),
                'estado' => 'VENCIDO',
            ];
        });
    }
}
