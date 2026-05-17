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
        Schema::create('asiento_contables', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique(); // Número secuencial del asiento
            $table->date('fecha');
            $table->string('tipo_documento')->default('VENTA'); // VENTA, COMPRA, AJUSTE
            $table->string('numero_documento')->nullable();     // Número de la venta/compra
            $table->text('concepto');                           // Descripción del asiento
            $table->decimal('total_debe', 15, 2)->default(0);
            $table->decimal('total_haber', 15, 2)->default(0);
            $table->enum('estado', ['borrador', 'confirmado', 'anulado'])->default('confirmado');
            $table->text('observaciones')->nullable();

            // Relaciones polimórficas para vincular con ventas, compras, etc.
            $table->morphs('asientable'); // asientable_type, asientable_id

            // Usuario que creó el asiento
            $table->foreignId('usuario_id')->constrained('users');

            $table->timestamps();

            // Índices
            $table->index(['fecha', 'tipo_documento']);
            $table->index(['numero_documento', 'tipo_documento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asiento_contables');
    }
};
