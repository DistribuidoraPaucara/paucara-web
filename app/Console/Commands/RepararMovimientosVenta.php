<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\MovimientoInventario;
use App\Services\Venta\VentaDistribucionService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RepararMovimientosVenta extends Command
{
    protected $signature = 'ventas:reparar-movimientos {venta_id?}';
    protected $description = 'Reparar movimientos de inventario faltantes en ventas';

    public function handle()
    {
        $ventaId = $this->argument('venta_id');

        if ($ventaId) {
            $this->repararVenta($ventaId);
        } else {
            $this->repararTodasLasVentasConDiscrepancia();
        }
    }

    /**
     * Reparar una venta específica
     */
    private function repararVenta($ventaId)
    {
        $venta = Venta::find($ventaId);

        if (!$venta) {
            $this->error("Venta ID {$ventaId} no encontrada");
            return;
        }

        $this->line("=== REPARANDO VENTA {$venta->numero} ===");

        // 1. Verificar discrepancia
        $cantidadProductos = $venta->detalles->pluck('producto_id')->unique()->count();
        $cantidadMovimientos = MovimientoInventario::where('numero_documento', $venta->numero)
            ->whereIn('tipo', ['SALIDA_VENTA', 'CONSUMO_RESERVA'])
            ->count();

        $this->line("Detalles: {$cantidadProductos}");
        $this->line("Movimientos: {$cantidadMovimientos}");

        if ($cantidadProductos == $cantidadMovimientos) {
            $this->info("✅ Venta OK - No requiere reparación");
            return;
        }

        // 2. Identificar productos sin movimiento
        $this->line("\nIdentificando productos sin movimiento...");

        $productosConMovimiento = MovimientoInventario::where('numero_documento', $venta->numero)
            ->whereIn('tipo', ['SALIDA_VENTA', 'CONSUMO_RESERVA'])
            ->get()
            ->map(function ($mov) {
                $obs = json_decode($mov->observacion, true);
                return $obs['producto_id'] ?? null;
            })
            ->unique()
            ->filter();

        $productosSinMovimiento = $venta->detalles
            ->pluck('producto_id')
            ->unique()
            ->diff($productosConMovimiento);

        foreach ($productosSinMovimiento as $productoId) {
            $detalle = $venta->detalles->where('producto_id', $productoId)->first();
            $this->error("❌ Producto ID {$productoId}: SIN MOVIMIENTO (Cantidad: {$detalle->cantidad})");
        }

        // 3. Intentar reparar registrando movimientos faltantes
        if ($this->confirm("\n¿Deseas registrar los movimientos faltantes?")) {
            $this->registrarMovimientosFaltantes($venta, $productosSinMovimiento->toArray());
        }
    }

    /**
     * Registrar movimientos faltantes
     */
    private function registrarMovimientosFaltantes(Venta $venta, array $productosIds)
    {
        try {
            DB::transaction(function () use ($venta, $productosIds) {
                $ventaDistribucionService = app(VentaDistribucionService::class);

                foreach ($productosIds as $productoId) {
                    $detalle = $venta->detalles->where('producto_id', $productoId)->first();

                    if (!$detalle) continue;

                    $detallesParaStock = [[
                        'producto_id' => $productoId,
                        'cantidad' => (float) $detalle->cantidad,
                    ]];

                    $this->line("Registrando movimiento para Producto ID {$productoId}...");

                    $movimientos = $ventaDistribucionService->consumirStock(
                        $detallesParaStock,
                        $venta->numero,
                        permitirStockNegativo: false
                    );

                    $this->info("✅ Movimiento registrado (ID: {$movimientos[0]->id})");

                    Log::info('🔧 [RepararMovimientosVenta] Movimiento reparado', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'producto_id' => $productoId,
                        'movimiento_id' => $movimientos[0]->id,
                    ]);
                }
            });

            $this->info("\n✅ Reparación completada exitosamente");
        } catch (\Exception $e) {
            $this->error("❌ Error al reparar: " . $e->getMessage());
            Log::error('Error reparando movimientos de venta', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Identificar y reparar TODAS las ventas con discrepancia
     */
    private function repararTodasLasVentasConDiscrepancia()
    {
        $this->line("=== BUSCANDO VENTAS CON DISCREPANCIA ===\n");

        $ventas = Venta::with('detalles')
            ->where('estado_documento_id', '!=', 1) // Excluir estado PENDIENTE
            ->get();

        $ventasConProblema = [];

        foreach ($ventas as $venta) {
            $cantidadProductos = $venta->detalles->pluck('producto_id')->unique()->count();
            $cantidadMovimientos = MovimientoInventario::where('numero_documento', $venta->numero)
                ->whereIn('tipo', ['SALIDA_VENTA', 'CONSUMO_RESERVA'])
                ->count();

            if ($cantidadProductos != $cantidadMovimientos) {
                $ventasConProblema[] = [
                    'id' => $venta->id,
                    'numero' => $venta->numero,
                    'productos' => $cantidadProductos,
                    'movimientos' => $cantidadMovimientos,
                ];
            }
        }

        if (empty($ventasConProblema)) {
            $this->info("✅ No se encontraron ventas con discrepancia");
            return;
        }

        $this->error("❌ Se encontraron " . count($ventasConProblema) . " venta(s) con discrepancia:\n");

        foreach ($ventasConProblema as $v) {
            $this->line("  - Venta {$v['numero']} (ID: {$v['id']}): {$v['productos']} productos, {$v['movimientos']} movimientos");
        }

        $this->line("\nUsa: php artisan ventas:reparar-movimientos {venta_id}");
    }
}
