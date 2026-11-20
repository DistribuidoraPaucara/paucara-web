<?php

use App\Http\Middleware\CheckPlatformAccess;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Entrega;
use App\Models\EntregaVentaConfirmacion;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\TipoPago;
use App\Models\User;
use App\Models\Venta;
use App\Services\ImpresionEntregaService;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Middleware\PermissionMiddleware;

uses(RefreshDatabase::class);

/**
 * Caso basado en la entrega 755: ventas válidas mezcladas con anuladas.
 *
 * | Venta     | Estado    | Pago     | Total | Peso   | Unidades |
 * | aprobada  | APROBADO  | EFECTIVO | 3544  | 199.10 | 10       |
 * | credito   | APROBADO  | CREDITO  | 1000  |  50.00 |  4       |
 * | anulada   | ANULADO   | EFECTIVO | 2540  | 120.21 |  7       |
 * | cancelada | CANCELADO | EFECTIVO | 1893  | 123.97 |  3       |
 *
 * La anulada tiene una confirmación con dinero cobrado: es el caso de la venta
 * 6213, que no debe sumar al recibido aunque nadie la haya marcado RECHAZADO.
 */
beforeEach(function () {
    config(['app.key' => 'base64:' . base64_encode(str_repeat('k', 32))]);

    // Se omiten solo acceso y permisos: el enlace de rutas {entrega} debe seguir activo.
    $this->withoutMiddleware([
        Authenticate::class,
        EnsureEmailIsVerified::class,
        CheckPlatformAccess::class,
        PermissionMiddleware::class,
    ]);
    $this->withoutVite();
    $this->actingAs(User::factory()->create());

    $estado = fn (string $codigo) => EstadoDocumento::firstOrCreate(
        ['codigo' => $codigo],
        ['nombre' => $codigo, 'activo' => true]
    );
    $this->aprobado = $estado('APROBADO');
    $this->pendiente = $estado('PENDIENTE');
    $this->anulado = $estado('ANULADO');
    $this->cancelado = $estado('CANCELADO');

    $pago = fn (string $codigo) => TipoPago::firstOrCreate(
        ['codigo' => $codigo],
        ['nombre' => $codigo, 'activo' => true]
    );
    $efectivo = $pago('EFECTIVO');
    $credito = $pago('CREDITO');

    // Sin factories de Venta/Entrega: usan columnas que ya no existen en el esquema.
    $this->entrega = Entrega::forceCreate(['peso_kg' => 493.28, 'fecha_programada' => now()]);

    $this->producto = Producto::forceCreate(['nombre' => 'Producto de venta válida']);
    $productoSoloAnulado = Producto::forceCreate(['nombre' => 'Producto solo en anuladas']);

    $cliente = Cliente::forceCreate(['nombre' => 'Cliente de prueba']);
    $moneda = Moneda::firstOrCreate(['codigo' => 'BOB'], ['nombre' => 'Boliviano', 'simbolo' => 'Bs']);
    $usuario = auth()->user();

    $numero = 0;
    $venta = function (EstadoDocumento $estado, TipoPago $tipoPago, float $total, float $peso, array $lineas) use ($cliente, $moneda, $usuario, &$numero) {
        $venta = Venta::forceCreate([
            'numero'              => 'VEN-TEST-' . ++$numero,
            'fecha'               => now(),
            'cliente_id'          => $cliente->id,
            'usuario_id'          => $usuario->id,
            'moneda_id'           => $moneda->id,
            'entrega_id'          => $this->entrega->id,
            'estado_documento_id' => $estado->id,
            'tipo_pago_id'        => $tipoPago->id,
            'subtotal'            => $total,
            'total'               => $total,
            'peso_total_estimado' => $peso,
        ]);

        foreach ($lineas as [$producto, $cantidad, $precio]) {
            DetalleVenta::forceCreate([
                'venta_id'        => $venta->id,
                'producto_id'     => $producto->id,
                'cantidad'        => $cantidad,
                'precio_unitario' => $precio,
                'subtotal'        => $cantidad * $precio,
            ]);
        }

        return $venta;
    };

    $this->ventaAprobada = $venta($this->aprobado, $efectivo, 3544, 199.10, [[$this->producto, 10, 354.40]]);
    $this->ventaCredito = $venta($this->aprobado, $credito, 1000, 50.00, [[$this->producto, 4, 250]]);
    $this->ventaAnulada = $venta($this->anulado, $efectivo, 2540, 120.21, [[$this->producto, 2, 20], [$productoSoloAnulado, 5, 500]]);
    $this->ventaCancelada = $venta($this->cancelado, $efectivo, 1893, 123.97, [[$productoSoloAnulado, 3, 631]]);

    $confirmar = fn (Venta $venta, float $monto) => EntregaVentaConfirmacion::forceCreate([
        'entrega_id'            => $this->entrega->id,
        'venta_id'              => $venta->id,
        'tipo_pago_id'          => $efectivo->id,
        'tipo_confirmacion'     => 'COMPLETA',
        'total_dinero_recibido' => $monto,
        'monto_recibido'        => $monto,
        'confirmado_en'         => now(),
    ]);
    $confirmar($this->ventaAprobada, 3544);
    $confirmar($this->ventaAnulada, 2540);
});

