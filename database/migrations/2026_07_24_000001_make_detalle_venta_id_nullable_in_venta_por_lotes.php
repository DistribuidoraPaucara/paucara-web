<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Para proforma-to-venta conversion, no hay mapeo directo a detalle_venta_id
     * porque los detalles se crean después de las reservas.
     * Esta migración hace que detalle_venta_id sea nullable.
     */
    public function up(): void
    {
        Schema::table('venta_por_lotes', function (Blueprint $table) {
            // Cambiar detalle_venta_id a nullable
            $table->foreignId('detalle_venta_id')
                ->nullable()
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('venta_por_lotes', function (Blueprint $table) {
            // Revertir a NOT NULL
            $table->foreignId('detalle_venta_id')
                ->nullable(false)
                ->change();
        });
    }
};
