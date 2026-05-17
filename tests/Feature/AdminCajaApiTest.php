<?php

namespace Tests\Feature;

use App\Models\AperturaCaja;
use App\Models\Caja;
use App\Models\CierreCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminCajaApiTest extends RefreshDatabase
{
    protected User $admin;
    protected Caja $caja;
    protected User $chofer;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear roles y permisos
        $adminRole = Role::create(['name' => 'admin']);
        Permission::create(['name' => 'cajas.index']);
        Permission::create(['name' => 'cajas.gastos']);
        $adminRole->givePermissionTo(['cajas.index', 'cajas.gastos']);

        // Crear usuarios
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->chofer = User::factory()->create();

        // Crear caja
        $this->caja = Caja::factory()->create(['user_id' => $this->chofer->id]);
    }

    /**
     * Test: GET /api/admin/cajas/estado-general
     */
    public function test_obtener_estado_general_cajas()
    {
        // Crear apertura de caja
        $apertura = AperturaCaja::factory()->create([
            'caja_id' => $this->caja->id,
            'user_id' => $this->chofer->id,
            'fecha' => now(),
            'monto_apertura' => 1000,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/cajas/estado-general');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'nombre', 'usuario', 'estado',
                        'monto_actual', 'hora_apertura'
                    ]
                ],
                'timestamp'
            ]);

        $this->assertNotEmpty($response->json('data'));
    }

    /**
     * Test: GET /api/admin/cajas/alertas
     */
    public function test_obtener_alertas_cajas()
    {
        // Crear caja abierta hace más de 8 horas
        $apertura = AperturaCaja::factory()->create([
            'caja_id' => $this->caja->id,
            'user_id' => $this->chofer->id,
            'fecha' => now()->subHours(9),
            'created_at' => now()->subHours(9),
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/cajas/alertas');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'tipo', 'severidad', 'titulo',
                        'descripcion', 'usuario', 'fecha'
                    ]
                ],
                'total',
                'timestamp'
            ]);
    }

    /**
     * Test: GET /api/admin/cajas/estadisticas
     */
    public function test_obtener_estadisticas_cajas()
    {
        $hoy = today();

        // Crear datos de prueba
        $tipoVenta = TipoOperacionCaja::factory()
            ->create(['codigo' => 'VENTA', 'nombre' => 'Venta']);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $tipoVenta->id,
            'fecha' => $hoy,
            'monto' => 500,
        ]);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $tipoVenta->id,
            'fecha' => $hoy,
            'monto' => -100,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/cajas/estadisticas');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    'aperturas_hoy',
                    'cierres_hoy',
                    'cajas_abiertas',
                    'total_ingresos',
                    'total_egresos',
                    'neto_dia',
                    'discrepancias_total',
                    'movimientos_por_tipo'
                ],
                'timestamp'
            ]);

        $this->assertEquals(500, $response->json('data.total_ingresos'));
        $this->assertEquals(100, $response->json('data.total_egresos'));
    }

    /**
     * Test: GET /api/admin/cajas/{id}/detalle
     */
    public function test_obtener_detalle_caja()
    {
        $apertura = AperturaCaja::factory()->create([
            'caja_id' => $this->caja->id,
            'user_id' => $this->chofer->id,
            'fecha' => now(),
            'monto_apertura' => 1000,
        ]);

        $tipoMovimiento = TipoOperacionCaja::factory()
            ->create(['codigo' => 'VENTA', 'nombre' => 'Venta']);

        MovimientoCaja::factory()->create([
            'caja_id' => $this->caja->id,
            'user_id' => $this->chofer->id,
            'tipo_operacion_id' => $tipoMovimiento->id,
            'fecha' => now(),
            'monto' => 500,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/admin/cajas/{$this->caja->id}/detalle");

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    'caja_id',
                    'caja_nombre',
                    'usuario',
                    'estado',
                    'movimientos',
                    'resumen' => [
                        'monto_apertura',
                        'total_ingresos',
                        'total_egresos',
                        'monto_esperado',
                    ]
                ],
                'timestamp'
            ]);

        $this->assertEquals('abierta', $response->json('data.estado'));
        $this->assertEquals(1000, $response->json('data.resumen.monto_apertura'));
    }

    /**
     * Test: GET /api/admin/gastos/resumen
     */
    public function test_obtener_resumen_gastos()
    {
        $tipoGasto = TipoOperacionCaja::factory()
            ->create(['codigo' => 'GASTO', 'nombre' => 'Gasto']);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $tipoGasto->id,
            'descripcion' => '[TRANSPORTE] Combustible',
            'fecha' => now(),
            'monto' => -200,
        ]);

        MovimientoCaja::factory()->create([
            'tipo_operacion_id' => $tipoGasto->id,
            'descripcion' => '[LIMPIEZA] Productos',
            'fecha' => now(),
            'monto' => -50,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/gastos/resumen');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [
                    'total_gastos',
                    'monto_total',
                    'promedio',
                    'por_categoria'
                ],
                'timestamp'
            ]);

        $this->assertEquals(2, $response->json('data.total_gastos'));
        $this->assertEquals(250, $response->json('data.monto_total'));
    }

    /**
     * Test: Sin autenticación, falla
     */
    public function test_sin_autenticacion_falla()
    {
        $response = $this->getJson('/api/admin/cajas/estado-general');

        $response->assertStatus(401);
    }

    /**
     * Test: Sin permiso, falla
     */
    public function test_sin_permiso_falla()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/admin/cajas/estado-general');

        $response->assertStatus(403);
    }

    /**
     * Test: Caja inexistente retorna 404
     */
    public function test_caja_inexistente_retorna_404()
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/cajas/9999/detalle');

        $response->assertStatus(404);
    }

    /**
     * Test: API retorna timestamp en ISO 8601
     */
    public function test_api_retorna_timestamp_iso8601()
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/cajas/estado-general');

        $response->assertStatus(200);
        $timestamp = $response->json('timestamp');
        $this->assertTrue(strtotime($timestamp) !== false);
    }

    /**
     * Test: Estadísticas con cajas cerradas correctamente
     */
    public function test_estadisticas_con_cajas_cerradas()
    {
        $apertura = AperturaCaja::factory()->create([
            'caja_id' => $this->caja->id,
            'user_id' => $this->chofer->id,
            'fecha' => now(),
        ]);

        CierreCaja::factory()->create([
            'caja_id' => $this->caja->id,
            'apertura_caja_id' => $apertura->id,
            'user_id' => $this->chofer->id,
            'fecha_cierre' => now(),
            'diferencia' => 50,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/cajas/estadisticas');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.cierres_hoy'));
    }
}
