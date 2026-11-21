<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permiso `ventas.anular`: reemplaza la verificación por rol (admin/Admin) en
 * VentaController@anular. Se asigna a los roles que ya podían anular, para que
 * nadie pierda acceso; luego puede darse a otros roles desde la gestión de roles.
 */
return new class extends Migration
{
    public function up(): void
    {
        $permiso = Permission::firstOrCreate(['name' => 'ventas.anular', 'guard_name' => 'web']);

        Role::whereIn('name', ['admin', 'Admin'])->where('guard_name', 'web')->get()
            ->each(fn (Role $rol) => $rol->givePermissionTo($permiso));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        Permission::where('name', 'ventas.anular')->where('guard_name', 'web')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
