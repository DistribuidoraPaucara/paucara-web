<?php

namespace App\Exceptions;

use Exception;

/**
 * Excepción base para errores de lógica de negocio
 *
 * Errores que ocurren cuando la lógica de negocio se viola,
 * pero no es un error del sistema.
 *
 * Ejemplos:
 * - Stock insuficiente
 * - Estado inválido de transición
 * - Violación de reglas de negocio
 */
class DomainException extends Exception
{
    protected int $httpStatusCode = 422; // Unprocessable Entity

    public function __construct(
        string $message = "",
        protected array $errors = [],
        int $code = 0,
        ?Exception $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    /**
     * Obtener los errores detallados
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Obtener código HTTP apropiado
     */
    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }

    /**
     * Convertir a respuesta JSON
     */
    public function toResponse()
    {
        return [
            'success' => false,
            'message' => $this->getMessage(),
            'errors' => $this->errors,
        ];
    }
}
