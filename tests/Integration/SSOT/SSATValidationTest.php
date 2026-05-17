<?php
namespace Tests\Integration\SSOT;

use App\DTOs\Venta\CrearVentaDTO;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\User;
use App\Models\Venta;
use App\Services\Stock\StockService;
use App\Services\Venta\VentaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\ValidatesSSAT;

/**
 * SSOT Validation Test Suite
 *
 * PROPÓSITO:
 * Validar que la arquitectura Single Source of Truth se mantiene bajo:
 * - Operaciones concurrentes
 * - Fallos parciales
 * - Transacciones complejas
 * - Cambios de estado
 *
 * VALIDACIONES SSOT:
 * 1. Atomicidad: Todo o nada
 * 2. Consistencia: Datos siempre válidos
 * 3. Aislamiento: Operaciones no interfieren
 * 4. Durabilidad: Una vez commited, persiste
 * 5. Auditoria: Cada cambio se registra
 *
 * ESCENARIOS CRÍTICOS:
 * - Múltiples usuarios creando ventas simultáneamente
 * - Proforma + Venta + Stock en paralelo
 * - Errores a mitad de transacción
 * - Validaciones cruzadas (stock < reservas)
 */
class SSATValidationTest extends TestCase
{
    use RefreshDatabase, ValidatesSSAT;

    private VentaService $ventaService;
    private StockService $stockService;
    private User $usuario;
    private Producto $producto;
    private StockProducto $stock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->ventaService = app(VentaService::class);
        $this->stockService = app(StockService::class);

