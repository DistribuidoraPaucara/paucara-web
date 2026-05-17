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
            // ✅ FASE 2: Foto de comprobante de pago (dinero, transferencia, cheque)
            $table->text('foto_comprobante')
                ->nullable()
                ->comment('URL de foto del comprobante de pago (dinero, transferencia, cheque)')
                ->after('motivo_no_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            $table->dropColumn('foto_comprobante');
        });
    }
};
