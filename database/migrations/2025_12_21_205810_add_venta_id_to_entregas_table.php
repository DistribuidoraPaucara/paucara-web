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
        Schema::table('entregas', function (Blueprint $table) {
            // Agregar venta_id (nullable para compatibilidad con entregas existentes vinculadas a proformas)
            $table->foreignId('venta_id')->nullable()->after('proforma_id')->constrained('ventas')->onDelete('cascade');

            // Agregar campos faltantes para consolidación con envios
            $table->decimal('peso_kg', 8, 2)->nullable()->after('direccion_cliente_id');
            $table->decimal('volumen_m3', 8, 3)->nullable()->after('peso_kg');

            // Índices para performance
            $table->index('venta_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropForeign(['venta_id']);
            $table->dropIndex(['venta_id']);
            $table->dropColumn(['venta_id', 'peso_kg', 'volumen_m3']);
        });
    }
};