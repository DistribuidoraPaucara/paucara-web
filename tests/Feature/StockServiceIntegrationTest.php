<?php

namespace Tests\Feature;

use App\Services\StockService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class StockServiceIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_stock_service_methods_exist()
    {
        $stockService = new StockService;

        // Verificar que los métodos principales existen
        $this->assertTrue(method_exists($stockService, 'validarStockDisponible'));
        $this->assertTrue(method_exists($stockService, 'procesarSalidaVenta'));
        $this->assertTrue(method_exists($stockService, 'procesarEntradaCompra'));
        $this->assertTrue(method_exists($stockService, 'obtenerStockTotalProducto'));
        $this->assertTrue(method_exists($stockService, 'obtenerProductosStockBajo'));
    }

    public function test_validar_stock_disponible_structure()
    {
        $stockService = new StockService;

        // Test con productos vacíos
        $resultado = $stockService->validarStockDisponible([], 1);

        // Verificar estructura de respuesta
        $this->assertIsArray($resultado);
        $this->assertArrayHasKey('valido', $resultado);
        $this->assertArrayHasKey('errores', $resultado);
        $this->assertArrayHasKey('detalles', $resultado);
        $this->assertTrue($resultado['valido']); // Sin productos debería ser válido
        $this->assertEmpty($resultado['errores']);
    }

    public function test_obtener_stock_total_producto_con_producto_inexistente()
    {
        $stockService = new StockService;

        // Test con producto inexistente
        $stockTotal = $stockService->obtenerStockTotalProducto(99999);

        $this->assertEquals(0, $stockTotal);
    }

    public function test_obtener_productos_stock_bajo_structure()
    {
        $stockService = new StockService;

        // Test con límite alto
        $productosStockBajo = $stockService->obtenerProductosStockBajo(1000);

        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $productosStockBajo);
    }
}
