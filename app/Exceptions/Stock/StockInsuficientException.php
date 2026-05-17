<?php

namespace App\Exceptions\Stock;

use App\Exceptions\DomainException;

/**
 * Excepción lanzada cuando no hay stock suficiente para una operación
 */
class StockInsuficientException extends DomainException
{
    protected int $httpStatusCode = 422;

    /**
     * Crear excepción con detalles de stock
     *
     * @param array $detalles Incluye: producto_id, disponible, solicitado, etc
     */
    public static function create(array $detalles): self
    {
        $mensaje = "Stock insuficiente para completar la operación";

        return new self(
            message: $mensaje,
            errors: $detalles,
        );
    }
}
