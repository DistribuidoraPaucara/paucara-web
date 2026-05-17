<?php

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\Pago;
use App\Models\Proveedor;
use App\Models\TipoPago;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can access reportes index page', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->get('/compras/reportes');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/reportes/index')
    );
});

it('generates reporte de compras por periodo correctly', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create(['nombre' => 'Proveedor Test']);

    // Compras dentro del período
    $compra1 = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now()->startOfMonth(),
        'total' => 1000.00,
        'estado' => 'COMPLETADA',
    ]);

    $compra2 = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now()->endOfMonth(),
        'total' => 1500.00,
        'estado' => 'COMPLETADA',
    ]);

    // Compra fuera del período
    Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now()->subMonth(),
        'total' => 500.00,
        'estado' => 'COMPLETADA',
    ]);

    // Act
    $fechaDesde = now()->startOfMonth()->format('Y-m-d');
    $fechaHasta = now()->endOfMonth()->format('Y-m-d');

    $response = $this->get("/compras/reportes?tipo=compras_periodo&fecha_desde={$fechaDesde}&fecha_hasta={$fechaHasta}");

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/reportes/index')
        ->has('reporte_data.compras', 2)
        ->where('reporte_data.estadisticas.total_compras', 2500.00)
        ->where('reporte_data.estadisticas.cantidad_compras', 2)
        ->where('reporte_data.estadisticas.promedio_compra', 1250.00)
    );
});

it('generates reporte de cuentas por pagar correctly', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();

    $compra1 = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 2000.00,
    ]);

    $compra2 = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    // Cuentas por pagar con diferentes estados
    CuentaPorPagar::factory()->create([
        'compra_id' => $compra1->id,
        'monto_original' => 2000.00,
        'saldo_pendiente' => 2000.00,
        'estado' => 'PENDIENTE',
        'fecha_vencimiento' => now()->addDays(30),
    ]);

    CuentaPorPagar::factory()->create([
        'compra_id' => $compra2->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 500.00,
        'estado' => 'PARCIAL',
        'fecha_vencimiento' => now()->subDays(5), // Vencida
    ]);

    // Act
    $response = $this->get('/compras/reportes?tipo=cuentas_por_pagar');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/reportes/index')
        ->has('reporte_data.cuentas', 2)
        ->where('reporte_data.estadisticas.total_pendiente', 2500.00)
        ->where('reporte_data.estadisticas.cuentas_vencidas', 1)
        ->where('reporte_data.estadisticas.total_vencido', 500.00)
    );
});

it('generates reporte de pagos por tipo correctly', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoEfectivo = TipoPago::factory()->create(['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo']);
    $tipoTransferencia = TipoPago::factory()->create(['codigo' => 'TRANSFERENCIA', 'nombre' => 'Transferencia']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $cuentaPorPagar = CuentaPorPagar::factory()->create([
        'compra_id' => $compra->id,
    ]);

    // Pagos en efectivo
    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'tipo_pago_id' => $tipoEfectivo->id,
        'monto' => 500.00,
        'fecha_pago' => now(),
        'usuario_id' => $user->id,
    ]);

    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'tipo_pago_id' => $tipoEfectivo->id,
        'monto' => 300.00,
        'fecha_pago' => now(),
        'usuario_id' => $user->id,
    ]);

    // Pago por transferencia
    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'tipo_pago_id' => $tipoTransferencia->id,
        'monto' => 1000.00,
        'fecha_pago' => now(),
        'usuario_id' => $user->id,
    ]);

    // Act
    $response = $this->get('/compras/reportes?tipo=pagos_por_tipo');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/reportes/index')
        ->has('reporte_data.pagos_por_tipo', 2)
        ->where('reporte_data.estadisticas.total_pagos', 1800.00)
        ->where('reporte_data.estadisticas.cantidad_pagos', 3)
    );
});

