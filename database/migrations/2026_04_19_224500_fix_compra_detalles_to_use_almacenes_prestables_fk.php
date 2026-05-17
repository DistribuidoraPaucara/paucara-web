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
            ->where('table_name', 'compra_prestable_detalles')
            ->where('column_name', 'almacen_id')
            ->exists();

        $hasAlmacenesPrestablesId = DB::table('information_schema.columns')
            ->where('table_name', 'compra_prestable_detalles')
            ->where('column_name', 'almacenes_prestables_id')
            ->exists();

        DB::statement('ALTER TABLE compra_prestable_detalles DROP CONSTRAINT IF EXISTS compra_prestable_detalles_almacen_id_foreign');
        DB::statement('ALTER TABLE compra_prestable_detalles DROP CONSTRAINT IF EXISTS compra_prestable_detalles_almacenes_prestables_id_foreign');

        if ($hasAlmacenId && !$hasAlmacenesPrestablesId) {
            DB::statement('ALTER TABLE compra_prestable_detalles RENAME COLUMN almacen_id TO almacenes_prestables_id');
        }

        DB::statement('CREATE INDEX IF NOT EXISTS compra_prestable_detalles_almacenes_prestables_id_index ON compra_prestable_detalles (almacenes_prestables_id)');

        DB::statement('ALTER TABLE compra_prestable_detalles ADD CONSTRAINT compra_prestable_detalles_almacenes_prestables_id_foreign FOREIGN KEY (almacenes_prestables_id) REFERENCES almacenes_prestables (id) ON DELETE CASCADE');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $hasAlmacenId = DB::table('information_schema.columns')
            ->where('table_name', 'compra_prestable_detalles')
            ->where('column_name', 'almacen_id')
            ->exists();

        $hasAlmacenesPrestablesId = DB::table('information_schema.columns')
            ->where('table_name', 'compra_prestable_detalles')
            ->where('column_name', 'almacenes_prestables_id')
            ->exists();

        DB::statement('ALTER TABLE compra_prestable_detalles DROP CONSTRAINT IF EXISTS compra_prestable_detalles_almacenes_prestables_id_foreign');
        DB::statement('ALTER TABLE compra_prestable_detalles DROP CONSTRAINT IF EXISTS compra_prestable_detalles_almacen_id_foreign');

        if ($hasAlmacenesPrestablesId && !$hasAlmacenId) {
            DB::statement('ALTER TABLE compra_prestable_detalles RENAME COLUMN almacenes_prestables_id TO almacen_id');
        }

        DB::statement('CREATE INDEX IF NOT EXISTS compra_prestable_detalles_almacen_id_index ON compra_prestable_detalles (almacen_id)');

        DB::statement('ALTER TABLE compra_prestable_detalles ADD CONSTRAINT compra_prestable_detalles_almacen_id_foreign FOREIGN KEY (almacen_id) REFERENCES almacenes (id) ON DELETE CASCADE');
    }
};
