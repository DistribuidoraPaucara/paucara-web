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
        Schema::table('detalle_proformas', function (Blueprint $table) {
            // ✅ NUEVO: Campos para soporte de tipos de precio y combos (2026-02-17)
            if (!Schema::hasColumn('detalle_proformas', 'tipo_precio_id')) {
                $table->unsignedBigInteger('tipo_precio_id')->nullable()->after('descuento');
                $table->foreign('tipo_precio_id')->references('id')->on('tipos_precio')->onDelete('set null');
            }

            if (!Schema::hasColumn('detalle_proformas', 'tipo_precio_nombre')) {
                $table->string('tipo_precio_nombre')->nullable()->after('tipo_precio_id');
            }

            if (!Schema::hasColumn('detalle_proformas', 'combo_items_seleccionados')) {
                $table->json('combo_items_seleccionados')->nullable()->after('tipo_precio_nombre');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_proformas', function (Blueprint $table) {
            // Revertir: Eliminar columnas de tipos de precio y combos
            if (Schema::hasColumn('detalle_proformas', 'combo_items_seleccionados')) {
                $table->dropColumn('combo_items_seleccionados');
            }

            if (Schema::hasColumn('detalle_proformas', 'tipo_precio_nombre')) {
                $table->dropColumn('tipo_precio_nombre');
            }

            if (Schema::hasColumn('detalle_proformas', 'tipo_precio_id')) {
                $table->dropForeign(['tipo_precio_id']);
                $table->dropColumn('tipo_precio_id');
            }
        });
    }
};
