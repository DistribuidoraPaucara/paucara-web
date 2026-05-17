<?php

use App\Models\Almacen;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\Entrega;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Usuario autenticado con permisos
    $this->user = User::factory()->create();
    $this->actingAs($this->user);

    // Dar permisos necesarios
    $this->user->givePermissionTo('entregas.create');
    $this->user->givePermissionTo('entregas.index');

    // Crear almacén
    $this->almacen = Almacen::factory()->create([
        'nombre' => 'Almacén Principal',
        'activo' => true,
    ]);

    // Crear moneda
    $this->moneda = Moneda::factory()->create([
        'codigo' => 'BOB',
        'nombre' => 'Bolivianos',
        'activo' => true,
    ]);

    // Crear estados de documento
    $this->estadoAprobado = EstadoDocumento::factory()->create([
        'tipo' => 'APROBADO',
        'nombre' => 'Aprobado',
    ]);
    $this->estadoPendiente = EstadoDocumento::factory()->create([
        'tipo' => 'PENDIENTE',
        'nombre' => 'Pendiente',
    ]);

    // Crear productos con stock
    $this->producto1 = Producto::factory()->create(['nombre' => 'Producto A']);
    $this->producto2 = Producto::factory()->create(['nombre' => 'Producto B']);

    StockProducto::create([
        'producto_id' => $this->producto1->id,
        'almacen_id' => $this->almacen->id,
        'cantidad' => 1000,
        'cantidad_disponible' => 1000,
    ]);

    StockProducto::create([
        'producto_id' => $this->producto2->id,
        'almacen_id' => $this->almacen->id,
        'cantidad' => 1000,
        'cantidad_disponible' => 1000,
    ]);

    // Crear clientes
    $this->cliente1 = Cliente::factory()->create(['nombre' => 'Cliente A']);
    $this->cliente2 = Cliente::factory()->create(['nombre' => 'Cliente B']);

    // Crear vehículos disponibles
    $this->vehiculo1 = Vehiculo::factory()->disponible()->create([
        'placa' => 'ABC-123',
        'capacidad_kg' => 2000,
    ]);

    $this->vehiculo2 = Vehiculo::factory()->disponible()->create([
        'placa' => 'XYZ-789',
        'capacidad_kg' => 1500,
    ]);

    // Crear choferes
    $this->chofer1 = Empleado::factory()->activo()->create([
        'cargo' => 'Chofer',
        'user_id' => User::factory()->create(['name' => 'Chofer 1']),
    ]);

    $this->chofer2 = Empleado::factory()->activo()->create([
        'cargo' => 'Chofer',
        'user_id' => User::factory()->create(['name' => 'Chofer 2']),
    ]);

    // Crear ventas aprobadas con envío
    $this->venta1 = Venta::factory()
        ->conEnvio()
        ->aprobada()
        ->create([
            'cliente_id' => $this->cliente1->id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $this->moneda->id,
            'estado_documento_id' => $this->estadoAprobado->id,
            'total' => 500.00,
        ]);

    $this->venta1->detalles()->create([
        'producto_id' => $this->producto1->id,
        'cantidad' => 10,
        'precio_unitario' => 50.00,
        'subtotal' => 500.00,
    ]);

    $this->venta2 = Venta::factory()
        ->conEnvio()
        ->aprobada()
        ->create([
            'cliente_id' => $this->cliente2->id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $this->moneda->id,
            'estado_documento_id' => $this->estadoAprobado->id,
            'total' => 300.00,
        ]);

    $this->venta2->detalles()->create([
        'producto_id' => $this->producto2->id,
        'cantidad' => 6,
        'precio_unitario' => 50.00,
        'subtotal' => 300.00,
    ]);
});

// ==================================
// GRUPO 1: POST /api/entregas (simple)
// ==================================

test('puede crear entrega simple desde una venta', function () {
    $data = [
        'venta_id' => $this->venta1->id,
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
        'direccion_entrega' => 'Av. Test 123',
    ];

    $response = $this->postJson('/api/entregas', $data);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);

    expect(Entrega::count())->toBe(1);

    $entrega = Entrega::first();
    expect($entrega->venta_id)->toBe($this->venta1->id)
        ->and($entrega->vehiculo_id)->toBe($this->vehiculo1->id)
        ->and($entrega->estado)->toBe(Entrega::ESTADO_PROGRAMADO);
});

test('rechaza crear entrega con venta inexistente', function () {
    $data = [
        'venta_id' => 99999,
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
    ];

    $response = $this->postJson('/api/entregas', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['venta_id']);

    expect(Entrega::count())->toBe(0);
});

test('rechaza crear entrega con vehículo inexistente', function () {
    $data = [
        'venta_id' => $this->venta1->id,
        'vehiculo_id' => 99999,
        'chofer_id' => $this->chofer1->id,
        'fecha_programada' => now()->addDay()->toDateTimeString(),
    ];

    $response = $this->postJson('/api/entregas', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['vehiculo_id']);
});

