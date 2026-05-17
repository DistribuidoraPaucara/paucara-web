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
        Schema::table('movimientos_caja', function (Blueprint $table) {
            // ✅ NUEVO: Agregar referencia directa a apertura para filtrado correcto
            $table->unsignedBigInteger('apertura_caja_id')->nullable()->after('user_id');
            $table->foreign('apertura_caja_id')
                ->references('id')
                ->on('aperturas_caja')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_caja', function (Blueprint $table) {
            $table->dropForeign(['apertura_caja_id']);
            $table->dropColumn('apertura_caja_id');
        });
    }
};
