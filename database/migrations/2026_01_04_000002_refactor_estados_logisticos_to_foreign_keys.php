<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Refactorizar estado_logistico de ENUM a Foreign Key en ambas tablas (proformas y ventas)
     *
     * Esto permite:
     * - Auditoría completa via historial_estados
     * - Estados dinámicos sin migraciones
     * - Relaciones normalizadas
     * - Validación de transiciones
     */
    public function up(): void
    {
        // PASO 1: Agregar columnas FK a proformas
        Schema::table('proformas', function (Blueprint $table) {
            // Agregar estado_proforma_id DESPUÉS del estado ENUM actual
            $table->unsignedBigInteger('estado_proforma_id')->nullable()->after('estado');
            $table->foreign('estado_proforma_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('set null');
        });

        // PASO 2: Agregar columnas FK a ventas
        Schema::table('ventas', function (Blueprint $table) {
            // Agregar estado_logistico_id DESPUÉS del estado_logistico ENUM actual
            $table->unsignedBigInteger('estado_logistico_id')->nullable()->after('estado_logistico');
            $table->foreign('estado_logistico_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('set null');
        });

        // PASO 3: Mapear valores ENUM de proformas a IDs en estados_logistica
        // Mapeo: (estado ENUM) -> (codigo, categoria en estados_logistica)
        $mapeoProformas = [
            'PENDIENTE' => ['codigo' => 'PENDIENTE', 'categoria' => 'proforma'],
            'APROBADA' => ['codigo' => 'APROBADA', 'categoria' => 'proforma'],
            'RECHAZADA' => ['codigo' => 'RECHAZADA', 'categoria' => 'proforma'],
            'CONVERTIDA' => ['codigo' => 'CONVERTIDA', 'categoria' => 'proforma'],
            'VENCIDA' => ['codigo' => 'VENCIDA', 'categoria' => 'proforma'],
        ];

        foreach ($mapeoProformas as $estadoEnum => $estadoLogistica) {
            $estadoId = DB::table('estados_logistica')
                ->where('codigo', $estadoLogistica['codigo'])
                ->where('categoria', $estadoLogistica['categoria'])
                ->value('id');

            if ($estadoId) {
                DB::table('proformas')
                    ->where('estado', $estadoEnum)
                    ->update(['estado_proforma_id' => $estadoId]);
            }
        }

        // PASO 4: Mapear valores ENUM de ventas a IDs en estados_logistica
        $mapeoVentas = [
            'PENDIENTE_ENVIO' => ['codigo' => 'PENDIENTE_ENVIO', 'categoria' => 'venta_logistica'],
            'PREPARANDO' => ['codigo' => 'PREPARANDO', 'categoria' => 'venta_logistica'],
            'ENVIADO' => ['codigo' => 'ENVIADO', 'categoria' => 'venta_logistica'],
            'ENTREGADO' => ['codigo' => 'ENTREGADO', 'categoria' => 'venta_logistica'],
            'PENDIENTE_RETIRO' => ['codigo' => 'PENDIENTE_RETIRO', 'categoria' => 'venta_logistica'],
            'RETIRADO' => ['codigo' => 'RETIRADO', 'categoria' => 'venta_logistica'],
        ];

        foreach ($mapeoVentas as $estadoEnum => $estadoLogistica) {
            $estadoId = DB::table('estados_logistica')
                ->where('codigo', $estadoLogistica['codigo'])
                ->where('categoria', $estadoLogistica['categoria'])
                ->value('id');

            if ($estadoId) {
                DB::table('ventas')
                    ->where('estado_logistico', $estadoEnum)
                    ->update(['estado_logistico_id' => $estadoId]);
            }
        }

        // PASO 5: Eliminar columnas ENUM antiguas después de mapear
        Schema::table('proformas', function (Blueprint $table) {
            $table->dropColumn('estado');
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn('estado_logistico');
        });

        // PASO 6: Agregar índices para performance
        Schema::table('proformas', function (Blueprint $table) {
            $table->index('estado_proforma_id');
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->index('estado_logistico_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restaurar columnas ENUM
        Schema::table('proformas', function (Blueprint $table) {
            // Reconstruir la columna ENUM con los valores antiguos
            $table->enum('estado', ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'CONVERTIDA', 'VENCIDA'])
                ->default('PENDIENTE')
                ->after('canal_origen');

            // Mapear IDs de vuelta a ENUM
            DB::table('proformas')
                ->join('estados_logistica', 'proformas.estado_proforma_id', '=', 'estados_logistica.id')
                ->update([
                    'proformas.estado' => DB::raw('estados_logistica.codigo')
                ]);

            // Eliminar columna FK
            $table->dropForeign(['estado_proforma_id']);
            $table->dropIndex(['estado_proforma_id']);
            $table->dropColumn('estado_proforma_id');
        });

        Schema::table('ventas', function (Blueprint $table) {
            // Reconstruir columna ENUM
            $table->enum('estado_logistico', [
                'SIN_ENTREGA',
                'PENDIENTE_ENVIO',
                'PROGRAMADO',
                'PREPARANDO',
                'EN_PREPARACION',
                'EN_TRANSITO',
                'ENVIADO',
                'ENTREGADO',
                'ENTREGADA',
                'PENDIENTE_RETIRO',
                'RETIRADO',
                'PROBLEMAS',
                'CANCELADA'
            ])->nullable()->after('canal_origen');

            // Mapear IDs de vuelta a ENUM
            DB::table('ventas')
                ->join('estados_logistica', 'ventas.estado_logistico_id', '=', 'estados_logistica.id')
                ->update([
                    'ventas.estado_logistico' => DB::raw('estados_logistica.codigo')
                ]);

            // Eliminar columna FK
            $table->dropForeign(['estado_logistico_id']);
            $table->dropIndex(['estado_logistico_id']);
            $table->dropColumn('estado_logistico_id');
        });
    }
};
