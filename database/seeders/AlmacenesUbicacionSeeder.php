<?php
namespace Database\Seeders;

use App\Models\Almacen;
use Illuminate\Database\Seeder;

class AlmacenesUbicacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ejemplo de configuración para un negocio con múltiples ubicaciones
        $configuraciones = [
            [
                'nombre'                      => 'Almacén Principal',
                'ubicacion_fisica'            => 'SEDE_PRINCIPAL',
                'requiere_transporte_externo' => false,
                'descripcion'                 => 'Almacén principal en sede central',
            ],
            /* [
                'nombre'                      => 'Almacén Secundario',
                'ubicacion_fisica'            => 'SEDE_PRINCIPAL',
                'requiere_transporte_externo' => false,
                'descripcion'                 => 'Segundo almacén en la misma sede (transferencias internas)',
            ],
            [
                'nombre'                      => 'Almacén Productos Terminados',
                'ubicacion_fisica'            => 'SEDE_PRINCIPAL',
                'requiere_transporte_externo' => false,
                'descripcion'                 => 'Almacén de productos listos para envío',
            ],
            [
                'nombre'                      => 'Sucursal Norte',
                'ubicacion_fisica'            => 'SUCURSAL_NORTE',
                'requiere_transporte_externo' => true,
                'descripcion'                 => 'Sucursal en zona norte (requiere transporte)',
            ],
            [
                'nombre'                      => 'Sucursal Sur',
                'ubicacion_fisica'            => 'SUCURSAL_SUR',
                'requiere_transporte_externo' => true,
                'descripcion'                 => 'Sucursal en zona sur (requiere transporte)',
            ],
            [
                'nombre'                      => 'Bodega Externa',
                'ubicacion_fisica'            => 'BODEGA_REMOTA',
                'requiere_transporte_externo' => true,
                'descripcion'                 => 'Bodega en ubicación externa',
            ], */
        ];

        foreach ($configuraciones as $config) {
            // Buscar si existe un almacén con ese nombre
            $almacen = Almacen::where('nombre', 'like', '%' . explode(' ', $config['nombre'])[1] . '%')->first();

            if (! $almacen) {
                // Si no existe, crear uno nuevo
                Almacen::create([
                    'nombre'                      => $config['nombre'],
                    'direccion'                   => $config['descripcion'],
                    'ubicacion_fisica'            => $config['ubicacion_fisica'],
                    'requiere_transporte_externo' => $config['requiere_transporte_externo'],
                    'responsable'                 => 'Administrador',
                    'activo'                      => true,
                ]);
            } else {
                // Si existe, actualizar con la información de ubicación
                $almacen->update([
                    'ubicacion_fisica'            => $config['ubicacion_fisica'],
                    'requiere_transporte_externo' => $config['requiere_transporte_externo'],
                ]);
            }
        }

        $this->command->info('✅ Ubicaciones físicas configuradas para los almacenes');
        $this->command->info('📍 SEDE_PRINCIPAL: Almacenes en la misma ubicación (sin transporte)');
        $this->command->info('🚛 SUCURSALES: Almacenes remotos (requieren transporte)');
    }
}
