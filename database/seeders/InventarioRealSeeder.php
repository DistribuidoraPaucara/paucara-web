<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\StockProducto;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\Almacen;

class InventarioRealSeeder extends Seeder
{
    /**
     * Seeder para generar datos reales de inventario
     * - Agrega cantidades reales a los productos
     * - Crea movimientos con cantidades significativas
     * - Establece stock mínimo realista
     */
    public function run(): void
    {
        echo "\n🌱 Generando datos reales de inventario...\n";

        // 1. Actualizar stock mínimo de productos
        echo "  1️⃣  Actualizando stock mínimo...\n";
        $this->actualizarStockMinimo();

        // 2. Actualizar cantidades de stock
        echo "  2️⃣  Actualizando cantidades de stock...\n";
        $this->actualizarCantidadesStock();

        // 3. Actualizar movimientos existentes
        echo "  3️⃣  Actualizando movimientos existentes...\n";
        $this->actualizarMovimientos();

        // 4. Crear nuevos movimientos variados
        echo "  4️⃣  Creando movimientos variados...\n";
        $this->crearMovimientosVariados();

        echo "  ✅ Datos reales generados correctamente\n\n";
    }

    /**
     * Actualizar stock mínimo de manera realista
     */
    private function actualizarStockMinimo(): void
    {
        // Asignar stock mínimo basado en categoría/tipo
        Producto::where('activo', true)->each(function ($producto) {
            // Stock mínimo: entre 5 y 20 según el producto
            $stockMinimo = rand(5, 20);
            $producto->update(['stock_minimo' => $stockMinimo]);
        });
    }

    /**
     * Actualizar cantidades de stock para que sean realistas
     */
    private function actualizarCantidadesStock(): void
    {
        StockProducto::where('cantidad', '<=', 0)->each(function ($stock) {
            // Generar cantidad realista (50% posibilidad de estar bajo stock)
            $tieneStockBajo = rand(0, 1) === 1;

            if ($tieneStockBajo) {
                // Stock bajo: entre 1 y 10
                $cantidad = rand(1, 10);
            } else {
                // Stock normal: entre 20 y 100
                $cantidad = rand(20, 100);
            }

            $stock->update(['cantidad' => $cantidad]);
        });

        echo "    ✓ Cantidades actualizadas a valores realistas\n";
    }

    /**
     * Actualizar movimientos existentes para que tengan cantidades
     */
    private function actualizarMovimientos(): void
    {
        MovimientoInventario::where('cantidad', '=', 0)->each(function ($mov) {
            $cantidad = rand(1, 50);

            $mov->update([
                'cantidad' => $cantidad,
                'cantidad_anterior' => max(0, $mov->cantidad_posterior - $cantidad),
                'cantidad_posterior' => $mov->cantidad_posterior + $cantidad,
            ]);
        });

        echo "    ✓ Movimientos existentes actualizados con cantidades\n";
    }

    /**
     * Crear nuevos movimientos variados
     */
    private function crearMovimientosVariados(): void
    {
        $almacenes = Almacen::where('activo', true)->pluck('id')->toArray();
        $productos = Producto::where('activo', true)->limit(50)->pluck('id')->toArray();

        if (empty($almacenes) || empty($productos)) {
            echo "    ⚠️  No hay almacenes o productos disponibles\n";
            return;
        }

        // Crear movimientos de los últimos 6 días
        for ($daysAgo = 6; $daysAgo >= 0; $daysAgo--) {
            $fecha = now()->subDays($daysAgo);

            // 5-10 movimientos por día
            $numMovimientos = rand(5, 10);

            for ($i = 0; $i < $numMovimientos; $i++) {
                $productoId = $productos[array_rand($productos)];
                $almacenId = $almacenes[array_rand($almacenes)];

                // Obtener stock actual
                $stock = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->first();

                if (!$stock) {
                    continue;
                }

                $cantidadAnterior = $stock->cantidad;
                $cantidad = rand(1, 30);
                $cantidadPosterior = $cantidadAnterior + $cantidad;

                // Actualizar stock
                $stock->update([
                    'cantidad' => $cantidadPosterior,
                    'cantidad_disponible' => $cantidadPosterior,
                ]);

                // Crear movimiento
                MovimientoInventario::create([
                    'stock_producto_id' => $stock->id,
                    'cantidad' => $cantidad,
                    'cantidad_anterior' => $cantidadAnterior,
                    'cantidad_posterior' => $cantidadPosterior,
                    'fecha' => $fecha->addHours(rand(8, 18))->addMinutes(rand(0, 59)),
                    'numero_documento' => 'MOV-' . strtoupper(uniqid()),
                    'observacion' => 'Movimiento de prueba',
                    'tipo' => 'ENTRADA_COMPRA',
                    'user_id' => 1,
                    'ip_dispositivo' => '127.0.0.1',
                ]);
            }
        }

        echo "    ✓ Movimientos variados creados (últimos 6 días)\n";
    }
}
