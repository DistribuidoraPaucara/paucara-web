<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Agregar sector_id a stock_productos y crear sectores genéricos para almacenes existentes
     *
     * Pasos:
     * 1. Crear almacén con sector genérico para productos sin almacén (si aplica)
     * 2. Crear sector "General" genérico para cada almacén existente
     * 3. Agregar columna sector_id (nullable primero)
     * 4. Backfill: asignar cada stock al sector genérico de su almacén
     * 5. Hacer sector_id NOT NULL con constraint
     */
    public function up(): void
    {
        // Paso 1: Agregar columna sector_id como nullable
        Schema::table('stock_productos', function (Blueprint $table) {
            if (!Schema::hasColumn('stock_productos', 'sector_id')) {
                $table->foreignId('sector_id')
                    ->nullable()
                    ->constrained('sectores')
                    ->cascadeOnDelete()
                    ->comment('Sector dentro del almacén donde se ubica este stock');
            }
        });

        // Paso 2: Crear sector "General" genérico para cada almacén existente
        $almacenes = DB::table('almacenes')->get();

        foreach ($almacenes as $almacen) {
            // Verificar si ya existe sector genérico
            $sectorGenerico = DB::table('sectores')
                ->where('almacen_id', $almacen->id)
                ->where('es_generico', true)
                ->first();

            // Si no existe, crearlo
            if (!$sectorGenerico) {
                DB::table('sectores')->insert([
                    'almacen_id' => $almacen->id,
                    'nombre' => 'General',
                    'es_generico' => true,
                    'descripcion' => 'Sector genérico automático - Productos sin clasificación específica',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Paso 3: Backfill - Asignar cada stock al sector genérico de su almacén
        DB::statement('
            UPDATE stock_productos sp
            SET sector_id = (
                SELECT s.id
                FROM sectores s
                WHERE s.almacen_id = sp.almacen_id
                AND s.es_generico = true
                LIMIT 1
            )
            WHERE sp.sector_id IS NULL
        ');

        // Paso 4: Hacer sector_id NOT NULL
        Schema::table('stock_productos', function (Blueprint $table) {
            $table->foreignId('sector_id')
                ->nullable(false)
                ->change();
        });

        // Paso 5: Agregar índice compuesto para búsquedas comunes
        Schema::table('stock_productos', function (Blueprint $table) {
            $table->index(['sector_id', 'producto_id'], 'idx_sector_producto');
            $table->index(['almacen_id', 'sector_id'], 'idx_almacen_sector');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_productos', function (Blueprint $table) {
            // Eliminar índices
            $table->dropIndex('idx_sector_producto');
            $table->dropIndex('idx_almacen_sector');

            // Eliminar columna y foreign key
            if (Schema::hasColumn('stock_productos', 'sector_id')) {
                $table->dropForeign(['sector_id']);
                $table->dropColumn('sector_id');
            }
        });

        // Optativo: eliminar sectores "General" genéricos creados automáticamente
        // (comentado porque es destructivo)
        // DB::table('sectores')->where('es_generico', true)->delete();
    }
};