it('envía en la respuesta JSON de show los totales sin anuladas ni canceladas', function () {
    $this->getJson("/logistica/entregas/{$this->entrega->id}")
        ->assertOk()
        ->assertJsonPath('data.totales.cantidad_ventas', 2)
        ->assertJsonPath('data.totales.cantidad_excluidas', 2)
        ->assertJsonPath('data.totales.subtotal', 4544)
        ->assertJsonPath('data.totales.total_sin_credito', 3544);
});

it('envía por venta lo cobrado por tipo de pago y las unidades entregadas', function () {
    EntregaVentaConfirmacion::where('venta_id', $this->ventaAprobada->id)->update(['desglose_pagos' => json_encode([
        ['tipo_pago_id' => 1, 'tipo_pago_nombre' => 'Efectivo', 'monto' => 3000, 'referencia' => null],
        ['tipo_pago_id' => 2, 'tipo_pago_nombre' => 'Transferencia / QR', 'monto' => 500, 'referencia' => 'QR-1'],
        ['tipo_pago_id' => 1, 'tipo_pago_nombre' => 'Efectivo', 'monto' => 44, 'referencia' => null],
    ])]);

    $ventas = collect($this->getJson("/logistica/entregas/{$this->entrega->id}")->assertOk()->json('data.ventas'))->keyBy('id');

    expect($ventas[$this->ventaAprobada->id]['cobro'])->toEqual([
        ['tipo_pago_id' => 1, 'tipo_pago' => 'Efectivo', 'monto' => 3044],
        ['tipo_pago_id' => 2, 'tipo_pago' => 'Transferencia / QR', 'monto' => 500],
    ])->and($ventas[$this->ventaAprobada->id]['unidades'])->toEqual(['vendidas' => 10, 'entregadas' => 10, 'estado' => 'ENTREGADO'])
        ->and($ventas[$this->ventaCredito->id]['cobro'])->toBe([])
        ->and($ventas[$this->ventaCredito->id]['unidades'])->toEqual(['vendidas' => 4, 'entregadas' => 0, 'estado' => 'PENDIENTE']);
});

it('envía por venta cuánto dinero falta cobrar', function () {
    $confirmacion = EntregaVentaConfirmacion::where('venta_id', $this->ventaAprobada->id);
    $ventaJson = fn () => collect($this->getJson("/logistica/entregas/{$this->entrega->id}")->assertOk()->json('data.ventas'))->keyBy('id');
    $desglose = fn (float $monto) => json_encode([['tipo_pago_id' => 1, 'tipo_pago_nombre' => 'Efectivo', 'monto' => $monto]]);

    // Total 3544, cobrado 3534: faltan 10 (como la venta 6223).
    $confirmacion->update(['desglose_pagos' => $desglose(3534)]);
    expect($ventaJson()[$this->ventaAprobada->id]['faltante_cobro'])->toEqual(10);

    // Devolvió Bs 354.40 en productos: lo devuelto no se cobra, no falta nada.
    $confirmacion->update(['desglose_pagos' => $desglose(3189.60), 'monto_devuelto' => 354.40]);
    expect($ventaJson()[$this->ventaAprobada->id]['faltante_cobro'])->toEqual(0);

    // Rechazada: no se esperaba cobro.
    $confirmacion->update(['tipo_confirmacion' => 'RECHAZADO', 'desglose_pagos' => null, 'monto_devuelto' => null]);
    expect($ventaJson()[$this->ventaAprobada->id]['faltante_cobro'])->toEqual(0);

    // A crédito: tampoco.
    EntregaVentaConfirmacion::forceCreate([
        'entrega_id' => $this->entrega->id, 'venta_id' => $this->ventaCredito->id,
        'tipo_confirmacion' => 'COMPLETA', 'confirmado_en' => now(),
    ]);
    expect($ventaJson()[$this->ventaCredito->id]['faltante_cobro'])->toEqual(0);
});

it('envía a la página web los totales y mantiene las anuladas en la lista', function () {
    $this->get("/logistica/entregas/{$this->entrega->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('logistica/entregas/Show', false)
            ->has('entrega.ventas', 4)
            ->where('entrega.totales.cantidad_ventas', 2)
            ->where('entrega.totales.cantidad_excluidas', 2)
            ->where('entrega.totales.subtotal', 4544)
            ->where('entrega.totales.total_sin_credito', 3544)
        );
});

