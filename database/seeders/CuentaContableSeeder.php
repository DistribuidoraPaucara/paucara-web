<?php

namespace Database\Seeders;

use App\Models\CuentaContable;
use Illuminate\Database\Seeder;

class CuentaContableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cuentas = [
            // ACTIVOS
            [
                'codigo' => '1.1.01.001',
                'nombre' => 'Caja General',
                'descripcion' => 'Efectivo disponible en caja',
                'tipo' => 'activo',
                'naturaleza' => 'deudora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],
            [
                'codigo' => '1.1.02.001',
                'nombre' => 'Cuentas por Cobrar',
                'descripcion' => 'Cuentas por cobrar a clientes',
                'tipo' => 'activo',
                'naturaleza' => 'deudora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],
            [
                'codigo' => '1.1.03.001',
                'nombre' => 'Inventario de Mercaderías',
                'descripcion' => 'Inventario de productos para la venta',
                'tipo' => 'activo',
                'naturaleza' => 'deudora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],

            // CUENTAS POR COBRAR (Simplificadas para asientos contables)
            [
                'codigo' => '1205',
                'nombre' => 'Cuentas por Cobrar',
                'descripcion' => 'Cuentas por cobrar a clientes',
                'tipo' => 'activo',
                'naturaleza' => 'deudora',
                'codigo_padre' => null,
                'nivel' => 1,
                'acepta_movimiento' => true,
                'activa' => true,
            ],

            // PASIVOS
            [
                'codigo' => '2.1.03.001',
                'nombre' => 'IVA Débito Fiscal',
                'descripcion' => 'IVA por pagar al fisco',
                'tipo' => 'pasivo',
                'naturaleza' => 'acreedora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],
            [
                'codigo' => '2.1.03.002',
                'nombre' => 'IT por Pagar',
                'descripcion' => 'Impuesto a las Transacciones por pagar',
                'tipo' => 'pasivo',
                'naturaleza' => 'acreedora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],
            [
                'codigo' => '2.1.04.001',
                'nombre' => 'Cuentas por Pagar',
                'descripcion' => 'Cuentas por pagar a proveedores',
                'tipo' => 'pasivo',
                'naturaleza' => 'acreedora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],

            // INGRESOS
            [
                'codigo' => '4.1.01.001',
                'nombre' => 'Ventas',
                'descripcion' => 'Ingresos por ventas de productos',
                'tipo' => 'ingreso',
                'naturaleza' => 'acreedora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],
            [
                'codigo' => '4105',
                'nombre' => 'Ingresos por Venta',
                'descripcion' => 'Ingresos generados por la venta de productos',
                'tipo' => 'ingreso',
                'naturaleza' => 'acreedora',
                'codigo_padre' => null,
                'nivel' => 1,
                'acepta_movimiento' => true,
                'activa' => true,
            ],

            // GASTOS/COSTOS
            [
                'codigo' => '5.1.01.001',
                'nombre' => 'Costo de Ventas',
                'descripcion' => 'Costo de los productos vendidos',
                'tipo' => 'gasto',
                'naturaleza' => 'deudora',
                'codigo_padre' => null,
                'nivel' => 4,
                'acepta_movimiento' => true,
                'activa' => true,
            ],
        ];

        foreach ($cuentas as $cuenta) {
            CuentaContable::updateOrCreate(
                ['codigo' => $cuenta['codigo']],
                $cuenta
            );
        }
    }
}
