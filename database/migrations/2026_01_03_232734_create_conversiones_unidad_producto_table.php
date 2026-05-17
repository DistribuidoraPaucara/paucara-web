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
        Schema::create('conversiones_unidad_producto', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('producto_id')
                ->constrained('productos')
                ->cascadeOnDelete();

            $table->foreignId('unidad_base_id')
                ->constrained('unidades_medida')
                ->restrictOnDelete()
                ->comment('Unidad en la que se almacena/compra (ej: CAJA)');

            $table->foreignId('unidad_destino_id')
                ->constrained('unidades_medida')
                ->restrictOnDelete()
                ->comment('Unidad en la que se vende (ej: TABLETA)');

            // Factor de conversión
            $table->decimal('factor_conversion', 15, 6)
                ->comment('Cuántas unidades destino hay en 1 unidad base (ej: 100 tabletas = 1 caja)');

            // Estados
            $table->boolean('activo')->default(true);
            $table->boolean('es_conversion_principal')->default(false)
                ->comment('Conversión por defecto para este producto');

            // Timestamps
            $table->timestamps();

            // Índices y constraints
            $table->unique(['producto_id', 'unidad_base_id', 'unidad_destino_id'], 'uq_conversion_producto_unidades');
            $table->index(['producto_id', 'activo'], 'idx_conversiones_producto_activo');
            $table->index('es_conversion_principal', 'idx_conversion_principal');
        });

        // Check constraint para factor > 0
        DB::statement('ALTER TABLE conversiones_unidad_producto ADD CONSTRAINT chk_factor_conversion_positivo CHECK (factor_conversion > 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversiones_unidad_producto');
    }
};
