<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $hasAlmacenId = DB::table('information_schema.columns')
            ->where('table_name', 'prestamos_vendidos_detalles')
            ->where('column_name', 'almacen_id')
            ->exists();

        $hasAlmacenesPrestablesId = DB::table('information_schema.columns')
            ->where('table_name', 'prestamos_vendidos_detalles')
            ->where('column_name', 'almacenes_prestables_id')
            ->exists();

        DB::statement('ALTER TABLE prestamos_vendidos_detalles DROP CONSTRAINT IF EXISTS prestamos_vendidos_detalles_almacen_id_foreign');
        DB::statement('ALTER TABLE prestamos_vendidos_detalles DROP CONSTRAINT IF EXISTS prestamos_vendidos_detalles_almacenes_prestables_id_foreign');

        if ($hasAlmacenId && !$hasAlmacenesPrestablesId) {
            DB::statement('ALTER TABLE prestamos_vendidos_detalles RENAME COLUMN almacen_id TO almacenes_prestables_id');
        }

        DB::statement('CREATE INDEX IF NOT EXISTS prestamos_vendidos_detalles_almacenes_prestables_id_index ON prestamos_vendidos_detalles (almacenes_prestables_id)');

        DB::statement('ALTER TABLE prestamos_vendidos_detalles ADD CONSTRAINT prestamos_vendidos_detalles_almacenes_prestables_id_foreign FOREIGN KEY (almacenes_prestables_id) REFERENCES almacenes_prestables (id) ON DELETE CASCADE');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $hasAlmacenId = DB::table('information_schema.columns')
            ->where('table_name', 'prestamos_vendidos_detalles')
            ->where('column_name', 'almacen_id')
            ->exists();

        $hasAlmacenesPrestablesId = DB::table('information_schema.columns')
            ->where('table_name', 'prestamos_vendidos_detalles')
            ->where('column_name', 'almacenes_prestables_id')
            ->exists();

        DB::statement('ALTER TABLE prestamos_vendidos_detalles DROP CONSTRAINT IF EXISTS prestamos_vendidos_detalles_almacenes_prestables_id_foreign');
        DB::statement('ALTER TABLE prestamos_vendidos_detalles DROP CONSTRAINT IF EXISTS prestamos_vendidos_detalles_almacen_id_foreign');

        if ($hasAlmacenesPrestablesId && !$hasAlmacenId) {
            DB::statement('ALTER TABLE prestamos_vendidos_detalles RENAME COLUMN almacenes_prestables_id TO almacen_id');
        }

        DB::statement('CREATE INDEX IF NOT EXISTS prestamos_vendidos_detalles_almacen_id_index ON prestamos_vendidos_detalles (almacen_id)');

        DB::statement('ALTER TABLE prestamos_vendidos_detalles ADD CONSTRAINT prestamos_vendidos_detalles_almacen_id_foreign FOREIGN KEY (almacen_id) REFERENCES almacenes (id) ON DELETE CASCADE');
    }
};
