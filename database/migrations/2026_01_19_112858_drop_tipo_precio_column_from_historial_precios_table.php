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
        Schema::table('historial_precios', function (Blueprint $table) {
            $table->dropIndex(['tipo_precio', 'fecha_cambio']);
            $table->dropColumn('tipo_precio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_precios', function (Blueprint $table) {
            $table->string('tipo_precio', 20)->after('usuario');
            $table->index(['tipo_precio', 'fecha_cambio']);
        });
    }
};
