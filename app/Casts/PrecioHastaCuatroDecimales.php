<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Devuelve el precio como texto con 2 decimales como mínimo y 4 como máximo:
 * "75.00", "190.50", "190.5018".
 * Un valor de 2 decimales conserva el mismo formato que daba el cast decimal:2,
 * así ventas, reportes y la API móvil siguen recibiendo lo mismo.
 */
class PrecioHastaCuatroDecimales implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null) {
            return null;
        }

        return preg_replace('/(\.\d{2}\d*?)0+$/', '$1', number_format((float) $value, 4, '.', ''));
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return $value;
    }
}
