<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Limpiar tabla entregas - Remover campos obsoletos y mejorar estructura
     *
     * CAMBIOS:
     * ✂️ Remover: proforma_id (legacy - ahora usa pivot entrega_venta)
     * ✂️ Remover: direccion_cliente_id (cada venta tiene su dirección)
     * ✂️ Remover: volumen_m3 (dato no utilizado)
     * ✂️ Remover: direccion_entrega (cada venta tiene su dirección)
     * ✂️ Remover: reporte_carga_id (ahora es Many-to-Many via pivot)
     *
     * ✅ Mantener: Todos los demás campos necesarios para el flujo de logística
     */
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Remover campos obsoletos
            $table->dropColumn([
                'proforma_id',           // Legacy - ahora usa pivot entrega_venta
                'direccion_cliente_id',  // Redundante - cada venta tiene su dirección
                'volumen_m3',            // Dato no utilizado
                'direccion_entrega',     // Redundante - cada venta tiene su dirección
                'reporte_carga_id',      // Ahora es Many-to-Many via reportes pivot
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Restaurar campos en caso de rollback
            $table->unsignedBigInteger('proforma_id')->nullable()->after('id');
            $table->unsignedBigInteger('direccion_cliente_id')->nullable()->after('vehiculo_id');
            $table->decimal('volumen_m3', 10, 3)->nullable()->after('peso_kg');
            $table->text('direccion_entrega')->nullable()->after('direccion_cliente_id');
            $table->unsignedBigInteger('reporte_carga_id')->nullable()->after('zona_id');

            // Agregar foreign keys de nuevo
            $table->foreign('proforma_id')->references('id')->on('proformas')->onDelete('set null');
            $table->foreign('direccion_cliente_id')->references('id')->on('direcciones_cliente')->onDelete('set null');
            $table->foreign('reporte_carga_id')->references('id')->on('reporte_cargas')->onDelete('set null');
        });
    }
};
