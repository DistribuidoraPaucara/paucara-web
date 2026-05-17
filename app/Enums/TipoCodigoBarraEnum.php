<?php

namespace App\Enums;

enum TipoCodigoBarraEnum: string
{
    case EAN = 'EAN';
    case UPC = 'UPC';
    case CODE128 = 'CODE128';
    case INTERNAL = 'INTERNAL';
    case QR = 'QR';

    public function getDescripcion(): string
    {
        return match ($this) {
            self::EAN => 'Código EAN-13',
            self::UPC => 'Código UPC',
            self::CODE128 => 'Código 128 (Logística)',
            self::INTERNAL => 'Código Interno',
            self::QR => 'Código QR',
        };
    }

    public function getLongitudValida(): array
    {
        return match ($this) {
            self::EAN => [8, 13],           // EAN-8, EAN-13
            self::UPC => [12, 14],          // UPC-A, UPC-E
            self::CODE128 => [],            // Longitud variable
            self::INTERNAL => [],           // Longitud variable
            self::QR => [],                 // Longitud variable
        };
    }

    public function requiereValidacion(): bool
    {
        return in_array($this, [self::EAN, self::UPC]);
    }

    public function esAutomatizable(): bool
    {
        return in_array($this, [self::EAN, self::INTERNAL]);
    }

    public function getColor(): string
    {
        return match ($this) {
            self::EAN => 'blue',
            self::UPC => 'green',
            self::CODE128 => 'purple',
            self::INTERNAL => 'gray',
            self::QR => 'red',
        };
    }

    public static function getOptions(): array
    {
        return collect(self::cases())->map(fn ($tipo) => [
            'value' => $tipo->value,
            'label' => $tipo->getDescripcion(),
            'color' => $tipo->getColor(),
            'requiere_validacion' => $tipo->requiereValidacion(),
            'es_automatizable' => $tipo->esAutomatizable(),
        ])->toArray();
    }

    public static function paraSelects(): array
    {
        return collect(self::cases())
            ->map(fn ($tipo) => [
                'value' => $tipo->value,
                'label' => $tipo->getDescripcion(),
            ])
            ->toArray();
    }
}
