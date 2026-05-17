<?php

use App\Models\Almacen;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Crear usuario para las pruebas
    $this->user = User::factory()->create();
    $this->actingAs($this->user);

    // Crear almacén
    $this->almacen = Almacen::factory()->create([
        'nombre' => 'Almacén Principal',
        'activo' => true,
    ]);

    // Crear producto
    $this->producto = Producto::factory()->create([
        'nombre' => 'Producto Test',
        'activo' => true,
    ]);

    // Crear stock inicial
    $this->stockProducto = StockProducto::create([
        'producto_id' => $this->producto->id,
        'almacen_id' => $this->almacen->id,
        'cantidad' => 100,
        'cantidad_disponible' => 100,
        'cantidad_reservada' => 0,
        'precio_promedio' => 10.50,
        'stock_minimo' => 10,
    ]);
});

test('puede registrar entrada de stock', function () {
    $cantidadEntrada = 50;

    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadEntrada,
        MovimientoInventario::TIPO_ENTRADA_COMPRA,
        'Entrada por compra de prueba',
        'COMP-001',
        $this->user->id
    );

    expect($movimiento)->toBeInstanceOf(MovimientoInventario::class)
        ->and($movimiento->cantidad)->toBe($cantidadEntrada)
        ->and($movimiento->cantidad_anterior)->toBe(100)
        ->and($movimiento->cantidad_posterior)->toBe(150)
        ->and($movimiento->tipo)->toBe(MovimientoInventario::TIPO_ENTRADA_COMPRA)
        ->and($movimiento->numero_documento)->toBe('COMP-001');

    // Verificar que el stock se actualizó
    $this->stockProducto->refresh();
    expect($this->stockProducto->cantidad)->toBe(150)
        ->and($this->stockProducto->cantidad_disponible)->toBe(150);
});

test('puede registrar salida de stock', function () {
    $cantidadSalida = -30;

    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadSalida,
        MovimientoInventario::TIPO_SALIDA_VENTA,
        'Salida por venta de prueba',
        'VENTA-001',
        $this->user->id
    );

    expect($movimiento)->toBeInstanceOf(MovimientoInventario::class)
        ->and($movimiento->cantidad)->toBe($cantidadSalida)
        ->and($movimiento->cantidad_anterior)->toBe(100)
        ->and($movimiento->cantidad_posterior)->toBe(70)
        ->and($movimiento->tipo)->toBe(MovimientoInventario::TIPO_SALIDA_VENTA);

    // Verificar que el stock se actualizó
    $this->stockProducto->refresh();
    expect($this->stockProducto->cantidad)->toBe(70)
        ->and($this->stockProducto->cantidad_disponible)->toBe(70);
});

test('lanza excepción cuando el stock queda negativo', function () {
    $cantidadExcesiva = -150; // Mayor que el stock actual (100)

    MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadExcesiva,
        MovimientoInventario::TIPO_SALIDA_VENTA,
        'Intento de salida excesiva',
        'VENTA-002',
        $this->user->id
    );
})->throws(Exception::class, 'Stock insuficiente');

test('lanza excepción cuando el stock disponible queda negativo', function () {
    // Actualizar stock con cantidad reservada
    $this->stockProducto->update([
        'cantidad' => 100,
        'cantidad_disponible' => 50,
        'cantidad_reservada' => 50,
    ]);

    $cantidadExcesiva = -60; // Mayor que el stock disponible (50)

    MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadExcesiva,
        MovimientoInventario::TIPO_SALIDA_VENTA,
        'Intento de salida excesiva',
        'VENTA-003',
        $this->user->id
    );
})->throws(Exception::class, 'Stock disponible insuficiente');

test('actualiza el stock de forma atómica', function () {
    // Simular múltiples movimientos concurrentes
    $movimientos = [];

    DB::transaction(function () use (&$movimientos) {
        for ($i = 1; $i <= 5; $i++) {
            $movimientos[] = MovimientoInventario::registrar(
                $this->stockProducto->fresh(),
                10,
                MovimientoInventario::TIPO_ENTRADA_COMPRA,
                "Entrada {$i}",
                "COMP-00{$i}",
                $this->user->id
            );
        }
    });

    expect($movimientos)->toHaveCount(5);

    // Verificar que todas las operaciones se registraron
    $this->stockProducto->refresh();
    expect($this->stockProducto->cantidad)->toBe(150); // 100 inicial + (5 * 10)
});

