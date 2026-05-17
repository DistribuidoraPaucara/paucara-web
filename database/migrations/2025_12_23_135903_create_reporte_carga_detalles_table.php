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
        Schema::create('reporte_carga_detalles', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->unsignedBigInteger('reporte_carga_id');
            $table->unsignedBigInteger('detalle_venta_id')->nullable();
            $table->unsignedBigInteger('producto_id');

            // Información de carga
            $table->integer('cantidad_solicitada');
            $table->integer('cantidad_cargada')->default(0);
            $table->decimal('peso_kg', 10, 2)->nullable();
            $table->text('notas')->nullable();

            // Verificación
            $table->boolean('verificado')->default(false);
            $table->unsignedBigInteger('verificado_por')->nullable();
            $table->timestamp('fecha_verificacion')->nullable();

            // Foreign keys
            $table->foreign('reporte_carga_id')->references('id')->on('reporte_cargas')->onDelete('cascade');
            $table->foreign('detalle_venta_id')->references('id')->on('detalle_ventas')->onDelete('set null');
            $table->foreign('producto_id')->references('id')->on('productos')->onDelete('restrict');
            $table->foreign('verificado_por')->references('id')->on('users')->onDelete('set null');

            // Índices
            $table->index(['reporte_carga_id', 'verificado']);
            $table->index(['producto_id', 'cantidad_cargada']);
            $table->unique(['reporte_carga_id', 'detalle_venta_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte_carga_detalles');
    }
};
