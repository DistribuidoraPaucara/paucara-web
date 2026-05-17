<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * DEPRECA el campo JSON 'localidades' en favor de la tabla pivot 'localidad_zona'
     * - Limpia el campo JSON (lo deja en NULL)
     * - Agrega comentario indicando que está deprecated
     * - La relación many-to-many debe usarse en su lugar
     */
    public function up(): void
    {
        // 1. Limpiar datos del campo JSON (ya están migrados a pivot table)
        DB::table('zonas')->update(['localidades' => null]);

        // 2. Modificar columna para agregar comentario de deprecación
        Schema::table('zonas', function (Blueprint $table) {
            $table->json('localidades')
                ->nullable()
                ->comment('DEPRECATED: Usar relación localidades() many-to-many')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restaurar comentario original
        Schema::table('zonas', function (Blueprint $table) {
            $table->json('localidades')
                ->nullable()
                ->comment('Array de localidades: ["La Paz", "Cochabamba"]')
                ->change();
        });

        // Nota: No restauramos datos porque están en la pivot table
        // Si se necesita rollback completo, ejecutar down() de la migración
        // 2025_12_11_200100_migrate_zona_localidades_json_to_pivot
    }
};
