<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            // Para PostgreSQL: cambiar enum a varchar con check constraint
            // Primero eliminar el constraint antiguo si existe
            DB::statement("ALTER TABLE prestable_precios DROP CONSTRAINT IF EXISTS prestable_precios_tipo_precio_check");

            // Cambiar el tipo de dato
            DB::statement('ALTER TABLE prestable_precios ALTER COLUMN tipo_precio TYPE varchar(50)');

            // Agregar el nuevo constraint
            DB::statement("ALTER TABLE prestable_precios ADD CONSTRAINT prestable_precios_tipo_precio_check CHECK (tipo_precio IN ('VENTA', 'PRESTAMO', 'COMPRA', 'DAÑO_TOTAL'))");
        } else {
            // Para MySQL
            Schema::table('prestable_precios', function (Blueprint $table) {
                $table->enum('tipo_precio', ['VENTA', 'PRESTAMO', 'COMPRA', 'DAÑO_TOTAL'])->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE prestable_precios DROP CONSTRAINT check_tipo_precio');
            DB::statement('ALTER TABLE prestable_precios ALTER COLUMN tipo_precio TYPE varchar(50)');
        }
    }
};
