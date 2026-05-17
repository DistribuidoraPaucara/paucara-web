<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Services\AbacService;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * ============================================
 * FASE 4: TESTS DEL SISTEMA ABAC
 * AbacSystemTest - Pruebas del sistema ABAC
 * ============================================
 *
 * Tests para validar funcionamiento del sistema
 * Attribute-Based Access Control.
 */
class AbacSystemTest extends TestCase
{
    use RefreshDatabase;

    protected AbacService $abacService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->abacService = app(AbacService::class);

        // Crear roles y permisos de prueba
        $this->createTestRolesAndPermissions();
    }

    /**
     * Test: Asignar atributo a usuario
     */
    public function test_asignar_atributo_a_usuario()
    {
        $user = User::factory()->create();

        $attr = $this->abacService->asignarAtributo(
            $user,
            'zona',
            'ZONA_NORTE',
            ['is_primary' => true]
        );

        $this->assertNotNull($attr->id);
        $this->assertEquals('zona', $attr->attribute_type);
        $this->assertEquals('ZONA_NORTE', $attr->attribute_value);
        $this->assertTrue($attr->is_primary);
    }

    /**
     * Test: Obtener atributo primario
     */
    public function test_obtener_atributo_primario()
    {
        $user = User::factory()->create();

        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);

        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_CENTRO', [
            'is_primary' => false,
            'priority' => 1,
        ]);

        $primary = $this->abacService->obtenerAtributoPrimario($user, 'zona');

        $this->assertNotNull($primary);
        $this->assertEquals('ZONA_NORTE', $primary->attribute_value);
        $this->assertTrue($primary->is_primary);
    }

    /**
     * Test: Validar acceso por atributo
     */
    public function test_validar_acceso_por_atributo()
    {
        $user = User::factory()->create();
        $user->assignRole('Empleado');

        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);

        // Puede acceder a recurso de su zona
        $puede = $this->abacService->puedeAcceder($user, 'cliente', 'ZONA_NORTE');
        $this->assertTrue($puede);

        // No puede acceder a otra zona
        $no_puede = $this->abacService->puedeAcceder($user, 'cliente', 'ZONA_SUR');
        $this->assertFalse($no_puede);
    }

    /**
     * Test: Super Admin siempre tiene acceso
     */
    public function test_super_admin_siempre_accede()
    {
        $user = User::factory()->create();
        $user->assignRole('Super Admin');

        // Sin atributos, Super Admin igual accede
        $puede = $this->abacService->puedeAcceder($user, 'cliente', 'ZONA_CUALQUIERA');
        $this->assertTrue($puede);
    }

    /**
     * Test: Atributo expirado no es válido
     */
    public function test_atributo_expirado()
    {
        $user = User::factory()->create();

        $attr = $this->abacService->asignarAtributo(
            $user,
            'zona',
            'ZONA_NORTE',
            [
                'is_primary' => true,
                'valid_until' => now()->subDay(),
            ]
        );

        $validacion = $this->abacService->validarAtributo($attr);

        $this->assertFalse($validacion['valido']);
        $this->assertContains('El atributo ha expirado', $validacion['errores']);
    }

    /**
     * Test: Atributo futuro no es válido aún
     */
    public function test_atributo_futuro()
    {
        $user = User::factory()->create();

        $attr = $this->abacService->asignarAtributo(
            $user,
            'zona',
            'ZONA_NORTE',
            [
                'is_primary' => true,
                'valid_from' => now()->addDay(),
            ]
        );

        $validacion = $this->abacService->validarAtributo($attr);

        // Es un atributo válido pero con advertencia
        $this->assertFalse($validacion['valido']);
    }

    /**
     * Test: Obtener todos los atributos agrupados
     */
    public function test_obtener_atributos_agrupados()
    {
        $user = User::factory()->create();

        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);
        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_CENTRO', [
            'priority' => 1,
        ]);
        $this->abacService->asignarAtributo($user, 'sucursal', 'SUC_001', [
            'is_primary' => true,
        ]);

        $atributos = $this->abacService->obtenerAtributos($user);

        $this->assertArrayHasKey('zona', $atributos);
        $this->assertArrayHasKey('sucursal', $atributos);
        $this->assertCount(2, $atributos['zona']);
        $this->assertCount(1, $atributos['sucursal']);
    }

    /**
     * Test: Reasignar atributo
     */
    public function test_reasignar_atributo()
    {
        $user = User::factory()->create();

        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);

        $this->abacService->reasignarAtributo($user, 'zona', 'ZONA_NORTE', 'ZONA_SUR');

        $atributo = $this->abacService->obtenerAtributoPrimario($user, 'zona');
        $this->assertEquals('ZONA_SUR', $atributo->attribute_value);
    }

    /**
     * Test: Obtener usuarios por atributo
     */
    public function test_obtener_usuarios_con_atributo()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        $this->abacService->asignarAtributo($user1, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);
        $this->abacService->asignarAtributo($user2, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);
        $this->abacService->asignarAtributo($user3, 'zona', 'ZONA_SUR', [
            'is_primary' => true,
        ]);

        $usuariosNorte = $this->abacService->obtenerUsuariosConAtributo('zona', 'ZONA_NORTE');

        $this->assertCount(2, $usuariosNorte);
        $this->assertContains($user1->id, $usuariosNorte->pluck('id')->toArray());
        $this->assertContains($user2->id, $usuariosNorte->pluck('id')->toArray());
    }

    /**
     * Test: Middleware valida atributos expirados
     */
    public function test_middleware_rechaza_atributos_expirados()
    {
        $user = User::factory()->create();
        $user->assignRole('Empleado');

        $this->abacService->asignarAtributo(
            $user,
            'zona',
            'ZONA_NORTE',
            [
                'is_primary' => true,
                'valid_until' => now()->subDay(),
            ]
        );

        $this->actingAs($user)
            ->getJson('/api/clientes')
            ->assertStatus(403);
    }

    /**
     * Test: Contexto ABAC en request
     */
    public function test_contexto_abac_en_request()
    {
        $user = User::factory()->create();
        $user->assignRole('Empleado');

        $this->abacService->asignarAtributo($user, 'zona', 'ZONA_NORTE', [
            'is_primary' => true,
        ]);

        $this->actingAs($user)
            ->getJson('/api/clientes')
            ->assertStatus(200);

        // Verificar que contexto está en sesión
        $this->assertNotNull(session('abac_context'));
        $this->assertArrayHasKey('atributos', session('abac_context'));
    }

    // ============================================
    // HELPERS
    // ============================================

    private function createTestRolesAndPermissions()
    {
        app(\Spatie\Permission\Models\Role::class)
            ->firstOrCreate(['name' => 'Super Admin']);
        app(\Spatie\Permission\Models\Role::class)
            ->firstOrCreate(['name' => 'Empleado']);
    }
}
