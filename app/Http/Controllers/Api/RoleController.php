<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Mapeo de roles con descripción, categoría y permisos
     * Usado para mejorar la UI al seleccionar roles
     */
    private array $roleMetadata = [
        // ADMINISTRACIÓN
        'Super Admin' => [
            'category' => 'Administración',
            'description' => 'Acceso total al sistema. Puede gestionar admins, usuarios y todos los módulos.',
            'icon' => '👑',
            'color' => 'red',
            'permissions_count' => 168,
            'level' => 1,
            'recommended_for' => ['Propietario', 'Administrador Supremo'],
            'conflicts_with' => [], // No tiene conflictos
            'badge' => 'CRÍTICO',
        ],
        'Admin' => [
            'category' => 'Administración',
            'description' => 'Casi todos los permisos excepto admin.system. Acceso administrativo completo.',
            'icon' => '🛡️',
            'color' => 'orange',
            'permissions_count' => 167,
            'level' => 2,
            'recommended_for' => ['Administrador', 'Gerente General'],
            'conflicts_with' => ['Super Admin'], // No puede tener ambos (jerarquía)
            'badge' => 'ADMIN',
        ],
        'Manager' => [
            'category' => 'Administración',
            'description' => 'Gestión operativa completa. Puede supervisar ventas, compras, inventario y personal.',
            'icon' => '📊',
            'color' => 'blue',
            'permissions_count' => 120,
            'level' => 2,
            'recommended_for' => ['Gerente Operativo'],
            'conflicts_with' => ['Super Admin'],
        ],

        // GESTIÓN (Empleados que gestionan recursos)
        'Gestor de Clientes' => [
            'category' => 'Gestión',
            'description' => 'Empleados que crean, editan y gestionan clientes. Pueden crear y modificar información de clientes.',
            'icon' => '👥',
            'color' => 'green',
            'permissions_count' => 3,
            'level' => 3,
            'recommended_for' => ['Vendedor', 'Chofer Preventista', 'Asesor de Ventas'],
            'conflicts_with' => ['Cliente'], // No puede ser cliente y gestor
            'badge' => '⭐ NUEVO',
        ],
        'Gestor de Inventario' => [
            'category' => 'Gestión',
            'description' => 'Gestiona ajustes, mermas y transferencias de inventario. Puede ver stock y movimientos.',
            'icon' => '📦',
            'color' => 'purple',
            'permissions_count' => 12,
            'level' => 3,
            'recommended_for' => ['Jefe de Almacén', 'Encargado de Inventario'],
            'conflicts_with' => [],
        ],
        'Gestor de Almacén' => [
            'category' => 'Gestión',
            'description' => 'Gestiona transferencias entre almacenes y recepciones. Visibilidad completa del almacén.',
            'icon' => '🏭',
            'color' => 'purple',
            'permissions_count' => 11,
            'level' => 3,
            'recommended_for' => ['Gerente de Almacén'],
            'conflicts_with' => [],
        ],
        'Gestor de Logística' => [
            'category' => 'Gestión',
            'description' => 'Gestiona envíos y entregas. Puede programar rutas y asignar choferes.',
            'icon' => '🚚',
            'color' => 'purple',
            'permissions_count' => 8,
            'level' => 3,
            'recommended_for' => ['Jefe de Logística', 'Coordinador de Entregas'],
            'conflicts_with' => [],
        ],

        // OPERACIONAL (Empleados específicos)
        'Vendedor' => [
            'category' => 'Operacional',
            'description' => 'Crea ventas y proformas. Puede gestionar clientes y ver productos.',
            'icon' => '💼',
            'color' => 'cyan',
            'permissions_count' => 8,
            'level' => 3,
            'recommended_for' => ['Vendedor', 'Asesor de Ventas'],
            'conflicts_with' => [],
        ],
        'Comprador' => [
            'category' => 'Operacional',
            'description' => 'Crea y edita compras. Gestiona órdenes de compra a proveedores.',
            'icon' => '🛒',
            'color' => 'cyan',
            'permissions_count' => 6,
            'level' => 3,
            'recommended_for' => ['Comprador', 'Encargado de Compras'],
            'conflicts_with' => [],
        ],
        'Compras' => [
            'category' => 'Operacional',
            'description' => 'Gestión completa de compras. Acceso a órdenes, cuentas por pagar y reportes.',
            'icon' => '📥',
            'color' => 'cyan',
            'permissions_count' => 11,
            'level' => 3,
            'recommended_for' => ['Jefe de Compras'],
            'conflicts_with' => [],
        ],
        'Chofer' => [
            'category' => 'Operacional',
            'description' => 'Acceso a envíos asignados y seguimiento de entregas. Rol limitado para conductores.',
            'icon' => '🚗',
            'color' => 'cyan',
            'permissions_count' => 4,
            'level' => 4,
            'recommended_for' => ['Chofer', 'Conductor de Entregas'],
            'conflicts_with' => [],
        ],
        'Cajero' => [
            'category' => 'Operacional',
            'description' => 'Abre/cierra cajas y registra ventas. Acceso limitado a módulo de ventas.',
            'icon' => '💰',
            'color' => 'cyan',
            'permissions_count' => 5,
            'level' => 4,
            'recommended_for' => ['Cajero', 'Encargado de Caja'],
            'conflicts_with' => [],
        ],

        // REPORTES Y OTROS
        'Gerente' => [
            'category' => 'Reportes',
            'description' => 'Acceso a reportes y supervisión general. Solo lectura de datos operativos.',
            'icon' => '📈',
            'color' => 'teal',
            'permissions_count' => 8,
            'level' => 3,
            'recommended_for' => ['Gerente Administrativo'],
            'conflicts_with' => [],
        ],
        'Reportes' => [
            'category' => 'Reportes',
            'description' => 'Acceso completo a todos los reportes del sistema.',
            'icon' => '📊',
            'color' => 'teal',
            'permissions_count' => 8,
            'level' => 3,
            'recommended_for' => ['Analista', 'Contador'],
            'conflicts_with' => [],
        ],
        'Contabilidad' => [
            'category' => 'Contabilidad',
            'description' => 'Gestión de asientos contables y reportes financieros.',
            'icon' => '📋',
            'color' => 'teal',
            'permissions_count' => 5,
            'level' => 3,
            'recommended_for' => ['Contador', 'Contable'],
            'conflicts_with' => [],
        ],

        // USUARIOS FINALES
        'Cliente' => [
            'category' => 'Usuario Final',
            'description' => 'Usuario B2B. Puede ver/editar solo su propio perfil. Acceso limitado al sistema.',
            'icon' => '👤',
            'color' => 'gray',
            'permissions_count' => 1,
            'level' => 4,
            'recommended_for' => ['Cliente Mayorista', 'Usuario B2B'],
            'conflicts_with' => ['Gestor de Clientes', 'Vendedor', 'Chofer', 'Cajero'],
            'badge' => 'EXTERNO',
        ],
        'Empleado' => [
            'category' => 'Usuario Final',
            'description' => 'Empleado base. Acceso mínimo al sistema. Solo puede ver su perfil.',
            'icon' => '👔',
            'color' => 'gray',
            'permissions_count' => 1,
            'level' => 4,
            'recommended_for' => ['Empleado Genérico'],
            'conflicts_with' => [],
        ],
    ];

    /**
     * Obtener roles con detalles, categorías y descripciones
     * Endpoint mejorado para el selector de roles en el UI
     */
    public function getRolesWithDetails(): JsonResponse
    {
        $roles = Role::orderBy('name')->get();

        $rolesWithMetadata = $roles->map(function ($role) {
            $metadata = $this->roleMetadata[$role->name] ?? [
                'category' => 'Otros',
                'description' => 'Sin descripción disponible',
                'icon' => '❓',
                'color' => 'gray',
                'permissions_count' => 0,
                'level' => 5,
                'recommended_for' => [],
                'conflicts_with' => [],
            ];

            return [
                'id' => $role->id,
                'name' => $role->name,
                'label' => $role->name,
                ...array_map(fn($v) => $v, $metadata), // Spread metadata into result
            ];
        });

        // Agrupar por categoría para mejor presentación en UI
        $grouped = $rolesWithMetadata->groupBy('category')
            ->map(fn($roles) => $roles->values())
            ->toArray();

        return ApiResponse::success([
            'roles' => $rolesWithMetadata,
            'grouped' => $grouped,
            'categories' => array_keys($grouped),
        ]);
    }

    /**
     * Validar si una combinación de roles es válida
     * Previene selecciones conflictivas
     */
    public function validateRoleCombination(Request $request): JsonResponse
    {
        $rolesArray = $request->input('roles', []);

        if (!is_array($rolesArray)) {
            return ApiResponse::error('El parámetro roles debe ser un array', 422);
        }

        // Obtener metadata de los roles seleccionados
        $selectedMetadata = collect($rolesArray)->map(fn($name) => $this->roleMetadata[$name] ?? null)
            ->filter()
            ->toArray();

        // Validar conflictos
        $conflicts = [];
        foreach ($rolesArray as $role) {
            $metadata = $this->roleMetadata[$role] ?? [];
            $conflictsWith = $metadata['conflicts_with'] ?? [];

            foreach ($conflictsWith as $conflictRole) {
                if (in_array($conflictRole, $rolesArray)) {
                    $conflicts[] = "No se puede asignar '{$role}' junto con '{$conflictRole}'";
                }
            }
        }

        return ApiResponse::success([
            'valid' => empty($conflicts),
            'conflicts' => $conflicts,
            'warnings' => $this->getWarnings($rolesArray),
            'recommendations' => $this->getRecommendations($rolesArray),
        ]);
    }

    /**
     * Obtener recomendaciones según roles seleccionados
     */
    private function getRecommendations(array $roles): array
    {
        $recommendations = [];

        // Si selecciona Cliente, no debería tener otros roles operacionales
        if (in_array('Cliente', $roles) && count($roles) > 1) {
            $recommendations[] = 'Usuarios con rol Cliente suelen ser externos. ¿Debería ser solo Cliente?';
        }

        // Si selecciona múltiples gestores, verificar que tenga sentido
        $managers = ['Gestor de Clientes', 'Gestor de Inventario', 'Gestor de Almacén', 'Gestor de Logística'];
        $selectedManagers = array_intersect($roles, $managers);
        if (count($selectedManagers) > 2) {
            $recommendations[] = 'Este empleado tiene muchas responsabilidades de gestión. ¿Es intencional?';
        }

        // Si selecciona Admin, mencionar que es acceso crítico
        if (in_array('Admin', $roles) || in_array('Super Admin', $roles)) {
            $recommendations[] = '⚠️ Este usuario tendrá acceso administrativo crítico al sistema.';
        }

        return $recommendations;
    }

    /**
     * Obtener advertencias según roles seleccionados
     */
    private function getWarnings(array $roles): array
    {
        $warnings = [];

        // Super Admin sin Admin es inusual
        if (in_array('Super Admin', $roles) && !in_array('Admin', $roles)) {
            $warnings[] = 'Super Admin debería incluir también el rol Admin';
        }

        return $warnings;
    }
}
