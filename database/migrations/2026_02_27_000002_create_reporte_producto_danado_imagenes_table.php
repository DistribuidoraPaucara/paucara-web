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
        Schema::create('reporte_producto_danado_imagenes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporte_id');
            $table->string('ruta_imagen'); // Ruta relativa en storage
            $table->string('nombre_archivo');
            $table->text('descripcion')->nullable(); // Descripción de la imagen (ej: "vista frontal", "vista lateral")
            $table->timestamp('fecha_carga')->useCurrent();
            $table->timestamps();

            // Índice
            $table->index('reporte_id');

            // Relación
            $table->foreign('reporte_id')
                ->references('id')
                ->on('reportes_productos_danados')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte_producto_danado_imagenes');
    }
};