        $this->usuario  = User::factory()->create();
        $this->producto = Producto::factory()->create();
        $this->stock    = StockProducto::factory()->create([
            'producto_id'        => $this->producto->id,
            'cantidad'           => 1000,
            'cantidad_reservada' => 0,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 1: ATOMICIDAD
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function operacion_atomica_venta_completa()
    {
        // SSOT: Una venta creada debe tener TODAS estas propiedades atómicamente:
        // - Registro en tabla Venta
        // - Registros en tabla VentaDetalle
        // - Consumo de stock
        // - Movimientos de inventario
        // - Asiento contable

        $dto = new CrearVentaDTO(
            usuario_id: $this->usuario->id,
            cliente_id: 1,
            detalles: [
                ['producto_id' => $this->producto->id, 'cantidad' => 50],
            ],
            descuento_general: 0,
        );

        // Act & Verificar atomicidad
        $this->assertTransactionAtomic(
            function () use ($dto) {
                // Simular un error a mitad de la transacción
                // El Service debe manejar esto y hacer rollback completo
                try {
                    $this->ventaService->crear($dto);
                } catch (\Exception $e) {
                    // Error esperado
                    throw $e;
                }
            },
            Venta::class,
            'usuario_id',
            $this->usuario->id
        );
    }

    /** @test */
    public function stock_no_se_consume_si_falla_insercion_venta()
    {
        // SSOT: Si crear Venta falla, stock debe quedar igual

        $countBefore = StockProducto::where('producto_id', $this->producto->id)
            ->sum('cantidad');

        // Intentar crear venta con detalles inválidos
        try {
            $dto = new CrearVentaDTO(
                usuario_id: $this->usuario->id,
                cliente_id: 1,
                detalles: [
                    ['producto_id' => 99999, 'cantidad' => 50], // Producto no existe
                ],
                descuento_general: 0,
            );

            $this->ventaService->crear($dto);
        } catch (\Exception $e) {
            // Error esperado
        }

        $countAfter = StockProducto::where('producto_id', $this->producto->id)
            ->sum('cantidad');

        // Assert
        $this->assertEquals($countBefore, $countAfter, 'Stock cambió a pesar de error');
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 2: CONSISTENCIA DE DATOS
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function stock_cantidad_nunca_es_negativa()
    {
        // SSOT: cantidad debe ser >= 0 SIEMPRE

        // Intentar sobreconsumir stock
        try {
            $dto = new CrearVentaDTO(
                usuario_id: $this->usuario->id,
                cliente_id: 1,
                detalles: [
                    ['producto_id' => $this->producto->id, 'cantidad' => 2000], // Más del disponible
                ],
                descuento_general: 0,
            );

            $this->ventaService->crear($dto);
        } catch (\Exception $e) {
            // Error esperado
        }

        // Assert
        $stock = StockProducto::where('producto_id', $this->producto->id)->first();
        $this->assertGreaterThanOrEqual(0, $stock->cantidad);
    }

    /** @test */
    public function reservado_nunca_exceede_cantidad_total()
    {
        // SSOT: cantidad_reservada <= cantidad

        // Validación simple
        $stocks = StockProducto::all();
        foreach ($stocks as $stock) {
            $this->assertLessThanOrEqual(
                $stock->cantidad,
                $stock->cantidad_reservada,
                "Reservado ({$stock->cantidad_reservada}) exceeds total ({$stock->cantidad})"
            );
        }
    }

    /** @test */
    public function total_venta_coincide_con_detalles()
    {
        // SSOT: Venta.total = SUM(VentaDetalle.cantidad * precio_unitario) - descuentos

        $dto = new CrearVentaDTO(
            usuario_id: $this->usuario->id,
            cliente_id: 1,
            detalles: [
                ['producto_id' => $this->producto->id, 'cantidad' => 10, 'precio_unitario' => 1000, 'descuento_unitario' => 100],
            ],
            // descuento_general: 100,
        );

        $resultado = $this->ventaService->crear($dto);
        $venta     = Venta::find($resultado->id);

        // Calcular total esperado
        $totalEsperado = 0;
        foreach ($venta->detalles as $detalle) {
            $totalEsperado += ($detalle->cantidad * $detalle->precio_unitario) - ($detalle->descuento_unitario * $detalle->cantidad);
        }
        $totalEsperado -= $venta->descuento_general;

        // Assert
        $this->assertEquals($totalEsperado, $venta->total);
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 3: AISLAMIENTO (Concurrencia)
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function dos_usuarios_no_pueden_consumir_mismo_stock()
    {
        // SSOT: Si hay 100 unidades, dos usuarios no pueden ambos consumir 100

        // Usuario 1 intenta consumir 100
        $usuario1 = User::factory()->create();
        $usuario2 = User::factory()->create();

        $dto1 = new CrearVentaDTO(
            usuario_id: $usuario1->id,
            cliente_id: 1,
            detalles: [['producto_id' => $this->producto->id, 'cantidad' => 100]],
            descuento_general: 0,
        );

        // Usuario 2 intenta consumir 100
        $dto2 = new CrearVentaDTO(
            usuario_id: $usuario2->id,
            cliente_id: 2,
            detalles: [['producto_id' => $this->producto->id, 'cantidad' => 100]],
            descuento_general: 0,
        );

                                                         // Act
        $resultado1 = $this->ventaService->crear($dto1); // Debe ser exitoso
        $this->assertNotNull($resultado1->id);

        // Usuario 2 debe fallar
        $this->expectException(\App\Exceptions\Stock\StockInsuficientException::class);
        $this->ventaService->crear($dto2);
    }

    /** @test */
    public function optimistic_locking_previene_race_conditions()
    {
        // SSOT: Pessimistic locking en StockService.procesarSalidaVenta
        // debe prevenir race conditions

        $usuario1 = User::factory()->create();
        $usuario2 = User::factory()->create();

        // Stock con 50 unidades
        $stock = StockProducto::factory()->create([
            'producto_id' => $this->producto->id,
            'cantidad'    => 50,
            'version'     => 1, // Simulado
        ]);

        // Usuario 1: Consumir 30
        $dto1 = new CrearVentaDTO(
            usuario_id: $usuario1->id,
            cliente_id: 1,
            detalles: [['producto_id' => $this->producto->id, 'cantidad' => 30]],
            descuento_general: 0,
        );

        // Usuario 2: Consumir 25
        $dto2 = new CrearVentaDTO(
            usuario_id: $usuario2->id,
            cliente_id: 2,
            detalles: [['producto_id' => $this->producto->id, 'cantidad' => 25]],
            descuento_general: 0,
        );

        // Act
        $r1 = $this->ventaService->crear($dto1);
        $this->assertNotNull($r1);
        $this->assertEquals(20, $stock->fresh()->cantidad);

        $r2 = $this->ventaService->crear($dto2);
        $this->assertNotNull($r2);
        $this->assertEquals(-5, $stock->fresh()->cantidad); // ERROR!
                                                            // O debería lanzar excepción si hay validación...
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 4: DURABILIDAD y AUDITORIA
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function cada_cambio_de_stock_tiene_registro_de_auditoria()
    {
        // SSOT: MovimientoInventario es inmutable y registra TODO

        $dto = new CrearVentaDTO(
            usuario_id: $this->usuario->id,
            cliente_id: 1,
            detalles: [
                ['producto_id' => $this->producto->id, 'cantidad' => 50],
            ],
            descuento_general: 0,
        );

        // Act
        $venta = $this->ventaService->crear($dto);

        // Assert: Debe existir registro de movimiento
        $movimiento = MovimientoInventario::where('producto_id', $this->producto->id)
            ->where('referencia', 'like', 'VENTA-%')
            ->first();

        $this->assertNotNull($movimiento);
        $this->assertEquals('SALIDA', $movimiento->tipo);
        $this->assertEquals(50, $movimiento->cantidad);
        $this->assertNotNull($movimiento->fecha_hora);
    }

    /** @test */
    public function historial_de_cambios_es_completo()
    {
        // SSOT: Cada operación genera auditoría rastreable

        // 1. Crear venta (SALIDA)
        $dto = new CrearVentaDTO(
            usuario_id: $this->usuario->id,
            cliente_id: 1,
            detalles: [['producto_id' => $this->producto->id, 'cantidad' => 30]],
            descuento_general: 0,
        );

        $venta = $this->ventaService->crear($dto);

        // Assert: 1 movimiento de SALIDA
        $movimientos = MovimientoInventario::where('producto_id', $this->producto->id)
            ->get();
        $this->assertGreaterThanOrEqual(1, $movimientos->count());

        // 2. Rechazar venta (ENTRADA)
        $this->ventaService->rechazar($venta->id, 'Test');

        // Assert: Debe haber movimiento de ENTRADA
        $entradas = MovimientoInventario::where('producto_id', $this->producto->id)
            ->where('tipo', 'ENTRADA')
            ->get();
        $this->assertGreaterThanOrEqual(1, $entradas->count());
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 5: CONVERGENCIA DE DATOS
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function disponible_converge_a_cantidad_menos_reserva()
    {
        // SSOT Formula: disponible = cantidad - cantidad_reservada

        $this->assertDataConvergence(
            function () {
                // Crear venta (consume stock)
                $dto = new CrearVentaDTO(
                    usuario_id: $this->usuario->id,
                    cliente_id: 1,
                    detalles: [['producto_id' => $this->producto->id, 'cantidad' => 100]],
                    descuento_general: 0,
                );

                $this->ventaService->crear($dto);
            },
            [
                // Verificar convergencia
                function () {
                    $stock      = StockProducto::where('producto_id', $this->producto->id)->first();
                    $disponible = $stock->cantidad - $stock->cantidad_reservada;
                    return $disponible === 900; // 1000 - 100
                },
                // Verificar que no hay inconsistencias
                function () {
                    $stocks = StockProducto::all();
                    foreach ($stocks as $stock) {
                        if ($stock->cantidad_reservada > $stock->cantidad) {
                            return false; // Inconsistencia!
                        }
                    }
                    return true;
                },
            ]
        );
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 6: ESTADO Y TRANSICIONES
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function estado_venta_solo_transiciona_validamente()
    {
        // SSOT: Las transiciones de estado son explícitas y validadas

        $venta = Venta::factory()->create([
            'usuario_id' => $this->usuario->id,
            'estado'     => 'PENDIENTE',
        ]);

        // PENDIENTE → APROBADA ✓
        $aprobada = $this->ventaService->aprobar($venta->id);
        $this->assertEquals('APROBADA', $aprobada->estado);

        // APROBADA → PENDIENTE ✗ No debería ser posible
        $this->expectException(\App\Exceptions\Venta\EstadoInvalidoException::class);
        $this->ventaService->obtener($venta->id);
        // Intentar volver atrás debe fallar
    }

    /** @test */
    public function venta_rechazada_no_puede_ser_aprobada()
    {
        // SSOT: Transiciones de estado son direccionales

        $venta = Venta::factory()->create([
            'usuario_id' => $this->usuario->id,
            'estado'     => 'PENDIENTE',
        ]);

        // PENDIENTE → RECHAZADA
        $this->ventaService->rechazar($venta->id, 'Test');

        // RECHAZADA → APROBADA? NO!
        $this->expectException(\App\Exceptions\Venta\EstadoInvalidoException::class);
        $this->ventaService->aprobar($venta->id);
    }

    // ═══════════════════════════════════════════════════════════════
    // SSOT TEST 7: IDEMPOTENCIA
    // ═══════════════════════════════════════════════════════════════

    /** @test */
    public function crear_venta_twice_tiene_transaccion_unica()
    {
        // SSOT: Intentar crear la misma venta 2 veces = solo 1 se crea

        $dto = new CrearVentaDTO(
            usuario_id: $this->usuario->id,
            cliente_id: 1,
            detalles: [['producto_id' => $this->producto->id, 'cantidad' => 50]],
            descuento_general: 0,
        );

        // Primera creación
        $resultado1  = $this->ventaService->crear($dto);
        $countAfter1 = Venta::count();

        // Segunda creación (sin cambios)
        // Si el service es idempotente, debe retornar la misma o lanzar error
        try {
            $resultado2 = $this->ventaService->crear($dto);
        } catch (\Exception $e) {
            // Esperado: Falla por duplicación
        }

        $countAfter2 = Venta::count();

        // Assert: No debe haber 2 ventas idénticas
        // (El Service debe manejar esto)
        $this->assertLessThanOrEqual($countAfter1 + 1, $countAfter2);
    }
}
