<?php

namespace App\Http\Controllers;

use App\Services\PermissionService;
use App\Services\AuditService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function __construct(
        private PermissionService $permissionService
    ) {}

    /**
     * ✅ PANEL UNIFICADO: Centro de permisos y roles
     * Renderiza el nuevo panel con tabs para usuarios y roles
     */
    public function index()
    {
        $this->authorize('permissions.index');

        // El nuevo componente React carga los datos dinámicamente via API
        return Inertia::render('admin/permisos/index');
    }

    /**
     * ✅ PANEL WEB: Editar permisos de un usuario específico
     */
    public function editarUsuario(User $user)
    {
        $this->authorize('usuarios.assign-permission');

        // ==========================================
        // 1️⃣ PERMISOS DIRECTOS vs HEREDADOS
        // ==========================================
        $permisosDirectos = $user->getDirectPermissions()->pluck('id')->toArray();
        $permisosHeredados = $user->getPermissionsViaRoles()->pluck('id')->toArray();
        $permisosActuales = $user->getAllPermissions()->pluck('id')->toArray();

        // Mapeo de permiso_id => array de roles de los que viene
        $permisoPorRoles = [];
        foreach ($user->roles as $role) {
            foreach ($role->permissions as $permission) {
                if (!isset($permisoPorRoles[$permission->id])) {
                    $permisoPorRoles[$permission->id] = [];
                }
                $permisoPorRoles[$permission->id][] = $role->name;
            }
        }

        $todosLosPermisos = $this->permissionService->getPermissionsForUI();
        $rolesActuales = $user->roles->pluck('name')->toArray();

        // ✅ NUEVO: Obtener todos los roles disponibles con cantidad de permisos
        $todosLosRoles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description ?? '',
                'permissions_count' => $role->permissions()->count(),
            ];
        });

        return Inertia::render('admin/permisos/usuario', [
            'usuario' => $user,
            'permisosActuales' => $permisosActuales,
            'permisosDirectos' => $permisosDirectos,
            'permisosHeredados' => $permisosHeredados,
            'permisoPorRoles' => $permisoPorRoles,  // permiso_id => [rol1, rol2, ...]
            'rolesActuales' => $rolesActuales,
            'todosLosPermisos' => $todosLosPermisos,
            'todosLosRoles' => $todosLosRoles,
        ]);
    }

    /**
     * ✅ API: Actualizar permisos y roles de un usuario
     * Usado por: Panel web + APP móvil
     */
    public function actualizarUsuario(Request $request, User $user)
    {
        $this->authorize('usuarios.assign-permission');

        $validated = $request->validate([
            'permisos' => 'array',
            'permisos.*' => 'exists:permissions,id',
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        // ✅ PASO 1: Sincronizar roles primero
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        } else {
            // Si no hay roles, limpiar todos
            $user->syncRoles([]);
        }

        // ✅ PASO 2: Sincronizar permisos directos (esto limpia los viejos y añade los nuevos)
        $permisosDirectos = [];
        if (isset($validated['permisos']) && !empty($validated['permisos'])) {
            // Convertir IDs a nombres de permisos
            $permisosDirectos = Permission::whereIn('id', $validated['permisos'])
                ->pluck('name')
                ->toArray();
        }

        // Sincronizar permisos (esto limpia los anteriores y añade los nuevos)
        $user->syncPermissions($permisosDirectos);

        // ✅ Retornar respuesta Inertia (para que el frontend pueda manejar onSuccess)
        return redirect()->back();
    }

    /**
     * ✅ PANEL WEB: Editar permisos de un rol
     */
    public function editarRol(Role $role)
    {
        $this->authorize('roles.assign-permission');

        $permisosActuales = $role->permissions()->pluck('id')->toArray();
        $todosLosPermisos = $this->permissionService->getPermissionsForUI();
        return Inertia::render('admin/permisos/rol', [
            'rol' => $role,
            'permisosActuales' => $permisosActuales,
            'todosLosPermisos' => $todosLosPermisos,
        ]);
    }

    /**
     * ✅ API: Actualizar permisos de un rol
     */
    public function actualizarRol(Request $request, Role $role)
    {
        $this->authorize('roles.assign-permission');

        $validated = $request->validate([
            'permisos' => 'array',
            'permisos.*' => 'exists:permissions,id',
        ]);

        $this->permissionService->assignPermissionsToRole($role, $validated['permisos'] ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Permisos del rol actualizados correctamente',
            'permissions' => $role->permissions()->pluck('name')->toArray(),
        ]);
    }

    /**
     * ✅ API: Obtener estructura de permisos (para dropdown/selector en UI)
     */
    public function getStructure()
    {
        $this->authorize('permissions.index');

        return response()->json([
            'success' => true,
            'permissions' => $this->permissionService->getPermissionsForUI(),
            'total' => Permission::count(),
        ]);
    }

    /**
     * ✅ API: Obtener permisos agrupados
     */
    public function getGrouped()
    {
        $this->authorize('permissions.index');

        return response()->json([
            'success' => true,
            'grouped' => $this->permissionService->getPermissionsGrouped(),
        ]);
    }

    /**
     * ✅ API: Obtener lista de usuarios para el panel central
     * Soporta búsqueda por nombre/email y filtrado por rol
     */
    public function getUsuarios(Request $request)
    {
        $this->authorize('permissions.index');

        $search = $request->query('search');
        $rol = $request->query('rol');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 50);

        $result = $this->permissionService->obtenerUsuariosPaginados(
            page: $page,
            perPage: $perPage,
            search: $search,
            rol: $rol
        );

        $usuarios = $result->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'permissions_count' => $user->getAllPermissions()->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $usuarios,
            'pagination' => [
                'current_page' => $result->currentPage(),
                'per_page' => $result->perPage(),
                'total' => $result->total(),
                'last_page' => $result->lastPage(),
            ],
        ]);
    }

    /**
     * ✅ API: Obtener lista de roles para el panel central
     * Soporta búsqueda por nombre
     */
    public function getRoles(Request $request)
    {
        $this->authorize('permissions.index');

        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 50);

        $result = $this->permissionService->obtenerRolesPaginados(
            page: $page,
            perPage: $perPage,
            search: $search
        );

        $roles = $result->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name ?? $role->name,
                'permissions_count' => $role->permissions()->count(),
                'description' => $role->description ?? '',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $roles,
            'pagination' => [
                'current_page' => $result->currentPage(),
                'per_page' => $result->perPage(),
                'total' => $result->total(),
                'last_page' => $result->lastPage(),
            ],
        ]);
    }

    /**
     * ✅ API: Obtener historial de auditoría
     * Usado por: Panel de historial y auditoría
     */
    public function getHistorial(Request $request)
    {
        $this->authorize('permissions.index');

        $targetType = $request->query('target_type'); // 'usuario' o 'rol'
        $targetId = $request->query('target_id');
        $action = $request->query('action'); // 'crear', 'editar', 'eliminar'
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 50);

        $historial = AuditService::obtenerHistorial(
            perPage: $perPage,
            targetType: $targetType,
            targetId: $targetId ? (int)$targetId : null,
            action: $action
        );

        $datos = $historial->map(function ($audit) {
            return [
                'id' => $audit->id,
                'admin' => [
                    'id' => $audit->admin->id,
                    'name' => $audit->admin->name,
                    'email' => $audit->admin->email,
                ],
                'target_type' => $audit->target_type,
                'target_id' => $audit->target_id,
                'target_name' => $audit->target_name,
                'action' => $audit->action,
                'descripcion' => $audit->descripcion,
                'permisos_changed' => $audit->permisos_changed,
                'ip_address' => $audit->ip_address,
                'created_at' => $audit->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Obtener estadísticas
        $estadisticas = AuditService::obtenerEstadisticas();

        return response()->json([
            'success' => true,
            'data' => $datos,
            'pagination' => [
                'current_page' => $historial->currentPage(),
                'per_page' => $historial->perPage(),
                'total' => $historial->total(),
                'last_page' => $historial->lastPage(),
            ],
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * ✅ API: Bulk edit de permisos
     * Asignar los mismos permisos a múltiples usuarios o roles
     */
    public function bulkEdit(Request $request)
    {
        $this->authorize('permissions.index');

        $validated = $request->validate([
            'tipo' => 'required|in:usuario,rol',
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:' . ($request->input('tipo') === 'usuario' ? 'users' : 'roles') . ',id',
            'permisos' => 'required|array|min:1',
            'permisos.*' => 'required|integer|exists:permissions,id',
            'accion' => 'required|in:reemplazar,agregar,eliminar', // reemplazar todos, agregar a existentes, eliminar de existentes
        ]);

        $tipo = $validated['tipo'];
        $ids = $validated['ids'];
        $permisos = $validated['permisos'];
        $accion = $validated['accion'];

        try {
            foreach ($ids as $id) {
                if ($tipo === 'usuario') {
                    $usuario = User::find($id);
                    if (!$usuario) continue;

                    $permisosAnteriores = $usuario->getAllPermissions()->pluck('id')->toArray();
                    $permisosNuevos = match ($accion) {
                        'reemplazar' => $permisos,
                        'agregar' => array_unique(array_merge($permisosAnteriores, $permisos)),
                        'eliminar' => array_diff($permisosAnteriores, $permisos),
                    };

                    $this->permissionService->assignPermissionsToUser($usuario, $permisosNuevos);
                } else {
                    $role = Role::find($id);
                    if (!$role) continue;

                    $permisosAnteriores = $role->permissions()->pluck('id')->toArray();
                    $permisosNuevos = match ($accion) {
                        'reemplazar' => $permisos,
                        'agregar' => array_unique(array_merge($permisosAnteriores, $permisos)),
                        'eliminar' => array_diff($permisosAnteriores, $permisos),
                    };

                    $this->permissionService->assignPermissionsToRole($role, $permisosNuevos);
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Permisos asignados a " . count($ids) . " " . ($tipo === 'usuario' ? 'usuarios' : 'roles'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en asignación en lote: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * ============================================
     * FASE 2: ENDPOINTS DE CAPACIDADES
     * ============================================
     */

    /**
     * ✅ API: Obtener todas las capacidades con sus permisos
     */
    public function getCapabilities()
    {
        $this->authorize('permissions.index');

        $capabilities = $this->permissionService->getCapabilitiesWithPermissions();

        return response()->json([
            'success' => true,
            'data' => $capabilities,
            'total' => count($capabilities),
        ]);
    }

    /**
     * ✅ API: Obtener capacidades de un usuario
     */
    public function getUserCapabilities(User $user)
    {
        $this->authorize('permissions.index');

        $capabilities = $this->permissionService->getUserCapabilities($user);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * ✅ API: Obtener capacidades de un rol
     */
    public function getRoleCapabilities(Role $role)
    {
        $this->authorize('permissions.index');

        $capabilities = $this->permissionService->getRoleCapabilities($role);

        return response()->json([
            'success' => true,
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
            ],
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * ✅ API: Asignar capacidad a un usuario
     */
    public function assignCapabilityToUser(Request $request, User $user)
    {
        $this->authorize('usuarios.assign-permission');

        $validated = $request->validate([
            'capability' => 'required|string|exists:capabilities,name',
        ]);

        $success = $this->permissionService->assignCapabilityToUser($user, $validated['capability']);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Capacidad no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Capacidad '{$validated['capability']}' asignada a {$user->name}",
            'capabilities' => $this->permissionService->getUserCapabilities($user),
        ]);
    }

    /**
     * ✅ API: Asignar capacidad a un rol
     */
    public function assignCapabilityToRole(Request $request, Role $role)
    {
        $this->authorize('roles.assign-permission');

        $validated = $request->validate([
            'capability' => 'required|string|exists:capabilities,name',
        ]);

        $success = $this->permissionService->assignCapabilityToRole($role, $validated['capability']);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Capacidad no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Capacidad '{$validated['capability']}' asignada al rol {$role->name}",
            'capabilities' => $this->permissionService->getRoleCapabilities($role),
        ]);
    }

    /**
     * ✅ API: Remover capacidad de un usuario
     */
    public function removeCapabilityFromUser(Request $request, User $user)
    {
        $this->authorize('usuarios.remove-permission');

        $validated = $request->validate([
            'capability' => 'required|string|exists:capabilities,name',
        ]);

        $success = $this->permissionService->removeCapabilityFromUser($user, $validated['capability']);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Capacidad no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Capacidad '{$validated['capability']}' removida de {$user->name}",
            'capabilities' => $this->permissionService->getUserCapabilities($user),
        ]);
    }

    /**
     * ✅ API: Remover capacidad de un rol
     */
    public function removeCapabilityFromRole(Request $request, Role $role)
    {
        $this->authorize('roles.remove-permission');

        $validated = $request->validate([
            'capability' => 'required|string|exists:capabilities,name',
        ]);

        $success = $this->permissionService->removeCapabilityFromRole($role, $validated['capability']);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Capacidad no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Capacidad '{$validated['capability']}' removida del rol {$role->name}",
            'capabilities' => $this->permissionService->getRoleCapabilities($role),
        ]);
    }

    /**
     * ✅ API: Obtener todas las plantillas de capacidades
     */
    public function getCapabilityTemplates()
    {
        $this->authorize('permissions.index');

        $templates = \App\Models\CapabilityTemplate::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($template) {
                $perms = $template->getPermissions();
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'label' => $template->label,
                    'description' => $template->description,
                    'capabilities' => $template->capabilities,
                    'capabilities_count' => count($template->capabilities ?? []),
                    'permissions_count' => $perms->count(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $templates,
            'total' => $templates->count(),
        ]);
    }

    /**
     * ✅ API: Aplicar plantilla a un usuario
     */
    public function applyTemplateToUser(Request $request, User $user)
    {
        $this->authorize('usuarios.assign-permission');

        $validated = $request->validate([
            'template' => 'required|string|exists:capability_templates,name',
            'mode' => 'required|in:replace,add', // replace: reemplaza, add: agrega
        ]);

        $template = \App\Models\CapabilityTemplate::where('name', $validated['template'])->first();
        if (!$template) {
            return response()->json([
                'success' => false,
                'message' => 'Plantilla no encontrada',
            ], 404);
        }

        if ($validated['mode'] === 'replace') {
            // Remover todos los permisos
            $user->syncPermissions([]);
        }

        // Asignar capacidades de la plantilla
        foreach ($template->capabilities as $capability) {
            $this->permissionService->assignCapabilityToUser($user, $capability);
        }

        return response()->json([
            'success' => true,
            'message' => "Plantilla '{$template->label}' aplicada a {$user->name}",
            'capabilities' => $this->permissionService->getUserCapabilities($user),
        ]);
    }

    /**
     * ✅ API: Aplicar plantilla a un rol
     */
    public function applyTemplateToRole(Request $request, Role $role)
    {
        $this->authorize('roles.assign-permission');

        $validated = $request->validate([
            'template' => 'required|string|exists:capability_templates,name',
            'mode' => 'required|in:replace,add',
        ]);

        $template = \App\Models\CapabilityTemplate::where('name', $validated['template'])->first();
        if (!$template) {
            return response()->json([
                'success' => false,
                'message' => 'Plantilla no encontrada',
            ], 404);
        }

        if ($validated['mode'] === 'replace') {
            // Remover todos los permisos
            $role->syncPermissions([]);
        }

        // Asignar capacidades de la plantilla
        foreach ($template->capabilities as $capability) {
            $this->permissionService->assignCapabilityToRole($role, $capability);
        }

        return response()->json([
            'success' => true,
            'message' => "Plantilla '{$template->label}' aplicada al rol {$role->name}",
            'capabilities' => $this->permissionService->getRoleCapabilities($role),
        ]);
    }
}
