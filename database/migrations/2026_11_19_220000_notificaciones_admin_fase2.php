<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pantalla administrativa de notificaciones (Fase 2)
 *
 * - notifications.grupo_id: identifica todas las filas creadas por un mismo
 *   evento (una proforma actualizada → N destinatarios = 1 grupo).
 * - notificaciones_envios: historial de cada push FCM (enviado / fallido).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->uuid('grupo_id')->nullable()->after('type');
            $table->index('grupo_id');
        });

        Schema::create('notificaciones_envios', function (Blueprint $table) {
            $table->id();
            $table->string('canal', 20)->default('fcm');
            $table->string('tipo', 100);                       // proforma.actualizada, recurrente.informativo, ...
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('token_sufijo', 16)->nullable();    // últimos caracteres del token, para identificar el dispositivo
            $table->string('estado', 20);                      // enviado | fallido
            $table->string('error_codigo', 60)->nullable();    // UNREGISTERED, INVALID_ARGUMENT, ...
            $table->text('error_detalle')->nullable();
            $table->string('titulo')->nullable();
            $table->json('referencia')->nullable();            // {proforma_id, notificacion_recurrente_id, ...}
            $table->timestamp('created_at')->useCurrent();

            $table->index('created_at');
            $table->index(['estado', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones_envios');
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['grupo_id']);
            $table->dropColumn('grupo_id');
        });
    }
};
