<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permiso `notificaciones.panel` (admin, manager, Super Admin) y su entrada
 * en el menú lateral → /admin/notificaciones.
 */
return new class extends Migration
{
    public function up(): void
    {
        $permiso = Permission::firstOrCreate(['name' => 'notificaciones.panel', 'guard_name' => 'web']);

        Role::whereIn('name', ['admin', 'manager', 'Super Admin'])->where('guard_name', 'web')->get()
            ->each(fn (Role $rol) => $rol->givePermissionTo($permiso));

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        if (! DB::table('modulos_sidebar')->where('ruta', '/admin/notificaciones')->exists()) {
            $ordenNotificaciones = DB::table('modulos_sidebar')->where('ruta', '/notificaciones')->value('orden');

            DB::table('modulos_sidebar')->insert([
                'titulo'            => 'Panel de notificaciones',
                'ruta'              => '/admin/notificaciones',
                'icono'             => 'BellRing',
                'descripcion'       => 'Notificaciones emitidas, leídas, envíos push y dispositivos',
                'orden'             => ($ordenNotificaciones ?? 100) + 1,
                'activo'            => true,
                'es_submenu'        => false,
                'modulo_padre_id'   => null,
                'permisos'          => json_encode(['notificaciones.panel']),
                'visible_dashboard' => false,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('modulos_sidebar')->where('ruta', '/admin/notificaciones')->delete();
        Permission::where('name', 'notificaciones.panel')->where('guard_name', 'web')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
