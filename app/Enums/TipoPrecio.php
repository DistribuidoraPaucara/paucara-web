<?php

namespace App\Enums;

enum TipoPrecio: string
{
    case COSTO = 'costo';
    case VENTA = 'venta';
    case POR_MAYOR = 'por_mayor';
    case FACTURADO = 'facturado';
    case DISTRIBUIDOR = 'distribuidor';
    case PROMOCIONAL = 'promocional';

    public function getDescripcion(): string
    {
        return match ($this) {
            self::COSTO => 'Precio de Costo',
            self::VENTA => 'Precio de Venta',
            self::POR_MAYOR => 'Precio por Mayor',
            self::FACTURADO => 'Precio Facturado',
            self::DISTRIBUIDOR => 'Precio Distribuidor',
            self::PROMOCIONAL => 'Precio Promocional',
        };
    }

    public function esGanancia(): bool
    {
        return $this !== self::COSTO;
    }

    public function getColor(): string
    {
        return match ($this) {
            self::COSTO => 'blue',
            self::VENTA => 'green',
            self::POR_MAYOR => 'purple',
            self::FACTURADO => 'orange',
            self::DISTRIBUIDOR => 'indigo',
            self::PROMOCIONAL => 'red',
        };
    }

    public static function getOptions(): array
    {
        return collect(self::cases())->map(fn ($tipo) => [
            'value' => $tipo->value,
            'label' => $tipo->getDescripcion(),
            'color' => $tipo->getColor(),
            'es_ganancia' => $tipo->esGanancia(),
        ])->toArray();
    }
}
