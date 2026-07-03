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
        Schema::table('devolucion_cliente', function (Blueprint $table) {
            $table->enum('estado', ['ACTIVA', 'ANULADA'])->default('ACTIVA')->after('chofer_id');
            $table->text('razon_anulacion')->nullable()->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_cliente', function (Blueprint $table) {
            $table->dropColumn(['estado', 'razon_anulacion']);
        });
    }
};
