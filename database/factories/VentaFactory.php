<?php

namespace Database\Factories;

use App\Models\Venta;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Moneda;
use App\Models\EstadoDocumento;
use Illuminate\Database\Eloquent\Factories\Factory;

class VentaFactory extends Factory
{
    protected $model = Venta::class;

    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 100, 5000);
        $descuento = fake()->randomFloat(2, 0, $subtotal * 0.1);
        $impuesto = ($subtotal - $descuento) * 0.13;
        $total = $subtotal - $descuento + $impuesto;

        return [
            'numero' => 'V-' . fake()->unique()->numerify('######'),
            'fecha' => fake()->dateTimeBetween('-1 month', 'now'),
            'subtotal' => $subtotal,
            'descuento' => $descuento,
            'impuesto' => $impuesto,
            'total' => $total,
            'observaciones' => fake()->optional()->sentence(),
            'cliente_id' => Cliente::factory(),
            'usuario_id' => User::factory(),
            'estado_documento_id' => EstadoDocumento::factory(),
            'moneda_id' => Moneda::factory(),
            'requiere_envio' => false,
            'estado_logistico' => null,
            'politica_pago' => 'CONTADO',
            'estado_pago' => 'PAGADO',
            'monto_pagado' => $total,
            'monto_pendiente' => 0,
        ];
    }

    /**
     * Venta que requiere envío
     */
    public function conEnvio(): static
    {
        return $this->state(fn(array $attributes) => [
            'requiere_envio' => true,
            'estado_logistico' => 'PENDIENTE',
            'fecha_entrega_comprometida' => fake()->dateTimeBetween('now', '+7 days'),
        ]);
    }

    /**
     * Venta aprobada lista para crear entrega
     */
    public function aprobada(): static
    {
        return $this->state(function(array $attributes) {
            return [
                'estado_documento_id' => EstadoDocumento::where('tipo', 'APROBADO')->first()?->id ?? EstadoDocumento::factory()->create(['tipo' => 'APROBADO'])->id,
            ];
        });
    }

    /**
     * Venta pendiente
     */
    public function pendiente(): static
    {
        return $this->state(function(array $attributes) {
            return [
                'estado_documento_id' => EstadoDocumento::where('tipo', 'PENDIENTE')->first()?->id ?? EstadoDocumento::factory()->create(['tipo' => 'PENDIENTE'])->id,
            ];
        });
    }

    /**
     * Venta con crédito pendiente
     */
    public function conCredito(): static
    {
        return $this->state(fn(array $attributes) => [
            'politica_pago' => 'CREDITO',
            'estado_pago' => 'PENDIENTE',
            'monto_pagado' => 0,
            'monto_pendiente' => $attributes['total'],
        ]);
    }
}
