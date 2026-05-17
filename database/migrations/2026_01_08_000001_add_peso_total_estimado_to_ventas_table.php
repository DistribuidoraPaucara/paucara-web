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
        Schema::table('ventas', function (Blueprint $table) {
            // Agregar columna de peso total estimado
            // Se calcula como: Σ(cantidad × peso_producto) para cada detalle
            $table->decimal('peso_total_estimado', 10, 2)
                ->nullable()
                ->default(0)
                ->after('total')
                ->comment('Peso total estimado en kg calculado al crear la venta (suma de cantidad * peso_producto)');

            // Índice para búsquedas rápidas por peso
            $table->index('peso_total_estimado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['peso_total_estimado']);
            $table->dropColumn('peso_total_estimado');
        });
    }
};
