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
        // 1. Agregar campos a la tabla antes de renombrar
        Schema::table('devolucion_proveedor_prestamo', function (Blueprint $table) {
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'devolucion_proveedor_id')) {
                $table->unsignedBigInteger('devolucion_proveedor_id')->nullable()->after('prestamo_proveedor_detalle_id');
            }
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'cantidad_dañada_parcial')) {
                $table->integer('cantidad_dañada_parcial')->default(0)->after('cantidad_devuelta');
            }
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'cantidad_dañada_total')) {
                $table->integer('cantidad_dañada_total')->default(0)->after('cantidad_dañada_parcial');
            }
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'monto_cobrado_daño')) {
                $table->decimal('monto_cobrado_daño', 10, 2)->default(0)->after('cantidad_dañada_total');
            }
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'monto_garantia_devuelta')) {
                $table->decimal('monto_garantia_devuelta', 10, 2)->default(0)->after('monto_cobrado_daño');
            }
            if (!Schema::hasColumn('devolucion_proveedor_prestamo', 'created_at')) {
                $table->timestamps();
            }
        });

        // 2. Renombrar la tabla
        Schema::rename('devolucion_proveedor_prestamo', 'devolucion_proveedor_detalle');

        // 3. Agregar relaciones foráneas a la tabla renombrada
        Schema::table('devolucion_proveedor_detalle', function (Blueprint $table) {
            // Solo agregar si no existe
            if (!Schema::hasColumn('devolucion_proveedor_detalle', 'created_at')) {
                $table->timestamps();
            }

            // Agregar índice
            $table->index('devolucion_proveedor_id');
            $table->index('fecha_devolucion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Renombrar la tabla de vuelta
        Schema::rename('devolucion_proveedor_detalle', 'devolucion_proveedor_prestamo');

        // Remover las columnas agregadas
        Schema::table('devolucion_proveedor_prestamo', function (Blueprint $table) {
            $table->dropColumn([
                'devolucion_proveedor_id',
                'cantidad_dañada_parcial',
                'cantidad_dañada_total',
                'monto_cobrado_daño',
                'monto_garantia_devuelta',
                'created_at',
                'updated_at'
            ]);
        });
    }
};
