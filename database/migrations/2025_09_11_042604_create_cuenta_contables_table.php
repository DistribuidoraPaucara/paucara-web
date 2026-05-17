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
        Schema::create('cuenta_contables', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // Ej: 1.1.01.001
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto']);
            $table->enum('naturaleza', ['deudora', 'acreedora']); // Para saber si aumenta con debe o haber
            $table->string('codigo_padre')->nullable();           // Para jerarquía de cuentas
            $table->integer('nivel')->default(1);                 // Nivel en la jerarquía
            $table->boolean('acepta_movimiento')->default(true);  // Si acepta asientos directos
            $table->boolean('activa')->default(true);
            $table->timestamps();

            // Índices
            $table->index('codigo_padre');
            $table->index(['tipo', 'activa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuenta_contables');
    }
};
