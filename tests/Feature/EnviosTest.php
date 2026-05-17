<?php

use App\Models\Almacen;
use App\Models\Cliente;
use App\Models\Envio;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\SeguimientoEnvio;
use App\Models\StockProducto;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Crear usuario
    $this->user = User::factory()->create();
    $this->actingAs($this->user);

    // Crear cliente
    $this->cliente = Cliente::factory()->create([
        'nombre' => 'Cliente Test',
        'activo' => true,
    ]);

    // Crear vehículo
    $this->vehiculo = Vehiculo::factory()->create([
        'placa' => 'ABC-123',
        'marca' => 'Toyota',
        'modelo' => 'Hilux',
        'activo' => true,
        'estado' => Vehiculo::DISPONIBLE,
    ]);

    // Crear chofer (usuario)
    $this->chofer = User::factory()->create([
        'name' => 'Chofer Test',
        'activo' => true,
    ]);

    // Crear almacén
    $this->almacen = Almacen::factory()->create([
        'nombre' => 'Almacén Principal',
        'activo' => true,
    ]);

    // Crear producto con stock
    $this->producto = Producto::factory()->create([
        'nombre' => 'Producto Test',
        'activo' => true,
    ]);

    $this->stock = StockProducto::create([
        'producto_id' => $this->producto->id,
        'almacen_id' => $this->almacen->id,
        'cantidad' => 100,
        'cantidad_disponible' => 100,
        'cantidad_reservada' => 0,
        'fecha_actualizacion' => now(),
    ]);

    // Crear moneda
    $this->moneda = Moneda::factory()->create([
        'codigo' => 'BOB',
        'nombre' => 'Bolivianos',
        'activo' => true,
    ]);

    // Crear estados de documento
    $this->estadoPendiente = EstadoDocumento::factory()->pendiente()->create();
    $this->estadoAprobado = EstadoDocumento::factory()->aprobado()->create();
    $this->estadoFacturado = EstadoDocumento::factory()->facturado()->create();

    // Crear venta lista para envío
    $this->venta = Venta::create([
        'numero' => Venta::generarNumero(),
        'fecha' => now(),
        'subtotal' => 1000.00,
        'descuento' => 0,
        'impuesto' => 130.00,
        'total' => 1130.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'moneda_id' => $this->moneda->id,
        'estado_documento_id' => $this->estadoAprobado->id,
        'requiere_envio' => true,
    ]);

    // Crear detalle de venta
    $this->venta->detalles()->create([
        'producto_id' => $this->producto->id,
        'cantidad' => 10,
        'precio_unitario' => 100.00,
        'subtotal' => 1000.00,
    ]);
});

test('puede crear un envío válido', function () {
    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
        'observaciones' => 'Entregar en la mañana',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasNoErrors();

    expect(Envio::count())->toBe(1);

    $envio = Envio::first();
    expect($envio->venta_id)->toBe($this->venta->id)
        ->and($envio->vehiculo_id)->toBe($this->vehiculo->id)
        ->and($envio->chofer_id)->toBe($this->chofer->id)
        ->and($envio->estado)->toBe(Envio::PROGRAMADO);
});

test('rechaza venta que ya tiene envío asignado', function () {
    // Crear envío existente
    Envio::create([
        'numero_envio' => 'ENV-001',
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::PROGRAMADO,
    ]);

    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('venta_id');
    expect(Envio::count())->toBe(1); // Solo el existente
});

test('rechaza vehículo inactivo', function () {
    $this->vehiculo->update(['activo' => false]);

    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('vehiculo_id');
    expect(Envio::count())->toBe(0);
});

test('rechaza vehículo no disponible', function () {
    $this->vehiculo->update(['estado' => Vehiculo::EN_RUTA]);

    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('vehiculo_id');
    expect(Envio::count())->toBe(0);
});

test('rechaza chofer inactivo', function () {
    $this->chofer->update(['activo' => false]);

    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('chofer_id');
    expect(Envio::count())->toBe(0);
});

test('rechaza venta que no requiere envío', function () {
    $this->venta->update(['requiere_envio' => false]);

    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('venta_id');
    expect(Envio::count())->toBe(0);
});

test('rechaza venta en estado incorrecto', function () {
    // Cambiar a estado PENDIENTE (no APROBADO ni FACTURADO)
    $this->venta->update(['estado_documento_id' => $this->estadoPendiente->id]);

    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('venta_id');
    expect(Envio::count())->toBe(0);
});

