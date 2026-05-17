<?php

use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create detalle compra with lote and fecha_vencimiento', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    // Act
    $detalle = DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 10,
        'precio_unitario' => 100.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-202509-001',
        'fecha_vencimiento' => now()->addMonths(6),
    ]);

    // Assert
    expect($detalle)->toBeInstanceOf(DetalleCompra::class)
        ->and($detalle->lote)->toBe('LOTE-202509-001')
        ->and($detalle->fecha_vencimiento)->not->toBeNull();
});

it('can calculate dias_para_vencer for lote', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 2000.00,
    ]);

    // Producto que vence en 30 días
    $detalleVigente = DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 200.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-VIGENTE',
        'fecha_vencimiento' => now()->addDays(30),
    ]);

    // Producto vencido hace 5 días
    $detalleVencido = DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 200.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-VENCIDO',
        'fecha_vencimiento' => now()->subDays(5),
    ]);

    // Act
    $diasVigente = now()->diffInDays($detalleVigente->fecha_vencimiento, false);
    $diasVencido = now()->diffInDays($detalleVencido->fecha_vencimiento, false);

    // Assert
    expect($diasVigente)->toBe(30)
        ->and($diasVencido)->toBe(-5);
});

it('can filter productos by estado_vencimiento', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 4000.00,
    ]);

    // Vigente (más de 30 días)
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 200.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-VIGENTE',
        'fecha_vencimiento' => now()->addDays(60),
    ]);

    // Próximo a vencer (entre 7 y 30 días)
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 200.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-PROXIMO',
        'fecha_vencimiento' => now()->addDays(15),
    ]);

    // Crítico (menos de 7 días)
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 200.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-CRITICO',
        'fecha_vencimiento' => now()->addDays(3),
    ]);

    // Vencido
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 200.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-VENCIDO',
        'fecha_vencimiento' => now()->subDays(2),
    ]);

    // Act
    $vigentes = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->where('fecha_vencimiento', '>', now()->addDays(30))
        ->count();

    $proximosVencer = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->whereBetween('fecha_vencimiento', [now()->addDays(7), now()->addDays(30)])
        ->count();

    $criticos = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->whereBetween('fecha_vencimiento', [now(), now()->addDays(7)])
        ->count();

    $vencidos = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->where('fecha_vencimiento', '<', now())
        ->count();

    // Assert
    expect($vigentes)->toBe(1)
        ->and($proximosVencer)->toBe(1)
        ->and($criticos)->toBe(1)
        ->and($vencidos)->toBe(1);
});

it('can get lotes by proveedor', function () {
    // Arrange
    $proveedor1 = Proveedor::factory()->create(['nombre' => 'Proveedor A']);
    $proveedor2 = Proveedor::factory()->create(['nombre' => 'Proveedor B']);
    $user = User::factory()->create();
    $producto = Producto::factory()->create();

    $compra1 = Compra::factory()->create([
        'proveedor_id' => $proveedor1->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    $compra2 = Compra::factory()->create([
        'proveedor_id' => $proveedor2->id,
        'usuario_id' => $user->id,
        'total' => 1000.00,
    ]);

    // Lotes del proveedor A
    DetalleCompra::create([
        'compra_id' => $compra1->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 100.00,
        'subtotal' => 500.00,
        'lote' => 'LOTE-A-001',
        'fecha_vencimiento' => now()->addDays(30),
    ]);

    DetalleCompra::create([
        'compra_id' => $compra1->id,
        'producto_id' => $producto->id,
        'cantidad' => 5,
        'precio_unitario' => 100.00,
        'subtotal' => 500.00,
        'lote' => 'LOTE-A-002',
        'fecha_vencimiento' => now()->addDays(45),
    ]);

    // Lote del proveedor B
    DetalleCompra::create([
        'compra_id' => $compra2->id,
        'producto_id' => $producto->id,
        'cantidad' => 10,
        'precio_unitario' => 100.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-B-001',
        'fecha_vencimiento' => now()->addDays(60),
    ]);

    // Act
    $lotesProveedorA = DetalleCompra::whereNotNull('lote')
        ->whereHas('compra', function ($query) use ($proveedor1) {
            $query->where('proveedor_id', $proveedor1->id);
        })
        ->count();

    $lotesProveedorB = DetalleCompra::whereNotNull('lote')
        ->whereHas('compra', function ($query) use ($proveedor2) {
            $query->where('proveedor_id', $proveedor2->id);
        })
        ->count();

    // Assert
    expect($lotesProveedorA)->toBe(2)
        ->and($lotesProveedorB)->toBe(1);
});

it('can calculate valor total de lotes by estado', function () {
    // Arrange
    $proveedor = Proveedor::factory()->create();
    $user = User::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
        'total' => 3000.00,
    ]);

    // Lote vigente - valor 1000
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 10,
        'precio_unitario' => 100.00,
        'subtotal' => 1000.00,
        'lote' => 'LOTE-VIGENTE',
        'fecha_vencimiento' => now()->addDays(60),
    ]);

    // Lote próximo a vencer - valor 800
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 8,
        'precio_unitario' => 100.00,
        'subtotal' => 800.00,
        'lote' => 'LOTE-PROXIMO',
        'fecha_vencimiento' => now()->addDays(15),
    ]);

    // Lote vencido - valor 1200
    DetalleCompra::create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'cantidad' => 12,
        'precio_unitario' => 100.00,
        'subtotal' => 1200.00,
        'lote' => 'LOTE-VENCIDO',
        'fecha_vencimiento' => now()->subDays(5),
    ]);

    // Act
    $valorVigentes = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->where('fecha_vencimiento', '>', now()->addDays(30))
        ->sum('subtotal');

    $valorProximosVencer = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->whereBetween('fecha_vencimiento', [now()->addDays(7), now()->addDays(30)])
        ->sum('subtotal');

    $valorVencidos = DetalleCompra::whereNotNull('fecha_vencimiento')
        ->where('fecha_vencimiento', '<', now())
        ->sum('subtotal');

    $valorTotal = DetalleCompra::whereNotNull('lote')->sum('subtotal');

    // Assert
    expect($valorVigentes)->toBe(1000.00)
        ->and($valorProximosVencer)->toBe(800.00)
        ->and($valorVencidos)->toBe(1200.00)
        ->and($valorTotal)->toBe(3000.00);
});
