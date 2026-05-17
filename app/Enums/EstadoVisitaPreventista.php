<?php

namespace App\Enums;

enum EstadoVisitaPreventista: string
{
    case EXITOSA = 'EXITOSA';
    case NO_ATENDIDO = 'NO_ATENDIDO';

    public function label(): string
    {
        return match($this) {
            self::EXITOSA => 'Exitosa',
            self::NO_ATENDIDO => 'No Atendido',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::EXITOSA => '#28A745',    // Verde
            self::NO_ATENDIDO => '#DC3545', // Rojo
        };
    }
}
