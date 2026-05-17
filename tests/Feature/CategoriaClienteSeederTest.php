<?php

use App\Models\CategoriaCliente;
use Database\Seeders\CategoriaClienteSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('siembra categorias de cliente sin duplicar', function () {
    // Ejecutar el seeder dos veces para verificar idempotencia
    $this->seed(CategoriaClienteSeeder::class);
    $this->seed(CategoriaClienteSeeder::class);

    // Debe existir al menos las categorías base
    $claves = ['VIP', 'MAYORISTA', 'FRECUENTE', 'DEUDOR'];

    foreach ($claves as $clave) {
        expect(CategoriaCliente::where('clave', $clave)->exists())->toBeTrue();
    }

    // No debe duplicar por clave
    foreach ($claves as $clave) {
        expect(CategoriaCliente::where('clave', $clave)->count())->toBe(1);
    }
});