it('can filter reportes by proveedor', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor1 = Proveedor::factory()->create(['nombre' => 'Proveedor A']);
    $proveedor2 = Proveedor::factory()->create(['nombre' => 'Proveedor B']);

    // Compras de diferentes proveedores
    Compra::factory()->create([
        'proveedor_id' => $proveedor1->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now(),
        'total' => 1000.00,
        'estado' => 'COMPLETADA',
    ]);

    Compra::factory()->create([
        'proveedor_id' => $proveedor2->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now(),
        'total' => 1500.00,
        'estado' => 'COMPLETADA',
    ]);

    // Act
    $fechaDesde = now()->startOfMonth()->format('Y-m-d');
    $fechaHasta = now()->endOfMonth()->format('Y-m-d');

    $response = $this->get("/compras/reportes?tipo=compras_periodo&proveedor_id={$proveedor1->id}&fecha_desde={$fechaDesde}&fecha_hasta={$fechaHasta}");

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/reportes/index')
        ->has('reporte_data.compras', 1)
        ->where('reporte_data.compras.0.proveedor.id', $proveedor1->id)
        ->where('reporte_data.estadisticas.total_compras', 1000.00)
    );
});

it('can export reporte to excel', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();

    Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now(),
        'total' => 1000.00,
        'estado' => 'COMPLETADA',
    ]);

    // Act
    $fechaDesde = now()->startOfMonth()->format('Y-m-d');
    $fechaHasta = now()->endOfMonth()->format('Y-m-d');

    $response = $this->get("/compras/reportes/export?tipo=compras_periodo&fecha_desde={$fechaDesde}&fecha_hasta={$fechaHasta}");

    // Assert
    $response->assertOk();
    $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
});

it('can export reporte to pdf', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();

    Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now(),
        'total' => 1000.00,
        'estado' => 'COMPLETADA',
    ]);

    // Act
    $fechaDesde = now()->startOfMonth()->format('Y-m-d');
    $fechaHasta = now()->endOfMonth()->format('Y-m-d');

    $response = $this->get("/compras/reportes/export-pdf?tipo=compras_periodo&fecha_desde={$fechaDesde}&fecha_hasta={$fechaHasta}");

    // Assert
    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

it('validates required parameters for periodo reports', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act - Sin fechas requeridas
    $response = $this->get('/compras/reportes?tipo=compras_periodo');

    // Assert
    $response->assertSessionHasErrors(['fecha_desde', 'fecha_hasta']);
});

it('generates dashboard estadisticas correctly', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $tipoPago = TipoPago::factory()->create();

    // Compras del mes actual
    $compra1 = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now(),
        'total' => 1000.00,
        'estado' => 'COMPLETADA',
    ]);

    $compra2 = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'fecha_compra' => now(),
        'total' => 1500.00,
        'estado' => 'COMPLETADA',
    ]);

    // Cuentas por pagar
    $cuentaPorPagar1 = CuentaPorPagar::factory()->create([
        'compra_id' => $compra1->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'estado' => 'PENDIENTE',
    ]);

    $cuentaPorPagar2 = CuentaPorPagar::factory()->create([
        'compra_id' => $compra2->id,
        'monto_original' => 1500.00,
        'saldo_pendiente' => 750.00,
        'estado' => 'PARCIAL',
    ]);

    // Pagos del mes
    Pago::factory()->create([
        'cuenta_por_pagar_id' => $cuentaPorPagar2->id,
        'tipo_pago_id' => $tipoPago->id,
        'monto' => 750.00,
        'fecha_pago' => now(),
        'usuario_id' => $user->id,
    ]);

    // Act
    $response = $this->get('/compras/reportes?tipo=dashboard_estadisticas');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/reportes/index')
        ->where('reporte_data.estadisticas.compras_mes.total', 2500.00)
        ->where('reporte_data.estadisticas.compras_mes.cantidad', 2)
        ->where('reporte_data.estadisticas.cuentas_pendientes.total', 1750.00)
        ->where('reporte_data.estadisticas.cuentas_pendientes.cantidad', 2)
        ->where('reporte_data.estadisticas.pagos_mes.total', 750.00)
        ->where('reporte_data.estadisticas.pagos_mes.cantidad', 1)
    );
});
