<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * ✅ Agregar desglose de pagos para soportar múltiples formas de pago
     * Ej: 500 efectivo + 500 transferencia + crédito restante
     */
    public function up(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ NUEVO: Array JSON con desglose de pagos
            // Estructura: [
            //   { "tipo_pago_id": 1, "tipo_pago": "Efectivo", "monto": 500.00 },
            //   { "tipo_pago_id": 2, "tipo_pago": "Transferencia", "monto": 500.00 }
            // ]
            $table->json('desglose_pagos')->nullable()
                ->comment('Array JSON con múltiples formas de pago recibidas');

            // ✅ NUEVO: Total de dinero recibido (suma de todos los pagos)
            $table->decimal('total_dinero_recibido', 12, 2)->nullable()
                ->comment('Total en efectivo/transferencia recibido');

            // ✅ NUEVO: Monto pendiente de cobro (si hubo pago parcial o crédito)
            $table->decimal('monto_pendiente', 12, 2)->nullable()
                ->comment('Dinero pendiente si fue pago parcial o crédito');

            // ✅ NUEVO: Tipo de confirmación (COMPLETA, CON_NOVEDAD)
            $table->string('tipo_confirmacion')->default('COMPLETA')
                ->comment('COMPLETA: sin problemas, CON_NOVEDAD: con inconvenientes');

            // ✅ Renombrar observaciones a observaciones_logistica para claridad
            $table->renameColumn('observaciones', 'observaciones_logistica');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            $table->dropColumn(['desglose_pagos', 'total_dinero_recibido', 'monto_pendiente', 'tipo_confirmacion']);
            $table->renameColumn('observaciones_logistica', 'observaciones');
        });
    }
};
