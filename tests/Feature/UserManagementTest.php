<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('usuario sin permisos no puede acceder a la gestión de usuarios', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/usuarios');

    $response->assertStatus(403);
});

test('controlador de usuarios funciona correctamente para crear usuario', function () {
    // Obtener o crear permisos necesarios
    $createPermission = Permission::firstOrCreate(['name' => 'usuarios.create']);

    // Crear rol y asignar permisos
    $role = Role::firstOrCreate(['name' => 'Admin Test Creator']);
    $role->givePermissionTo($createPermission);

    // Crear usuario administrativo
    $admin = User::factory()->create();
    $admin->assignRole($role);

    // Datos del nuevo usuario
    $userData = [
        'name' => 'Usuario Test',
        'usernick' => 'test_user',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => [$role->id],
    ];

    // Intentar crear usuario
    $response = $this->actingAs($admin)
        ->withSession(['_token' => 'test-token'])
        ->post('/usuarios', $userData);

    $response->assertRedirect();

    // Verificar que el usuario fue creado
    $this->assertDatabaseHas('users', [
        'name' => 'Usuario Test',
        'usernick' => 'test_user',
        'email' => 'test@example.com',
    ]);

    // Verificar que se asignó el rol
    $newUser = User::where('email', 'test@example.com')->first();
    expect($newUser->hasRole('Admin Test Creator'))->toBeTrue();
});

test('middleware de permisos funciona correctamente', function () {
    // Usuario sin permisos
    $user = User::factory()->create();

    // Intentar acceder sin permisos
    $response = $this->actingAs($user)->get('/usuarios');
    $response->assertStatus(403);

    // Ahora darle permisos
    $permission = Permission::firstOrCreate(['name' => 'usuarios.index']);
    $role = Role::firstOrCreate(['name' => 'Test Role']);
    $role->givePermissionTo($permission);
    $user->assignRole($role);

    // Intentar acceder con permisos - esto debería funcionar
    $response = $this->actingAs($user)->get('/usuarios');
    $response->assertStatus(200);
});
