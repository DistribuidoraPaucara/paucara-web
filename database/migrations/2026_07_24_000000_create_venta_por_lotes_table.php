<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ✅ NUEVA TABLA: venta_por_lotes
     *
     * PROPÓSITO:
     * Trazabilidad granular de consumo de stock por venta
     * - Registra QUÉ LOTE (stock_productos.id) se consumió en CADA VENTA
     * - Soluciona: stock negativo, reversiones imprecisas, auditoría incompleta
     *
     * FLUJO DE CREACIÓN (Al crear venta):
     * 1. VentaDistribucionService::consumirStock() expande combos
     * 2. Para cada producto COMPONENTE (no combo), ordena por FIFO
     * 3. Consume del lote y REGISTRA en venta_por_lotes:
     *    ├─ venta_id: ID venta
     *    ├─ detalle_venta_id: línea de DetalleVenta
     *    ├─ producto_id: componente (nunca el combo)
     *    ├─ stock_producto_id: lote específico consumido
     *    ├─ cantidad_consumida: cuánto de ese lote
     *    └─ combo_padre_id: si vino de un combo, referencia
     *
     * FLUJO DE ANULACIÓN (Al anular venta):
     * 1. VentaDistribucionService::devolverStock() busca venta_por_lotes
     * 2. Para cada registro, DEVUELVE exactamente a ese lote:
     *    └─ stock_productos.cantidad_disponible += cantidad_consumida
     *
     * EJEMPLO (Combo con 2 componentes):
     * - Venta 123 contiene Combo "Pack Básico" (ID 50) × 2
     * - El combo tiene:
     *   - Producto A × 1 unidad
     *   - Producto B × 2 unidades
     * - Consumo expandido:
     *   - Producto A × 2 (1 × 2 combos)
     *   - Producto B × 4 (2 × 2 combos)
     * - Registros en venta_por_lotes (FIFO):
     *   - venta_id=123, detalle_venta_id=456, producto_id=10 (A), stock_id=1001, cant=2, combo_padre_id=50
     *   - venta_id=123, detalle_venta_id=456, producto_id=11 (B), stock_id=2001, cant=2, combo_padre_id=50
     *   - venta_id=123, detalle_venta_id=456, producto_id=11 (B), stock_id=2002, cant=2, combo_padre_id=50
     *
     * IMPORTANTE:
     * - Si se vende SOLO un producto (no combo), combo_padre_id = NULL
     * - Un lote NO puede ser consumido 2x en la misma venta (UNIQUE constraint)
     * - fecha_vencimiento es desnormalizado para reportes rápidos (sin JOINs)
     */
    public function up(): void
    {
        Schema::create('venta_por_lotes', function (Blueprint $table) {
            $table->id();

            // Relaciones principales
            $table->foreignId('venta_id')
                ->constrained('ventas')
                ->cascadeOnDelete()
                ->comment('Venta que consumió este lote');

            $table->foreignId('detalle_venta_id')
                ->constrained('detalle_ventas')
                ->cascadeOnDelete()
                ->comment('Línea de detalle que originó el consumo (puede ser combo)');

            $table->foreignId('producto_id')
                ->constrained('productos')
                ->restrictOnDelete()
                ->comment('Producto COMPONENTE consumido (nunca un combo)');

            $table->foreignId('stock_producto_id')
                ->constrained('stock_productos')
                ->restrictOnDelete()
                ->comment('Lote específico (registro en stock_productos)');

            // Datos del consumo
            $table->decimal('cantidad_consumida', 8, 2)
                ->comment('Cuánta cantidad de este lote se consumió en la venta');

            // Trazabilidad de combo (opcional)
            $table->foreignId('combo_padre_id')
                ->nullable()
                ->constrained('productos')
                ->restrictOnDelete()
                ->comment('Si se consumió porque se vendió un combo, referencia al combo. NULL si fue venta directa');

            // Desnormalización para auditoría/reportes
            $table->date('fecha_vencimiento')
                ->comment('Fecha vencimiento del lote (desnormalizado de stock_productos para reportes rápidos)');

            // Auditoría
            $table->timestamps();

            // Índices para búsquedas frecuentes
            $table->index('venta_id', 'idx_venta_por_lotes_venta_id');
            $table->index('detalle_venta_id', 'idx_venta_por_lotes_detalle_venta_id');
            $table->index('producto_id', 'idx_venta_por_lotes_producto_id');
            $table->index('stock_producto_id', 'idx_venta_por_lotes_stock_producto_id');
            $table->index(['venta_id', 'producto_id'], 'idx_venta_lotes_venta_producto');

            // Constraint: Una venta no puede consumir 2x del MISMO lote (pero SÍ el mismo producto de lotes diferentes)
            $table->unique(
                ['venta_id', 'stock_producto_id'],
                'unique_venta_lote'
            );

            // Full-text o análisis
            $table->index('combo_padre_id', 'idx_venta_por_lotes_combo_padre_id');
            $table->index('fecha_vencimiento', 'idx_venta_por_lotes_vencimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta_por_lotes');
    }
};
