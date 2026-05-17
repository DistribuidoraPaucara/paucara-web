<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:usuarios.index')->only('index');
        $this->middleware('permission:usuarios.show')->only('show');
        $this->middleware('permission:usuarios.create')->only(['create', 'store']);
        $this->middleware('permission:usuarios.edit')->only(['edit', 'update']);
        $this->middleware('permission:usuarios.delete')->only('destroy');
        $this->middleware('permission:usuarios.toggle-status')->only('toggleStatus');
        $this->middleware('permission:usuarios.manage-roles')->only(['assignRole', 'removeRole']);
        $this->middleware('permission:usuarios.manage-permissions')->only(['assignPermission', 'removePermission']);
    }

    public function index(Request $request)
    {
        $query = User::with(['roles', 'permissions']);

        // Filtros de búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('usernick', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        $roles = Role::all();

        return Inertia::render('usuarios/index', [
            'users'   => $users,
            'roles'   => $roles,
            'filters' => [
                'search' => $request->search,
                'role'   => $request->role,
            ],
        ]);
    }

    public function create()
    {
        $roles       = Role::all();
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return Inertia::render('usuarios/create', [
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'usernick'      => ['required', 'string', 'max:255', 'unique:users'],
            'email'         => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'roles'         => ['array'],
            'roles.*'       => ['exists:roles,id'],
            'permissions'   => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'usernick' => $validated['usernick'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            // ✅ NUEVO: Asignar la empresa_id del usuario autenticado
            'empresa_id' => Auth::user()?->empresa_id,
        ]);

        // Asignar roles
        if (isset($validated['roles'])) {
            $user->syncRoles(Role::whereIn('id', $validated['roles'])->pluck('name'));
        }

        // Asignar permisos directos
        if (isset($validated['permissions'])) {
            $user->syncPermissions(Permission::whereIn('id', $validated['permissions'])->pluck('name'));
        }

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function show(User $usuario)
    {
        // Cargar permisos directos y permisos asignados a cada rol para que la vista pueda mostrarlos
        $usuario->load(['roles.permissions', 'permissions']);

        return Inertia::render('usuarios/show', [
            'user'            => $usuario,
            'userRoles'       => $usuario->roles->pluck('id')->toArray(),
            'userPermissions' => $usuario->permissions->pluck('id')->toArray(),
            'allPermissions'  => $usuario->getAllPermissions(),
        ]);
    }

    public function edit(User $usuario)
    {
        // Cargar permisos directos y permisos de los roles para que la vista pueda identificar permisos heredados
        $usuario->load(['roles.permissions', 'permissions']);
        $roles       = Role::all();
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return Inertia::render('usuarios/edit', [
            'user'            => $usuario,
            'roles'           => $roles,
            'permissions'     => $permissions,
            'userRoles'       => $usuario->roles->pluck('id')->toArray(),
            'userPermissions' => $usuario->permissions->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, User $usuario)
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'usernick'      => ['required', 'string', 'max:255', Rule::unique('users')->ignore($usuario->id)],
            'email'         => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($usuario->id)],
            'password'      => ['nullable', 'string', 'min:8', 'confirmed'],
            'roles'         => ['array'],
            'roles.*'       => ['exists:roles,id'],
            'permissions'   => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $usuario->update([
            'name'     => $validated['name'],
            'usernick' => $validated['usernick'],
            'email'    => $validated['email'],
        ]);

        // Actualizar contraseña solo si se proporciona
        if (! empty($validated['password'])) {
            $usuario->update(['password' => Hash::make($validated['password'])]);
        }

        // Sincronizar roles
        if (isset($validated['roles'])) {
            $usuario->syncRoles(Role::whereIn('id', $validated['roles'])->pluck('name'));
        } else {
            $usuario->syncRoles([]);
        }

        // Sincronizar permisos directos
        if (isset($validated['permissions'])) {
            $usuario->syncPermissions(Permission::whereIn('id', $validated['permissions'])->pluck('name'));
        } else {
            $usuario->syncPermissions([]);
        }

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $usuario)
    {
        // Evitar que el usuario se elimine a sí mismo
        if ($usuario->id === Auth::id()) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $usuario->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }

    public function toggleStatus(User $usuario)
    {
        // Evitar que el usuario se desactive a sí mismo
        if ($usuario->id === Auth::id()) {
            return back()->with('error', 'No puedes desactivar tu propia cuenta.');
        }

        $usuario->update(['activo' => ! $usuario->activo]);

        $status = $usuario->activo ? 'activado' : 'desactivado';

        return back()->with('success', "Usuario {$status} exitosamente.");
    }

    public function assignRole(Request $request, User $usuario)
    {
        $request->validate([
            'role' => ['required', 'exists:roles,name'],
        ]);

        $usuario->assignRole($request->role);

        return back()->with('success', 'Rol asignado exitosamente.');
    }

    public function removeRole(Request $request, User $usuario)
    {
        $request->validate([
            'role' => ['required', 'exists:roles,name'],
        ]);

        $usuario->removeRole($request->role);

        return back()->with('success', 'Rol removido exitosamente.');
    }

    public function assignPermission(Request $request, User $usuario)
    {
        $request->validate([
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $usuario->givePermissionTo($request->permission);

        return back()->with('success', 'Permiso asignado exitosamente.');
    }

    public function removePermission(Request $request, User $usuario)
    {
        $request->validate([
            'permission' => ['required', 'exists:permissions,name'],
        ]);

        $usuario->revokePermissionTo($request->permission);

        return back()->with('success', 'Permiso removido exitosamente.');
    }
}
