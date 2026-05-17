<?php

namespace Database\Seeders;

use App\Models\ModuloSidebar;
use Illuminate\Database\Seeder;

class CleanupDuplicateModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Limpia módulos duplicados del sidebar
     */
    public function run(): void
    {
        $this->command->info('🧹 Limpiando módulos duplicados...');

        // Eliminar Logística antigua (ID: 31) y sus submódulos
        $logisticaAntiga = ModuloSidebar::find(31);
        if ($logisticaAntiga) {
            $this->command->line('  Eliminando Logística antigua (ID: 31)...');
            // Eliminar submódulos primero
            ModuloSidebar::where('modulo_padre_id', 31)->delete();
            // Eliminar el módulo
            $logisticaAntiga->delete();
            $this->command->line('  ✓ Eliminado');
        }

        // Eliminar proformas duplicados
        $proformasAntiguos = ModuloSidebar::whereIn('id', [37, 75])->get();
        foreach ($proformasAntiguos as $proforma) {
            $this->command->line('  Eliminando Proformas duplicado (ID: ' . $proforma->id . ')...');
            ModuloSidebar::where('modulo_padre_id', $proforma->id)->delete();
            $proforma->delete();
        }
        $this->command->line('  ✓ Proformas duplicados eliminados');

        // Crear Proformas como módulo principal si no existe
        $proformas = ModuloSidebar::where('titulo', 'Proformas')
            ->where('es_submenu', false)
            ->first();

        if (!$proformas) {
            $proformas = ModuloSidebar::create([
                'titulo' => 'Proformas',
                'ruta' => '/proformas',
                'icono' => 'FileText',
                'descripcion' => 'Gestión de proformas y cotizaciones',
                'orden' => 7,
                'categoria' => 'Ventas',
                'activo' => true,
                'es_submenu' => false,
                'permisos' => ['proformas.index'],
            ]);
            $this->command->line('  ✓ Proformas creado como módulo principal');
        }

        // Crear submódulos de Proformas
        $submenuProformas = [
            ['titulo' => 'Proformas', 'ruta' => '/proformas', 'icono' => 'FileText', 'orden' => 1, 'permisos' => ['proformas.index']],
            ['titulo' => 'Nueva Proforma', 'ruta' => '/proformas/create', 'icono' => 'Plus', 'orden' => 2, 'permisos' => ['proformas.create']],
            ['titulo' => 'Aprobar Proforma', 'ruta' => '/proformas?estado=pendiente', 'icono' => 'CheckCircle', 'orden' => 3, 'permisos' => ['proformas.aprobar']],
            ['titulo' => 'Convertir a Venta', 'ruta' => '/proformas?conversion=pendiente', 'icono' => 'ArrowRight', 'orden' => 4, 'permisos' => ['proformas.convertir-venta']],
        ];

        foreach ($submenuProformas as $submenu) {
            $exists = ModuloSidebar::where('titulo', $submenu['titulo'])
                ->where('modulo_padre_id', $proformas->id)
                ->first();

            if (!$exists) {
                ModuloSidebar::create([
                    'titulo' => $submenu['titulo'],
                    'ruta' => $submenu['ruta'],
                    'icono' => $submenu['icono'],
                    'orden' => $submenu['orden'],
                    'es_submenu' => true,
                    'modulo_padre_id' => $proformas->id,
                    'activo' => true,
                    'permisos' => $submenu['permisos'],
                ]);
            }
        }
        $this->command->line('  ✓ Submódulos de Proformas creados');

        // Verificar que Logística (ID: 65) está configurado correctamente
        $logistica = ModuloSidebar::find(65);
        if ($logistica) {
            $logistica->update([
                'orden' => 6,
                'permisos' => ['entregas.index', 'logistica.dashboard', 'envios.index'],
            ]);
            $this->command->line('  ✓ Logística (ID: 65) actualizado');
        }

        $this->command->info('');
        $this->command->info('✅ Duplicados limpios exitosamente');
        $this->command->info('');
        $this->command->info('📋 Estructura final:');
        $this->command->info('  ✓ Logística (módulo principal con submódulos)');
        $this->command->info('  ✓ Proformas (módulo principal con submódulos)');
        $this->command->info('  ✓ Sin duplicados');
        $this->command->info('');
    }
}
