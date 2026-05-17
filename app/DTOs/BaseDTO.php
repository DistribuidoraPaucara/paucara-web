<?php

namespace App\DTOs;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

/**
 * DTO Base - Proporciona funcionalidad común para todos los DTOs
 *
 * Un DTO (Data Transfer Object) es un objeto simple que transporta datos
 * entre diferentes capas de la aplicación sin lógica de negocio.
 *
 * Ventajas:
 * - Desacoplamiento entre Service y Controller
 * - Contratos explícitos de datos
 * - Type-safe (PhpStan/Psalm pueden validar)
 * - Serialización consistente
 */
abstract class BaseDTO implements Arrayable, JsonSerializable
{
    /**
     * Convertir DTO a array
     */
    public function toArray(): array
    {
        $reflection = new \ReflectionClass($this);
        $properties = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);

        $array = [];
        foreach ($properties as $property) {
            $name = $property->getName();
            $value = $this->{$name};

            // Convertir valores anidados
            if ($value instanceof self) {
                $array[$name] = $value->toArray();
            } elseif (is_array($value)) {
                $array[$name] = array_map(
                    fn($item) => $item instanceof self ? $item->toArray() : $item,
                    $value
                );
            } else {
                $array[$name] = $value;
            }
        }

        return $array;
    }

    /**
     * Implementar JsonSerializable
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    /**
     * Convertir a JSON
     */
    public function toJson(int $flags = 0): string
    {
        return json_encode($this, $flags);
    }

    /**
     * Factory: Crear desde array
     */
    public static function fromArray(array $data): static
    {
        return new static(...$data);
    }

    /**
     * Factory: Crear desde Eloquent Model
     */
    public static function fromModel($model): static
    {
        return static::fromArray($model->toArray());
    }
}
