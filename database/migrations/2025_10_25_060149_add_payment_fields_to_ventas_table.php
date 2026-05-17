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
        Schema::table('ventas', function (Blueprint $table) {
            $table->decimal('monto_pagado', 12, 2)->default(0)->after('monto_total');
            $table->decimal('monto_pendiente', 12, 2)->nullable()->after('monto_pagado');
            $table->string('politica_pago')->default('CONTRA_ENTREGA')->after('monto_pendiente');
            $table->string('estado_pago')->default('PENDIENTE')->after('politica_pago');

            // Índices para búsquedas frecuentes
            $table->index('estado_pago');
            $table->index(['cliente_id', 'estado_pago']);
            $table->index('politica_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['estado_pago']);
            $table->dropIndex(['cliente_id', 'estado_pago']);
            $table->dropIndex(['politica_pago']);
            $table->dropColumn([
                'monto_pagado',
                'monto_pendiente',
                'politica_pago',
                'estado_pago'
            ]);
        });
    }
};
