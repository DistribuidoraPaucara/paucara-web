<?php

namespace App\Console\Commands;

use App\Models\ModuloSidebar;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class ValidarPermisosModulos extends Command
{
    protected $signature = 'permisos:validar-modulos';
    protected $description = 'Valida si todos los permisos en modulos_sidebar.permisos existen en la tabla permissions';

    public function handle()
    {
        $this->info('🔍 Validando permisos en módulos...');
        $this->newLine();

        $modulos = ModuloSidebar::all();
        $permisosEnDB = Permission::pluck('name')->toArray();

        $errores = [];
        $modulosConError = 0;
        $permisosNoEncontrados = [];

        foreach ($modulos as $modulo) {
            if (empty($modulo->permisos) || !is_array($modulo->permisos)) {
                continue;
            }

            foreach ($modulo->permisos as $permiso) {
                if (!in_array($permiso, $permisosEnDB)) {
                    $modulosConError++;
                    if (!isset($errores[$modulo->id])) {
                        $errores[$modulo->id] = [
                            'titulo' => $modulo->titulo,
                            'permisos_faltantes' => []
                        ];
                    }
                    $errores[$modulo->id]['permisos_faltantes'][] = $permiso;
                    
                    if (!in_array($permiso, $permisosNoEncontrados)) {
                        $permisosNoEncontrados[] = $permiso;
                    }
                }
            }
        }

        // Mostrar resultados
        if (empty($errores)) {
            $this->line('✅ <fg=green>Todos los permisos en modulos_sidebar.permisos existen en la tabla permissions</></>');
            return 0;
        }

        // Mostrar módulos con errores
        $this->line('❌ <fg=red>Se encontraron permisos inexistentes:</></>');
        $this->newLine();

        foreach ($errores as $moduloId => $error) {
            $this->line("<fg=red>  ❌ Módulo: {$error['titulo']} (ID: {$moduloId})</>");
            foreach ($error['permisos_faltantes'] as $permiso) {
                $this->line("     - <fg=yellow>{$permiso}</>");
            }
        }

        $this->newLine();
        $this->line("<fg=red>Resumen:</>");
        $this->line("  - Módulos con permisos inexistentes: <fg=red>{$modulosConError}</>");
        $this->line("  - Permisos únicos no encontrados: <fg=red>" . count($permisosNoEncontrados) . "</>");
        $this->newLine();

        // Mostrar sugerencia
        $this->line('<fg=cyan>Permisos que necesitan ser creados:</>', verbosity: 'v');
        $this->line('<fg=cyan>Ejecuta en tinker o crea en una migración:</>', verbosity: 'v');
        foreach (array_unique($permisosNoEncontrados) as $permiso) {
            $this->line("  Permission::create(['name' => '{$permiso}']);", verbosity: 'v');
        }

        return 1;
    }
}
