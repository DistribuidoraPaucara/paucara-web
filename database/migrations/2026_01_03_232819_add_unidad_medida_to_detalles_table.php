<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar unidad_medida_id a detalle_ventas
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->foreignId('unidad_medida_id')
                ->nullable()
                ->after('producto_id')
                ->constrained('unidades_medida')
                ->restrictOnDelete()
                ->comment('Unidad en la que se vendió este detalle');
        });

        // Agregar unidad_medida_id a detalle_proformas
        Schema::table('detalle_proformas', function (Blueprint $table) {
            $table->foreignId('unidad_medida_id')
                ->nullable()
                ->after('producto_id')
                ->constrained('unidades_medida')
                ->restrictOnDelete()
                ->comment('Unidad en la que se cotizó este detalle');
        });

        // Agregar unidad_medida_id a detalle_compras (si existe)
        if (Schema::hasTable('detalle_compras')) {
            Schema::table('detalle_compras', function (Blueprint $table) {
                $table->foreignId('unidad_medida_id')
                    ->nullable()
                    ->after('producto_id')
                    ->constrained('unidades_medida')
                    ->restrictOnDelete()
                    ->comment('Unidad en la que se compró este detalle');
            });
        }

        // Migrar datos existentes: asignar unidad_medida_id del producto
        // Sintaxis PostgreSQL compatible
        DB::statement('
            UPDATE detalle_ventas dv
            SET unidad_medida_id = p.unidad_medida_id
            FROM productos p
            WHERE dv.producto_id = p.id
        ');

        DB::statement('
            UPDATE detalle_proformas dp
            SET unidad_medida_id = p.unidad_medida_id
            FROM productos p
            WHERE dp.producto_id = p.id
        ');

        if (Schema::hasTable('detalle_compras')) {
            DB::statement('
                UPDATE detalle_compras dc
                SET unidad_medida_id = p.unidad_medida_id
                FROM productos p
                WHERE dc.producto_id = p.id
            ');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropForeignKey(['unidad_medida_id']);
            $table->dropColumn('unidad_medida_id');
        });

        Schema::table('detalle_proformas', function (Blueprint $table) {
            $table->dropForeignKey(['unidad_medida_id']);
            $table->dropColumn('unidad_medida_id');
        });

        if (Schema::hasTable('detalle_compras')) {
            Schema::table('detalle_compras', function (Blueprint $table) {
                $table->dropForeignKey(['unidad_medida_id']);
                $table->dropColumn('unidad_medida_id');
            });
        }
    }
};
