<?php

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\Pago;
use App\Models\Proveedor;
use App\Models\TipoPago;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a pago', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1000.00,
        'saldo_pendiente' => 1000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $pago = Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 500.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'numero_recibo' => 'REC-001',
        'usuario_id' => $user->id,
    ]);

    // Assert
    expect($pago)->toBeInstanceOf(Pago::class)
        ->and($pago->monto)->toBe(500.00)
        ->and($pago->numero_recibo)->toBe('REC-001')
        ->and($pago->cuenta_por_pagar_id)->toBe($cuentaPorPagar->id);
});

it('can create pago with transferencia data', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'TRANSFERENCIA', 'nombre' => 'Transferencia Bancaria']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 2000.00,
    ]);

    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 2000.00,
        'saldo_pendiente' => 2000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $pago = Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1500.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'numero_transferencia' => 'TRF-123456789',
        'observaciones' => 'Transferencia desde Banco Nacional',
        'usuario_id' => $user->id,
    ]);

    // Assert
    expect($pago->numero_transferencia)->toBe('TRF-123456789')
        ->and($pago->observaciones)->toBe('Transferencia desde Banco Nacional')
        ->and($pago->numero_recibo)->toBeNull()
        ->and($pago->numero_cheque)->toBeNull();
});

it('can create pago with cheque data', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'CHEQUE', 'nombre' => 'Cheque']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 1500.00,
    ]);

    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 1500.00,
        'saldo_pendiente' => 1500.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Act
    $pago = Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1500.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'numero_cheque' => 'CHQ-987654321',
        'observaciones' => 'Cheque Banco Industrial',
        'usuario_id' => $user->id,
    ]);

    // Assert
    expect($pago->numero_cheque)->toBe('CHQ-987654321')
        ->and($pago->numero_transferencia)->toBeNull()
        ->and($pago->numero_recibo)->toBeNull();
});

it('can filter pagos by tipo_pago', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $tipoEfectivo = TipoPago::factory()->create(['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo']);
    $tipoTransferencia = TipoPago::factory()->create(['codigo' => 'TRANSFERENCIA', 'nombre' => 'Transferencia']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 3000.00,
    ]);

    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 3000.00,
        'saldo_pendiente' => 3000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Crear pagos con diferentes tipos
    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1000.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoEfectivo->id,
        'usuario_id' => $user->id,
    ]);

    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 2000.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoTransferencia->id,
        'usuario_id' => $user->id,
    ]);

    // Act & Assert
    expect(Pago::where('tipo_pago_id', $tipoEfectivo->id)->count())->toBe(1)
        ->and(Pago::where('tipo_pago_id', $tipoTransferencia->id)->count())->toBe(1);
});

it('can get pagos by fecha range', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 2000.00,
    ]);

    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 2000.00,
        'saldo_pendiente' => 2000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Pago de hace 10 días
    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 500.00,
        'fecha_pago' => now()->subDays(10),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    // Pago de hoy
    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 800.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    // Act
    $pagosUltimos7Dias = Pago::where('fecha_pago', '>=', now()->subDays(7))->count();
    $pagosUltimos15Dias = Pago::where('fecha_pago', '>=', now()->subDays(15))->count();

    // Assert
    expect($pagosUltimos7Dias)->toBe(1)
        ->and($pagosUltimos15Dias)->toBe(2);
});

it('can calculate total pagos by periodo', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $tipoPago = TipoPago::factory()->create(['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 5000.00,
    ]);

    $cuentaPorPagar = CuentaPorPagar::create([
        'compra_id' => $compra->id,
        'monto_original' => 5000.00,
        'saldo_pendiente' => 5000.00,
        'fecha_vencimiento' => now()->addDays(30),
        'estado' => 'PENDIENTE',
    ]);

    // Crear varios pagos
    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1500.00,
        'fecha_pago' => now()->subDays(5),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 2000.00,
        'fecha_pago' => now()->subDays(2),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    Pago::create([
        'cuenta_por_pagar_id' => $cuentaPorPagar->id,
        'monto' => 1500.00,
        'fecha_pago' => now(),
        'tipo_pago_id' => $tipoPago->id,
        'usuario_id' => $user->id,
    ]);

    // Act
    $totalPagos = Pago::sum('monto');
    $cantidadPagos = Pago::count();
    $promedioPago = $totalPagos / $cantidadPagos;

    // Assert
    expect($totalPagos)->toBe(5000.00)
        ->and($cantidadPagos)->toBe(3)
        ->and($promedioPago)->toBe(1666.67);
});
