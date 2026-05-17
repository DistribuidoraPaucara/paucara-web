<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class VentasStockApiDebugTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear un usuario para las pruebas
        try {
            $this->user = User::factory()->create();
        } catch (\Exception $e) {
            $this->user = new User;
            $this->user->id = 1;
        }
    }

    public function test_debug_verificar_stock_response()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas/verificar-stock', [
                'productos' => [],
                'almacen_id' => 1,
            ]);

        echo "\nVerificar Stock - Status: ".$response->status();
        echo "\nResponse: ".$response->getContent();

        // Solo verificar que no sea 404 (ruta no encontrada)
        $this->assertNotEquals(404, $response->status());
    }

    public function test_debug_obtener_stock_producto_response()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/ventas/1/stock');

        echo "\nObtener Stock Producto - Status: ".$response->status();
        echo "\nResponse: ".$response->getContent();

        // Solo verificar que no sea 404 (ruta no encontrada)
        $this->assertNotEquals(404, $response->status());
    }

    public function test_debug_productos_stock_bajo_response()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/ventas/productos/stock-bajo');

        echo "\nProductos Stock Bajo - Status: ".$response->status();
        echo "\nResponse: ".$response->getContent();

        // Solo verificar que no sea 404 (ruta no encontrada)
        $this->assertNotEquals(404, $response->status());
    }
}
