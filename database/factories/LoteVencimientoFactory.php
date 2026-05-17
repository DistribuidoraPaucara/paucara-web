<?php

namespace Database\Factories;

use App\Models\DetalleCompra;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LoteVencimiento>
 */
class LoteVencimientoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cantidadInicial = fake()->numberBetween(50, 500);
        $cantidadUsada = fake()->numberBetween(0, $cantidadInicial);
        $cantidadActual = $cantidadInicial - $cantidadUsada;

        $fechaVencimiento = fake()->dateTimeBetween('-30 days', '+180 days');
        $estadoVencimiento = $this->determinarEstadoVencimiento($fechaVencimiento);

        return [
            'detalle_compra_id' => DetalleCompra::factory(),
            'numero_lote' => fake()->regexify('LOT-[A-Z]{3}-[0-9]{3}'),
            'fecha_vencimiento' => $fechaVencimiento,
            'cantidad_inicial' => $cantidadInicial,
            'cantidad_actual' => $cantidadActual,
            'estado_vencimiento' => $estadoVencimiento,
            'observaciones' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Lote vencido
     */
    public function vencido(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'fecha_vencimiento' => fake()->dateTimeBetween('-30 days', '-1 day'),
                'estado_vencimiento' => 'VENCIDO',
            ];
        });
    }

    /**
     * Lote próximo a vencer
     */
    public function proximoVencer(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'fecha_vencimiento' => fake()->dateTimeBetween('now', '+30 days'),
                'estado_vencimiento' => 'PROXIMO_VENCER',
            ];
        });
    }

    /**
     * Lote vigente
     */
    public function vigente(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'fecha_vencimiento' => fake()->dateTimeBetween('+31 days', '+365 days'),
                'estado_vencimiento' => 'VIGENTE',
            ];
        });
    }

    /**
     * Lote completamente usado
     */
    public function agotado(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'cantidad_actual' => 0,
            ];
        });
    }

    /**
     * Lote con número específico
     */
    public function numeroLote(string $numero): static
    {
        return $this->state(function (array $attributes) use ($numero) {
            return [
                'numero_lote' => $numero,
            ];
        });
    }

    /**
     * Determinar estado de vencimiento basado en la fecha
     */
    private function determinarEstadoVencimiento($fechaVencimiento): string
    {
        $hoy = now();
        $fecha = \Carbon\Carbon::parse($fechaVencimiento);

        if ($fecha < $hoy) {
            return 'VENCIDO';
        } elseif ($fecha <= $hoy->copy()->addDays(30)) {
            return 'PROXIMO_VENCER';
        } else {
            return 'VIGENTE';
        }
    }
}
