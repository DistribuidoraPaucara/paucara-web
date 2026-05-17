<?php

namespace Tests\Unit;

use Tests\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Database\Eloquent\Model;

/**
 * Base TestCase para pruebas unitarias
 *
 * IMPORTANTE:
 * - Este TestCase REFRESCAA la base de datos antes de cada test
 * - Usa la conexión 'testing' (sqlite en memoria)
 * - Ejecuta migrations antes de cada test
 *
 * ESTRUCTURA:
 * tests/Unit/Services/    → Service tests
 * tests/Unit/DTOs/        → DTO tests
 * tests/Integration/      → Service integration tests (con transacciones)
 * tests/Feature/          → Controller tests (requests HTTP)
 */
class TestCase extends BaseTestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        // Desactivar lazy loading para detectar N+1 queries
        Model::preventLazyLoading(!$this->app->isProduction());

        // Configuración de seeders si aplica
        // $this->seed(DatabaseSeeder::class);
    }

    /**
     * Helper: Crear datos de test con factory
     *
     * Ejemplo:
     * $venta = $this->createVenta(['total' => 1000, 'estado' => 'PENDIENTE']);
     */
    protected function createVenta(array $attributes = [])
    {
        return \App\Models\Venta::factory()->create($attributes);
    }

    protected function createProforma(array $attributes = [])
    {
        return \App\Models\Proforma::factory()->create($attributes);
    }

    protected function createEntrega(array $attributes = [])
    {
        return \App\Models\Entrega::factory()->create($attributes);
    }

    protected function createProducto(array $attributes = [])
    {
        return \App\Models\Producto::factory()->create($attributes);
    }

    protected function createUsuario(array $attributes = [])
    {
        return \App\Models\User::factory()->create($attributes);
    }

    /**
     * Helper: Assert que una excepción fue lanzada con mensaje específico
     */
    protected function assertExceptionMessage(callable $callback, string $exceptionClass, string $expectedMessage)
    {
        try {
            $callback();
            $this->fail("Expected {$exceptionClass} but no exception was thrown");
        } catch (\Throwable $exception) {
            $this->assertInstanceOf($exceptionClass, $exception);
            $this->assertStringContainsString($expectedMessage, $exception->getMessage());
        }
    }

    /**
     * Helper: Verificar que una transacción se revirtió
     *
     * Útil para verificar rollback en servicios
     */
    protected function assertTransactionRolledBack(callable $operation, string $modelClass, array $attributes)
    {
        $countBefore = $modelClass::count();

        try {
            $operation();
        } catch (\Exception $e) {
            // Excepción esperada
        }

        $countAfter = $modelClass::count();
        $this->assertEquals($countBefore, $countAfter, "Transaction was not rolled back");
    }
}
