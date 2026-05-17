<?php

use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Compra;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\StockProducto;
use App\Models\UnidadMedida;
use App\Models\User;
use App\Models\Venta;
use App\Services\DashboardService;
use Carbon\Carbon;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('dashboard renders with correct data structure', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get('/dashboard');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('dashboard')
        ->has('metricas')
        ->has('graficoVentas')
        ->has('productosMasVendidos')
        ->has('alertasStock')
        ->has('ventasPorCanal')
        ->has('periodo')
    );
});

test('dashboard provides correct metrics structure', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get('/dashboard');

    $response->assertInertia(fn ($page) => $page->has('metricas.ventas.total')
        ->has('metricas.ventas.cantidad')
        ->has('metricas.ventas.promedio')
        ->has('metricas.ventas.cambio_porcentual')
        ->has('metricas.compras.total')
        ->has('metricas.compras.cantidad')
        ->has('metricas.inventario.total_productos')
        ->has('metricas.inventario.stock_total')
        ->has('metricas.caja.saldo')
        ->has('metricas.clientes.total')
        ->has('metricas.proformas.total')
    );
});

test('dashboard accepts period parameter for filtering', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get('/dashboard?periodo=semana_actual');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->where('periodo', 'semana_actual')
    );
});

test('dashboard service calculates metrics correctly with sample data', function () {
    $this->actingAs(User::factory()->create());

    // Crear datos de prueba
    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();
    $almacen = Almacen::factory()->create();
    $cliente = Cliente::factory()->create();
    $proveedor = Proveedor::factory()->create();

    $producto = Producto::factory()->create([
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
        'stock_minimo' => 10,
    ]);

    // Crear stock
    StockProducto::factory()->create([
        'producto_id' => $producto->id,
        'almacen_id' => $almacen->id,
        'cantidad_actual' => 100,
    ]);

    // Crear venta de prueba
    Venta::factory()->create([
        'cliente_id' => $cliente->id,
        'fecha' => Carbon::now(),
        'total' => 1000,
        'tipo_venta' => 'contado',
    ]);

    // Crear compra de prueba
    Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'fecha' => Carbon::now(),
        'total' => 800,
    ]);

    // Obtener métricas
    $dashboardService = new DashboardService;
    $metricas = $dashboardService->getMainMetrics('mes_actual');

    // Verificar estructura
    expect($metricas)->toHaveKeys([
        'ventas', 'compras', 'inventario', 'caja', 'clientes', 'proformas',
    ]);

    // Verificar datos de ventas
    expect($metricas['ventas']['total'])->toBeGreaterThan(0);
    expect($metricas['ventas']['cantidad'])->toBe(1);

    // Verificar datos de compras
    expect($metricas['compras']['total'])->toBeGreaterThan(0);
    expect($metricas['compras']['cantidad'])->toBe(1);

    // Verificar inventario
    expect($metricas['inventario']['total_productos'])->toBe(1);
    expect($metricas['inventario']['stock_total'])->toBe(100);
});

test('dashboard service detects stock alerts correctly', function () {
    $this->actingAs(User::factory()->create());

    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();
    $almacen = Almacen::factory()->create();

    // Producto con stock bajo
    $productoStockBajo = Producto::factory()->create([
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
        'stock_minimo' => 20,
    ]);

    StockProducto::factory()->create([
        'producto_id' => $productoStockBajo->id,
        'almacen_id' => $almacen->id,
        'cantidad_actual' => 15, // Menor al mínimo
    ]);

    // Producto sin stock
    $productoSinStock = Producto::factory()->create([
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
        'stock_minimo' => 10,
    ]);

    StockProducto::factory()->create([
        'producto_id' => $productoSinStock->id,
        'almacen_id' => $almacen->id,
        'cantidad_actual' => 0,
    ]);

    $dashboardService = new DashboardService;
    $alertas = $dashboardService->getAlertasStock();

    expect($alertas['stock_bajo'])->toBe(1);
    expect($alertas['stock_critico'])->toBe(1);
    expect($alertas['productos_afectados'])->toHaveCount(2);
});
