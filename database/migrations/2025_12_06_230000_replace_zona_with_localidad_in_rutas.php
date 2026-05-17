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
        Schema::table('rutas', function (Blueprint $table) {
            // Agregar localidad_id si no existe
            if (!Schema::hasColumn('rutas', 'localidad_id')) {
                $table->unsignedBigInteger('localidad_id')->nullable()->after('fecha_ruta');
                $table->foreign('localidad_id')->references('id')->on('localidades')->onDelete('restrict');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rutas', function (Blueprint $table) {
            if (Schema::hasColumn('rutas', 'localidad_id')) {
                $table->dropForeign(['localidad_id']);
                $table->dropColumn('localidad_id');
            }
        });
    }
};
