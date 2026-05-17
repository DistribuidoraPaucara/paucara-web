<?php

namespace Database\Factories;

use App\Models\Entrega;
use App\Models\Venta;
use App\Models\Vehiculo;
use App\Models\Empleado;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntregaFactory extends Factory
{
    protected $model = Entrega::class;

    public function definition(): array
    {
        // Obtener el estado inicial PROGRAMADO
        $estadoProgramado = \App\Models\EstadoLogistica::where('codigo', 'PROGRAMADO')
            ->where('categoria', 'entrega_logistica')
            ->first();

        return [
            'venta_id' => Venta::factory(),
            'chofer_id' => Empleado::factory(),
            'vehiculo_id' => Vehiculo::factory(),
            'estado' => Entrega::ESTADO_PROGRAMADO,
            'estado_entrega_id' => $estadoProgramado?->id,  // ✅ FK a estados_logistica
            'peso_kg' => fake()->randomFloat(2, 5, 500),
            'volumen_m3' => fake()->randomFloat(2, 0.1, 10),
            'fecha_programada' => fake()->dateTimeBetween('now', '+7 days'),
            'direccion_entrega' => fake()->address(),
            'observaciones' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Actualizar estado_entrega_id cuando se asigna un estado específico
     */
    private function obtenerEstadoLogisticoId(string $codigoEstado): ?int
    {
        return \App\Models\EstadoLogistica::where('codigo', $codigoEstado)
            ->where('categoria', 'entrega_logistica')
            ->value('id');
    }

    /**
     * Entrega programada (estado inicial)
     */
    public function programada(): static
    {
        return $this->state(fn(array $attributes) => [
            'estado' => Entrega::ESTADO_PROGRAMADO,
            'estado_entrega_id' => $this->obtenerEstadoLogisticoId('PROGRAMADO'),  // ✅
            'fecha_asignacion' => null,
        ]);
    }

    /**
     * Entrega asignada a chofer y vehículo
     */
    public function asignada(): static
    {
        return $this->state(fn(array $attributes) => [
            'estado' => Entrega::ESTADO_ASIGNADA,
            'estado_entrega_id' => $this->obtenerEstadoLogisticoId('ASIGNADA'),  // ✅
            'fecha_asignacion' => now(),
        ]);
    }

    /**
     * Entrega en camino
     */
    public function enCamino(): static
    {
        return $this->state(fn(array $attributes) => [
            'estado' => Entrega::ESTADO_EN_CAMINO,
            'estado_entrega_id' => $this->obtenerEstadoLogisticoId('EN_CAMINO'),  // ✅
            'fecha_asignacion' => now()->subHours(2),
            'fecha_inicio' => now()->subHour(),
        ]);
    }

    /**
     * Entrega completada
     */
    public function entregada(): static
    {
        return $this->state(fn(array $attributes) => [
            'estado' => Entrega::ESTADO_ENTREGADO,
            'estado_entrega_id' => $this->obtenerEstadoLogisticoId('ENTREGADO'),  // ✅
            'fecha_asignacion' => now()->subHours(4),
            'fecha_inicio' => now()->subHours(2),
            'fecha_llegada' => now()->subHour(),
            'fecha_entrega' => now(),
        ]);
    }

    /**
     * Entrega cancelada
     */
    public function cancelada(): static
    {
        return $this->state(fn(array $attributes) => [
            'estado' => Entrega::ESTADO_CANCELADA,
            'estado_entrega_id' => $this->obtenerEstadoLogisticoId('CANCELADA'),  // ✅
            'motivo_novedad' => 'Cancelado por el cliente',
        ]);
    }
}
