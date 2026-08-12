<?php

namespace Tests\Feature;

use App\Models\NotificacionRecurrente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class NotificacionesRolesTest extends TestCase
{
    use RefreshDatabase;

    protected User $usuario;
    protected Role $adminRole;
    protected Role $gerenteRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear roles
        $this->adminRole = Role::create(['name' => 'admin']);
        $this->gerenteRole = Role::create(['name' => 'gerente']);

        // Crear usuario con permisos
        $this->usuario = User::factory()->create();
        $this->usuario->givePermissionTo('notificaciones.create', 'notificaciones.update');
    }

    /**
     * Test: Crear notificación con roles asignados
     */
    public function test_crear_notificacion_con_roles()
    {
        $this->actingAs($this->usuario);

        $data = [
            'titulo' => 'Notificación Test',
            'descripcion' => 'Descripción test',
            'tipo' => 'promocion',
            'frecuencia' => 'diario',
            'hora_envio' => '09:00',
            'fecha_inicio' => now()->toDateString(),
            'activo' => true,
            'roles' => [$this->adminRole->id, $this->gerenteRole->id],
        ];

        $response = $this->postJson('/api/notificaciones', $data);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);

        $notificacion = NotificacionRecurrente::first();
        $this->assertEquals(2, $notificacion->roles()->count());
        $this->assertTrue($notificacion->roles()->where('name', 'admin')->exists());
        $this->assertTrue($notificacion->roles()->where('name', 'gerente')->exists());
    }

    /**
     * Test: Actualizar notificación y deseleccionar todos los roles
     */
    public function test_actualizar_notificacion_deseleccionar_roles()
    {
        $this->actingAs($this->usuario);

        // Crear notificación con roles
        $notificacion = NotificacionRecurrente::create([
            'titulo' => 'Test',
            'descripcion' => 'Test',
            'tipo' => 'promocion',
            'frecuencia' => 'diario',
            'hora_envio' => '09:00',
            'fecha_inicio' => now()->toDateString(),
            'usuario_id' => $this->usuario->id,
        ]);
        $notificacion->roles()->sync([$this->adminRole->id, $this->gerenteRole->id]);

        // Verificar que tiene 2 roles
        $this->assertEquals(2, $notificacion->refresh()->roles()->count());

        // Actualizar SIN roles (array vacío)
        $data = [
            'titulo' => 'Test Actualizado',
            'descripcion' => 'Test',
            'tipo' => 'promocion',
            'frecuencia' => 'diario',
            'hora_envio' => '09:00',
            'fecha_inicio' => now()->toDateString(),
            'roles' => [],  // ✅ Array vacío
        ];

        $response = $this->putJson("/api/notificaciones/{$notificacion->id}", $data);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        // ✅ Verificar que se sincronizaron (eliminaron) los roles
        $this->assertEquals(0, $notificacion->refresh()->roles()->count());
    }

    /**
     * Test: Validar que roles deben existir en la BD
     */
    public function test_validar_roles_no_existen()
    {
        $this->actingAs($this->usuario);

        $data = [
            'titulo' => 'Notificación Test',
            'descripcion' => 'Descripción test',
            'tipo' => 'promocion',
            'frecuencia' => 'diario',
            'hora_envio' => '09:00',
            'fecha_inicio' => now()->toDateString(),
            'activo' => true,
            'roles' => [9999],  // ❌ ID de rol que no existe
        ];

        $response = $this->postJson('/api/notificaciones', $data);

        // ✅ Debe fallar la validación
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('roles.0');
    }

    /**
     * Test: Validar que roles deben ser integers
     */
    public function test_validar_roles_deben_ser_integers()
    {
        $this->actingAs($this->usuario);

        $data = [
            'titulo' => 'Notificación Test',
            'descripcion' => 'Descripción test',
            'tipo' => 'promocion',
            'frecuencia' => 'diario',
            'hora_envio' => '09:00',
            'fecha_inicio' => now()->toDateString(),
            'activo' => true,
            'roles' => ['admin', 'gerente'],  // ❌ Strings en lugar de IDs
        ];

        $response = $this->postJson('/api/notificaciones', $data);

        // ✅ Debe fallar la validación
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('roles.0', 'roles.1');
    }

    /**
     * Test: Obtener roles disponibles
     */
    public function test_obtener_roles_disponibles()
    {
        $this->actingAs($this->usuario);

        $response = $this->getJson('/api/notificaciones/roles/list');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertCount(2, $response->json('data'));
    }
}
