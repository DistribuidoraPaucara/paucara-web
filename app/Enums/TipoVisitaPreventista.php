<?php

namespace App\Enums;

enum TipoVisitaPreventista: string
{
    case COBRO = 'COBRO';
    case TOMA_PEDIDO = 'TOMA_PEDIDO';
    case ENTREGA = 'ENTREGA';
    case SUPERVISION = 'SUPERVISION';
    case OTRO = 'OTRO';

    public function label(): string
    {
        return match($this) {
            self::COBRO => 'Cobro',
            self::TOMA_PEDIDO => 'Toma de Pedido',
            self::ENTREGA => 'Entrega',
            self::SUPERVISION => 'Supervisión',
            self::OTRO => 'Otro',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::COBRO => '#28A745',          // Verde
            self::TOMA_PEDIDO => '#0275D8',    // Azul
            self::ENTREGA => '#FFC107',        // Amarillo
            self::SUPERVISION => '#6C757D',    // Gris
            self::OTRO => '#DC3545',           // Rojo
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::COBRO => 'payments',
            self::TOMA_PEDIDO => 'shopping_cart',
            self::ENTREGA => 'local_shipping',
            self::SUPERVISION => 'visibility',
            self::OTRO => 'more_horiz',
        };
    }
}
