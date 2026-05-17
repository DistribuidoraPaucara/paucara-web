<?php

namespace App\Exceptions\Caja;

use App\Exceptions\DomainException;

/**
 * Excepción lanzada cuando se intenta realizar una operación sin tener caja abierta
 *
 * Casos:
 * - Venta sin caja abierta
 * - Compra sin caja abierta
 * - Pago sin caja abierta
 */
class CajaNoAbiertaException extends DomainException
{
    protected int $httpStatusCode = 403; // Forbidden

    /**
     * Crear excepción cuando no hay caja abierta
     *
     * @param array $detalles Incluye: operacion, usuario_id, etc
     */
    public static function create(array $detalles = []): self
    {
        $mensaje = "Debe abrir una caja antes de realizar esta operación";

        return new self(
            message: $mensaje,
            errors: $detalles,
        );
    }

    /**
     * Crear excepción con detalles adicionales
     */
    public static function conDetalles(string $operacion, ?int $usuarioId = null, array $extra = []): self
    {
        $detalles = array_merge([
            'operacion' => $operacion,
            'usuario_id' => $usuarioId,
        ], $extra);

        return self::create($detalles);
    }
}
