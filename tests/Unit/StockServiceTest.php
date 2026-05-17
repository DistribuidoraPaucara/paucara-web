<?php

namespace Tests\Unit;

use App\Models\Almacen;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockServiceTest extends TestCase
{
    use RefreshDatabase;

    private StockService $stockService;

    private Producto $producto;

    private Almacen $almacen;

    protected function setUp(): void
    {
        parent::setUp();
        $this->stockService = new StockService;

        // Crear productos y almacenes de prueba
        $this->almacen = Almacen::create([
            'codigo' => 'ALM001',
            'nombre' => 'Almacén Principal',
            'descripcion' => 'Almacén principal para pruebas',
            'activo' => true,
        ]);

        $this->producto = Producto::create([
            'codigo' => 'PROD001',
            'nombre' => 'Producto de prueba',
            'descripcion' => 'Producto para testing',
            'categoria_id' => 1, // Asumimos que existe
            'unidad_id' => 1, // Asumimos que existe
            'activo' => true,
        ]);
    }

    public function test_validar_stock_disponible_con_stock_suficiente()
    {
        // Crear stock disponible
        StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 100,
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now(),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $resultado = $this->stockService->validarStockDisponible([
            ['producto_id' => $this->producto->id, 'cantidad' => 50],
        ], $this->almacen->id);

        $this->assertTrue($resultado['valido']);
        $this->assertEmpty($resultado['errores']);
    }

    public function test_validar_stock_disponible_con_stock_insuficiente()
    {
        // Crear stock limitado
        StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 30,
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now(),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $resultado = $this->stockService->validarStockDisponible([
            ['producto_id' => $this->producto->id, 'cantidad' => 50],
        ], $this->almacen->id);

        $this->assertFalse($resultado['valido']);
        $this->assertCount(1, $resultado['errores']);
        $this->assertStringContainsString('Stock insuficiente', $resultado['errores'][0]);
    }

    public function test_procesar_salida_venta_fifo()
    {
        // Crear múltiples lotes con diferentes fechas
        $lote1 = StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 50,
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now()->subDays(10),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $lote2 = StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 30,
            'costo_unitario' => 12.00,
            'precio_compra' => 12.00,
            'fecha_ingreso' => now()->subDays(5),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $this->stockService->procesarSalidaVenta([
            ['producto_id' => $this->producto->id, 'cantidad' => 60],
        ], 'VENTA-001', $this->almacen->id);

        // Verificar que se procesó FIFO
        $lote1->refresh();
        $lote2->refresh();

        $this->assertEquals(0, $lote1->cantidad_disponible);  // Se agotó el primer lote
        $this->assertEquals(20, $lote2->cantidad_disponible); // Se redujo el segundo lote

        // Verificar movimientos de inventario
        $movimientos = MovimientoInventario::where('venta_id', 'VENTA-001')->get();
        $this->assertCount(2, $movimientos); // Debe haber 2 movimientos (uno por cada lote usado)
    }

    public function test_obtener_stock_total_producto()
    {
        // Crear stock en múltiples almacenes
        StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 50,
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now(),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $almacen2 = Almacen::create([
            'codigo' => 'ALM002',
            'nombre' => 'Almacén Secundario',
            'descripcion' => 'Segundo almacén',
            'activo' => true,
        ]);

        StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $almacen2->id,
            'cantidad_disponible' => 30,
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now(),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $stockTotal = $this->stockService->obtenerStockTotalProducto($this->producto->id);

        $this->assertEquals(80, $stockTotal);
    }

    public function test_obtener_productos_stock_bajo()
    {
        // Crear producto con stock bajo
        StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 5, // Stock muy bajo
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now(),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        // Crear otro producto con stock normal
        $producto2 = Producto::create([
            'codigo' => 'PROD002',
            'nombre' => 'Producto normal',
            'descripcion' => 'Producto con stock normal',
            'categoria_id' => 1,
            'unidad_id' => 1,
            'activo' => true,
        ]);

        StockProducto::create([
            'producto_id' => $producto2->id,
            'almacen_id' => $this->almacen->id,
            'cantidad_disponible' => 100,
            'costo_unitario' => 10.00,
            'precio_compra' => 10.00,
            'fecha_ingreso' => now(),
            'fecha_vencimiento' => now()->addMonths(6),
        ]);

        $productosStockBajo = $this->stockService->obtenerProductosStockBajo(10);

        $this->assertCount(1, $productosStockBajo);
        $this->assertEquals($this->producto->id, $productosStockBajo[0]->id);
    }
}
