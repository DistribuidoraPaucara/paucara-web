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
        Schema::create('prestable_condiciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('cascade');
            $table->decimal('monto_garantia', 12, 2); // garantía al prestar
            $table->decimal('monto_daño_parcial', 12, 2); // si se devuelve con daño parcial
            $table->decimal('monto_daño_total', 12, 2); // si se devuelve dañada totalmente
            $table->text('descripcion_daño')->nullable(); // ej: "grieta", "deformación"
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índice para búsquedas
            $table->index('prestable_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestable_condiciones');
    }
};
