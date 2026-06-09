<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devolucion_cliente_detalle_almacenes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('devolucion_cliente_detalle_id');
            $table->unsignedBigInteger('almacenes_prestables_id');
            $table->integer('cantidad_devuelta')->unsigned()->default(0);
            $table->integer('cantidad_dañada_parcial')->unsigned()->default(0);
            $table->integer('cantidad_dañada_total')->unsigned()->default(0);
            $table->decimal('monto_garantia_devuelta', 12, 2)->default(0);
            $table->boolean('es_proveedor')->default(false);
            $table->timestamps();

            $table->unique(['devolucion_cliente_detalle_id', 'almacenes_prestables_id'], 'devol_client_det_alm_unique');
            $table->index(['devolucion_cliente_detalle_id']);
            $table->index(['almacenes_prestables_id']);
            $table->index(['es_proveedor']);

            $table->foreign('devolucion_cliente_detalle_id', 'devol_client_det_alm_fk1')
                ->references('id')->on('devolucion_cliente_detalle')->onDelete('cascade');
            $table->foreign('almacenes_prestables_id', 'devol_client_det_alm_fk2')
                ->references('id')->on('almacenes_prestables')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devolucion_cliente_detalle_almacenes');
    }
};
