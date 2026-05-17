<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar índices para optimizar queries de reservas expiradas
     * y operaciones por proforma+estado
     */
    public function up(): void
    {
        Schema::table('reservas_proforma', function (Blueprint $table) {
            // Índice compuesto para búsqueda de reservas por proforma y estado
            // Usado en: $this->reservas()->expiradas()->count()
            $table->index(['proforma_id', 'estado'], 'idx_proforma_estado');

            // Índice compuesto para búsqueda de reservas expiradas
            // Usado en: where('fecha_expiracion', '<', now())->where('estado', 'ACTIVA')
            $table->index(['fecha_expiracion', 'estado'], 'idx_fecha_expiracion_estado');

            // Índice en fecha_expiracion solo (para ordenamiento y filtros por vencimiento)
            $table->index('fecha_expiracion', 'idx_fecha_expiracion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservas_proforma', function (Blueprint $table) {
            $table->dropIndex('idx_proforma_estado');
            $table->dropIndex('idx_fecha_expiracion_estado');
            $table->dropIndex('idx_fecha_expiracion');
        });
    }
};
