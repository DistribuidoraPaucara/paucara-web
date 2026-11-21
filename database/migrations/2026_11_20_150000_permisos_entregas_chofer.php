<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Permisos de entregas/chofer: reemplazan las verificaciones por rol en
 * Api\EntregaController y Api\ChoferRutaController. Cada permiso se asigna a
 * los mismos roles que hoy tienen acceso, para que nadie lo pierda.
 * (No se reutilizan entregas.tracking / entregas.confirmar-carga /
 * entregas.actualizar-ubicacion porque también los tienen preventista y manager.)
 */
return new class extends Migration
{
    /** permiso => roles que hoy tienen acceso (comparación sin mayúsculas) */
    private const PERMISOS = [
        'entregas.ver-todas'              => ['admin', 'manager'],           // showEntrega de otro chofer
        'entregas.tracking.ver-todos'     => ['admin', 'manager'],           // obtenerTracking de proforma ajena
        'entregas.ubicacion.registrar'    => ['chofer'],                     // registrarUbicacion
        'entregas.ventas.confirmar-carga' => ['admin', 'cajero', 'chofer'],  // confirmarVentaCargada
        'rutas.chofer.acceso'             => ['chofer'],                     // ChoferRutaController
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
