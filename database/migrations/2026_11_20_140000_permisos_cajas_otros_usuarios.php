<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permisos de caja sobre otros usuarios: reemplazan las verificaciones por rol
 * (admin/Admin/Super Admin) en CajaController y AdminCajaApiController.
 * Se asignan a los mismos roles que ya tenían acceso, para que nadie lo pierda.
 * (No se reutiliza `cajas.admin` porque lo tiene `manager`, que hoy no accede.)
 */
return new class extends Migration
{
    private const PERMISOS = [
        'cajas.ver-otros',       // index (caja de otro), movimientosDia, movimientosApertura, detalle
        'cajas.gestionar-otros', // abrirCaja / cerrarCaja de otro usuario
        'cajas.consolidar',      // consolidarCaja
        'cajas.cierre-diario',   // cierreDiarioGeneral (web, JSON y API)
    ];

    public function up(): void
    {
        $roles = Role::whereIn('name', ['admin', 'Admin', 'Super Admin'])->where('guard_name', 'web')->get();

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
