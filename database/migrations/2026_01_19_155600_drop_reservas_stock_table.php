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
        // Eliminar tabla reservas_stock (no se usa, el sistema usa reservas_proforma)
        Schema::dropIfExists('reservas_stock');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No restaurar (tabla obsoleta)
    }
};
