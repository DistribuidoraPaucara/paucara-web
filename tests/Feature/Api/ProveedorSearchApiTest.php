<?php

use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('buscar api proveedores retorna resultados cuando encuentra coincidencias', function () {
    $user = User::factory()->create();

    // Crear proveedores de prueba
    $proveedor1 = Proveedor::factory()->create([
        'nombre' => 'Proveedor Test ABC',
        'email' => 'test@proveedor.com',
        'activo' => true,
    ]);

    $proveedor2 = Proveedor::factory()->create([
        'nombre' => 'Otro Proveedor',
        'nit' => '123456789',
        'activo' => true,
    ]);

    $proveedor3 = Proveedor::factory()->create([
        'nombre' => 'Proveedor Inactivo',
        'activo' => false,
    ]);

    $response = $this->actingAs($user)
        ->get('/api/proveedores/buscar?q=test');

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['nombre'])->toBe('Proveedor Test ABC');
    expect($data[0]['email'])->toBe('test@proveedor.com');
});

test('buscar api proveedores no retorna proveedores inactivos', function () {
    $user = User::factory()->create();

    Proveedor::factory()->create([
        'nombre' => 'Proveedor Inactivo Test',
        'activo' => false,
    ]);

    $response = $this->actingAs($user)
        ->get('/api/proveedores/buscar?q=test');

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [],
        ]);
});

test('buscar api proveedores requiere al menos 2 caracteres', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get('/api/proveedores/buscar?q=a');

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [],
        ]);
});

test('buscar api proveedores busca en nombre, razon social, nit y telefono', function () {
    $user = User::factory()->create();

    $proveedor1 = Proveedor::factory()->create([
        'nombre' => 'Empresa XYZ',
        'razon_social' => 'Test Razón Social',
        'nit' => '987654321',
        'telefono' => '555-0123',
        'activo' => true,
    ]);

    // Buscar por nombre
    $response = $this->actingAs($user)->get('/api/proveedores/buscar?q=XYZ');
    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);

    // Buscar por razón social
    $response = $this->actingAs($user)->get('/api/proveedores/buscar?q=test');
    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);

    // Buscar por NIT
    $response = $this->actingAs($user)->get('/api/proveedores/buscar?q=987654321');
    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);

    // Buscar por teléfono
    $response = $this->actingAs($user)->get('/api/proveedores/buscar?q=555');
    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
});

test('buscar api proveedores limita resultados correctamente', function () {
    $user = User::factory()->create();

    // Crear 15 proveedores con "test" en el nombre
    for ($i = 1; $i <= 15; $i++) {
        Proveedor::factory()->create([
            'nombre' => "Proveedor Test {$i}",
            'activo' => true,
        ]);
    }

    $response = $this->actingAs($user)
        ->get('/api/proveedores/buscar?q=test&limite=5');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(5);
});
