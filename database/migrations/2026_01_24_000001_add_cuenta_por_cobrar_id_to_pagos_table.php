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
            $table->foreignId('cuenta_por_cobrar_id')
                  ->nullable()
                  ->after('cuenta_por_pagar_id')
                  ->constrained('cuentas_por_cobrar')
                  ->onDelete('cascade');

            $table->index('cuenta_por_cobrar_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropForeignKey(['cuenta_por_cobrar_id']);
            $table->dropIndex(['cuenta_por_cobrar_id']);
            $table->dropColumn('cuenta_por_cobrar_id');
        });
    }
};
