<?php
namespace Tests\Unit;

use App\Http\Controllers\ProductoController;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class ProductoPreciosGuardadoUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_controller_store_guarda_precios_correctamente()
    {
        // Crear y autenticar usuario
        $user = User::factory()->create();
        $this->actingAs($user);

        // Usar tipos de precio existentes o obtener cualquiera disponible
        $tiposDisponibles = TipoPrecio::where('activo', true)->take(2)->get();

        if ($tiposDisponibles->count() < 2) {
            // Si no hay suficientes tipos, crear algunos para el test
            $tipoCosto = TipoPrecio::create([
                'nombre'         => 'Precio Test 1',
                'codigo'         => 'TEST1',
                'orden'          => 1,
                'activo'         => true,
                'descripcion'    => 'Precio de test 1',
                'color'          => 'blue',
                'es_ganancia'    => false,
                'es_precio_base' => true,
            ]);

            $tipoVenta = TipoPrecio::create([
                'nombre'         => 'Precio Test 2',
                'codigo'         => 'TEST2',
                'orden'          => 2,
                'activo'         => true,
                'descripcion'    => 'Precio de test 2',
                'color'          => 'green',
                'es_ganancia'    => true,
                'es_precio_base' => false,
            ]);
        } else {
            $tipoCosto = $tiposDisponibles[0];
            $tipoVenta = $tiposDisponibles[1];
        }

        $datos = [
            'nombre'      => 'Producto Unit Test',
            'descripcion' => 'Descripción del producto unit test',
            'activo'      => true,
            'precios'     => [
                [
                    'monto'          => 25.50,
                    'tipo_precio_id' => $tipoCosto->id,
                ],
                [
                    'monto'          => 35.75,
                    'tipo_precio_id' => $tipoVenta->id,
                ],
            ],
        ];

        // Crear request mock
        $request = new Request($datos);

        // Instanciar controlador y llamar al método store
        $controller = new ProductoController();
        $response   = $controller->store($request);

        // Verificar que el producto se creó
        $this->assertDatabaseHas('productos', [
            'nombre' => 'Producto Unit Test',
        ]);

        // Obtener el producto creado
        $producto = Producto::where('nombre', 'Producto Unit Test')->first();
        $this->assertNotNull($producto);

        // Verificar que se crearon los precios correctos
        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 25.50,
            'tipo_precio_id' => $tipoCosto->id,
            'activo'         => true,
        ]);

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 35.75,
            'tipo_precio_id' => $tipoVenta->id,
            'activo'         => true,
        ]);

        // Verificar que el producto tiene exactamente 2 precios activos
        $this->assertEquals(2, $producto->precios()->where('activo', true)->count());

        // Verificar que los nombres se generaron automáticamente usando el TipoPrecio
        $preciosCosto = $producto->precios()->where('tipo_precio_id', $tipoCosto->id)->first();
        $preciosVenta = $producto->precios()->where('tipo_precio_id', $tipoVenta->id)->first();

        $this->assertEquals($tipoCosto->nombre, $preciosCosto->nombre);
        $this->assertEquals($tipoVenta->nombre, $preciosVenta->nombre);

        // Verificar que la respuesta es una redirección
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    public function test_controller_update_actualiza_precios_correctamente()
    {
        // Crear y autenticar usuario
        $user = User::factory()->create();
        $this->actingAs($user);

        // Usar tipos de precio disponibles
        $tiposDisponibles = TipoPrecio::where('activo', true)->take(2)->get();

        if ($tiposDisponibles->count() < 2) {
            // Si no hay suficientes tipos, crear algunos para el test
            $tipoCosto = TipoPrecio::create([
                'nombre'         => 'Precio Test Update 1',
                'codigo'         => 'TESTUPD1',
                'orden'          => 1,
                'activo'         => true,
                'descripcion'    => 'Precio de test update 1',
                'color'          => 'blue',
                'es_ganancia'    => false,
                'es_precio_base' => true,
            ]);

            $tipoVenta = TipoPrecio::create([
                'nombre'         => 'Precio Test Update 2',
                'codigo'         => 'TESTUPD2',
                'orden'          => 2,
                'activo'         => true,
                'descripcion'    => 'Precio de test update 2',
                'color'          => 'green',
                'es_ganancia'    => true,
                'es_precio_base' => false,
            ]);
        } else {
            $tipoCosto = $tiposDisponibles[0];
            $tipoVenta = $tiposDisponibles[1];
        }

        // Crear producto inicial
        $producto = Producto::create([
            'nombre'      => 'Producto Update Unit Test',
            'descripcion' => 'Producto para test de actualización unitario',
            'activo'      => true,
        ]);

        // Crear precios iniciales
        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'nombre'         => $tipoCosto->nombre,
            'precio'         => 10.00,
            'tipo_precio_id' => $tipoCosto->id,
            'activo'         => true,
            'es_precio_base' => $tipoCosto->es_precio_base,
        ]);

        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'nombre'         => $tipoVenta->nombre,
            'precio'         => 15.00,
            'tipo_precio_id' => $tipoVenta->id,
            'activo'         => true,
            'es_precio_base' => $tipoVenta->es_precio_base,
        ]);

        // Datos de actualización con todos los campos requeridos
        $datosUpdate = [
            'nombre'                   => 'Producto Update Unit Test',
            'descripcion'              => 'Producto para test de actualización unitario',
            'activo'                   => true,
            'peso'                     => 1.5,
            'stock_minimo'             => 0,
            'stock_maximo'             => 100,
            'controlar_stock'          => true,
            'permitir_venta_sin_stock' => false,
            'precios'                  => [
                [
                    'monto'          => 20.50,
                    'tipo_precio_id' => $tipoCosto->id,
                ],
                [
                    'monto'          => 30.75,
                    'tipo_precio_id' => $tipoVenta->id,
                ],
            ],
        ];

        // Crear request mock para update
        $request = new Request($datosUpdate);

        // Instanciar controlador y llamar al método update
        $controller = new ProductoController();
        $response   = $controller->update($request, $producto);

        // Verificar que los precios se actualizaron correctamente
        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 20.50,
            'tipo_precio_id' => $tipoCosto->id,
            'activo'         => true,
        ]);

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 30.75,
            'tipo_precio_id' => $tipoVenta->id,
            'activo'         => true,
        ]);

        // Verificar que el producto aún tiene exactamente 2 precios activos
        $this->assertEquals(2, $producto->precios()->where('activo', true)->count());

        // Verificar que la respuesta es una redirección
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    public function test_precio_nombre_se_genera_automaticamente_desde_tipo_precio()
    {
        // Crear y autenticar usuario
        $user = User::factory()->create();
        $this->actingAs($user);

        // Crear un tipo de precio específico para este test
        $tipoEspecial = TipoPrecio::create([
            'nombre'         => 'Precio Especial Test',
            'codigo'         => 'ESPECIAL_TEST',
            'orden'          => 1,
            'activo'         => true,
            'descripcion'    => 'Precio especial para test',
            'color'          => 'purple',
            'es_ganancia'    => false,
            'es_precio_base' => true,
        ]);

        $datos = [
            'nombre'      => 'Producto Nombre Auto Test',
            'descripcion' => 'Test de auto-generación de nombres',
            'activo'      => true,
            'precios'     => [
                [
                    'monto'          => 100.00,
                    'tipo_precio_id' => $tipoEspecial->id,
                    // Note: NO enviamos 'nombre' - debe auto-generarse
                ],
            ],
        ];

        // Crear request mock
        $request = new Request($datos);

        // Instanciar controlador y llamar al método store
        $controller = new ProductoController();
        $response   = $controller->store($request);

        // Obtener el producto creado
        $producto = Producto::where('nombre', 'Producto Nombre Auto Test')->first();
        $this->assertNotNull($producto);

        // Verificar que el precio se creó con el nombre correcto auto-generado
        $precioCreado = $producto->precios()->where('tipo_precio_id', $tipoEspecial->id)->first();

        $this->assertNotNull($precioCreado);
        $this->assertEquals('Precio Especial Test', $precioCreado->nombre);
        $this->assertEquals(100.00, $precioCreado->precio);
        $this->assertTrue($precioCreado->activo);
    }
}
