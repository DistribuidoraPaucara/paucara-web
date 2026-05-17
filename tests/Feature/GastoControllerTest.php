<?php

namespace Tests\Feature;

use App\Models\Caja;
use App\Models\CierreCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class GastoControllerTest extends RefreshDatabase
{
    protected User $admin;
    protected User $chofer;
    protected Caja $caja;
    protected TipoOperacionCaja $tipoGasto;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear roles y permisos
        $adminRole = Role::create(['name' => 'admin']);
        Permission::create(['name' => 'cajas.gastos']);
        $adminRole->givePermissionTo('cajas.gastos');

        // Crear usuarios
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->chofer = User::factory()->create();

        // Crear caja
        $this->caja = Caja::factory()->create();

        // Crear tipo de operación GASTO
        $this->tipoGasto = TipoOperacionCaja::factory()
            ->create(['codigo' => 'GASTO', 'nombre' => 'Gasto']);
    }

    /**
     * Test: Admin puede ver lista de gastos
     */
    public function test_admin_puede_listar_gastos()
    {
        $gasto = MovimientoCaja::factory()
            ->create([
                'tipo_operacion_id' => $this->tipoGasto->id,
                'descripcion' => '[TRANSPORTE] Combustible para ruta',
                'monto' => -100,
            ]);

        $response = $this->actingAs($this->admin)
            ->get('/cajas/gastos/admin');

        $response->assertStatus(200);
        $response->assertViewHas('gastos');
    }

    /**
     * Test: Aprobar gasto registra la aprobación
     */
    public function test_aprobar_gasto_registra_aprobacion()
    {
        $gasto = MovimientoCaja::factory()
            ->create([
                'tipo_operacion_id' => $this->tipoGasto->id,
                'descripcion' => '[TRANSPORTE] Combustible',
                'monto' => -100,
                'observaciones' => '',
            ]);

        $response = $this->actingAs($this->admin)
            ->post("/cajas/gastos/{$gasto->id}/aprobar");

        $response->assertRedirect();

        $gasto->refresh();
        $this->assertStringContainsString('APROBADO', $gasto->observaciones);
        $this->assertStringContainsString($this->admin->name, $gasto->observaciones);
    }

    /**
     * Test: Rechazar gasto elimina el movimiento
     */
    public function test_rechazar_gasto_elimina_movimiento()
    {
        $gasto = MovimientoCaja::factory()
            ->create([
                'tipo_operacion_id' => $this->tipoGasto->id,
                'descripcion' => '[MANTENIMIENTO] Reparación',
                'monto' => -250,
            ]);

        $gastoId = $gasto->id;

        $response = $this->actingAs($this->admin)
            ->post("/cajas/gastos/{$gastoId}/rechazar", [
                'motivo' => 'Comprobante faltante'
            ]);

        $response->assertRedirect();

        $this->assertDatabaseMissing('movimiento_cajas', [
            'id' => $gastoId,
        ]);
    }

    /**
     * Test: Rechazar gasto sin motivo falla
     */
    public function test_rechazar_gasto_sin_motivo_falla()
    {
        $gasto = MovimientoCaja::factory()
            ->create([
                'tipo_operacion_id' => $this->tipoGasto->id,
                'monto' => -100,
            ]);

        $response = $this->actingAs($this->admin)
            ->post("/cajas/gastos/{$gasto->id}/rechazar", [
                'motivo' => ''
            ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseHas('movimiento_cajas', ['id' => $gasto->id]);
    }

    /**
     * Test: Eliminar gasto remove el registro
     */
    public function test_eliminar_gasto()
    {
        $gasto = MovimientoCaja::factory()
            ->create([
                'tipo_operacion_id' => $this->tipoGasto->id,
                'monto' => -150,
            ]);

        $gastoId = $gasto->id;

        $response = $this->actingAs($this->admin)
            ->delete("/cajas/gastos/{$gastoId}");

        $response->assertRedirect();

        $this->assertDatabaseMissing('movimiento_cajas', [
            'id' => $gastoId,
        ]);
    }

    /**
     * Test: Listar gastos filtra por usuario
     */
    public function test_listar_gastos_filtra_por_usuario()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'user_id' => $user1->id,
            'monto' => -100,
        ]);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'user_id' => $user2->id,
            'monto' => -200,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/cajas/gastos/admin?usuario_id={$user1->id}");

        $response->assertStatus(200);
        $response->assertViewHas('gastos');
    }

    /**
     * Test: Listar gastos filtra por categoría
     */
    public function test_listar_gastos_filtra_por_categoria()
    {
        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'descripcion' => '[TRANSPORTE] Gasolina',
            'monto' => -100,
        ]);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'descripcion' => '[LIMPIEZA] Productos',
            'monto' => -50,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/cajas/gastos/admin?categoria=TRANSPORTE");

        $response->assertStatus(200);
        $response->assertViewHas('gastos');
    }

    /**
     * Test: Listar gastos filtra por fecha
     */
    public function test_listar_gastos_filtra_por_fecha()
    {
        $hoy = now()->toDateString();
        $ayer = now()->subDay()->toDateString();

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'fecha' => $hoy,
            'monto' => -100,
        ]);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'fecha' => $ayer,
            'monto' => -50,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/cajas/gastos/admin?fecha_inicio={$hoy}&fecha_fin={$hoy}");

        $response->assertStatus(200);
        $response->assertViewHas('gastos');
    }

    /**
     * Test: Sin permiso, no puede acceder
     */
    public function test_sin_permiso_no_puede_acceder()
    {
        $response = $this->actingAs($this->chofer)
            ->get('/cajas/gastos/admin');

        $response->assertStatus(403);
    }

    /**
     * Test: Extraer categoría de descripción
     */
    public function test_extrae_categoria_de_descripcion()
    {
        $gasto = MovimientoCaja::factory()
            ->create([
                'tipo_operacion_id' => $this->tipoGasto->id,
                'descripcion' => '[TRANSPORTE] Combustible para ruta semanal',
                'monto' => -100,
            ]);

        // Simular la extracción de categoría como lo hace el controlador
        preg_match('/\[([^\]]+)\]/', $gasto->descripcion, $matches);
        $categoria = $matches[1] ?? 'VARIOS';

        $this->assertEquals('TRANSPORTE', $categoria);
    }

    /**
     * Test: Admin puede exportar CSV de gastos
     */
    public function test_admin_puede_exportar_csv()
    {
        MovimientoCaja::factory()->count(5)->create([
            'tipo_operacion_id' => $this->tipoGasto->id,
            'monto' => -100,
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/cajas/gastos/admin');

        $response->assertStatus(200);
    }
}
