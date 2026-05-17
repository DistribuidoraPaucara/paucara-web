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
        // No necesita cambios en la BD - usaremos accessor en el modelo
        // para remover ceros innecesarios
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nada que revertir
    }
};
