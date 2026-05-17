<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ✅ NUEVA 2026-02-13: Agregar campos para soporte de novedades y múltiples pagos
     *
     * Campos agregados:
     * - observaciones_logistica: Observaciones de la entrega (novedad, motivo, etc)
     * - tipo_entrega: COMPLETA o NOVEDAD
     * - tipo_novedad: CLIENTE_CERRADO, DEVOLUCION_PARCIAL, RECHAZADO
     * - tuvo_problema: Boolean si hubo novedad
     * - desglose_pagos: JSON array de múltiples pagos
     * - total_dinero_recibido: Total de dinero en caja
     * - monto_pendiente: Dinero pendiente de cobro
     * - tipo_confirmacion: COMPLETA o CON_NOVEDAD
     */
    public function up(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ Agregar observaciones_logistica si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'observaciones_logistica')) {
                $table->text('observaciones_logistica')->nullable()->after('observaciones');
            }

            // ✅ Agregar tipo_entrega si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'tipo_entrega')) {
                $table->enum('tipo_entrega', ['COMPLETA', 'NOVEDAD'])->default('COMPLETA')->after('observaciones_logistica');
            }

            // ✅ Agregar tipo_novedad si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'tipo_novedad')) {
                $table->enum('tipo_novedad', [
                    'CLIENTE_CERRADO',
                    'DEVOLUCION_PARCIAL',
                    'RECHAZADO'
                ])->nullable()->after('tipo_entrega');
            }

            // ✅ Agregar tuvo_problema si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'tuvo_problema')) {
                $table->boolean('tuvo_problema')->default(false)->after('tipo_novedad');
            }

            // ✅ Agregar desglose_pagos si no existe (para múltiples pagos)
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'desglose_pagos')) {
                $table->json('desglose_pagos')->nullable()->after('motivo_no_pago');
            }

            // ✅ Agregar total_dinero_recibido si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'total_dinero_recibido')) {
                $table->decimal('total_dinero_recibido', 12, 2)->nullable()->default(0)->after('desglose_pagos');
            }

            // ✅ Agregar monto_pendiente si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'monto_pendiente')) {
                $table->decimal('monto_pendiente', 12, 2)->nullable()->default(0)->after('total_dinero_recibido');
            }

            // ✅ Agregar tipo_confirmacion si no existe
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'tipo_confirmacion')) {
                $table->enum('tipo_confirmacion', ['COMPLETA', 'CON_NOVEDAD'])->default('COMPLETA')->after('monto_pendiente');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            $columns = [
                'observaciones_logistica',
                'tipo_entrega',
                'tipo_novedad',
                'tuvo_problema',
                'desglose_pagos',
                'total_dinero_recibido',
                'monto_pendiente',
                'tipo_confirmacion',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('entregas_venta_confirmaciones', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
