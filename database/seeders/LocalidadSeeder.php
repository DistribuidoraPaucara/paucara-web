<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class LocalidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $localidades = [
            ['nombre' => 'Puerto Suarez', 'codigo' => 'PS', 'activo' => true],
            ['nombre' => 'Puerto Quijarro', 'codigo' => 'PQ', 'activo' => true],
            ['nombre' => 'Arroyo Concepción', 'codigo' => 'AC', 'activo' => true],
            ['nombre' => 'Paradero', 'codigo' => 'PRD', 'activo' => true],
            ['nombre' => 'Yacuces', 'codigo' => 'YC', 'activo' => true],
            ['nombre' => 'Santa Ana', 'codigo' => 'SA', 'activo' => true],
            ['nombre' => 'Carmen Rivero Tórrez', 'codigo' => 'CRT', 'activo' => true],
        ];

        foreach ($localidades as $localidad) {
            // Busca por código (clave única) y crea si no existe, o simplemente actualiza si existe
            \App\Models\Localidad::firstOrCreate(
                ['codigo' => $localidad['codigo']],
                $localidad
            );
        }
    }
}
