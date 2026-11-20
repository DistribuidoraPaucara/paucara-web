<?php

use App\Models\Cliente;
use App\Models\Entrega;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Notification;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

beforeEach(function () {
    Http::fake();
    $this->creador = User::factory()->create(['activo' => true]);
    $this->actingAs($this->creador);
});

/**
 * Igual que CrearEntregaPorLocalidadService: la entrega se crea sin número dentro de una
 * transacción, después se le asigna el número y las ventas, y recién entonces se confirma.
 */
function crearEntregaComoElServicio(User $creador): Entrega
{
    $cliente = Cliente::forceCreate(['nombre' => 'Cliente de prueba']);
    $moneda = Moneda::firstOrCreate(['codigo' => 'BOB'], ['nombre' => 'Boliviano', 'simbolo' => 'Bs']);
    $aprobado = EstadoDocumento::firstOrCreate(['codigo' => 'APROBADO'], ['nombre' => 'APROBADO', 'activo' => true]);

    return DB::transaction(function () use ($creador, $cliente, $moneda, $aprobado) {
        $entrega = Entrega::create([
            'numero_entrega'   => '',
            'created_by'       => $creador->id,
            'fecha_programada' => now(),
        ]);

        $entrega->update(['numero_entrega' => "ENT-PRUEBA-{$entrega->id}"]);

        foreach ([1, 2] as $n) {
            Venta::forceCreate([
                'numero' => "VEN-CREADA-{$n}", 'fecha' => now(), 'subtotal' => 10, 'total' => 10,
                'cliente_id' => $cliente->id, 'usuario_id' => $creador->id, 'moneda_id' => $moneda->id,
                'estado_documento_id' => $aprobado->id, 'entrega_id' => $entrega->id,
            ]);
        }

        return $entrega;
    });
}

it('guarda el aviso de entrega creada con el número y las ventas finales', function () {
    $entrega = crearEntregaComoElServicio($this->creador);

    $aviso = Notification::where('type', 'entrega.creada')->where('user_id', $this->creador->id)->sole();

    expect($aviso->data['entrega_numero'])->toBe("ENT-PRUEBA-{$entrega->id}")
        ->and($aviso->data['ventas_count'])->toBe(2);
});

it('envía al socket el aviso de entrega creada con el número y las ventas finales', function () {
    $entrega = crearEntregaComoElServicio($this->creador);

    Http::assertSent(fn ($request) => str_ends_with($request->url(), 'notify/entrega-creada')
        && $request['entrega_numero'] === "ENT-PRUEBA-{$entrega->id}"
        && $request['ventas_count'] === 2);
});

it('no avisa de una entrega cuya creación se revirtió', function () {
    try {
        DB::transaction(function () {
            Entrega::create(['numero_entrega' => '', 'created_by' => $this->creador->id, 'fecha_programada' => now()]);
            throw new RuntimeException('falla al asignar ventas');
        });
    } catch (RuntimeException) {
    }

    expect(Notification::where('type', 'entrega.creada')->count())->toBe(0);
    Http::assertNotSent(fn ($request) => str_ends_with($request->url(), 'notify/entrega-creada'));
});
