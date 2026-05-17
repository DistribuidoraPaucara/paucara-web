<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:roles.index')->only('index');
        $this->middleware('permission:roles.show')->only('show');
        $this->middleware('permission:roles.create')->only(['create', 'store']);
        $this->middleware('permission:roles.edit')->only(['edit', 'update']);
        $this->middleware('permission:roles.delete')->only('destroy');
        $this->middleware('permission:roles.manage-permissions')->only(['assignPermission', 'removePermission']);
    }

    public function index(Request $request)
    {
        $query = Role::withCount(['users', 'permissions']);

        // Filtros de búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $roles = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('roles/index', [
            'roles'   => $roles,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function create()
    {
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return Inertia::render('admin/permisos/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255', 'unique:roles'],
            'guard_name'    => ['required', 'string', 'max:255'],
            'permissions'   => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role = Role::create([
            'name'       => $validated['name'],
            'guard_name' => $validated['guard_name'] ?? 'web',
        ]);

        // Asignar permisos
        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->pluck('name');
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Rol creado exitosamente.');
    }

    public function show(Role $role)
    {
        $role->load(['permissions', 'users']);

        return Inertia::render('admin/permisos/roles/show', [
            'role'            => $role,
            'rolePermissions' => $role->permissions,
            'roleUsers'       => $role->users,
        ]);
    }

    public function edit(Role $role)
    {
        $role->load('permissions');
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return Inertia::render('admin/permisos/roles/edit', [
            'role'            => $role,
            'permissions'     => $permissions,
            'rolePermissions' => $role->permissions->pluck('id'),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
            'guard_name'    => ['required', 'string', 'max:255'],
            'permissions'   => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role->update([
            'name'       => $validated['name'],
            'guard_name' => $validated['guard_name'] ?? 'web',
        ]);

        // Sincronizar permisos
        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->pluck('name');
            $role->syncPermissions($permissions);
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Rol actualizado exitosamente.');
    }

    public function destroy(Role $role)
    {
        // Evitar eliminar roles con usuarios asignados
        if ($role->users()->count() > 0) {
            return back()->with('error', 'No puedes eliminar un rol que tiene usuarios asignados.');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Rol eliminado exitosamente.');
    }

    public function assignPermission(Request $request, Role $role)
    {
        $request->validate([
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $role->givePermissionTo($request->permission);

        return back()->with('success', 'Permiso asignado exitosamente.');
    }

    public function removePermission(Request $request, Role $role)
    {
        $request->validate([
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $role->revokePermissionTo($request->permission);

        return back()->with('success', 'Permiso removido exitosamente.');
    }

    /**
     * Obtener plantillas de permisos
     */
    public function getTemplates()
    {
        $templates = \App\Models\RoleTemplate::with(['creador:id,name', 'actualizadoPor:id,name'])->get();

        return response()->json($templates);
    }

    /**
     * Crear nueva plantilla de permisos
     */
    public function createTemplate(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => ['required', 'string', 'unique:role_templates'],
            'descripcion' => ['nullable', 'string'],
            'permisos'    => ['required', 'array'],
            'permisos.*'  => ['exists:permissions,id'],
        ]);

        $template = \App\Models\RoleTemplate::create([
            'nombre'      => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'permisos'    => $validated['permisos'],
            'created_by'  => auth()->id(),
        ]);

        return response()->json([
            'success'  => true,
            'template' => $template,
            'message'  => "Plantilla '{$template->nombre}' creada exitosamente.",
        ]);
    }

    /**
     * Aplicar plantilla a un rol
     */
    public function applyTemplate(Request $request, Role $role)
    {
        $validated = $request->validate([
            'template_id' => ['required', 'exists:role_templates,id'],
        ]);

        $template = \App\Models\RoleTemplate::findOrFail($validated['template_id']);

        // Obtener permisos antes del cambio
        $permisosAntes = $role->permissions->pluck('id')->toArray();

        // Sincronizar permisos
        $permissions = Permission::whereIn('id', $template->permisos)->pluck('name');
        $role->syncPermissions($permissions);

        // Registrar en auditoría
        \App\Models\RoleAudit::registrar(
            $role,
            auth()->user(),
            'aplicar_plantilla',
            "Plantilla '{$template->nombre}' aplicada al rol '{$role->name}'",
            null,
            $permisosAntes,
            $template->permisos,
            $role->users()->count()
        );

        return back()->with('success', "Plantilla aplicada exitosamente a {$role->name}.");
    }

    /**
     * Copiar permisos desde otro rol
     */
    public function copyFromRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'source_role_id' => ['required', 'exists:roles,id'],
        ]);

        $sourceRole = Role::findOrFail($validated['source_role_id']);

        // Obtener permisos antes
        $permisosAntes = $role->permissions->pluck('id')->toArray();

        // Copiar permisos
        $role->syncPermissions($sourceRole->permissions);

        // Registrar en auditoría
        \App\Models\RoleAudit::registrar(
            $role,
            auth()->user(),
            'copiar_permisos',
            "Permisos copiados desde '{$sourceRole->name}' a '{$role->name}'",
            null,
            $permisosAntes,
            $sourceRole->permissions->pluck('id')->toArray(),
            $role->users()->count()
        );

        return back()->with('success', "Permisos copiados exitosamente desde {$sourceRole->name}.");
    }

    /**
     * Comparar dos roles
     */
    public function compareRoles(Request $request)
    {
        $validated = $request->validate([
            'role1_id' => ['required', 'exists:roles,id'],
            'role2_id' => ['required', 'exists:roles,id'],
        ]);

        $role1 = Role::with('permissions')->findOrFail($validated['role1_id']);
        $role2 = Role::with('permissions')->findOrFail($validated['role2_id']);

        $permisos1 = $role1->permissions->pluck('id')->toArray();
        $permisos2 = $role2->permissions->pluck('id')->toArray();

        // Calcular diferencias
        $soloEnRol1 = array_diff($permisos1, $permisos2);
        $soloEnRol2 = array_diff($permisos2, $permisos1);
        $comunes    = array_intersect($permisos1, $permisos2);

        // Obtener nombres de permisos
        $permisosObj = Permission::whereIn('id', array_merge($soloEnRol1, $soloEnRol2, $comunes))
            ->get()
            ->keyBy('id');

        return response()->json([
            'rol1'       => [
                'id'         => $role1->id,
                'nombre'     => $role1->name,
                'soloEnEste' => array_map(fn($id) => $permisosObj[$id]->name ?? null, $soloEnRol1),
                'total'      => count($permisos1),
            ],
            'rol2'       => [
                'id'         => $role2->id,
                'nombre'     => $role2->name,
                'soloEnEste' => array_map(fn($id) => $permisosObj[$id]->name ?? null, $soloEnRol2),
                'total'      => count($permisos2),
            ],
            'comunes'    => count($comunes),
            'diferentes' => count($soloEnRol1) + count($soloEnRol2),
        ]);
    }

    /**
     * Obtener auditoría de un rol
     */
    public function getAudit(Role $role)
    {
        $audits = \App\Models\RoleAudit::where('role_id', $role->id)
            ->with(['usuario:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($audits);
    }

    /**
     * Obtener descripción de permisos agrupados por módulo
     */
    public function getPermissionsGrouped()
    {
        $allPermissions = Permission::all();

        // Agrupar por módulo (primer segmento antes del punto)
        $grouped = $allPermissions->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        // Agregar descripciones
        $result = [];
        foreach ($grouped as $module => $permissions) {
            $result[$module] = $permissions->map(function ($permission) {
                return [
                    'id'          => $permission->id,
                    'name'        => $permission->name,
                    'description' => $this->getPermissionDescription($permission->name),
                ];
            })->toArray();
        }

        return response()->json($result);
    }

    /**
     * Obtener descripción de un permiso
     */
    private function getPermissionDescription(string $permissionName): string
    {
        $descriptions = [
            // Usuarios
            'usuarios.index'                => 'Ver lista de usuarios',
            'usuarios.create'               => 'Crear nuevos usuarios',
            'usuarios.store'                => 'Guardar usuarios',
            'usuarios.show'                 => 'Ver detalles del usuario',
            'usuarios.edit'                 => 'Editar usuarios',
            'usuarios.update'               => 'Actualizar usuarios',
            'usuarios.destroy'              => 'Eliminar usuarios',
            'usuarios.assign-role'          => 'Asignar roles a usuarios',
            'usuarios.remove-role'          => 'Quitar roles de usuarios',

            // Roles
            'roles.index'                   => 'Ver lista de roles',
            'roles.create'                  => 'Crear nuevos roles',
            'roles.store'                   => 'Guardar roles',
            'roles.show'                    => 'Ver detalles del rol',
            'roles.edit'                    => 'Editar roles',
            'roles.update'                  => 'Actualizar roles',
            'roles.delete'                  => 'Eliminar roles',
            'roles.manage-permissions'      => 'Gestionar permisos de roles',

            // Permisos
            'permissions.index'             => 'Ver lista de permisos',
            'permissions.create'            => 'Crear nuevos permisos',
            'permissions.store'             => 'Guardar permisos',
            'permissions.show'              => 'Ver detalles del permiso',
            'permissions.edit'              => 'Editar permisos',
            'permissions.update'            => 'Actualizar permisos',
            'permissions.destroy'           => 'Eliminar permisos',

            // Clientes
            'clientes.manage'               => 'Gestión completa de clientes',
            'clientes.direcciones.*'        => 'Gestión de direcciones de clientes',
            'clientes.fotos.*'              => 'Gestión de fotos/documentos',
            'clientes.ventanas-entrega.*'   => 'Gestión de ventanas de entrega',
            'clientes.cuentas-por-cobrar.*' => 'Ver cuentas por cobrar',

            // Ventas
            'ventas.index'                  => 'Ver listado de ventas',
            'ventas.create'                 => 'Crear ventas',
            'ventas.store'                  => 'Guardar ventas',
            'ventas.show'                   => 'Ver detalle de venta',
            'ventas.edit'                   => 'Editar ventas',
            'ventas.update'                 => 'Actualizar ventas',
            'ventas.destroy'                => 'Eliminar ventas',

            // Cajas
            'cajas.index'                   => 'Ver dashboard de cajas',
            'cajas.abrir'                   => 'Abrir cajas',
            'cajas.cerrar'                  => 'Cerrar cajas',
            'cajas.transacciones'           => 'Gestionar transacciones de caja',

            // Compras
            'compras.index'                 => 'Ver listado de compras',
            'compras.create'                => 'Crear compras',
            'compras.destroy'               => 'Eliminar compras',
        ];

        return $descriptions[$permissionName] ?? "Permiso: $permissionName";
    }
}
