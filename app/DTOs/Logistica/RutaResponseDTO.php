<?php

namespace App\DTOs\Logistica;

use App\DTOs\BaseDTO;
use App\Models\Ruta;

/**
 * DTO para respuesta de Ruta
 */
class RutaResponseDTO extends BaseDTO
{
    public function __construct(
        public int $id,
        public string $numero,
        public ?int $zona_id,
        public ?int $chofer_id,
        public ?int $vehiculo_id,
        public ?string $chofer_nombre = null,
        public ?string $vehiculo_placa = null,
        public string $estado = 'PLANIFICADA',
        public string $fecha_planificacion = '',
        public int $cantidad_entregas = 0,
        public array $detalles = [],
        public string $created_at = '',
    ) {}

    /**
     * Factory: Crear desde Model
     */
    public static function fromModel(Ruta $ruta): self
    {
        return new self(
            id: $ruta->id,
            numero: $ruta->numero,
            zona_id: $ruta->zona_id,
            chofer_id: $ruta->chofer_id,
            vehiculo_id: $ruta->vehiculo_id,
            chofer_nombre: $ruta->chofer?->nombre,
            vehiculo_placa: $ruta->vehiculo?->placa,
            estado: $ruta->estado,
            fecha_planificacion: $ruta->fecha_planificacion->toDateString(),
            cantidad_entregas: $ruta->cantidad_entregas,
            detalles: $ruta->detalles?->map(fn($det) => [
                'id' => $det->id,
                'entrega_id' => $det->entrega_id,
                'posicion_orden' => $det->posicion_orden,
                'estado_entrega' => $det->estado_entrega,
                'cliente_nombre' => $det->entrega?->ventas?->first()?->cliente?->nombre,
                'direccion' => $det->entrega?->direccion,
            ])->toArray() ?? [],
            created_at: $ruta->created_at->toIso8601String(),
        );
    }
}
