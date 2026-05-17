<?php
namespace Tests\Feature;

use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoEditFormPreciosTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario y autenticarlo
        $user = User::factory()->create();
        $this->actingAs($user);
    }

    public function test_formulario_edicion_carga_precios_correctamente()
    {
        // Crear tipos de precio directamente con códigos únicos
        $tipoPrecioCosto = TipoPrecio::create([
            'nombre'         => 'Precio de Costo Test',
            'codigo'         => 'COSTO_TEST',
            'orden'          => 1,
            'activo'         => true,
            'descripcion'    => 'Precio de costo del producto',
            'color'          => 'blue',
            'es_ganancia'    => false,
            'es_precio_base' => true,
        ]);

        $tipoPrecioVenta = TipoPrecio::create([
            'nombre'         => 'Precio de Venta Test',
            'codigo'         => 'VENTA_TEST',
            'orden'          => 2,
            'activo'         => true,
            'descripcion'    => 'Precio de venta al público',
            'color'          => 'green',
            'es_ganancia'    => true,
            'es_precio_base' => false,
        ]);

        // Crear producto directamente
        $producto = Producto::create([
            'nombre' => 'Producto Test',
            'activo' => true,
        ]);

        // Crear precios para el producto
        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'tipo_precio_id' => $tipoPrecioCosto->id,
            'nombre'         => 'Precio Costo',
            'precio'         => 10.50,
            'es_precio_base' => true,
            'activo'         => true,
        ]);

        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'tipo_precio_id' => $tipoPrecioVenta->id,
            'nombre'         => 'Precio Venta',
            'precio'         => 15.75,
            'es_precio_base' => false,
            'activo'         => true,
        ]);

        // Hacer petición al formulario de edición
        $response = $this->get(route('productos.edit', $producto));

        // Verificar que la respuesta sea exitosa
        $response->assertSuccessful();

        // Verificar que los precios estén en el formato correcto
        $response->assertInertia(fn($page) => $page
                ->component('productos/form')
                ->has('producto.precios', 2)
                ->where('producto.precios.0.monto', 10.5)
                ->where('producto.precios.0.tipo_precio_id', $tipoPrecioCosto->id)
                ->where('producto.precios.1.monto', 15.75)
                ->where('producto.precios.1.tipo_precio_id', $tipoPrecioVenta->id)
                ->has('producto.precios.0.id')
                ->has('producto.precios.1.id')
        );
    }

    public function test_formulario_edicion_producto_sin_precios()
    {
        // Crear producto sin precios directamente
        $producto = Producto::create([
            'nombre' => 'Producto Sin Precios',
            'activo' => true,
        ]);

        // Hacer petición al formulario de edición
        $response = $this->get(route('productos.edit', $producto));

        // Verificar que la respuesta sea exitosa
        $response->assertSuccessful();

        // Verificar que el array de precios esté vacío
        $response->assertInertia(fn($page) => $page
                ->component('productos/form')
                ->has('producto.precios', 0)
        );
    }

    public function test_estructura_precio_contiene_campos_requeridos()
    {
        // Crear tipo de precio directamente
        $tipoPrecio = TipoPrecio::create([
            'nombre'         => 'Precio Test',
            'codigo'         => 'TEST',
            'activo'         => true,
            'descripcion'    => 'Precio de test',
            'color'          => 'gray',
            'es_ganancia'    => false,
            'es_precio_base' => false,
        ]);

        // Crear producto directamente
        $producto = Producto::create([
            'nombre' => 'Producto Test',
            'activo' => true,
        ]);

        // Crear precio
        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'tipo_precio_id' => $tipoPrecio->id,
            'nombre'         => 'Precio Test',
            'precio'         => 25.99,
            'activo'         => true,
        ]);

        // Hacer petición al formulario de edición
        $response = $this->get(route('productos.edit', $producto));

        // Verificar estructura específica del precio
        $response->assertInertia(fn($page) => $page
                ->component('productos/form')
                ->has('producto.precios', 1)
                ->has('producto.precios.0', fn($precio) => $precio
                        ->has('id')
                        ->has('monto')
                        ->has('tipo_precio_id')
                        ->where('monto', 25.99)
                        ->where('tipo_precio_id', $tipoPrecio->id)
                        ->missing('nombre') // No debe incluir campos extra
                        ->missing('tipo_precio_info')
                        ->missing('margen_ganancia')
                )
        );
    }
}
