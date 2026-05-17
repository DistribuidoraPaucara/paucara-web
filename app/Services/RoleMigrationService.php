<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Collection;

/**
 * ============================================
 * FASE 3: SERVICIO DE MIGRACIÓN DE ROLES
 * ============================================
 *
 * Ayuda a migrar usuarios de roles legacy (complejos)
 * a los nuevos 5 roles base + plantillas de capacidades.
 */
class RoleMigrationService
{
    private PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Mapa de roles legacy a plantillas de capacidades
     */
    private array $rolesToTemplatesMap = [
        'Preventista' => 'preventista',
        'Vendedor' => 'vendedor-avanzado',
        'Comprador' => 'comprador',
        'Gestor de Inventario' => 'gestor-inventario',
        'Gestor de Almacén' => 'gestor-almacen',
        'Gestor de Logística' => 'gestor-almacen',
        'Chofer' => 'chofer',
        'Cajero' => 'cajero',
        'Contabilidad' => 'contador',
        'Reportes' => 'analista-reportes',
        'Gerente' => 'gerente',
        'Gestor de Clientes' => 'vendedor-avanzado',
        'Compras' => 'comprador',
    ];

    /**
     * Obtener todos los usuarios con roles legacy
     */
    public function obtenerUsuariosConRolesLegacy(): Collection
    {
        $baseRoles = ['Super Admin', 'Admin', 'Manager', 'Empleado', 'Cliente'];

        return User::query()
            ->with('roles')
            ->get()
            ->filter(function ($user) use ($baseRoles) {
                $userRoles = $user->roles->pluck('name')->toArray();

                foreach ($userRoles as $role) {
                    if (!in_array($role, $baseRoles)) {
                        return true;
                    }
                }
                return false;
            });
    }

    /**
     * Obtener plan de migración para un usuario
     */
    public function obtenerPlanMigracion(User $user): array
    {
        $userRoles = $user->roles->pluck('name')->toArray();
        $baseRoles = ['Super Admin', 'Admin', 'Manager', 'Empleado', 'Cliente'];

        $rolesBase = [];
        $rolesLegacy = [];
        $plantillasRecomendadas = [];

        foreach ($userRoles as $role) {
            if (in_array($role, $baseRoles)) {
                $rolesBase[] = $role;
            } else {
                $rolesLegacy[] = $role;
                if (isset($this->rolesToTemplatesMap[$role])) {
                    $plantillasRecomendadas[] = $this->rolesToTemplatesMap[$role];
                }
            }
        }

        if (empty($rolesBase)) {
            $rolesBase = ['Empleado'];
        }

        $plantillasRecomendadas = array_unique($plantillasRecomendadas);

        return [
            'usuario_id' => $user->id,
            'usuario_nombre' => $user->name,
            'roles_actuales' => $userRoles,
            'roles_base_detectados' => $rolesBase,
            'roles_legacy_detectados' => $rolesLegacy,
            'nuevo_rol_base' => $rolesBase[0] ?? 'Empleado',
            'plantillas_recomendadas' => $plantillasRecomendadas,
            'paso_1' => 'Mantener rol base: ' . ($rolesBase[0] ?? 'Empleado'),
            'paso_2' => count($plantillasRecomendadas) > 0
                ? 'Asignar plantillas: ' . implode(', ', $plantillasRecomendadas)
                : 'No hay plantillas recomendadas',
            'paso_3' => count($rolesLegacy) > 0
                ? 'Remover roles legacy: ' . implode(', ', $rolesLegacy)
                : 'No hay roles legacy para remover',
        ];
    }

    /**
     * Ejecutar migración de un usuario
     */
    public function migrarUsuario(User $user, array $options = []): array
    {
        $plan = $this->obtenerPlanMigracion($user);
        $resultados = [
            'usuario_id' => $user->id,
            'usuario_nombre' => $user->name,
            'exito' => true,
            'pasos_ejecutados' => [],
            'errores' => [],
        ];

        try {
            $nuevoRolBase = $options['nuevo_rol_base'] ?? $plan['nuevo_rol_base'];
            if (!$user->hasRole($nuevoRolBase)) {
                $user->assignRole($nuevoRolBase);
                $resultados['pasos_ejecutados'][] = "✓ Rol base '{$nuevoRolBase}' asignado";
            }

            $plantillasAsignar = $options['plantillas'] ?? $plan['plantillas_recomendadas'];
            foreach ($plantillasAsignar as $plantilla) {
                try {
                    $this->permissionService->assignCapabilityToUser($user, $plantilla);
                    $resultados['pasos_ejecutados'][] = "✓ Plantilla '{$plantilla}' aplicada";
                } catch (\Exception $e) {
                    $resultados['errores'][] = "✗ Error en '{$plantilla}': " . $e->getMessage();
                }
            }

            if ($options['remover_roles_legacy'] ?? false) {
                foreach ($plan['roles_legacy_detectados'] as $roleLegacy) {
                    $user->removeRole($roleLegacy);
                    $resultados['pasos_ejecutados'][] = "✓ Rol legacy '{$roleLegacy}' removido";
                }
            }

            if (!empty($resultados['errores'])) {
                $resultados['exito'] = false;
            }

        } catch (\Exception $e) {
            $resultados['exito'] = false;
            $resultados['errores'][] = "Error general: " . $e->getMessage();
        }

        return $resultados;
    }

    /**
     * Migrar todos los usuarios
     */
    public function migrarTodos(array $options = []): array
    {
        $usuarios = $this->obtenerUsuariosConRolesLegacy();
        $resultados = [
            'total_usuarios' => $usuarios->count(),
            'migraciones_exitosas' => 0,
            'migraciones_fallidas' => 0,
            'usuarios' => [],
        ];

        foreach ($usuarios as $usuario) {
            $resultado = $this->migrarUsuario($usuario, $options);
            if ($resultado['exito']) {
                $resultados['migraciones_exitosas']++;
            } else {
                $resultados['migraciones_fallidas']++;
            }
            $resultados['usuarios'][] = $resultado;
        }

        return $resultados;
    }

    /**
     * Obtener reporte de migración
     */
    public function obtenerReporte(): array
    {
        $usuarios = $this->obtenerUsuariosConRolesLegacy();
        $planes = $usuarios->map(fn($user) => $this->obtenerPlanMigracion($user));

        return [
            'total_usuarios_a_migrar' => $usuarios->count(),
            'usuarios_con_roles_legacy' => $planes->toArray(),
        ];
    }
}
