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
        Schema::create('impuestos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique(); // IVA, ICE, IT, etc.
            $table->string('nombre', 100);          // Impuesto al Valor Agregado
            $table->string('descripcion')->nullable();
            $table->decimal('porcentaje', 5, 2); // 13.00 para IVA en Bolivia
            $table->enum('tipo_calculo', ['porcentaje', 'monto_fijo'])->default('porcentaje');
            $table->decimal('monto_fijo', 15, 2)->nullable();      // Para impuestos de monto fijo
            $table->boolean('incluido_en_precio')->default(false); // Si ya está incluido en el precio
            $table->boolean('aplica_ventas')->default(true);
            $table->boolean('aplica_compras')->default(true);
            $table->string('cuenta_contable')->nullable(); // Para integración contable
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índices
            $table->index(['codigo', 'activo']);
            $table->index('aplica_ventas');
            $table->index('aplica_compras');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('impuestos');
    }
};
