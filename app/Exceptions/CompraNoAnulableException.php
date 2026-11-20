<?php

namespace App\Exceptions;

use Exception;

/**
 * La compra no se puede anular. Lleva la lista de motivos para mostrársela al usuario.
 */
class CompraNoAnulableException extends Exception
{
    /**
     * @param string[] $motivos
     */
    public function __construct(public string $compraNumero, public array $motivos)
    {
        parent::__construct("No se puede anular la compra {$compraNumero}: " . implode(' ', $motivos));
    }
}
