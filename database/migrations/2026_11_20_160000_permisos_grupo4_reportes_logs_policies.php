<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permisos del grupo 4: reemplazan verificaciones por rol en rutas, un
 * FormRequest, ApiVentaController y el "acceso total" (before) de las policies
 * de Cliente y Compra. Cada permiso se asigna a los mismos roles que hoy tienen
 * acceso, para que nadie lo pierda.
 */
return new class extends Migration
{
    /** permiso => roles que hoy tienen acceso (comparación sin mayúsculas) */
    private const PERMISOS = [
        'reportes.visitas'            => ['admin', 'super admin'], // /reportes/visitas (+ exportar Excel)
        'sistema.logs'                => ['super admin'],          // GET /api/logs y POST /api/logs/clear
        'creditos.importar-historicos' => ['admin'],               // ImportarCreditosHistoricosRequest
        'ventas.confirmar-pickup'     => ['admin'],                // ApiVentaController::tienePermisoAlmacen
        'clientes.gestionar-todos'    => ['admin', 'super admin'], // ClientePolicy::before (acceso total)
        'compras.gestionar-todas'     => ['admin', 'super admin'], // CompraPolicy::before (acceso total)
    ];

    public function up(): void
    {
        foreach (self::PERMISOS as $nombre => $roles) {
            $permiso = Permission::firstOrCreate(['name' => $nombre, 'guard_name' => 'web']);

            Role::where('guard_name', 'web')
                ->whereIn(DB::raw('LOWER(name)'), $roles)
                ->get()
                ->each(fn (Role $rol) => $rol->givePermissionTo($permiso));
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        Permission::whereIn('name', array_keys(self::PERMISOS))->where('guard_name', 'web')->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
};
