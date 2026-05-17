<?php

use App\Models\CategoriaCliente;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('crea cliente con ventanas de entrega y categorias', function () {
    $user = User::factory()->create();
    actingAs($user, 'sanctum');

    $catA = CategoriaCliente::create(['clave' => 'VIP', 'nombre' => 'VIP']);
    $catB = CategoriaCliente::create(['clave' => 'MAYORISTA', 'nombre' => 'Mayorista']);

    $payload = [
        'nombre' => 'Cliente App',
        'telefono' => '70000001',
        'ventanas_entrega' => [
            ['dia_semana' => 1, 'hora_inicio' => '08:00', 'hora_fin' => '12:00'],
            ['dia_semana' => 3, 'hora_inicio' => '14:00', 'hora_fin' => '17:30'],
        ],
        'categorias_ids' => [$catA->id, $catB->id],
    ];

    $response = test()->postJson('/api/clientes', $payload);

    $response->assertCreated();
    $response->assertJsonPath('data.cliente.nombre', 'Cliente App');
    $response->assertJsonCount(2, 'data.cliente.ventanas_entrega');
    $response->assertJsonCount(2, 'data.cliente.categorias');

    $clienteId = $response->json('data.cliente.id');

    expect(Cliente::find($clienteId)->ventanasEntrega()->count())->toBe(2);
});

it('actualiza y reemplaza ventanas de entrega y sincroniza categorias', function () {
    $user = User::factory()->create();
    actingAs($user, 'sanctum');

    $catA = CategoriaCliente::create(['clave' => 'FRECUENTE', 'nombre' => 'Frecuente']);
    $catB = CategoriaCliente::create(['clave' => 'DEUDOR', 'nombre' => 'Deudor']);

    // Crear cliente inicial con una ventana
    $cliente = Cliente::factory()->create([
        'nombre' => 'Cliente X',
    ]);

    // Pre-cargar una ventana
    $cliente->ventanasEntrega()->create([
        'dia_semana' => 1,
        'hora_inicio' => '08:00',
        'hora_fin' => '10:00',
        'activo' => true,
    ]);

    // Actualizar
    $payload = [
        'nombre' => 'Cliente X', // mantener nombre
        'ventanas_entrega' => [
            ['dia_semana' => 5, 'hora_inicio' => '09:00', 'hora_fin' => '13:00'],
        ],
        'categorias_ids' => [$catA->id],
    ];

    $response = test()->putJson('/api/clientes/'.$cliente->id, $payload);

    $response->assertOk();
    $response->assertJsonCount(1, 'data.cliente.ventanas_entrega');
    $response->assertJsonCount(1, 'data.cliente.categorias');

    // DB assertions
    expect($cliente->fresh()->ventanasEntrega()->count())->toBe(1);
});

it('tiene columna de hora de entrega requerida en pedidos', function () {
    expect(Schema::hasColumn('pedidos', 'hora_entrega_requerida'))->toBeTrue();
});
