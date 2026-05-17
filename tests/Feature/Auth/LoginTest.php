<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

it('allows login via email', function (): void {
    $user = User::factory()->create([
        // Factory already hashes 'password' by default
        'password' => bcrypt('password'),
    ]);

    // Prime session and token by visiting the login page first
    $this->get('/login')->assertSuccessful();
    $token = csrf_token();

    $response = $this->post('/login', [
        '_token' => $token,
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect();
    $this->assertAuthenticatedAs($user);
});

it('allows login via usernick', function (): void {
    $user = User::factory()->create([
        'usernick' => 'mynick',
        'password' => bcrypt('password'),
    ]);

    $this->get('/login')->assertSuccessful();
    $token = csrf_token();

    $response = $this->post('/login', [
        '_token' => $token,
        'email' => 'mynick',
        'password' => 'password',
    ]);

    $response->assertRedirect();
    $this->assertAuthenticatedAs($user);
});

it('seeds required roles including ADMINISTRADOR', function (): void {
    $this->seed(RolesAndPermissionsSeeder::class);

    $roles = ['SUPERADMIN', 'ADMINISTRADOR', 'CLIENTE', 'PROVEEDOR', 'CHOFER', 'CAJERO', 'VENDEDOR'];

    foreach ($roles as $role) {
        expect(Role::where('name', $role)->exists())->toBeTrue();
    }
});
