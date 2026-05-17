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
        Schema::create('prestable_precios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('cascade');
            $table->enum('tipo_precio', ['VENTA', 'PRESTAMO']); // VENTA o PRESTAMO
            $table->decimal('valor', 12, 2); // precio en Bs.
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índice para búsquedas frecuentes
            $table->index(['prestable_id', 'tipo_precio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestable_precios');
    }
};
