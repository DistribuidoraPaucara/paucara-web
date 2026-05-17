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
        Schema::create('historial_precios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('precio_producto_id');
            $table->decimal('valor_anterior', 10, 2);
            $table->decimal('valor_nuevo', 10, 2);
            $table->timestamp('fecha_cambio');
            $table->string('motivo', 500)->nullable();
            $table->string('usuario', 100)->nullable();
            $table->string('tipo_precio', 20);
            $table->decimal('porcentaje_cambio', 5, 2)->nullable();
            $table->timestamps();

            $table->foreign('precio_producto_id')->references('id')->on('precios_producto')->onDelete('cascade');
            $table->index(['precio_producto_id', 'fecha_cambio']);
            $table->index(['tipo_precio', 'fecha_cambio']);
            $table->index('fecha_cambio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_precios');
    }
};
