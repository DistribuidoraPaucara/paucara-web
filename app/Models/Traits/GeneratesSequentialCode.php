<?php

namespace App\Models\Traits;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

/**
 * Trait para generar números secuenciales con protección contra race conditions
 *
 * Características:
 * - Usa lockForUpdate() para evitar condiciones de carrera
 * - Reintentos automáticos con backoff exponencial en caso de deadlock
 * - Padding inteligente: 4 dígitos (0001-0999), luego sin padding (1000+)
 * - Logging detallado para auditoría
 *
 * Métodos disponibles:
 * - generateSequentialCode() : Prefijo-Fecha-Secuencial (ej: VEN20250126-0001, VEN20250126-1000)
 * - generateIdBasedCode() : Prefijo-ID_PADDED (ej: PRO0001)
 *
 * Formato de ventas:
 * - VEN + YYYYMMDD + "-" + SECUENCIAL
 * - Ejemplos: VEN20250126-0001, VEN20250126-0999, VEN20250126-1000, VEN20250126-1001
 *
 * Uso:
 * class Venta extends Model {
 *     use GeneratesSequentialCode;
 *
 *     public static function generarNumero(): string {
 *         return static::generateSequentialCode('VEN');
 *     }
 * }
 */
trait GeneratesSequentialCode
{
    /**
     * Genera código secuencial: PREFIX-FECHA-NÚMERO
     * Formato: VEN + YYYYMMDD + "-" + SECUENCIAL
     * Ejemplos: VEN20250126-0001, VEN20250126-0999, VEN20250126-1000, VEN20250126-1001
     *
     * Padding inteligente:
     * - Si SECUENCIAL < 1000: muestra con 4 dígitos (0001, 0002, ..., 0999)
     * - Si SECUENCIAL >= 1000: muestra sin padding (1000, 1001, 1002, ...)
     *
     * @param string $prefix Prefijo del código (ej: 'VEN', 'PF', 'RTA')
     * @param string $column Columna donde se almacena (default: 'numero')
     * @param bool $includeDate Incluir fecha en el código (default: true)
     * @param string $dateFormat Formato de fecha (default: 'Ymd' = YYYYMMDD)
     * @param int $padding Ignorado - se usa padding inteligente (default: 6)
     * @param int $maxRetries Reintentos en caso de deadlock (default: 5)
     *
     * @return string Código generado
     * @throws \RuntimeException Si no puede generar después de reintentos
     *
     * Ejemplo de uso:
     * $numero = Venta::generateSequentialCode('VEN', 'numero', true, 'Ymd');
     * // Resultados progresivos:
     * // VEN20250126-0001 (primera venta del día)
     * // VEN20250126-0999 (venta 999 del día)
     * // VEN20250126-1000 (venta 1000 del día - cambio de formato)
     * // VEN20250126-1001 (venta 1001 del día)
     */
    protected static function generateSequentialCode(
        string $prefix,
        string $column = 'numero',
        bool $includeDate = true,
        string $dateFormat = 'Ymd',
        int $padding = 6,
        int $maxRetries = 5
    ): string {
        $date = $includeDate ? now()->format($dateFormat) : '';
        $pattern = "{$prefix}{$date}%";
        $retry = 0;

        while ($retry < $maxRetries) {
            try {
                // ✅ BLOQUEO PESIMISTA: Previene que múltiples procesos lean el mismo número
                // Esto es crítico en concurrencia alta para evitar duplicados
                $ultimo = static::where($column, 'like', $pattern)
                    ->orderBy($column, 'desc')
                    ->lockForUpdate()  // ← BLOQUEO CRUCIAL
                    ->first();

                $secuencial = 1;
                if ($ultimo) {
                    // El número tiene formato: PREFIX + DATE + SECUENCIAL
                    // Ej: VEN20251218-0001 o VEN20251218-1000
                    // Extraer los últimos dígitos numéricos (variable según el valor)
                    $numeroAnterior = $ultimo->{$column};

                    // Extraer el secuencial (últimos dígitos después del guion o fecha)
                    // Buscar desde el final: puede ser 0001-0999 (4 dígitos) o 1000+ (4+ dígitos)
                    preg_match('/(\d+)$/', $numeroAnterior, $matches);
                    if (isset($matches[1])) {
                        $secuencial = (int) $matches[1] + 1;
                    }
                }

                // Aplicar padding inteligente:
                // - Si secuencial < 1000: mostrar con 4 dígitos (0001, 0002, ..., 0999)
                // - Si secuencial >= 1000: sin padding (1000, 1001, 1002, ...)
                if ($secuencial < 1000) {
                    $secuencialFormato = str_pad($secuencial, 4, '0', STR_PAD_LEFT);
                } else {
                    $secuencialFormato = (string) $secuencial;
                }

                $numeroGenerado = $prefix . $date . '-' . $secuencialFormato;

                Log::info('Número secuencial generado exitosamente', [
                    'prefix' => $prefix,
                    'numero' => $numeroGenerado,
                    'intento' => $retry + 1,
                    'modelo' => static::class,
                ]);

                return $numeroGenerado;

            } catch (QueryException $e) {
                // Detectar deadlock o lock wait timeout
                $isDeadlock = stripos($e->getMessage(), 'deadlock') !== false ||
                              stripos($e->getMessage(), 'lock wait timeout') !== false ||
                              $e->getCode() == '40001' ||
                              $e->getCode() == '1213';

                if ($isDeadlock) {
                    $retry++;
                    if ($retry >= $maxRetries) {
                        Log::error('Error máximo de reintentos alcanzado generando código secuencial', [
                            'prefix' => $prefix,
                            'modelo' => static::class,
                            'intentos' => $maxRetries,
                            'error' => $e->getMessage(),
                        ]);
                        throw new \RuntimeException(
                            "No se pudo generar número único para {$prefix} después de {$maxRetries} intentos"
                        );
                    }

                    // Backoff exponencial: 0.1s, 0.2s, 0.4s, 0.8s, 1.6s
                    $waitTime = 100000 * pow(2, $retry - 1);
                    Log::warning('Deadlock detectado, reintentando...', [
                        'prefix' => $prefix,
                        'intento' => $retry,
                        'waitMs' => $waitTime / 1000,
                    ]);
                    usleep($waitTime);
                    continue;
                }

                // Otro tipo de error - no reintentar
                Log::error('Error inesperado generando código secuencial', [
                    'prefix' => $prefix,
                    'modelo' => static::class,
                    'error' => $e->getMessage(),
                    'code' => $e->getCode(),
                ]);
                throw $e;
            }
        }

        throw new \RuntimeException("Falló al generar código secuencial para {$prefix}");
    }

    /**
     * Genera código basado en ID: PREFIX-ID_PADDED
     * Ejemplo: PRO0001, CLT0123, PRV0456
     *
     * Útil para entidades que usan su ID como parte del código.
     * Ej: Cliente#123 → CLT0123, Producto#456 → PRO0456
     *
     * @param string $prefix Prefijo del código (ej: 'PRO', 'CLT', 'PRV')
     * @param int $padding Cantidad de dígitos para el ID (default: 4)
     *
     * @return string Código generado basado en ID
     *
     * Ejemplo:
     * $codigo = $cliente->generateIdBasedCode('CLT', 4);
     * // Si cliente->id = 123, retorna: CLT0123
     */
    protected function generateIdBasedCode(
        string $prefix,
        int $padding = 4
    ): string {
        $numero = (int) $this->id;

        // Si el número cabe en el padding, agregarle ceros a la izquierda
        if ($numero < pow(10, $padding)) {
            return $prefix . str_pad((string) $numero, $padding, '0', STR_PAD_LEFT);
        }

        // Si el número es muy grande, retornar sin padding
        return $prefix . $numero;
    }
}
