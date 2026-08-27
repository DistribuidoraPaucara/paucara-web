<?php
namespace App\Http\Controllers;

use App\Http\Requests\EmpleadoRequest;
use App\Models\Caja;
use App\Models\Empleado;
use App\Models\User;
use App\Services\RoleCompatibilityValidator;
use Exception;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class EmpleadoController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:empleados.index')->only(['index', 'show']);
        $this->middleware('permission:empleados.create')->only(['create', 'store']);
        $this->middleware('permission:empleados.edit')->only(['edit', 'update']);
        $this->middleware('permission:empleados.destroy')->only('destroy');
        $this->middleware('permission:empleados.toggle-estado')->only('toggleEstado');
        $this->middleware('permission:empleados.toggle-acceso-sistema')->only('toggleAccesoSistema');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Empleado::with(['user.roles']);

        // Filtros de búsqueda (soporte tanto 'q' como 'search' para compatibilidad)
        $searchTerm = $request->q ?? $request->search;
        if ($searchTerm) {
            // Convertir búsqueda a minúsculas para hacer búsqueda case-insensitive
            $searchLower = strtolower($searchTerm);
            $query->where(function ($q) use ($searchLower) {
                $q->whereRaw('LOWER(codigo_empleado) like ?', ["%{$searchLower}%"])
                    ->orWhereRaw('LOWER(ci) like ?', ["%{$searchLower}%"])
                    ->orWhereRaw('LOWER(telefono) like ?', ["%{$searchLower}%"])
                    ->orWhereHas('user', function ($q3) use ($searchLower) {
                        $q3->whereRaw('LOWER(name) like ?', ["%{$searchLower}%"])
                            ->orWhereRaw('LOWER(email) like ?', ["%{$searchLower}%"])
                            ->orWhereRaw('LOWER(usernick) like ?', ["%{$searchLower}%"]);
                    });
            });
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        // Filtro por acceso al sistema (soporte ambos nombres para compatibilidad)
        $puedeAccederSistema = $request->puede_acceder_sistema ?? $request->acceso_sistema;
        if ($puedeAccederSistema !== null && $puedeAccederSistema !== '') {
            $query->where('puede_acceder_sistema', $puedeAccederSistema === '1' || $puedeAccederSistema === 1 || $puedeAccederSistema === true);
        }

        // Ordenamiento dinámico (soporte para modern-filters)
        $orderBy  = $request->order_by ?? 'nombre';
        $orderDir = $request->order_dir ?? 'asc';

        // Validar campo de ordenamiento
        $allowedOrderBy = ['id', 'nombre', 'codigo_empleado', 'ci', 'fecha_ingreso', 'created_at', 'estado'];
        if (! in_array($orderBy, $allowedOrderBy)) {
            $orderBy = 'nombre';
        }

        // Validar dirección de ordenamiento
        if (! in_array(strtolower($orderDir), ['asc', 'desc'])) {
            $orderDir = 'asc';
        }

        // Aplicar ordenamiento
        if ($orderBy === 'nombre') {
            // Para nombre, ordenar por el nombre del usuario relacionado
            $query->leftJoin('users', 'empleados.user_id', '=', 'users.id')
                ->select('empleados.*')
                ->orderBy('users.name', $orderDir);
        } else {
            $query->orderBy($orderBy, $orderDir);
        }

        $empleados = $query->paginate(15);

        return Inertia::render('empleados/index', [
            'empleados' => $empleados,
            'filters'   => $request->only(['q', 'search', 'estado', 'puede_acceder_sistema', 'acceso_sistema', 'order_by', 'order_dir']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $supervisores = Empleado::with('user')
            ->activos()
            ->get()
            ->map(function ($empleado) {
                return [
                    'id'     => $empleado->id,
                    'nombre' => $empleado->user ? $empleado->user->name : $empleado->codigo_empleado,
                ];
            });

        // Obtener solo los roles que el usuario actual puede asignar
        $rolesPermitidos = $this->getRolesAsignablesPorUsuario();

        // Obtener roles disponibles con sus permisos
        $allRoles = Role::with('permissions')
            ->orderBy('name')
            ->get()
            ->filter(function ($role) use ($rolesPermitidos) {
                // Solo incluir roles que el usuario tiene permiso de asignar
                return in_array($role->name, $rolesPermitidos);
            })
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->pluck('name')->toArray(),
                ];
            })
            ->values()
            ->toArray();

        // Obtener todos los permisos agrupados por categoría
        $allPermissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        return Inertia::render('empleados/create', [
            'supervisores'               => $supervisores,
            'roles'                      => $allRoles,
            'permissions'                => $allPermissions,
            'rolesAsignados'             => [],
            'rolesDisponibles'           => $allRoles,
            'permisosAsignados'          => [],
            'permisosHeredados'          => [],
            'permisosDisponibles'        => $allPermissions->map(fn($permisos) => $permisos->pluck('name')->toArray())->toArray(),
            'permisosAsignadosMap'       => [],
            'permisosHeredadosMap'       => [],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EmpleadoRequest $request)
    {
        // Validar roles como array
        $request->validate([
            'roles'   => 'nullable|array',
            'roles.*' => 'exists:roles,name',
        ]);

        // Validaciones adicionales según el tipo de empleado
        $rolesAsignados = $request->roles ?? [];

        // VALIDACIÓN CRÍTICA: Verificar que el usuario tenga permiso para asignar los roles solicitados
        if (! empty($rolesAsignados)) {
            try {
                $this->validarPermisosAsignacionRoles($rolesAsignados);
            } catch (Exception $e) {
                return back()->withErrors([
                    'roles' => $e->getMessage(),
                ])->withInput();
            }
        }

        // VALIDACIÓN: Verificar compatibilidad de roles
        if (! empty($rolesAsignados)) {
            try {
                $validador = new RoleCompatibilityValidator();
                $validador->validar($rolesAsignados);
            } catch (Exception $e) {
                return back()->withErrors([
                    'roles' => $e->getMessage(),
                ])->withInput();
            }
        }

        // Validaciones condicionales si se crea usuario
        if ($request->crear_usuario || $request->puede_acceder_sistema) {
            $request->validate([
                'email'    => 'nullable|string|email|max:255|unique:users', // Email es completamente opcional
                'usernick' => 'required|string|max:255|unique:users',       // Usernick es requerido si puede acceder al sistema
                'password' => 'required|string|min:8|confirmed',            // Password requerido al crear usuario
            ]);
        }

        try {
            DB::transaction(function () use ($request, $rolesAsignados) {
                $user = null;

                // Crear usuario solo si se solicita o puede acceder al sistema
                if ($request->crear_usuario || $request->puede_acceder_sistema) {
                    // Generar usernick si no se proporciona
                    $usernick = $request->usernick ?: $this->generarUsernickUnico($request->nombre);

                    $user = User::create([
                        'name'              => $request->nombre,
                        'usernick'          => $usernick,
                        'email'             => $request->email ?: null,        // Email es opcional - puede ser null si no se proporciona
                        'password'          => Hash::make($request->password), // Usar password del request
                        'email_verified_at' => $request->email ? now() : null, // Solo verificar si se proporciona email
                        'activo'            => $request->puede_acceder_sistema ?? false,
                        // ✅ NUEVO: Asignar la empresa_id del usuario autenticado
                        'empresa_id'        => Auth::user()?->empresa_id,
                    ]);

                    // Asignar múltiples roles (case-insensitive)
                    if (! empty($rolesAsignados)) {
                        $rolesAsignadosLower = array_map('strtolower', $rolesAsignados);
                        $user->syncRoles($rolesAsignadosLower);
                    }
                }

                // Preparar datos para el empleado con valores por defecto
                $empleadoData = [
                    'user_id'               => $user ? $user->id : null,
                    // ✅ NUEVO: Asignar la empresa_id del usuario autenticado
                    'empresa_id'            => Auth::user()?->empresa_id,
                    'ci'                    => $request->ci,
                    'telefono'              => $request->telefono,
                    'direccion'             => $request->direccion,
                    'fecha_ingreso'         => $request->fecha_ingreso,
                    'estado'                => $request->estado ?? 'activo',
                    'puede_acceder_sistema' => $request->puede_acceder_sistema ?? false,
                ];

                // Crear empleado sin código inicialmente
                $empleado = Empleado::create($empleadoData);

                // Generar código de empleado automáticamente
                $codigoGenerado = $this->generarCodigoEmpleado($empleado->id);
                $empleado->update([
                    'codigo_empleado' => $codigoGenerado,
                    'numero_empleado' => $codigoGenerado,
                ]);

                // Crear caja automáticamente si el empleado puede acceder al sistema
                if ($user && $request->puede_acceder_sistema) {
                    Caja::create([
                        'user_id'          => $user->id,
                        'nombre'           => $request->nombre,
                        'ubicacion'        => $request->direccion ?? 'Por definir',
                        'monto_inicial_dia' => 0,
                        'activa'           => true,
                    ]);
                }
            });

            return redirect()->route('empleados.index')
                ->with('success', 'Empleado creado exitosamente.');
        } catch (UniqueConstraintViolationException $e) {
            // Mapear errores de restricción única a campos legibles
            $errorMessages = [
                'empleados_ci_unique'              => 'El CI ya existe en el sistema.',
                'users_usernick_unique'            => 'El nombre de usuario (nick) ya está en uso.',
                'users_email_unique'               => 'El email ya está registrado.',
                'empleados_codigo_empleado_unique' => 'El código de empleado ya existe.',
            ];

            $field = 'empleado';
            foreach ($errorMessages as $constraint => $message) {
                if (str_contains($e->getMessage(), $constraint)) {
                    return back()->withErrors([
                        'ci' => $message,
                    ])->withInput();
                }
            }

            // Si no se identifica el campo, retornar error genérico
            return back()->withErrors([
                'empleado' => 'El empleado ya existe en el sistema. Verifica los datos ingresados.',
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Empleado $empleado)
    {
        $empleado->load(['user.roles', 'supervisor.user', 'supervisados.user']);

        return Inertia::render('empleados/show', [
            'empleado' => $empleado,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editAccesoSistema(Empleado $empleado)
    {
        // Cargar roles y permisos del usuario asociado
        $empleado->load(['user.roles', 'user.permissions']);

        // Si no tiene usuario, no puede ver permisos
        if (!$empleado->user_id) {
            return redirect()->route('empleados.edit', $empleado->id)
                ->with('error', 'Este empleado no tiene un usuario del sistema.');
        }

        // Obtener todos los roles disponibles
        $roles = Role::orderBy('name')->get();

        // Obtener todos los permisos agrupados por categoría
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        // Obtener roles y permisos del usuario del empleado
        $userRoles = $empleado->user ? $empleado->user->roles->pluck('id')->toArray() : [];
        $userPermissions = $empleado->user ? $empleado->user->permissions->pluck('id')->toArray() : [];

        return Inertia::render('empleados/acceso-sistema', [
            'empleado'        => $empleado,
            'roles'           => $roles,
            'permissions'     => $permissions,
            'userRoles'       => $userRoles,
            'userPermissions' => $userPermissions,
        ]);
    }

    public function edit(Empleado $empleado)
    {
        // Cargar roles y permisos del usuario asociado (+ campos de acceso)
        $empleado->load(['user.roles.permissions', 'user.permissions']);

        // ✅ NUEVO: Asignar campos de acceso al usuario de Inertia
        if ($empleado->user) {
            $empleado->activo = $empleado->user->activo ?? true;
            $empleado->can_access_web = $empleado->user->can_access_web ?? true;
            $empleado->can_access_mobile = $empleado->user->can_access_mobile ?? false;
        }

        $supervisores = Empleado::with('user')
            ->activos()
            ->where('id', '!=', $empleado->id)
            ->get()
            ->map(function ($emp) {
                return [
                    'id'     => $emp->id,
                    'nombre' => $emp->user ? $emp->user->name : $emp->codigo_empleado,
                ];
            });

        // Obtener todos los roles disponibles con sus permisos
        $allRoles = Role::with('permissions')->orderBy('name')->get();

        // Obtener todos los permisos agrupados por categoría
        $allPermissions = Permission::all()->groupBy(function ($permission) {
            return explode('.', $permission->name)[0];
        });

        // Obtener roles asignados al usuario
        $userRolesAssigned = $empleado->user ? $empleado->user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ];
        })->toArray() : [];

        // Obtener TODOS los roles disponibles (no solo los no asignados)
        // El componente frontend necesita ver todos para marcar cuál está seleccionado
        $allRolesFormatted = $allRoles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ];
        })->values()->toArray();

        // Obtener permisos asignados (directos, no heredados de roles)
        $userPermissionsDirectAssigned = $empleado->user ? $empleado->user->permissions->pluck('name')->toArray() : [];
        $userPermissionIds = $empleado->user ? $empleado->user->permissions->pluck('id')->toArray() : [];

        // Crear mapeo de permisos directos asignados con sus descripciones
        $permisosAsignadosMap = [];
        if ($empleado->user) {
            foreach ($empleado->user->permissions as $permission) {
                $permisosAsignadosMap[$permission->name] = $permission->description;
            }
        }

        // Obtener permisos heredados de roles (con descripción)
        $inheritedPermissions = [];
        $inheritedPermissionsMap = [];
        if ($empleado->user) {
            foreach ($empleado->user->roles as $role) {
                foreach ($role->permissions as $permission) {
                    if (!in_array($permission->name, $inheritedPermissions)) {
                        $inheritedPermissions[] = $permission->name;
                        $inheritedPermissionsMap[$permission->name] = $permission->description;
                    }
                }
            }
        }

        // Obtener permisos disponibles (no asignados directamente)
        $allPermissionIds = Permission::pluck('id')->toArray();
        $permissionsNotAssigned = Permission::whereNotIn('id', $userPermissionIds)
            ->orderBy('name')
            ->get()
            ->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            })
            ->map(function ($permissions) {
                return $permissions->pluck('name')->toArray();
            })
            ->toArray();

        $responseData = [
            'empleado'                    => $empleado,
            'supervisores'                => $supervisores,
            'roles'                       => $allRoles,
            'permissions'                 => $allPermissions,
            'userRoles'                   => $empleado->user ? $empleado->user->roles->pluck('id')->toArray() : [],
            'userPermissions'             => $userPermissionIds,
            'rolesAsignados'              => $userRolesAssigned,
            'rolesDisponibles'            => $allRolesFormatted,
            'permisosAsignados'           => $userPermissionsDirectAssigned,
            'permisosAsignadosMap'        => $permisosAsignadosMap,
            'permisosHeredados'           => array_values($inheritedPermissions),
            'permisosHeredadosMap'        => $inheritedPermissionsMap,
            'permisosDisponibles'         => $permissionsNotAssigned,
        ];

        // Debug: Log de datos enviados
        Log::info('📤 DATOS ENVIADOS AL FRONTEND - EDIT', [
            'empleado_id' => $empleado->id,
            'tiene_usuario' => !!$empleado->user,
            'rolesAsignados' => count($userRolesAssigned),
            'rolesDisponibles' => count($allRolesFormatted),
            'permisosAsignados' => count($userPermissionsDirectAssigned),
            'permisosHeredados' => count($inheritedPermissions),
            'permisosDisponiblesCategories' => count($permissionsNotAssigned),
        ]);

        return Inertia::render('empleados/edit', $responseData);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Empleado $empleado)
    {
        // LOG TEMPORAL: Ver qué está llegando al backend
        Log::info('=== DATOS RECIBIDOS EN UPDATE ===');
        Log::info('Request all()', ['data' => $request->all()]);
        Log::info('Request input()', ['data' => $request->input()]);
        Log::info('Request query', ['data' => $request->query()]);
        Log::info('Request method', ['method' => $request->method()]);
        Log::info('Request Content-Type', ['content_type' => $request->header('Content-Type')]);
        Log::info('Request has files', ['has_photo' => $request->hasFile('photo')]);
        Log::info('=================================');

        // Validación solo de campos presentes en el request
        $rules = [];

        // Campos que si vienen, deben ser validados
        if ($request->has('nombre')) {
            $rules['nombre'] = 'required|string|max:255';
        }

        if ($request->has('email')) {
            $rules['email'] = [
                'nullable', // Email es completamente opcional
                'string',
                'email',
                'max:255',
                $empleado->user_id ? Rule::unique('users')->ignore($empleado->user_id) : 'unique:users',
            ];
        }

        if ($request->has('ci')) {
            $rules['ci'] = [
                'nullable',
                'string',
                'max:20',
                Rule::unique('empleados')->ignore($empleado->id),
            ];
        }

        if ($request->has('telefono')) {
            $rules['telefono'] = 'nullable|string|max:20';
        }

        if ($request->has('direccion')) {
            $rules['direccion'] = 'nullable|string|max:500';
        }

        if ($request->has('password')) {
            $rules['password'] = 'nullable|string|min:8|confirmed';
        }

        if ($request->has('fecha_ingreso')) {
            $rules['fecha_ingreso'] = 'required|date';
        }

        if ($request->has('puede_acceder_sistema')) {
            $rules['puede_acceder_sistema'] = 'required|boolean';
        }

        if ($request->hasFile('foto_perfil')) {
            $rules['foto_perfil'] = 'nullable|image|mimes:jpeg,png,gif|max:5120';
        }

        if ($request->has('usernick')) {
            $rules['usernick'] = [
                'nullable',
                'string',
                'max:255',
                $empleado->user_id ? Rule::unique('users')->ignore($empleado->user_id) : 'unique:users',
            ];
        }

        if ($request->has('roles')) {
            $rules['roles']   = 'nullable|array';
            $rules['roles.*'] = 'exists:roles,name';
        }

        if ($request->has('permissions')) {
            $rules['permissions']   = 'nullable|array';
            $rules['permissions.*'] = 'exists:permissions,name';
        }

        // ✅ NUEVO: Validación para control de acceso
        if ($request->has('activo')) {
            $rules['activo'] = 'required|boolean';
        }

        if ($request->has('can_access_web')) {
            $rules['can_access_web'] = 'required|boolean';
        }

        if ($request->has('can_access_mobile')) {
            $rules['can_access_mobile'] = 'required|boolean';
        }

        // Validar solo los campos presentes
        $request->validate($rules);

        // VALIDACIÓN CRÍTICA: Verificar que el usuario tenga permiso para asignar NUEVOS roles
        // (No validar roles que se están removiendo, solo los que se están agregando)
        if ($request->has('roles') && is_array($request->roles) && ! empty($request->roles)) {
            try {
                // Obtener roles actuales del usuario
                $rolesActuales = $empleado->user ? $empleado->user->roles->pluck('name')->toArray() : [];

                // Obtener roles nuevos
                $rolesNuevos = $request->roles;

                // Encontrar solo los roles que se están AGREGANDO (no los que ya tiene)
                $rolesAgregar = array_diff($rolesNuevos, $rolesActuales);

                // Solo validar los nuevos roles
                if (!empty($rolesAgregar)) {
                    $this->validarPermisosAsignacionRoles($rolesAgregar);
                }
            } catch (Exception $e) {
                return back()->withErrors([
                    'roles' => $e->getMessage(),
                ])->withInput();
            }
        }

        // VALIDACIÓN: Verificar compatibilidad de roles (solo nuevos)
        if ($request->has('roles') && is_array($request->roles) && ! empty($request->roles)) {
            try {
                $rolesActuales      = $empleado->user?->roles->pluck('name')->toArray() ?? [];
                $rolesNuevos        = $request->roles;
                $rolesAgregar       = array_diff($rolesNuevos, $rolesActuales);

                // Solo validar compatibilidad si hay nuevos roles
                if (!empty($rolesAgregar)) {
                    $rolActualPrincipal = count($rolesActuales) > 0 ? $rolesActuales[0] : null;
                    $validador = new RoleCompatibilityValidator();
                    $validador->validar($rolesAgregar, $rolActualPrincipal);
                }
            } catch (Exception $e) {
                return back()->withErrors([
                    'roles' => $e->getMessage(),
                ])->withInput();
            }
        }

        DB::transaction(function () use ($request, $empleado) {
            // Actualizar usuario solo si existe y vienen datos del usuario
            if ($empleado->user) {
                $user = $empleado->user;

                if ($request->has('nombre')) {
                    $user->name = $request->nombre;
                }

                if ($request->has('usernick') && $request->usernick) {
                    $user->usernick = $request->usernick;
                }

                if ($request->has('email')) {
                    $user->email = $request->email ?: null; // Email es opcional
                                                            // Actualizar email_verified_at solo si se proporciona email
                    if ($request->email && ! $user->email_verified_at) {
                        $user->email_verified_at = now();
                    } elseif (! $request->email) {
                        $user->email_verified_at = null;
                    }
                }

                // Actualizar contraseña si se proporcionó
                if ($request->has('password') && $request->password) {
                    $user->password = Hash::make($request->password);
                }

                // ✅ NUEVO: Actualizar control de acceso
                if ($request->has('activo')) {
                    $user->activo = $request->activo;
                }

                if ($request->has('can_access_web')) {
                    $user->can_access_web = $request->can_access_web;
                }

                if ($request->has('can_access_mobile')) {
                    $user->can_access_mobile = $request->can_access_mobile;
                }

                $user->save();

                // Actualizar nombre en cajas asociadas al usuario
                if ($request->has('nombre')) {
                    Caja::where('user_id', $user->id)
                        ->update(['nombre' => $request->nombre]);
                }
            }

            // Sincronizar roles FUERA del bloque condicional - siempre sincronizar si hay roles en el request
            if ($empleado->user && $request->has('roles')) {
                $user = $empleado->user;
                $roleNames = is_array($request->roles) ? $request->roles : [];

                // Encontrar roles exactos en la BD (case-insensitive)
                $exactRoleNames = [];
                foreach ($roleNames as $roleName) {
                    $role = Role::whereRaw('LOWER(name) = ?', [strtolower($roleName)])->first();
                    if ($role) {
                        $exactRoleNames[] = $role->name;
                    }
                }

                // Sincronizar con nombres exactos - REEMPLAZA todos los roles con estos
                Log::info('Sincronizando roles', ['roles' => $exactRoleNames, 'user_id' => $user->id]);
                $user->syncRoles($exactRoleNames);
                Log::info('Roles sincronizados', ['roles_after' => $user->roles->pluck('name')->toArray()]);
            }

            // Sincronizar permisos directos FUERA del bloque condicional - siempre sincronizar si hay permisos en el request
            if ($empleado->user && $request->has('permissions')) {
                $user = $empleado->user;
                $permissionNames = is_array($request->permissions) ? $request->permissions : [];

                // Encontrar permisos exactos en la BD (case-insensitive)
                $exactPermissionNames = [];
                foreach ($permissionNames as $permissionName) {
                    $permission = Permission::whereRaw('LOWER(name) = ?', [strtolower($permissionName)])->first();
                    if ($permission) {
                        $exactPermissionNames[] = $permission->name;
                    }
                }

                // Sincronizar con nombres exactos - REEMPLAZA todos los permisos con estos
                Log::info('Sincronizando permisos', ['permissions' => $exactPermissionNames, 'user_id' => $user->id]);
                $user->syncPermissions($exactPermissionNames);
                Log::info('Permisos sincronizados', ['permissions_after' => $user->permissions->pluck('name')->toArray()]);
            }

            // Preparar datos de actualización del empleado - SOLO campos presentes en request
            $datosActualizacion = [];

            if ($request->has('ci')) {
                $datosActualizacion['ci'] = $request->ci;
            }

            if ($request->has('telefono')) {
                $datosActualizacion['telefono'] = $request->telefono;
            }

            if ($request->has('direccion')) {
                $datosActualizacion['direccion'] = $request->direccion;
            }

            if ($request->has('fecha_ingreso')) {
                $datosActualizacion['fecha_ingreso'] = $request->fecha_ingreso;
            }

            if ($request->has('puede_acceder_sistema')) {
                $datosActualizacion['puede_acceder_sistema'] = $request->puede_acceder_sistema;
            }

            // Manejar foto de perfil
            if ($request->hasFile('foto_perfil')) {
                // Eliminar foto anterior si existe
                if ($empleado->foto_perfil && Storage::exists('public/' . $empleado->foto_perfil)) {
                    Storage::delete('public/' . $empleado->foto_perfil);
                }

                // Guardar nueva foto
                $fotoPath = $request->file('foto_perfil')->store('empleados', 'public');
                $datosActualizacion['foto_perfil'] = $fotoPath;
            }

            // Actualizar empleado SOLO si hay datos para actualizar
            if (! empty($datosActualizacion)) {
                $empleado->update($datosActualizacion);
            }
        });

        return redirect()->route('empleados.index')
            ->with('success', 'Empleado actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Empleado $empleado)
    {
        DB::transaction(function () use ($empleado) {
            // Guardar referencia al usuario antes de eliminar el empleado
            $usuario = $empleado->user;

            // Primero eliminar el empleado
            $empleado->delete();

            // Luego eliminar el usuario asociado si existe
            if ($usuario) {
                $usuario->delete();
            }
        });

        return redirect()->route('empleados.index')
            ->with('success', 'Empleado eliminado exitosamente.');
    }

    /**
     * Define la jerarquía de roles y qué roles puede asignar cada uno
     * Retorna un array con los roles que el usuario actual puede asignar
     */
    private function getRolesAsignablesPorUsuario(): array
    {
        $user = auth()->user();

        if (! $user) {
            return [];
        }

        // ✅ ROLES DISPONIBLES: SOLO los 5 roles principales (minúsculas para consistencia con frontend)
        $rolesDisponibles = [
            'admin',
            'manager',
            'preventista',
            'chofer',
            'cajero',
        ];

        // 🔍 DEBUG: Log de roles del usuario
        $rolesDelUsuario = $user->getRoleNames()->toArray();
        Log::info('🔍 DEBUG getRolesAsignablesPorUsuario', [
            'usuario_id' => $user->id,
            'usuario_name' => $user->name,
            'roles_usuario' => $rolesDelUsuario,
        ]);

        // Verificar qué roles puede asignar el usuario actual
        // ✅ Cualquier usuario autenticado puede asignar estos 5 roles
        if ($user->exists) {
            return $rolesDisponibles;
        }

        // Si no existe, no puede asignar ningún rol
        return [];
    }

    /**
     * Valida que el usuario actual pueda asignar los roles solicitados
     * Lanza una excepción si intenta asignar roles no permitidos
     * Comparación CASE-INSENSITIVE
     */
    private function validarPermisosAsignacionRoles(array $rolesASolicitados): void
    {
        $rolesPermitidos = $this->getRolesAsignablesPorUsuario();

        if (empty($rolesPermitidos)) {
            throw new \Exception('No tiene permisos para asignar roles a empleados.');
        }

        // Convertir roles permitidos a minúsculas para comparación case-insensitive
        $rolesPermitidosLower = array_map('strtolower', $rolesPermitidos);

        foreach ($rolesASolicitados as $rol) {
            if (! in_array(strtolower($rol), $rolesPermitidosLower)) {
                throw new \Exception("No tiene permisos para asignar el rol: {$rol}");
            }
        }
    }

    /**
     * DEPRECATED: Determina el rol apropiado basado en el cargo del empleado
     * La columna 'cargo' fue eliminada de la tabla empleados
     */
    // private function determinarRolPorCargo(string $cargo): ?string
    // {
    //     // Método deprecado - columna 'cargo' eliminada
    //     return null;
    // }

    /**
     * DEPRECATED: Método para crear o actualizar un chofer desde los datos de empleado
     * La columna 'cargo' fue eliminada de la tabla empleados
     */
    // protected function gestionarChofer(Empleado $empleado, Request $request)
    // {
    //     // Método deprecado - columna 'cargo' eliminada
    // }

    /**
     * Método de conveniencia para crear empleado con rol automático
     * DEPRECATED: Las columnas 'cargo', 'departamento', 'salario_base' fueron eliminadas
     */
    public function crearEmpleadoRapido(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Este método ha sido deprecado. Usa el método store() estándar.',
        ], 410); // 410 Gone
    }

    /**
     * Toggle estado del empleado
     */
    public function toggleEstado(Request $request, Empleado $empleado)
    {
        $request->validate([
            'estado' => 'required|in:activo,inactivo,vacaciones,licencia',
        ]);

        $empleado->update(['estado' => $request->estado]);

        return back()->with('success', 'Estado del empleado actualizado exitosamente.');
    }

    /**
     * Toggle acceso al sistema del empleado
     */
    public function toggleAccesoSistema(Empleado $empleado)
    {
        $empleado->update([
            'puede_acceder_sistema' => ! $empleado->puede_acceder_sistema,
        ]);

        $mensaje = $empleado->puede_acceder_sistema
            ? 'El empleado ahora puede acceder al sistema.'
            : 'Se revocó el acceso al sistema del empleado.';

        return back()->with('success', $mensaje);
    }

    /**
     * Genera un usernick único basado en el código del empleado
     */
    private function generarUsernickUnico(string $codigoEmpleado): string
    {
        $baseUsernick = strtolower($codigoEmpleado);
        $usernick     = $baseUsernick;
        $counter      = 1;

        // Verificar si el usernick ya existe y agregar número si es necesario
        while (\App\Models\User::where('usernick', $usernick)->exists()) {
            $usernick = $baseUsernick . $counter;
            $counter++;
        }

        return $usernick;
    }

    /**
     * Genera un código de empleado automático basado en el ID
     * Formato: EMP + ID con padding de ceros (4 dígitos)
     * Ejemplos: EMP0001, EMP1000, EMP1001
     */
    private function generarCodigoEmpleado(int $id): string
    {
        return 'EMP' . str_pad($id, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Obtiene la lista de departamentos disponibles
     * DEPRECATED: La columna 'departamento' fue eliminada de la tabla empleados
     */
    public function getDepartamentos()
    {
        // Retornar array vacío ya que la funcionalidad de departamentos fue eliminada
        return response()->json([]);
    }

    /**
     * Obtiene la lista de tipos de contrato disponibles
     * DEPRECATED: La columna 'tipo_contrato' fue eliminada de la tabla empleados
     */
    public function getTiposContrato()
    {
        // Retornar array vacío ya que la funcionalidad de tipos de contrato fue eliminada
        return response()->json([]);
    }

    /**
     * Obtiene la lista de estados de empleado disponibles
     */
    public function getEstados()
    {
        $estados = [
            ['value' => 'activo', 'label' => 'Activo'],
            ['value' => 'inactivo', 'label' => 'Inactivo'],
            ['value' => 'vacaciones', 'label' => 'Vacaciones'],
            ['value' => 'licencia', 'label' => 'Licencia'],
        ];

        return response()->json($estados);
    }

    /**
     * Obtiene la lista de supervisores disponibles
     */
    public function getSupervisores()
    {
        try {
            $supervisores = Empleado::whereHas('user')
                ->with('user')
                ->where('estado', 'activo')
                ->where('puede_acceder_sistema', true)
                ->get()
                ->map(function ($empleado) {
                    // Verificar que el empleado tenga usuario y datos válidos
                    if (! $empleado->user || ! $empleado->user->name) {
                        return null;
                    }

                    return [
                        'value'       => $empleado->id,
                        'label'       => $empleado->user->name,
                        'description' => 'Código: ' . ($empleado->codigo_empleado ?? 'Sin código'),
                    ];
                })
                ->filter()   // Remover valores null
                ->values()   // Reindexar el array
                ->toArray(); // Convertir a array nativo

            // Agregar opción "Sin supervisor"
            array_unshift($supervisores, [
                'value'       => 'sin-supervisor',
                'label'       => 'Sin supervisor',
                'description' => 'Empleado sin supervisor asignado',
            ]);

            return response()->json($supervisores);
        } catch (\Exception $e) {
            // Log del error para debugging
            Log::error('Error en getSupervisores: ' . $e->getMessage());

            // Devolver respuesta de error controlada
            return response()->json([
                'error'   => 'Error interno del servidor',
                'message' => 'No se pudieron cargar los supervisores',
            ], 500);
        }
    }

    /**
     * Obtiene la lista de roles disponibles con descripción detallada de permisos
     */
    public function getRoles()
    {
        try {
            $rolesPermitidos = $this->getRolesAsignablesPorUsuario();

            // ✅ Convertir roles permitidos a minúsculas para comparación case-insensitive
            $rolesPermitidosLower = array_map('strtolower', $rolesPermitidos);

            $roles = Role::orderBy('name')
                ->get()
                ->filter(function ($role) use ($rolesPermitidosLower) {
                    // Comparación case-insensitive: convertir el nombre del rol a minúsculas
                    return in_array(strtolower($role->name), $rolesPermitidosLower);
                })
                ->groupBy(function ($role) {
                    // Agrupar por nombre en minúsculas para eliminar duplicados case-insensitive
                    return strtolower($role->name);
                })
                ->map(function ($group) {
                    // Tomar el primer rol de cada grupo (elimina duplicados)
                    $role = $group->first();
                    return [
                        'value'         => strtolower($role->name), // ✅ Usar minúsculas como valor
                        'label'         => strtolower($role->name), // ✅ Usar minúsculas como label
                        'description'   => $this->obtenerDescripcionRol($role->name),
                        'permisosCount' => $role->permissions->count(),
                        'permisos'      => $this->obtenerPermisosResumenRol($role->name),
                        'capabilities'  => $this->obtenerCapacidadesRol($role->name),
                    ];
                })
                ->values()
                ->toArray();

            return response()->json($roles);
        } catch (\Exception $e) {
            Log::error('Error en getRoles: ' . $e->getMessage());

            return response()->json([
                'error'   => 'Error interno del servidor',
                'message' => 'No se pudieron cargar los roles',
            ], 500);
        }
    }

    /**
     * Obtiene descripción detallada de un rol
     */
    private function obtenerDescripcionRol(string $rolName): string
    {
        // ✅ Usar minúsculas para las claves
        $descripciones = [
            'admin'       => 'Acceso casi total al sistema, gestión de usuarios y configuración',
            'manager'     => 'Gestión de operaciones y supervisión de personal',
            'preventista' => 'Gestión de cartera de clientes, ventas, proformas y cajas',
            'chofer'      => 'Gestión de entregas y viajes asignados',
            'cajero'      => 'Apertura, cierre y movimientos de cajas',
        ];

        return $descripciones[strtolower($rolName)] ?? 'Rol del sistema: ' . $rolName;
    }

    /**
     * Obtiene un resumen de permisos principales de un rol
     */
    private function obtenerPermisosResumenRol(string $rolName): array
    {
        // ✅ Usar minúsculas para las claves
        $permisosResumen = [
            'admin'       => [
                '✓ Acceso casi total del sistema',
                '✓ Gestión de usuarios y roles',
                '✓ Asignar empleados',
            ],
            'manager'     => [
                '✓ Gestión de operaciones',
                '✓ Supervisión de personal',
                '✓ Acceso a reportes y análisis',
            ],
            'preventista' => [
                '✓ CRUD de clientes',
                '✓ CRUD de ventas y proformas',
                '✓ Gestión de cajas',
                '✓ Ver inventario y logística',
            ],
            'chofer'      => [
                '✓ Ver entregas asignadas',
                '✓ Confirmar entregas',
                '✓ Seguimiento de ruta',
            ],
            'cajero'      => [
                '✓ Abrir y cerrar cajas',
                '✓ Registrar transacciones',
                '✓ Ver movimientos del día',
            ],
        ];

        return $permisosResumen[strtolower($rolName)] ?? [
            '✓ Acceso específico a funciones del rol',
        ];
    }

    /**
     * Obtiene capacidades principales de un rol (para display visual)
     */
    private function obtenerCapacidadesRol(string $rolName): array
    {
        // ✅ ROLES DISPONIBLES: Solo los 5 roles principales - Usar minúsculas para las claves
        $capacidades = [
            'admin'       => ['admin' => true, 'usuarios' => true, 'ventas' => true, 'cajas' => true],
            'manager'     => ['admin' => false, 'usuarios' => true, 'ventas' => true, 'cajas' => false],
            'preventista' => ['admin' => false, 'usuarios' => false, 'ventas' => true, 'cajas' => true],
            'cajero'      => ['admin' => false, 'usuarios' => false, 'ventas' => false, 'cajas' => true],
            'chofer'      => ['admin' => false, 'usuarios' => false, 'ventas' => false, 'cajas' => false],
        ];

        return $capacidades[strtolower($rolName)] ?? [];
    }

    /**
     * Obtiene el rol sugerido automáticamente basado en el cargo del empleado
     * DEPRECATED: La columna 'cargo' fue eliminada de la tabla empleados
     */
    /**
     * Obtiene rol sugerido basado en el ID del empleado o campos específicos
     * Usa lógica de mapeo: preventista_id → Preventista, etc.
     */
    public function getRolSugeridoPorCargo(Request $request)
    {
        try {
            $empleadoId = $request->input('empleado_id');
            $preventista = $request->input('preventista'); // Booleano
            $esCajero = $request->input('es_cajero'); // Booleano
            $cargo = $request->input('cargo'); // Para compatibilidad futura

            $rolSugerido = null;
            $mensaje = 'No hay rol sugerido automáticamente.';

            // Lógica de mapeo: Si tiene preventista_id activado → Preventista
            if ($preventista) {
                $rolSugerido = 'Preventista';
                $mensaje = 'Se sugiere asignar el rol Preventista por su perfil.';
            }

            // Si es cajero → Cajero
            if ($esCajero) {
                $rolSugerido = 'Cajero';
                $mensaje = 'Se sugiere asignar el rol Cajero por su perfil.';
            }

            // Por defecto para empleado con acceso al sistema
            if (!$rolSugerido && $empleadoId) {
                $empleado = Empleado::find($empleadoId);
                if ($empleado) {
                    // Puedes agregar más lógica aquí basada en propiedades del empleado
                    $rolSugerido = 'Empleado';
                    $mensaje = 'Se sugiere un acceso básico al sistema.';
                }
            }

            return response()->json([
                'rolSugerido' => $rolSugerido,
                'mensaje'     => $mensaje ?: 'Selecciona uno o más roles manualmente.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error en getRolSugeridoPorCargo: ' . $e->getMessage());

            return response()->json([
                'rolSugerido' => null,
                'mensaje'     => 'No hay rol sugerido. Selecciona manualmente.',
            ]);
        }
    }
}
