<?php

use App\Models\Categoria;
use App\Models\CodigoBarra;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\UnidadMedida;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('buscar api productos retorna resultados cuando encuentra coincidencias', function () {
    $user = User::factory()->create();

    // Crear datos de prueba
    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();

    $producto = Producto::factory()->create([
        'nombre' => 'Producto Test ABC',
        'codigo_barras' => 'TEST001',
        'activo' => true,
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
    ]);

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=test');

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['nombre'])->toBe('Producto Test ABC');
});

test('buscar api productos no retorna productos inactivos', function () {
    $user = User::factory()->create();

    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();

    Producto::factory()->create([
        'nombre' => 'Producto Inactivo Test',
        'activo' => false,
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
    ]);

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=test');

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [],
        ]);
});

test('buscar api productos busca por códigos de barras', function () {
    $user = User::factory()->create();

    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();

    $producto = Producto::factory()->create([
        'nombre' => 'Producto con Código',
        'codigo_barras' => 'PROD001',
        'activo' => true,
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
    ]);

    // Crear código de barras
    CodigoBarra::factory()->create([
        'producto_id' => $producto->id,
        'codigo' => '7890123456789',
    ]);

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=7890123456789');

    $response->assertOk();
    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['nombre'])->toBe('Producto con Código');
});

test('buscar api productos incluye códigos de barras en respuesta', function () {
    $user = User::factory()->create();

    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();

    $producto = Producto::factory()->create([
        'nombre' => 'Producto Test',
        'codigo_barras' => 'PROD001',
        'activo' => true,
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
    ]);

    // Crear múltiples códigos de barras
    CodigoBarra::factory()->create([
        'producto_id' => $producto->id,
        'codigo' => '7890123456789',
    ]);

    CodigoBarra::factory()->create([
        'producto_id' => $producto->id,
        'codigo' => '1234567890123',
    ]);

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=producto');

    $response->assertOk();
    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0])->toHaveKey('codigos_barras');
    expect($data[0]['codigos_barras'])->toContain('7890123456789');
    expect($data[0]['codigos_barras'])->toContain('1234567890123');
});

test('buscar api productos requiere al menos 2 caracteres', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=a');

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [],
        ]);
});

test('buscar api productos limita resultados correctamente', function () {
    $user = User::factory()->create();

    $categoria = Categoria::factory()->create();
    $marca = Marca::factory()->create();
    $unidad = UnidadMedida::factory()->create();

    // Crear 15 productos con "test" en el nombre
    for ($i = 1; $i <= 15; $i++) {
        Producto::factory()->create([
            'nombre' => "Producto Test {$i}",
            'activo' => true,
            'categoria_id' => $categoria->id,
            'marca_id' => $marca->id,
            'unidad_medida_id' => $unidad->id,
        ]);
    }

    $response = $this->actingAs($user)
        ->get('/api/productos/buscar?q=test&limite=5');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(5);
});
