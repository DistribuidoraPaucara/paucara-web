<?php
namespace Database\Seeders;

use App\Models\Localidad;
use Illuminate\Database\Seeder;

class LocalidadesTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar localidades existentes
        $count = Localidad::count();
        echo "Total de localidades en BD: {$count}\n";

        $activas = Localidad::where('activo', true)->count();
        echo "Localidades activas: {$activas}\n";

        // Listar localidades activas
        Localidad::where('activo', true)->get()->each(function ($localidad) {
            echo "- {$localidad->id}: {$localidad->nombre} ({$localidad->codigo})\n";
        });

        // Crear localidades de prueba si no hay suficientes
        if ($activas < 3) {
            echo "\nCreando localidades de prueba...\n";

            $localidadesPrueba = [
                ['nombre' => 'La Paz', 'codigo' => 'LP', 'activo' => true],
                ['nombre' => 'Santa Cruz', 'codigo' => 'SC', 'activo' => true],
                ['nombre' => 'Cochabamba', 'codigo' => 'CB', 'activo' => true],
                ['nombre' => 'Sucre', 'codigo' => 'SU', 'activo' => true],
                ['nombre' => 'Oruro', 'codigo' => 'OR', 'activo' => true],
            ];

            foreach ($localidadesPrueba as $data) {
                Localidad::firstOrCreate(
                    ['codigo' => $data['codigo']],
                    $data
                );
            }

            echo "Localidades de prueba creadas.\n";
        }
    }
}
