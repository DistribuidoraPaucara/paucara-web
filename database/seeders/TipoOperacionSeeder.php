<?php

namespace Database\Seeders;

use App\Models\TipoOperacion;
use Illuminate\Database\Seeder;

class TipoOperacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposOperacion = [
            [
                'clave' => 'ENTRADA_AJUSTE',
                'label' => 'Entrada por Ajuste',
                'direccion' => 'entrada',
                'requiere_tipo_motivo' => 'tipo_ajuste',
                'requiere_proveedor' => false,
                'requiere_cliente' => false,
                'descripcion' => 'Ajuste de inventario con entrada de productos',
                'activo' => true,
            ],
            [
                'clave' => 'SALIDA_AJUSTE',
                'label' => 'Salida por Ajuste',
                'direccion' => 'salida',
                'requiere_tipo_motivo' => 'tipo_ajuste',
                'requiere_proveedor' => false,
                'requiere_cliente' => false,
                'descripcion' => 'Ajuste de inventario con salida de productos',
                'activo' => true,
            ],
            [
                'clave' => 'ENTRADA_COMPRA',
                'label' => 'Entrada por Compra',
                'direccion' => 'entrada',
                'requiere_tipo_motivo' => null,
                'requiere_proveedor' => true,
                'requiere_cliente' => false,
                'descripcion' => 'Entrada de productos por compra a proveedores',
                'activo' => true,
            ],
            [
                'clave' => 'SALIDA_VENTA',
                'label' => 'Salida por Venta',
                'direccion' => 'salida',
                'requiere_tipo_motivo' => null,
                'requiere_proveedor' => false,
                'requiere_cliente' => true,
                'descripcion' => 'Salida de productos por venta a clientes',
                'activo' => true,
            ],
            [
                'clave' => 'SALIDA_MERMA',
                'label' => 'Salida por Merma',
                'direccion' => 'salida',
                'requiere_tipo_motivo' => 'tipo_merma',
                'requiere_proveedor' => false,
                'requiere_cliente' => false,
                'descripcion' => 'Salida de productos por merma (vencimiento, daño, robo, etc)',
                'activo' => true,
            ],
        ];

        foreach ($tiposOperacion as $tipo) {
            TipoOperacion::firstOrCreate(
                ['clave' => $tipo['clave']],
                $tipo
            );
        }
    }
}
