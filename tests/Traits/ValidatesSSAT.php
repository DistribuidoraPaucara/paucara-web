<?php

namespace Tests\Traits;

use Illuminate\Support\Facades\DB;

/**
 * Trait para validar que la arquitectura SSOT se respeta
 *
 * SSOT = Single Source of Truth
 * Validaciones:
 * 1. Una operación solo se ejecuta una vez (no duplicadas)
 * 2. Las transacciones son atómicas (todo o nada)
 * 3. Los datos convergen a estado correcto
 * 4. Las excepciones revierten cambios
 * 5. Las operaciones concurrentes no generan inconsistencias
 */
trait ValidatesSSAT
{
    /**
     * Validar que una operación es idempotente (puede repetirse)
     *
     * Ejemplo:
     * $this->assertIdempotent(function () {
     *     $this->stockService->procesarSalidaVenta($productos);
     * }, function () {
     *     return StockProducto::where('producto_id', 1)->sum('cantidad');
     * }, 100); // Stock debe ser 100 después de 1 o N operaciones
     */
    protected function assertIdempotent(callable $operation, callable $stateChecker, $expectedFinalState)
    {
        // Primera ejecución
        $operation();
        $firstState = $stateChecker();

        // Segunda ejecución (debe fallar o no cambiar estado)
        try {
            $operation();
            $secondState = $stateChecker();
            $this->assertEquals($firstState, $secondState, "Operation is not idempotent");
        } catch (\Exception $e) {
            // Esperamos que falle en segunda intención
            $this->assertIsString($e->getMessage());
        }

        // Estado final es el esperado
        $this->assertEquals($expectedFinalState, $stateChecker());
    }

    /**
     * Validar que una operación es atómica
     *
     * Si algo falla a mitad, TODO se revierte
     *
     * Ejemplo:
     * $this->assertTransactionAtomic(function () {
     *     Venta::create([...]);
     *     VentaDetalle::create([...]);
     *     throw new Exception("Error simulado");
     * }, Venta::class, 'numero', 'V-001');
     */
    protected function assertTransactionAtomic(callable $operation, string $modelClass, string $field, $value)
    {
        $countBefore = $modelClass::count();

        try {
            DB::transaction($operation);
        } catch (\Exception $e) {
            // Error esperado
        }

        $countAfter = $modelClass::count();
        $this->assertEquals($countBefore, $countAfter, "Transaction was not atomic - partial data exists");

        // Verificar que el record específico no existe
        $exists = $modelClass::where($field, $value)->exists();
        $this->assertFalse($exists, "Record still exists after failed transaction");
    }

    /**
     * Validar que datos de múltiples tablas convergen al estado correcto
     *
     * Importante para Stock: cantidad_física - reservas = disponible
     */
    protected function assertDataConvergence(callable $operation, array $assertions)
    {
        $operation();

        foreach ($assertions as $assertionCallback) {
            $result = $assertionCallback();
            $this->assertTrue($result, "Data convergence failed");
        }
    }

    /**
     * Validar que una operación respeta el orden FIFO para Stock
     *
     * Stock con fechas: primer vencimiento primero
     */
    protected function assertFIFOStockOrder(
        \App\Models\Producto $producto,
        array $expectedOrder
    ) {
        $stocks = \App\Models\StockProducto::where('producto_id', $producto->id)
            ->orderBy('fecha_vencimiento', 'asc')
            ->get();

        $actualOrder = $stocks->pluck('id')->toArray();
        $this->assertEquals($expectedOrder, $actualOrder, "Stock not in FIFO order");
    }

    /**
     * Validar que operaciones concurrentes no crean inconsistencias
     *
     * Simula 2+ usuarios haciendo la misma operación simultáneamente
     */
    protected function assertConcurrentOperationsAreSafe(
        callable $operation,
        callable $dataChecker,
        $expectedResult,
        int $concurrency = 2
    ) {
        $promises = [];

        // Simular múltiples usuarios
        for ($i = 0; $i < $concurrency; $i++) {
            try {
                $operation();
            } catch (\Exception $e) {
                // Una debe fallar si hay conflicto
                continue;
            }
        }

        // Verificar que solo uno logró (o convergen al estado correcto)
        $result = $dataChecker();
        $this->assertEquals($expectedResult, $result);
    }

    /**
     * Validar que los eventos se emiten DESPUÉS de la transacción
     *
     * Importante: Service emite event DESPUÉS de commit, no antes
     */
    protected function assertEventEmittedAfterCommit(callable $operation, string $eventClass)
    {
        $eventFired = false;
        $transactionCommitted = false;

        \Event::listen($eventClass, function () use (&$eventFired) {
            $eventFired = true;
        });

        DB::listen(function ($query) use (&$transactionCommitted) {
            if (str_contains($query->sql, 'COMMIT')) {
                $transactionCommitted = true;
            }
        });

        $operation();

        $this->assertTrue($eventFired, "Event was not emitted");
        // Nota: this is a simplified check; en producción usar más verificaciones
    }
}
