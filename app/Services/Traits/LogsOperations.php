<?php

namespace App\Services\Traits;

use Illuminate\Support\Facades\Log;

/**
 * Trait para logging centralizado en Services
 *
 * Proporciona métodos estándar para registrar operaciones
 * de forma consistente en toda la aplicación.
 */
trait LogsOperations
{
    /**
     * Registro de operación exitosa
     */
    protected function logSuccess(string $message, array $context = []): void
    {
        Log::info($message, $this->enrichContext('success', $context));
    }

    /**
     * Registro de operación fallida
     */
    protected function logError(string $message, array $context = [], ?\Throwable $exception = null): void
    {
        $context = $this->enrichContext('error', $context);

        if ($exception) {
            $context['exception'] = $exception->getMessage();
            $context['trace'] = $exception->getTraceAsString();
        }

        Log::error($message, $context);
    }

    /**
     * Registro de advertencia
     */
    protected function logWarning(string $message, array $context = []): void
    {
        Log::warning($message, $this->enrichContext('warning', $context));
    }

    /**
     * Enriquecer contexto con información estándar
     */
    private function enrichContext(string $level, array $context): array
    {
        return array_merge(
            [
                'service' => class_basename($this),
                'level' => $level,
                'timestamp' => now()->toIso8601String(),
                'user_id' => auth()->id(),
            ],
            $context
        );
    }
}
