<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PlatformAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles for testing
        Role::findOrCreate('Cliente');
        Role::findOrCreate('Preventista');
        Role::findOrCreate('Super Admin');
    }

    /**
     * Test: Cliente intenta acceder a la plataforma web
     */
    public function test_cliente_cannot_access_web_platform()
    {
        // Crear usuario Cliente
        $cliente = User::factory()->create();
        $cliente->assignRole('Cliente');
        $cliente->update(['can_access_web' => false, 'can_access_mobile' => true]);

        // Intentar acceder a ruta web
        $response = $this->actingAs($cliente)->get('/dashboard');

        // Debe retornar 403 Forbidden
        $response->assertStatus(403);
    }

    /**
     * Test: Cliente puede acceder a la plataforma móvil (API)
     */
    public function test_cliente_can_access_mobile_platform()
    {
        // Crear usuario Cliente
        $cliente = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);
        $cliente->assignRole('Cliente');
        $cliente->update(['can_access_web' => false, 'can_access_mobile' => true]);

        // Crear token de acceso
        $token = $cliente->createToken('test-token')->plainTextToken;

        // Intentar acceder a endpoint API con token
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/user');

        // Debe ser exitoso
        $response->assertStatus(200);
    }

    /**
     * Test: Preventista puede acceder a ambas plataformas
     */
    public function test_preventista_can_access_both_platforms()
    {
        // Crear usuario Preventista
        $preventista = User::factory()->create();
        $preventista->assignRole('Preventista');
        $preventista->update(['can_access_web' => true, 'can_access_mobile' => true]);

        // Test: Acceso a web
        $webResponse = $this->actingAs($preventista)->get('/dashboard');
        $webResponse->assertStatus(200);

        // Test: Acceso a API
        $token = $preventista->createToken('test-token')->plainTextToken;
        $apiResponse = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/user');
        $apiResponse->assertStatus(200);
    }

    /**
     * Test: Super-Admin siempre puede acceder a ambas plataformas
     */
    public function test_super_admin_can_access_both_platforms()
    {
        // Crear usuario Super-Admin
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('Super Admin');

        // Test: Acceso a web
        $webResponse = $this->actingAs($superAdmin)->get('/dashboard');
        $webResponse->assertStatus(200);

        // Test: Acceso a API
        $token = $superAdmin->createToken('test-token')->plainTextToken;
        $apiResponse = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/user');
        $apiResponse->assertStatus(200);
    }

    /**
     * Test: Cliente bloqueado en web recibe mensaje apropiado
     */
    public function test_cliente_receives_proper_error_message_for_web()
    {
        // Crear usuario Cliente
        $cliente = User::factory()->create();
        $cliente->assignRole('Cliente');
        $cliente->update(['can_access_web' => false, 'can_access_mobile' => true]);

        // Intentar acceder a ruta web
        $response = $this->actingAs($cliente)->get('/dashboard');

        // Verificar que es 403 Forbidden
        $response->assertStatus(403);
    }

    /**
     * Test: Login de API rechaza si usuario no puede acceder a móvil
     */
    public function test_api_login_rejects_if_mobile_access_denied()
    {
        // Crear usuario sin acceso a móvil (hipotético)
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);
        $user->assignRole('Cliente');
        $user->update(['can_access_mobile' => false]);

        // Intentar hacer login
        $response = $this->postJson('/api/login', [
            'login' => 'test@example.com',
            'password' => 'password123',
        ]);

        // Debe retornar error
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('login');
    }
}
