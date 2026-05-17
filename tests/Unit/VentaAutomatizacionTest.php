<?php

use App\Models\AperturaCaja;
use App\Models\AsientoContable;
use App\Models\Caja;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\TipoOperacionCaja;
use App\Models\TipoPago;
use App\Models\User;
use App\Models\Venta;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->cliente = Cliente::factory()->create();
    $this->producto = Producto::factory()->create();
    $this->tipoPagoContado = TipoPago::factory()->create(['codigo' => 'CONTADO']);
    $this->tipoPagoCredito = TipoPago::factory()->create(['codigo' => 'CREDITO']);

    // Crear caja y apertura
    $this->caja = Caja::factory()->create();
    $this->aperturaCaja = AperturaCaja::factory()->create([
        'caja_id' => $this->caja->id,
        'user_id' => $this->user->id,
        'fecha' => today(),
    ]);

    // Crear tipos de operación
    TipoOperacionCaja::factory()->create(['codigo' => 'VENTA', 'nombre' => 'Venta']);
});

it('genera asiento contable automáticamente al crear venta', function () {
    $venta = Venta::create([
        'numero' => 'AUTO-001',
        'fecha' => today(),
        'subtotal' => 100.00,
        'impuesto' => 13.00,
        'total' => 113.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'tipo_pago_id' => $this->tipoPagoContado->id,
        'estado_documento_id' => 1,
        'moneda_id' => 1,
    ]);

    expect($venta->asientoContable)->not->toBeNull();
    expect($venta->asientoContable->numero_documento)->toBe('AUTO-001');
    expect($venta->asientoContable->estaBalanceado())->toBeTrue();
});

it('genera movimiento de caja para ventas al contado', function () {
    $venta = Venta::create([
        'numero' => 'CONTADO-001',
        'fecha' => today(),
        'subtotal' => 100.00,
        'impuesto' => 13.00,
        'total' => 113.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'tipo_pago_id' => $this->tipoPagoContado->id,
        'estado_documento_id' => 1,
        'moneda_id' => 1,
    ]);

    expect($venta->movimientoCaja)->not->toBeNull();
    expect($venta->movimientoCaja->monto)->toBe(113.00);
});

it('no genera movimiento de caja para ventas a crédito', function () {
    $venta = Venta::create([
        'numero' => 'CREDITO-001',
        'fecha' => today(),
        'subtotal' => 100.00,
        'impuesto' => 13.00,
        'total' => 113.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'tipo_pago_id' => $this->tipoPagoCredito->id,
        'estado_documento_id' => 1,
        'moneda_id' => 1,
    ]);

    expect($venta->movimientoCaja)->toBeNull();
});

it('elimina asiento contable al eliminar venta', function () {
    $venta = Venta::create([
        'numero' => 'DELETE-001',
        'fecha' => today(),
        'subtotal' => 100.00,
        'impuesto' => 13.00,
        'total' => 113.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'tipo_pago_id' => $this->tipoPagoContado->id,
        'estado_documento_id' => 1,
        'moneda_id' => 1,
    ]);

    $asientoId = $venta->asientoContable->id;

    $venta->delete();

    expect(AsientoContable::find($asientoId))->toBeNull();
});
