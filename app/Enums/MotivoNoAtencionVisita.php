<?php

namespace App\Enums;

enum MotivoNoAtencionVisita: string
{
    case CLIENTE_CERRADO = 'CLIENTE_CERRADO';
    case CLIENTE_AUSENTE = 'CLIENTE_AUSENTE';
    case DIRECCION_INCORRECTA = 'DIRECCION_INCORRECTA';
    case OTRO = 'OTRO';

    public function label(): string
    {
        return match($this) {
            self::CLIENTE_CERRADO => 'Cliente Cerrado',
            self::CLIENTE_AUSENTE => 'Cliente Ausente',
            self::DIRECCION_INCORRECTA => 'Dirección Incorrecta',
            self::OTRO => 'Otro Motivo',
        };
    }
}
