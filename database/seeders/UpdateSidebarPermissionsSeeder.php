<?php

namespace Database\Seeders;

use App\Models\ModuloSidebar;
use Illuminate\Database\Seeder;

class UpdateSidebarPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Actualiza los permisos de los módulos del sidebar para que el Cajero pueda verlos
     */
    public function run(): void
    {
        $this->command->info('🔧 Actualizando permisos del sidebar para Cajero...');

        // Actualizar Módulo de Logística
        $logistica = ModuloSidebar::where('titulo', 'Logística')->first();
        if ($logistica) {
            $logistica->update([
                'permisos' => ['entregas.index', 'logistica.dashboard', 'envios.index'],
            ]);
            $this->command->line('  ✓ Logística actualizada');
        }

        // Actualizar submódulos de Logística
        $submenuLogistica = [
            'Dashboard Logística (Antiguo)' => ['logistica.dashboard'],
            'Dashboard Entregas (Nuevo)' => ['entregas.index'],
            'Entregas' => ['entregas.index'],
            'Crear Entrega' => ['entregas.create'],
            'Entregas Asignadas' => ['entregas.asignar'],
            'Entregas en Tránsito' => ['entregas.tracking'],
            'Vehículos' => ['inventario.vehiculos.index'],
            'Crear Vehículo' => ['inventario.vehiculos.create'],
        ];

        foreach ($submenuLogistica as $titulo => $permisos) {
            $submenu = ModuloSidebar::where('titulo', $titulo)->first();
            if ($submenu) {
                $submenu->update(['permisos' => $permisos]);
            }
        }
        $this->command->line('  ✓ Submódulos de Logística actualizados');

        // Actualizar Módulo de Cajas
        $cajas = ModuloSidebar::where('titulo', 'Cajas')->first();
        if ($cajas) {
            $cajas->update([
                'permisos' => ['cajas.index'],
            ]);
            $this->command->line('  ✓ Cajas actualizada');
        }

        // Actualizar Módulo de Ventas
        $ventas = ModuloSidebar::where('titulo', 'Ventas')->first();
        if ($ventas) {
            $ventas->update([
                'permisos' => ['ventas.index'],
            ]);
            $this->command->line('  ✓ Ventas actualizada');
        }

        // Actualizar Módulo de Proformas
        $proformas = ModuloSidebar::where('titulo', 'proformas')->first();
        if ($proformas) {
            $proformas->update([
                'permisos' => ['proformas.index'],
            ]);
            $this->command->line('  ✓ Proformas actualizada');
        }

        // Actualizar Módulo de Clientes
        $clientes = ModuloSidebar::where('titulo', 'Clientes')->first();
        if ($clientes) {
            $clientes->update([
                'permisos' => ['clientes.manage'],
            ]);
            $this->command->line('  ✓ Clientes actualizada');
        }

        // Actualizar Módulo de Rutas
        $rutas = ModuloSidebar::where('titulo', 'Rutas')->first();
        if ($rutas) {
            $rutas->update([
                'permisos' => ['envios.manage'],
            ]);
            $this->command->line('  ✓ Rutas actualizada');
        }

        $this->command->info('');
        $this->command->info('✅ Permisos del sidebar actualizados exitosamente');
        $this->command->info('');
        $this->command->info('📋 Módulos visibles para Cajero:');
        $this->command->info('  ✓ Cajas');
        $this->command->info('  ✓ Ventas');
        $this->command->info('  ✓ Proformas');
        $this->command->info('  ✓ Clientes');
        $this->command->info('  ✓ Logística (con todos los submódulos)');
        $this->command->info('  ✓ Rutas');
        $this->command->info('');
    }
}
