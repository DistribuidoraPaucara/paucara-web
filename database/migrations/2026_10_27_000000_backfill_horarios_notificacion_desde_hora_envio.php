<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Las notificaciones creadas antes de horarios_notificacion solo tienen hora_envio.
     * El envío FCM lee únicamente horarios_notificacion, así que nunca salían.
     */
    public function up(): void
    {
        $sinHorarios = DB::table('notificaciones_recurrentes as n')
            ->whereNotNull('n.hora_envio')
            ->whereNotExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('horarios_notificacion as h')
                    ->whereColumn('h.notificacion_recurrente_id', 'n.id');
            })
            ->get(['n.id', 'n.hora_envio']);

        foreach ($sinHorarios as $notificacion) {
            DB::table('horarios_notificacion')->insert([
                'notificacion_recurrente_id' => $notificacion->id,
                'hora' => substr($notificacion->hora_envio, 0, 5),
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        // No se revierte: no hay forma de distinguir estos horarios de los creados después
    }
};
