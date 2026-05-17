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
        Schema::create('codigos_barra', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->string('codigo')->index(); // El código de barras actual
            $table->string('tipo')->default('EAN'); // Tipo: EAN, UPC, CODE128, etc.
            $table->boolean('es_principal')->default(false); // Si es el código principal
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índices únicos para evitar duplicados
            $table->unique(['codigo', 'activo'], 'unique_active_codigo');
            $table->index(['producto_id', 'es_principal', 'activo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codigos_barra');
    }
};
