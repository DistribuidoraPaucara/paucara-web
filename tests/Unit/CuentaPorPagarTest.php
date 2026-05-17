<?php

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a cuenta por pagar', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    // Act
    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Assert
    expect($cuentaPorPagar)->toBeInstanceOf(CuentaPorPagar::class)
        ->and($cuentaPorPagar->monto_original)->toBe(1000.00)
        ->and($cuentaPorPagar->saldo_pendiente)->toBe(1000.00)
        ->and($cuentaPorPagar->estado)->toBe('PENDIENTE');
});

it('calculates dias_vencido correctly', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    // Cuenta vencida hace 5 días
    $cuentaVencida = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->subDays(5),
        'estado' => 'VENCIDO',
    ]);

    // Cuenta que vence en 10 días
    $cuentaFutura = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 500.00,
        'saldo_pendiente' => 500.00,
        'fecha_vencimiento' => now()->addDays(10),
        'estado' => 'PENDIENTE',
    ]);

    // Assert
    expect($cuentaVencida->dias_vencido)->toBe(5)
        ->and($cuentaFutura->dias_vencido)->toBe(-10);
});

it('can filter cuentas por pagar by estado', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 3000.00,
    ]);

    // Crear cuentas con diferentes estados
    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 0.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PAGADO',
    ]);

    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->subDays(5),
        'estado' => 'VENCIDO',
    ]);

    // Act & Assert
    expect(CuentaPorPagar::where('estado', 'PENDIENTE')->count())->toBe(1)
        ->and(CuentaPorPagar::where('estado', 'PAGADO')->count())->toBe(1)
        ->and(CuentaPorPagar::where('estado', 'VENCIDO')->count())->toBe(1);
});

it('can get cuentas vencidas', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 2000.00,
    ]);

    // Cuenta vencida
    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->subDays(5),
        'estado' => 'VENCIDO',
    ]);

    // Cuenta vigente
    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->addDays(10),
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $cuentasVencidas = CuentaPorPagar::where('fecha_vencimiento', '<', now())->count();

    // Assert
    expect($cuentasVencidas)->toBe(1);
});

it('can calculate total saldo pendiente', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 3000.00,
    ]);

    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 800.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PARCIAL',
    ]);

    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->addDays(15),
        'estado' => 'PENDIENTE',
    ]);

    CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 0.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PAGADO',
    ]);

    // Act
    $totalSaldoPendiente = CuentaPorPagar::sum('saldo_pendiente');

    // Assert
    expect($totalSaldoPendiente)->toBe(1800.00);
});
