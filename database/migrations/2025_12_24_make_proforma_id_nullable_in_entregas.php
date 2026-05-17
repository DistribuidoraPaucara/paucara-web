<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Hacer proforma_id nullable para soportar entregas basadas solo en venta_id
     * Mejora: Las entregas pueden venir de venta_id (nuevo flujo) o proforma_id (legacy)
     */
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Cambiar proforma_id a nullable para soportar el nuevo flujo de venta
            $table->foreignId('proforma_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Revertir a NOT NULL (nota: esto puede fallar si hay datos nulos)
            $table->foreignId('proforma_id')->nullable(false)->change();
        });
    }
};