// ==================================
// GRUPO 2: POST /api/entregas/lote (batch)
// ==================================

test('puede crear lote de entregas con un vehículo', function () {
    $data = [
        'venta_ids' => [$this->venta1->id, $this->venta2->id],
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
        'optimizar' => true,
    ];

    $response = $this->postJson('/api/entregas/lote', $data);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);

    expect(Entrega::count())->toBe(2);
});

test('rechaza lote vacío de ventas', function () {
    $data = [
        'venta_ids' => [],
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
    ];

    $response = $this->postJson('/api/entregas/lote', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['venta_ids']);
});

test('rechaza lote con capacidad insuficiente', function () {
    // Crear vehículo pequeño
    $vehiculoPequeno = Vehiculo::factory()->disponible()->create([
        'placa' => 'MINI-001',
        'capacidad_kg' => 10, // Muy pequeño
    ]);

    $data = [
        'venta_ids' => [$this->venta1->id, $this->venta2->id],
        'vehiculo_id' => $vehiculoPequeno->id,
        'chofer_id' => $this->chofer1->id,
    ];

    $response = $this->postJson('/api/entregas/lote', $data);

    $response->assertStatus(422)
        ->assertJson(['success' => false]);
});

test('puede crear lote con más de 10 ventas', function () {
    // Crear 15 ventas
    $ventas = Venta::factory()
        ->count(15)
        ->conEnvio()
        ->aprobada()
        ->create([
            'cliente_id' => $this->cliente1->id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $this->moneda->id,
            'estado_documento_id' => $this->estadoAprobado->id,
            'total' => 100.00,
        ]);

    foreach ($ventas as $venta) {
        $venta->detalles()->create([
            'producto_id' => $this->producto1->id,
            'cantidad' => 2,
            'precio_unitario' => 50.00,
            'subtotal' => 100.00,
        ]);
    }

    $data = [
        'venta_ids' => $ventas->pluck('id')->toArray(),
        'vehiculo_id' => Vehiculo::factory()->disponible()->create(['capacidad_kg' => 5000])->id,
        'chofer_id' => $this->chofer1->id,
    ];

    $response = $this->postJson('/api/entregas/lote', $data);

    $response->assertStatus(201);
    expect(Entrega::count())->toBe(15);
});

// ==================================
// GRUPO 3: POST /api/entregas/lote/preview
// ==================================

test('puede obtener preview de lote sin crear entregas', function () {
    $data = [
        'venta_ids' => [$this->venta1->id, $this->venta2->id],
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
    ];

    $response = $this->postJson('/api/entregas/lote/preview', $data);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);

    // Verificar que NO se crearon entregas
    expect(Entrega::count())->toBe(0);
});

test('preview muestra clustering y estadísticas', function () {
    $data = [
        'venta_ids' => [$this->venta1->id, $this->venta2->id],
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
    ];

    $response = $this->postJson('/api/entregas/lote/preview', $data);

    $response->assertStatus(200);

    $json = $response->json();

    expect($json['data'])->toHaveKey('optimizacion')
        ->and(is_array($json['data']['optimizacion']))->toBeTrue();
});

// ==================================
// GRUPO 4: POST /api/entregas/lote/optimizar (nuevo)
// ==================================

test('puede optimizar entregas para múltiples vehículos', function () {
    $data = [
        'venta_ids' => [$this->venta1->id, $this->venta2->id],
        'vehiculo_ids' => [$this->vehiculo1->id, $this->vehiculo2->id],
        'chofer_ids' => [$this->chofer1->id, $this->chofer2->id],
        'opciones' => [
            'radio_cluster_km' => 2.5,
        ],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);

    // Verificar que NO se crearon entregas
    expect(Entrega::count())->toBe(0);
});

test('optimizar rechaza array vacío de ventas', function () {
    $data = [
        'venta_ids' => [],
        'vehiculo_ids' => [$this->vehiculo1->id],
        'chofer_ids' => [$this->chofer1->id],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['venta_ids']);
});

test('optimizar rechaza array vacío de vehículos', function () {
    $data = [
        'venta_ids' => [$this->venta1->id],
        'vehiculo_ids' => [],
        'chofer_ids' => [$this->chofer1->id],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['vehiculo_ids']);
});

