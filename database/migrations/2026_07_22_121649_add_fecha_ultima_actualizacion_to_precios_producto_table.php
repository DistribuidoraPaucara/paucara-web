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
        Schema::table('precios_producto', function (Blueprint $table) {
            $table->timestamp('fecha_ultima_actualizacion')->nullable()->after('updated_at')->comment('Fecha de última actualización del precio');
        });

        // Poblar registros existentes con updated_at
        \Illuminate\Support\Facades\DB::table('precios_producto')
            ->update(['fecha_ultima_actualizacion' => \Illuminate\Support\Facades\DB::raw('updated_at')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precios_producto', function (Blueprint $table) {
            $table->dropColumn('fecha_ultima_actualizacion');
        });
    }
};
