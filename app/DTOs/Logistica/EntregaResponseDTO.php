<?php

namespace App\DTOs\Logistica;

use App\DTOs\BaseDTO;
use App\Models\Entrega;

/**
 * DTO para respuesta de Entrega
 */
class EntregaResponseDTO extends BaseDTO
{
    public function __construct(
        public int $id,
        public ?int $venta_id,
        public ?int $chofer_id,
        public ?int $vehiculo_id,
        public string $estado,
        public string $direccion,
        public ?string $fecha_programada = null,
        public ?string $fecha_inicio = null,
        public ?string $fecha_entrega = null,
        public ?string $razon_rechazo = null,
        public ?string $chofer_nombre = null,
        public ?string $vehiculo_placa = null,
        public array $ubicaciones = [],
        public string $created_at = '',
    ) {}

    /**
     * Factory: Crear desde Model
     */
    public static function fromModel($model): static
    {
        if (!$model instanceof Entrega) {
            throw new \InvalidArgumentException('Model must be instance of Entrega');
        }

        return new self(
            id: $model->id,
            venta_id: $model->venta_id,
            chofer_id: $model->chofer_id,
            vehiculo_id: $model->vehiculo_id,
            estado: $model->estado,
            direccion: $model->direccion_entrega ?? $model->direccion ?? '',
            fecha_programada: $model->fecha_programada?->toDateString(),
            fecha_inicio: $model->fecha_inicio?->toIso8601String(),
            fecha_entrega: $model->fecha_entrega?->toIso8601String(),
            razon_rechazo: $model->motivo_novedad ?? null,
            chofer_nombre: $model->chofer?->nombre,
            vehiculo_placa: $model->vehiculo?->placa,
            ubicaciones: $model->ubicaciones?->toArray() ?? [],
            created_at: $model->created_at->toIso8601String(),
        );
    }
}
