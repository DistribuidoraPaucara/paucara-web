<?php

use Database\Seeders\TiposPrecioSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Los datos se insertan a través del seeder TiposPrecioSeeder
        // para mantener la separación entre estructura y datos
        $seeder = new TiposPrecioSeeder();
        $seeder->run();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // NO eliminar los tipos de precio automáticamente para evitar conflictos de foreign keys
        // Los tipos de precio pueden estar siendo usados por precios_producto u otras tablas
        // Si necesitas eliminarlos, hazlo manualmente o usa el seeder directamente:
        // $seeder = new TiposPrecioSeeder();
        // $seeder->eliminarTiposPrecioSistema();

        // Para rollback seguro, simplemente no hacer nada
        // Los datos permanecerán en la base de datos
    }
};
