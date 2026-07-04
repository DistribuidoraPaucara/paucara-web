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
            // Nota: No cambiar el ENUM aquí para evitar conflictos con PostgreSQL
            // El campo 'estado' debe soportar los nuevos valores de todas formas

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
            // Nota: No revertir ENUM para evitar conflictos con PostgreSQL

            // Eliminar campos de auditoría
            $table->dropForeignIdFor('created_by');
            $table->dropForeignIdFor('anulada_por');
            $table->dropColumn(['created_by', 'anulada_por', 'razon_anulacion', 'fecha_anulacion']);
        });
    }
};
