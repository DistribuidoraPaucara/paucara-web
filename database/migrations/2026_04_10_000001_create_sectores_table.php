<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Crear tabla sectores para clasificar productos dentro de almacenes
     *
     * Un sector pertenece a un almacén y contiene múltiples stock_productos.
     * Cada almacén tendrá automáticamente un sector "General" con es_generico=true
     * para productos sin clasificación específica.
     */
    public function up(): void
    {
        Schema::create('sectores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('almacen_id')
                ->constrained('almacenes')
                ->cascadeOnDelete()
                ->comment('Almacén al que pertenece este sector');

            $table->string('nombre', 100)
                ->comment('Nombre del sector (ej: "General", "Refrigeración", "Bebidas")');

            $table->boolean('es_generico')
                ->default(false)
                ->index()
                ->comment('True si es el sector "General" automático del almacén');

            $table->text('descripcion')
                ->nullable()
                ->comment('Descripción opcional del sector');

            $table->timestamps();

            // Nombre único dentro del almacén
            $table->unique(['almacen_id', 'nombre'], 'uq_almacen_sector_nombre');

            // Índices para búsquedas comunes
            // Nota: es_generico ya tiene index() en la definición del campo (línea 30)
            $table->index('almacen_id');
        });

        // Crear índice único CONDICIONAL: un solo sector genérico por almacén
        // Solo aplica cuando es_generico=true, permitiendo múltiples sectores no-genéricos
        DB::statement('CREATE UNIQUE INDEX uq_almacen_sector_generico ON sectores (almacen_id) WHERE es_generico = true');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar el índice único personalizado si existe
        DB::statement('DROP INDEX IF EXISTS uq_almacen_sector_generico');
        Schema::dropIfExists('sectores');
    }
};
