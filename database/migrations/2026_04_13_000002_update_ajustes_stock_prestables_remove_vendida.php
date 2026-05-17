<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Cambio conceptual: cantidad_vendida ya no es un estado de stock,
     * sino un acumulativo que se calcula desde prestamos_vendidos
     */
    public function up(): void
    {
        // Remover columnas de cantidad_vendida de ajustes_stock_prestables
        // ya que estas NO son un estado actual, sino un histórico de ventas
        Schema::table('ajustes_stock_prestables', function (Blueprint $table) {
            // No eliminamos las columnas existentes por compatibilidad hacia atrás
            // pero los nuevos registros no usarán estas columnas
            // La lógica de ventas ahora está en prestamos_vendidos
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hay nada que revertir, solo cambio conceptual
    }
};
