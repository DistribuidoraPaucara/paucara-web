<?php

namespace App\DTOs\Stock;

use App\DTOs\BaseDTO;

/**
 * DTO para resultado de validación de stock
 */
class ValidacionStockDTO extends BaseDTO
{
    public function __construct(
        public bool $valido,
        public array $errores = [],
        public array $detalles = [],
    ) {}

    /**
     * ¿La validación fue exitosa?
     */
    public function esValida(): bool
    {
        return $this->valido;
    }

    /**
     * ¿Hay errores?
     */
    public function tieneErrores(): bool
    {
        return !empty($this->errores);
    }

    /**
     * Obtener mensaje resumido
     */
    public function getMensaje(): string
    {
        if ($this->valido) {
            return 'Stock disponible para todos los productos';
        }

        return 'Stock insuficiente: ' . implode(', ', array_slice($this->errores, 0, 2));
    }
}
