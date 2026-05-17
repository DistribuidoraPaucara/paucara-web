<?php

namespace App\Services\Traits;

use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Trait para manejar transacciones de base de datos de forma segura
 *
 * Proporciona métodos para ejecutar código dentro de transacciones
 * con manejo automático de rollback en caso de error.
 */
trait ManagesTransactions
{
    /**
     * Ejecutar una operación dentro de una transacción
     *
     * Maneja transacciones anidadas usando savepoints en PostgreSQL
     *
     * @param callable $callback Función que contiene la lógica
     * @param int $maxAttempts Número máximo de intentos (para deadlocks)
     * @return mixed Valor retornado por el callback
     *
     * @throws Throwable Si el callback falla después de maxAttempts
     */
    protected function transaction(
        callable $callback,
        int $maxAttempts = 1
    ): mixed {
        // Detectar si ya estamos dentro de una transacción
        $transactionLevel = DB::transactionLevel();
        $isNestedTransaction = $transactionLevel > 0;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                if ($isNestedTransaction) {
                    // ✅ Si ya hay transacción activa, usar savepoint en lugar de iniciar nueva
                    // Esto permite transacciones anidadas correctas en PostgreSQL
                    $savepointName = 'sp_' . uniqid() . '_' . $attempt;
                    DB::statement("SAVEPOINT {$savepointName}");

                    try {
                        $result = $callback();
                        DB::statement("RELEASE SAVEPOINT {$savepointName}");
                        return $result;
                    } catch (Throwable $e) {
                        DB::statement("ROLLBACK TO SAVEPOINT {$savepointName}");
                        throw $e;
                    }
                } else {
                    // ✅ No hay transacción activa, iniciar una nueva
                    return DB::transaction($callback);
                }
            } catch (Throwable $e) {
                // Si es el último intento, lanzar el error
                if ($attempt === $maxAttempts) {
                    throw $e;
                }

                // Esperar un poco antes de reintentar
                usleep(random_int(1000, 10000));
            }
        }
    }

    /**
     * Ejecutar operación sin transacción (para queries de solo lectura)
     *
     * @param callable $callback
     * @return mixed
     */
    protected function read(callable $callback): mixed
    {
        return $callback();
    }
}
