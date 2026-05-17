<?php

namespace App\Console\Commands;

use App\Models\ModuloSidebar;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class VerPermisosModulosDetallado extends Command
{
    protected $signature = 'permisos:ver-modulos {--sin-permisos}';
    protected $description = 'Muestra detalle de permisos en cada módulo';

    public function handle()
    {
        $modulos = ModuloSidebar::all()->sortBy('orden');
        $soloSinPermisos = $this->option('sin-permisos');

        $this->info('📋 Detalle de Permisos en Módulos');
        $this->newLine();

        $totalModulos = $modulos->count();
        $modulosConPermisos = $modulos->filter(fn($m) => !empty($m->permisos) && is_array($m->permisos))->count();
        $modulosSinPermisos = $totalModulos - $modulosConPermisos;

        $this->table(
            ['Métrica', 'Cantidad'],
            [
                ['Total de módulos', $totalModulos],
                ['Módulos con permisos', $modulosConPermisos],
                ['Módulos sin permisos (público)', $modulosSinPermisos],
            ]
        );

        $this->newLine();
        $this->info('📦 Detalle por Módulo:');
        $this->newLine();

        foreach ($modulos as $modulo) {
            $tipoModulo = $modulo->es_submenu ? '└─ Submódulo' : '📘 Módulo Principal';
            $estado = $modulo->activo ? '✅ Activo' : '❌ Inactivo';
            
            // Si solo queremos los sin permisos
            if ($soloSinPermisos && (!empty($modulo->permisos) && is_array($modulo->permisos))) {
                continue;
            }

            $this->line("$tipoModulo | {$estado} | {$modulo->titulo}");
            $this->line("   ID: {$modulo->id} | Ruta: {$modulo->ruta}");

            if (!empty($modulo->permisos) && is_array($modulo->permisos)) {
                $this->line("   🔐 Permisos requeridos:");
                foreach ($modulo->permisos as $permiso) {
                    // Verificar si existe en DB
                    $existe = Permission::where('name', $permiso)->exists();
                    $check = $existe ? '✅' : '❌';
                    $this->line("      $check {$permiso}");
                }
            } else {
                $this->line("   🌐 Acceso público (sin permisos requeridos)");
            }
            
            $this->newLine();
        }
    }
}
