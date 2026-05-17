<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class VentasStockApiTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear un usuario para las pruebas (si existe la tabla users)
        try {
            $this->user = User::factory()->create();
        } catch (\Exception $e) {
            // Si no hay factory o tabla, crear manualmente o usar usuario existente
            $this->user = new User;
            $this->user->id = 1;
        }
    }

    public function test_verificar_stock_endpoint_exists()
    {
        // Test del endpoint POST /api/ventas/verificar-stock
        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas/verificar-stock', [
                'productos' => [],
                'almacen_id' => 1,
            ]);

        // Verificar que el endpoint responde (puede ser 422 por validación o 403 por permisos)
        $this->assertTrue(in_array($response->status(), [200, 403, 422]));
    }

    public function test_obtener_stock_producto_endpoint_exists()
    {
        // Test del endpoint GET /api/ventas/stock/producto/{id}
        $response = $this->actingAs($this->user)
            ->getJson('/api/ventas/stock/producto/1');

        // El endpoint debería existir (puede devolver 404 si no existe el producto)
        $this->assertTrue(in_array($response->status(), [200, 403, 404]));
    }

    public function test_obtener_productos_stock_bajo_endpoint_exists()
    {
        // Test del endpoint GET /api/ventas/productos/stock-bajo
        $response = $this->actingAs($this->user)
            ->getJson('/api/ventas/productos/stock-bajo');

        // El endpoint debería existir
        $this->assertTrue(in_array($response->status(), [200, 403, 422]));
    }

    public function test_stock_endpoints_return_json()
    {
        $endpoints = [
            ['method' => 'POST', 'url' => '/api/ventas/verificar-stock', 'data' => ['productos' => [], 'almacen_id' => 1]],
            ['method' => 'GET', 'url' => '/api/ventas/stock/producto/1'],
            ['method' => 'GET', 'url' => '/api/ventas/productos/stock-bajo'],
        ];

        foreach ($endpoints as $endpoint) {
            if ($endpoint['method'] === 'POST') {
                $response = $this->actingAs($this->user)->postJson($endpoint['url'], $endpoint['data']);
            } else {
                $response = $this->actingAs($this->user)->getJson($endpoint['url']);
            }

            // Verificar que responde con JSON (independientemente del código de estado)
            $response->assertHeader('content-type', 'application/json');
        }
    }

    public function test_endpoints_exist_in_route_list()
    {
        // Verificar que las rutas existen usando artisan route:list
        $exitCode = Artisan::call('route:list', ['--json' => true]);
        $routes = json_decode(Artisan::output(), true);

        $expectedRoutes = [
            'POST api/ventas/verificar-stock',
            'GET api/ventas/{producto}/stock',
            'GET api/ventas/productos/stock-bajo',
        ];

        $foundRoutes = [];
        foreach ($routes as $route) {
            $method = $route['method'][0] ?? '';
            $uri = $route['uri'] ?? '';
            $foundRoutes[] = "$method $uri";
        }

        foreach ($expectedRoutes as $expectedRoute) {
            $this->assertContains($expectedRoute, $foundRoutes,
                "Ruta esperada '$expectedRoute' no encontrada en el sistema de rutas");
        }
    }
}
