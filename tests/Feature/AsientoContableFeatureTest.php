<?php

use App\Models\AsientoContable;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\TipoPago;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Ejecutar seeders necesarios para tests
    $this->artisan('db:seed', ['--class' => 'CuentaContableSeeder']);

    // Crear datos de prueba
    $this->user = User::factory()->create();
    $this->cliente = Cliente::factory()->create();
    $this->producto = Producto::factory()->create([
        'precio_compra' => 30.00,
        'precio_venta' => 50.00,
    ]);
    $this->tipoPago = TipoPago::factory()->create(['codigo' => 'CONTADO']);

    $this->actingAs($this->user);
});

test('crea asiento contable automáticamente en venta', function () {
    // Crear venta
    $venta = Venta::factory()->create([
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'total' => 100.00,
        'tipo_pago_id' => $this->tipoPago->id,
        'estado' => 'FINALIZADA',
    ]);

    // Crear detalle de venta
    DetalleVenta::factory()->create([
        'venta_id' => $venta->id,
        'producto_id' => $this->producto->id,
        'cantidad' => 2,
        'precio_unitario' => 50.00,
    ]);

    // Verificar que se creó el asiento automáticamente
    $asiento = AsientoContable::where('asientable_type', 'App\Models\Venta')
        ->where('asientable_id', $venta->id)
        ->first();

    expect($asiento)->not->toBeNull();
    expect($asiento->tipo_documento)->toBe('VENTA');
    expect($asiento->total_debe)->toBe(100.00);
    expect($asiento->total_haber)->toBe(100.00);
    expect($asiento->estaBalanceado())->toBeTrue();
});

test('genera número secuencial automáticamente', function () {
    // Crear primer asiento
    $asiento1 = AsientoContable::create([
        'fecha' => today(),
        'concepto' => 'Asiento de prueba 1',
        'tipo_documento' => 'AJUSTE',
        'usuario_id' => $this->user->id,
    ]);

    // Verificar que se asigna número automáticamente
    expect($asiento1->numero)->toMatch('/^A-\d{4}-\d{6}$/');

    // Crear segundo asiento
    $asiento2 = AsientoContable::create([
        'fecha' => today(),
        'concepto' => 'Asiento de prueba 2',
        'tipo_documento' => 'AJUSTE',
        'usuario_id' => $this->user->id,
    ]);

    // Verificar que el número es secuencial
    expect($asiento2->numero)->toMatch('/^A-\d{4}-\d{6}$/');
    expect($asiento2->numero)->not->toEqual($asiento1->numero);
});

test('elimina asiento al eliminar venta', function () {
    // Crear venta
    $venta = Venta::factory()->create([
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'total' => 100.00,
        'tipo_pago_id' => $this->tipoPago->id,
        'estado' => 'FINALIZADA',
    ]);

    // Verificar que se creó el asiento
    $asiento = AsientoContable::where('asientable_type', 'App\Models\Venta')
        ->where('asientable_id', $venta->id)
        ->first();

    expect($asiento)->not->toBeNull();
    $asientoId = $asiento->id;

    // Eliminar venta
    $venta->delete();

    // Verificar que se eliminó el asiento
    expect(AsientoContable::find($asientoId))->toBeNull();
});

test('interfaz web muestra asientos', function () {
    // Crear algunos asientos
    $venta1 = Venta::factory()->create([
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'total' => 100.00,
        'tipo_pago_id' => $this->tipoPago->id,
        'estado' => 'FINALIZADA',
    ]);

    $venta2 = Venta::factory()->create([
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'total' => 150.00,
        'tipo_pago_id' => $this->tipoPago->id,
        'estado' => 'FINALIZADA',
    ]);

    // Hacer petición a la interfaz
    $this->get('/contabilidad/asientos')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('Contabilidad/AsientosContables/Index')
        );
});

test('puede ver detalle de asiento', function () {
    // Crear venta que genere asiento
    $venta = Venta::factory()->create([
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'total' => 100.00,
        'tipo_pago_id' => $this->tipoPago->id,
        'estado' => 'FINALIZADA',
    ]);

    $asiento = AsientoContable::where('asientable_type', 'App\Models\Venta')
        ->where('asientable_id', $venta->id)
        ->first();

    // Hacer petición al detalle
    $this->get('/contabilidad/asientos/'.$asiento->id)
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('Contabilidad/AsientosContables/Show')
            ->has('asiento')
        );
});
