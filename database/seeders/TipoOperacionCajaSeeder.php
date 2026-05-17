<?php

namespace Database\Seeders;

use App\Models\TipoOperacionCaja;
use Illuminate\Database\Seeder;

class TipoOperacionCajaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposOperacion = [
            [
                'codigo' => 'VENTA',
                'nombre' => 'Venta',
            ],
            [
                'codigo' => 'COMPRA',
                'nombre' => 'Compra',
            ],
            [
                'codigo' => 'GASTOS',
                'nombre' => 'Gastos Generales',
            ],
            [
                'codigo' => 'APERTURA',
                'nombre' => 'Apertura de Caja',
            ],
            [
                'codigo' => 'CIERRE',
                'nombre' => 'Cierre de Caja',
            ],
            [
                'codigo' => 'AJUSTE',
                'nombre' => 'Ajuste de Caja',
            ],
            [
                'codigo' => 'PAGO',
                'nombre' => 'Pago de Cuota/Crédito',
            ],
            [
                'codigo' => 'ANULACION',
                'nombre' => 'Anulación de Venta',
            ],
        ];

        foreach ($tiposOperacion as $tipo) {
            TipoOperacionCaja::updateOrCreate(
                ['codigo' => $tipo['codigo']],
                $tipo
            );
        }
    }
}
