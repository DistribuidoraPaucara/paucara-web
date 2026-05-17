<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla para grupos opcionales de combos
        Schema::create('combo_grupos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combo_id')->constrained('productos')->cascadeOnDelete();
            $table->string('nombre_grupo'); // El SKU del combo
            $table->integer('cantidad_a_llevar')->default(2); // Cantidad fija
            $table->decimal('precio_grupo', 18, 2); // Precio fijo por item del grupo
            $table->timestamps();

            $table->unique(['combo_id', 'nombre_grupo']);
            $table->index(['combo_id']);
        });

        // Tabla para items dentro de un grupo
        Schema::create('combo_grupo_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grupo_id')->constrained('combo_grupos')->cascadeOnDelete();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['grupo_id', 'producto_id']);
            $table->index(['grupo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('combo_grupo_items');
        Schema::dropIfExists('combo_grupos');
    }
};
