<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias_cliente', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('categoria_cliente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->foreignId('categoria_cliente_id')->constrained('categorias_cliente')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['cliente_id', 'categoria_cliente_id'], 'ux_cliente_categoria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categoria_cliente');
        Schema::dropIfExists('categorias_cliente');
    }
};
