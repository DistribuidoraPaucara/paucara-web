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
        Schema::create('prestable_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->integer('cantidad_disponible')->default(0); // puedo vender o prestar
            $table->integer('cantidad_en_prestamo_cliente')->default(0); // en poder del cliente
            $table->integer('cantidad_en_prestamo_proveedor')->default(0); // en poder del proveedor
            $table->integer('cantidad_vendida')->default(0); // que el cliente compró (no se devuelve)
            $table->timestamps();

            // Constrains para evitar duplicados
            $table->unique(['prestable_id', 'almacen_id']);

            // Índices para búsquedas
            $table->index(['prestable_id', 'almacen_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestable_stock');
    }
};
