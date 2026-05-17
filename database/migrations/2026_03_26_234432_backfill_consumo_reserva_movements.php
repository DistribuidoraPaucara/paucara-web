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
        // Handle remaining movements that need backfilling
        // These have cantidad_anterior = 0, so they weren't caught by first migration

        DB::transaction(function () {
            // CONSUMO_RESERVA where cantidad_anterior = 0
            // cantidad_posterior = negative value being consumed
            DB::table('movimientos_inventario')
                ->where('tipo', 'CONSUMO_RESERVA')
                ->where('cantidad_total_anterior', 0)
                ->where('cantidad_anterior', 0)
                ->update([
                    'cantidad_total_anterior' => DB::raw('ABS(cantidad_posterior)'),
                    'cantidad_total_posterior' => DB::raw('cantidad_posterior'),
                    'cantidad_disponible_anterior' => 0,
                    'cantidad_disponible_posterior' => 0,
                    'cantidad_reservada_anterior' => DB::raw('ABS(cantidad_posterior)'),
                    'cantidad_reservada_posterior' => 0,
                ]);

            // SALIDA_VENTA and others with cantidad_anterior = 0
            DB::table('movimientos_inventario')
                ->whereIn('tipo', ['SALIDA_VENTA', 'SALIDA_AJUSTE', 'SALIDA_MERMA'])
                ->where('cantidad_total_anterior', 0)
                ->where('cantidad_anterior', 0)
                ->update([
                    'cantidad_total_anterior' => DB::raw('ABS(cantidad_posterior)'),
                    'cantidad_total_posterior' => DB::raw('cantidad_posterior'),
                    'cantidad_disponible_anterior' => DB::raw('ABS(cantidad_posterior)'),
                    'cantidad_disponible_posterior' => DB::raw('cantidad_posterior'),
                    'cantidad_reservada_anterior' => 0,
                    'cantidad_reservada_posterior' => 0,
                ]);

            // ENTRADA_COMPRA/AJUSTE that weren't fully updated
            DB::table('movimientos_inventario')
                ->whereIn('tipo', ['ENTRADA_COMPRA', 'ENTRADA_AJUSTE'])
                ->where('cantidad_total_anterior', 0)
                ->update([
                    'cantidad_total_anterior' => DB::raw('cantidad_anterior'),
                    'cantidad_total_posterior' => DB::raw('cantidad_posterior'),
                    'cantidad_disponible_anterior' => DB::raw('cantidad_anterior'),
                    'cantidad_disponible_posterior' => DB::raw('cantidad_posterior'),
                    'cantidad_reservada_anterior' => 0,
                    'cantidad_reservada_posterior' => 0,
                ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset affected columns back to 0
        DB::table('movimientos_inventario')
            ->where('id', '>', 7805)
            ->update([
                'cantidad_total_anterior' => 0,
                'cantidad_total_posterior' => 0,
                'cantidad_disponible_anterior' => 0,
                'cantidad_disponible_posterior' => 0,
                'cantidad_reservada_anterior' => 0,
                'cantidad_reservada_posterior' => 0,
            ]);
    }
};
