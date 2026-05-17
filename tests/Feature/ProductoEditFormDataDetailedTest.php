<?php

use App\Models\Categoria;
use App\Models\Marca;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\UnidadMedida;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('sends correct stock and price data in edit form', function () {
    // Desactivar middleware de autorización para el test
    $this->withoutMiddleware();

    $user = User::factory()->create();
    $this->actingAs($user);

    // Crear entidades relacionadas con nombres únicos por timestamp
    $id = rand(1000, 9999);
    $categoria = Categoria::create(['nombre' => "Bebidas Test {$id}", 'activo' => true]);
    $marca = Marca::create(['nombre' => "Marca Test {$id}", 'activo' => true]);
    $unidad = UnidadMedida::create(['codigo' => "T{$id}", 'nombre' => "Test Unit {$id}"]);

    // Crear tipos de precio únicos
    $tipoPublico = TipoPrecio::create([
        'codigo' => "P{$id}",
        'nombre' => "Público Test {$id}",
        'orden' => 1,
        'activo' => true,
        'porcentaje_ganancia' => 50,
    ]);
    $tipoMayorista = TipoPrecio::create([
        'codigo' => "M{$id}",
        'nombre' => "Mayorista Test {$id}",
        'orden' => 2,
        'activo' => true,
        'porcentaje_ganancia' => 30,
    ]);

    // Crear producto con todos los campos
    $producto = Producto::create([
        'nombre' => "Producto Test {$id}",
        'descripcion' => 'Descripción test',
        'categoria_id' => $categoria->id,
        'marca_id' => $marca->id,
        'unidad_medida_id' => $unidad->id,
        'peso' => 2.1,
        'stock_minimo' => 10,
        'stock_maximo' => 100,
        'activo' => true,
    ]);

    // Crear precios
    $precioPublico = PrecioProducto::create([
        'producto_id' => $producto->id,
        'nombre' => 'Precio Público',
        'precio' => 15.50,
        'tipo_precio_id' => $tipoPublico->id,
        'activo' => true,
    ]);

    $precioMayorista = PrecioProducto::create([
        'producto_id' => $producto->id,
        'nombre' => 'Precio Mayorista',
        'precio' => 12.00,
        'tipo_precio_id' => $tipoMayorista->id,
        'activo' => true,
    ]);

    // Hacer request al edit
    $response = $this->get("/productos/{$producto->id}/edit");

    $response->assertOk();

    // Debug: Ver el contenido completo de la respuesta
    $responseData = $response->original->getData();
    dd([
        'component' => $responseData['component'] ?? 'no component',
        'props' => array_keys($responseData['props'] ?? []),
        'producto_data' => $responseData['props']['producto'] ?? 'no producto',
    ]);
});
