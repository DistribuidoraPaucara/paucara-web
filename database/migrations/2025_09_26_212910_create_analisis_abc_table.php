<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analisis_abc', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('almacen_id')->nullable()->constrained('almacenes')->onDelete('cascade');
            $table->year('periodo_ano');
            $table->tinyInteger('periodo_mes')->nullable(); // NULL para análisis anual
            $table->enum('clasificacion_abc', ['A', 'B', 'C']); // Clasificación por valor
            $table->enum('clasificacion_xyz', ['X', 'Y', 'Z'])->nullable(); // Clasificación por rotación
            $table->decimal('ventas_cantidad', 12, 4)->default(0);
            $table->decimal('ventas_valor', 12, 2)->default(0);
            $table->decimal('stock_promedio', 12, 4)->default(0);
            $table->decimal('costo_promedio', 12, 4)->default(0);
            $table->decimal('rotacion_inventario', 8, 2)->default(0); // Veces que rota al año
            $table->integer('dias_cobertura')->default(0); // Días de stock
            $table->decimal('porcentaje_ventas_cantidad', 5, 2)->default(0);
            $table->decimal('porcentaje_ventas_valor', 5, 2)->default(0);
            $table->decimal('porcentaje_acumulado_valor', 5, 2)->default(0);
            $table->integer('ranking_ventas')->default(0);
            $table->boolean('producto_activo')->default(true);
            $table->boolean('tiene_movimientos')->default(false);
            $table->date('ultima_venta')->nullable();
            $table->date('ultima_compra')->nullable();
            $table->text('recomendaciones')->nullable();
            $table->timestamps();

            // Índices y claves únicas
            $table->unique(['producto_id', 'almacen_id', 'periodo_ano', 'periodo_mes']);
            $table->index(['clasificacion_abc', 'clasificacion_xyz']);
            $table->index(['periodo_ano', 'periodo_mes']);
            $table->index(['rotacion_inventario']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analisis_abc');
    }
};
