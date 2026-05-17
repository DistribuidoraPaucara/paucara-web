<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\ModuloSidebar;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remover módulos de Envios del sidebar (legacy)
        ModuloSidebar::where('titulo', 'Envíos')->delete();
        ModuloSidebar::where('titulo', 'Nuevo Envío')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // En caso de rollback, no se restauran automáticamente
        // Se pueden restaurar ejecutando el seeder nuevamente
    }
};
