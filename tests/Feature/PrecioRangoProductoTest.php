<?php

namespace Tests\Feature;

use App\Models\Producto;
use App\Models\PrecioProducto;
use App\Models\PrecioRangoCantidadProducto;
use App\Models\TipoPrecio;
use App\Models\User;
use App\Services\Venta\PrecioRangoProductoService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrecioRangoProductoTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Producto $producto;
    protected TipoPrecio $tipoNormal;
    protected TipoPrecio $tipoDescuento;
    protected TipoPrecio $tipoEspecial;
    protected PrecioRangoProductoService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(PrecioRangoProductoService::class);

        // Crear usuario
        $this->user = User::factory()->create([
            'empresa_id' => 1,
        ]);

        // Crear tipos de precio
        $this->tipoNormal = TipoPrecio::create([
            'codigo' => 'VENTA_NORMAL',
            'nombre' => 'Venta Normal',
            'es_ganancia' => true,
            'orden' => 1,
            'activo' => true,
        ]);

        $this->tipoDescuento = TipoPrecio::create([
            'codigo' => 'DESCUENTO',
            'nombre' => 'Descuento',
            'es_ganancia' => true,
            'orden' => 2,
            'activo' => true,
        ]);

        $this->tipoEspecial = TipoPrecio::create([
            'codigo' => 'ESPECIAL',
            'nombre' => 'Especial',
            'es_ganancia' => true,
            'orden' => 3,
            'activo' => true,
        ]);

        // Crear producto
        $this->producto = Producto::create([
            'nombre' => 'PEPSI 250ML TEST',
            'sku' => 'PEPSI-250-TEST',
            'categoria_id' => 1,
            'activo' => true,
        ]);

        // Crear precios
        PrecioProducto::create([
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoNormal->id,
            'nombre' => 'Precio Normal',
            'precio' => 10.00,
            'activo' => true,
        ]);

        PrecioProducto::create([
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoDescuento->id,
            'nombre' => 'Precio Descuento',
            'precio' => 8.50,
            'activo' => true,
        ]);

        PrecioProducto::create([
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoEspecial->id,
            'nombre' => 'Precio Especial',
            'precio' => 7.00,
            'activo' => true,
        ]);

        // Crear rangos
        PrecioRangoCantidadProducto::create([
            'empresa_id' => 1,
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoNormal->id,
            'cantidad_minima' => 1,
            'cantidad_maxima' => 9,
            'activo' => true,
        ]);

        PrecioRangoCantidadProducto::create([
            'empresa_id' => 1,
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoDescuento->id,
            'cantidad_minima' => 10,
            'cantidad_maxima' => 49,
            'activo' => true,
        ]);

        PrecioRangoCantidadProducto::create([
            'empresa_id' => 1,
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoEspecial->id,
            'cantidad_minima' => 50,
            'cantidad_maxima' => null,
            'activo' => true,
        ]);
    }

    /**
     * Test: Obtener precio para cantidad en rango 1-9
     */
    public function test_obtener_precio_rango_1_a_9(): void
    {
        $precio = $this->producto->obtenerPrecioConRango(5, 1);
        $this->assertEquals(10.00, $precio);
    }

    /**
     * Test: Obtener precio para cantidad en rango 10-49
     */
    public function test_obtener_precio_rango_10_a_49(): void
    {
        $precio = $this->producto->obtenerPrecioConRango(25, 1);
        $this->assertEquals(8.50, $precio);
    }

    /**
     * Test: Obtener precio para cantidad en rango 50+
     */
    public function test_obtener_precio_rango_50_mas(): void
    {
        $precio = $this->producto->obtenerPrecioConRango(100, 1);
        $this->assertEquals(7.00, $precio);
    }

    /**
     * Test: Obtener detalles completos de precio con rango y ahorro próximo
     */
    public function test_obtener_precio_con_detalles_rango(): void
    {
        $detalles = $this->producto->obtenerPrecioConDetallesRango(15, 1);

        $this->assertEquals(8.50, $detalles['precio_unitario']);
        $this->assertEquals(127.50, $detalles['subtotal']);
        $this->assertNotNull($detalles['rango_aplicado']);
        $this->assertEquals('10-49', $detalles['rango_aplicado']['cantidad_minima'] . '-' . $detalles['rango_aplicado']['cantidad_maxima']);
        $this->assertNotNull($detalles['proximo_rango']);
        $this->assertEquals(50, $detalles['proximo_rango']['cantidad_minima']);
        $this->assertEquals(35, $detalles['proximo_rango']['falta_cantidad']);
        $this->assertEquals(75.00, $detalles['ahorro_proximo']);
    }

    /**
     * Test: Calcular carrito completo con múltiples productos y rangos
     */
    public function test_calcular_carrito_con_rangos(): void
    {
        $carrito = [
            ['producto_id' => $this->producto->id, 'cantidad' => 5],
            ['producto_id' => $this->producto->id, 'cantidad' => 15],
            ['producto_id' => $this->producto->id, 'cantidad' => 75],
        ];

        $resultado = $this->service->calcularCarrito($carrito, 1);

        // 5*10 + 15*8.5 + 75*7 = 50 + 127.5 + 525 = 702.5
        $this->assertEquals(702.50, $resultado['total']);
        $this->assertEquals(3, $resultado['cantidad_items']);
        $this->assertCount(3, $resultado['detalles']);
    }

    /**
     * Test: Validar integridad de rangos sin solapamiento
     */
    public function test_validar_integridad_rangos_validos(): void
    {
        $validacion = $this->service->validarIntegridad($this->producto, 1);

        $this->assertTrue($validacion['es_valido']);
        $this->assertEmpty($validacion['problemas']);
        $this->assertEquals(3, $validacion['cantidad_rangos']);
    }

    /**
     * Test: Detección de solapamiento de rangos
     */
    public function test_validar_solapamiento_rangos(): void
    {
        // Crear rango que se solapa
        PrecioRangoCantidadProducto::create([
            'empresa_id' => 1,
            'producto_id' => $this->producto->id,
            'tipo_precio_id' => $this->tipoNormal->id,
            'cantidad_minima' => 5,
            'cantidad_maxima' => 15,
            'activo' => true,
        ]);

        $validacion = $this->service->validarIntegridad($this->producto, 1);

        $this->assertFalse($validacion['es_valido']);
        $this->assertNotEmpty($validacion['problemas']);
    }

    /**
     * Test: Crear nuevo rango
     */
    public function test_crear_rango(): void
    {
        $producto2 = Producto::create([
            'nombre' => 'PEPSI 500ML TEST',
            'sku' => 'PEPSI-500-TEST',
            'categoria_id' => 1,
            'activo' => true,
        ]);

        PrecioProducto::create([
            'producto_id' => $producto2->id,
            'tipo_precio_id' => $this->tipoNormal->id,
            'nombre' => 'Precio Normal',
            'precio' => 15.00,
            'activo' => true,
        ]);

        $rango = $this->service->crearRango(
            $producto2,
            1,
            9,
            $this->tipoNormal,
            1
        );

        $this->assertNotNull($rango->id);
        $this->assertEquals(1, $rango->cantidad_minima);
        $this->assertEquals(9, $rango->cantidad_maxima);
    }

    /**
     * Test: Desactivar rango
     */
    public function test_desactivar_rango(): void
    {
        $rango = PrecioRangoCantidadProducto::first();

        $this->service->desactivarRango($rango);

        $rango->refresh();
        $this->assertFalse($rango->activo);
    }

    /**
     * Test: API - Obtener rangos de producto
     */
    public function test_api_obtener_rangos(): void
    {
        $this->actingAs($this->user)
            ->getJson("/api/productos/{$this->producto->id}/rangos-precio")
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    /**
     * Test: API - Crear rango
     */
    public function test_api_crear_rango(): void
    {
        $producto2 = Producto::create([
            'nombre' => 'GUARANA 500ML',
            'sku' => 'GUARANA-500',
            'categoria_id' => 1,
            'activo' => true,
        ]);

        PrecioProducto::create([
            'producto_id' => $producto2->id,
            'tipo_precio_id' => $this->tipoNormal->id,
            'nombre' => 'Precio',
            'precio' => 12.00,
            'activo' => true,
        ]);

        $this->actingAs($this->user)
            ->postJson("/api/productos/{$producto2->id}/rangos-precio", [
                'cantidad_minima' => 1,
                'cantidad_maxima' => 9,
                'tipo_precio_id' => $this->tipoNormal->id,
            ])
            ->assertStatus(201)
            ->assertJsonPath('success', true);
    }

    /**
     * Test: API - Calcular precio
     */
    public function test_api_calcular_precio(): void
    {
        $this->actingAs($this->user)
            ->postJson("/api/productos/{$this->producto->id}/calcular-precio", [
                'cantidad' => 20,
            ])
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.precio_unitario', 8.50);
    }

    /**
     * Test: API - Validar integridad
     */
    public function test_api_validar_integridad(): void
    {
        $this->actingAs($this->user)
            ->getJson("/api/productos/{$this->producto->id}/rangos-precio/validar")
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.es_valido', true)
            ->assertJsonPath('data.cantidad_rangos', 3);
    }

    /**
     * Test: API - Calcular carrito
     */
    public function test_api_calcular_carrito(): void
    {
        $this->actingAs($this->user)
            ->postJson('/api/carrito/calcular', [
                'items' => [
                    ['producto_id' => $this->producto->id, 'cantidad' => 5],
                    ['producto_id' => $this->producto->id, 'cantidad' => 50],
                ],
            ])
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.cantidad_items', 2)
            ->assertJsonPath('data.total', 400.00); // 5*10 + 50*7
    }
}
