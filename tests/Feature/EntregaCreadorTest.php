<?php

use App\Http\Middleware\CheckPlatformAccess;
use App\Models\Entrega;
use App\Models\User;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Middleware\PermissionMiddleware;

uses(RefreshDatabase::class);

beforeEach(function () {
    config(['app.key' => 'base64:' . base64_encode(str_repeat('k', 32))]);
    $this->withoutMiddleware([Authenticate::class, EnsureEmailIsVerified::class, CheckPlatformAccess::class, PermissionMiddleware::class]);
    $this->withoutVite();
    $this->actingAs(User::factory()->create());

    $this->creador = User::factory()->create(['name' => 'Magdalena Leon']);

    // Sin eventos: al crear, el observer notifica al creador y esa notificación falla
    // (notifications no tiene entrega_id), lo que aborta la transacción de la prueba.
    $this->entrega = Entrega::withoutEvents(fn () => Entrega::forceCreate([
        'fecha_programada' => now(),
        'created_by'       => $this->creador->id,
    ]));
});

it('muestra quién creó la entrega en el detalle', function () {
    $this->getJson("/logistica/entregas/{$this->entrega->id}")
        ->assertOk()
        ->assertJsonPath('data.creado_por.id', $this->creador->id)
        ->assertJsonPath('data.creado_por.name', 'Magdalena Leon');

    $this->get("/logistica/entregas/{$this->entrega->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('logistica/entregas/Show', false)
            ->where('entrega.creado_por.name', 'Magdalena Leon')
        );
});

it('muestra quién creó la entrega en el listado', function () {
    $this->get("/logistica/entregas?search_entrega={$this->entrega->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('logistica/entregas/index', false)
            ->where('entregas.data.0.creado_por.name', 'Magdalena Leon')
        );
});

it('envía el creador vacío en entregas antiguas sin creador registrado', function () {
    $antigua = Entrega::withoutEvents(fn () => Entrega::forceCreate(['fecha_programada' => now(), 'created_by' => null]));

    $this->get("/logistica/entregas/{$antigua->id}")
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('logistica/entregas/Show', false)
            ->where('entrega.creado_por', null)
        );
});
