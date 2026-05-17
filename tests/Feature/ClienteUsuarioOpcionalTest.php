<?php

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClienteUsuarioOpcionalTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Ejecutar seeder de roles y permisos
        $this->artisan('db:seed', ['--class' => 'RolesAndPermissionsSeeder']);

        // Crear usuario administrador para autenticación
        $this->user = User::factory()->create();
        $this->user->assignRole('Admin');

        // Autenticar con Sanctum
        Sanctum::actingAs($this->user, ['*']);
    }

    /** @test */
    public function it_can_create_cliente_without_user()
    {
        $clienteData = [
            'nombre' => 'Juan Pérez',
            'razon_social' => 'Empresa XYZ',
            'nit' => '123456789',
            'telefono' => '71234567',
            'email' => null,
            'localidad_id' => null,
            'activo' => true,
            'crear_usuario' => false,
        ];

        $response = $this->postJson('/api/clientes', $clienteData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'cliente' => [
                        'id',
                        'nombre',
                        'telefono',
                        'user_id',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('clientes', [
            'nombre' => 'Juan Pérez',
            'telefono' => '71234567',
            'user_id' => null,
        ]);

        $this->assertDatabaseMissing('users', [
            'usernick' => '71234567',
        ]);
    }

    /** @test */
    public function it_can_create_cliente_with_user_using_phone_as_credentials()
    {
        $clienteData = [
            'nombre' => 'María García',
            'razon_social' => 'Empresa ABC',
            'nit' => '987654321',
            'telefono' => '79876543',
            'email' => 'maria@example.com',
            'localidad_id' => null,
            'activo' => true,
            'crear_usuario' => true,
        ];

        $response = $this->postJson('/api/clientes', $clienteData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'cliente' => [
                        'id',
                        'nombre',
                        'telefono',
                        'user_id',
                    ],
                    'usuario' => [
                        'id',
                        'name',
                        'usernick',
                        'email',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('clientes', [
            'nombre' => 'María García',
            'telefono' => '79876543',
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'María García',
            'usernick' => '79876543',
            'email' => 'maria@example.com',
        ]);

        $cliente = Cliente::where('telefono', '79876543')->first();
        $user = User::find($cliente->user_id);

        $this->assertNotNull($user);
        $this->assertEquals('79876543', $user->usernick);
        $this->assertTrue(password_verify('79876543', $user->password));
        $this->assertTrue($user->hasRole('Cliente'));
    }

    /** @test */
    public function it_can_create_cliente_with_user_without_email()
    {
        $clienteData = [
            'nombre' => 'Pedro López',
            'razon_social' => 'Empresa DEF',
            'nit' => '456789123',
            'telefono' => '75678912',
            'email' => null,
            'localidad_id' => null,
            'activo' => true,
            'crear_usuario' => true,
        ];

        $response = $this->postJson('/api/clientes', $clienteData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'name' => 'Pedro López',
            'usernick' => '75678912',
            'email' => null,
        ]);

        $cliente = Cliente::where('telefono', '75678912')->first();
        $user = User::find($cliente->user_id);

        $this->assertNotNull($user);
        $this->assertNull($user->email);
        $this->assertNull($user->email_verified_at);
    }

    /** @test */
    public function it_can_update_cliente_and_create_user_later()
    {
        // Crear cliente sin usuario
        $cliente = Cliente::create([
            'nombre' => 'Ana Torres',
            'razon_social' => 'Empresa GHI',
            'nit' => '321654987',
            'telefono' => '73456789',
            'email' => null,
            'activo' => true,
        ]);

        // Actualizar cliente creando usuario
        $updateData = [
            'nombre' => 'Ana Torres',
            'razon_social' => 'Empresa GHI',
            'nit' => '321654987',
            'telefono' => '73456789',
            'email' => 'ana@example.com',
            'activo' => true,
            'crear_usuario' => true,
        ];

        $response = $this->putJson("/api/clientes/{$cliente->id}", $updateData);

        $response->assertStatus(200);

        $cliente->refresh();
        $this->assertNotNull($cliente->user_id);

        $user = User::find($cliente->user_id);
        $this->assertNotNull($user);
        $this->assertEquals('Ana Torres', $user->name);
        $this->assertEquals('73456789', $user->usernick);
        $this->assertEquals('ana@example.com', $user->email);
        $this->assertTrue($user->hasRole('Cliente'));
    }

    /** @test */
    public function it_validates_unique_phone_number()
    {
        // Crear primer cliente
        Cliente::create([
            'nombre' => 'Cliente 1',
            'nit' => '111111111',
            'telefono' => '70000000',
            'activo' => true,
        ]);

        // Intentar crear segundo cliente con mismo teléfono
        $clienteData = [
            'nombre' => 'Cliente 2',
            'nit' => '222222222',
            'telefono' => '70000000', // mismo teléfono
            'activo' => true,
            'crear_usuario' => false,
        ];

        $response = $this->postJson('/api/clientes', $clienteData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['telefono']);
    }

    /** @test */
    public function it_generates_unique_usernick_when_phone_exists()
    {
        // Crear primer usuario con teléfono específico
        User::create([
            'name' => 'Usuario Existente',
            'usernick' => '71111111',
            'password' => bcrypt('password'),
            'email' => 'existente@example.com',
        ]);

        // Crear cliente con mismo teléfono - debería generar usernick único
        $clienteData = [
            'nombre' => 'Nuevo Cliente',
            'nit' => '999999999',
            'telefono' => '71111111',
            'email' => null,
            'activo' => true,
            'crear_usuario' => true,
        ];

        $response = $this->postJson('/api/clientes', $clienteData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'usernick' => '71111111_1', // debería tener sufijo _1
        ]);
    }
}
