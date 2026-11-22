<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permisos de reservas de inventario (pantalla de reservas por producto y sus acciones).
 * Las rutas ya los exigían, pero no existían en la base de datos, así que nadie podía usarlas.
 * Se asignan a los roles administrador; luego pueden darse a otros roles desde la gestión de roles.
 */
return new class extends Migration
{
    private const PERMISOS = [
        'inventario.reservas.index',          // Ver reservas (inventario y reservas por producto)
        'inventario.reservas.liberar',        // ReservaProformaController@liberar
        'inventario.reservas.liberar-masivo', // ReservaProformaController@liberarMasivo
        'inventario.reservas.extender',       // ReservaProformaController@extender
    ];

    public function up(): void
    {
        $roles = Role::whereIn('name', ['admin', 'Admin'])->where('guard_name', 'web')->get();

        foreach (self::PERMISOS as $nombre) {
            $permiso = Permission::firstOrCreate(['name' => $nombre, 'guard_name' => 'web']);
            $roles->each(fn (Role $rol) => $rol->givePermissionTo($permiso));
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        Permission::whereIn('name', self::PERMISOS)->where('guard_name', 'web')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
