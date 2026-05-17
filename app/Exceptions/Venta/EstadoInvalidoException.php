<?php

namespace App\Exceptions\Venta;

use App\Exceptions\DomainException;

/**
 * Excepción lanzada cuando se intenta realizar una transición de estado inválida
 */
class EstadoInvalidoException extends DomainException
{
    protected int $httpStatusCode = 422;

    /**
     * Crear excepción con detalles de estado
     */
    public static function transicionInvalida(
        string $entidad,
        int $id,
        string $estadoActual,
        string $estadoSolicitado
    ): self {
        $mensaje = "Transición de estado inválida para {$entidad} #{$id}: " .
                   "{$estadoActual} → {$estadoSolicitado}";

        return new self(
            message: $mensaje,
            errors: [
                'entidad' => $entidad,
                'id' => $id,
                'estado_actual' => $estadoActual,
                'estado_solicitado' => $estadoSolicitado,
            ]
        );
    }
}
