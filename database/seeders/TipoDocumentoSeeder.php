<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TipoDocumentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposDocumento = [
            [
                'codigo' => 'FAC',
                'nombre' => 'Factura',
                'descripcion' => 'Factura comercial estándar',
                'genera_inventario' => true,
                'requiere_autorizacion' => true,
                'formato_numeracion' => 'FAC-{YYYY}-{####}',
                'siguiente_numero' => 1,
                'activo' => true,
            ],
            [
                'codigo' => 'BOL',
                'nombre' => 'Boleta',
                'descripcion' => 'Boleta de venta sin derecho a crédito fiscal',
                'genera_inventario' => true,
                'requiere_autorizacion' => false,
                'formato_numeracion' => 'BOL-{YYYY}-{####}',
                'siguiente_numero' => 1,
                'activo' => true,
            ],
            [
                'codigo' => 'REC',
                'nombre' => 'Recibo',
                'descripcion' => 'Recibo simple de venta',
                'genera_inventario' => true,
                'requiere_autorizacion' => false,
                'formato_numeracion' => 'REC-{####}',
                'siguiente_numero' => 1,
                'activo' => true,
            ],
            [
                'codigo' => 'NCR',
                'nombre' => 'Nota de Crédito',
                'descripcion' => 'Nota de crédito para ajustes y devoluciones',
                'genera_inventario' => true,
                'requiere_autorizacion' => true,
                'formato_numeracion' => 'NCR-{YYYY}-{####}',
                'siguiente_numero' => 1,
                'activo' => true,
            ],
            [
                'codigo' => 'NDB',
                'nombre' => 'Nota de Débito',
                'descripcion' => 'Nota de débito para cargos adicionales',
                'genera_inventario' => false,
                'requiere_autorizacion' => true,
                'formato_numeracion' => 'NDB-{YYYY}-{####}',
                'siguiente_numero' => 1,
                'activo' => true,
            ],
        ];

        foreach ($tiposDocumento as $tipo) {
            \App\Models\TipoDocumento::firstOrCreate(
                ['codigo' => $tipo['codigo']],
                $tipo
            );
        }
    }
}
