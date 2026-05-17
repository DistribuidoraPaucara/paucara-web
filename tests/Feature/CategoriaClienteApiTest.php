<?php

use App\Models\CategoriaCliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('lista categorias de cliente', function () {
    $user = User::factory()->create();
    actingAs($user, 'sanctum');

    CategoriaCliente::create(['clave' => 'VIP', 'nombre' => 'VIP']);
    CategoriaCliente::create(['clave' => 'MAYORISTA', 'nombre' => 'Mayorista']);

    $resp = test()->getJson('/api/categorias-cliente');
    $resp->assertOk();
    $resp->assertJsonPath('data.data.0.id', fn ($id) => $id !== null);
});

it('crea, muestra, actualiza y elimina categorias de cliente', function () {
    $user = User::factory()->create();
    actingAs($user, 'sanctum');

    // Crear
    $create = test()->postJson('/api/categorias-cliente', [
        'clave' => 'FRECUENTE',
        'nombre' => 'Frecuente',
    ]);
    $create->assertCreated();
    $id = $create->json('data.id');
    expect($id)->not()->toBeNull();

    // Mostrar
    $show = test()->getJson("/api/categorias-cliente/{$id}");
    $show->assertOk();
    $show->assertJsonPath('data.clave', 'FRECUENTE');

    // Actualizar
    $update = test()->putJson("/api/categorias-cliente/{$id}", [
        'nombre' => 'Cliente Frecuente',
    ]);
    $update->assertOk();
    $update->assertJsonPath('data.nombre', 'Cliente Frecuente');

    // Eliminar
    $delete = test()->deleteJson("/api/categorias-cliente/{$id}");
    $delete->assertOk();
});

it('valida unicidad de clave', function () {
    $user = User::factory()->create();
    actingAs($user, 'sanctum');

    CategoriaCliente::create(['clave' => 'APP', 'nombre' => 'App']);

    $resp = test()->postJson('/api/categorias-cliente', [
        'clave' => 'APP',
        'nombre' => 'Duplicada',
    ]);

    $resp->assertStatus(422);
});
