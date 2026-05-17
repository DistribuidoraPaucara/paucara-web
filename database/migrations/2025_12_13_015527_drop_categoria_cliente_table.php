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
        // Eliminar la tabla categoria_cliente (duplicada, la correcta es categorias_cliente)
        Schema::dropIfExists('categoria_cliente');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No se implementa rollback - tabla eliminada por ser duplicada
    }
};
