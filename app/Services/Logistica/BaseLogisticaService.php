<?php

namespace App\Services\Logistica;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BaseLogisticaService
{
    /**
     * Ejecutar una operación dentro de una transacción de base de datos
     *
     * @param callable $callback
     * @return mixed
     * @throws Exception
     */
    protected function transaction(callable $callback)
    {
        return DB::transaction($callback);
    }

    /**
     * Loguear un mensaje de éxito
     *
     * @param string $mensaje
     * @param array $contexto
     */
    protected function logSuccess(string $mensaje, array $contexto = []): void
    {
        Log::info('✅ ' . $mensaje, $contexto);
    }

    /**
     * Loguear un mensaje de error
     *
     * @param string $mensaje
     * @param array $contexto
     */
    protected function logError(string $mensaje, array $contexto = []): void
    {
        Log::error('❌ ' . $mensaje, $contexto);
    }

    /**
     * Loguear un mensaje de advertencia
     *
     * @param string $mensaje
     * @param array $contexto
     */
    protected function logWarning(string $mensaje, array $contexto = []): void
    {
        Log::warning('⚠️ ' . $mensaje, $contexto);
    }

    /**
     * Loguear un mensaje informativo
     *
     * @param string $mensaje
     * @param array $contexto
     */
    protected function logInfo(string $mensaje, array $contexto = []): void
    {
        Log::info('ℹ️ ' . $mensaje, $contexto);
    }
}
