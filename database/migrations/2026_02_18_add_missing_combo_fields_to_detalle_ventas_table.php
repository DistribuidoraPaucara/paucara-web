<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ NUEVO (2026-02-18): Agregar campos faltantes a detalle_ventas para consistencia con detalle_proformas
     * Estos campos DEBEN estar en AMBAS tablas para que ProductosTable.tsx funcione correctamente
     */
    public function up(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            // ✅ CRÍTICO: Verificar antes de agregar para evitar duplicaciones
            // Estos campos pueden ya existir de migraciones anteriores incompletas
            if (!Schema::hasColumn('detalle_ventas', 'tipo_precio_id')) {
                $table->unsignedBigInteger('tipo_precio_id')->nullable()->after('descuento');
                $table->foreign('tipo_precio_id')->references('id')->on('tipo_precios')->onDelete('set null');
            }

            if (!Schema::hasColumn('detalle_ventas', 'tipo_precio_nombre')) {
                $table->string('tipo_precio_nombre')->nullable()->after('tipo_precio_id');
            }

            if (!Schema::hasColumn('detalle_ventas', 'combo_items_seleccionados')) {
                $table->json('combo_items_seleccionados')->nullable()->after('tipo_precio_nombre');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            // Revertir en orden inverso
            if (Schema::hasColumn('detalle_ventas', 'combo_items_seleccionados')) {
                $table->dropColumn('combo_items_seleccionados');
            }

            if (Schema::hasColumn('detalle_ventas', 'tipo_precio_nombre')) {
                $table->dropColumn('tipo_precio_nombre');
            }

            if (Schema::hasColumn('detalle_ventas', 'tipo_precio_id')) {
                $table->dropForeign(['tipo_precio_id']);
                $table->dropColumn('tipo_precio_id');
            }
        });
    }
};
