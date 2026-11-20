<?php

use App\Http\Middleware\CheckPlatformAccess;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\Entrega;
use App\Models\EntregaVentaConfirmacion;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

/**
 * Cantidad entregada por producto, según la última confirmación de cada venta.
 *
 * Los casos salen de los datos reales: la lista de devueltos manda aunque la
 * confirmación diga COMPLETA, y una devolución parcial sin lista es un faltante
 * de dinero, no de productos.
 *
 * | Venta              | Vendido   | Última confirmación                  | Entregado     |
 * | completa           | A 10      | COMPLETA                             | A 10          |
 * | completaConDevuelt | A 5, B 2  | COMPLETA + lista A 3 (texto JSON)     | A 2, B 2      |
 * | parcialSinLista    | B 4       | CON_NOVEDAD / DEVOLUCION_PARCIAL     | B 4           |
 * | rechazada          | A 6       | RECHAZADO                            | 0 (no entr. 6)|
 * | pendiente          | B 1       | solo RECHAZADO en otra entrega       | 0 (pend. 1)   |
 * | anulada            | A 100     | (venta ANULADA)                      | no cuenta     |
 * | reintento          | B 3       | RECHAZADO y luego COMPLETA           | B 3           |
 * | devolucionExcedida | A 2       | lista A 5 (más de lo vendido)        | 0, por revisar|
 */
beforeEach(function () {
    $this->withoutMiddleware([Authenticate::class, CheckPlatformAccess::class]);
    $this->actingAs(User::factory()->create());

    $estado = fn (string $codigo) => EstadoDocumento::firstOrCreate(['codigo' => $codigo], ['nombre' => $codigo, 'activo' => true]);
    $aprobado = $estado('APROBADO');
    $anulado = $estado('ANULADO');

    $this->entrega = Entrega::forceCreate(['peso_kg' => 1, 'fecha_programada' => now()]);
    $this->a = Producto::forceCreate(['nombre' => 'Producto A']);
    $this->b = Producto::forceCreate(['nombre' => 'Producto B']);

    $cliente = Cliente::forceCreate(['nombre' => 'Cliente de prueba']);
    $moneda = Moneda::firstOrCreate(['codigo' => 'BOB'], ['nombre' => 'Boliviano', 'simbolo' => 'Bs']);
    $usuario = auth()->user();
    $numero = 0;

    $venta = function (array $lineas, ?EstadoDocumento $estadoDoc = null) use ($aprobado, $cliente, $moneda, $usuario, &$numero) {
        $venta = Venta::forceCreate([
            'numero'              => 'VEN-PROD-' . ++$numero,
            'fecha'               => now(),
            'cliente_id'          => $cliente->id,
            'usuario_id'          => $usuario->id,
            'moneda_id'           => $moneda->id,
            'entrega_id'          => $this->entrega->id,
            'estado_documento_id' => ($estadoDoc ?? $aprobado)->id,
            'subtotal'            => 100,
            'total'               => 100,
            'peso_total_estimado' => 1,
        ]);
        foreach ($lineas as [$producto, $cantidad]) {
            DetalleVenta::forceCreate([
                'venta_id'        => $venta->id,
                'producto_id'     => $producto->id,
                'cantidad'        => $cantidad,
                'precio_unitario' => 10,
                'subtotal'        => $cantidad * 10,
            ]);
        }

        return $venta;
    };

    $confirmar = fn (Venta $venta, string $tipo, array $extra = []) => EntregaVentaConfirmacion::forceCreate(array_merge([
        'entrega_id'        => $this->entrega->id,
        'venta_id'          => $venta->id,
        'tipo_confirmacion' => $tipo,
        'confirmado_en'     => now(),
    ], $extra));

    $devuelto = fn (Producto $producto, int $cantidad) => [
        'producto_id' => $producto->id, 'producto_nombre' => $producto->nombre,
        'cantidad' => $cantidad, 'precio_unitario' => 10, 'subtotal' => $cantidad * 10,
    ];

    $confirmar($venta([[$this->a, 10]]), 'COMPLETA');

    // Lista guardada como texto JSON: existe un caso así en la base real.
    $conf = $confirmar($venta([[$this->a, 5], [$this->b, 2]]), 'COMPLETA');
    DB::table('entregas_venta_confirmaciones')->where('id', $conf->id)
        ->update(['productos_devueltos' => json_encode(json_encode([$devuelto($this->a, 3)]))]);

    $confirmar($venta([[$this->b, 4]]), 'CON_NOVEDAD', ['tipo_novedad' => 'DEVOLUCION_PARCIAL']);
    $confirmar($venta([[$this->a, 6]]), 'RECHAZADO');

    // Rechazada en otra entrega y reasignada a esta: aquí sigue pendiente.
    $otraEntrega = Entrega::forceCreate(['peso_kg' => 1, 'fecha_programada' => now()]);
    $confirmar($venta([[$this->b, 1]]), 'RECHAZADO', ['entrega_id' => $otraEntrega->id]);
    $confirmar($venta([[$this->a, 100]], $anulado), 'COMPLETA');

    $reintento = $venta([[$this->b, 3]]);
    $confirmar($reintento, 'RECHAZADO');
    $confirmar($reintento, 'COMPLETA');

    $confirmar($venta([[$this->a, 2]]), 'DEVOLUCION_PARCIAL', ['productos_devueltos' => [$devuelto($this->a, 5)]]);
});

function productosAgrupados($test): array
{
    return $test->getJson("/api/entregas/{$test->entrega->id}/productos-agrupados")
        ->assertOk()
        ->json('data');
}

function productoAgrupado(array $data, Producto $producto): array
{
    return collect($data['productos'])->firstWhere('producto_id', $producto->id);
}

it('calcula por producto lo entregado, lo no entregado y lo pendiente', function () {
    $data = productosAgrupados($this);

    expect(productoAgrupado($data, $this->a))->toMatchArray([
        'cantidad_total'        => 23,
        'cantidad_entregada'    => 12,
        'cantidad_no_entregada' => 11,
        'cantidad_pendiente'    => 0,
    ])->and(productoAgrupado($data, $this->b))->toMatchArray([
        'cantidad_total'        => 10,
        'cantidad_entregada'    => 9,
        'cantidad_no_entregada' => 0,
        'cantidad_pendiente'    => 1,
    ]);
});

it('suma los totales de la entrega y cuenta las ventas por revisar', function () {
    expect(productosAgrupados($this))->toMatchArray([
        'cantidad_total'        => 33,
        'cantidad_entregada'    => 21,
        'cantidad_no_entregada' => 11,
        'cantidad_pendiente'    => 1,
        'ventas_por_revisar'    => 1,
    ]);
});

it('detalla por venta cuánto se entregó y en qué estado quedó', function () {
    $ventas = collect(productoAgrupado(productosAgrupados($this), $this->a)['ventas'])
        ->map(fn ($v) => [$v['cantidad'], $v['cantidad_entregada'], $v['estado_entrega']])
        ->sortBy(fn ($v) => $v[0])
        ->values()
        ->all();

    expect($ventas)->toBe([
        [2, 0, 'POR_REVISAR'],
        [5, 2, 'PARCIAL'],
        [6, 0, 'NO_ENTREGADO'],
        [10, 10, 'ENTREGADO'],
    ]);
});