test('rechaza fecha programada en el pasado', function () {
    $data = [
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->subDay()->toDateTimeString(), // Ayer
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->post(route('envios.store'), $data);

    $response->assertSessionHasErrors('fecha_programada');
    expect(Envio::count())->toBe(0);
});

test('puede iniciar preparación de envío y reduce stock', function () {
    // Crear envío programado
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::PROGRAMADO,
    ]);

    // Stock antes
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe(100);

    // Iniciar preparación
    $response = $this->post(route('envios.iniciar-preparacion', $envio));

    $response->assertSessionHasNoErrors();

    // Verificar estado del envío
    $envio->refresh();
    expect($envio->estado)->toBe(Envio::EN_PREPARACION);

    // Verificar que el stock se redujo
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe(90); // 100 - 10
});

test('puede confirmar salida del envío', function () {
    // Crear envío en preparación
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::EN_PREPARACION,
    ]);

    $response = $this->post(route('envios.confirmar-salida', $envio));

    $response->assertSessionHasNoErrors();

    // Verificar estado del envío
    $envio->refresh();
    expect($envio->estado)->toBe(Envio::EN_RUTA)
        ->and($envio->fecha_salida)->not->toBeNull();

    // Verificar estado logístico de la venta
    $this->venta->refresh();
    expect($this->venta->estado_logistico)->toBe(Venta::ESTADO_ENVIADO);
});

test('puede confirmar entrega del envío', function () {
    // Crear envío en ruta
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::EN_RUTA,
    ]);

    $data = [
        'receptor_nombre' => 'Juan Pérez',
        'receptor_documento' => '12345678',
        'observaciones_entrega' => 'Entregado correctamente',
    ];

    $response = $this->post(route('envios.confirmar-entrega', $envio), $data);

    $response->assertSessionHasNoErrors();

    // Verificar estado del envío
    $envio->refresh();
    expect($envio->estado)->toBe(Envio::ENTREGADO)
        ->and($envio->fecha_entrega)->not->toBeNull()
        ->and($envio->receptor_nombre)->toBe('Juan Pérez')
        ->and($envio->receptor_documento)->toBe('12345678');

    // Verificar estado logístico de la venta
    $this->venta->refresh();
    expect($this->venta->estado_logistico)->toBe(Venta::ESTADO_ENTREGADO);

    // Verificar que el vehículo se liberó
    $this->vehiculo->refresh();
    expect($this->vehiculo->estado)->toBe(Vehiculo::DISPONIBLE);
});

test('puede cancelar envío en estado PROGRAMADO sin revertir stock', function () {
    // Crear envío programado (stock aún no reducido)
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::PROGRAMADO,
    ]);

    $stockInicial = $this->stock->cantidad;

    $data = ['motivo_cancelacion' => 'Cliente canceló el pedido urgentemente'];

    $response = $this->post(route('envios.cancelar', $envio), $data);

    $response->assertSessionHasNoErrors();

    // Verificar estado del envío
    $envio->refresh();
    expect($envio->estado)->toBe(Envio::CANCELADO);

    // Verificar que el stock NO se modificó (porque nunca se redujo)
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe($stockInicial);

    // Verificar que el vehículo se liberó
    $this->vehiculo->refresh();
    expect($this->vehiculo->estado)->toBe(Vehiculo::DISPONIBLE);
});

test('puede cancelar envío en estado EN_PREPARACION y revierte stock', function () {
    // Crear envío en preparación (stock ya reducido)
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::EN_PREPARACION,
    ]);

    // Simular que el stock ya fue reducido
    $this->stock->update(['cantidad' => 90]);
    $stockAntesCancel = 90;

    $data = ['motivo_cancelacion' => 'Problema con el vehículo, no puede salir'];

    $response = $this->post(route('envios.cancelar', $envio), $data);

    $response->assertSessionHasNoErrors();

    // Verificar estado del envío
    $envio->refresh();
    expect($envio->estado)->toBe(Envio::CANCELADO);

    // Verificar que el stock se restituyó
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe(100); // 90 + 10 revertidos
});

