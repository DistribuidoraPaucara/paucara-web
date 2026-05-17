<?php
namespace Tests\Feature;

use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoPreciosSimpleTest extends TestCase
{
    use RefreshDatabase;

    public function test_precios_se_guardan_correctamente_desde_frontend()
    {
        // Autenticar usuario
        $user = User::factory()->create();
        $this->actingAs($user);

        // Usar tipos de precio existentes
        $tipoCosto = TipoPrecio::where('codigo', 'COSTO')->first();
        $tipoVenta = TipoPrecio::where('codigo', 'VENTA')->first();

        // Si no existen, usar cualquiera de los que estén disponibles
        if (! $tipoCosto || ! $tipoVenta) {
            $tiposDisponibles = TipoPrecio::where('activo', true)->take(2)->get();
            $tipoCosto        = $tiposDisponibles[0] ?? TipoPrecio::factory()->create();
            $tipoVenta        = $tiposDisponibles[1] ?? TipoPrecio::factory()->create();
        }

        $datos = [
            'nombre'      => 'Producto Test Simple',
            'descripcion' => 'Descripción del producto',
            'activo'      => true,
            'precios'     => [
                [
                    'monto'          => 10.50,
                    'tipo_precio_id' => $tipoCosto->id,
                ],
                [
                    'monto'          => 15.75,
                    'tipo_precio_id' => $tipoVenta->id,
                ],
            ],
        ];

        // Usar from() y post() para simular una petición con referer válido
        $response = $this
            ->from(route('productos.create'))
            ->post(route('productos.store'), $datos);

        // Verificar que no hay errores de validación
        $response->assertSessionHasNoErrors();

        // Verificar que redirige correctamente
        $response->assertRedirect();

        // Verificar que el producto se creó
        $this->assertDatabaseHas('productos', [
            'nombre' => 'Producto Test Simple',
        ]);

        // Verificar que se crearon los precios
        $producto = Producto::where('nombre', 'Producto Test Simple')->first();

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 10.50,
            'tipo_precio_id' => $tipoCosto->id,
            'activo'         => true,
        ]);

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 15.75,
            'tipo_precio_id' => $tipoVenta->id,
            'activo'         => true,
        ]);

        // Verificar que el producto tiene exactamente 2 precios activos
        $this->assertEquals(2, $producto->precios()->where('activo', true)->count());

        // Verificar que los nombres se generaron automáticamente
        $this->assertEquals($tipoCosto->nombre, $producto->precios()->where('tipo_precio_id', $tipoCosto->id)->first()->nombre);
        $this->assertEquals($tipoVenta->nombre, $producto->precios()->where('tipo_precio_id', $tipoVenta->id)->first()->nombre);
    }

    public function test_puede_actualizar_precios_desde_frontend()
    {
        // Autenticar usuario
        $user = User::factory()->create();
        $this->actingAs($user);

        // Usar tipos de precio existentes
        $tipoCosto = TipoPrecio::where('codigo', 'COSTO')->first();
        $tipoVenta = TipoPrecio::where('codigo', 'VENTA')->first();

        // Si no existen, usar cualquiera de los que estén disponibles
        if (! $tipoCosto || ! $tipoVenta) {
            $tiposDisponibles = TipoPrecio::where('activo', true)->take(2)->get();
            $tipoCosto        = $tiposDisponibles[0] ?? TipoPrecio::factory()->create();
            $tipoVenta        = $tiposDisponibles[1] ?? TipoPrecio::factory()->create();
        }

        // Crear producto primero
        $producto = Producto::create([
            'nombre'      => 'Producto Update Test',
            'descripcion' => 'Producto para test de actualización',
            'activo'      => true,
        ]);

        // Crear precios iniciales
        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'nombre'         => $tipoCosto->nombre,
            'precio'         => 5.00,
            'tipo_precio_id' => $tipoCosto->id,
            'activo'         => true,
            'es_precio_base' => $tipoCosto->es_precio_base,
        ]);

        PrecioProducto::create([
            'producto_id'    => $producto->id,
            'nombre'         => $tipoVenta->nombre,
            'precio'         => 8.00,
            'tipo_precio_id' => $tipoVenta->id,
            'activo'         => true,
            'es_precio_base' => $tipoVenta->es_precio_base,
        ]);

        // Datos de actualización
        $datosUpdate = [
            'nombre'      => 'Producto Update Test',
            'descripcion' => 'Producto para test de actualización',
            'activo'      => true,
            'precios'     => [
                [
                    'monto'          => 12.50,
                    'tipo_precio_id' => $tipoCosto->id,
                ],
                [
                    'monto'          => 18.75,
                    'tipo_precio_id' => $tipoVenta->id,
                ],
            ],
        ];

        // Actualizar producto
        $response = $this
            ->from(route('productos.edit', $producto))
            ->put(route('productos.update', $producto), $datosUpdate);

        // Verificar que no hay errores de validación
        $response->assertSessionHasNoErrors();

        // Verificar que redirige correctamente
        $response->assertRedirect();

        // Verificar que los precios se actualizaron
        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 12.50,
            'tipo_precio_id' => $tipoCosto->id,
            'activo'         => true,
        ]);

        $this->assertDatabaseHas('precios_producto', [
            'producto_id'    => $producto->id,
            'precio'         => 18.75,
            'tipo_precio_id' => $tipoVenta->id,
            'activo'         => true,
        ]);

        // Verificar que el producto aún tiene exactamente 2 precios activos
        $this->assertEquals(2, $producto->precios()->where('activo', true)->count());
    }
}
