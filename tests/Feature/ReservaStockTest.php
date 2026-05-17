<?php

use App\Models\Almacen;
use App\Models\Cliente;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\Proforma;
use App\Models\ReservaProforma;
use App\Models\StockProducto;
use App\Models\User;

beforeEach(function () {
    // Crear moneda por defecto primero
    $this->moneda = Moneda::firstOrCreate(
        ['codigo' => 'BOB'],
        [
            'id' => 1,
            'codigo' => 'BOB',
            'nombre' => 'Boliviano',
            'simbolo' => 'Bs.',
            'tasa_cambio' => 1.00,
            'activo' => true,
        ]
    );

    // Crear usuario de prueba
    $this->user = User::factory()->create();

    // Crear cliente de prueba usando valores únicos
    $this->cliente = Cliente::create([
        'nombre' => 'Cliente Test '.uniqid(),
        'nit' => uniqid(),
        'activo' => true,
        'fecha_registro' => now(),
    ]);

    // Crear producto de prueba usando valores únicos
    $this->producto = Producto::create([
        'nombre' => 'Producto Test '.uniqid(),
        'precio_venta' => 100.00,
        'activo' => true,
        'fecha_creacion' => now(),
    ]);

    // Crear almacén de prueba usando valores únicos
    $this->almacen = Almacen::create([
        'nombre' => 'Almacén Test '.uniqid(),
        'direccion' => 'Dirección Test',
        'responsable' => 'Responsable Test',
        'activo' => true,
    ]);

    // Crear stock inicial
    $this->stock = StockProducto::create([
        'producto_id' => $this->producto->id,
        'almacen_id' => $this->almacen->id,
        'cantidad' => 50,
        'cantidad_reservada' => 0,
        'cantidad_disponible' => 50,
    ]);
});

it('puede crear reserva de stock directamente', function () {
    // Crear una reserva directamente
    $reserva = ReservaProforma::create([
        'proforma_id' => null, // Sin proforma por ahora
        'stock_producto_id' => $this->stock->id,
        'cantidad_reservada' => 20,
        'fecha_expiracion' => now()->addHours(24),
        'estado' => ReservaProforma::ACTIVA,
    ]);

    // Actualizar stock manualmente
    $this->stock->cantidad_reservada += 20;
    $this->stock->cantidad_disponible -= 20;
    $this->stock->save();

    // Verificar que la reserva se creó
    expect($reserva->estado)->toBe(ReservaProforma::ACTIVA);
    expect($reserva->cantidad_reservada)->toBe(20);

    // Verificar que el stock se actualizó
    $this->stock->refresh();
    expect($this->stock->cantidad_disponible)->toBe(30);
    expect($this->stock->cantidad_reservada)->toBe(20);
});

it('puede liberar una reserva', function () {
    // Crear una reserva
    $reserva = ReservaProforma::create([
        'proforma_id' => null,
        'stock_producto_id' => $this->stock->id,
        'cantidad_reservada' => 20,
        'fecha_expiracion' => now()->addHours(24),
        'estado' => ReservaProforma::ACTIVA,
    ]);

    // Actualizar stock para simular la reserva
    $this->stock->cantidad_reservada += 20;
    $this->stock->cantidad_disponible -= 20;
    $this->stock->save();

    // Liberar la reserva
    $reserva->liberar();

    // Verificar que se liberó
    expect($reserva->estado)->toBe(ReservaProforma::LIBERADA);

    // Verificar que el stock se actualizó
    $this->stock->refresh();
    expect($this->stock->cantidad_disponible)->toBe(50);
    expect($this->stock->cantidad_reservada)->toBe(0);
});

it('puede crear y gestionar reservas con proforma', function () {
    // Crear una proforma básica
    $proforma = Proforma::create([
        'numero' => 'PRO-TEST-'.uniqid(),
        'fecha' => now(),
        'cliente_id' => $this->cliente->id,
        'estado' => Proforma::PENDIENTE,
        'canal_origen' => Proforma::CANAL_APP_EXTERNA,
        'subtotal' => 100,
        'total' => 100,
        'moneda_id' => $this->moneda->id,
    ]);

    // Crear detalle de proforma
    $proforma->detalles()->create([
        'producto_id' => $this->producto->id,
        'cantidad' => 20,
        'precio_unitario' => 100,
        'subtotal' => 2000,
    ]);

    // Recargar la proforma con sus detalles
    $proforma->load('detalles');

    // Reservar stock usando el método del modelo
    $resultado = $proforma->reservarStock();
    expect($resultado)->toBeTrue();

    // Verificar que se creó la reserva
    $this->assertDatabaseHas('reservas_proforma', [
        'proforma_id' => $proforma->id,
        'stock_producto_id' => $this->stock->id,
        'cantidad_reservada' => 20,
        'estado' => ReservaProforma::ACTIVA,
    ]);

    // Verificar que se actualizó el stock
    $this->stock->refresh();
    expect($this->stock->cantidad_disponible)->toBe(30); // 50 - 20
    expect($this->stock->cantidad_reservada)->toBe(20);

    // Liberar reservas
    $proforma->liberarReservas();

    // Verificar que las reservas se liberaron
    $reservas = ReservaProforma::where('proforma_id', $proforma->id)->get();
    foreach ($reservas as $reserva) {
        expect($reserva->estado)->toBe(ReservaProforma::LIBERADA);
    }

    // Verificar que el stock se liberó
    $this->stock->refresh();
    expect($this->stock->cantidad_disponible)->toBe(50);
    expect($this->stock->cantidad_reservada)->toBe(0);
});

