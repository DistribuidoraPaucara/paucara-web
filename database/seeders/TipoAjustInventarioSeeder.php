<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TipoAjustInventarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            [
                'clave'       => 'INVENTARIO_INICIAL',
                'label'       => 'Inventario Inicial',
                'descripcion' => 'Carga inicial de inventario al implementar el sistema (usar solo una vez por producto)',
                'color'       => 'purple',
                'bg_color'    => 'bg-purple-100 dark:bg-purple-900/20',
                'text_color'  => 'text-purple-800 dark:text-purple-300',
            ],
            [
                'clave'       => 'AJUSTE_FISICO',
                'label'       => 'Ajuste por Inventario Físico',
                'descripcion' => 'Corrección tras conteo físico',
                'color'       => 'blue',
                'bg_color'    => 'bg-blue-100 dark:bg-blue-900/20',
                'text_color'  => 'text-blue-800 dark:text-blue-300',
            ],
            [
                'clave'       => 'DONACION',
                'label'       => 'Donación',
                'descripcion' => 'Ingreso por donación de productos',
                'color'       => 'green',
                'bg_color'    => 'bg-green-100 dark:bg-green-900/20',
                'text_color'  => 'text-green-800 dark:text-green-300',
            ],
            [
                'clave'       => 'CORRECCION',
                'label'       => 'Corrección de Error',
                'descripcion' => 'Corrección por error administrativo',
                'color'       => 'yellow',
                'bg_color'    => 'bg-yellow-100 dark:bg-yellow-900/20',
                'text_color'  => 'text-yellow-800 dark:text-yellow-300',
            ],
        ];
        foreach ($tipos as $tipo) {
            \App\Models\TipoAjusteInventario::updateOrCreate([
                'clave' => $tipo['clave'],
            ], $tipo);
        }
    }
}
