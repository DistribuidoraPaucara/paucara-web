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
        Schema::table('pagos', function (Blueprint $table) {
            // Agregar campos para el sistema de compras
            $table->foreignId('cuenta_por_pagar_id')->nullable()->constrained('cuentas_por_pagar')->onDelete('cascade')->after('id');
            $table->date('fecha_pago')->nullable()->after('fecha');
            $table->string('numero_recibo')->nullable()->after('numero_transaccion');
            $table->string('numero_transferencia')->nullable()->after('numero_recibo');
            $table->string('numero_cheque')->nullable()->after('numero_transferencia');
            $table->foreignId('usuario_id')->nullable()->constrained('users')->after('observaciones');

            // Hacer campos existentes nullable para compatibilidad
            $table->bigInteger('venta_id')->nullable()->change();
            $table->bigInteger('moneda_id')->nullable()->change();

            // Añadir índices
            $table->index(['cuenta_por_pagar_id']);
            $table->index(['fecha_pago']);
            $table->index(['usuario_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            // Eliminar foreign keys
            $table->dropForeign(['cuenta_por_pagar_id']);
            $table->dropForeign(['usuario_id']);

            // Eliminar índices
            $table->dropIndex(['cuenta_por_pagar_id']);
            $table->dropIndex(['fecha_pago']);
            $table->dropIndex(['usuario_id']);

            // Eliminar columnas
            $table->dropColumn([
                'cuenta_por_pagar_id',
                'fecha_pago',
                'numero_recibo',
                'numero_transferencia',
                'numero_cheque',
                'usuario_id',
            ]);
        });
    }
};
