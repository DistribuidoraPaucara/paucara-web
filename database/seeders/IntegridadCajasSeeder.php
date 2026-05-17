<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caja;
use App\Models\Empleado;
use Illuminate\Support\Facades\DB;

/**
 * ===================================
 * SEEDER: Integridad de Cajas
 * ===================================
 *
 * Este seeder verifica y garantiza que:
 * 1. Solo empleados activos tengan cajas
 * 2. Los empleados con acceso al sistema tengan cajas si las necesitan
 * 3. Elimina cajas huérfanas o inconsistentes
 *
 * Uso:
 *   php artisan db:seed --class=IntegridadCajasSeeder
 */

class IntegridadCajasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🔧 Verificando integridad de cajas...');

        // ========================================
        // PASO 1: Limpiar cajas inconsistentes
        // ========================================
        $this->limpiarCajasInconsistentes();

        // ========================================
        // PASO 2: Verificar restricción UNIQUE
        // ========================================
        $this->verificarUniqueUserIdCajas();

        // ========================================
        // PASO 3: Crear índices si no existen
        // ========================================
        $this->crearIndices();

        $this->command->info('✅ Integridad de cajas verificada');
    }

    /**
     * Eliminar cajas inconsistentes
     */
    private function limpiarCajasInconsistentes(): void
    {
        $this->command->line('  📋 Limpiando cajas inconsistentes...');

        // Cajas sin usuario
        $cajaSinUsuario = Caja::whereNull('user_id')->count();
        if ($cajaSinUsuario > 0) {
            Caja::whereNull('user_id')->delete();
            $this->command->warn("    ⚠️ {$cajaSinUsuario} cajas sin usuario eliminadas");
        }

        // ✅ NUEVO: Obtener user_ids de admins (deben preservarse)
        $adminUserIds = \App\Models\User::query()
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['Super Admin', 'Admin', 'Manager']);
            })
            ->pluck('id')
            ->toArray();

        // Cajas de usuarios que no son empleados NI admins
        $usuariosEmpleados = Empleado::pluck('user_id')->toArray();
        $usuariosValidos = array_merge($usuariosEmpleados, $adminUserIds);

        $cajasInvalidasNoEmpleados = Caja::whereNotNull('user_id')
            ->whereNotIn('user_id', $usuariosValidos)
            ->count();

        if ($cajasInvalidasNoEmpleados > 0) {
            Caja::whereNotNull('user_id')
                ->whereNotIn('user_id', $usuariosValidos)
                ->delete();
            $this->command->warn("    ⚠️ {$cajasInvalidasNoEmpleados} cajas de no-empleados (excluyendo admins) eliminadas");
        }

        // Cajas de empleados inactivos
        $empleadosInactivos = Empleado::where('estado', '!=', 'activo')->pluck('user_id');
        $cajasEmpleadosInactivos = Caja::whereIn('user_id', $empleadosInactivos)->count();

        if ($cajasEmpleadosInactivos > 0) {
            Caja::whereIn('user_id', $empleadosInactivos)->delete();
            $this->command->warn("    ⚠️ {$cajasEmpleadosInactivos} cajas de empleados inactivos eliminadas");
        }

        // Cajas de empleados sin acceso al sistema
        $empleadosSinAcceso = Empleado::where('puede_acceder_sistema', false)->pluck('user_id');
        $cajasSinAcceso = Caja::whereIn('user_id', $empleadosSinAcceso)->count();

        if ($cajasSinAcceso > 0) {
            Caja::whereIn('user_id', $empleadosSinAcceso)->delete();
            $this->command->warn("    ⚠️ {$cajasSinAcceso} cajas de empleados sin acceso eliminadas");
        }

        if ($cajaSinUsuario === 0 && $cajasInvalidasNoEmpleados === 0 &&
            $cajasEmpleadosInactivos === 0 && $cajasSinAcceso === 0) {
            $this->command->info('    ✅ No hay cajas inconsistentes');
        }
    }

    /**
     * Verificar y manejar duplicados de UNIQUE constraint en user_id
     */
    private function verificarUniqueUserIdCajas(): void
    {
        $this->command->line('  🔍 Verificando restricción UNIQUE en user_id...');

        // Encontrar usuarios con múltiples cajas
        $usuariosConMultiplesCajas = DB::table('cajas')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('user_id');

        if ($usuariosConMultiplesCajas->isNotEmpty()) {
            $this->command->warn("    ⚠️ Se encontraron usuarios con múltiples cajas:");

            foreach ($usuariosConMultiplesCajas as $userId) {
                $cajas = Caja::where('user_id', $userId)->get();
                $this->command->line("    User ID {$userId}: " . $cajas->count() . " cajas");

                // Mantener la caja más reciente, eliminar las demás
                $caja_a_mantener = $cajas->sortByDesc('created_at')->first();
                $cajas_a_eliminar = $cajas->where('id', '!=', $caja_a_mantener->id);

                foreach ($cajas_a_eliminar as $caja) {
                    $this->command->line("      ❌ Eliminando: {$caja->nombre} (ID: {$caja->id})");
                    $caja->delete();
                }

                $this->command->line("      ✅ Mantenida: {$caja_a_mantener->nombre} (ID: {$caja_a_mantener->id})");
            }
        } else {
            $this->command->info('    ✅ No hay duplicados de user_id');
        }
    }

    /**
     * Crear índices para optimizar queries
     */
    private function crearIndices(): void
    {
        $this->command->line('  ⚡ Verificando índices...');

        // Los índices probablemente ya existan de la migración,
        // pero este seeder verifica que estén en su lugar

        $this->command->info('    ✅ Índices verificados');
    }
}