test('puede cancelar envío en estado EN_RUTA y revierte stock', function () {
    // Crear envío en ruta (stock ya reducido)
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::EN_RUTA,
    ]);

    // Simular que el stock ya fue reducido
    $this->stock->update(['cantidad' => 90]);

    $data = ['motivo_cancelacion' => 'Cliente no estaba en la dirección, canceló pedido'];

    $response = $this->post(route('envios.cancelar', $envio), $data);

    $response->assertSessionHasNoErrors();

    // Verificar estado del envío
    $envio->refresh();
    expect($envio->estado)->toBe(Envio::CANCELADO);

    // Verificar que el stock se restituyó
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe(100); // Stock restaurado
});

test('valida motivo de cancelación mínimo', function () {
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::PROGRAMADO,
    ]);

    $data = ['motivo_cancelacion' => 'Corto']; // Menos de 10 caracteres

    $response = $this->post(route('envios.cancelar', $envio), $data);

    $response->assertSessionHasErrors('motivo_cancelacion');
});

test('flujo completo de envío exitoso', function () {
    // 1. Crear envío
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'direccion_entrega' => 'Av. Test 123',
        'estado' => Envio::PROGRAMADO,
    ]);

    expect($envio->estado)->toBe(Envio::PROGRAMADO);
    expect($this->stock->cantidad)->toBe(100);

    // 2. Iniciar preparación
    $this->post(route('envios.iniciar-preparacion', $envio));

    $envio->refresh();
    $this->stock->refresh();
    expect($envio->estado)->toBe(Envio::EN_PREPARACION);
    expect($this->stock->cantidad)->toBe(90);

    // 3. Confirmar salida
    $this->post(route('envios.confirmar-salida', $envio));

    $envio->refresh();
    expect($envio->estado)->toBe(Envio::EN_RUTA)
        ->and($envio->fecha_salida)->not->toBeNull();

    // 4. Confirmar entrega
    $this->post(route('envios.confirmar-entrega', $envio), [
        'receptor_nombre' => 'Juan Pérez',
        'receptor_documento' => '12345678',
        'observaciones_entrega' => 'Todo OK',
    ]);

    $envio->refresh();
    expect($envio->estado)->toBe(Envio::ENTREGADO)
        ->and($envio->fecha_entrega)->not->toBeNull()
        ->and($envio->receptor_nombre)->toBe('Juan Pérez');

    // Verificar que el stock final es correcto
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe(90); // Reducido una sola vez
});

test('puede actualizar ubicación de envío desde API', function () {
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::EN_RUTA,
    ]);

    $data = [
        'latitud' => -17.3935,
        'longitud' => -66.1570,
    ];

    $response = $this->postJson("/api/app/envios/{$envio->id}/ubicacion", $data);

    $response->assertStatus(200)
        ->assertJson(['message' => 'Ubicación actualizada']);

    // Verificar que se creó el seguimiento
    expect($envio->seguimientos()->count())->toBe(1);

    $seguimiento = $envio->seguimientos()->first();
    expect($seguimiento->coordenadas_lat)->toBe(-17.3935)
        ->and($seguimiento->coordenadas_lng)->toBe(-66.1570);
});

test('valida coordenadas de ubicación', function () {
    $envio = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::EN_RUTA,
    ]);

    // Latitud inválida (fuera de rango -90 a 90)
    $data = [
        'latitud' => 100,
        'longitud' => -66.1570,
    ];

    $response = $this->postJson("/api/app/envios/{$envio->id}/ubicacion", $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('latitud');
});

test('genera número de envío automáticamente', function () {
    $envio1 = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $this->venta->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::PROGRAMADO,
    ]);

    expect($envio1->numero_envio)->toMatch('/^ENV-\d{8}-\d{4}$/');

    // Crear segunda venta y envío
    $venta2 = Venta::create([
        'numero' => Venta::generarNumero(),
        'fecha' => now(),
        'subtotal' => 500.00,
        'descuento' => 0,
        'impuesto' => 65.00,
        'total' => 565.00,
        'cliente_id' => $this->cliente->id,
        'usuario_id' => $this->user->id,
        'moneda_id' => $this->moneda->id,
        'estado_documento_id' => $this->estadoAprobado->id,
        'requiere_envio' => true,
    ]);

    $envio2 = Envio::create([
        'numero_envio' => Envio::generarNumeroEnvio(),
        'venta_id' => $venta2->id,
        'vehiculo_id' => $this->vehiculo->id,
        'chofer_id' => $this->chofer->id,
        'fecha_programada' => now()->addDay(),
        'estado' => Envio::PROGRAMADO,
    ]);

    expect($envio2->numero_envio)->not->toBe($envio1->numero_envio);
});
