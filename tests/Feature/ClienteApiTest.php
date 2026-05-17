<?php

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'web');
});

it('puede listar clientes via API', function () {
    $clientes = Cliente::factory(3)->create();

    $response = $this->getJson('/api/clientes');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'data' => [
                'data' => [
                    '*' => [
                        'id',
                        'nombre',
                        'email',
                        'telefono',
                        'activo',
                        'fecha_registro',
                    ],
                ],
                'current_page',
                'total',
            ],
            'message',
        ]);

    expect($response->json('data.data'))->toHaveCount(3);
});

it('puede crear un cliente via API', function () {
    $clienteData = [
        'nombre'         => 'Juan Pérez',
        'email'          => 'juan@example.com',
        'telefono'       => '70123456',
        'nit'            => '1234567',
        'limite_credito' => 1000,
    ];

    $response = $this->postJson('/api/clientes', $clienteData);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Cliente creado exitosamente',
        ]);

    $this->assertDatabaseHas('clientes', [
        'nombre'   => 'Juan Pérez',
        'email'    => 'juan@example.com',
        'telefono' => '70123456',
        'nit'      => '1234567',
    ]);
});

it('puede crear cliente con direcciones via API', function () {
    $clienteData = [
        'nombre'      => 'María González',
        'email'       => 'maria@example.com',
        'direcciones' => [
            [
                'direccion'    => 'Av. 6 de Agosto #123',
                'ciudad'       => 'La Paz',
                'departamento' => 'La Paz',
                'es_principal' => true,
            ],
            [
                'direccion'    => 'Calle Comercio #456',
                'ciudad'       => 'El Alto',
                'departamento' => 'La Paz',
                'es_principal' => false,
            ],
        ],
    ];

    $response = $this->postJson('/api/clientes', $clienteData);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Cliente creado exitosamente',
        ]);

    $cliente = Cliente::where('nombre', 'María González')->first();
    expect($cliente->direcciones)->toHaveCount(2);
});

it('puede actualizar un cliente via API', function () {
    $cliente = Cliente::factory()->create();

    $updateData = [
        'nombre'   => 'Nombre Actualizado',
        'telefono' => '77888999',
    ];

    $response = $this->putJson("/api/clientes/{$cliente->id}", $updateData);

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Cliente actualizado exitosamente',
        ]);

    $cliente->refresh();
    expect($cliente->nombre)->toBe('Nombre Actualizado');
    expect($cliente->telefono)->toBe('77888999');
});

it('puede buscar clientes via API', function () {
    Cliente::factory()->create(['nombre' => 'Juan Pérez']);
    Cliente::factory()->create(['nombre' => 'María Gonzales']);
    Cliente::factory()->create(['nombre' => 'Pedro Rodríguez']);

    $response = $this->getJson('/api/clientes/buscar?q=Pérez');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'nombre',
                    'nit',
                    'telefono',
                    'email',
                ],
            ],
        ]);

    expect($response->json('data'))->toHaveCount(1);
    expect($response->json('data.0.nombre'))->toBe('Juan Pérez');
});

it('puede obtener saldo de cuentas por cobrar', function () {
    $cliente = Cliente::factory()->create();

    $response = $this->getJson("/api/clientes/{$cliente->id}/saldo-cuentas");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'data' => [
                'cliente' => [
                    'id',
                    'nombre',
                    'limite_credito',
                ],
                'saldo_total',
                'cuentas_vencidas',
                'cuentas_detalle',
            ],
        ]);
});

it('puede obtener historial de ventas', function () {
    $cliente = Cliente::factory()->create();

    $response = $this->getJson("/api/clientes/{$cliente->id}/historial-ventas");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'success',
            'data' => [
                'data' => [],
                'current_page',
                'total',
            ],
        ]);
});

it('valida datos requeridos al crear cliente', function () {
    $response = $this->postJson('/api/clientes', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['nombre']);
});

it('puede gestionar direcciones de cliente', function () {
    $cliente = Cliente::factory()->create();

    // Crear dirección
    $direccionData = [
        'direccion'    => 'Av. Ballivián #789',
        'ciudad'       => 'La Paz',
        'departamento' => 'La Paz',
        'es_principal' => true,
    ];

    $response = $this->postJson("/api/clientes/{$cliente->id}/direcciones", $direccionData);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Dirección creada exitosamente',
        ]);

    // Listar direcciones
    $response = $this->getJson("/api/clientes/{$cliente->id}/direcciones");

    $response->assertSuccessful();
    expect($response->json('data'))->toHaveCount(1);

    // Actualizar dirección
    $direccion  = $cliente->direcciones()->first();
    $updateData = ['ciudad' => 'El Alto'];

    $response = $this->putJson("/api/clientes/{$cliente->id}/direcciones/{$direccion->id}", $updateData);

    $response->assertSuccessful();

    $direccion->refresh();
    expect($direccion->ciudad)->toBe('El Alto');

    // Establecer como principal
    $response = $this->patchJson("/api/clientes/{$cliente->id}/direcciones/{$direccion->id}/principal");

    $response->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Dirección establecida como principal',
        ]);

    // Eliminar dirección
    $response = $this->deleteJson("/api/clientes/{$cliente->id}/direcciones/{$direccion->id}");

    $response->assertSuccessful();
    expect($cliente->direcciones()->count())->toBe(0);
});
