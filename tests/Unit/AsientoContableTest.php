<?php

use App\Models\AsientoContable;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\TipoPago;
use App\Models\User;
use App\Models\Venta;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->cliente = Cliente::factory()->create();
    $this->producto = Producto::factory()->create([
        'precio_compra' => 30.00,
        'precio_venta' => 50.00,
    ]);
    $this->tipoPago = TipoPago::factory()->create(['codigo' => 'CONTADO']);
});

it('genera número secuencial automáticamente', function () {
    $asiento1 = AsientoContable::create([
        'fecha' => today(),
        'tipo_documento' => 'VENTA',
        'concepto' => 'Test 1',
        'usuario_id' => $this->user->id,
    ]);

    $asiento2 = AsientoContable::create([
        'fecha' => today(),
        'tipo_documento' => 'VENTA',
        'concepto' => 'Test 2',
        'usuario_id' => $this->user->id,
    ]);

    expect($asiento1->numero)->toMatch('/^ASI-\d{4}-\d{6}$/');
    expect($asiento2->numero)->toMatch('/^ASI-\d{4}-\d{6}$/');
    expect($asiento1->numero)->not->toBe($asiento2->numero);
});

it('crea asiento contable para venta correctamente', function () {
    $venta = Venta::create([
        'numero' => 'TEST-001',
        'fecha' => today(),
        'subtotal' => 100.00,
        'impuesto' => 13.00,
        'total' => 113.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'tipo_pago_id' => $this->tipoPago->id,
        'estado_documento_id' => 1,
        'moneda_id' => 1,
    ]);

    DetalleVenta::create([
        'venta_id' => $venta->id,
        'producto_id' => $this->producto->id,
        'cantidad' => 2,
        'precio_unitario' => 50.00,
        'subtotal' => 100.00,
    ]);

    $asiento = AsientoContable::crearParaVenta($venta);

    expect($asiento->tipo_documento)->toBe('VENTA');
    expect($asiento->numero_documento)->toBe('TEST-001');
    expect($asiento->total_debe)->toBe(113.00);
    expect($asiento->total_haber)->toBe(113.00);
    expect($asiento->estaBalanceado())->toBeTrue();
    expect($asiento->detalles)->toHaveCount(3); // Caja, Ventas, IVA
});

it('calcula totales correctamente', function () {
    $asiento = AsientoContable::create([
        'fecha' => today(),
        'tipo_documento' => 'VENTA',
        'concepto' => 'Test',
        'usuario_id' => $this->user->id,
    ]);

    $asiento->detalles()->create([
        'codigo_cuenta' => '1.1.01.001',
        'nombre_cuenta' => 'Caja',
        'debe' => 100.00,
        'haber' => 0,
        'orden' => 1,
    ]);

    $asiento->detalles()->create([
        'codigo_cuenta' => '4.1.01.001',
        'nombre_cuenta' => 'Ventas',
        'debe' => 0,
        'haber' => 100.00,
        'orden' => 2,
    ]);

    $asiento->actualizarTotales();

    expect($asiento->total_debe)->toBe(100.00);
    expect($asiento->total_haber)->toBe(100.00);
    expect($asiento->estaBalanceado())->toBeTrue();
});

it('verifica si asiento está balanceado', function () {
    $asientoBalanceado = AsientoContable::create([
        'fecha' => today(),
        'total_debe' => 100.00,
        'total_haber' => 100.00,
        'usuario_id' => $this->user->id,
    ]);

    $asientoDesbalanceado = AsientoContable::create([
        'fecha' => today(),
        'total_debe' => 100.00,
        'total_haber' => 50.00,
        'usuario_id' => $this->user->id,
    ]);

    expect($asientoBalanceado->estaBalanceado())->toBeTrue();
    expect($asientoDesbalanceado->estaBalanceado())->toBeFalse();
});
