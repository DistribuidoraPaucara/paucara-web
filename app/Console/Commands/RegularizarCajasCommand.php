<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Caja;
use App\Models\Empleado;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RegularizarCajasCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cajas:regularizar {--dry-run} {--delete}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Regularizar tabla cajas: elimina cajas de usuarios no empleados o inactivos
                             Opciones:
                             --dry-run    Mostrar lo que se haría sin ejecutar
                             --delete     Ejecutar eliminación (sin esta opción solo muestra)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Iniciando regularización de cajas...');
        $this->newLine();

        $isDryRun = $this->option('dry-run');
        $shouldDelete = $this->option('delete');

        // ========================================
        // PASO 1: Cajas sin usuario asignado
        // ========================================
        $this->info('📋 PASO 1: Buscando cajas sin usuario asignado...');
        $cajaSinUsuario = Caja::whereNull('user_id')->get();

        if ($cajaSinUsuario->isNotEmpty()) {
            $this->warn("  ⚠️ Se encontraron {$cajaSinUsuario->count()} cajas sin usuario:");
            foreach ($cajaSinUsuario as $caja) {
                $this->line("    - ID: {$caja->id} | Nombre: {$caja->nombre}");
            }

            if ($shouldDelete && !$isDryRun) {
                $deletedCount = Caja::whereNull('user_id')->delete();
                $this->info("  ✅ {$deletedCount} cajas sin usuario eliminadas");
            } elseif ($isDryRun) {
                $this->line("  [DRY-RUN] Se eliminarían {$cajaSinUsuario->count()} cajas");
            }
        } else {
            $this->info('  ✅ No hay cajas sin usuario');
        }
        $this->newLine();

        // ========================================
        // PASO 2: Cajas con usuarios que NO son empleados (excluyendo admins)
        // ========================================
        $this->info('📋 PASO 2: Buscando cajas de usuarios que NO son empleados (excluyendo admins)...');

        $cajasConUsuario = Caja::whereNotNull('user_id')->get();
        $cajasNoEmpleados = [];
        $cajasAdminsValidas = [];

        foreach ($cajasConUsuario as $caja) {
            $usuario = User::find($caja->user_id);

            // ✅ NUEVO: Excluir admins explícitamente - ellos pueden tener caja sin ser empleados
            if ($usuario && $usuario->isAnyAdminRole()) {
                $cajasAdminsValidas[] = $caja;
                continue;
            }

            $empleado = Empleado::where('user_id', $caja->user_id)->first();
            if (!$empleado) {
                $cajasNoEmpleados[] = $caja;
            }
        }

        // Mostrar cajas de admins (NO se eliminarán)
        if (count($cajasAdminsValidas) > 0) {
            $this->info("  ✅ Se encontraron " . count($cajasAdminsValidas) . " cajas de admins (se preservarán):");
            foreach ($cajasAdminsValidas as $caja) {
                $usuario = User::find($caja->user_id);
                $nombreUsuario = $usuario ? $usuario->name : 'Desconocido';
                $roles = $usuario->getRoleNames()->join(', ');
                $this->line("    - ID: {$caja->id} | Caja: {$caja->nombre} | Admin: {$nombreUsuario} | Roles: {$roles}");
            }
        }

        if (count($cajasNoEmpleados) > 0) {
            $this->warn("  ⚠️ Se encontraron " . count($cajasNoEmpleados) . " cajas de usuarios que NO son empleados ni admins:");
            foreach ($cajasNoEmpleados as $caja) {
                $usuario = User::find($caja->user_id);
                $nombreUsuario = $usuario ? $usuario->name : 'Desconocido';
                $this->line("    - ID: {$caja->id} | Caja: {$caja->nombre} | Usuario: {$nombreUsuario} (ID: {$caja->user_id})");
            }

            if ($shouldDelete && !$isDryRun) {
                $ids = collect($cajasNoEmpleados)->pluck('id')->toArray();
                $deletedCount = Caja::whereIn('id', $ids)->delete();
                $this->info("  ✅ {$deletedCount} cajas de no-empleados eliminadas");
            } elseif ($isDryRun) {
                $this->line("  [DRY-RUN] Se eliminarían " . count($cajasNoEmpleados) . " cajas");
            }
        } else {
            $this->info('  ✅ Todas las cajas pertenecen a empleados o admins válidos');
        }
        $this->newLine();

        // ========================================
        // PASO 3: Cajas de empleados INACTIVOS
        // ========================================
        $this->info('📋 PASO 3: Buscando cajas de empleados inactivos...');

        $cajasEmpleadosInactivos = [];

        foreach ($cajasConUsuario as $caja) {
            $empleado = Empleado::where('user_id', $caja->user_id)->first();
            if ($empleado && $empleado->estado !== 'activo') {
                $cajasEmpleadosInactivos[] = $caja;
            }
        }

        if (count($cajasEmpleadosInactivos) > 0) {
            $this->warn("  ⚠️ Se encontraron " . count($cajasEmpleadosInactivos) . " cajas de empleados inactivos:");
            foreach ($cajasEmpleadosInactivos as $caja) {
                $empleado = Empleado::where('user_id', $caja->user_id)->first();
                $usuario = User::find($caja->user_id);
                $nombreUsuario = $usuario ? $usuario->name : 'Desconocido';
                $estadoEmpleado = $empleado ? $empleado->estado : 'Desconocido';
                $this->line("    - ID: {$caja->id} | Caja: {$caja->nombre} | Usuario: {$nombreUsuario} | Estado: {$estadoEmpleado}");
            }

            if ($shouldDelete && !$isDryRun) {
                $ids = collect($cajasEmpleadosInactivos)->pluck('id')->toArray();
                $deletedCount = Caja::whereIn('id', $ids)->delete();
                $this->info("  ✅ {$deletedCount} cajas de empleados inactivos eliminadas");
            } elseif ($isDryRun) {
                $this->line("  [DRY-RUN] Se eliminarían " . count($cajasEmpleadosInactivos) . " cajas");
            }
        } else {
            $this->info('  ✅ Todas las cajas pertenecen a empleados activos');
        }
        $this->newLine();

        // ========================================
        // PASO 4: Cajas de empleados SIN acceso al sistema
        // ========================================
        $this->info('📋 PASO 4: Buscando cajas de empleados sin acceso al sistema...');

        $cajasEmpleadosSinAcceso = [];

        foreach ($cajasConUsuario as $caja) {
            $empleado = Empleado::where('user_id', $caja->user_id)->first();
            if ($empleado && !$empleado->puede_acceder_sistema) {
                $cajasEmpleadosSinAcceso[] = $caja;
            }
        }

        if (count($cajasEmpleadosSinAcceso) > 0) {
            $this->warn("  ⚠️ Se encontraron " . count($cajasEmpleadosSinAcceso) . " cajas de empleados sin acceso al sistema:");
            foreach ($cajasEmpleadosSinAcceso as $caja) {
                $usuario = User::find($caja->user_id);
                $nombreUsuario = $usuario ? $usuario->name : 'Desconocido';
                $this->line("    - ID: {$caja->id} | Caja: {$caja->nombre} | Usuario: {$nombreUsuario} | Acceso: NO");
            }

            if ($shouldDelete && !$isDryRun) {
                $ids = collect($cajasEmpleadosSinAcceso)->pluck('id')->toArray();
                $deletedCount = Caja::whereIn('id', $ids)->delete();
                $this->info("  ✅ {$deletedCount} cajas de empleados sin acceso eliminadas");
            } elseif ($isDryRun) {
                $this->line("  [DRY-RUN] Se eliminarían " . count($cajasEmpleadosSinAcceso) . " cajas");
            }
        } else {
            $this->info('  ✅ Todas las cajas pertenecen a empleados con acceso');
        }
        $this->newLine();

        // ========================================
        // RESUMEN FINAL
        // ========================================
        $totalAAfectar = count($cajasNoEmpleados) + count($cajasEmpleadosInactivos) + count($cajasEmpleadosSinAcceso) + $cajaSinUsuario->count();

        $this->newLine();
        $this->info('📊 RESUMEN DE REGULARIZACIÓN:');
        $this->line("  • Cajas sin usuario: {$cajaSinUsuario->count()}");
        $this->line("  • Cajas de no-empleados (no admins): " . count($cajasNoEmpleados));
        $this->line("  • Cajas de empleados inactivos: " . count($cajasEmpleadosInactivos));
        $this->line("  • Cajas de empleados sin acceso: " . count($cajasEmpleadosSinAcceso));
        $this->line("  " . str_repeat("─", 40));
        $this->line("  ✅ Cajas de admins a PRESERVAR: " . count($cajasAdminsValidas));
        $this->line("  " . str_repeat("─", 40));
        $this->line("  • TOTAL A ELIMINAR: {$totalAAfectar}");
        $this->newLine();

        if ($isDryRun && !$shouldDelete) {
            $this->info('✅ MODO DRY-RUN ACTIVADO');
            $this->line('   Para ejecutar la eliminación, usa: php artisan cajas:regularizar --delete');
        } elseif ($shouldDelete && !$isDryRun) {
            $this->info('✅ REGULARIZACIÓN COMPLETADA');
            $this->line('   Se han eliminado todas las cajas irregulares');
        } else {
            $this->line('Para ver qué se eliminaría: php artisan cajas:regularizar --dry-run');
            $this->line('Para ejecutar eliminación: php artisan cajas:regularizar --delete');
        }

        $this->newLine();
        return 0;
    }
}
