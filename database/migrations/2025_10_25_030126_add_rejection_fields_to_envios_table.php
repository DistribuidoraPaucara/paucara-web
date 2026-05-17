<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar campos para manejar rechazos y problemas de entrega:
     * - Cliente ausente
     * - Tienda cerrada
     * - Otros problemas
     *
     * Permite guardar fotos como evidencia y motivos detallados
     */
    public function up(): void
    {
        Schema::table('envios', function (Blueprint $table) {
            // ✅ Estado del resultado de la entrega
            $table->string('estado_entrega')
                ->nullable()
                ->after('estado')
                ->comment('EXITOSA, CLIENTE_AUSENTE, TIENDA_CERRADA, OTRO_PROBLEMA');

            // ✅ Motivo del rechazo (si aplica)
            $table->text('motivo_rechazo')
                ->nullable()
                ->after('estado_entrega')
                ->comment('Descripción del problema o rechazo');

            // ✅ Fotos como evidencia (JSON array de paths)
            $table->json('fotos_rechazo')
                ->nullable()
                ->after('motivo_rechazo')
                ->comment('Array JSON de rutas a fotos de evidencia');

            // ✅ Fecha/hora del intento de entrega fallido
            $table->dateTime('fecha_intento_entrega')
                ->nullable()
                ->after('fotos_rechazo')
                ->comment('Cuándo se intentó entregar');

            // ✅ Índices para búsquedas rápidas
            $table->index('estado_entrega');
            $table->index('fecha_intento_entrega');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('envios', function (Blueprint $table) {
            $table->dropIndex(['estado_entrega']);
            $table->dropIndex(['fecha_intento_entrega']);
            $table->dropColumn([
                'estado_entrega',
                'motivo_rechazo',
                'fotos_rechazo',
                'fecha_intento_entrega',
            ]);
        });
    }
};
