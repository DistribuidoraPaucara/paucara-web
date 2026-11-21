<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permisos de anulación: reemplazan las verificaciones por rol (admin/Admin)
 * en los controladores. Se asignan a los roles que ya podían anular, para que
 * nadie pierda acceso; luego pueden darse a otros roles desde la gestión de roles.
 */
return new class extends Migration
{
    private const PERMISOS = [
        'compras.anular',                          // CompraController@anular
        'cuentas-por-cobrar.anular',               // CuentaPorCobrarController@anularCuenta
        'cuentas-por-cobrar.pagos.anular',         // CuentaPorCobrarController@anularPago
        'compras.cuentas-por-pagar.pagos.anular',  // CuentaPorPagarController@anularPago
        'inventario.ajuste.anular',                // InventarioController@anularAjuste
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
