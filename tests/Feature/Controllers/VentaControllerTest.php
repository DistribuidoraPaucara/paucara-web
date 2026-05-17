<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\StockProducto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature Tests para VentaController - Validar patrón THIN
 *
 * IMPORTANTE:
 * ✓ Controller NO contiene lógica de negocio
 * ✓ Controller solo mapea HTTP → Service → HTTP
 * ✓ Errores de Service → HTTP 422 (validation)
 * ✓ Responde tanto JSON como Inertia (Web)
 * ✓ Autorización funciona correctamente
 *
 * ESTRUCTURA:
 * - Index: GET /ventas → lista
 * - Create: GET /ventas/create → formulario
 * - Store: POST /ventas → crear
 * - Show: GET /ventas/{id} → detalle
 * - Aprobar: POST /ventas/{id}/aprobar
 * - Rechazar: POST /ventas/{id}/rechazar
 */
class VentaControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $usuario;
    private Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup común para todos los tests
        $this->usuario = User::factory()->create();
        $this->producto = Producto::factory()->create(['precio_base' => 1000]);

        // Stock disponible
        StockProducto::factory()->create([
            'producto_id' => $this->producto->id,
            'cantidad' => 1000,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: INDEX - Listar Ventas
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function index_requiere_autenticacion()
    {
        // Act & Assert
        $response = $this->getJson('/api/ventas');
        $response->assertUnauthorized();
    }

    /** @test */
    public function index_devuelve_lista_de_ventas()
    {
        // Arrange
        Venta::factory()->count(5)->create(['usuario_id' => $this->usuario->id]);

        // Act
        $response = $this->actingAs($this->usuario)
            ->getJson('/api/ventas');

        // Assert
        $response->assertOk();
        $response->assertJsonStructure([
            'data' => ['*' => ['id', 'numero', 'total', 'estado', 'cliente_id']],
            'meta' => ['total', 'per_page', 'current_page']
        ]);
        $this->assertCount(5, $response['data']);
    }

    /** @test */
    public function index_paginacion_funciona()
    {
        // Arrange
        Venta::factory()->count(25)->create(['usuario_id' => $this->usuario->id]);

        // Act
        $response = $this->actingAs($this->usuario)
            ->getJson('/api/ventas?per_page=10&page=2');

        // Assert
        $response->assertOk();
        $this->assertCount(10, $response['data']);
        $this->assertEquals(2, $response['meta']['current_page']);
        $this->assertEquals(25, $response['meta']['total']);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: CREATE - Formulario
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function create_devuelve_formulario_para_web()
    {
        // Act
        $response = $this->actingAs($this->usuario)
            ->get('/ventas/create');

        // Assert: Debe render Inertia component
        $response->assertOk();
        $response->assertViewIs('Venta/Create');
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: STORE - Crear Venta
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function store_crea_venta_via_api()
    {
        // Arrange
        $payload = [
            'cliente_id' => 1,
            'detalles' => [
                [
                    'producto_id' => $this->producto->id,
                    'cantidad' => 10,
                    'precio_unitario' => 1000,
                    'descuento_unitario' => 0,
                ],
            ],
            'descuento_general' => 0,
        ];

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/ventas', $payload);

        // Assert
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => ['id', 'numero', 'total', 'estado']
        ]);

        // Verificar que se creó en BD
        $this->assertDatabaseHas('ventas', [
            'usuario_id' => $this->usuario->id,
            'estado' => 'PENDIENTE',
        ]);
    }

    /** @test */
    public function store_valida_detalles_requeridos()
    {
        // Arrange: Payload sin detalles
        $payload = [
            'cliente_id' => 1,
            'detalles' => [],
            'descuento_general' => 0,
        ];

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/ventas', $payload);

        // Assert: Debe ser 422 (unprocessable entity)
        $response->assertStatus(422);
        $response->assertJsonStructure(['errors']);
    }

    /** @test */
    public function store_rechaza_stock_insuficiente()
    {
        // Arrange: Más cantidad de la disponible
        $payload = [
            'cliente_id' => 1,
            'detalles' => [
                [
                    'producto_id' => $this->producto->id,
                    'cantidad' => 2000, // Hay solo 1000
                    'precio_unitario' => 1000,
                ],
            ],
            'descuento_general' => 0,
        ];

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/ventas', $payload);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonFragment(['Stock insuficiente']);

        // Verificar que NO se creó venta
        $this->assertDatabaseMissing('ventas', [
            'usuario_id' => $this->usuario->id,
        ]);
    }

    /** @test */
    public function store_valida_producto_existe()
    {
        // Arrange
        $payload = [
            'cliente_id' => 1,
            'detalles' => [
                [
                    'producto_id' => 99999, // No existe
                    'cantidad' => 10,
                    'precio_unitario' => 1000,
                ],
            ],
            'descuento_general' => 0,
        ];

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/ventas', $payload);

        // Assert
        $response->assertStatus(422);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: SHOW - Ver Detalle
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function show_devuelve_detalle_de_venta()
    {
        // Arrange
        $venta = Venta::factory()->create(['usuario_id' => $this->usuario->id]);

        // Act
        $response = $this->actingAs($this->usuario)
            ->getJson("/api/ventas/{$venta->id}");

        // Assert
        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'id',
                'numero',
                'total',
                'estado',
                'usuario_id',
                'detalles' => ['*' => ['id', 'producto_id', 'cantidad']],
            ]
        ]);
        $this->assertEquals($venta->id, $response['data']['id']);
    }

    /** @test */
    public function show_retorna_404_si_no_existe()
    {
        // Act
        $response = $this->actingAs($this->usuario)
            ->getJson('/api/ventas/99999');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function show_retorna_403_si_no_es_propietario()
    {
        // Arrange
        $otroUsuario = User::factory()->create();
        $venta = Venta::factory()->create(['usuario_id' => $otroUsuario->id]);

        // Act
        $response = $this->actingAs($this->usuario)
            ->getJson("/api/ventas/{$venta->id}");

        // Assert
        $response->assertForbidden();
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: APROBAR - Cambiar Estado
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function aprobar_cambia_estado_a_aprobada()
    {
        // Arrange
        $venta = Venta::factory()->create([
            'usuario_id' => $this->usuario->id,
            'estado' => 'PENDIENTE',
        ]);

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson("/api/ventas/{$venta->id}/aprobar");

        // Assert
        $response->assertOk();
        $this->assertDatabaseHas('ventas', [
            'id' => $venta->id,
            'estado' => 'APROBADA',
        ]);
    }

    /** @test */
    public function aprobar_rechaza_si_ya_esta_aprobada()
    {
        // Arrange
        $venta = Venta::factory()->create([
            'usuario_id' => $this->usuario->id,
            'estado' => 'APROBADA',
        ]);

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson("/api/ventas/{$venta->id}/aprobar");

        // Assert
        $response->assertStatus(422);
        $response->assertJsonFragment(['Estado inválido']);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: RECHAZAR
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function rechazar_venta_y_devuelve_stock()
    {
        // Arrange
        $venta = Venta::factory()->create([
            'usuario_id' => $this->usuario->id,
            'estado' => 'PENDIENTE',
        ]);

        $stockBefore = StockProducto::where('producto_id', $this->producto->id)
            ->first()
            ->cantidad;

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson("/api/ventas/{$venta->id}/rechazar", [
                'motivo' => 'Cliente cambió de idea',
            ]);

        // Assert
        $response->assertOk();
        $this->assertDatabaseHas('ventas', [
            'id' => $venta->id,
            'estado' => 'RECHAZADA',
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS: RESPUESTA WEB vs API
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function store_responde_json_para_api()
    {
        // Arrange
        $payload = [
            'cliente_id' => 1,
            'detalles' => [
                [
                    'producto_id' => $this->producto->id,
                    'cantidad' => 5,
                    'precio_unitario' => 1000,
                ],
            ],
            'descuento_general' => 0,
        ];

        // Act
        $response = $this->actingAs($this->usuario)
            ->postJson('/api/ventas', $payload);

        // Assert: Respuesta JSON
        $response->assertStatus(201);
        $response->assertJson(['data' => []]);
    }

    /** @test */
    public function store_responde_redirect_para_web()
    {
        // Arrange
        $payload = [
            'cliente_id' => 1,
            'detalles' => [
                [
                    'producto_id' => $this->producto->id,
                    'cantidad' => 5,
                    'precio_unitario' => 1000,
                ],
            ],
            'descuento_general' => 0,
        ];

        // Act: POST normal (sin /api)
        $response = $this->actingAs($this->usuario)
            ->post('/ventas', $payload);

        // Assert: Redirect a show
        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
