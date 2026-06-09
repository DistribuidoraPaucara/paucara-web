<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prestamo_cliente_almacenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_cliente_detalle_id')
                ->constrained('prestamo_cliente_detalle')
                ->onDelete('cascade');
            $table->foreignId('almacenes_prestables_id')
                ->constrained('almacenes_prestables')
                ->onDelete('restrict');
            $table->integer('cantidad')->unsigned();
            $table->boolean('es_proveedor')->default(false);
            $table->timestamps();

            $table->unique(['prestamo_cliente_detalle_id', 'almacenes_prestables_id']);
            $table->index(['prestamo_cliente_detalle_id']);
            $table->index(['almacenes_prestables_id']);
            $table->index(['es_proveedor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestamo_cliente_almacenes');
    }
};
