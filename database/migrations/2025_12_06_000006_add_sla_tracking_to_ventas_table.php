<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar columnas de SLA (Service Level Agreement) a ventas
     * Para medir puntualidad de entregas
     */
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Fecha comprometida de entrega
            $table->date('fecha_entrega_comprometida')
                ->nullable()
                ->after('numero')
                ->comment('Fecha en que se prometió entregar');

            // Ventana de entrega
            $table->time('hora_entrega_comprometida')
                ->nullable()
                ->after('fecha_entrega_comprometida')
                ->comment('Hora comprometida (puntual estimada)');

            // Ventana aceptable (rango)
            $table->time('ventana_entrega_ini')
                ->nullable()
                ->after('hora_entrega_comprometida')
                ->comment('Hora inicio de ventana (ej: 09:00)');

            $table->time('ventana_entrega_fin')
                ->nullable()
                ->after('ventana_entrega_ini')
                ->comment('Hora fin de ventana (ej: 11:00)');

            // Idempotency key
            $table->string('idempotency_key', 100)
                ->nullable()
                ->after('ventana_entrega_fin')
                ->unique()
                ->comment('Clave de idempotencia');

            // SLA tracking (generados automáticamente)
            $table->boolean('fue_on_time')
                ->nullable()
                ->after('idempotency_key')
                ->comment('true si se entregó dentro de la ventana');

            $table->integer('minutos_retraso')
                ->nullable()
                ->after('fue_on_time')
                ->comment('Minutos de retraso (negativo=adelanto)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropUnique(['idempotency_key']);
            $table->dropColumn([
                'fecha_entrega_comprometida',
                'hora_entrega_comprometida',
                'ventana_entrega_ini',
                'ventana_entrega_fin',
                'idempotency_key',
                'fue_on_time',
                'minutos_retraso'
            ]);
        });
    }
};
