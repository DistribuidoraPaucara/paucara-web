<?php

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\Pago;
use App\Models\Proveedor;
use App\Models\TipoPago;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can access pagos index page', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->get('/compras/pagos');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/pagos/index')
    );
});

it('can access pagos create page', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->get('/compras/pagos/create');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/pagos/create')
        ->has('cuentas_por_pagar')
        ->has('tipos_pago')
    );
});

it('can create a pago with efectivo', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'EFECTIVO']);
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $response = $this->post('/compras/pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 500.00,
        'fecha_pago' => now()->format('Y-m-d'),
        'tipo_pago_id' => $tipoPago->id,
        'numero_recibo' => 'REC-001',
        'observaciones' => 'Pago parcial en efectivo',
    ]);

    // Assert
    $response->assertRedirect('/compras/pagos');
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 500.00,
        'numero_recibo' => 'REC-001',
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);
});

it('can create a pago with transferencia', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'TRANSFERENCIA']);
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 2000.00,
        'saldo_pendiente' => 2000.00,
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $response = $this->post('/compras/pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 2000.00,
        'fecha_pago' => now()->format('Y-m-d'),
        'tipo_pago_id' => $tipoPago->id,
        'numero_transferencia' => 'TRF-123456789',
        'observaciones' => 'Transferencia banco nacional',
    ]);

    // Assert
    $response->assertRedirect('/compras/pagos');
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 2000.00,
        'numero_transferencia' => 'TRF-123456789',
        'tipo_pago_id' => $tipoPago->id,
    ]);
});

it('can create a pago with cheque', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'CHEQUE']);
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 1500.00,
        'saldo_pendiente' => 1500.00,
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $response = $this->post('/compras/pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1500.00,
        'fecha_pago' => now()->format('Y-m-d'),
        'tipo_pago_id' => $tipoPago->id,
        'numero_cheque' => 'CHQ-987654321',
        'observaciones' => 'Cheque banco industrial',
    ]);

    // Assert
    $response->assertRedirect('/compras/pagos');
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1500.00,
        'numero_cheque' => 'CHQ-987654321',
        'tipo_pago_id' => $tipoPago->id,
    ]);
});

it('validates required fields when creating pago', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->post('/compras/pagos', []);

    // Assert
    $response->assertSessionHasErrors([
        'cuenta_por_pagar_id',
        'monto',
        'fecha_pago',
        'tipo_pago_id',
    ]);
});

it('validates monto does not exceed saldo pendiente', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'EFECTIVO']);
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 500.00, // Solo queda 500 por pagar
        'estado' => 'PARCIAL',
    ]);

    // Act - Intentar pagar más del saldo pendiente
    $response = $this->post('/compras/pagos', [
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 800.00, // Más que el saldo pendiente
        'fecha_pago' => now()->format('Y-m-d'),
        'tipo_pago_id' => $tipoPago->id,
    ]);

    // Assert
    $response->assertSessionHasErrors(['monto']);
});

it('can filter pagos by tipo_pago', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoEfectivo = TipoPago::factory()->create(['codigo' => 'EFECTIVO']);
    $tipoTransferencia = TipoPago::factory()->create(['codigo' => 'TRANSFERENCIA']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
    ]);

    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'tipo_pago_id' => $tipoEfectivo->id,
        'usuario_id' => $user->id,
    ]);

    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'tipo_pago_id' => $tipoTransferencia->id,
        'usuario_id' => $user->id,
    ]);

    // Act
    $response = $this->get('/compras/pagos?tipo_pago_id='.$tipoEfectivo->id);

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/pagos/index')
        ->has('pagos.data', 1)
        ->where('pagos.data.0.tipo_pago.id', $tipoEfectivo->id)
    );
});

it('can filter pagos by fecha range', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
    ]);

    // Pago de hace 10 días
    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'fecha_pago' => now()->subDays(10),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    // Pago de hoy
    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    // Act - Filtrar solo pagos de los últimos 7 días
    $fechaDesde = now()->subDays(7)->format('Y-m-d');
    $fechaHasta = now()->format('Y-m-d');

    $response = $this->get("/compras/pagos?fecha_desde={$fechaDesde}&fecha_hasta={$fechaHasta}");

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/pagos/index')
        ->has('pagos.data', 1) // Solo el pago de hoy
    );
});

it('provides correct estadisticas in pagos index', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
    ]);

    // Crear pagos con diferentes montos
    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1000.00,
        'fecha_pago' => now()->startOfMonth(),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 500.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    // Act
    $response = $this->get('/compras/pagos');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/pagos/index')
        ->where('estadisticas.total_pagos_mes', 1500.00)
        ->where('estadisticas.cantidad_pagos_mes', 2)
        ->where('estadisticas.promedio_pago_mes', 750.00)
    );
});
