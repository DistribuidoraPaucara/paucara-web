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
        Schema::create('ajustes_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique()->comment('Número del ajuste (AJ20260215-0001)');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('cantidad_entradas')->default(0)->comment('Cantidad total de entradas');
            $table->integer('cantidad_salidas')->default(0)->comment('Cantidad total de salidas');
            $table->integer('cantidad_productos')->default(0)->comment('Cantidad de productos ajustados');
            $table->text('observacion')->nullable()->comment('Observaciones generales del ajuste');
            $table->enum('estado', ['pendiente', 'procesado'])->default('procesado')->comment('Estado del ajuste');
            $table->timestamps();

            // Índices
            $table->index('almacen_id');
            $table->index('user_id');
            $table->index('estado');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajustes_inventario');
    }
};
