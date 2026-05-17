<?php
namespace Tests\Feature;

use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductoSimpleTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_producto_con_precios()
    {
        // Crear tipos de precio
        $tipoPrecio = TipoPrecio::create([
            'nombre'         => 'Test Precio',
            'codigo'         => 'TEST_' . time(),
            'orden'          => 1,
            'activo'         => true,
            'descripcion'    => 'Precio de test',
            'color'          => 'blue',
            'es_ganancia'    => false,
            'es_precio_base' => true,
        ]);

        // Crear producto
        $producto = Producto::create([
            'nombre' => 'Producto Test',
            'activo' => true,
        ]);

        // Crear precio
        $precio = PrecioProducto::create([
            'producto_id'    => $producto->id,
            'tipo_precio_id' => $tipoPrecio->id,
            'nombre'         => 'Precio Test',
            'precio'         => 25.99,
            'activo'         => true,
        ]);

        // Verificar que se crearon correctamente
        $this->assertDatabaseHas('productos', ['nombre' => 'Producto Test']);
        $this->assertDatabaseHas('precios_producto', [
            'producto_id' => $producto->id,
            'precio'      => 25.99,
        ]);

        // Verificar que el producto tiene precios
        $productoConPrecios = Producto::with('precios')->find($producto->id);
        $this->assertCount(1, $productoConPrecios->precios);
        $this->assertEquals(25.99, $productoConPrecios->precios->first()->precio);
    }
}
