<?php

namespace App\DTOs\Logistica;

use App\DTOs\BaseDTO;

/**
 * DTO para crear una ruta
 */
class CrearRutaDTO extends BaseDTO
{
    public function __construct(
        public int $zona_id,
        public array $entrega_ids, // IDs de entregas a asignar
        public string $fecha,
        public ?int $chofer_id = null,
        public ?int $vehiculo_id = null,
    ) {}

    /**
     * Validar detalles
     */
    public function validarDetalles(): void
    {
        if (empty($this->entrega_ids)) {
            throw new \InvalidArgumentException('Una ruta debe tener al menos una entrega');
        }
    }
}
