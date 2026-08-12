<?php
namespace App\Http\Controllers;

use App\DTOs\Notificaciones\CrearNotificacionDTO;
use App\Http\Requests\StoreNotificacionRequest;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use App\Models\NotificacionRecurrente;
use App\Services\Notificaciones\NotificacionRecurrenteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificacionRecurrenteController extends Controller
{
    use ApiInertiaUnifiedResponse;

    public function __construct(
        private NotificacionRecurrenteService $service,
    ) {
        $this->middleware("permission:notificaciones.index")->only("index");
        $this->middleware("permission:notificaciones.show")->only("show");
        $this->middleware("permission:notificaciones.create")->only("create", "store");
        $this->middleware("permission:notificaciones.update")->only("edit", "update");
        $this->middleware("permission:notificaciones.delete")->only("destroy");
    }

    /**
     * Listar notificaciones recurrentes (solo ACTIVAS para clientes móviles)
     * ✅ PÚBLICO: Sin permisos requeridos - accesible desde Flutter
     */
    public function indexPublic(Request $request): JsonResponse
    {
        try {
            // Solo mostrar notificaciones ACTIVAS y dentro de fechas válidas
            $notificaciones = NotificacionRecurrente::where('activo', true)
                ->where('fecha_inicio', '<=', now()->toDateString())
                ->where(function ($q) {
                    $q->whereNull('fecha_fin')
                      ->orWhere('fecha_fin', '>=', now()->toDateString());
                })
                ->with(['usuario', 'roles'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->input('per_page', 15));

            return response()->json([
                "success" => true,
                "notificaciones" => $notificaciones->items(),
                "pagination" => [
                    "current_page" => $notificaciones->currentPage(),
                    "last_page" => $notificaciones->lastPage(),
                    "total" => $notificaciones->total(),
                    "per_page" => $notificaciones->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("Error al listar notificaciones públicas", ["error" => $e->getMessage()]);
            return response()->json([
                "success" => false,
                "message" => "Error al cargar notificaciones",
            ], 500);
        }
    }

    /**
     * Listar notificaciones recurrentes (con permisos)
     */
    public function index(Request $request): JsonResponse | InertiaResponse
    {
        try {
            $query = NotificacionRecurrente::query();

            if ($request->filled("search")) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where("titulo", "like", "%{$search}%")
                      ->orWhere("descripcion", "like", "%{$search}%");
                });
            }

            if ($request->filled("tipo")) {
                $query->where("tipo", $request->tipo);
            }

            if ($request->filled("frecuencia")) {
                $query->where("frecuencia", $request->frecuencia);
            }

            if ($request->filled("activo")) {
                $query->where("activo", $request->activo === "true" ? true : false);
            }

            $notificaciones = $query->with(["usuario", "roles"])
                ->orderBy("created_at", "desc")
                ->paginate($request->input("per_page", 15));

            $estadisticas = [
                "total" => NotificacionRecurrente::count(),
                "activas" => NotificacionRecurrente::where("activo", true)->count(),
                "inactivas" => NotificacionRecurrente::where("activo", false)->count(),
                "proximas" => NotificacionRecurrente::activas()->count(),
            ];

            // Si es solicitud AJAX/API, retornar JSON
            if ($request->wantsJson()) {
                return response()->json([
                    "success" => true,
                    "notificaciones" => $notificaciones->items(),
                    "estadisticas" => $estadisticas,
                    "pagination" => [
                        "current_page" => $notificaciones->currentPage(),
                        "last_page" => $notificaciones->lastPage(),
                        "total" => $notificaciones->total(),
                        "per_page" => $notificaciones->perPage(),
                    ],
                ]);
            }

            // Si es solicitud web, retornar Inertia
            return Inertia::render("notificaciones/Index", [
                'notificaciones' => $notificaciones,
                'estadisticas' => $estadisticas,
            ]);
        } catch (\Exception $e) {
            Log::error("Error al listar notificaciones", ["error" => $e->getMessage()]);

            if ($request->wantsJson()) {
                return response()->json([
                    "success" => false,
                    "notificaciones" => [],
                    "estadisticas" => ['total' => 0, 'activas' => 0, 'inactivas' => 0, 'proximas' => 0],
                    "error" => "Error al cargar notificaciones",
                ], 500);
            }

            return Inertia::render("notificaciones/Index", [
                'notificaciones' => [],
                'estadisticas' => ['total' => 0, 'activas' => 0, 'inactivas' => 0, 'proximas' => 0],
                'error' => 'Error al cargar notificaciones',
            ]);
        }
    }

    /**
     * Crear notificación (mostrar formulario)
     */
    public function create(): InertiaResponse
    {
        return Inertia::render("notificaciones/Create");
    }

    /**
     * Guardar notificación recurrente
     */
    public function store(StoreNotificacionRequest $request): JsonResponse
    {
        try {
            $dto = CrearNotificacionDTO::fromRequest($request);
            $notificacion = $this->service->crear($dto);

            // ✅ Asignar roles (siempre sincronizar, incluso si está vacío)
            $rolesArray = is_array($request->roles) ? $request->roles : [];
            $notificacion->roles()->sync($rolesArray);

            Log::debug("✅ Roles asignados a nueva notificación", [
                "notificacion_id" => $notificacion->id,
                "roles_enviados" => $request->roles,
                "roles_asignados" => $rolesArray,
            ]);

            $notificacion->load('roles');

            Log::info("✅ Notificación recurrente creada", [
                "notificacion_id" => $notificacion->id,
                "roles" => $notificacion->roles->pluck('name'),
            ]);

            return response()->json([
                "success" => true,
                "message" => "Notificación creada exitosamente",
                "data" => $notificacion,
            ], 201);
        } catch (\Exception $e) {
            Log::error("Error al crear notificación", ["error" => $e->getMessage()]);
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Mostrar detalle de notificación
     */
    public function show(string $notificacion): JsonResponse
    {
        $notificacionModel = NotificacionRecurrente::findOrFail($notificacion);
        return response()->json([
            "success" => true,
            "data" => $notificacionModel->load("usuario"),
        ]);
    }

    /**
     * Editar notificación
     */
    public function edit(Request $request, string $notificacion): InertiaResponse
    {
        // ✅ Cargar manualmente desde el parámetro (workaround para route model binding)
        $notificacionModel = NotificacionRecurrente::findOrFail($notificacion);

        // ✅ Cargar relaciones necesarias para el formulario
        $notificacionModel->load(['roles', 'usuario']);

        // ✅ Serializar explícitamente con relaciones incluidas
        $notificacionData = [
            'id' => $notificacionModel->id,
            'titulo' => $notificacionModel->titulo,
            'descripcion' => $notificacionModel->descripcion,
            'tipo' => $notificacionModel->tipo,
            'frecuencia' => $notificacionModel->frecuencia,
            'activo' => $notificacionModel->activo,
            'hora_envio' => $notificacionModel->hora_envio,
            'fecha_inicio' => $notificacionModel->fecha_inicio,
            'fecha_fin' => $notificacionModel->fecha_fin,
            'dias_semana' => $notificacionModel->dias_semana ? json_decode($notificacionModel->dias_semana, true) : [],
            'dia_mes' => $notificacionModel->dia_mes,
            'total_enviadas' => $notificacionModel->total_enviadas,
            'vistas' => $notificacionModel->vistas,
            'ultimo_envio' => $notificacionModel->ultimo_envio,
            'roles' => $notificacionModel->roles->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
            ])->toArray(),
            'usuario' => $notificacionModel->usuario ? [
                'id' => $notificacionModel->usuario->id,
                'name' => $notificacionModel->usuario->name,
            ] : null,
        ];

        return Inertia::render("notificaciones/Edit", [
            "notificacion" => $notificacionData,
        ]);
    }

    /**
     * Actualizar notificación
     */
    public function update(StoreNotificacionRequest $request, string $notificacion): JsonResponse
    {
        try {
            $notificacionModel = NotificacionRecurrente::findOrFail($notificacion);
            $dto = CrearNotificacionDTO::fromRequest($request);
            $dto->validar();

            $notificacionModel->update([
                "titulo" => $dto->titulo,
                "descripcion" => $dto->descripcion,
                "tipo" => $dto->tipo,
                "frecuencia" => $dto->frecuencia,
                "hora_envio" => $dto->hora_envio,
                "dias_semana" => $dto->dias_semana,
                "dia_mes" => $dto->dia_mes,
                "fecha_inicio" => $dto->fecha_inicio,
                "fecha_fin" => $dto->fecha_fin,
                "activo" => $dto->activo,
            ]);

            // ✅ Actualizar roles (siempre sincronizar, incluso si está vacío)
            // Esto asegura que se desasocien todos si el array está vacío
            $rolesArray = is_array($request->roles) ? $request->roles : [];
            $notificacionModel->roles()->sync($rolesArray);

            Log::debug("✅ Roles sincronizados para notificación", [
                "notificacion_id" => $notificacionModel->id,
                "roles_enviados" => $request->roles,
                "roles_sincronizados" => $rolesArray,
            ]);

            $notificacionModel->load('roles');

            Log::info("✅ Notificación actualizada", [
                "notificacion_id" => $notificacionModel->id,
                "roles" => $notificacionModel->roles->pluck('name'),
            ]);

            return response()->json([
                "success" => true,
                "message" => "Notificación actualizada exitosamente",
                "data" => $notificacionModel,
            ]);
        } catch (\Exception $e) {
            Log::error("Error al actualizar notificación", ["error" => $e->getMessage()]);
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Eliminar notificación (soft delete)
     */
    public function destroy(string $notificacion): JsonResponse
    {
        try {
            $notificacionModel = NotificacionRecurrente::findOrFail($notificacion);
            $notificacionModel->delete();

            Log::info("✅ Notificación eliminada", [
                "notificacion_id" => $notificacionModel->id,
            ]);

            return response()->json([
                "success" => true,
                "message" => "Notificación eliminada exitosamente",
            ]);
        } catch (\Exception $e) {
            Log::error("Error al eliminar notificación", ["error" => $e->getMessage()]);
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Obtener roles disponibles para asignar a notificaciones
     */
    public function getRoles(): JsonResponse
    {
        try {
            $roles = \Spatie\Permission\Models\Role::select('id', 'name')
                ->orderBy('name')
                ->get()
                ->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'display_name' => ucfirst(str_replace('_', ' ', $role->name)),
                    ];
                });

            return response()->json([
                "success" => true,
                "data" => $roles,
            ]);
        } catch (\Exception $e) {
            Log::error("Error al obtener roles", ["error" => $e->getMessage()]);
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Enviar notificación manualmente (botón postal en admin)
     */
    public function enviarManual(string $notificacion): JsonResponse
    {
        try {
            $notificacionModel = NotificacionRecurrente::findOrFail($notificacion);
            $this->service->enviar($notificacionModel);

            return response()->json([
                "success" => true,
                "message" => "Notificación enviada exitosamente",
                "data" => $notificacionModel,
            ]);
        } catch (\Exception $e) {
            Log::error("Error al enviar notificación manualmente", ["error" => $e->getMessage()]);
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], 422);
        }
    }
}
