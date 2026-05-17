<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ NUEVO (2026-02-18): Agregar columnas para registrar conversiones de unidad
     * en productos fraccionados. Permite especificar claramente qué cantidad se
     * solicitó en qué unidad y cuánta se descargó en unidad de almacenamiento.
     */
    public function up(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // ✅ Columnas para conversión de unidades (productos fraccionados)
            $table->decimal('cantidad_solicitada', 10, 2)
                ->nullable()
                ->after('cantidad')
                ->comment('Cantidad solicitada en unidad de venta (ej: 10 unidades de tableta)');

            $table->unsignedBigInteger('unidad_venta_id')
                ->nullable()
                ->after('cantidad_solicitada')
                ->comment('ID de unidad de venta (destino) cuando se aplica conversión');

            $table->decimal('factor_conversion', 8, 4)
                ->nullable()
                ->after('unidad_venta_id')
                ->comment('Factor de conversión usado (ej: 56 = 1 caja = 56 tabletas)');

            $table->boolean('es_conversion_aplicada')
                ->default(false)
                ->after('factor_conversion')
                ->comment('¿Se aplicó conversión de unidad para este movimiento?');

            // FK a unidades_medida
            $table->foreign('unidad_venta_id')
                ->references('id')
                ->on('unidades_medida')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Eliminar FK antes de eliminar columna
            $table->dropForeign(['unidad_venta_id']);

            // Eliminar columnas
            $table->dropColumn([
                'cantidad_solicitada',
                'unidad_venta_id',
                'factor_conversion',
                'es_conversion_aplicada',
            ]);
        });
    }
};
