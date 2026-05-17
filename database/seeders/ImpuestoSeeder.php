<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ImpuestoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $impuestos = [
            [
                'codigo' => 'IVA',
                'nombre' => 'Impuesto al Valor Agregado',
                'descripcion' => 'IVA 13% para Bolivia',
                'porcentaje' => 13.00,
                'tipo_calculo' => 'porcentaje',
                'monto_fijo' => null,
                'incluido_en_precio' => false,
                'aplica_ventas' => true,
                'aplica_compras' => true,
                'cuenta_contable' => '2110501',
                'activo' => true,
            ],
            [
                'codigo' => 'ICE',
                'nombre' => 'Impuesto a los Consumos Específicos',
                'descripcion' => 'ICE para productos específicos',
                'porcentaje' => 0.00,
                'tipo_calculo' => 'porcentaje',
                'monto_fijo' => null,
                'incluido_en_precio' => true,
                'aplica_ventas' => true,
                'aplica_compras' => false,
                'cuenta_contable' => '2110502',
                'activo' => true,
            ],
            [
                'codigo' => 'IT',
                'nombre' => 'Impuesto a las Transacciones',
                'descripcion' => 'IT 3% sobre transacciones',
                'porcentaje' => 3.00,
                'tipo_calculo' => 'porcentaje',
                'monto_fijo' => null,
                'incluido_en_precio' => false,
                'aplica_ventas' => true,
                'aplica_compras' => false,
                'cuenta_contable' => '2110503',
                'activo' => true,
            ],
        ];

        foreach ($impuestos as $impuesto) {
            \App\Models\Impuesto::firstOrCreate(
                ['codigo' => $impuesto['codigo']],
                $impuesto
            );
        }
    }
}
