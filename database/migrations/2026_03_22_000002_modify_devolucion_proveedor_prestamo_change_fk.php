<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1️⃣ Agregar la nueva FK
        Schema::table('devolucion_proveedor_prestamo', function (Blueprint $table) {
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'prestamo_proveedor_detalle_id')) {
                // Temporarily add the new column
                $table->foreignId('prestamo_proveedor_detalle_id')->nullable()->constrained('prestamo_proveedor_detalle')->restrictOnDelete();
            }
        });

        // 2️⃣ Migrar datos: asignar el detalle a cada devolución
        // Por cada prestamo, tomar su primer detalle
        DB::statement('
            UPDATE devolucion_proveedor_prestamo AS dpp
            SET prestamo_proveedor_detalle_id = (
                SELECT id FROM prestamo_proveedor_detalle AS ppd
                WHERE ppd.prestamo_proveedor_id = dpp.prestamo_proveedor_id
                LIMIT 1
            )
            WHERE prestamo_proveedor_detalle_id IS NULL
        ');

        // 3️⃣ Quitar la FK antigua
        Schema::table('devolucion_proveedor_prestamo', function (Blueprint $table) {
            $table->dropForeign(['prestamo_proveedor_id']);
            $table->dropColumn('prestamo_proveedor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1️⃣ Agregar de vuelta la FK antigua
        Schema::table('devolucion_proveedor_prestamo', function (Blueprint $table) {
            $table->foreignId('prestamo_proveedor_id')->constrained('prestamo_proveedor')->restrictOnDelete();
        });

        // 2️⃣ Restaurar datos: asignar el prestamo_proveedor_id de su detalle
        DB::statement('
            UPDATE devolucion_proveedor_prestamo AS dpp
            SET prestamo_proveedor_id = (
                SELECT prestamo_proveedor_id FROM prestamo_proveedor_detalle AS ppd
                WHERE ppd.id = dpp.prestamo_proveedor_detalle_id
            )
            WHERE prestamo_proveedor_id IS NULL
        ');

        // 3️⃣ Quitar la FK nueva
        Schema::table('devolucion_proveedor_prestamo', function (Blueprint $table) {
            $table->dropForeign(['prestamo_proveedor_detalle_id']);
            $table->dropColumn('prestamo_proveedor_detalle_id');
        });
    }
};
