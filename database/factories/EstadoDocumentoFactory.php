<?php

namespace Database\Factories;

use App\Models\EstadoDocumento;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstadoDocumentoFactory extends Factory
{
    protected $model = EstadoDocumento::class;

    public function definition(): array
    {
        return [
            'nombre' => 'PENDIENTE',
            'codigo' => 'PEN',
            'descripcion' => 'Estado pendiente de aprobación',
            'activo' => true,
            'permite_edicion' => true,
            'permite_anulacion' => true,
            'es_estado_final' => false,
            'color' => '#FFA500',
        ];
    }

    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre' => 'PENDIENTE',
            'codigo' => 'PEN',
            'descripcion' => 'Estado pendiente de aprobación',
            'color' => '#FFA500',
        ]);
    }

    public function aprobado(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre' => 'APROBADO',
            'codigo' => 'APR',
            'descripcion' => 'Estado aprobado',
            'permite_edicion' => false,
            'color' => '#4CAF50',
        ]);
    }

    public function facturado(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre' => 'FACTURADO',
            'codigo' => 'FAC',
            'descripcion' => 'Estado facturado',
            'permite_edicion' => false,
            'es_estado_final' => true,
            'color' => '#2196F3',
        ]);
    }

    public function rechazado(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre' => 'RECHAZADO',
            'codigo' => 'REC',
            'descripcion' => 'Estado rechazado',
            'permite_edicion' => false,
            'es_estado_final' => true,
            'color' => '#F44336',
        ]);
    }

    public function anulado(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre' => 'ANULADO',
            'codigo' => 'ANU',
            'descripcion' => 'Estado anulado',
            'permite_edicion' => false,
            'permite_anulacion' => false,
            'es_estado_final' => true,
            'color' => '#9E9E9E',
        ]);
    }
}
