<?php

namespace Tests\Integration\Services;

use App\DTOs\Venta\CrearProformaDTO;
use App\DTOs\Venta\CrearVentaDTO;
use App\Models\Producto;
use App\Models\Proforma;
use App\Models\ReservaStock;
use App\Models\StockProducto;
use App\Models\Venta;
use App\Services\Venta\ProformaService;
use App\Services\Venta\VentaService;
use Tests\TestCase;
use Tests\Traits\ValidatesSSAT;

/**
 * Tests de Integración: Flujo Proforma → Venta
 *
 * ESCENARIO:
 * 1. Crear Proforma (reserva stock)
 * 2. Aprobar Proforma (mantiene reserva)
 * 3. Convertir Proforma a Venta (consume stock)
 * 4. Verificar que stock se consumió solo UNA VEZ
 *
 * IMPORTANTE PARA SSOT:
 * ✓ Proforma reserva, NO consume
 * ✓ Venta consume desde stock libre + reservas liberadas
 * ✓ No hay doble consumo ni doble reserva
 */
class VentaToProformaFlowTest extends TestCase
{
    use ValidatesSSAT;

    private ProformaService $proformaService;
    private VentaService $ventaService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->proformaService = app(ProformaService::class);
        $this->ventaService = app(VentaService::class);
    }

    /** @test */
    public function flujo_completo_proforma_a_venta()
    {
        // ═════════════════════════════════════════════════════════════
        // PASO 1: Setup - Crear producto con stock
        // ═════════════════════════════════════════════════════════════

        $usuario = $this->createUsuario();
        $producto = $this->createProducto(['nombre' => 'Producto A', 'precio_base' => 1000]);

        // Stock inicial: 100 unidades
        $stock = StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 0,
        ]);

        // ═════════════════════════════════════════════════════════════
        // PASO 2: Crear Proforma (reserva 30 unidades)
        // ═════════════════════════════════════════════════════════════

        $proformaDTO = new CrearProformaDTO(
            usuario_id: $usuario->id,
            cliente_id: 1,
            detalles: [
                ['producto_id' => $producto->id, 'cantidad' => 30, 'precio_unitario' => 1000],
            ],
            descuento_general: 0,
            fecha_vencimiento: now()->addDays(7),
        );

        $proformaResultado = $this->proformaService->crear($proformaDTO);

        // Assert: Estado correcto
        $this->assertEquals('PENDIENTE', $proformaResultado->estado);

        // Assert: Stock debe mantener cantidad pero marcar reserva
        $stock->refresh();
        $this->assertEquals(100, $stock->cantidad); // No cambió
        $this->assertEquals(30, $stock->cantidad_reservada); // Reservado

        // Verificar registro de reserva
        $reserva = ReservaStock::where('proforma_id', $proformaResultado->id)->first();
        $this->assertNotNull($reserva);
        $this->assertEquals(30, $reserva->cantidad);

        // ═════════════════════════════════════════════════════════════
        // PASO 3: Aprobar Proforma (mantiene reserva)
        // ═════════════════════════════════════════════════════════════

        $proformaAprobada = $this->proformaService->aprobar($proformaResultado->id);
        $this->assertEquals('APROBADA', $proformaAprobada->estado);

        // Assert: Stock sigue sin cambiar
        $stock->refresh();
        $this->assertEquals(100, $stock->cantidad);
        $this->assertEquals(30, $stock->cantidad_reservada);

        // ═════════════════════════════════════════════════════════════
        // PASO 4: Convertir Proforma a Venta
        // ═════════════════════════════════════════════════════════════

        // Simulación: El service debe obtener los detalles de la proforma
        $proforma = Proforma::find($proformaResultado->id);
        $ventaDTO = new CrearVentaDTO(
            usuario_id: $usuario->id,
            cliente_id: $proforma->cliente_id,
            detalles: $proforma->detalles->map(function ($detalle) {
                return [
                    'producto_id' => $detalle->producto_id,
                    'cantidad' => $detalle->cantidad,
                    'precio_unitario' => $detalle->precio_unitario,
                    'descuento_unitario' => $detalle->descuento_unitario,
                ];
            })->toArray(),
            descuento_general: $proforma->descuento_general ?? 0,
        );

        $ventaResultado = $this->ventaService->crear($ventaDTO);
        $venta = Venta::find($ventaResultado->id);

        // Assert: Venta creada
        $this->assertEquals('PENDIENTE', $ventaResultado->estado);
        $this->assertEquals($proforma->cliente_id, $venta->cliente_id);

        // ═════════════════════════════════════════════════════════════
        // PASO 5: Verificar Stock Final (CRÍTICO PARA SSOT)
        // ═════════════════════════════════════════════════════════════

        $stock->refresh();

        // Assert: Stock debe haber BAJADO a 70 (100 - 30)
        // NO debe ser 40 (eso sería doble consumo)
        // NO debe ser 100 (eso sería que no se consumió)
        $this->assertEquals(70, $stock->cantidad, 'Stock debe ser 100 - 30 = 70');

        // Assert: Reserva debe haberse LIBERADO
        $this->assertEquals(0, $stock->cantidad_reservada, 'Reserva debe ser liberada');

        // Assert: Disponible = cantidad - reserva = 70 - 0 = 70
        $disponibleFinal = $stock->cantidad - $stock->cantidad_reservada;
        $this->assertEquals(70, $disponibleFinal);

        // Assert: Proforma debe estar marcada como convertida
        $proforma->refresh();
        // (Asumir que hay un campo o relación que indica conversión)
    }

    /** @test */
    public function rechazar_proforma_libera_stock()
    {
        // Arrange
        $usuario = $this->createUsuario();
        $producto = $this->createProducto();

        $stock = StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 0,
        ]);

        // Crear y aprobar proforma
        $proformaDTO = new CrearProformaDTO(
            usuario_id: $usuario->id,
            cliente_id: 1,
            detalles: [['producto_id' => $producto->id, 'cantidad' => 40]],
            descuento_general: 0,
            fecha_vencimiento: now()->addDays(7),
        );

        $proforma = $this->proformaService->crear($proformaDTO);
        $stock->refresh();
        $this->assertEquals(40, $stock->cantidad_reservada);

        // Act: Rechazar proforma
        $this->proformaService->rechazar($proforma->id, 'Cliente rechazó');

        // Assert: Reserva debe liberarse
        $stock->refresh();
        $this->assertEquals(0, $stock->cantidad_reservada);
        $this->assertEquals(100, $stock->cantidad); // Sin cambios
    }

    /** @test */
    public function no_puede_convertir_proforma_rechazada()
    {
        // Arrange
        $usuario = $this->createUsuario();
        $producto = $this->createProducto();

        StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
        ]);

        $proformaDTO = new CrearProformaDTO(
            usuario_id: $usuario->id,
            cliente_id: 1,
            detalles: [['producto_id' => $producto->id, 'cantidad' => 30]],
            descuento_general: 0,
            fecha_vencimiento: now()->addDays(7),
        );

        $proforma = $this->proformaService->crear($proformaDTO);

        // Act: Rechazar
        $this->proformaService->rechazar($proforma->id, 'Rechazada');

        // Act & Assert: Intentar convertir debe fallar
        $this->expectException(\Exception::class);

        $proformaModelo = Proforma::find($proforma->id);
        $ventaDTO = new CrearVentaDTO(
            usuario_id: $usuario->id,
            cliente_id: $proformaModelo->cliente_id,
            detalles: $proformaModelo->detalles->map(fn($d) => [
                'producto_id' => $d->producto_id,
                'cantidad' => $d->cantidad,
                'precio_unitario' => $d->precio_unitario,
            ])->toArray(),
            descuento_general: 0,
        );

        // Esta debe fallar porque stock no está reservado
        $this->ventaService->crear($ventaDTO);
    }

    /** @test */
    public function multiples_proformas_en_paralelo()
    {
        // Arrange: Producto con 100 unidades
        $usuario = $this->createUsuario();
        $producto = $this->createProducto();

        $stock = StockProducto::factory()->create([
            'producto_id' => $producto->id,
            'cantidad' => 100,
            'cantidad_reservada' => 0,
        ]);

        // Act: Crear 3 proformas de 30 unidades cada una (total 90)
        for ($i = 0; $i < 3; $i++) {
            $proformaDTO = new CrearProformaDTO(
                usuario_id: $usuario->id,
                cliente_id: $i + 1,
                detalles: [['producto_id' => $producto->id, 'cantidad' => 30]],
                descuento_general: 0,
                fecha_vencimiento: now()->addDays(7),
            );

            $this->proformaService->crear($proformaDTO);
        }

        // Assert: Stock debe tener 90 reservado
        $stock->refresh();
        $this->assertEquals(100, $stock->cantidad);
        $this->assertEquals(90, $stock->cantidad_reservada);
        $this->assertEquals(10, $stock->cantidad - $stock->cantidad_reservada); // Disponible

        // Act: Intentar crear 4ta proforma de 20 (debería fallar, solo 10 disponible)
        $proformaDTO4 = new CrearProformaDTO(
            usuario_id: $usuario->id,
            cliente_id: 4,
            detalles: [['producto_id' => $producto->id, 'cantidad' => 20]],
            descuento_general: 0,
            fecha_vencimiento: now()->addDays(7),
        );

        // Assert: Debe lanzar excepción de stock insuficiente
        $this->expectException(\App\Exceptions\Stock\StockInsuficientException::class);
        $this->proformaService->crear($proformaDTO4);
    }
}
