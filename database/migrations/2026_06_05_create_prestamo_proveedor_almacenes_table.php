<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prestamo_proveedor_almacenes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('prestamo_proveedor_detalle_id');
            $table->unsignedBigInteger('almacenes_prestables_id');
            $table->integer('cantidad')->unsigned();
            $table->boolean('es_proveedor')->default(false);
            $table->timestamps();

            $table->unique(['prestamo_proveedor_detalle_id', 'almacenes_prestables_id'], 'prestamo_prov_alm_unique');
            $table->index(['prestamo_proveedor_detalle_id']);
            $table->index(['almacenes_prestables_id']);

            $table->foreign('prestamo_proveedor_detalle_id', 'prestamo_prov_alm_fk1')
                ->references('id')->on('prestamo_proveedor_detalle')->onDelete('cascade');
            $table->foreign('almacenes_prestables_id', 'prestamo_prov_alm_fk2')
                ->references('id')->on('almacenes_prestables')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestamo_proveedor_almacenes');
    }
};
