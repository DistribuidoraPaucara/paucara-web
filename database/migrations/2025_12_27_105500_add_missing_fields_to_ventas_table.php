<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar los campos que faltaron en la migración 2025_12_22_000000
     */
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Peso estimado de la entrega (cargado desde detalles)
            if (!Schema::hasColumn('ventas', 'peso_estimado')) {
                $table->decimal('peso_estimado', 8, 2)->nullable()->after('estado_logistico');
            }

            // Volumen estimado
            if (!Schema::hasColumn('ventas', 'volumen_estimado')) {
                $table->decimal('volumen_estimado', 8, 4)->nullable()->after('peso_estimado');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            if (Schema::hasColumn('ventas', 'peso_estimado')) {
                $table->dropColumn('peso_estimado');
            }
            if (Schema::hasColumn('ventas', 'volumen_estimado')) {
                $table->dropColumn('volumen_estimado');
            }
        });
    }
};
