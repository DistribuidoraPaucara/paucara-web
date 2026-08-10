<?php

namespace App\Services\Venta;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\VentaPorLote;
use App\Models\MovimientoInventario;
use App\Services\Stock\MovimientoStockService;
use App\Services\Stock\StockValidationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

/**
 * Servicio para Ventas de Comidas con Seguimiento de Movimientos
 *
 * ✅ Características:
 * - Crea ventas de comidas APROBADAS y PAGADAS
 * - Registra movimientos de seguimiento SIN descuentar stock
 * - Mantiene trazabilidad en venta_por_lotes
 * - Maneja productos con permite_venta_sin_stock
 */
class VentasComidasService
{
    protected $ventaDistribucionService;
    protected $movimientoStockService;

    public function __construct()
    {
        $this->ventaDistribucionService = app(VentaDistribucionService::class);
        $this->movimientoStockService = new MovimientoStockService(
            app(StockValidationService::class)
        );
    }

    /**
     * Registrar movimientos de seguimiento para comidas (SIN descuentar stock)
     *
     * @param Venta $venta
     * @param array $detalles
     * @return array Movimientos registrados
     */
    public function registrarMovimientosComidas(Venta $venta, array $detalles): array
    {
        Log::info('🍦 [VentasComidasService::registrarMovimientosComidas] Iniciando registro de movimientos', [
            'venta_id' => $venta->id,
            'numero_venta' => $venta->numero,
            'cantidad_detalles' => count($detalles),
            'canal' => $venta->canal_origen,
        ]);

        $almacenId = Auth::user()?->empresa?->almacen_id ?? 1;
        $movimientos = [];

        return DB::transaction(function () use ($venta, $detalles, $almacenId, &$movimientos) {
            foreach ($detalles as $detalle) {
                $productoId = $detalle['producto_id'] ?? $detalle['id'];
                $cantidad = (float) ($detalle['cantidad'] ?? 0);

                if ($cantidad <= 0) {
                    Log::warning('⚠️ [VentasComidasService] Cantidad inválida', [
                        'producto_id' => $productoId,
                        'cantidad' => $cantidad,
                    ]);
                    continue;
                }

                // 1. Obtener producto
                $producto = Producto::find($productoId);
                if (!$producto) {
                    throw new \Exception("Producto ID {$productoId} no encontrado");
                }

                Log::info('📦 [VentasComidasService] Procesando producto de comida', [
                    'producto_id' => $productoId,
                    'producto_nombre' => $producto->nombre,
                    'cantidad' => $cantidad,
                    'permite_venta_sin_stock' => $producto->permite_venta_sin_stock,
                ]);

                // 2. Obtener stocks disponibles (FIFO) - SIN LOCK porque NO vamos a descuentar
                $stocks = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->where('cantidad_disponible', '>', 0)  // Solo los que tienen stock
                    ->orderBy('fecha_vencimiento', 'asc')   // FIFO
                    ->orderBy('id', 'asc')
                    ->get();

                $stockTotal = $stocks->sum('cantidad_disponible');

                Log::info('📊 [VentasComidasService] Stock disponible encontrado', [
                    'producto_id' => $productoId,
                    'stock_total' => $stockTotal,
                    'lotes_disponibles' => count($stocks),
                ]);

                // 3. Registrar movimientos de SEGUIMIENTO (no descuenta)
                // Si hay stock disponible, crear registros de seguimiento usando FIFO
                if (!$stocks->isEmpty()) {
                    $cantidadRestante = (float) $cantidad;

                    foreach ($stocks as $stock) {
                        if ($cantidadRestante <= 0) {
                            break;
                        }

                        // Cantidad a registrar (lo menor entre lo que necesito y lo disponible)
                        $cantidadRegistrar = (float) min($cantidadRestante, (float) $stock->cantidad_disponible);

                        try {
                            // ✅ NUEVO: Registrar como SALIDA_COMIDA (NO descuenta stock)
                            $movimientoRegistrado = $this->registrarMovimientoComida(
                                stockProductoId: $stock->id,
                                cantidad: $cantidadRegistrar,  // Positivo: solo seguimiento
                                ventaId: $venta->id,
                                numeroVenta: $venta->numero,
                                producto: $producto,
                                lote: $stock->lote,
                                fechaVencimiento: $stock->fecha_vencimiento
                            );

                            $movimientos[] = $movimientoRegistrado;

                            // ✅ Registrar trazabilidad en venta_por_lotes
                            $this->registrarVentaPorLote(
                                ventaId: $venta->id,
                                productoId: $productoId,
                                stockId: $stock->id,
                                cantidadVendida: $cantidadRegistrar,
                                esComida: true
                            );

                            Log::info('📝 [VentasComidasService] Movimiento de comida registrado (sin descuento)', [
                                'venta_id' => $venta->id,
                                'stock_id' => $stock->id,
                                'producto_id' => $productoId,
                                'lote' => $stock->lote,
                                'cantidad' => $cantidadRegistrar,
                                'tipo_movimiento' => 'SALIDA_COMIDA',
                            ]);

                        } catch (\Exception $e) {
                            Log::error('❌ Error registrando movimiento de comida', [
                                'stock_id' => $stock->id,
                                'venta' => $venta->numero,
                                'error' => $e->getMessage(),
                            ]);
                            throw $e;
                        }

                        $cantidadRestante = (float) ($cantidadRestante - $cantidadRegistrar);
                    }
                } else {
                    // ✅ NO hay stock disponible: crear registro FICTICIO de SALIDA_COMIDA
                    // Esto permite trazabilidad incluso sin stock
                    Log::info('📝 [VentasComidasService] Sin stock disponible - registrando movimiento FICTICIO', [
                        'producto_id' => $productoId,
                        'cantidad' => $cantidad,
                        'permite_venta_sin_stock' => $producto->permite_venta_sin_stock,
                    ]);

                    try {
                        $movimientoFicticio = $this->registrarMovimientoComidaSinStock(
                            ventaId: $venta->id,
                            numeroVenta: $venta->numero,
                            productoId: $productoId,
                            producto: $producto,
                            cantidad: $cantidad,
                            almacenId: $almacenId
                        );

                        $movimientos[] = $movimientoFicticio;

                        // ✅ NO crear venta_por_lotes para comidas sin stock
                        // venta_por_lotes requiere stock_producto_id NOT NULL
                        // Solo registramos el movimiento en movimientos_inventario para auditoría

                        Log::info('📝 [VentasComidasService] Movimiento FICTICIO registrado (comida sin stock)', [
                            'venta_id' => $venta->id,
                            'producto_id' => $productoId,
                            'cantidad' => $cantidad,
                            'nota' => 'No se registra en venta_por_lotes (sin stock disponible)',
                        ]);

                    } catch (\Exception $e) {
                        Log::error('❌ Error registrando movimiento ficticio de comida', [
                            'venta' => $venta->numero,
                            'producto_id' => $productoId,
                            'error' => $e->getMessage(),
                        ]);
                        throw $e;
                    }
                }
            }

            Log::info('✅ [VentasComidasService::registrarMovimientosComidas] Movimientos registrados exitosamente', [
                'venta_id' => $venta->id,
                'numero_venta' => $venta->numero,
                'movimientos_creados' => count($movimientos),
            ]);

            return $movimientos;
        });
    }

