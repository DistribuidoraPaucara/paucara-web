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
        Schema::create('detalle_asiento_contables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asiento_contable_id')->constrained()->cascadeOnDelete();
            $table->string('codigo_cuenta');         // Código del plan de cuentas
            $table->string('nombre_cuenta');         // Nombre de la cuenta
            $table->text('descripcion')->nullable(); // Descripción específica del movimiento
            $table->decimal('debe', 15, 2)->default(0);
            $table->decimal('haber', 15, 2)->default(0);
            $table->integer('orden')->default(1); // Orden de presentación
            $table->timestamps();

            // Índices
            $table->index(['asiento_contable_id', 'codigo_cuenta']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_asiento_contables');
    }
};
