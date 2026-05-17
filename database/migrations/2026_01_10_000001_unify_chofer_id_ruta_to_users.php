<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * UNIFICACIÓN: Cambiar chofer_id en rutas de empleados.id a users.id
 *
 * RAZÓN:
 * - Entrega.chofer_id ya apunta a users.id
 * - Vehículo.chofer_asignado_id apunta a users.id
 * - Un chofer es fundamentalmente un User con rol 'Chofer'
 * - Empleado es un registro adicional de datos
 *
 * ARQUITECTURA UNIFICADA:
 *   chofer_id → users.id (en Entrega, Ruta, Vehículo)
 *   User → empleado() [relación opcional para datos adicionales]
 *
 * ANTES:
 *   rutas.chofer_id → empleados.id
 *
 * DESPUÉS:
 *   rutas.chofer_id → users.id (igual que entregas)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rutas', function (Blueprint $table) {
            // 1. Eliminar la constraint actual (apunta a empleados)
            $table->dropForeign(['chofer_id']);

            // 2. Cambiar la constraint para apuntar a users
            $table->foreign('chofer_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null')
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('rutas', function (Blueprint $table) {
            // Revertir a la constraint anterior (apunta a empleados)
            $table->dropForeign(['chofer_id']);

            $table->foreign('chofer_id')
                ->references('id')
                ->on('empleados')
                ->onDelete('cascade');
        });
    }
};
