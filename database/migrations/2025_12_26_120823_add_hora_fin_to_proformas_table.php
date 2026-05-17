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
        Schema::table('proformas', function (Blueprint $table) {
            // Agregar hora de fin para el rango de entrega solicitada
            // Después de hora_entrega_solicitada
            if (!Schema::hasColumn('proformas', 'hora_entrega_solicitada_fin')) {
                $table->time('hora_entrega_solicitada_fin')
                    ->nullable()
                    ->after('hora_entrega_solicitada')
                    ->comment('Hora de fin preferida del rango de entrega solicitada');
            }

            // Agregar hora de fin para el rango de entrega confirmada
            // Después de hora_entrega_confirmada
            if (!Schema::hasColumn('proformas', 'hora_entrega_confirmada_fin')) {
                $table->time('hora_entrega_confirmada_fin')
                    ->nullable()
                    ->after('hora_entrega_confirmada')
                    ->comment('Hora de fin confirmada del rango de entrega');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            if (Schema::hasColumn('proformas', 'hora_entrega_solicitada_fin')) {
                $table->dropColumn('hora_entrega_solicitada_fin');
            }
            if (Schema::hasColumn('proformas', 'hora_entrega_confirmada_fin')) {
                $table->dropColumn('hora_entrega_confirmada_fin');
            }
        });
    }
};
