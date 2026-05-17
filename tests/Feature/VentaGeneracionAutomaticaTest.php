<?php
namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VentaGeneracionAutomaticaTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected $cliente;

    protected $producto;

    protected $moneda;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario de prueba
        $this->user = User::factory()->create();

        // Crear cliente de prueba
        $this->cliente = Cliente::factory()->create();

        // Crear producto de prueba
        $this->producto = Producto::factory()->create([
            'precio_venta'             => 100.00,
            'controlar_stock'          => true,
            'permitir_venta_sin_stock' => true,
        ]);

        // Crear moneda BOB (ID 1)
        $this->moneda = Moneda::factory()->create([
            'id'     => 1,
            'codigo' => 'BOB',
            'nombre' => 'Bolivianos',
        ]);
    }

    /** @test */
    public function it_generates_automatic_sale_number_with_correct_format()
    {
        $numeroGenerado = Venta::generarNumero();

        // Verificar formato: VEN + fecha YYYYMMDD + número secuencial de 4 dígitos
        $this->assertMatchesRegularExpression('/^VEN\d{8}\d{4}$/', $numeroGenerado);

        // Verificar que contiene la fecha actual
        $fechaActual = now()->format('Ymd');
        $this->assertStringContainsString($fechaActual, $numeroGenerado);
    }

    /** @test */
    public function it_creates_sale_with_automatic_number_and_default_currency()
    {
        $ventaData = [
            'fecha'               => now()->format('Y-m-d'),
            'cliente_id'          => $this->cliente->id,
            'usuario_id'          => $this->user->id,
            'estado_documento_id' => 1,
            'detalles'            => [
                [
                    'producto_id'     => $this->producto->id,
                    'cantidad'        => 2,
                    'precio_unitario' => 100.00,
                    'descuento'       => 0,
                    'subtotal'        => 200.00,
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $ventaData);

        $response->assertStatus(201);

        $venta = Venta::latest()->first();

        // Verificar que el número fue generado automáticamente
        $this->assertNotEmpty($venta->numero);
        $this->assertMatchesRegularExpression('/^VEN\d{8}\d{4}$/', $venta->numero);

        // Verificar que la moneda por defecto es BOB (ID 1)
        $this->assertEquals(1, $venta->moneda_id);
        $this->assertEquals('BOB', $venta->moneda->codigo);
    }

    /** @test */
    public function it_allows_manual_number_override_when_provided()
    {
        $numeroManual = 'VENTA-MANUAL-001';

        $ventaData = [
            'numero'              => $numeroManual,
            'fecha'               => now()->format('Y-m-d'),
            'cliente_id'          => $this->cliente->id,
            'usuario_id'          => $this->user->id,
            'estado_documento_id' => 1,
            'moneda_id'           => 1,
            'detalles'            => [
                [
                    'producto_id'     => $this->producto->id,
                    'cantidad'        => 1,
                    'precio_unitario' => 100.00,
                    'descuento'       => 0,
                    'subtotal'        => 100.00,
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $ventaData);

        $response->assertStatus(201);

        $venta = Venta::latest()->first();

        // Verificar que se usó el número manual proporcionado
        $this->assertEquals($numeroManual, $venta->numero);
    }

    /** @test */
    public function it_allows_manual_currency_override_when_provided()
    {
        // Crear otra moneda para probar
        $usd = Moneda::factory()->create([
            'codigo' => 'USD',
            'nombre' => 'Dólares Americanos',
        ]);

        $ventaData = [
            'fecha'               => now()->format('Y-m-d'),
            'cliente_id'          => $this->cliente->id,
            'usuario_id'          => $this->user->id,
            'estado_documento_id' => 1,
            'moneda_id'           => $usd->id, // Moneda manual
            'detalles'            => [
                [
                    'producto_id'     => $this->producto->id,
                    'cantidad'        => 1,
                    'precio_unitario' => 100.00,
                    'descuento'       => 0,
                    'subtotal'        => 100.00,
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $ventaData);

        $response->assertStatus(201);

        $venta = Venta::latest()->first();

        // Verificar que se usó la moneda manual proporcionada
        $this->assertEquals($usd->id, $venta->moneda_id);
        $this->assertEquals('USD', $venta->moneda->codigo);
    }
}
