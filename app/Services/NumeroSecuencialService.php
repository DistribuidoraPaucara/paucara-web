<?php

namespace App\Services;

use App\Models\NumeroSecuencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * NumeroSecuencialService - Genera números secuenciales garantizados sin saltos
 *
 * Características:
 * ✅ Sin saltos cuando hay transacciones fallidas
 * ✅ Una secuencia por tipo y fecha (resetea diariamente)
 * ✅ Bloqueo pesimista (lockForUpdate) para evitar duplicados
 * ✅ Reintentos automáticos en caso de deadlock
 * ✅ Logging detallado para auditoría
 *
 * Ejemplo de uso:
 *  $numero = app(NumeroSecuencialService::class)->generar('VENTA');
 *  // Retorna: VEN20260704-0001, VEN20260704-0002, etc.
 *
 * Tipos soportados:
 *  - VENTA (VEN)
 *  - PROFORMA (PRO)
 *  - COMPRA (COM)
 *  - DEVOLUCION (DEV)
 *  - ASIENTO (ASI)
 */
class NumeroSecuencialService
{
    // Mapeo de tipos a prefijos
    private const TIPO_PREFIJO = [
        'VENTA' => 'VEN',
        'PROFORMA' => 'PRO',
        'COMPRA' => 'COM',
        'DEVOLUCION' => 'DEV',
        'ASIENTO' => 'ASI',
        'COMPROBANTE' => 'CBE',
        'FACTURA' => 'FAC',
    ];

    // Configuración de reintentos
    private const MAX_REINTENTOS = 5;
    private const BACKOFF_MS = 100; // milliseconds

    /**
     * Generar número secuencial sin saltos
     *
     * @param string $tipo Tipo de documento (VENTA, PROFORMA, COMPRA, etc.)
     * @param int $padding Cantidad de dígitos para la secuencia (default: 4)
     * @param string $dateFormat Formato de fecha (default: 'Ymd' = YYYYMMDD)
     *
     * @return string Número generado (ej: VEN20260704-0001)
     * @throws Exception Si no puede generar después de reintentos
     */
    public function generar(
        string $tipo,
        int $padding = 4,
        string $dateFormat = 'Ymd'
    ): string {
        // Validar tipo
        if (!isset(self::TIPO_PREFIJO[$tipo])) {
            throw new Exception(
                "Tipo de documento '{$tipo}' no soportado. Opciones: " .
                implode(', ', array_keys(self::TIPO_PREFIJO))
            );
        }

        $prefijo = self::TIPO_PREFIJO[$tipo];
        $fecha = today();
        $reintentos = 0;

        while ($reintentos < self::MAX_REINTENTOS) {
            try {
                // 🔒 Usar transacción DB para garantizar atomicidad
                $secuencial = DB::transaction(function () use ($tipo, $fecha) {
                    // ✅ CRÍTICO: lockForUpdate() evita condiciones de carrera
                    $registro = NumeroSecuencia::lock('for update')
                        ->where('tipo', $tipo)
                        ->where('fecha', $fecha)
                        ->first();

                    // Si no existe registro del día, crear con valor 0
                    if (!$registro) {
                        $registro = NumeroSecuencia::create([
                            'tipo' => $tipo,
                            'fecha' => $fecha,
                            'secuencial' => 0,
                        ]);
                    }

                    // ✅ Incrementar y obtener el nuevo valor
                    $registro->increment('secuencial');
                    $numeroSecuencial = $registro->secuencial;

                    Log::info('Número secuencial generado', [
                        'tipo' => $tipo,
                        'fecha' => $fecha->format('Y-m-d'),
                        'secuencial' => $numeroSecuencial,
                    ]);

                    return $numeroSecuencial;
                });

                // Formatear el número
                $secuencialFormato = str_pad($secuencial, 4, '0', STR_PAD_LEFT);
                $numeroGenerado = "{$prefijo}{$fecha->format($dateFormat)}-{$secuencialFormato}";

                Log::info('✅ Número secuencial generado exitosamente', [
                    'tipo' => $tipo,
                    'numero' => $numeroGenerado,
                    'intento' => $reintentos + 1,
                ]);

                return $numeroGenerado;

            } catch (Exception $e) {
                // Detectar deadlock o lock timeout
                $isDeadlock = stripos($e->getMessage(), 'deadlock') !== false ||
                              stripos($e->getMessage(), 'lock wait timeout') !== false ||
                              $e->getCode() == '40001' ||
                              $e->getCode() == '1213';

                if ($isDeadlock) {
                    $reintentos++;

                    if ($reintentos >= self::MAX_REINTENTOS) {
                        Log::error('❌ Max reintentos alcanzado generando número secuencial', [
                            'tipo' => $tipo,
                            'intentos' => self::MAX_REINTENTOS,
                            'error' => $e->getMessage(),
                        ]);

                        throw new Exception(
                            "No se pudo generar número para {$tipo} después de " .
                            self::MAX_REINTENTOS . " intentos. {$e->getMessage()}"
                        );
                    }

                    // Backoff exponencial: 100ms, 200ms, 400ms, 800ms, 1600ms
                    $waitMs = self::BACKOFF_MS * pow(2, $reintentos - 1);

                    Log::warning('⚠️ Deadlock detectado, reintentando...', [
                        'tipo' => $tipo,
                        'intento' => $reintentos,
                        'esperar_ms' => $waitMs,
                    ]);

                    usleep($waitMs * 1000);
                    continue;
                }

                // Otro tipo de error - no reintentar
                Log::error('❌ Error inesperado generando número secuencial', [
                    'tipo' => $tipo,
                    'error' => $e->getMessage(),
                    'code' => $e->getCode(),
                ]);

                throw $e;
            }
        }

        throw new Exception("Falló al generar número secuencial para {$tipo}");
    }

