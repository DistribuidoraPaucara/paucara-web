<?php

namespace App\DTOs;

use App\Enums\TipoCodigoBarraEnum;

class CodigoBarraDTO extends BaseDTO
{
    public function __construct(
        public int $id = 0,
        public int $producto_id,
        public string $codigo,
        public TipoCodigoBarraEnum|string $tipo = 'EAN',
        public bool $es_principal = false,
        public bool $activo = true,
        public ?string $created_at = null,
        public ?string $updated_at = null,
    ) {
        // Convertir string a enum si es necesario
        if (is_string($this->tipo)) {
            $this->tipo = TipoCodigoBarraEnum::tryFrom($this->tipo) ?? TipoCodigoBarraEnum::EAN;
        }
    }

    /**
     * Crear desde array de validación de request
     */
    public static function fromRequest(array $data, int $productoId): self
    {
        return new self(
            producto_id: $productoId,
            codigo: $data['codigo'],
            tipo: TipoCodigoBarraEnum::tryFrom($data['tipo'] ?? 'EAN') ?? TipoCodigoBarraEnum::EAN,
            es_principal: $data['es_principal'] ?? false,
            activo: $data['activo'] ?? true,
        );
    }

    /**
     * Obtener datos para crear/actualizar en BD
     */
    public function toDatabase(): array
    {
        return [
            'producto_id' => $this->producto_id,
            'codigo' => $this->codigo,
            'tipo' => $this->tipo->value,
            'es_principal' => $this->es_principal,
            'activo' => $this->activo,
        ];
    }

    /**
     * Obtener datos para respuesta API
     */
    public function toApi(): array
    {
        return [
            'id' => $this->id,
            'producto_id' => $this->producto_id,
            'codigo' => $this->codigo,
            'tipo' => $this->tipo->value,
            'tipo_label' => $this->tipo->getDescripcion(),
            'es_principal' => $this->es_principal,
            'activo' => $this->activo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Obtener datos para respuesta web/Inertia
     */
    public function toWeb(): array
    {
        return $this->toApi();
    }
}
