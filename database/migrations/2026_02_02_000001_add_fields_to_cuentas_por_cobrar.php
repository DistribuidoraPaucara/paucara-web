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
        Schema::table('cuentas_por_cobrar', function (Blueprint $table) {
            // Monto total del crédito (puede cambiar si hay intereses, etc)
            $table->decimal('monto_total', 12, 2)->nullable()->after('monto_original');

            // Cantidad ya pagada del crédito
            $table->decimal('monto_pagado', 12, 2)->default(0)->after('monto_total');

            // Referencia del documento (número de factura, etc)
            $table->string('referencia_documento')->nullable()->after('dias_vencido');

            // Tipo de crédito (CREDITO_MANUAL, CREDITO_HISTORICO, CREDITO_VENTA, etc)
            $table->string('tipo')->nullable()->after('referencia_documento');

            // Observaciones del crédito
            $table->text('observaciones')->nullable()->after('tipo');

            // Usuario que creó el crédito
            $table->unsignedBigInteger('usuario_id')->nullable()->after('observaciones');

            // Foreign key para usuario
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas_por_cobrar', function (Blueprint $table) {
            $table->dropForeignKey(['usuario_id']);
            $table->dropColumn([
                'monto_total',
                'monto_pagado',
                'referencia_documento',
                'tipo',
                'observaciones',
                'usuario_id',
            ]);
        });
    }
};
