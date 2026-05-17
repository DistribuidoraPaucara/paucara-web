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
        Schema::table('cuentas_por_pagar', function (Blueprint $table) {
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('monto_total', 15, 2)->nullable()->after('monto_original');
            $table->decimal('monto_pagado', 15, 2)->default(0)->after('monto_total');
            $table->string('referencia_documento')->nullable()->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas_por_pagar', function (Blueprint $table) {
            $table->dropConstrainedForeignId('usuario_id');
            $table->dropColumn(['monto_total', 'monto_pagado', 'referencia_documento']);
        });
    }
};
