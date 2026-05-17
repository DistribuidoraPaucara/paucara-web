<?php

namespace App\Helpers;

use Carbon\Carbon;
use NumberFormatter;

/**
 * Helper para formateo centralizado de datos
 *
 * Propósito: Estandarizar formateo de fechas, números y moneda
 * Elimina duplicación de lógica de formato en servicios y vistas
 */
class FormatHelper
{
    /**
     * Formatear fecha al formato argentino (DD/MM/YYYY)
     *
     * @param Carbon|string|null $date
     * @return string Fecha formateada o string vacío
     *
     * Ejemplo:
     * FormatHelper::date(Carbon::now())  // "10/12/2025"
     */
    public static function date($date = null): string
    {
        if (!$date) {
            return '';
        }

        $carbon = $date instanceof Carbon ? $date : Carbon::parse($date);
        return $carbon->format('d/m/Y');
    }

    /**
     * Formatear fecha y hora (DD/MM/YYYY HH:MM)
     *
     * @param Carbon|string|null $datetime
     * @return string Fecha y hora formateadas
     *
     * Ejemplo:
     * FormatHelper::datetime(now())  // "10/12/2025 14:30"
     */
    public static function datetime($datetime = null): string
    {
        if (!$datetime) {
            return '';
        }

        $carbon = $datetime instanceof Carbon ? $datetime : Carbon::parse($datetime);
        return $carbon->format('d/m/Y H:i');
    }

    /**
     * Formatear fecha en formato ISO (YYYY-MM-DD)
     *
     * Útil para inputs HTML type="date"
     *
     * @param Carbon|string|null $date
     * @return string
     *
     * Ejemplo:
     * FormatHelper::isoDate(now())  // "2025-12-10"
     */
    public static function isoDate($date = null): string
    {
        if (!$date) {
            return '';
        }

        $carbon = $date instanceof Carbon ? $date : Carbon::parse($date);
        return $carbon->format('Y-m-d');
    }

    /**
     * Formatear moneda a formato argentino
     *
     * @param float|int $amount Monto a formatear
     * @param string $currency Código de moneda (ARS, USD, etc)
     * @return string Moneda formateada
     *
     * Ejemplo:
     * FormatHelper::currency(1500.50)     // "$ 1.500,50"
     * FormatHelper::currency(100, 'USD')  // "US$ 100,00"
     */
    public static function currency($amount = 0, string $currency = 'ARS'): string
    {
        $formatter = new NumberFormatter('es_AR', NumberFormatter::CURRENCY);
        return $formatter->formatCurrency($amount, $currency);
    }

    /**
     * Formatear número con separadores de miles (argentino)
     *
     * @param float|int $number
     * @param int $decimals Cantidad de decimales
     * @return string
     *
     * Ejemplo:
     * FormatHelper::number(1500.5)     // "1.500,5"
     * FormatHelper::number(1500.5, 2)  // "1.500,50"
     */
    public static function number($number = 0, int $decimals = 2): string
    {
        return number_format((float) $number, $decimals, ',', '.');
    }

    /**
     * Formatear porcentaje
     *
     * @param float|int $value Valor decimal (0.85 = 85%)
     * @param int $decimals
     * @return string
     *
     * Ejemplo:
     * FormatHelper::percentage(0.85)     // "85%"
     * FormatHelper::percentage(0.8567, 2)  // "85,67%"
     */
    public static function percentage($value = 0, int $decimals = 0): string
    {
        $percent = $value * 100;
        return self::number($percent, $decimals) . '%';
    }

    /**
     * Formatear tamaño de archivo
     *
     * @param int $bytes Tamaño en bytes
     * @return string
     *
     * Ejemplo:
     * FormatHelper::fileSize(1024)        // "1 KB"
     * FormatHelper::fileSize(1048576)     // "1 MB"
     */
    public static function fileSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Truncar texto a X caracteres
     *
     * @param string $text
     * @param int $length
     * @param string $suffix
     * @return string
     *
     * Ejemplo:
     * FormatHelper::truncate('Descripción muy larga', 10)  // "Descripció..."
     */
    public static function truncate(string $text, int $length = 50, string $suffix = '...'): string
    {
        if (strlen($text) <= $length) {
            return $text;
        }

        return substr($text, 0, $length) . $suffix;
    }

