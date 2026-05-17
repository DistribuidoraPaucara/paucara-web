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
        Schema::table('entregas', function (Blueprint $table) {
            // Agregar campo entregador (nombre de quién realiza la entrega)
            $table->string('entregador')->nullable()->after('observaciones')
                ->comment('Nombre de la persona que realiza la entrega');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropColumn('entregador');
        });
    }
};
