<?php

use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\LoteVencimiento;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can access lotes-vencimientos index page', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->get('/compras/lotes-vencimientos');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
    );
});

it('can filter lotes by estado_vencimiento', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
    ]);

    // Lote vencido
    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->subDays(5),
        'cantidad_inicial' => 100,
        'cantidad_actual' => 80,
        'estado_vencimiento' => 'VENCIDO',
    ]);

    // Lote próximo a vencer
    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->addDays(10),
        'cantidad_inicial' => 50,
        'cantidad_actual' => 50,
        'estado_vencimiento' => 'PROXIMO_VENCER',
    ]);

    // Lote vigente
    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->addDays(90),
        'cantidad_inicial' => 200,
        'cantidad_actual' => 180,
        'estado_vencimiento' => 'VIGENTE',
    ]);

    // Act
    $response = $this->get('/compras/lotes-vencimientos?estado_vencimiento=VENCIDO');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
        ->has('lotes.data', 1)
        ->where('lotes.data.0.estado_vencimiento', 'VENCIDO')
    );
});

it('can filter lotes by proveedor', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor1 = Proveedor::factory()->create(['nombre' => 'Proveedor A']);
    $proveedor2 = Proveedor::factory()->create(['nombre' => 'Proveedor B']);
    $producto = Producto::factory()->create();

    $compra1 = Compra::factory()->create([
        'proveedor_id' => $proveedor1->id,
        'usuario_id' => $user->id,
    ]);

    $compra2 = Compra::factory()->create([
        'proveedor_id' => $proveedor2->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra1 = DetalleCompra::factory()->create([
        'compra_id' => $compra1->id,
        'producto_id' => $producto->id,
    ]);

    $detalleCompra2 = DetalleCompra::factory()->create([
        'compra_id' => $compra2->id,
        'producto_id' => $producto->id,
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra1->id,
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra2->id,
    ]);

    // Act
    $response = $this->get('/compras/lotes-vencimientos?proveedor_id='.$proveedor1->id);

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
        ->has('lotes.data', 1)
        ->where('lotes.data.0.detalle_compra.compra.proveedor.id', $proveedor1->id)
    );
});

it('can search lotes by numero_lote', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'numero_lote' => 'LOT-ABC-123',
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'numero_lote' => 'LOT-XYZ-456',
    ]);

    // Act
    $response = $this->get('/compras/lotes-vencimientos?search=ABC');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
        ->has('lotes.data', 1)
        ->where('lotes.data.0.numero_lote', 'LOT-ABC-123')
    );
});

it('can search lotes by producto name', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto1 = Producto::factory()->create(['nombre' => 'Producto Especial']);
    $producto2 = Producto::factory()->create(['nombre' => 'Otro Producto']);

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra1 = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto1->id,
    ]);

    $detalleCompra2 = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto2->id,
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra1->id,
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra2->id,
    ]);

    // Act
    $response = $this->get('/compras/lotes-vencimientos?search=Especial');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
        ->has('lotes.data', 1)
        ->where('lotes.data.0.detalle_compra.producto.nombre', 'Producto Especial')
    );
});

it('can sort lotes by fecha_vencimiento', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
    ]);

    // Lote que vence más tarde
    $lote1 = LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->addDays(30),
        'numero_lote' => 'LOT-LATER',
    ]);

    // Lote que vence más temprano
    $lote2 = LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->addDays(5),
        'numero_lote' => 'LOT-SOONER',
    ]);

    // Act - Ordenar por fecha vencimiento ascendente
    $response = $this->get('/compras/lotes-vencimientos?sort=fecha_vencimiento&order=asc');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
        ->has('lotes.data', 2)
        ->where('lotes.data.0.numero_lote', 'LOT-SOONER') // El que vence primero
        ->where('lotes.data.1.numero_lote', 'LOT-LATER')  // El que vence después
    );
});

it('provides correct estadisticas in lotes index', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
        'precio_unitario' => 10.00,
    ]);

    // Lote vencido - valor 800 (80 * 10)
    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->subDays(5),
        'cantidad_inicial' => 100,
        'cantidad_actual' => 80,
        'estado_vencimiento' => 'VENCIDO',
    ]);

    // Lote próximo a vencer - valor 500 (50 * 10)
    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->addDays(10),
        'cantidad_inicial' => 50,
        'cantidad_actual' => 50,
        'estado_vencimiento' => 'PROXIMO_VENCER',
    ]);

    // Lote vigente - valor 1800 (180 * 10)
    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->addDays(90),
        'cantidad_inicial' => 200,
        'cantidad_actual' => 180,
        'estado_vencimiento' => 'VIGENTE',
    ]);

    // Act
    $response = $this->get('/compras/lotes-vencimientos');

    // Assert
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('compras/lotes-vencimientos/index')
        ->where('estadisticas.total_lotes', 3)
        ->where('estadisticas.lotes_vencidos', 1)
        ->where('estadisticas.lotes_proximo_vencer', 1)
        ->where('estadisticas.valor_productos_vencidos', 800.00)
        ->where('estadisticas.valor_productos_proximo_vencer', 500.00)
    );
});

it('can update estado_vencimiento of expired lotes', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
    ]);

    // Lote que debería estar vencido pero tiene estado vigente
    $lote = LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
        'fecha_vencimiento' => now()->subDays(5), // Vencido hace 5 días
        'estado_vencimiento' => 'VIGENTE',         // Pero marcado como vigente
    ]);

    // Act
    $response = $this->patch("/compras/lotes-vencimientos/{$lote->id}/actualizar-estado");

    // Assert
    $response->assertRedirect();
    $response->assertSessionHas('success');

    $lote->refresh();
    expect($lote->estado_vencimiento)->toBe('VENCIDO');
});

it('can export lotes to excel', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $proveedor = Proveedor::factory()->create();
    $producto = Producto::factory()->create();

    $compra = Compra::factory()->create([
        'proveedor_id' => $proveedor->id,
        'usuario_id' => $user->id,
    ]);

    $detalleCompra = DetalleCompra::factory()->create([
        'compra_id' => $compra->id,
        'producto_id' => $producto->id,
    ]);

    LoteVencimiento::factory()->create([
        'detalle_compra_id' => $detalleCompra->id,
    ]);

    // Act
    $response = $this->get('/compras/lotes-vencimientos/export');

    // Assert
    $response->assertOk();
    $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    $response->assertHeader('content-disposition', 'attachment; filename=lotes_vencimientos.xlsx');
});
