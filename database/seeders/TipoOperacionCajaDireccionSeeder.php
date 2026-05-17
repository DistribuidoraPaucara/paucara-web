<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipoOperacionCajaDireccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Asigna valores a la columna 'direccion' de tipo_operacion_caja
     * basado en la clasificación que estaba hardcodeada en el código
     */
    public function run(): void
    {
        $clasificacion = [
            // 📥 ENTRADA: Ingresos de dinero
            'VENTA' => 'ENTRADA',
            'PAGO' => 'ENTRADA',

            // 📤 SALIDA: Egresos de dinero
            'COMPRA' => 'SALIDA',
            'GASTOS' => 'SALIDA',
            'PAGO_SUELDO' => 'SALIDA',
            'ANTICIPO' => 'SALIDA',
            'ANULACION' => 'SALIDA',

            // 🔧 AJUSTE: Operaciones especiales
            'AJUSTE' => 'AJUSTE',
            'CREDITO' => 'AJUSTE',

            // 🔐 ESPECIAL: Operaciones del sistema (no se modifican manualmente)
            'APERTURA' => 'ESPECIAL',
            'CIERRE' => 'ESPECIAL',
            'INGRESO_EXTRA' => 'ENTRADA',
        ];

        foreach ($clasificacion as $codigo => $direccion) {
            \App\Models\TipoOperacionCaja::where('codigo', $codigo)
                ->update(['direccion' => $direccion]);
        }

        $this->command->info("✅ Direcciones asignadas a tipos de operación:");
        \App\Models\TipoOperacionCaja::all()->each(function($t) {
            $this->command->line("  {$t->codigo} → {$t->direccion}");
        });
    }
}
