<?php

namespace Tests\Feature;

use App\Models\Almacen;
use App\Models\Cliente;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\Proforma;
use App\Models\ReservaProforma;
use App\Models\StockProducto;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProformaVentaFlowTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Cliente $cliente;
    protected Producto $producto;
    protected StockProducto $stock;
    protected Almacen $almacen;
    protected Moneda $moneda;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear datos de prueba
        $this->user = User::factory()->create();
        $this->cliente = Cliente::factory()->create(['activo' => true]);
        $this->almacen = Almacen::factory()->create(['nombre' => 'Almacén Principal']);
        $this->moneda = Moneda::factory()->create(['codigo' => 'BOB', 'nombre' => 'Bolivianos']);

        // Crear producto con stock
        $this->producto = Producto::factory()->create([
            'nombre' => 'Producto Test',
            'precio_venta' => 100.00,
            'activo' => true,
        ]);

        $this->stock = StockProducto::create([
            'producto_id' => $this->producto->id,
            'almacen_id' => $this->almacen->id,
            'cantidad' => 100,
            'cantidad_disponible' => 100,
            'cantidad_reservada' => 0,
            'fecha_actualizacion' => now(),
        ]);

        // Crear estados de documento
        EstadoDocumento::create(['nombre' => 'PENDIENTE']);
        EstadoDocumento::create(['nombre' => 'CONFIRMADO']);
    }

    /** @test */
    public function puede_crear_proforma_y_reservar_stock()
    {
        // Crear proforma
        $proforma = Proforma::create([
            'numero' => Proforma::generarNumeroProforma(),
            'fecha' => now(),
            'fecha_vencimiento' => now()->addDays(7),
            'cliente_id' => $this->cliente->id,
            'estado' => Proforma::PENDIENTE,
            'canal_origen' => Proforma::CANAL_APP_EXTERNA,
            'subtotal' => 100.00,
            'impuesto' => 13.00,
            'total' => 113.00,
            'moneda_id' => $this->moneda->id,
        ]);

        // Crear detalle
        $proforma->detalles()->create([
            'producto_id' => $this->producto->id,
            'cantidad' => 10,
            'precio_unitario' => 100.00,
            'subtotal' => 1000.00,
        ]);

        // Reservar stock
        $resultado = $proforma->reservarStock();

        $this->assertTrue($resultado);
        $this->assertEquals(1, $proforma->reservasActivas()->count());

        // Verificar stock
        $this->stock->refresh();
        $this->assertEquals(90, $this->stock->cantidad_disponible);
        $this->assertEquals(10, $this->stock->cantidad_reservada);
        $this->assertEquals(100, $this->stock->cantidad);
    }

    /** @test */
    public function puede_aprobar_proforma_y_extender_reservas()
    {
        // Crear y reservar proforma
        $proforma = $this->crearProformaConReservas();

        // Aprobar
        $resultado = $proforma->aprobar($this->user);

        $this->assertTrue($resultado);
        $this->assertEquals(Proforma::APROBADA, $proforma->fresh()->estado);

        // Verificar que las reservas se extendieron
        $reserva = $proforma->reservasActivas()->first();
        $this->assertNotNull($reserva);
        $this->assertTrue($reserva->fecha_expiracion->gt(now()->addHours(47)));
    }

    /** @test */
    public function puede_convertir_proforma_a_venta_exitosamente()
    {
        // Crear proforma aprobada con reservas
        $proforma = $this->crearProformaConReservas();
        $proforma->aprobar($this->user);

        // Verificar stock antes
        $this->stock->refresh();
        $this->assertEquals(90, $this->stock->cantidad_disponible);
        $this->assertEquals(10, $this->stock->cantidad_reservada);
        $this->assertEquals(100, $this->stock->cantidad);

        // Convertir a venta
        $datosVenta = [
            'numero' => Venta::generarNumero(),
            'fecha' => now()->toDateString(),
            'subtotal' => $proforma->subtotal,
            'impuesto' => $proforma->impuesto,
            'total' => $proforma->total,
            'cliente_id' => $proforma->cliente_id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $proforma->moneda_id,
            'proforma_id' => $proforma->id, // ← CRÍTICO
            'requiere_envio' => false,
            'estado_documento_id' => EstadoDocumento::where('nombre', 'PENDIENTE')->first()->id,
        ];

        $venta = Venta::create($datosVenta);

        // Crear detalles
        foreach ($proforma->detalles as $detalle) {
            $venta->detalles()->create([
                'producto_id' => $detalle->producto_id,
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario,
                'subtotal' => $detalle->subtotal,
            ]);
        }

        // Marcar como convertida (esto consume las reservas)
        $proforma->marcarComoConvertida();

        // Verificar estado
        $this->assertEquals(Proforma::CONVERTIDA, $proforma->fresh()->estado);
        $this->assertNotNull($venta);
        $this->assertEquals($proforma->id, $venta->proforma_id);

        // Verificar stock después: cantidad física debe reducirse UNA SOLA VEZ
        $this->stock->refresh();
        $this->assertEquals(90, $this->stock->cantidad_disponible);
        $this->assertEquals(0, $this->stock->cantidad_reservada);
        $this->assertEquals(90, $this->stock->cantidad); // ← Reducido UNA vez

        // Verificar que NO hay reservas activas
        $this->assertEquals(0, $proforma->reservasActivas()->count());
    }

    /** @test */
    public function no_puede_convertir_proforma_sin_reservas()
    {
        // Crear proforma SIN reservar stock
        $proforma = Proforma::create([
            'numero' => Proforma::generarNumeroProforma(),
            'fecha' => now(),
            'fecha_vencimiento' => now()->addDays(7),
            'cliente_id' => $this->cliente->id,
            'estado' => Proforma::APROBADA,
            'canal_origen' => Proforma::CANAL_WEB,
            'subtotal' => 100.00,
            'impuesto' => 13.00,
            'total' => 113.00,
            'moneda_id' => $this->moneda->id,
        ]);

        $proforma->detalles()->create([
            'producto_id' => $this->producto->id,
            'cantidad' => 10,
            'precio_unitario' => 100.00,
            'subtotal' => 1000.00,
        ]);

        // Intentar validar integridad
        $validacion = $proforma->validarIntegridadParaConversion();

        $this->assertFalse($validacion['valido']);
        $this->assertContains('No hay reservas de stock activas', $validacion['errores']);
    }

    /** @test */
    public function no_puede_convertir_proforma_con_reservas_expiradas()
    {
        // Crear proforma con reservas
        $proforma = $this->crearProformaConReservas();
        $proforma->aprobar($this->user);

        // Expirar las reservas manualmente
        DB::table('reservas_proforma')
            ->where('proforma_id', $proforma->id)
            ->update(['fecha_expiracion' => now()->subHour()]);

        // Intentar validar
        $validacion = $proforma->validarIntegridadParaConversion();

        $this->assertFalse($validacion['valido']);
        $this->assertTrue($proforma->tieneReservasExpiradas());
    }

    /** @test */
    public function no_procesa_stock_dos_veces_cuando_viene_de_proforma()
    {
        // Crear proforma y aprobar
        $proforma = $this->crearProformaConReservas();
        $proforma->aprobar($this->user);

        // Stock inicial: 100
        // Después de reservar: cantidad=100, disponible=90, reservada=10

        // Convertir a venta
        $datosVenta = [
            'numero' => Venta::generarNumero(),
            'fecha' => now()->toDateString(),
            'subtotal' => $proforma->subtotal,
            'impuesto' => $proforma->impuesto,
            'total' => $proforma->total,
            'cliente_id' => $proforma->cliente_id,
            'usuario_id' => $this->user->id,
            'moneda_id' => $proforma->moneda_id,
            'proforma_id' => $proforma->id, // ← Marca que viene de proforma
            'requiere_envio' => false,
            'estado_documento_id' => EstadoDocumento::where('nombre', 'PENDIENTE')->first()->id,
        ];

        $venta = Venta::create($datosVenta);

        // Crear detalles
        foreach ($proforma->detalles as $detalle) {
            $venta->detalles()->create([
                'producto_id' => $detalle->producto_id,
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario,
                'subtotal' => $detalle->subtotal,
            ]);
        }

        // Consumir reservas
        $proforma->marcarComoConvertida();

        // VERIFICAR: El stock debe reducirse SOLO UNA VEZ
        $this->stock->refresh();

        // Esperado:
        // - cantidad: 100 - 10 = 90 (una sola vez)
        // - disponible: 90 (sin cambios, ya estaba reducido)
        // - reservada: 0 (liberada)

        $this->assertEquals(90, $this->stock->cantidad, 'Stock físico debe ser 90');
        $this->assertEquals(90, $this->stock->cantidad_disponible, 'Stock disponible debe ser 90');
        $this->assertEquals(0, $this->stock->cantidad_reservada, 'Stock reservado debe ser 0');

        // CRÍTICO: Verificar que NO se procesó dos veces
        // Si hubiera doble consumo, cantidad sería 80
        $this->assertNotEquals(80, $this->stock->cantidad, '¡BUG! Stock se procesó dos veces');
    }

    /** @test */
    public function puede_rechazar_proforma_y_liberar_reservas()
    {
        // Crear proforma con reservas
        $proforma = $this->crearProformaConReservas();

        // Stock antes: disponible=90, reservada=10
        $this->stock->refresh();
        $this->assertEquals(90, $this->stock->cantidad_disponible);
        $this->assertEquals(10, $this->stock->cantidad_reservada);

        // Rechazar
        $resultado = $proforma->rechazar($this->user, 'Cliente canceló');

        $this->assertTrue($resultado);
        $this->assertEquals(Proforma::RECHAZADA, $proforma->fresh()->estado);

        // Verificar que las reservas se liberaron
        $this->stock->refresh();
        $this->assertEquals(100, $this->stock->cantidad_disponible);
        $this->assertEquals(0, $this->stock->cantidad_reservada);
        $this->assertEquals(100, $this->stock->cantidad);
    }

    /** @test */
    public function comando_limpia_reservas_expiradas()
    {
        // Crear proforma con reservas
        $proforma = $this->crearProformaConReservas();

        // Expirar manualmente
        DB::table('reservas_proforma')
            ->where('proforma_id', $proforma->id)
            ->update(['fecha_expiracion' => now()->subDay()]);

        // Ejecutar comando
        $this->artisan('proforma:limpiar-reservas-expiradas --force')
            ->assertExitCode(0);

        // Verificar que la proforma se marcó como vencida
        $this->assertEquals(Proforma::VENCIDA, $proforma->fresh()->estado);

        // Verificar que el stock se liberó
        $this->stock->refresh();
        $this->assertEquals(100, $this->stock->cantidad_disponible);
        $this->assertEquals(0, $this->stock->cantidad_reservada);
    }

    /** @test */
    public function validacion_de_integridad_detecta_todos_los_errores()
    {
        // Crear proforma con múltiples problemas
        $proforma = Proforma::create([
            'numero' => Proforma::generarNumeroProforma(),
            'fecha' => now(),
            'fecha_vencimiento' => now()->subDay(), // Vencida
            'cliente_id' => $this->cliente->id,
            'estado' => Proforma::PENDIENTE, // Estado incorrecto
            'canal_origen' => Proforma::CANAL_WEB,
            'subtotal' => 0, // Total inválido
            'impuesto' => 0,
            'total' => 0,
            'moneda_id' => $this->moneda->id,
        ]);

        // Sin detalles, sin reservas

        // Validar
        $validacion = $proforma->validarIntegridadParaConversion();

        $this->assertFalse($validacion['valido']);
        $this->assertGreaterThan(0, count($validacion['errores']));

        // Verificar errores específicos
        $this->assertContains('Estado inválido: PENDIENTE. Debe ser APROBADA.', $validacion['errores']);
        $this->assertContains('La proforma no tiene detalles', $validacion['errores']);
        $this->assertContains('El total de la proforma debe ser mayor a 0', $validacion['errores']);
        $this->assertContains('No hay reservas de stock activas', $validacion['errores']);
    }

    /**
     * Helper: Crear proforma con reservas
     */
    protected function crearProformaConReservas(): Proforma
    {
        $proforma = Proforma::create([
            'numero' => Proforma::generarNumeroProforma(),
            'fecha' => now(),
            'fecha_vencimiento' => now()->addDays(7),
            'cliente_id' => $this->cliente->id,
            'estado' => Proforma::PENDIENTE,
            'canal_origen' => Proforma::CANAL_APP_EXTERNA,
            'subtotal' => 1000.00,
            'impuesto' => 130.00,
            'total' => 1130.00,
            'moneda_id' => $this->moneda->id,
        ]);

        $proforma->detalles()->create([
            'producto_id' => $this->producto->id,
            'cantidad' => 10,
            'precio_unitario' => 100.00,
            'subtotal' => 1000.00,
        ]);

        $proforma->reservarStock();

        return $proforma;
    }
}
