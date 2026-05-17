<?php

namespace App\Exceptions\Proforma;

use App\Exceptions\DomainException;

/**
 * Excepción lanzada cuando se intenta convertir una proforma con reservas expiradas
 *
 * Esta excepción es diferente de otras porque permite renovación automática
 */
class ReservasExpirasException extends DomainException
{
    protected int $httpStatusCode = 422;

    private int $proformaId;
    private int $reservasExpiradas;

    public function __construct(
        int $proformaId,
        int $reservasExpiradas = 0,
        string $message = 'Las reservas de esta proforma han expirado'
    ) {
        $this->proformaId = $proformaId;
        $this->reservasExpiradas = $reservasExpiradas;

        parent::__construct(
            message: $message,
            errors: [
                'proforma_id' => $proformaId,
                'reservas_expiradas' => $reservasExpiradas,
                'accion_sugerida' => 'renovar_reservas',
                'endpoint_renovacion' => "/proformas/{$proformaId}/renovar-reservas",
            ]
        );
    }

    public function getProformaId(): int
    {
        return $this->proformaId;
    }

    public function getReservasExpiradas(): int
    {
        return $this->reservasExpiradas;
    }
}
