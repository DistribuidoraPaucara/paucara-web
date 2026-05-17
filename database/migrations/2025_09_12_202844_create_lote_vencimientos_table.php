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
        Schema::create('lotes_vencimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detalle_compra_id')->constrained('detalle_compras')->onDelete('cascade');
            $table->string('numero_lote');
            $table->date('fecha_vencimiento');
            $table->integer('cantidad_inicial');
            $table->integer('cantidad_actual');
            $table->enum('estado_vencimiento', ['VIGENTE', 'PROXIMO_VENCER', 'VENCIDO'])->default('VIGENTE');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // Índices para mejorar el rendimiento
            $table->index(['estado_vencimiento']);
            $table->index(['fecha_vencimiento']);
            $table->index(['detalle_compra_id']);
            $table->index(['numero_lote']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lotes_vencimientos');
    }
};
