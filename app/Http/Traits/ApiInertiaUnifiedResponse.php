<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Trait para respuestas unificadas (Web + API)
 *
 * Detecta automáticamente si el cliente es:
 * - Web (Inertia/React)
 * - API (JSON)
 * - WebSocket (JSON)
 *
 * Y retorna la respuesta apropiada.
 *
 * USAGE:
 * ------
 * use ApiInertiaUnifiedResponse;
 *
 * public function store(StoreRequest $request)
 * {
 *     try {
 *         $dto = CrearDTO::fromRequest($request);
 *         $resultado = $this->service->crear($dto);
 *         return $this->respondSuccess($resultado, 'Creado exitosamente', route('show', $resultado->id));
 *     } catch (DomainException $e) {
 *         return $this->respondError($e->getMessage(), $e->getErrors());
 *     }
 * }
 */
trait ApiInertiaUnifiedResponse
{
    /**
     * Respuesta exitosa
     *
     * @param mixed $data DTO o datos a retornar
     * @param string $message Mensaje de éxito
     * @param string|null $redirectTo URL para redirect (Web only)
     * @param int $statusCode HTTP status code
     */
    protected function respondSuccess(
        mixed $data = null,
        string $message = 'Operación exitosa',
        ?string $redirectTo = null,
        int $statusCode = 200,
    ): JsonResponse|RedirectResponse|InertiaResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $data instanceof \App\DTOs\BaseDTO ? $data->toArray() : $data,
            ], $statusCode);
        }

        // Web (Inertia)
        if ($redirectTo) {
            return redirect($redirectTo)->with('success', $message);
        }

        return back()->with('success', $message);
    }

    /**
     * Respuesta de error
     *
     * @param string $message Mensaje de error
     * @param array $errors Errores detallados
     * @param int $statusCode HTTP status code
     */
    protected function respondError(
        string $message = 'Error en la operación',
        array $errors = [],
        int $statusCode = 422,
    ): JsonResponse|RedirectResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => false,
                'message' => $message,
                'errors' => $errors,
            ], $statusCode);
        }

        // Web
        return back()
            ->withErrors(['error' => $message])
            ->withInput();
    }

    /**
     * Respuesta para listado paginado
     *
     * @param \Illuminate\Pagination\Paginator $paginated
     * @param string $inertiaComponent Componente Inertia (ej: 'Ventas/Index')
     * @param array $inertiaProps Props adicionales para Inertia
     */
    protected function respondPaginated(
        mixed $paginated,
        string $inertiaComponent,
        array $inertiaProps = [],
    ): JsonResponse|InertiaResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => true,
                'data' => $paginated->items(),
                'pagination' => [
                    'total' => $paginated->total(),
                    'per_page' => $paginated->perPage(),
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'from' => $paginated->firstItem(),
                    'to' => $paginated->lastItem(),
                ],
            ]);
        }

        // Web (Inertia)
        return Inertia::render($inertiaComponent, array_merge(
            ['items' => $paginated],
            $inertiaProps,
        ));
    }

    /**
     * Respuesta para listado simple (sin paginación)
     */
    protected function respondList(
        array $data,
        string $inertiaComponent,
        array $inertiaProps = [],
    ): JsonResponse|InertiaResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        }

        // Web
        return Inertia::render($inertiaComponent, array_merge(
            ['items' => $data],
            $inertiaProps,
        ));
    }

    /**
     * Respuesta para detalle
     */
    protected function respondShow(
        mixed $data,
        string $inertiaComponent = '',
        array $inertiaProps = [],
    ): JsonResponse|InertiaResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            $responseData = $data instanceof \App\DTOs\BaseDTO
                ? $data->toArray()
                : $data->toArray();

            return response()->json([
                'success' => true,
                'data' => $responseData,
            ]);
        }

        // Web
        if ($inertiaComponent) {
            $props = $data instanceof \App\DTOs\BaseDTO
                ? $data->toArray()
                : $data->toArray();

            return Inertia::render($inertiaComponent, array_merge(
                ['item' => $props],
                $inertiaProps,
            ));
        }

        return back();
    }

    /**
     * Respuesta de eliminación
     */
    protected function respondDeleted(
        string $message = 'Elemento eliminado exitosamente',
        ?string $redirectTo = null,
    ): JsonResponse|RedirectResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => true,
                'message' => $message,
            ], 200);
        }

        // Web
        if ($redirectTo) {
            return redirect($redirectTo)->with('success', $message);
        }

        return back()->with('success', $message);
    }

    /**
     * Respuesta 404
     */
    protected function respondNotFound(
        string $message = 'Recurso no encontrado',
    ): JsonResponse|RedirectResponse {
        // API/JSON
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 404);
        }

        // Web
        return back()->with('error', $message);
    }

    /**
     * Respuesta 403 (No autorizado)
     */
    protected function respondForbidden(
        string $message = 'No autorizado',
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 403);
    }

    // ══════════════════════════════════════════════════════════
    // HELPERS - Detectar tipo de cliente
    // ══════════════════════════════════════════════════════════

    /**
     * ¿Es una petición API/JSON?
     * ✅ MEJORADO: Verificar primero si es Inertia (web) antes de detectar JSON
     * Esto evita que requests de Inertia que envían Accept: application/json
     * sean detectados como API requests.
     */
    protected function isApiRequest(?Request $request = null): bool
    {
        $req = $request ?? request();

        // ✅ IMPORTANTE: Si es un request de Inertia (web), NO es un API request
        // Inertia envía X-Inertia: true en todos sus requests
        if ($req->header('X-Inertia') === 'true') {
            return false;
        }

        // Checklist de condiciones para detectar petición JSON/API:
        return
            // 1. URL /api/* (endpoints API)
            $req->is('api/*')
            // 2. Header X-Requested-With: XMLHttpRequest (AJAX clásico)
            || $req->header('X-Requested-With') === 'XMLHttpRequest'
            // 3. Content-Type: application/json (para POST/PUT)
            || str_contains($req->header('Content-Type', ''), 'application/json')
            // 4. Header Accept: application/json (AJAX estándar)
            // ⚠️ NOTA: Esta debe ir última porque Inertia también lo envía
            || $req->wantsJson()
            // 5. Header X-Inertia: false (indicador explícito de que NO es Inertia)
            || $req->header('X-Inertia') === 'false';
    }

    /**
     * ¿Es una petición de Inertia (Web)?
     */
    protected function isInertiaRequest(?Request $request = null): bool
    {
        return request()->header('X-Inertia') === 'true';
    }

    /**
     * ¿Es una petición de modal?
     */
    protected function isModalRequest(?Request $request = null): bool
    {
        return request()->header('X-Modal-Request') === 'true' ||
               request()->has('modal');
    }

    // ══════════════════════════════════════════════════════════
    // ALIASES - Para compatibilidad con código legacy
    // ══════════════════════════════════════════════════════════

    /**
     * Respuesta exitosa (alias de respondSuccess)
     */
    protected function successResponse(
        string $message = 'Operación exitosa',
        mixed $data = null,
        ?string $redirectRoute = null,
        array $redirectParams = [],
        int $statusCode = 200
    ): JsonResponse|RedirectResponse|InertiaResponse {
        return $this->respondSuccess($data, $message, $redirectRoute, $statusCode);
    }

    /**
     * Respuesta de error (alias de respondError)
     */
    protected function errorResponse(
        string $message = 'Ha ocurrido un error',
        mixed $errors = null,
        ?string $redirectRoute = null,
        array $redirectParams = [],
        int $statusCode = 422
    ): JsonResponse|RedirectResponse {
        return $this->respondError($message, $errors ?? [], $statusCode);
    }

    /**
     * Respuesta de validación
     */
    protected function validationErrorResponse(
        array $errors,
        string $message = 'Errores de validación'
    ): JsonResponse|RedirectResponse {
        return $this->respondError($message, $errors, 422);
    }

    /**
     * Respuesta para mostrar datos
     */
    protected function dataResponse(
        string $component,
        array $data = [],
        ?string $title = null
    ): JsonResponse|InertiaResponse {
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        }

        $response = Inertia::render($component, $data);
        if ($title) {
            $response = $response->with('title', $title);
        }
        return $response;
    }

    /**
     * Respuesta para recursos
     */
    protected function resourceResponse(
        mixed $resource,
        string $message,
        ?string $redirectRoute = null,
        array $redirectParams = [],
        int $statusCode = 200
    ): JsonResponse|RedirectResponse {
        return $this->respondSuccess($resource, $message, $redirectRoute, $statusCode);
    }

    /**
     * Respuesta para eliminación (alias de respondDeleted)
     */
    protected function deleteResponse(
        string $message = 'Elemento eliminado exitosamente',
        ?string $redirectRoute = null,
        array $redirectParams = []
    ): JsonResponse|RedirectResponse {
        return $this->respondDeleted($message, $redirectRoute);
    }

    /**
     * Respuesta 404 (alias de respondNotFound)
     */
    protected function notFoundResponse(
        string $message = 'Recurso no encontrado'
    ): JsonResponse|RedirectResponse {
        return $this->respondNotFound($message);
    }

    /**
     * Respuesta 403 (alias de respondForbidden)
     */
    protected function forbiddenResponse(
        string $message = 'No tienes permisos para realizar esta acción'
    ): JsonResponse {
        return $this->respondForbidden($message);
    }

    /**
     * Respuesta paginada
     */
    protected function paginatedResponse(
        mixed $paginatedData,
        ?string $component = null,
        string $dataKey = 'data',
        array $additionalData = []
    ): JsonResponse|InertiaResponse {
        if ($this->isApiRequest()) {
            return response()->json([
                'success' => true,
                'data' => $paginatedData->items(),
                'pagination' => [
                    'current_page' => $paginatedData->currentPage(),
                    'last_page' => $paginatedData->lastPage(),
                    'per_page' => $paginatedData->perPage(),
                    'total' => $paginatedData->total(),
                    'from' => $paginatedData->firstItem(),
                    'to' => $paginatedData->lastItem(),
                ],
                'links' => [
                    'first' => $paginatedData->url(1),
                    'last' => $paginatedData->url($paginatedData->lastPage()),
                    'prev' => $paginatedData->previousPageUrl(),
                    'next' => $paginatedData->nextPageUrl(),
                ]
            ]);
        }

        if (!$component) {
            throw new \InvalidArgumentException('Component name required for Inertia response');
        }

        return Inertia::render($component, array_merge([
            $dataKey => $paginatedData,
        ], $additionalData));
    }

    /**
     * Manejo unificado de excepciones
     */
    protected function handleException(
        \Exception $e,
        string $operation = 'operación',
        ?string $redirectRoute = null
    ): JsonResponse|RedirectResponse {
        \Illuminate\Support\Facades\Log::error("Error en {$operation}: " . $e->getMessage(), [
            'exception' => $e,
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
            'request' => request()->all()
        ]);

        $message = config('app.debug')
            ? $e->getMessage()
            : "Error al realizar {$operation}";

        return $this->respondError($message, [], 500);
    }

    /**
     * Respuesta modal
     */
    protected function modalResponse(array $data, ?string $message = null): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $data,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, 200, [
            'X-Inertia-Location' => false,
        ]);
    }

    /**
     * Respuesta genérica que detecta automáticamente el tipo
     */
    protected function respondWith(
        Request $request = null,
        array $data = [],
        ?string $successMessage = null,
        ?string $redirectRoute = null,
        array $redirectParams = []
    ): JsonResponse|RedirectResponse|InertiaResponse {
        $request = $request ?? request();

        if ($this->isApiRequest()) {
            return $this->respondSuccess($data, $successMessage ?? 'Success');
        }

        if ($this->isModalRequest($request)) {
            return $this->modalResponse($data, $successMessage);
        }

        return $this->respondSuccess($data, $successMessage, $redirectRoute);
    }

    /**
     * Manejo unificado de operaciones CRUD
     * Ejecuta un callback y retorna la respuesta apropiada según el tipo de cliente
     */
    protected function handleCrudOperation(
        Request $request,
        callable $operation,
        string $successMessage = 'Operación exitosa',
        ?string $redirectRoute = null,
        int $statusCode = 200
    ): JsonResponse|RedirectResponse|InertiaResponse {
        try {
            // Ejecutar la operación
            $result = $operation();

            // Detectar tipo de cliente y retornar respuesta apropiada
            if ($this->isModalRequest($request)) {
                return $this->modalResponse($result ?? [], $successMessage);
            }

            // Si el redirectRoute es un nombre de ruta (sin /), convertirlo a URL usando route()
            $finalRedirectRoute = $redirectRoute;
            if ($redirectRoute && !str_starts_with($redirectRoute, '/')) {
                $finalRedirectRoute = route($redirectRoute);
            }

            return $this->respondSuccess($result, $successMessage, $finalRedirectRoute, $statusCode);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error en CRUD operation: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->respondError(
                'Error: ' . $e->getMessage(),
                [],
                500
            );
        }
    }
}
