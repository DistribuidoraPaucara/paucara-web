<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar campos de entrega comprometida a la tabla ventas
     * Estos campos se heredan de la proforma cuando se convierte
     */
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Solo agregar columnas si no existen
            if (!Schema::hasColumn('ventas', 'fecha_entrega_comprometida')) {
                $table->date('fecha_entrega_comprometida')->nullable()->after('fecha');
            }

            if (!Schema::hasColumn('ventas', 'hora_entrega_comprometida')) {
                $table->time('hora_entrega_comprometida')->nullable()->after('fecha_entrega_comprometida');
            }

            if (!Schema::hasColumn('ventas', 'ventana_entrega_ini')) {
                $table->time('ventana_entrega_ini')->nullable()->after('hora_entrega_comprometida');
            }

            if (!Schema::hasColumn('ventas', 'ventana_entrega_fin')) {
                $table->time('ventana_entrega_fin')->nullable()->after('ventana_entrega_ini');
            }

            if (!Schema::hasColumn('ventas', 'direccion_entrega')) {
                $table->text('direccion_entrega')->nullable()->after('ventana_entrega_fin');
            }

            if (!Schema::hasColumn('ventas', 'peso_estimado')) {
                $table->decimal('peso_estimado', 8, 2)->nullable()->after('direccion_entrega');
            }

            // Índices para consultas rápidas (solo si las columnas existen)
            if (Schema::hasColumn('ventas', 'fecha_entrega_comprometida') &&
                !Schema::hasIndex('ventas', 'ventas_fecha_entrega_comprometida_estado_logistico_index')) {
                $table->index(['fecha_entrega_comprometida', 'estado_logistico']);
            }

            if (Schema::hasColumn('ventas', 'ventana_entrega_ini') &&
                !Schema::hasIndex('ventas', 'ventas_ventana_entrega_ini_ventana_entrega_fin_index')) {
                $table->index(['ventana_entrega_ini', 'ventana_entrega_fin']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['fecha_entrega_comprometida', 'estado_logistico']);
            $table->dropIndex(['ventana_entrega_ini', 'ventana_entrega_fin']);

            $table->dropColumn([
                'fecha_entrega_comprometida',
                'hora_entrega_comprometida',
                'ventana_entrega_ini',
                'ventana_entrega_fin',
                'direccion_entrega',
                'peso_estimado',
            ]);
        });
    }
};
