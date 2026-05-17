<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remover la restricción CHECK antigua
        DB::statement("ALTER TABLE ajustes_inventario DROP CONSTRAINT IF EXISTS ajustes_inventario_estado_check");

        // Agregar la restricción CHECK con el nuevo valor 'anulado'
        DB::statement("ALTER TABLE ajustes_inventario ADD CONSTRAINT ajustes_inventario_estado_check CHECK (estado IN ('pendiente', 'procesado', 'anulado'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE ajustes_inventario DROP CONSTRAINT IF EXISTS ajustes_inventario_estado_check");
        DB::statement("ALTER TABLE ajustes_inventario ADD CONSTRAINT ajustes_inventario_estado_check CHECK (estado IN ('pendiente', 'procesado'))");
    }
};
