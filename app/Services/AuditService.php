<?php

namespace App\Services;

use App\Models\PermissionAudit;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

/**
 * ✅ Servicio de Auditoría
 * Registra todos los cambios en permisos de usuarios y roles
 */
class AuditService
{
    /**
     * Registrar cambio de permisos de usuario
     */
    public static function registrarCambioUsuario(
        User $user,
        array $permisosAnteriores,
        array $permisosNuevos,
        ?Request $request = null
    ): void {
        PermissionAudit::create([
            'admin_id' => auth()->id() ?? 1,
            'target_type' => 'usuario',
            'target_id' => $user->id,
            'target_name' => $user->name,
            'action' => 'editar',
            'permisos_anteriores' => $permisosAnteriores,
            'permisos_nuevos' => $permisosNuevos,
            'descripcion' => self::generarDescripcion('usuario', $permisosAnteriores, $permisosNuevos),
            'ip_address' => $request?->ip() ?? request()?->ip(),
            'user_agent' => $request?->userAgent() ?? request()?->userAgent(),
        ]);
    }

    /**
     * Registrar cambio de permisos de rol
     */
    public static function registrarCambioRol(
        Role $role,
        array $permisosAnteriores,
        array $permisosNuevos,
        ?Request $request = null
    ): void {
        PermissionAudit::create([
            'admin_id' => auth()->id() ?? 1,
            'target_type' => 'rol',
            'target_id' => $role->id,
            'target_name' => $role->name,
            'action' => 'editar',
            'permisos_anteriores' => $permisosAnteriores,
            'permisos_nuevos' => $permisosNuevos,
            'descripcion' => self::generarDescripcion('rol', $permisosAnteriores, $permisosNuevos),
            'ip_address' => $request?->ip() ?? request()?->ip(),
            'user_agent' => $request?->userAgent() ?? request()?->userAgent(),
        ]);
    }

    /**
     * Registrar cambio en lote (bulk edit)
     */
    public static function registrarCambioBulk(
        string $tipo,
        array $ids,
        array $permisosAnteriores,
        array $permisosNuevos,
        ?Request $request = null
    ): void {
        foreach ($ids as $id) {
            if ($tipo === 'usuario') {
                $user = User::find($id);
                if ($user) {
                    PermissionAudit::create([
                        'admin_id' => auth()->id() ?? 1,
                        'target_type' => 'usuario',
                        'target_id' => $user->id,
                        'target_name' => $user->name,
                        'action' => 'editar',
                        'permisos_anteriores' => $permisosAnteriores,
                        'permisos_nuevos' => $permisosNuevos,
                        'descripcion' => "Cambio en lote (bulk edit) a {$user->name}",
                        'ip_address' => $request?->ip() ?? request()?->ip(),
                        'user_agent' => $request?->userAgent() ?? request()?->userAgent(),
                    ]);
                }
            } elseif ($tipo === 'rol') {
                $role = Role::find($id);
                if ($role) {
                    PermissionAudit::create([
                        'admin_id' => auth()->id() ?? 1,
                        'target_type' => 'rol',
                        'target_id' => $role->id,
                        'target_name' => $role->name,
                        'action' => 'editar',
                        'permisos_anteriores' => $permisosAnteriores,
                        'permisos_nuevos' => $permisosNuevos,
                        'descripcion' => "Cambio en lote (bulk edit) a {$role->name}",
                        'ip_address' => $request?->ip() ?? request()?->ip(),
                        'user_agent' => $request?->userAgent() ?? request()?->userAgent(),
                    ]);
                }
            }
        }
    }

    /**
     * Obtener historial de auditoría pagginado
     */
    public static function obtenerHistorial(
        int $perPage = 50,
        ?string $targetType = null,
        ?int $targetId = null,
        ?string $action = null
    ) {
        $query = PermissionAudit::with('admin')
            ->latest('created_at');

        if ($targetType) {
            $query->where('target_type', $targetType);
        }

        if ($targetId) {
            $query->where('target_id', $targetId);
        }

        if ($action) {
            $query->where('action', $action);
        }

        return $query->paginate($perPage);
    }

    /**
     * Obtener historial para un usuario específico
     */
    public static function obtenerHistorialUsuario(User $user, int $perPage = 50)
    {
        return self::obtenerHistorial($perPage, 'usuario', $user->id);
    }

    /**
     * Obtener historial para un rol específico
     */
    public static function obtenerHistorialRol(Role $role, int $perPage = 50)
    {
        return self::obtenerHistorial($perPage, 'rol', $role->id);
    }

    /**
     * Obtener estadísticas de auditoría
     */
    public static function obtenerEstadisticas()
    {
        return [
            'total_cambios' => PermissionAudit::count(),
            'cambios_usuarios' => PermissionAudit::where('target_type', 'usuario')->count(),
            'cambios_roles' => PermissionAudit::where('target_type', 'rol')->count(),
            'cambios_hoy' => PermissionAudit::whereDate('created_at', today())->count(),
            'cambios_esta_semana' => PermissionAudit::where('created_at', '>=', now()->subDays(7))->count(),
            'cambios_este_mes' => PermissionAudit::where('created_at', '>=', now()->subDays(30))->count(),
            'admin_mas_activo' => PermissionAudit::selectRaw('admin_id, count(*) as cambios')
                ->groupBy('admin_id')
                ->with('admin')
                ->latest('cambios')
                ->first(),
        ];
    }

    /**
     * Generar descripción del cambio
     */
    private static function generarDescripcion(
        string $tipo,
        array $permisosAnteriores,
        array $permisosNuevos
    ): string {
        $anteriores = collect($permisosAnteriores);
        $nuevos = collect($permisosNuevos);

        $agregados = $nuevos->diff($anteriores);
        $eliminados = $anteriores->diff($nuevos);

        $descripcion = [];

        if ($agregados->count() > 0) {
            $descripcion[] = "Agregados: {$agregados->count()} permisos";
        }

        if ($eliminados->count() > 0) {
            $descripcion[] = "Eliminados: {$eliminados->count()} permisos";
        }

        return implode('; ', $descripcion) ?: 'Sin cambios registrados';
    }
}
