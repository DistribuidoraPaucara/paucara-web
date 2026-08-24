<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // 🏭 Nuevos campos para módulo de producción
            $table->enum('tipo_producto', ['comprado', 'elaborado_cafeteria', 'materia_prima'])
                ->default('comprado')
                ->comment('Tipo de producto: comprado (proveedor), elaborado en cafetería, o materia prima para producción');

            $table->boolean('requiere_receta')
                ->default(false)
                ->comment('Si es true, este producto elaborado requiere una receta definida');

            $table->string('unidad_medida', 50)
                ->nullable()
                ->comment('Unidad de medida específica para producción (ej: tazas, litros, kg)');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn(['tipo_producto', 'requiere_receta', 'unidad_medida']);
        });
    }
};
