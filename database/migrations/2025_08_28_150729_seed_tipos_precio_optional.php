<?php

use Database\Seeders\TiposPrecioSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Esta migración es OPCIONAL - solo ejecuta seeders si se solicita explícitamente
     */
    public function up(): void
    {
        // Solo ejecutar si se establece la variable de entorno SEED_TIPOS_PRECIO=true
        if (env('SEED_TIPOS_PRECIO', false)) {
            $seeder = new TiposPrecioSeeder();
            $seeder->run();

            echo "✅ Tipos de precio sembrados exitosamente\n";
        } else {
            echo "⚠️  Migración de tipos de precio omitida. Para ejecutar seeders, establece SEED_TIPOS_PRECIO=true en tu .env\n";
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Solo intentar eliminar si se solicita explícitamente
        if (env('SEED_TIPOS_PRECIO', false)) {
            try {
                $seeder = new TiposPrecioSeeder();
                $seeder->eliminarTiposPrecioSistema();
                echo "✅ Tipos de precio eliminados exitosamente\n";
            } catch (\Exception $e) {
                echo "❌ Error al eliminar tipos de precio: " . $e->getMessage() . "\n";
                echo "Los tipos de precio pueden estar siendo usados por otras tablas\n";
            }
        } else {
            echo "⚠️  Rollback de tipos de precio omitido. Para ejecutar, establece SEED_TIPOS_PRECIO=true\n";
        }
    }
};
