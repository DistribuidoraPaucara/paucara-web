<?php
namespace Tests\Feature;

use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoPreciosGuardadoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario y autenticarlo
        $user = User::factory()->create();
        $this->actingAs($user);

        // Crear tipos de precio necesarios
        TipoPrecio::create([
            'nombre'         => 'Precio de Costo',
            'codigo'         => 'COSTO_TEST',
            'orden'          => 1,
            'activo'         => true,
            'descripcion'    => 'Precio de costo del producto',
            'color'          => 'blue',
            'es_ganancia'    => false,
            'es_precio_base' => true,
        ]);

        TipoPrecio::create([
            'nombre'         => 'Precio de Venta',
            'codigo'         => 'VENTA_TEST',
            'orden'          => 2,
            'activo'         => true,
            'descripcion'    => 'Precio de venta al público',
            'color'          => 'green',
            'es_ganancia'    => true,
            'es_precio_base' => false,
        ]);
    }

    public function test_puede_crear_producto_con_precios_desde_frontend()
    {
        // Deshabilitar CSRF específicamente para este test
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        $tiposPrecio = TipoPrecio::all();

        $datos = [
            'nombre'      => 'Producto Test Frontend',
            'descripcion' => 'Descripción del producto',
            'activo'      => true,
            'precios'     => [
                [
                    'monto'          => 10.50,
                    'tipo_precio_id' => $tiposPrecio[0]->id, // Precio de Costo
                ],
                [
                    'monto'          => 15.75,
                    'tipo_precio_id' => $tiposPrecio[1]->id, // Precio de Venta
                ],
            ],
        ];

        // Usar post normal porque esperamos una redirección
        $response = $this->post(route('productos.store'), $datos);

        // Debug: mostrar respuesta si hay errores
        if (! in_array($response->status(), [200, 201, 302])) {
            dump('Status: ' . $response->status());
            dump('Response: ' . $response->content());
        }

        $response->assertRedirect();

        // Verificar que el producto se creó
        $this->assertDatabaseHas('productos', [
            'nombre' => 'Producto Test Frontend',
        ]);

        // Verificar que se crearon los precios
        $producto = Producto::where('nombre', 'Producto Test Frontend')->first();
        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 10.50,
            'tipo_precio_id' => $tiposPrecio[0]->id,
            'activo'         => true,
        ]);

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 15.75,
            'tipo_precio_id' => $tiposPrecio[1]->id,
            'activo'         => true,
        ]);

        // Verificar que el producto tiene 2 precios
        $this->assertEquals(2, $producto->precios()->where('activo', true)->count());
    }

    public function test_puede_actualizar_precios_de_producto_existente()
    {
        $tiposPrecio = TipoPrecio::all();

        // Crear producto con precios iniciales
        $producto = Producto::create([
            'nombre' => 'Producto Inicial',
            'activo' => true,
        ]);

        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'tipo_precio_id' => $tiposPrecio[0]->id,
            'nombre'         => $tiposPrecio[0]->nombre,
            'precio'         => 5.00,
            'activo'         => true,
        ]);

        // Actualizar con nuevos precios desde frontend
        $datosActualizacion = [
            'nombre'  => 'Producto Actualizado',
            'activo'  => true,
            'precios' => [
                [
                    'monto'          => 12.00,
                    'tipo_precio_id' => $tiposPrecio[0]->id, // Precio de Costo actualizado
                ],
                [
                    'monto'          => 18.00,
                    'tipo_precio_id' => $tiposPrecio[1]->id, // Precio de Venta nuevo
                ],
            ],
        ];

        $response = $this->put(route('productos.update', $producto), $datosActualizacion);

        // Verificar que el producto se actualizó
        $this->assertDatabaseHas('productos', [
            'id'     => $producto->id,
            'nombre' => 'Producto Actualizado',
        ]);

        // Verificar que los precios se actualizaron correctamente
        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 12.00,
            'tipo_precio_id' => $tiposPrecio[0]->id,
            'activo'         => true,
        ]);

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 18.00,
            'tipo_precio_id' => $tiposPrecio[1]->id,
            'activo'         => true,
        ]);

        // Verificar que el precio anterior se desactivó
        $this->assertDatabaseHas('precios_producto', [
            'producto_id' => $producto->id,
            'precio'      => 5.00,
            'activo'      => false,
        ]);
    }

    public function test_genera_nombre_automaticamente_cuando_no_se_envia()
    {
        $tipoPrecio = TipoPrecio::first();

        $datos = [
            'nombre'  => 'Producto Sin Nombre Precio',
            'activo'  => true,
            'precios' => [
                [
                    'monto'          => 25.99,
                    'tipo_precio_id' => $tipoPrecio->id,
                    // No se envía 'nombre' para probar generación automática
                ],
            ],
        ];

        $response = $this->post(route('productos.store'), $datos);

        $producto = Producto::where('nombre', 'Producto Sin Nombre Precio')->first();

        // Verificar que se generó el nombre automáticamente usando el nombre del tipo de precio
        $this->assertDatabaseHas('precios_producto', [
            'producto_id' => $producto->id,
            'nombre'      => $tipoPrecio->nombre,
            'precio'      => 25.99,
            'activo'      => true,
        ]);
    }
}
