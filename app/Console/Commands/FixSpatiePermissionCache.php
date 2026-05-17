<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Cache;

class FixSpatiePermissionCache extends Command
{
    protected $signature = 'permissions:fix-cache';
    protected $description = 'Clear Spatie permission cache and verify permissions are loadable';

    public function handle()
    {
        $this->info('🔄 Limpiando caché de Spatie permissions...');

        // Try multiple cache clearing strategies
        try {
            // Strategy 1: Clear specific cache keys
            Cache::forget('spatie.permission.cache');
            $this->info('✅ Limpiado: spatie.permission.cache');
        } catch (\Exception $e) {
            $this->warn('⚠️ No se pudo limpiar spatie.permission.cache: ' . $e->getMessage());
        }

        try {
            // Strategy 2: Clear all cache
            Cache::flush();
            $this->info('✅ Limpiado: caché completo');
        } catch (\Exception $e) {
            $this->warn('⚠️ No se pudo limpiar caché completo: ' . $e->getMessage());
        }

        // Verify permission exists
        $this->info("\n🔍 Verificando permiso 'admin.creditos.importar'...");

        $permission = Permission::where('name', 'admin.creditos.importar')
            ->where('guard_name', 'web')
            ->first();

        if ($permission) {
            $this->info("✅ Permiso encontrado (ID: {$permission->id})");

            // Show which roles have this permission
            $roles = $permission->roles()->get();
            if ($roles->count() > 0) {
                $this->info("\n📋 Roles con este permiso:");
                foreach ($roles as $role) {
                    $this->line("   • {$role->name}");
                }
            } else {
                $this->warn("\n⚠️ Este permiso NO está asignado a ningún rol");
            }
        } else {
            $this->error("❌ Permiso NO encontrado en la base de datos");
            $this->info("\n🔧 Ejecuta el siguiente comando para crear el permiso:");
            $this->line("   php artisan db:seed --class=CreditosPermissionsSeeder");
        }

        $this->info("\n🟢 Operación completada");
    }
}
