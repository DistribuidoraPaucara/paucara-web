<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TipoMermaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            [
                'clave'               => 'VENCIMIENTO',
                'label'               => 'Vencimiento',
                'descripcion'         => 'Productos que han superado su fecha de vencimiento',
                'color'               => 'red',
                'bg_color'            => 'bg-red-100 dark:bg-red-900/20',
                'text_color'          => 'text-red-800 dark:text-red-300',
                'requiere_aprobacion' => false,
            ],
            [
                'clave'               => 'DETERIORO',
                'label'               => 'Deterioro',
                'descripcion'         => 'Productos que se han deteriorado durante el almacenamiento',
                'color'               => 'orange',
                'bg_color'            => 'bg-orange-100 dark:bg-orange-900/20',
                'text_color'          => 'text-orange-800 dark:text-orange-300',
                'requiere_aprobacion' => true,
            ],
            [
                'clave'               => 'ROBO',
                'label'               => 'Robo',
                'descripcion'         => 'Productos faltantes por hurto o robo',
                'color'               => 'purple',
                'bg_color'            => 'bg-purple-100 dark:bg-purple-900/20',
                'text_color'          => 'text-purple-800 dark:text-purple-300',
                'requiere_aprobacion' => true,
            ],
            [
                'clave'               => 'PERDIDA',
                'label'               => 'Pérdida',
                'descripcion'         => 'Productos extraviados o perdidos',
                'color'               => 'gray',
                'bg_color'            => 'bg-gray-100 dark:bg-gray-900/20',
                'text_color'          => 'text-gray-800 dark:text-gray-300',
                'requiere_aprobacion' => true,
            ],
            [
                'clave'               => 'DANO',
                'label'               => 'Daño',
                'descripcion'         => 'Productos dañados durante manipulación o transporte',
                'color'               => 'yellow',
                'bg_color'            => 'bg-yellow-100 dark:bg-yellow-900/20',
                'text_color'          => 'text-yellow-800 dark:text-yellow-300',
                'requiere_aprobacion' => true,
            ],
            [
                'clave'               => 'OTROS',
                'label'               => 'Otros',
                'descripcion'         => 'Otros motivos no especificados',
                'color'               => 'indigo',
                'bg_color'            => 'bg-indigo-100 dark:bg-indigo-900/20',
                'text_color'          => 'text-indigo-800 dark:text-indigo-300',
                'requiere_aprobacion' => true,
            ],
        ];
        foreach ($tipos as $tipo) {
            \App\Models\TipoMerma::updateOrCreate([
                'clave' => $tipo['clave'],
            ], $tipo);
        }
    }
}
