<?php

use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\TipoPrecio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('returns products with price, stock, category and brand information', function () {
    $user = User::factory()->create();

    // Buscar o crear tipos de precio necesarios
    $tipoPrecioBase = TipoPrecio::firstOrCreate([
        'codigo' => 'COSTO',
    ], [
        'codigo' => 'COSTO',
        'nombre' => 'Costo',
        'descripcion' => 'Precio de costo base',
        'es_precio_base' => true,
        'activo' => true,
        'color' => '#000000',
        'es_ganancia' => false,
        'porcentaje_ganancia' => 0,
        'orden' => 1,
        'es_sistema' => true,
        'configuracion' => [],
    ]);

    // Crear datos necesarios
    $categoria = Categoria::factory()->create(['nombre' => 'Electrónicos']);
    $marca = Marca::factory()->create(['nombre' => 'Samsung']);
    $almacen = Almacen::factory()->create(['nombre' => 'Principal', 'activo' => true]);

    // Crear producto con precio y stock
    $producto = Producto::factory()->create([
        'nombre' => 'Smartphone Galaxy',
        'codigo_barras' => '123456789',
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'activo' => true,
    ]);

    // Crear precio base
    PrecioProducto::factory()->create([
        'producto_id' => $producto->id,
        'precio' => 500.00,
        'es_precio_base' => true,
        'tipo_precio_id' => $tipoPrecioBase->id,
        'activo' => true,
    ]);

    // Crear stock en almacén
    StockProducto::factory()->create([
        'producto_id' => $producto->id,
        'almacen_id' => $almacen->id,
        'cantidad' => 10,
        'cantidad_disponible' => 8,
    ]);

    // Hacer petición de búsqueda
    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=Smartphone&limite=10');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'nombre',
                    'codigo_barras',
                    'codigos_barras',
                    'precio_base',
                    'stock_total',
                    'categoria',
                    'marca',
                ],
            ],
        ]);

    $data = $response->json('data')[0];

    expect($data['precio_base'])->toBe('500.00');
    expect($data['stock_total'])->toBe(8);
    expect($data['categoria'])->toBe('Electrónicos');
    expect($data['marca'])->toBe('Samsung');
});

test('returns empty array for short search queries', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=a&limite=10');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'data' => [],
        ]);
});

test('searches by product name, barcode and additional codes', function () {
    $user = User::factory()->create();

    // Buscar o crear tipo de precio base
    $tipoPrecioBase = TipoPrecio::firstOrCreate([
        'codigo' => 'VENTA',
    ], [
        'codigo' => 'VENTA',
        'nombre' => 'Venta',
        'descripcion' => 'Precio de venta',
        'es_precio_base' => false,
        'activo' => true,
        'color' => '#00ff00',
        'es_ganancia' => true,
        'porcentaje_ganancia' => 20,
        'orden' => 2,
        'es_sistema' => true,
        'configuracion' => [],
    ]);

    // Crear producto
    $producto = Producto::factory()->create([
        'nombre' => 'Laptop Dell',
        'codigo_barras' => '987654321',
        'activo' => true,
    ]);

    // Crear precio base
    PrecioProducto::factory()->create([
        'producto_id' => $producto->id,
        'precio' => 1200.00,
        'es_precio_base' => true,
        'tipo_precio_id' => $tipoPrecioBase->id,
        'activo' => true,
    ]);

    // Buscar por nombre
    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=Dell&limite=10');
    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(1);

    // Buscar por código de barras
    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=987654321&limite=10');
    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(1);
});
