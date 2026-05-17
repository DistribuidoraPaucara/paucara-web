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
        Schema::table('entregas', function (Blueprint $table) {
            // Campos para cancelación de entregas
            $table->string('motivo_cancelacion')->nullable()->after('motivo_novedad')
                ->comment('Razón por la que se canceló la entrega');

            $table->dateTime('cancelada_en')->nullable()->after('motivo_cancelacion')
                ->comment('Fecha y hora de la cancelación');

            $table->unsignedBigInteger('cancelada_por_id')->nullable()->after('cancelada_en')
                ->comment('ID del usuario que canceló la entrega');

            // FK a usuarios (opcional, para referencia)
            $table->foreign('cancelada_por_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropForeign(['cancelada_por_id']);
            $table->dropColumn(['motivo_cancelacion', 'cancelada_en', 'cancelada_por_id']);
        });
    }
};
