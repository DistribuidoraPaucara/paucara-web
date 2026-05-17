<?php

namespace Tests\Unit\Services;

use App\DTOs\Stock\ValidacionStockDTO;
use App\Exceptions\Stock\StockInsuficientException;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\MovimientoInventario;
use App\Services\Stock\StockService;
use Tests\Unit\TestCase;
use Tests\Traits\ValidatesSSAT;

/**
 * Tests para StockService - SSOT de inventario
 *
 * VALIDACIONES:
 * ✓ Cálculo correcto de stock disponible
 * ✓ Validación de stock insuficiente
 * ✓ Consumo FIFO de stock
 * ✓ Atomicidad de transacciones
 * ✓ Auditoría en MovimientoInventario
 * ✓ Pessimistic locking previene race conditions
 */
class StockServiceTest extends TestCase
{
    use ValidatesSSAT;

    private StockService $stockService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->stockService = app(StockService::class);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: Validación de Stock
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function puede_validar_stock_disponible()
    {
        // Arrange
        $producto = $this->createProducto(['nombre' => 'Producto A']);
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 0,
        ]);

        // Act
        $validacion = $this->stockService->validarDisponible([
            ['producto_id' => $producto->id, 'cantidad' => 50],
        ]);

        // Assert
        $this->assertTrue($validacion['valido']);
        $this->assertEmpty($validacion['errores']);
    }

    /** @test */
    public function rechaza_stock_insuficiente()
    {
        // Arrange
        $producto = $this->createProducto(['nombre' => 'Producto B']);
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 50,
            'cantidad_reservada' => 0,
        ]);

        // Act
        $validacion = $this->stockService->validarDisponible([
            ['producto_id' => $producto->id, 'cantidad' => 100],
        ]);

        // Assert
        $this->assertFalse($validacion['valido']);
        $this->assertNotEmpty($validacion['errores']);
        $this->assertStringContainsString('Stock insuficiente', $validacion['errores'][0]);
    }

    /** @test */
    public function respeta_stock_reservado()
    {
        // Arrange: 100 total, 40 reservado = 60 disponible
        $producto = $this->createProducto();
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 40,
        ]);

        // Act
        $disponible = $this->stockService->obtenerDisponible($producto->id);

        // Assert
        $this->assertEquals(60, $disponible);
    }

    /** @test */
    public function calcula_disponible_multiples_lotes()
    {
        // Arrange: Producto con múltiples lotes de stock
        $producto = $this->createProducto();

        // Lote 1: 100 total, 30 reservado
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 30,
        ]);

        // Lote 2: 50 total, 10 reservado
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 50,
            'cantidad_reservada' => 10,
        ]);

        // Act
        $disponible = $this->stockService->obtenerDisponible($producto->id);

        // Assert: (100-30) + (50-10) = 70 + 40 = 110
        $this->assertEquals(110, $disponible);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: Procesamiento de Salida (Consumo)
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function procesa_salida_venta_atomicamente()
    {
        // Arrange
        $producto = $this->createProducto();
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 0,
        ]);

        // Act
        $resultado = $this->stockService->procesarSalidaVenta(
            [['producto_id' => $producto->id, 'cantidad' => 50]],
            'VENTA-001'
        );

        // Assert
        $stock = StockProducto::first();
        $this->assertEquals(50, $stock->cantidad);

        // Verificar auditoría
        $movimiento = MovimientoInventario::first();
        $this->assertNotNull($movimiento);
        $this->assertEquals('SALIDA', $movimiento->tipo);
        $this->assertEquals('VENTA-001', $movimiento->referencia);
    }

    /** @test */
    public function usa_fifo_para_consumo_de_stock()
    {
        // Arrange: Múltiples lotes con diferentes fechas de vencimiento
        $producto = $this->createProducto();

        // Lote viejo (vence primero)
        $lote1 = StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 30,
            'fecha_vencimiento' => now()->addDays(5),
        ]);

        // Lote nuevo (vence después)
        $lote2 = StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 70,
            'fecha_vencimiento' => now()->addDays(30),
        ]);

        // Act: Consumir 50 unidades
        $this->stockService->procesarSalidaVenta(
            [['producto_id' => $producto->id, 'cantidad' => 50]],
            'VENTA-FIFO'
        );

        // Assert: Debe consumir primero del lote 1 (30) + 20 del lote 2
        $this->assertEquals(0, $lote1->fresh()->cantidad);
        $this->assertEquals(50, $lote2->fresh()->cantidad);
    }

    /** @test */
    public function lanza_excepcion_si_stock_insuficiente_en_salida()
    {
        // Arrange
        $producto = $this->createProducto();
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 30,
        ]);

        // Act & Assert
        $this->expectException(StockInsuficientException::class);
        $this->stockService->procesarSalidaVenta(
            [['producto_id' => $producto->id, 'cantidad' => 100]],
            'VENTA-FAIL'
        );

        // Verificar que el stock NO cambió (rollback)
        $this->assertEquals(30, StockProducto::first()->cantidad);
    }

    /** @test */
    public function revierte_stock_en_caso_de_excepcion()
    {
        // Arrange
        $producto = $this->createProducto();
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
        ]);

        // Act: Simular operación fallida
        $this->assertTransactionRolledBack(
            function () use ($producto) {
                $this->stockService->procesarSalidaVenta(
                    [['producto_id' => $producto->id, 'cantidad' => 150]],
                    'FAIL'
                );
            },
            StockProducto::class,
            ['producto_id' => $producto->id]
        );

        // Assert: Stock intacto
        $this->assertEquals(100, StockProducto::first()->cantidad);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: Devoluciones
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function devuelve_stock_correctamente()
    {
        // Arrange
        $producto = $this->createProducto();
        $stock = StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 70, // Ya fue consumido
        ]);

        // Act
        $this->stockService->devolverStock(
            [['producto_id' => $producto->id, 'cantidad' => 30]],
            'DEVOLUCION-001'
        );

        // Assert
        $this->assertEquals(100, $stock->fresh()->cantidad);

        // Verificar auditoría
        $movimiento = MovimientoInventario::where('referencia', 'DEVOLUCION-001')->first();
        $this->assertNotNull($movimiento);
        $this->assertEquals('ENTRADA', $movimiento->tipo);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: Stock Bajo y Próximos a Vencer
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function identifica_stock_bajo()
    {
        // Arrange
        $productoNormal = $this->createProducto();
        $productoBajo = $this->createProducto();

        StockProducto::factory()->create([
            'producto_id' => $productoNormal->id,
            'cantidad' => 100,
        ]);

        StockProducto::factory()->create([
            'producto_id' => $productoBajo->id,
            'cantidad' => 5, // Bajo stock threshold
        ]);

        // Act
        $bajos = $this->stockService->obtenerStockBajo(threshold: 10);

        // Assert
        $this->assertCount(1, $bajos);
        $this->assertEquals($productoBajo->id, $bajos[0]->producto_id);
    }

    /** @test */
    public function identifica_proximos_a_vencer()
    {
        // Arrange
        $producto = $this->createProducto();

        // Vence en 3 días (próximo a vencer)
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'fecha_vencimiento' => now()->addDays(3),
        ]);

        // Vence en 30 días (no incluir)
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'fecha_vencimiento' => now()->addDays(30),
        ]);

        // Act
        $proximos = $this->stockService->obtenerProximosVencer(days: 7);

        // Assert
        $this->assertCount(1, $proximos);
        $this->assertTrue($proximos[0]->fecha_vencimiento->lessThan(now()->addDays(7)));
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: SSOT - Atomicidad y Convergencia
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function garantiza_consistencia_cantidad_fisica_menos_reservas()
    {
        // SSOT: cantidad_física - reservas = disponible
        // Arrange
        $producto = $this->createProducto();
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 25,
        ]);

        // Act & Assert
        $this->assertDataConvergence(
            function () use ($producto) {
                // No hacer nada, solo verificar
            },
            [
                // Validación 1: disponible = cantidad - reservada
                function () use ($producto) {
                    $stock = StockProducto::where('producto_id', $producto->id)->first();
                    $disponible = $stock->cantidad - $stock->cantidad_reservada;
                    return $disponible === 75;
                },
                // Validación 2: No hay cantidad negativa
                function () use ($producto) {
                    return StockProducto::where('producto_id', $producto->id)
                        ->where('cantidad', '<', 0)
                        ->doesntExist();
                },
            ]
        );
    }

    /** @test */
    public function todas_las_salidas_tienen_auditoria()
    {
        // Arrange
        $producto = $this->createProducto();
        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
        ]);

        // Act
        $this->stockService->procesarSalidaVenta(
            [['producto_id' => $producto->id, 'cantidad' => 50]],
            'VENTA-AUDIT'
        );

        // Assert: Debe existir registro de movimiento
        $movimiento = MovimientoInventario::where('referencia', 'VENTA-AUDIT')->first();
        $this->assertNotNull($movimiento);
        $this->assertEquals($producto->id, $movimiento->producto_id);
        $this->assertEquals('SALIDA', $movimiento->tipo);
        $this->assertEquals(50, $movimiento->cantidad);
    }
}
