<?php

use App\Models\Cliente;
use App\Models\Localidad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('genera codigo_cliente con prefijo de localidad y padding a 4 digitos', function () {
    $user = User::factory()->create();
    actingAs($user, 'sanctum');

    $loc = Localidad::create([
        'nombre' => 'Potosí',
        'codigo' => 'PS',
        'activo' => true,
    ]);

    $cliente = Cliente::create([
        'nombre' => 'Cliente 1',
        'telefono' => '70000000',
        'localidad_id' => $loc->id,
        'fecha_registro' => now(),
        'activo' => true,
    ]);

    // Debe quedar como PS0001 (padding a 4)
    expect($cliente->fresh()->codigo_cliente)->toBe('PS0001');
});
