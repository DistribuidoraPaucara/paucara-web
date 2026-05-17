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
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->enum('tipo_prestamo', ['canastillas', 'embases', 'canastillas_embases'])
                ->nullable()
                ->after('referencia_id')
                ->comment('Tipo de préstamo asociado (canastillas, embases, o ambos)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->dropColumn('tipo_prestamo');
        });
    }
};
