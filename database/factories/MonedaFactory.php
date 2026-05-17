<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Moneda>
 */
class MonedaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $monedas = [
            ['nombre' => 'Peso Argentino', 'codigo' => 'ARS', 'simbolo' => '$'],
            ['nombre' => 'Dólar Estadounidense', 'codigo' => 'USD', 'simbolo' => 'US$'],
            ['nombre' => 'Euro', 'codigo' => 'EUR', 'simbolo' => '€'],
            ['nombre' => 'Libra Esterlina', 'codigo' => 'GBP', 'simbolo' => '£'],
            ['nombre' => 'Yen Japonés', 'codigo' => 'JPY', 'simbolo' => '¥'],
            ['nombre' => 'Real Brasileño', 'codigo' => 'BRL', 'simbolo' => 'R$'],
            ['nombre' => 'Peso Chileno', 'codigo' => 'CLP', 'simbolo' => '$'],
            ['nombre' => 'Peso Uruguayo', 'codigo' => 'UYU', 'simbolo' => '$U'],
        ];

        $moneda = $this->faker->randomElement($monedas);

        return [
            'nombre' => $moneda['nombre'],
            'codigo' => $moneda['codigo'],
            'simbolo' => $moneda['simbolo'],
            'tasa_cambio' => $this->faker->randomFloat(6, 0.001, 1000),
            'es_moneda_base' => false,
            'activo' => $this->faker->boolean(90), // 90% probabilidad de estar activa
        ];
    }

    /**
     * Indicate that the currency is the base currency.
     */
    public function monedaBase(): static
    {
        return $this->state(fn (array $attributes) => [
            'es_moneda_base' => true,
            'tasa_cambio' => 1.000000,
            'activo' => true,
        ]);
    }

    /**
     * Indicate that the currency is inactive.
     */
    public function inactiva(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }
}
