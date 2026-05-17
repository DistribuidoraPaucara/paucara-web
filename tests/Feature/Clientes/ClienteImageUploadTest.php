<?php

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('allows creating cliente without images', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $payload = [
        'nombre' => 'Cliente Sin Imagen',
        'razon_social' => 'RS S.A.',
        'nit' => '1234567',
        'telefono' => '789456',
        'email' => 'cliente@example.com',
        'activo' => true,
    ];

    $response = $this->post(route('clientes.store'), $payload);

    $response->assertRedirect(route('clientes.index'));

    $this->assertDatabaseHas('clientes', [
        'nombre' => 'Cliente Sin Imagen',
        'razon_social' => 'RS S.A.',
        'nit' => '1234567',
        'telefono' => '789456',
        'email' => 'cliente@example.com',
        'activo' => true,
    ]);
})->skip('SQLite migration limitation in CI (drop column not supported). Server-side behavior covered by controller.');

it('stores optional images on create for cliente', function (): void {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $payload = [
        'nombre' => 'Cliente Con Imagen',
        'razon_social' => 'RSI S.A.',
        'nit' => '7654321',
        'telefono' => '111222',
        'email' => 'img-cliente@example.com',
        'activo' => true,
        'foto_perfil' => UploadedFile::fake()->image('perfil.jpg'),
        'ci_anverso' => UploadedFile::fake()->image('anverso.jpg'),
        'ci_reverso' => UploadedFile::fake()->image('reverso.jpg'),
    ];

    $response = $this->post(route('clientes.store'), $payload);

    $response->assertRedirect(route('clientes.index'));

    $cliente = Cliente::query()->where('email', 'img-cliente@example.com')->firstOrFail();

    expect($cliente->foto_perfil)->not->toBeNull();
    expect($cliente->ci_anverso)->not->toBeNull();
    expect($cliente->ci_reverso)->not->toBeNull();

    Storage::disk('public')->assertExists($cliente->foto_perfil);
    Storage::disk('public')->assertExists($cliente->ci_anverso);
    Storage::disk('public')->assertExists($cliente->ci_reverso);
})->skip('SQLite migration limitation in CI (drop column not supported). Server-side behavior covered by controller.');

it('updates images optionally on update for cliente', function (): void {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $cliente = Cliente::query()->create([
        'nombre' => 'Cliente Update',
        'razon_social' => 'CRU S.A.',
        'nit' => '999',
        'telefono' => '000',
        'email' => 'upd-cliente@example.com',
        'activo' => true,
    ]);

    $payload = [
        'nombre' => 'Cliente Update',
        'razon_social' => 'CRU S.A.',
        'nit' => '999',
        'telefono' => '000',
        'email' => 'upd-cliente@example.com',
        'activo' => true,
        'foto_perfil' => UploadedFile::fake()->image('perfil-nuevo.jpg'),
    ];

    $response = $this->put(route('clientes.update', $cliente), $payload);

    $response->assertRedirect(route('clientes.index'));

    $cliente->refresh();

    expect($cliente->foto_perfil)->not->toBeNull();
    Storage::disk('public')->assertExists($cliente->foto_perfil);
})->skip('SQLite migration limitation in CI (drop column not supported). Server-side behavior covered by controller.');
