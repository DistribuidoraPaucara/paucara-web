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
        // ✅ Backfill legacy movements (created before 2026-03-26) with stock column values
        // Strategy: Use movement type + cantidad_anterior/posterior to infer the stock impact

        DB::transaction(function () {
            // Get all movements that need backfilling
            $movimientos = DB::table('movimientos_inventario')
                ->where('cantidad_total_anterior', 0)
                ->where('cantidad_anterior', '!=', 0)
                ->orderBy('id')
                ->get();

            foreach ($movimientos as $mov) {
                $updates = [];

                switch ($mov->tipo) {
                    // ✅ ENTRADA_COMPRA: New purchases - adds to total and disponible
                    case 'ENTRADA_COMPRA':
                    case 'ENTRADA_AJUSTE':
                        $updates = [
                            'cantidad_total_anterior' => $mov->cantidad_anterior,
                            'cantidad_total_posterior' => $mov->cantidad_posterior,
                            'cantidad_disponible_anterior' => $mov->cantidad_anterior,
                            'cantidad_disponible_posterior' => $mov->cantidad_posterior,
                            'cantidad_reservada_anterior' => 0,
                            'cantidad_reservada_posterior' => 0,
                        ];
                        break;

                    // ✅ RESERVA_PROFORMA: Reserves disponible stock
                    // cantidad_anterior/posterior = disponible before/after
                    case 'RESERVA_PROFORMA':
                        $cambio = abs((float)$mov->cantidad_anterior - (float)$mov->cantidad_posterior);
                        $updates = [
                            'cantidad_disponible_anterior' => $mov->cantidad_anterior,
                            'cantidad_disponible_posterior' => $mov->cantidad_posterior,
                            'cantidad_reservada_anterior' => 0,  // Fallback: assume 0 (can't determine historically)
                            'cantidad_reservada_posterior' => $cambio,  // Increases by the change
                        ];
                        break;

                    // ✅ LIBERACION_RESERVA: Opposite of RESERVA_PROFORMA
                    case 'LIBERACION_RESERVA':
                        $cambio = abs((float)$mov->cantidad_anterior - (float)$mov->cantidad_posterior);
                        $updates = [
                            'cantidad_disponible_anterior' => $mov->cantidad_anterior,
                            'cantidad_disponible_posterior' => $mov->cantidad_posterior,
                            'cantidad_reservada_anterior' => $cambio,  // Decreases to 0
                            'cantidad_reservada_posterior' => 0,
                        ];
                        break;

                    // ✅ CONSUMO_RESERVA: Uses reserved stock (decreases both total and reservada)
                    // The change amount affects both metrics equally
                    case 'CONSUMO_RESERVA':
                        $changes = [
                            'cantidad_total_anterior' => $mov->cantidad_anterior,
                            'cantidad_total_posterior' => $mov->cantidad_posterior,
                            'cantidad_disponible_anterior' => $mov->cantidad_anterior,
                            'cantidad_disponible_posterior' => $mov->cantidad_posterior,
                            'cantidad_reservada_anterior' => abs((float)$mov->cantidad_anterior - (float)$mov->cantidad_posterior),
                            'cantidad_reservada_posterior' => 0,
                        ];
                        $updates = $changes;
                        break;

                    // ✅ SALIDA_VENTA: Sales (decreases total and disponible)
                    case 'SALIDA_VENTA':
                        $updates = [
                            'cantidad_total_anterior' => $mov->cantidad_anterior,
                            'cantidad_total_posterior' => $mov->cantidad_posterior,
                            'cantidad_disponible_anterior' => $mov->cantidad_anterior,
                            'cantidad_disponible_posterior' => $mov->cantidad_posterior,
                            'cantidad_reservada_anterior' => 0,
                            'cantidad_reservada_posterior' => 0,
                        ];
                        break;

                    // ✅ SALIDA_AJUSTE: Adjustment (decrease)
                    case 'SALIDA_AJUSTE':
                    case 'SALIDA_MERMA':
                        $updates = [
                            'cantidad_total_anterior' => $mov->cantidad_anterior,
                            'cantidad_total_posterior' => $mov->cantidad_posterior,
                            'cantidad_disponible_anterior' => $mov->cantidad_anterior,
                            'cantidad_disponible_posterior' => $mov->cantidad_posterior,
                            'cantidad_reservada_anterior' => 0,
                            'cantidad_reservada_posterior' => 0,
                        ];
                        break;

                    default:
                        // Unknown type - use conservative defaults
                        $updates = [
                            'cantidad_total_anterior' => $mov->cantidad_anterior,
                            'cantidad_total_posterior' => $mov->cantidad_posterior,
                            'cantidad_disponible_anterior' => 0,
                            'cantidad_disponible_posterior' => 0,
                            'cantidad_reservada_anterior' => 0,
                            'cantidad_reservada_posterior' => 0,
                        ];
                }

                if (!empty($updates)) {
                    DB::table('movimientos_inventario')
                        ->where('id', $mov->id)
                        ->update($updates);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::transaction(function () {
            // Reset backfilled columns to 0
            DB::table('movimientos_inventario')
                ->where('id', '<', 7805)  // Only affected movements (before first new movement)
                ->update([
                    'cantidad_total_anterior' => 0,
                    'cantidad_total_posterior' => 0,
                    'cantidad_disponible_anterior' => 0,
                    'cantidad_disponible_posterior' => 0,
                    'cantidad_reservada_anterior' => 0,
                    'cantidad_reservada_posterior' => 0,
                ]);
        });
    }
};
