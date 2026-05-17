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
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->enum('tipo_prestamo', ['canastillas', 'embases', 'canastillas_embases'])
                ->default('canastillas_embases')
                ->after('chofer_id')
                ->comment('Tipo de préstamo: solo canastillas, solo embases, o ambos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->dropColumn('tipo_prestamo');
        });
    }
};
