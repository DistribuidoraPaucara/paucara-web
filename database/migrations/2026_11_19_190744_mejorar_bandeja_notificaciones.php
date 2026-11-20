<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Bandeja de notificaciones (Fase 1)
 *
 * 1. Índice (user_id, created_at) para la consulta de la campana: "hoy + no leídas".
 * 2. Archivado único del acumulado: hasta ahora la web nunca mostraba estas
 *    notificaciones, así que había usuarios con +25.000 sin leer. Se marcan como
 *    leídas con read_at = NULL, para distinguirlas de las leídas de verdad.
 *    La limpieza de 90 días (notificaciones:limpiar) las irá borrando.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function ($table) {
            $table->index(['user_id', 'created_at'], 'notifications_user_id_created_at_index');
        });

        DB::table('notifications')
            ->where('read', false)
            ->where('created_at', '<', now('America/La_Paz')->startOfDay())
            ->update(['read' => true, 'read_at' => null]);
    }

    public function down(): void
    {
        Schema::table('notifications', function ($table) {
            $table->dropIndex('notifications_user_id_created_at_index');
        });
        // El archivado no se revierte: no hay forma de distinguir las archivadas
        // de las que ya estaban leídas sin read_at.
    }
};
