<?php

namespace Database\Seeders;

use App\Models\Almacen;
use App\Models\Sector;
use Illuminate\Database\Seeder;

class SectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Crea sectores de ejemplo para cada almacén
     * Nota: Los sectores "General" genéricos se crean automáticamente
     * en el boot del modelo Almacen cuando se crea un almacén
     */
    public function run(): void
    {
        // Obtener almacenes activos
        $almacenes = Almacen::where('activo', true)->get();

        if ($almacenes->isEmpty()) {
            $this->command->warn("⚠️  No hay almacenes activos para asignar sectores");
            return;
        }

        // Definir sectores de ejemplo (por almacén)
        $sectoresEjemplo = [
            [
                'nombre' => 'Bebidas',
                'descripcion' => 'Refrescos, bebidas alcohólicas, jugos, agua'
            ],
            [
                'nombre' => 'Refrigeración',
                'descripcion' => 'Productos que requieren cadena de frío'
            ],
            [
                'nombre' => 'Lácteos',
                'descripcion' => 'Leche, yogurt, quesos, crema'
            ],
            [
                'nombre' => 'Panadería',
                'descripcion' => 'Pan, pasteles, galletas'
            ],
            [
                'nombre' => 'Carnes y Pescados',
                'descripcion' => 'Carnes frescas, embutidos, pescados'
            ],
            [
                'nombre' => 'Abarrotes',
                'descripcion' => 'Productos secos, conservas, alimentos no perecederos'
            ],
            [
                'nombre' => 'Limpieza',
                'descripcion' => 'Productos de limpieza y desinfección'
            ],
            [
                'nombre' => 'Higiene Personal',
                'descripcion' => 'Jabones, desodorantes, pasta dental'
            ],
        ];

        // Crear sectores para cada almacén
        foreach ($almacenes as $almacen) {
            $this->command->info("📦 Creando sectores para almacén: {$almacen->nombre}");

            // El sector "General" ya existe (creado por boot del modelo)
            // Verificar que existe
            $sectorGenerico = Sector::where('almacen_id', $almacen->id)
                ->where('es_generico', true)
                ->first();

            if (!$sectorGenerico) {
                $this->command->warn("   ⚠️  Sector 'General' no existe, creando...");
                Sector::create([
                    'almacen_id' => $almacen->id,
                    'nombre' => 'General',
                    'es_generico' => true,
                    'descripcion' => 'Sector genérico automático - Productos sin clasificación específica'
                ]);
            }

            // Crear sectores de ejemplo
            foreach ($sectoresEjemplo as $sectorData) {
                // Verificar que no exista ya
                $existe = Sector::where('almacen_id', $almacen->id)
                    ->where('nombre', $sectorData['nombre'])
                    ->exists();

                if (!$existe) {
                    Sector::create([
                        'almacen_id' => $almacen->id,
                        'nombre' => $sectorData['nombre'],
                        'es_generico' => false,
                        'descripcion' => $sectorData['descripcion']
                    ]);
                    $this->command->info("   ✅ Sector creado: {$sectorData['nombre']}");
                } else {
                    $this->command->info("   ⚠️  Sector ya existe: {$sectorData['nombre']}");
                }
            }
        }

        $this->command->info("🎉 Seeder de sectores completado");
    }
}