test('optimizar acepta hasta 100 ventas', function () {
    $ventas = Venta::factory()
        ->count(100)
        ->conEnvio()
        ->aprobada()
        ->create([
            'cliente_id' => $this->cliente1->id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $this->moneda->id,
            'estado_documento_id' => $this->estadoAprobado->id,
        ]);

    foreach ($ventas as $venta) {
        $venta->detalles()->create([
            'producto_id' => $this->producto1->id,
            'cantidad' => 1,
            'precio_unitario' => 10.00,
            'subtotal' => 10.00,
        ]);
    }

    $data = [
        'venta_ids' => $ventas->pluck('id')->toArray(),
        'vehiculo_ids' => [$this->vehiculo1->id, $this->vehiculo2->id],
        'chofer_ids' => [$this->chofer1->id, $this->chofer2->id],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(200);
});

test('optimizar rechaza más de 100 ventas', function () {
    $ventaIds = range(1, 101);

    $data = [
        'venta_ids' => $ventaIds,
        'vehiculo_ids' => [$this->vehiculo1->id],
        'chofer_ids' => [$this->chofer1->id],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['venta_ids']);
});

test('optimizar valida radio de clustering mínimo', function () {
    $data = [
        'venta_ids' => [$this->venta1->id],
        'vehiculo_ids' => [$this->vehiculo1->id],
        'chofer_ids' => [$this->chofer1->id],
        'opciones' => [
            'radio_cluster_km' => 0.1, // Menos del mínimo (0.5)
        ],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['opciones.radio_cluster_km']);
});

test('optimizar valida radio de clustering máximo', function () {
    $data = [
        'venta_ids' => [$this->venta1->id],
        'vehiculo_ids' => [$this->vehiculo1->id],
        'chofer_ids' => [$this->chofer1->id],
        'opciones' => [
            'radio_cluster_km' => 15, // Más del máximo (10)
        ],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['opciones.radio_cluster_km']);
});

test('optimizar retorna múltiples rutas para múltiples vehículos', function () {
    // Crear 20 ventas para distribuir en 2 vehículos
    $ventas = Venta::factory()
        ->count(20)
        ->conEnvio()
        ->aprobada()
        ->create([
            'cliente_id' => $this->cliente1->id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $this->moneda->id,
            'estado_documento_id' => $this->estadoAprobado->id,
        ]);

    foreach ($ventas as $venta) {
        $venta->detalles()->create([
            'producto_id' => $this->producto1->id,
            'cantidad' => 5,
            'precio_unitario' => 20.00,
            'subtotal' => 100.00,
        ]);
    }

    $data = [
        'venta_ids' => $ventas->pluck('id')->toArray(),
        'vehiculo_ids' => [$this->vehiculo1->id, $this->vehiculo2->id],
        'chofer_ids' => [$this->chofer1->id, $this->chofer2->id],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    $response->assertStatus(200);

    $json = $response->json();

    expect($json['data']['rutas'])->toBeArray()
        ->and(count($json['data']['rutas']))->toBeGreaterThan(0)
        ->and($json['data']['estadisticas']['total_entregas'])->toBe(20);
});

// ==================================
// GRUPO 5: EDGE CASES
// ==================================

test('puede manejar ventas sin coordenadas GPS', function () {
    // Cliente sin latitud/longitud
    $clienteSinGPS = Cliente::factory()->create([
        'nombre' => 'Cliente Sin GPS',
        'latitud' => null,
        'longitud' => null,
    ]);

    $ventaSinGPS = Venta::factory()
        ->conEnvio()
        ->aprobada()
        ->create([
            'cliente_id' => $clienteSinGPS->id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $this->moneda->id,
            'estado_documento_id' => $this->estadoAprobado->id,
        ]);

    $ventaSinGPS->detalles()->create([
        'producto_id' => $this->producto1->id,
        'cantidad' => 1,
        'precio_unitario' => 50.00,
        'subtotal' => 50.00,
    ]);

    $data = [
        'venta_ids' => [$ventaSinGPS->id],
        'vehiculo_ids' => [$this->vehiculo1->id],
        'chofer_ids' => [$this->chofer1->id],
    ];

    $response = $this->postJson('/api/entregas/lote/optimizar', $data);

    // Debe usar coordenadas por defecto (-17.3895, -66.1568)
    $response->assertStatus(200);
});

test('flujo completo: preview → optimizar → crear lote', function () {
    $ventaIds = [$this->venta1->id, $this->venta2->id];

    // 1. Preview con 1 vehículo
    $previewResponse = $this->postJson('/api/entregas/lote/preview', [
        'venta_ids' => $ventaIds,
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
    ]);

    $previewResponse->assertStatus(200);
    expect(Entrega::count())->toBe(0);

    // 2. Optimizar con múltiples vehículos
    $optimizarResponse = $this->postJson('/api/entregas/lote/optimizar', [
        'venta_ids' => $ventaIds,
        'vehiculo_ids' => [$this->vehiculo1->id, $this->vehiculo2->id],
        'chofer_ids' => [$this->chofer1->id, $this->chofer2->id],
    ]);

    $optimizarResponse->assertStatus(200);
    expect(Entrega::count())->toBe(0);

    // 3. Crear lote final
    $crearResponse = $this->postJson('/api/entregas/lote', [
        'venta_ids' => $ventaIds,
        'vehiculo_id' => $this->vehiculo1->id,
        'chofer_id' => $this->chofer1->id,
    ]);

    $crearResponse->assertStatus(201);
    expect(Entrega::count())->toBe(2);
});
