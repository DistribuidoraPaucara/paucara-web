<?php

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can access cuentas por pagar index page', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->get('/compras/cuentas-por-pagar');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/cuentas-por-pagar/index')
    );
});

it('can filter cuentas por pagar by estado', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'estado' => 'PENDIENTE',
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'estado' => 'PAGADO',
    ]);

    // Act
    $response = $this->get('/compras/cuentas-por-pagar?estado=PENDIENTE');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/cuentas-por-pagar/index')
        ->has('cuentas.data', 1)
        ->where('cuentas.data.0.estado', 'PENDIENTE')
    );
});

it('can search cuentas por pagar by proveedor', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor1 = Proveedor::factory()->create(['nombre' => 'Proveedor Alfa']);
    $proveedor2 = Proveedor::factory()->create(['nombre' => 'Proveedor Beta']);

    $compra1 = Compra::factory()->create([
        'proveedor_id' => $proveedor1->id,
        'usuario_id' => $user->id,
    ]);

    $compra2 = Compra::factory()->create([
        'proveedor_id' => $proveedor2->id,
        'usuario_id' => $user->id,
    ]);

    CuentaPorPagar::factory()->create(['compra_id' => $compra1->id]);
    CuentaPorPagar::factory()->create(['compra_id' => $compra2->id]);

    // Act
    $response = $this->get('/compras/cuentas-por-pagar?proveedor_id='.$proveedor1->id);

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/cuentas-por-pagar/index')
        ->has('cuentas.data', 1)
        ->where('cuentas.data.0.compra.proveedor.id', $proveedor1->id)
    );
});

it('can filter cuentas vencidas', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    // Cuenta vencida
    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'fecha_vencimiento' => now()->subDays(5),
        'estado' => 'VENCIDO',
    ]);

    // Cuenta vigente
    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'fecha_vencimiento' => now()->addDays(10),
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $response = $this->get('/compras/cuentas-por-pagar?solo_vencidas=1');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/cuentas-por-pagar/index')
        ->has('cuentas.data', 1)
        ->where('cuentas.data.0.estado', 'VENCIDO')
    );
});

it('provides correct estadisticas in cuentas por pagar', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    // Crear cuentas con diferentes estados
    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'estado' => 'PENDIENTE',
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 800.00,
        'saldo_pendiente' => 400.00,
        'estado' => 'PARCIAL',
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 500.00,
        'saldo_pendiente' => 0.00,
        'estado' => 'PAGADO',
    ]);

    // Act
    $response = $this->get('/compras/cuentas-por-pagar');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/cuentas-por-pagar/index')
        ->where('estadisticas.total_adeudado', 1400.00) // 1000 + 400
        ->where('estadisticas.total_cuentas', 3)
        ->where('estadisticas.cuentas_pendientes', 2) // PENDIENTE + PARCIAL
        ->where('estadisticas.cuentas_pagadas', 1)
    );
});

it('can sort cuentas por pagar by different fields', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 500.00,
        'fecha_vencimiento' => now()->addDays(10),
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 1500.00,
        'fecha_vencimiento' => now()->addDays(5),
    ]);

    // Act - Sort by monto desc
    $response = $this->get('/compras/cuentas-por-pagar?sort_by=monto_original&sort_dir=desc');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/cuentas-por-pagar/index')
        ->where('cuentas.data.0.monto_original', 1500.00)
        ->where('cuentas.data.1.monto_original', 500.00)
    );
});
