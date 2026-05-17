<?php

use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Crear usuario
    $this->user = User::factory()->create();
    $this->actingAs($this->user);

    // Crear proveedor
    $this->proveedor = Proveedor::factory()->create([
        'nombre' => 'Proveedor Test',
        'activo' => true,
    ]);

    // Crear productos
    $this->producto1 = Producto::factory()->create([
        'nombre' => 'Producto 1',
        'activo' => true,
    ]);

    $this->producto2 = Producto::factory()->create([
        'nombre' => 'Producto 2',
        'activo' => true,
    ]);

    // Crear moneda
    $this->moneda = Moneda::factory()->create([
        'codigo' => 'BOB',
        'nombre' => 'Bolivianos',
        'activo' => true,
    ]);

    // Crear estado documento
    $this->estadoDocumento = EstadoDocumento::factory()->create([
        'nombre' => 'Pendiente',
    ]);
});

test('puede crear una compra válida', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'numero_factura' => 'FAC-001',
        'subtotal' => 100.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 100.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasNoErrors();

    expect(Compra::count())->toBe(1)
        ->and(DetalleCompra::count())->toBe(1);

    $compra = Compra::first();
    expect($compra->total)->toBe(100.00)
        ->and($compra->proveedor_id)->toBe($this->proveedor->id)
        ->and($compra->detalles)->toHaveCount(1);
});

test('valida coherencia de subtotal con detalles', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 150.00, // ❌ Incorrecto (debería ser 100.00)
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 150.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('subtotal');
    expect(Compra::count())->toBe(0);
});

test('valida coherencia de total', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 10.00,
        'impuesto' => 5.00,
        'total' => 100.00, // ❌ Incorrecto (debería ser 95.00)
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('total');
    expect(Compra::count())->toBe(0);
});

test('valida que descuento no exceda subtotal', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 150.00, // ❌ Mayor que subtotal
        'impuesto' => 0,
        'total' => -50.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('descuento');
    expect(Compra::count())->toBe(0);
});

test('valida coherencia de subtotal de detalles', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 100.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 150.00, // ❌ Incorrecto (debería ser 100.00)
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('detalles.0.subtotal');
    expect(Compra::count())->toBe(0);
});

test('rechaza proveedor inactivo', function () {
    // Desactivar proveedor
    $this->proveedor->update(['activo' => false]);

    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 100.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('proveedor_id');
    expect(Compra::count())->toBe(0);
});

test('rechaza moneda inactiva', function () {
    // Desactivar moneda
    $this->moneda->update(['activo' => false]);

    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 100.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('moneda_id');
    expect(Compra::count())->toBe(0);
});

test('rechaza producto inactivo', function () {
    // Desactivar producto
    $this->producto1->update(['activo' => false]);

    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 100.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('detalles.0.producto_id');
    expect(Compra::count())->toBe(0);
});

test('valida cantidad mínima de detalles', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 0,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 0,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [], // ❌ Vacío
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('detalles');
    expect(Compra::count())->toBe(0);
});

test('valida precio unitario mayor a cero', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 0,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 0,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 0, // ❌ Debe ser > 0
                'subtotal' => 0,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('detalles.0.precio_unitario');
    expect(Compra::count())->toBe(0);
});

test('valida fecha de vencimiento futura', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 100.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 100.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
                'fecha_vencimiento' => now()->subDays(1)->toDateString(), // ❌ Pasada
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasErrors('detalles.0.fecha_vencimiento');
    expect(Compra::count())->toBe(0);
});

test('puede crear compra con múltiples detalles', function () {
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 250.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 250.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 10,
                'precio_unitario' => 10.00,
                'subtotal' => 100.00,
            ],
            [
                'producto_id' => $this->producto2->id,
                'cantidad' => 15,
                'precio_unitario' => 10.00,
                'subtotal' => 150.00,
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasNoErrors();

    expect(Compra::count())->toBe(1)
        ->and(DetalleCompra::count())->toBe(2);

    $compra = Compra::first();
    expect($compra->total)->toBe(250.00)
        ->and($compra->detalles)->toHaveCount(2);
});

test('permite tolerancia de redondeo en cálculos', function () {
    // 10.00 / 3 = 3.333... * 3 = 9.999...
    $data = [
        'fecha' => now()->toDateString(),
        'subtotal' => 10.00,
        'descuento' => 0,
        'impuesto' => 0,
        'total' => 10.00,
        'proveedor_id' => $this->proveedor->id,
        'usuario_id' => $this->user->id,
        'estado_documento_id' => $this->estadoDocumento->id,
        'moneda_id' => $this->moneda->id,
        'detalles' => [
            [
                'producto_id' => $this->producto1->id,
                'cantidad' => 3,
                'precio_unitario' => 3.33,
                'subtotal' => 9.99, // Tolerancia de 0.01
            ],
        ],
    ];

    $response = $this->post(route('compras.store'), $data);

    $response->assertSessionHasNoErrors();
    expect(Compra::count())->toBe(1);
});