    /**
     * Obtener el próximo número sin incrementar (para preview)
     *
     * @param string $tipo Tipo de documento
     * @param string $dateFormat Formato de fecha
     *
     * @return string Número que será generado en la próxima llamada a generar()
     */
    public function obtenerSiguiente(string $tipo, string $dateFormat = 'Ymd'): string
    {
        if (!isset(self::TIPO_PREFIJO[$tipo])) {
            throw new Exception("Tipo de documento '{$tipo}' no soportado");
        }

        $prefijo = self::TIPO_PREFIJO[$tipo];
        $fecha = today();

        $registro = NumeroSecuencia::where('tipo', $tipo)
            ->where('fecha', $fecha)
            ->first();

        $siguienteSecuencial = ($registro?->secuencial ?? 0) + 1;
        $secuencialFormato = str_pad($siguienteSecuencial, 4, '0', STR_PAD_LEFT);

        return "{$prefijo}{$fecha->format($dateFormat)}-{$secuencialFormato}";
    }

    /**
     * Obtener el último número generado
     *
     * @param string $tipo Tipo de documento
     * @param string $dateFormat Formato de fecha
     * @param int $limite Cantidad de registros a retornar
     *
     * @return array Últimos números generados
     */
    public function obtenerUltimos(
        string $tipo,
        string $dateFormat = 'Ymd',
        int $limite = 10
    ): array {
        if (!isset(self::TIPO_PREFIJO[$tipo])) {
            throw new Exception("Tipo de documento '{$tipo}' no soportado");
        }

        $prefijo = self::TIPO_PREFIJO[$tipo];

        return NumeroSecuencia::where('tipo', $tipo)
            ->orderBy('fecha', 'desc')
            ->orderBy('secuencial', 'desc')
            ->limit($limite)
            ->get()
            ->map(function ($registro) use ($prefijo, $dateFormat) {
                $secuencialFormato = str_pad($registro->secuencial, 4, '0', STR_PAD_LEFT);
                return "{$prefijo}{$registro->fecha->format($dateFormat)}-{$secuencialFormato}";
            })
            ->toArray();
    }

    /**
     * Resetear secuencia (solo para tests o mantenimiento)
     *
     * ⚠️ CUIDADO: Usar solo en desarrollo/tests
     *
     * @param string $tipo Tipo de documento
     * @param string $fecha Fecha (default: hoy)
     */
    public function resetear(string $tipo, string $fecha = null): void
    {
        if (app()->environment('production')) {
            throw new Exception('❌ No se puede resetear secuencias en producción');
        }

        $fecha = $fecha ? \Carbon\Carbon::parse($fecha) : today();

        NumeroSecuencia::where('tipo', $tipo)
            ->where('fecha', $fecha)
            ->delete();

        Log::warning('⚠️ Secuencia reseteada', [
            'tipo' => $tipo,
            'fecha' => $fecha->format('Y-m-d'),
        ]);
    }
}
