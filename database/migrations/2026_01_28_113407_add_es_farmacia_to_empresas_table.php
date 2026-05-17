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
        Schema::table('empresas', function (Blueprint $table) {
            // ✅ Agregar columna booleana para identificar si la empresa es farmacia
            // Esto permite mostrar/ocultar campos de medicamentos (principio_activo, uso_de_medicacion)
            $table->boolean('es_farmacia')
                ->default(false)
                ->after('permite_productos_fraccionados')
                ->comment('Indica si la empresa es una farmacia (habilita campos de medicamentos)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn('es_farmacia');
        });
    }
};
