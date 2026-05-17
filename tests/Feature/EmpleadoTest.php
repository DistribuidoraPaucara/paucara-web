<?php

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('puede crear empleado con usuario', function () {
    $user = User::factory()->create([
        'name' => 'Juan Pérez',
        'email' => 'juan@example.com',
    ]);

    $empleado = Empleado::factory()->create([
        'user_id' => $user->id,
        'codigo_empleado' => 'EMP-0001',
        'ci' => '12345678',
        'cargo' => 'Vendedor',
        'departamento' => 'Ventas',
        'estado' => 'activo',
        'puede_acceder_sistema' => true,
    ]);

    expect($empleado->user_id)->toBe($user->id);
    expect($empleado->user->name)->toBe('Juan Pérez');

    $this->assertDatabaseHas('empleados', [
        'user_id' => $user->id,
        'codigo_empleado' => 'EMP-0001',
        'ci' => '12345678',
    ]);
});

test('empleado puede tener supervisor', function () {
    $supervisor = Empleado::factory()->supervisor()->create();
    $empleado = Empleado::factory()->create([
        'supervisor_id' => $supervisor->id,
    ]);

    expect($empleado->supervisor->id)->toBe($supervisor->id);
    expect($supervisor->supervisados->contains($empleado))->toBeTrue();
});

test('empleado activo puede acceder sistema', function () {
    $empleado = Empleado::factory()->conAccesoSistema()->create();

    expect($empleado->puedeAccederSistema())->toBeTrue();
    expect($empleado->estaActivo())->toBeTrue();
});

test('empleado inactivo no puede acceder sistema', function () {
    $empleado = Empleado::factory()->create([
        'estado' => 'inactivo',
        'puede_acceder_sistema' => true,
    ]);

    expect($empleado->puedeAccederSistema())->toBeFalse();
    expect($empleado->estaActivo())->toBeFalse();
});

test('calcula anos servicio correctamente', function () {
    $empleado = Empleado::factory()->create([
        'fecha_ingreso' => now()->subYears(3)->subMonths(6),
    ]);

    expect($empleado->anosServicio())->toBe(3);
});

test('calcula salario total', function () {
    $empleado = Empleado::factory()->create([
        'salario_base' => 5000.00,
        'bonos' => 1500.00,
    ]);

    expect($empleado->salarioTotal())->toBe(6500.00);
});

test('identifica periodo prueba', function () {
    $empleadoNuevo = Empleado::factory()->create([
        'fecha_ingreso' => now()->subMonths(2),
    ]);

    $empleadoAntiguo = Empleado::factory()->create([
        'fecha_ingreso' => now()->subMonths(6),
    ]);

    expect($empleadoNuevo->enPeriodoPrueba())->toBeTrue();
    expect($empleadoAntiguo->enPeriodoPrueba())->toBeFalse();
});

test('scopes funcionan correctamente', function () {
    Empleado::factory()->create(['estado' => 'activo', 'puede_acceder_sistema' => false]);
    Empleado::factory()->create(['estado' => 'inactivo', 'puede_acceder_sistema' => false]);
    Empleado::factory()->conAccesoSistema()->create(); // Crea uno activo con acceso

    expect(Empleado::activos()->count())->toBe(2);          // 1 activo sin acceso + 1 activo con acceso
    expect(Empleado::conAccesoSistema()->count())->toBe(1); // Solo 1 con acceso al sistema
});

test('usuario sabe si es empleado', function () {
    $userConEmpleado = User::factory()->create();
    $empleado = Empleado::factory()->create(['user_id' => $userConEmpleado->id]);

    $userSinEmpleado = User::factory()->create();

    expect($userConEmpleado->esEmpleado())->toBeTrue();
    expect($userSinEmpleado->esEmpleado())->toBeFalse();
});

test('actualiza ultimo acceso', function () {
    $empleado = Empleado::factory()->create([
        'ultimo_acceso_sistema' => null,
    ]);

    $empleado->actualizarUltimoAcceso();

    expect($empleado->fresh()->ultimo_acceso_sistema)->not->toBeNull();
});
