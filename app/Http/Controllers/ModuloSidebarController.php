<?php
namespace App\Http\Controllers;

use App\Models\ModuloSidebar;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class ModuloSidebarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $modulos = ModuloSidebar::with(['padre', 'submodulos'])
            ->orderBy('orden')
            ->get()
            ->map(function ($modulo) {
                return [
                    'id'                => $modulo->id,
                    'titulo'            => $modulo->titulo,
                    'ruta'              => $modulo->ruta,
                    'icono'             => $modulo->icono,
                    'descripcion'       => $modulo->descripcion,
                    'orden'             => $modulo->orden,
                    'activo'            => $modulo->activo,
                    'es_submenu'        => $modulo->es_submenu,
                    'categoria'         => $modulo->categoria,
                    'color'             => $modulo->color,
                    'visible_dashboard' => $modulo->visible_dashboard,
                    'padre'             => $modulo->padre ? [
                        'id'     => $modulo->padre->id,
                        'titulo' => $modulo->padre->titulo,
                    ] : null,
                    'submodulos_count'  => $modulo->submodulos->count(),
                    'permisos'          => $modulo->permisos,
                ];
            })->values()->toArray();

        return Inertia::render('admin/permisos/modulos/index', [
            'modulos'    => $modulos,
            'categorias' => ModuloSidebar::select('categoria')
                ->distinct()
                ->whereNotNull('categoria')
                ->pluck('categoria'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $modulosPadre = ModuloSidebar::principales()
            ->activos()
            ->ordenados()
            ->get(['id', 'titulo']);

        $totalModulos = ModuloSidebar::count();

        return Inertia::render('admin/permisos/modulos/create', [
            'modulosPadre'  => $modulosPadre,
            'totalModulos'  => $totalModulos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'            => 'required|string|max:255',
            'ruta'              => 'required|string|max:500',
            'icono'             => 'nullable|string|max:255',
            'descripcion'       => 'nullable|string|max:500',
            'orden'             => 'integer|min:0',
            'activo'            => 'boolean',
            'es_submenu'        => 'boolean',
            'modulo_padre_id'   => 'nullable|exists:modulos_sidebar,id',
            'permisos'          => 'nullable|array',
            'permisos.*'        => 'string',
            'color'             => 'nullable|string|max:50',
            'categoria'         => 'nullable|string|max:100',
            'visible_dashboard' => 'boolean',
        ]);

        $modulo = ModuloSidebar::create($validated);

        return redirect()->route('modulos-sidebar.index')
            ->with('success', 'Módulo creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ModuloSidebar $moduloSidebar): Response
    {
        $moduloSidebar->load(['padre', 'submodulos']);

        return Inertia::render('ModulosSidebar/Show', [
            'modulo' => $moduloSidebar,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ModuloSidebar $moduloSidebar): Response
    {
        // Cargar relaciones necesarias
        $moduloSidebar->load(['padre', 'submodulos']);

        $modulosPadre = ModuloSidebar::principales()
            ->activos()
            ->where('id', '!=', $moduloSidebar->id)
            ->ordenados()
            ->get(['id', 'titulo']);

        // Obtener submódulos si es un módulo principal
        $submodulos = [];
        if (!$moduloSidebar->es_submenu) {
            $submodulos = ModuloSidebar::where('modulo_padre_id', $moduloSidebar->id)
                ->ordenados()
                ->get(['id', 'titulo', 'ruta', 'activo', 'orden', 'icono']);
        }

        // ==========================================
        // 🔐 Obtener usuarios con acceso a esta ruta
        // ==========================================
        // La ruta requiere 'admin.config', así que obtener usuarios con ese permiso
        $permiso = Permission::where('name', 'admin.config')->first();

        $usuariosConAcceso = [];
        if ($permiso) {
            // Usuarios directos con el permiso
            $usuariosDirectos = $permiso->users()->with('roles')->get();

            // Usuarios que heredan el permiso por roles
            $usuariosConRoles = User::whereHas('roles', function ($query) use ($permiso) {
                $query->whereHas('permissions', function ($subQuery) use ($permiso) {
                    $subQuery->where('permissions.id', $permiso->id);
                });
            })->with('roles')->get();

            // Combinar y eliminar duplicados
            $usuariosMerged = $usuariosDirectos->merge($usuariosConRoles)->unique('id');

            $usuariosConAcceso = $usuariosMerged->map(function ($user) {
                $rolesConPermiso = $user->roles()
                    ->whereHas('permissions', function ($query) {
                        $query->where('name', 'admin.config');
                    })
                    ->pluck('name')
                    ->toArray();

                $tieneDirecto = $user->hasDirectPermission('admin.config');

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'directo' => $tieneDirecto,
                    'roles' => $rolesConPermiso,
                    'tipoAcceso' => $tieneDirecto && !empty($rolesConPermiso) ? 'Directo + Roles' : ($tieneDirecto ? 'Directo' : 'Heredado'),
                ];
            })->values();
        }

        return Inertia::render('admin/permisos/modulos/edit', [
            'modulo'              => $moduloSidebar,
            'modulosPadre'        => $modulosPadre,
            'submodulos'          => $submodulos,
            'usuariosConAcceso'   => $usuariosConAcceso,
            'totalUsuariosAcceso' => count($usuariosConAcceso),
            'permisoRequerido'    => 'admin.config',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ModuloSidebar $moduloSidebar)
    {
        $validated = $request->validate([
            'titulo'            => 'required|string|max:255',
            'ruta'              => 'required|string|max:500',
            'icono'             => 'nullable|string|max:255',
            'descripcion'       => 'nullable|string|max:500',
            'orden'             => 'integer|min:0',
            'activo'            => 'boolean',
            'es_submenu'        => 'boolean',
            'modulo_padre_id'   => 'nullable|exists:modulos_sidebar,id',
            'permisos'          => 'nullable|array',
            'permisos.*'        => 'string',
            'color'             => 'nullable|string|max:50',
            'categoria'         => 'nullable|string|max:100',
            'visible_dashboard' => 'boolean',
        ]);

        // Evitar que un módulo se asigne a sí mismo como padre
        if ($validated['modulo_padre_id'] == $moduloSidebar->id) {
            $validated['modulo_padre_id'] = null;
        }

        $moduloSidebar->update($validated);

        return redirect()->route('modulos-sidebar.index')
            ->with('success', 'Módulo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModuloSidebar $moduloSidebar)
    {
        // Verificar si tiene submódulos
        if ($moduloSidebar->submodulos()->count() > 0) {
            return back()->with('error', 'No se puede eliminar un módulo que tiene submódulos.');
        }

        $moduloSidebar->delete();

        return redirect()->route('modulos-sidebar.index')
            ->with('success', 'Módulo eliminado exitosamente.');
    }

    /**
     * Obtener módulos para el sidebar (API)
     */
    public function obtenerParaSidebar()
    {
        $modulos = ModuloSidebar::obtenerParaSidebar()
            ->filter(function ($modulo) {
                return $modulo->usuarioTienePermiso();
            })
            ->map(function ($modulo) {
                return $modulo->toNavItem();
            })
            ->values();

        return response()->json($modulos);
    }

    /**
     * Actualizar orden de los módulos
     */
    public function actualizarOrden(Request $request)
    {
        $validated = $request->validate([
            'modulos'         => 'required|array',
            'modulos.*.id'    => 'required|exists:modulos_sidebar,id',
            'modulos.*.orden' => 'required|integer|min:0',
        ]);

        foreach ($validated['modulos'] as $moduloData) {
            ModuloSidebar::where('id', $moduloData['id'])
                ->update(['orden' => $moduloData['orden']]);
        }

        return response()->json(['message' => 'Orden actualizado exitosamente.']);
    }

    /**
     * Alternar estado activo/inactivo
     */
    public function toggleActivo(ModuloSidebar $moduloSidebar)
    {
        $moduloSidebar->update(['activo' => ! $moduloSidebar->activo]);

        return back()->with('success', 'Estado del módulo actualizado.');
    }

    /**
     * API endpoint para obtener módulos del sidebar (para el usuario autenticado)
     * Devuelve módulos filtrados por permisos del usuario
     */
    public function apiIndex()
    {
        $modulos = ModuloSidebar::obtenerParaSidebar()
            ->filter(function ($modulo) {
                return $modulo->usuarioTienePermiso();
            })
            ->map(function ($modulo) {
                return $modulo->toNavItem();
            })
            ->values();

        return response()->json($modulos);
    }

    /**
     * API endpoint para obtener TODOS los módulos (para administración)
     * Este método devuelve TODOS los módulos para la gestión administrativa
     * sin filtrar por permisos del usuario
     */
    public function apiIndexAdmin()
    {
        // Devuelve TODOS los módulos para el Centro de Permisos
        // Sin filtros de activo o permisos
        $modulos = ModuloSidebar::with(['padre', 'submodulos'])
            ->orderBy('orden')
            ->get()
            ->map(function ($modulo) {
                return [
                    'id'                => $modulo->id,
                    'titulo'            => $modulo->titulo,
                    'ruta'              => $modulo->ruta,
                    'icono'             => $modulo->icono,
                    'descripcion'       => $modulo->descripcion,
                    'orden'             => $modulo->orden,
                    'activo'            => $modulo->activo,
                    'es_submenu'        => $modulo->es_submenu,
                    'categoria'         => $modulo->categoria,
                    'color'             => $modulo->color,
                    'visible_dashboard' => $modulo->visible_dashboard,
                    'padre_id'          => $modulo->modulo_padre_id,
                    'padre'             => $modulo->padre ? [
                        'id'     => $modulo->padre->id,
                        'titulo' => $modulo->padre->titulo,
                    ] : null,
                    'submodulos_count'  => $modulo->submodulos->count(),
                    'permisos'          => $modulo->permisos ?? [],
                ];
            });

        return response()->json($modulos);
    }

    /**
     * Obtener permisos disponibles para asignar a módulos
     */
    public function getPermisosDisponibles()
    {
        $permisos = \Spatie\Permission\Models\Permission::all()
            ->sortBy('name')
            ->map(function ($permission) {
                return [
                    'id'    => $permission->id,
                    'value' => $permission->name,
                    'label' => $permission->name,
                ];
            })
            ->values();

        return response()->json($permisos);
    }

    /**
     * Obtener matriz de acceso rol-módulo
     * Devuelve qué roles tienen acceso a qué módulos
     */
    public function getMatrizAcceso()
    {
        try {
            // Obtener todos los roles
            $roles = \Spatie\Permission\Models\Role::all()
                ->sortBy('name')
                ->values();

            // Obtener todos los módulos principales (no submódulos)
            $modulos = ModuloSidebar::where('activo', true)
                ->whereNull('modulo_padre_id')
                ->orderBy('orden')
                ->with('submodulos')
                ->get();

            // Construir la matriz de acceso
            $matriz = [];

            foreach ($modulos as $modulo) {
                $moduloData = [
                    'id'                  => $modulo->id,
                    'titulo'              => $modulo->titulo,
                    'ruta'                => $modulo->ruta,
                    'categoria'           => $modulo->categoria,
                    'permisos_requeridos' => $modulo->permisos ?? [],
                    'roles_acceso'        => [],
                    'submodulos'          => [],
                ];

                // Verificar acceso de cada rol a este módulo
                foreach ($roles as $role) {
                    try {
                        $tieneAcceso = $this->rolTieneAccesoAlModulo($role, $modulo);
                        if ($tieneAcceso) {
                            $moduloData['roles_acceso'][] = $role->name;
                        }
                    } catch (\Exception $e) {
                        \Log::warning("Error verificando acceso del rol {$role->name} al módulo {$modulo->id}: {$e->getMessage()}");
                    }
                }

                // Procesar submódulos
                if ($modulo->submodulos) {
                    foreach ($modulo->submodulos as $submodulo) {
                        $submoduloData = [
                            'id'                  => $submodulo->id,
                            'titulo'              => $submodulo->titulo,
                            'ruta'                => $submodulo->ruta,
                            'permisos_requeridos' => $submodulo->permisos ?? [],
                            'roles_acceso'        => [],
                        ];

                        foreach ($roles as $role) {
                            try {
                                $tieneAcceso = $this->rolTieneAccesoAlModulo($role, $submodulo);
                                if ($tieneAcceso) {
                                    $submoduloData['roles_acceso'][] = $role->name;
                                }
                            } catch (\Exception $e) {
                                \Log::warning("Error verificando acceso del rol {$role->name} al submódulo {$submodulo->id}: {$e->getMessage()}");
                            }
                        }

                        $moduloData['submodulos'][] = $submoduloData;
                    }
                }

                $matriz[] = $moduloData;
            }

            return response()->json([
                'roles'   => $roles->pluck('name')->toArray(),
                'modulos' => $matriz,
            ]);
        } catch (\Exception $e) {
            \Log::error("Error en getMatrizAcceso: {$e->getMessage()}", ['exception' => $e]);
            return response()->json([
                'error'   => 'Error al cargar la matriz de acceso',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verificar si un rol tiene acceso a un módulo
     */
    private function rolTieneAccesoAlModulo($role, $modulo)
    {
        try {
            // Validar que el rol exista y sea válido
            if (!$role || !method_exists($role, 'hasPermissionTo')) {
                return false;
            }

            $permisosRequeridos = $modulo->permisos ?? [];

            // Si no hay permisos requeridos, todos tienen acceso
            if (empty($permisosRequeridos)) {
                return true;
            }

            // Verificar si el rol tiene al menos uno de los permisos requeridos
            foreach ($permisosRequeridos as $permiso) {
                try {
                    if ($role->hasPermissionTo($permiso)) {
                        return true;
                    }
                } catch (\Exception $e) {
                    \Log::debug("Error verificando permiso {$permiso} para rol {$role->name}: {$e->getMessage()}");
                    // Continuar con el siguiente permiso
                    continue;
                }
            }

            return false;
        } catch (\Exception $e) {
            \Log::warning("Error en rolTieneAccesoAlModulo: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Vista previa del sidebar para un rol específico
     */
    public function previewPorRol($rolName)
    {
        try {
            $role = \Spatie\Permission\Models\Role::where('name', $rolName)->first();

            if (! $role) {
                return response()->json(['error' => 'Rol no encontrado'], 404);
            }

            // Obtener módulos activos para el dashboard
            $modulos = ModuloSidebar::where('activo', true)
                ->where('visible_dashboard', true)
                ->with(['submodulos' => function ($query) {
                    $query->where('activo', true)
                        ->where('visible_dashboard', true)
                        ->orderBy('orden');
                }])
                ->whereNull('modulo_padre_id')
                ->orderBy('orden')
                ->get()
                ->filter(function ($modulo) use ($role) {
                    try {
                        return $this->rolTieneAccesoAlModulo($role, $modulo);
                    } catch (\Exception $e) {
                        \Log::warning("Error filtrando módulo {$modulo->id}: {$e->getMessage()}");
                        return false;
                    }
                })
                ->map(function ($modulo) use ($role) {
                    try {
                        $navItem = $modulo->toNavItem();

                        // Filtrar submódulos por permisos del rol
                        if (isset($navItem['children']) && is_array($navItem['children'])) {
                            $navItem['children'] = collect($navItem['children'])
                                ->filter(function ($child) use ($role) {
                                    try {
                                        // Encontrar el módulo original para verificar permisos
                                        $submodulo = ModuloSidebar::find($child['id'] ?? null);
                                        if (! $submodulo) {
                                            return false;
                                        }

                                        return $this->rolTieneAccesoAlModulo($role, $submodulo);
                                    } catch (\Exception $e) {
                                        \Log::warning("Error filtrando submódulo: {$e->getMessage()}");
                                        return false;
                                    }
                                })
                                ->values()
                                ->toArray();
                        }

                        return $navItem;
                    } catch (\Exception $e) {
                        \Log::warning("Error procesando módulo {$modulo->id}: {$e->getMessage()}");
                        return null;
                    }
                })
                ->filter(fn($item) => $item !== null)
                ->values()
                ->toArray();

            return response()->json([
                'rol'           => [
                    'name'         => $role->name,
                    'display_name' => $role->display_order ?? $role->name,
                ],
                'modulos'       => $modulos,
                'total_modulos' => count($modulos),
            ]);
        } catch (\Exception $e) {
            \Log::error("Error en previewPorRol para rol {$rolName}: {$e->getMessage()}", ['exception' => $e]);
            return response()->json([
                'error'   => 'Error al cargar la vista previa del sidebar',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener lista de todos los roles para selector
     */
    public function obtenerRoles()
    {
        $roles = \Spatie\Permission\Models\Role::orderBy('name')
            ->get(['id', 'name'])
            ->map(function ($role) {
                return [
                    'id'    => $role->id,
                    'name'  => $role->name,
                    'label' => ucfirst(str_replace('-', ' ', $role->name)),
                ];
            });

        return response()->json($roles);
    }

    /**
     * Aplicar cambios en lote a la matriz de acceso (rol-módulo)
     * Soporta agregar, reemplazar o eliminar permisos
     */
    public function bulkUpdateMatrizAcceso(Request $request)
    {
        $validated = $request->validate([
            'cambios'                 => 'required|array|min:1',
            'cambios.*.rol_id'        => 'required|integer',
            'cambios.*.rol_nombre'    => 'required|string',
            'cambios.*.modulo_id'     => 'required|integer|exists:modulos_sidebar,id',
            'cambios.*.modulo_titulo' => 'required|string',
            'cambios.*.permisos'      => 'required|array',
            'cambios.*.accion'        => 'required|in:agregar,eliminar,reemplazar',
        ]);

        $cambios          = $validated['cambios'];
        $cambiosAplicados = 0;

        try {
            foreach ($cambios as $cambio) {
                $modulo           = ModuloSidebar::findOrFail($cambio['modulo_id']);
                $permisosActuales = $modulo->permisos ?? [];
                $nuevosPermisos   = $permisosActuales;

                switch ($cambio['accion']) {
                    case 'reemplazar':
                        $nuevosPermisos = $cambio['permisos'];
                        break;
                    case 'agregar':
                        $nuevosPermisos = array_unique(array_merge($permisosActuales, $cambio['permisos']));
                        break;
                    case 'eliminar':
                        $nuevosPermisos = array_values(array_diff($permisosActuales, $cambio['permisos']));
                        break;
                }

                $modulo->update(['permisos' => $nuevosPermisos]);
                $cambiosAplicados++;
            }

            return response()->json([
                'success' => true,
                'message' => "Cambios aplicados a {$cambiosAplicados} combinaciones rol-módulo",
                'cambios_aplicados' => $cambiosAplicados,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al aplicar los cambios: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener historial de cambios (auditoría) de módulos
     */
    public function obtenerHistorial(Request $request)
    {
        $query = \App\Models\ModuloAudit::with(['modulo', 'usuario']);

        // Filtrar por módulo si se proporciona
        if ($request->has('modulo_id')) {
            $query->where('modulo_id', $request->input('modulo_id'));
        }

        // Filtrar por acción
        if ($request->has('accion') && $request->input('accion') !== 'todos') {
            $query->where('accion', $request->input('accion'));
        }

        // Filtrar por rango de fechas
        if ($request->has('desde')) {
            $query->where('created_at', '>=', $request->input('desde'));
        }

        if ($request->has('hasta')) {
            $query->where('created_at', '<=', $request->input('hasta'));
        }

        $cambios = $query->orderBy('created_at', 'desc')
            ->limit(100)
            ->get()
            ->map(function ($audit) {
                return [
                    'id'               => $audit->id,
                    'modulo_id'        => $audit->modulo_id,
                    'modulo_titulo'    => $audit->modulo?->titulo ?? 'N/A',
                    'usuario_id'       => $audit->usuario_id,
                    'usuario_nombre'   => $audit->usuario?->name ?? 'Sistema',
                    'accion'           => $audit->accion,
                    'datos_anteriores' => $audit->datos_anteriores,
                    'datos_nuevos'     => $audit->datos_nuevos,
                    'fecha'            => $audit->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'cambios' => $cambios,
            'total'   => $cambios->count(),
        ]);
    }

    /**
     * Aplicar operaciones en lote a múltiples módulos
     * Soporta: cambiar estado, cambiar categoría, cambiar visibilidad en dashboard
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids'            => 'required|array|min:1',
            'ids.*'          => 'required|integer|exists:modulos_sidebar,id',
            'operacion'      => 'required|array',
            'operacion.tipo' => 'required|in:estado,categoria,visible_dashboard',
        ]);

        $ids              = $validated['ids'];
        $operacion        = $validated['operacion'];
        $cambiosAplicados = 0;

        try {
            foreach ($ids as $id) {
                $modulo = ModuloSidebar::findOrFail($id);

                switch ($operacion['tipo']) {
                    case 'estado':
                        $modulo->update([
                            'activo' => $operacion['valor'] ?? false,
                        ]);
                        $cambiosAplicados++;
                        break;

                    case 'categoria':
                        $modulo->update([
                            'categoria' => $operacion['valor'] ?? null,
                        ]);
                        $cambiosAplicados++;
                        break;

                    case 'visible_dashboard':
                        $modulo->update([
                            'visible_dashboard' => $operacion['valor'] ?? false,
                        ]);
                        $cambiosAplicados++;
                        break;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Cambios aplicados a {$cambiosAplicados} módulos",
                'cambios_aplicados' => $cambiosAplicados,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al aplicar los cambios: ' . $e->getMessage(),
            ], 500);
        }
    }
}
