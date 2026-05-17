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
     * Agregar soporte para la funcionalidad de pickup (retiro en almacén)
     * Permite a los clientes crear pedidos para recoger en lugar de pedir delivery.
     */
    public function up(): void
    {
        // Agregar campos a tabla proformas
        Schema::table('proformas', function (Blueprint $table) {
            // Nuevo campo para tipo de entrega (DELIVERY o PICKUP)
            $table->enum('tipo_entrega', ['DELIVERY', 'PICKUP'])
                ->default('DELIVERY')
                ->after('canal_origen');

            // Agregar más detalles de hora de fin si no existen
            if (!Schema::hasColumn('proformas', 'hora_entrega_solicitada_fin')) {
                $table->time('hora_entrega_solicitada_fin')->nullable()->after('hora_entrega_solicitada');
            }

            if (!Schema::hasColumn('proformas', 'hora_entrega_confirmada_fin')) {
                $table->time('hora_entrega_confirmada_fin')->nullable()->after('hora_entrega_confirmada');
            }

            // Índice para performance
            $table->index(['tipo_entrega', 'estado']);
        });

        // Agregar campos a tabla ventas
        Schema::table('ventas', function (Blueprint $table) {
            // Nuevo campo para tipo de entrega
            $table->enum('tipo_entrega', ['DELIVERY', 'PICKUP'])
                ->default('DELIVERY')
                ->after('canal_origen');

            // Campos para confirmación de pickup por cliente (a través de la app)
            $table->timestamp('pickup_confirmado_cliente_en')->nullable()->after('estado_logistico');
            $table->unsignedBigInteger('pickup_confirmado_cliente_por_id')->nullable()->after('pickup_confirmado_cliente_en');

            // Campos para confirmación de pickup por empleado (en el almacén)
            $table->timestamp('pickup_confirmado_empleado_en')->nullable()->after('pickup_confirmado_cliente_por_id');
            $table->unsignedBigInteger('pickup_confirmado_empleado_por_id')->nullable()->after('pickup_confirmado_empleado_en');

            // Foreign keys para los usuarios que confirman pickup
            $table->foreign('pickup_confirmado_cliente_por_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            $table->foreign('pickup_confirmado_empleado_por_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            // Índice para performance
            $table->index(['tipo_entrega', 'estado_logistico']);
        });

        // Actualizar enum de estado_logistico para incluir nuevos estados de pickup
        Schema::table('ventas', function (Blueprint $table) {
            // Crear columna temporal con nuevo enum que incluya PENDIENTE_RETIRO y RETIRADO
            $table->enum('estado_logistico_new', [
                'SIN_ENTREGA',
                'PENDIENTE_ENVIO',
                'PENDIENTE_RETIRO',      // NUEVO: Para pickups pendientes
                'PROGRAMADO',
                'PREPARANDO',
                'EN_PREPARACION',
                'EN_TRANSITO',
                'ENVIADO',
                'ENTREGADO',
                'ENTREGADA',
                'RETIRADO',              // NUEVO: Para pickups completados
                'PROBLEMAS',
                'CANCELADA'
            ])->nullable()->after('estado_logistico');
        });

        // Copiar datos de la columna vieja a la nueva (preservar valores existentes)
        DB::statement("UPDATE ventas SET estado_logistico_new = CAST(estado_logistico AS VARCHAR) WHERE estado_logistico IS NOT NULL");

        // Eliminar columna vieja
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn('estado_logistico');
        });

        // Renombrar columna nueva
        Schema::table('ventas', function (Blueprint $table) {
            $table->renameColumn('estado_logistico_new', 'estado_logistico');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Estos cambios son de una sola vía en PostgreSQL por el ENUM
            // Se requiere intervención manual para revertir completamente
            $table->dropForeign(['pickup_confirmado_cliente_por_id']);
            $table->dropForeign(['pickup_confirmado_empleado_por_id']);
            $table->dropColumn([
                'pickup_confirmado_cliente_en',
                'pickup_confirmado_cliente_por_id',
                'pickup_confirmado_empleado_en',
                'pickup_confirmado_empleado_por_id',
                'tipo_entrega',
            ]);
            $table->dropIndex(['tipo_entrega', 'estado_logistico']);
        });

        Schema::table('proformas', function (Blueprint $table) {
            $table->dropIndex(['tipo_entrega', 'estado']);
            $table->dropColumn('tipo_entrega');

            if (Schema::hasColumn('proformas', 'hora_entrega_solicitada_fin')) {
                $table->dropColumn('hora_entrega_solicitada_fin');
            }

            if (Schema::hasColumn('proformas', 'hora_entrega_confirmada_fin')) {
                $table->dropColumn('hora_entrega_confirmada_fin');
            }
        });
    }
};
