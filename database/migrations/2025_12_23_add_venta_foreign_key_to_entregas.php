<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar llave foránea para venta_id en la tabla entregas
     * Esto asegura la integridad referencial entre ventas y entregas
     */
    public function up(): void
    {
        try {
            // Verificar si la llave foránea ya existe
            $constraints = DB::select("
                SELECT constraint_name
                FROM information_schema.table_constraints
                WHERE table_name = 'entregas'
                AND constraint_type = 'FOREIGN KEY'
                AND constraint_name LIKE '%venta_id%'
            ");

            if (empty($constraints)) {
                // Agregar la llave foránea
                DB::statement('
                    ALTER TABLE entregas
                    ADD CONSTRAINT entregas_venta_id_foreign
                    FOREIGN KEY (venta_id)
                    REFERENCES ventas(id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
                ');
            }
        } catch (\Exception $e) {
            // Si falla, continuar (la restricción puede ya existir)
            \Log::warning('Error adding venta_id foreign key: ' . $e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_venta_id_foreign');
        } catch (\Exception $e) {
            \Log::warning('Error dropping venta_id foreign key: ' . $e->getMessage());
        }
    }
};
