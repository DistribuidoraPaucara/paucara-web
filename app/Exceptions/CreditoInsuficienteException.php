<?php

namespace App\Exceptions;

use Exception;

class CreditoInsuficienteException extends Exception
{
    public function __construct(
        public array $errores,
        public float $saldoDisponible,
    ) {
        $mensaje = implode(' | ', $errores);
        parent::__construct($mensaje);
    }

    public static function create(array $errores, float $saldoDisponible): self
    {
        return new self($errores, $saldoDisponible);
    }

    public function render()
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errores' => $this->errores,
            'saldo_disponible' => $this->saldoDisponible,
        ], 422);
    }
}