    /**
     * Formatear slug (convertir a minúsculas y reemplazar espacios)
     *
     * @param string $text
     * @return string
     *
     * Ejemplo:
     * FormatHelper::slug('Mi Categoría')  // "mi-categoria"
     */
    public static function slug(string $text): string
    {
        return str_replace(
            ['á', 'é', 'í', 'ó', 'ú', 'ñ', ' '],
            ['a', 'e', 'i', 'o', 'u', 'n', '-'],
            strtolower($text)
        );
    }

    /**
     * Convertir número a palabras (letras)
     *
     * @param float|int $numero Número a convertir
     * @param string $moneda Nombre de la moneda (ej: "Bolivianos", "Pesos")
     * @return string Número en palabras
     *
     * Ejemplo:
     * FormatHelper::numeroALetras(150.50, 'Bolivianos')  // "Ciento cincuenta Bolivianos con 50 centavos"
     * FormatHelper::numeroALetras(100)                   // "Cien"
     */
    public static function numeroALetras($numero, string $moneda = ''): string
    {
        $numero = round($numero, 2);
        $partes = explode('.', (string)$numero);
        $entero = (int)$partes[0];
        $decimales = isset($partes[1]) ? (int)substr($partes[1], 0, 2) : 0;

        $unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        $decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        $adolecentes = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        $centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

        $resultado = '';

        if ($entero == 0) {
            $resultado = 'cero';
        } elseif ($entero < 10) {
            $resultado = $unidades[$entero];
        } elseif ($entero < 20) {
            $resultado = $adolecentes[$entero - 10];
        } elseif ($entero < 100) {
            $decena = intdiv($entero, 10);
            $unidad = $entero % 10;
            $resultado = $decenas[$decena];
            if ($unidad > 0) {
                $resultado .= ' y ' . $unidades[$unidad];
            }
        } elseif ($entero < 1000) {
            $centena = intdiv($entero, 100);
            $resto = $entero % 100;
            $resultado = $centenas[$centena];
            if ($resto > 0) {
                if ($resto < 10) {
                    $resultado .= ' ' . $unidades[$resto];
                } elseif ($resto < 20) {
                    $resultado .= ' ' . $adolecentes[$resto - 10];
                } else {
                    $dec = intdiv($resto, 10);
                    $uni = $resto % 10;
                    $resultado .= ' ' . $decenas[$dec];
                    if ($uni > 0) {
                        $resultado .= ' y ' . $unidades[$uni];
                    }
                }
            }
        } elseif ($entero < 1000000) {
            $miles = intdiv($entero, 1000);
            $resto = $entero % 1000;

            if ($miles == 1) {
                $resultado = 'mil';
            } else {
                $resultado = self::numeroALetras($miles) . ' mil';
            }

            if ($resto > 0) {
                $resultado .= ' ' . self::numeroALetras($resto);
            }
        } else {
            $millones = intdiv($entero, 1000000);
            $resto = $entero % 1000000;

            if ($millones == 1) {
                $resultado = 'un millón';
            } else {
                $resultado = self::numeroALetras($millones) . ' millones';
            }

            if ($resto > 0) {
                $resultado .= ' ' . self::numeroALetras($resto);
            }
        }

        $resultado = ucfirst($resultado);

        if ($moneda) {
            if ($decimales > 0) {
                $resultado .= " $moneda con " . str_pad((string)$decimales, 2, '0', STR_PAD_LEFT) . " centavos";
            } else {
                $resultado .= " $moneda";
            }
        } elseif ($decimales > 0) {
            $resultado .= " con " . str_pad((string)$decimales, 2, '0', STR_PAD_LEFT) . " centavos";
        }

        return $resultado;
    }
}
