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
        Schema::create('egresos', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique(); // EGRE20260725-0001
            $table->foreignId('tipo_operacion_caja_id')->constrained('tipo_operacion_caja');
            $table->foreignId('estado_documento_id')->constrained('estados_documento');
            $table->foreignId('usuario_id')->constrained('users');
            $table->date('fecha');
            $table->text('descripcion')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('descuento', 12, 2)->default(0);
            $table->decimal('impuesto', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->enum('estado_pago', ['PAGADA', 'PENDIENTE'])->default('PAGADA');
            $table->decimal('monto_pagado', 12, 2)->default(0);
            $table->decimal('monto_pendiente', 12, 2)->default(0);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('egresos');
    }
};