it('verifica disponibilidad de stock correctamente', function () {
    // Verificar stock suficiente
    $disponible = $this->stock->tieneStockDisponible(30);
    expect($disponible)->toBeTrue();

    // Verificar stock insuficiente
    $disponible = $this->stock->tieneStockDisponible(100);
    expect($disponible)->toBeFalse();

    // Crear una reserva para reducir stock disponible
    $reserva = ReservaProforma::create([
        'stock_producto_id' => $this->stock->id,
        'cantidad_reservada' => 30,
        'fecha_expiracion' => now()->addHours(24),
        'estado' => ReservaProforma::ACTIVA,
    ]);

    // Simular actualización de stock
    $this->stock->cantidad_reservada += 30;
    $this->stock->cantidad_disponible -= 30;
    $this->stock->save();

    // Ahora solo quedan 20 disponibles
    $disponible = $this->stock->tieneStockDisponible(25);
    expect($disponible)->toBeFalse();

    $disponible = $this->stock->tieneStockDisponible(15);
    expect($disponible)->toBeTrue();
});

it('libera reservas al rechazar proforma', function () {
    // Crear una proforma pendiente
    $proforma = Proforma::create([
        'numero' => 'PRO-REJECT-'.uniqid(),
        'fecha' => now(),
        'cliente_id' => $this->cliente->id,
        'estado' => Proforma::PENDIENTE,
        'canal_origen' => Proforma::CANAL_APP_EXTERNA,
        'subtotal' => 100,
        'total' => 100,
        'moneda_id' => $this->moneda->id,
    ]);

    // Crear detalle
    $proforma->detalles()->create([
        'producto_id' => $this->producto->id,
        'cantidad' => 15,
        'precio_unitario' => 100,
        'subtotal' => 1500,
    ]);

    $proforma->load('detalles');

    // Reservar stock
    $proforma->reservarStock();

    // Verificar que hay reservas activas
    expect(ReservaProforma::where('proforma_id', $proforma->id)->where('estado', ReservaProforma::ACTIVA)->count())
        ->toBe(1);

    // Cambiar estado a rechazada
    $proforma->update(['estado' => Proforma::RECHAZADA]);

    // Verificar que las reservas se liberaron automáticamente (por el observer)
    expect(ReservaProforma::where('proforma_id', $proforma->id)->where('estado', ReservaProforma::LIBERADA)->count())
        ->toBe(1);

    // Verificar que el stock se liberó
    $this->stock->refresh();
    expect($this->stock->cantidad_disponible)->toBe(50);
    expect($this->stock->cantidad_reservada)->toBe(0);
});

it('consume reservas al convertir a venta', function () {
    // Crear una proforma aprobada
    $proforma = Proforma::create([
        'numero' => 'PRO-SALE-'.uniqid(),
        'fecha' => now(),
        'cliente_id' => $this->cliente->id,
        'estado' => Proforma::APROBADA,
        'canal_origen' => Proforma::CANAL_APP_EXTERNA,
        'subtotal' => 100,
        'total' => 100,
        'moneda_id' => $this->moneda->id,
    ]);

    // Crear detalle
    $proforma->detalles()->create([
        'producto_id' => $this->producto->id,
        'cantidad' => 25,
        'precio_unitario' => 100,
        'subtotal' => 2500,
    ]);

    $proforma->load('detalles');

    // Reservar stock
    $proforma->reservarStock();

    // Verificar que hay reservas activas
    expect(ReservaProforma::where('proforma_id', $proforma->id)->where('estado', ReservaProforma::ACTIVA)->count())
        ->toBe(1);

    // Consumir reservas (simular conversión a venta)
    $proforma->consumirReservas();

    // Verificar que las reservas se consumieron
    expect(ReservaProforma::where('proforma_id', $proforma->id)->where('estado', ReservaProforma::CONSUMIDA)->count())
        ->toBe(1);

    // Verificar que el stock físico se redujo pero la cantidad reservada se liberó
    $this->stock->refresh();
    expect($this->stock->cantidad)->toBe(25); // 50 - 25
    expect($this->stock->cantidad_reservada)->toBe(0);
    expect($this->stock->cantidad_disponible)->toBe(25); // cantidad - cantidad_reservada
});