    /**
     * Registrar un movimiento de comida (con lote específico)
     * Crea solo registro de seguimiento, NO descuenta stock
     */
    private function registrarMovimientoComida(
        int $stockProductoId,
        float $cantidad,
        int $ventaId,
        string $numeroVenta,
        Producto $producto,
        ?string $lote,
        $fechaVencimiento
    ): MovimientoInventario {
        // ✅ NUEVO: Si permite_venta_sin_stock=false, usar SALIDA_VENTA (descuenta stock)
        // Si permite_venta_sin_stock=true, usar SALIDA_COMIDA (solo auditoría)
        $tipoMovimiento = $producto->permite_venta_sin_stock
            ? 'SALIDA_COMIDA'      // Comida: solo auditoría, no descuenta
            : 'SALIDA_VENTA';      // Normal: descuenta stock real

        return $this->movimientoStockService->registrarMovimientoYActualizar(
            stockProductoId: $stockProductoId,
            cantidad: -(int)$cantidad,
            tipo: $tipoMovimiento,
            referencia_tipo: 'venta',
            referencia_id: $ventaId,
            metadataAdicional: [
                'numero_venta' => $numeroVenta,
                'lote' => $lote,
                'fecha_vencimiento' => $fechaVencimiento?->format('Y-m-d'),
                'cantidad_vendida' => $cantidad,
                'producto_nombre' => $producto->nombre,
                'tipo_venta' => $producto->permite_venta_sin_stock ? 'COMIDA' : 'VENTA_NORMAL',
                'permite_venta_sin_stock' => $producto->permite_venta_sin_stock,
            ],
            numeroDocumento: $numeroVenta
        );
    }

