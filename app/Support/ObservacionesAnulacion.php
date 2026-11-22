<?php

namespace App\Support;

/**
 * Al anular o rechazar un documento, el sistema agrega a sus observaciones una línea de nota:
 * "[ANULADO] ..." (compras y ventas) o "Motivo rechazo: ..." (proformas).
 * Al duplicar, esa nota no debe copiarse: la copia es un documento nuevo.
 */
class ObservacionesAnulacion
{
    private const PREFIJOS_NOTA = ['[ANULADO]', 'Motivo rechazo:'];

    public static function limpiar(?string $observaciones): string
    {
        if ($observaciones === null || trim($observaciones) === '') {
            return '';
        }

        $lineas = preg_split('/\r\n|\r|\n/', $observaciones) ?: [];
        $conservadas = array_filter($lineas, function (string $linea) {
            $inicio = ltrim($linea);
            foreach (self::PREFIJOS_NOTA as $prefijo) {
                if (str_starts_with($inicio, $prefijo)) {
                    return false;
                }
            }

            return true;
        });

        return trim(implode("\n", $conservadas));
    }
}
