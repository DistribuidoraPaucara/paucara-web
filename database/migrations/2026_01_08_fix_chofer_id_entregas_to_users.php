<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CORRECCIÓN: Cambiar chofer_id en entregas de empleados.id a users.id
 *
 * RAZÓN:
 * - Vehiculos.chofer_asignado_id apunta a users.id
 * - Entregas.chofer_id debe apuntar a users.id (consistencia)
 * - Un chofer es un User con rol 'Chofer', no un Empleado
 *
 * ANTES:
 *   entregas.chofer_id → empleados.id
 *
 * DESPUÉS:
 *   entregas.chofer_id → users.id (igual que vehiculos.chofer_asignado_id)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // 1. Eliminar la constraint actual (apunta a empleados)
            $table->dropForeign(['chofer_id']);

            // 2. Cambiar la constraint para apuntar a users
            $table->foreign('chofer_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Revertir a la constraint anterior (apunta a empleados)
            $table->dropForeign(['chofer_id']);

            $table->foreign('chofer_id')
                ->references('id')
                ->on('empleados')
                ->onDelete('set null');
        });
    }
};
