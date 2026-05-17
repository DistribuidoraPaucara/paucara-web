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
        Schema::create('detalle_conteos_fisicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conteo_fisico_id')->constrained('conteos_fisicos')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('stock_producto_id')->nullable()->constrained('stock_productos')->onDelete('cascade');
            $table->string('lote')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->decimal('cantidad_sistema', 12, 4); // Lo que dice el sistema
            $table->decimal('cantidad_contada', 12, 4)->nullable(); // Lo que se contó físicamente
            $table->decimal('diferencia', 12, 4)->nullable(); // Diferencia calculada
            $table->decimal('valor_unitario', 12, 4)->default(0);
            $table->decimal('valor_diferencia', 12, 2)->nullable();
            $table->enum('estado_item', ['pendiente', 'contado', 'con_diferencia', 'ajustado'])->default('pendiente');
            $table->text('observaciones')->nullable();
            $table->foreignId('contado_por')->nullable()->constrained('users');
            $table->timestamp('fecha_conteo')->nullable();
            $table->boolean('requiere_reconteo')->default(false);
            $table->text('motivo_diferencia')->nullable();
            $table->timestamps();

            // Índices
            $table->index(['conteo_fisico_id', 'estado_item']);
            $table->index(['producto_id']);
            $table->unique(['conteo_fisico_id', 'stock_producto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_conteos_fisicos');
    }
};