it('envía al listado de entregas los totales sin anuladas ni canceladas', function () {
    $this->get("/logistica/entregas?search_entrega={$this->entrega->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('logistica/entregas/index', false)
            ->has('entregas.data', 1)
            ->has('entregas.data.0.ventas', 4)
            ->where('entregas.data.0.totales.cantidad_ventas', 2)
            ->where('entregas.data.0.totales.cantidad_excluidas', 2)
            ->where('entregas.data.0.totales.subtotal', 4544)
            ->where('entregas.data.0.ventas.2.es_vigente', false)
        );
});

it('excluye anuladas y canceladas de la respuesta de resumen de pagos', function () {
    $response = $this->getJson("/api/chofer/entregas/{$this->entrega->id}/resumen-pagos")->assertOk();

    $resumen = $response->json('data') ?? $response->json();

    expect((float) $resumen['total_esperado'])->toBe(3544.0)
        ->and((float) $resumen['total_recibido'])->toBe(3544.0)
        ->and((float) $resumen['diferencia'])->toBe(0.0)
        ->and($resumen['sin_registrar'])->toBe([]);
});

it('excluye anuladas y canceladas de los productos agrupados', function () {
    $this->getJson("/api/entregas/{$this->entrega->id}/productos-agrupados")
        ->assertOk()
        ->assertJsonPath('data.total_items', 1)
        ->assertJsonPath('data.cantidad_total', 14)
        ->assertJsonPath('data.productos.0.producto_id', $this->producto->id)
        ->assertJsonPath('data.productos.0.subtotal', 4544);
});

it('excluye anuladas y canceladas de los productos para impresión y Excel', function () {
    $productos = app(ImpresionEntregaService::class)->obtenerProductosGenerico($this->entrega);

    expect($productos->pluck('venta_id')->unique()->sort()->values()->all())
        ->toBe(collect([$this->ventaAprobada->id, $this->ventaCredito->id])->sort()->values()->all());
});

it('recalcula el peso cuando una venta se anula', function () {
    $this->ventaCredito->update(['estado_documento_id' => $this->anulado->id]);

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(199.10);
});

it('recalcula el peso cuando una venta se cancela', function () {
    $this->ventaCredito->update(['estado_documento_id' => $this->cancelado->id]);

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(199.10);
});

it('recalcula el peso cuando una venta anulada vuelve a ser válida', function () {
    $this->ventaAnulada->update(['estado_documento_id' => $this->aprobado->id]);

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(369.31);
});

it('deja el peso en cero cuando se anulan todas las ventas', function () {
    $this->ventaAprobada->update(['estado_documento_id' => $this->anulado->id]);
    $this->ventaCredito->update(['estado_documento_id' => $this->anulado->id]);

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(0.0);
});

it('no toca el peso si el cambio de estado no afecta la validez de la venta', function () {
    $this->ventaAprobada->update(['estado_documento_id' => $this->pendiente->id]);

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(493.28);
});

it('no toca el peso si una venta válida no tiene peso registrado', function () {
    $this->ventaCredito->update(['peso_total_estimado' => null]);

    $this->ventaAprobada->update(['estado_documento_id' => $this->anulado->id]);

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(493.28);
});

it('corrige con el comando solo la entrega indicada', function () {
    $otra = Entrega::forceCreate(['peso_kg' => 77.77, 'fecha_programada' => now()]);

    $this->artisan('app:recalcular-pesos-entregas', ['--entrega_id' => $this->entrega->id])->assertSuccessful();

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(249.10)
        ->and((float) $otra->fresh()->peso_kg)->toBe(77.77);
});

it('corrige con el comando solo las entregas que tienen ventas anuladas o canceladas', function () {
    // Solo ventas vigentes y peso desactualizado (debería ser 199.10): esta opción no la toca.
    $otra = Entrega::forceCreate(['peso_kg' => 77.77, 'fecha_programada' => now()]);
    $this->ventaAprobada->replicate()->fill(['numero' => 'VEN-OTRA', 'entrega_id' => $otra->id])->save();

    $this->artisan('app:recalcular-pesos-entregas', ['--solo-con-anuladas' => true])->assertSuccessful();

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(249.10)
        ->and((float) $otra->fresh()->peso_kg)->toBe(77.77);
});

it('no escribe nada con el comando en modo de prueba', function () {
    $this->artisan('app:recalcular-pesos-entregas', ['--entrega_id' => $this->entrega->id, '--dry-run' => true])
        ->assertSuccessful();

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(493.28);
});

it('omite con el comando la entrega que tiene ventas válidas sin peso', function () {
    $this->ventaCredito->update(['peso_total_estimado' => null]);

    $this->artisan('app:recalcular-pesos-entregas', ['--entrega_id' => $this->entrega->id])->assertSuccessful();

    expect((float) $this->entrega->fresh()->peso_kg)->toBe(493.28);
});
