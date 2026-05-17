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
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ FASE 1: Confirmación de Pago (venta por venta)
            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'estado_pago')) {
                $table->enum('estado_pago', [
                    'PAGADO',
                    'PARCIAL',
                    'NO_PAGADO'
                ])->nullable()->after('motivo_rechazo');
            }

            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'monto_recibido')) {
                $table->decimal('monto_recibido', 12, 2)
                    ->nullable()
                    ->comment('Dinero recibido del cliente')
                    ->after('estado_pago');
            }

            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'tipo_pago_id')) {
                $table->foreignId('tipo_pago_id')
                    ->nullable()
                    ->constrained('tipos_pago')
                    ->onDelete('set null')
                    ->comment('FK a tipos_pago (Efectivo, Transferencia, etc)')
                    ->after('monto_recibido');
            }

            if (!Schema::hasColumn('entregas_venta_confirmaciones', 'motivo_no_pago')) {
                $table->string('motivo_no_pago')
                    ->nullable()
                    ->comment('Motivo si NO pagó o pagó parcial')
                    ->after('tipo_pago_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            $table->dropForeign(['tipo_pago_id']);
            $table->dropColumn([
                'estado_pago',
                'monto_recibido',
                'tipo_pago_id',
                'motivo_no_pago',
            ]);
        });
    }
};
