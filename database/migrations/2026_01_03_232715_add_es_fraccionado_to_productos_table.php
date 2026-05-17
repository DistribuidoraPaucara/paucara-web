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
        Schema::table('productos', function (Blueprint $table) {
            $table->boolean('es_fraccionado')
                ->default(false)
                ->after('es_alquilable')
                ->comment('Permite conversiones de unidades (ej: caja → tabletas)');

            $table->index(['es_fraccionado', 'activo'], 'idx_productos_fraccionado_activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('idx_productos_fraccionado_activo');
            $table->dropColumn('es_fraccionado');
        });
    }
};