    /**
     * Registrar movimiento ficticio para comida sin stock
     * Crea un registro de auditoría cuando no hay lote disponible
     */
    private function registrarMovimientoComidaSinStock(
        int $ventaId,
        string $numeroVenta,
        int $productoId,
        Producto $producto,
        float $cantidad,
        int $almacenId
    ): MovimientoInventario {
        // ✅ NUEVO: Si permite_venta_sin_stock=false, rechazar la venta (no hay stock)
        if (!$producto->permite_venta_sin_stock) {
            throw new \Exception(
                "No se puede vender el producto '{$producto->nombre}' sin stock. " .
                "El producto no está configurado para permitir ventas sin inventario disponible."
            );
        }

        // Crear o usar un stock ficticio (cantidad_disponible = 0)
        // Solo para productos que PERMITEN venta sin stock
        $stockFicticio = StockProducto::firstOrCreate(
            [
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'lote' => 'FICTICIO-COMIDA',  // Marcador especial
            ],
            [
                'cantidad' => 0,
                'cantidad_disponible' => 0,
                'cantidad_reservada' => 0,
                'fecha_actualizacion' => now(),
            ]
        );

        return $this->movimientoStockService->registrarMovimientoYActualizar(
            stockProductoId: $stockFicticio->id,
            cantidad: -(int)$cantidad,
            tipo: 'SALIDA_COMIDA_SIN_STOCK',  // ✅ Tipo especial para comidas sin stock (solo auditoría)
            referencia_tipo: 'venta',
            referencia_id: $ventaId,
            metadataAdicional: [
                'numero_venta' => $numeroVenta,
                'producto_id' => $productoId,
                'producto_nombre' => $producto->nombre,
                'cantidad_vendida' => $cantidad,
                'tipo_venta' => 'COMIDA_SIN_STOCK',
                'nota' => 'Venta de comida sin stock disponible',
                'permite_venta_sin_stock' => $producto->permite_venta_sin_stock,
            ],
            numeroDocumento: $numeroVenta
        );
    }

    /**
     * Registrar trazabilidad en venta_por_lotes
     */
    private function registrarVentaPorLote(
        int $ventaId,
        int $productoId,
        ?int $stockId,
        float $cantidadVendida,
        bool $esComida = false
    ): VentaPorLote {
        return VentaPorLote::create([
            'venta_id'           => $ventaId,
            'detalle_venta_id'   => null,  // Comidas no tienen detalles específicos
            'producto_id'        => $productoId,
            'stock_producto_id'  => $stockId,
            'cantidad_consumida' => $cantidadVendida,
            'combo_padre_id'     => null,  // Las comidas no son combos
            'fecha_vencimiento'  => StockProducto::find($stockId)?->fecha_vencimiento,
        ]);
    }
}
