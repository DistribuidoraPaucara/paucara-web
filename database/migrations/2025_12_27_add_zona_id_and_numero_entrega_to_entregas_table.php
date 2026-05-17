<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar campos necesarios para la nueva arquitectura:
     * - zona_id: Para agrupar entregas por localidad/zona geográfica
     * - numero_entrega: Identificador único y legible (ENT-20251227-0001)
     */
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Zona/Localidad para agrupar entregas de la misma área
            // Nullable inicialmente para no romper datos existentes
            $table->unsignedBigInteger('zona_id')
                ->nullable()
                ->after('chofer_id')
                ->comment('Zona geográfica para agrupar entregas por localidad');

            // Número de entrega legible (diferente de ID)
            // Formato: ENT-20251227-0001
            $table->string('numero_entrega')
                ->nullable()
                ->unique()
                ->after('zona_id')
                ->comment('Identificador único y legible de la entrega');

            // Foreign key para zona (si existe tabla de zonas)
            // Comentado por ahora, descomenta si tienes tabla de zonas
            // $table->foreign('zona_id')
            //     ->references('id')
            //     ->on('zonas')
            //     ->onDelete('set null');

            // Índices
            $table->index('zona_id');
            $table->index('numero_entrega');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropIndex(['zona_id']);
            $table->dropIndex(['numero_entrega']);

            // Soltar FK si fue creada
            // $table->dropForeign(['zona_id']);

            $table->dropColumn(['zona_id', 'numero_entrega']);
        });
    }
};
