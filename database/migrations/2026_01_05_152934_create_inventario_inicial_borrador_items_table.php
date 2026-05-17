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
        Schema::create('inventario_inicial_borrador_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrador_id')->constrained('inventario_inicial_borradores')->cascadeOnDelete();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->foreignId('almacen_id')->constrained('almacenes')->cascadeOnDelete();
            $table->decimal('cantidad', 10, 2)->nullable();
            $table->string('lote')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->decimal('precio_costo', 10, 2)->nullable();
            $table->timestamps();

            $table->unique(['borrador_id', 'producto_id', 'almacen_id']);
            $table->index('borrador_id');
            $table->index(['producto_id', 'almacen_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_inicial_borrador_items');
    }
};
