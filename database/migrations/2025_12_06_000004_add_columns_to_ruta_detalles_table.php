<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar columnas faltantes a ruta_detalles para mejorar
     * tracking de cambios dinámicos y ventanas de entrega
     */
    public function up(): void
    {
        Schema::table('ruta_detalles', function (Blueprint $table) {
            // Referencia a la ventana de entrega preferida del cliente
            $table->foreignId('ventana_entrega_cliente_id')
                ->nullable()
                ->after('envio_id')
                ->constrained('ventanas_entrega_cliente')
                ->onDelete('set null');

            // Orden original planificado (antes de cambios dinámicos)
            $table->integer('secuencia_original')
                ->nullable()
                ->after('secuencia')
                ->comment('Secuencia original planificada');

            // Distancia a la siguiente parada (en km)
            $table->decimal('distancia_a_siguiente_km', 10, 2)
                ->nullable()
                ->after('longitud')
                ->comment('Distancia hasta la próxima parada');

            // Tiempo de espera en esta parada
            $table->integer('tiempo_espera_minutos')
                ->nullable()
                ->after('distancia_a_siguiente_km')
                ->comment('Minutos esperando en esta ubicación');

            // Fue reorganizada dinámicamente?
            $table->boolean('fue_reorganizada')
                ->default(false)
                ->after('tiempo_espera_minutos')
                ->comment('Si se cambió la secuencia después de planificar');

            // SLA: fue entregada a tiempo?
            $table->boolean('fue_on_time')
                ->nullable()
                ->after('fue_reorganizada')
                ->comment('true si se entregó dentro de la ventana estimada');

            // Minutos de retraso/adelanto
            $table->integer('minutos_diferencia')
                ->nullable()
                ->after('fue_on_time')
                ->comment('Minutos de diferencia (negativo=adelanto, positivo=retraso)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruta_detalles', function (Blueprint $table) {
            $table->dropForeign(['ventana_entrega_cliente_id']);
            $table->dropColumn([
                'ventana_entrega_cliente_id',
                'secuencia_original',
                'distancia_a_siguiente_km',
                'tiempo_espera_minutos',
                'fue_reorganizada',
                'fue_on_time',
                'minutos_diferencia'
            ]);
        });
    }
};
