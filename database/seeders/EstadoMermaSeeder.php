<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EstadoMermaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estados = [
            [
                'clave'      => 'PENDIENTE',
                'label'      => 'Pendiente',
                'color'      => 'yellow',
                'bg_color'   => 'bg-yellow-100 dark:bg-yellow-800',
                'text_color' => 'text-yellow-800 dark:text-yellow-200',
                'actions'    => json_encode(['aprobar', 'rechazar', 'edit']),
            ],
            [
                'clave'      => 'APROBADO',
                'label'      => 'Aprobado',
                'color'      => 'green',
                'bg_color'   => 'bg-green-100 dark:bg-green-800',
                'text_color' => 'text-green-800 dark:text-green-200',
                'actions'    => json_encode(['view']),
            ],
            [
                'clave'      => 'RECHAZADO',
                'label'      => 'Rechazado',
                'color'      => 'red',
                'bg_color'   => 'bg-red-100 dark:bg-red-800',
                'text_color' => 'text-red-800 dark:text-red-200',
                'actions'    => json_encode(['view']),
            ],
        ];
        foreach ($estados as $estado) {
            \App\Models\EstadoMerma::updateOrCreate([
                'clave' => $estado['clave'],
            ], $estado);
        }
    }
}