test('puede registrar ajuste de entrada', function () {
    $cantidadAjuste = 25;

    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadAjuste,
        MovimientoInventario::TIPO_ENTRADA_AJUSTE,
        'Ajuste de inventario: productos encontrados',
        null,
        $this->user->id
    );

    expect($movimiento->tipo)->toBe(MovimientoInventario::TIPO_ENTRADA_AJUSTE)
        ->and($movimiento->cantidad)->toBe($cantidadAjuste);

    $this->stockProducto->refresh();
    expect($this->stockProducto->cantidad)->toBe(125);
});

test('puede registrar ajuste de salida', function () {
    $cantidadAjuste = -15;

    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadAjuste,
        MovimientoInventario::TIPO_SALIDA_AJUSTE,
        'Ajuste de inventario: productos faltantes',
        null,
        $this->user->id
    );

    expect($movimiento->tipo)->toBe(MovimientoInventario::TIPO_SALIDA_AJUSTE)
        ->and($movimiento->cantidad)->toBe($cantidadAjuste);

    $this->stockProducto->refresh();
    expect($this->stockProducto->cantidad)->toBe(85);
});

test('puede registrar merma', function () {
    $cantidadMerma = -20;

    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        $cantidadMerma,
        MovimientoInventario::TIPO_SALIDA_MERMA,
        'Productos vencidos',
        'MERMA-001',
        $this->user->id
    );

    expect($movimiento->tipo)->toBe(MovimientoInventario::TIPO_SALIDA_MERMA)
        ->and($movimiento->cantidad)->toBe($cantidadMerma);

    $this->stockProducto->refresh();
    expect($this->stockProducto->cantidad)->toBe(80);
});

test('almacena correctamente la fecha del movimiento', function () {
    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        10,
        MovimientoInventario::TIPO_ENTRADA_COMPRA,
        'Test fecha',
        null,
        $this->user->id
    );

    expect($movimiento->fecha)->toBeInstanceOf(\DateTime::class)
        ->and($movimiento->fecha->format('Y-m-d'))->toBe(now()->format('Y-m-d'));
});

test('asocia el usuario correctamente', function () {
    $movimiento = MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        10,
        MovimientoInventario::TIPO_ENTRADA_COMPRA,
        'Test usuario',
        null,
        $this->user->id
    );

    expect($movimiento->user_id)->toBe($this->user->id)
        ->and($movimiento->user)->toBeInstanceOf(User::class)
        ->and($movimiento->user->id)->toBe($this->user->id);
});

test('puede consultar movimientos por tipo', function () {
    // Crear varios movimientos de diferentes tipos
    MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        10,
        MovimientoInventario::TIPO_ENTRADA_COMPRA,
        'Compra 1'
    );

    MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        -5,
        MovimientoInventario::TIPO_SALIDA_VENTA,
        'Venta 1'
    );

    MovimientoInventario::registrar(
        $this->stockProducto->fresh(),
        15,
        MovimientoInventario::TIPO_ENTRADA_COMPRA,
        'Compra 2'
    );

    $movimientosCompra = MovimientoInventario::porTipo(MovimientoInventario::TIPO_ENTRADA_COMPRA)->get();
    $movimientosVenta = MovimientoInventario::porTipo(MovimientoInventario::TIPO_SALIDA_VENTA)->get();

    expect($movimientosCompra)->toHaveCount(2)
        ->and($movimientosVenta)->toHaveCount(1);
});

test('puede consultar movimientos por producto', function () {
    // Crear otro producto y stock
    $otroProducto = Producto::factory()->create();
    $otroStock = StockProducto::create([
        'producto_id' => $otroProducto->id,
        'almacen_id' => $this->almacen->id,
        'cantidad' => 50,
        'cantidad_disponible' => 50,
    ]);

    // Crear movimientos para cada producto
    MovimientoInventario::registrar($this->stockProducto->fresh(), 10, MovimientoInventario::TIPO_ENTRADA_COMPRA, 'Test 1');
    MovimientoInventario::registrar($this->stockProducto->fresh(), -5, MovimientoInventario::TIPO_SALIDA_VENTA, 'Test 2');
    MovimientoInventario::registrar($otroStock->fresh(), 20, MovimientoInventario::TIPO_ENTRADA_COMPRA, 'Test 3');

    $movimientosProducto1 = MovimientoInventario::porProducto($this->producto->id)->get();
    $movimientosProducto2 = MovimientoInventario::porProducto($otroProducto->id)->get();

    expect($movimientosProducto1)->toHaveCount(2)
        ->and($movimientosProducto2)->toHaveCount(1);
});
