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
        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            // Actualizar ENUM estado para incluir ANULADO
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'ANULADO'])->change();

            // Agregar campos de auditoría si no existen
            if (!Schema::hasColumn('prestamo_proveedor', 'created_by')) {
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->after('observaciones');
            }
            if (!Schema::hasColumn('prestamo_proveedor', 'anulada_por')) {
                $table->foreignId('anulada_por')->nullable()->constrained('users')->nullOnDelete()->after('created_by');
            }
            if (!Schema::hasColumn('prestamo_proveedor', 'razon_anulacion')) {
                $table->text('razon_anulacion')->nullable()->after('anulada_por');
            }
            if (!Schema::hasColumn('prestamo_proveedor', 'fecha_anulacion')) {
                $table->timestamp('fecha_anulacion')->nullable()->after('razon_anulacion');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_proveedor', function (Blueprint $table) {
            // Revertir ENUM
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'])->change();

            // Eliminar campos de auditoría
            $table->dropForeignIdFor('created_by');
            $table->dropForeignIdFor('anulada_por');
            $table->dropColumn(['created_by', 'anulada_por', 'razon_anulacion', 'fecha_anulacion']);
        });
    }
};
