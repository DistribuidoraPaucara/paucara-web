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
        Schema::table('cierres_caja', function (Blueprint $table) {
            $table->foreignId('estado_cierre_id')->nullable()->constrained('estados_cierre')->after('diferencia');
            $table->foreignId('usuario_verificador_id')->nullable()->constrained('users')->after('estado_cierre_id');
            $table->dateTime('fecha_verificacion')->nullable()->after('usuario_verificador_id');
            $table->text('observaciones_verificacion')->nullable()->after('fecha_verificacion');
            $table->text('observaciones_rechazo')->nullable()->after('observaciones_verificacion');
            $table->boolean('requiere_reapertura')->default(false)->after('observaciones_rechazo');

            // Índices para optimización
            $table->index(['estado_cierre_id', 'fecha']);
            $table->index('usuario_verificador_id');
        });

        // Migrar datos existentes: todos los cierres actuales pasan a CONSOLIDADA
        // Obtener el ID del estado CONSOLIDADA
        $estadoConsolidada = DB::table('estados_cierre')
            ->where('codigo', 'CONSOLIDADA')
            ->value('id');

        if ($estadoConsolidada) {
            DB::table('cierres_caja')
                ->whereNull('estado_cierre_id')
                ->update([
                    'estado_cierre_id' => $estadoConsolidada,
                    'fecha_verificacion' => DB::raw('created_at'),
                    'updated_at' => now(),
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cierres_caja', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['estado_cierre_id']);
            $table->dropForeignKeyIfExists(['usuario_verificador_id']);
            $table->dropIndexIfExists(['estado_cierre_id', 'fecha']);
            $table->dropIndexIfExists(['usuario_verificador_id']);

            $table->dropColumn([
                'estado_cierre_id',
                'usuario_verificador_id',
                'fecha_verificacion',
                'observaciones_verificacion',
                'observaciones_rechazo',
                'requiere_reapertura',
            ]);
        });
    }
};
