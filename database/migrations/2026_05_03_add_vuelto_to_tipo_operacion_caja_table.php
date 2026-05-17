<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Agregar tipo de operación VUELTO para registrar cambio/vuelto en ventas
     *
     * PROPÓSITO:
     * Cuando cliente paga más de lo que cuesta la venta, se registra:
     * - Movimiento VENTA: +96 (lo que entra por la venta)
     * - Movimiento VUELTO: -14 (lo que se devuelve como cambio)
     * - Neto en caja: 82 que es consistente con detalles_pago_venta
     */
    public function up(): void
    {
        // Insertar tipo de operación VUELTO si no existe
        // VUELTO es una SALIDA (dinero que se devuelve al cliente)
        DB::table('tipo_operacion_caja')->insertOrIgnore([
            'codigo' => 'VUELTO',
            'nombre' => 'Vuelto / Cambio',
            'direccion' => 'SALIDA',  // ✅ VUELTO es una salida de caja
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar tipo de operación VUELTO
        DB::table('tipo_operacion_caja')
            ->where('codigo', 'VUELTO')
            ->delete();
    }
};
