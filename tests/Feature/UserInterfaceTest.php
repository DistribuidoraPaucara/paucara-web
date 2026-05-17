<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('página de usuarios se carga correctamente para usuario con permisos', function () {
    // Crear permisos
    $indexPermission = Permission::firstOrCreate(['name' => 'usuarios.index']);

    // Crear rol y asignar permisos
    $role = Role::create(['name' => 'Admin UI Test']);
    $role->givePermissionTo($indexPermission);

    // Crear usuario administrativo
    $admin = User::factory()->create();
    $admin->assignRole($role);

    // Verificar que la página se carga sin errores
    $response = $this->actingAs($admin)->get('/usuarios');

    $response->assertStatus(200);
    $response->assertInertia(fn ($assert) => $assert->component('usuarios/index'));
});

test('página de creación de usuarios se carga correctamente', function () {
    // Crear permisos
    $createPermission = Permission::firstOrCreate(['name' => 'usuarios.create']);

    // Crear rol y asignar permisos
    $role = Role::create(['name' => 'Creator UI Test']);
    $role->givePermissionTo($createPermission);

    // Crear usuario administrativo
    $admin = User::factory()->create();
    $admin->assignRole($role);

    // Verificar que la página se carga sin errores
    $response = $this->actingAs($admin)->get('/usuarios/create');

    $response->assertStatus(200);
    $response->assertInertia(fn ($assert) => $assert->component('usuarios/create'));
});
