<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Actualizar el enum de estado_logistico para soportar el nuevo flujo de entregas consolidadas
     *
     * Estados anteriores (básicos):
     * - PENDIENTE_ENVIO: Aún no se ha iniciado el envío
     * - PREPARANDO: Se está preparando la carga
     * - ENVIADO: Se ha despachado
     * - ENTREGADO: Se ha entregado exitosamente
     *
     * Estados nuevos (granulares con entregas):
     * - SIN_ENTREGA: No tiene entregas asignadas
     * - PROGRAMADO: Tiene entregas en estado PROGRAMADO
     * - EN_PREPARACION: Tiene entregas en preparación de carga
     * - EN_TRANSITO: Tiene entregas en tránsito
     * - ENTREGADA: Todas las entregas han sido entregadas
     * - PROBLEMAS: Una o más entregas con novedad/rechazo
     * - CANCELADA: Todas las entregas fueron canceladas
     */
    public function up(): void
    {
        // PostgreSQL: Cambiar el tipo ENUM usando una columna temporal
        Schema::table('ventas', function (Blueprint $table) {
            // Crear una columna temporal con el nuevo enum
            $table->enum('estado_logistico_new', [
                'SIN_ENTREGA',
                'PENDIENTE_ENVIO',
                'PROGRAMADO',
                'PREPARANDO',
                'EN_PREPARACION',
                'EN_TRANSITO',
                'ENVIADO',
                'ENTREGADO',
                'ENTREGADA',
                'PROBLEMAS',
                'CANCELADA'
            ])->nullable()->after('estado_logistico');
        });

        // Copiar datos de la columna vieja a la nueva
        DB::statement("UPDATE ventas SET estado_logistico_new = CAST(estado_logistico AS VARCHAR)");

        // Eliminar la columna vieja
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn('estado_logistico');
        });

        // Renombrar la nueva columna
        Schema::table('ventas', function (Blueprint $table) {
            $table->renameColumn('estado_logistico_new', 'estado_logistico');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // PostgreSQL no permite eliminar valores de un tipo ENUM
        // Así que la reversión se realiza manualmente o se requiere recrear el tipo
        // Para desarrollo, dejar como está
        throw new \Exception('Cannot revert this migration. Manual intervention required on PostgreSQL ENUM.');
    }
};
