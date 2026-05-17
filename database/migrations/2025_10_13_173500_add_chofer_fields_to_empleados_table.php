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
        Schema::table('empleados', function (Blueprint $table) {
            // Campos específicos para choferes
            $table->string('licencia')->nullable()->after('ci');
            $table->date('fecha_vencimiento_licencia')->nullable()->after('licencia');

            // Campo para almacenar datos específicos por rol en formato JSON
            $table->json('datos_rol')->nullable()->after('observaciones');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->dropColumn(['licencia', 'fecha_vencimiento_licencia', 'datos_rol']);
        });
    }
};
