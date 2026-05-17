<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

trait BaseCrudTrait
{
    use ApiInertiaUnifiedResponse;

    /**
     * Configuración por defecto para el CRUD
     * Puede ser sobrescrita en cada controlador
     */
    protected function getCrudConfig(): array
    {
        return [
            'model' => null, // Debe ser definido en cada controlador
            'resource_name' => 'recurso', // Nombre del recurso para mensajes
            'resource_name_plural' => 'recursos', // Nombre plural para mensajes
            'view_prefix' => '', // Prefijo para las vistas (ej: 'clientes.')
            'index_view' => 'index',
            'form_view' => 'form',
            'show_view' => 'show',
            'per_page' => 15,
            'api_per_page' => 20,
            'search_fields' => ['nombre'], // Campos para búsqueda
            'order_fields' => ['id', 'nombre', 'created_at'], // Campos permitidos para ordenar
            'default_order_by' => 'id',
            'default_order_dir' => 'desc',
            'api_default_order_by' => 'nombre',
            'api_default_order_dir' => 'asc',
            'with_relations' => [], // Relaciones a cargar por defecto
            'api_with_relations' => [], // Relaciones adicionales para API
            'filters' => [], // Filtros disponibles
            'validation_rules' => [], // Reglas de validación por defecto
            'store_validation_rules' => [], // Reglas específicas para store
            'update_validation_rules' => [], // Reglas específicas para update
            'soft_delete' => false, // Si usa soft delete
            'before_store' => null, // Callback antes de crear
            'after_store' => null, // Callback después de crear
            'before_update' => null, // Callback antes de actualizar
            'after_update' => null, // Callback después de actualizar
            'before_destroy' => null, // Callback antes de eliminar
            'after_destroy' => null, // Callback después de eliminar
        ];
    }

    /**
     * Obtiene el modelo configurado
     */
    protected function getModel(): string
    {
        $config = $this->getCrudConfig();
        if (!$config['model']) {
            throw new \InvalidArgumentException('Model must be defined in getCrudConfig()');
        }
        return $config['model'];
    }

    /**
     * Obtiene una instancia del modelo
     */
    protected function getModelInstance(): Model
    {
        $modelClass = $this->getModel();
        return new $modelClass;
    }

    /**
     * Construye la query base con filtros y ordenamiento
     */
    protected function buildBaseQuery(Request $request): \Illuminate\Database\Eloquent\Builder
    {
        $config = $this->getCrudConfig();
        $model = $this->getModelInstance();
        
        $query = $model->newQuery();

        // Aplicar relaciones
        $withRelations = $this->isApiRequest() 
            ? array_merge($config['with_relations'], $config['api_with_relations'])
            : $config['with_relations'];
        
        if (!empty($withRelations)) {
            $query->with($withRelations);
        }

        // Aplicar filtros de búsqueda
        $this->applySearchFilters($query, $request, $config);

        // Aplicar filtros adicionales
        $this->applyAdditionalFilters($query, $request, $config);

        // Aplicar ordenamiento
        $this->applyOrdering($query, $request, $config);

        return $query;
    }

    /**
     * Aplica filtros de búsqueda
     */
    protected function applySearchFilters($query, Request $request, array $config): void
    {
        $searchTerm = $request->string('q');
        
        if ($searchTerm && !empty($config['search_fields'])) {
            $query->where(function ($subQuery) use ($searchTerm, $config) {
                foreach ($config['search_fields'] as $field) {
                    $subQuery->orWhere($field, 'like', "%{$searchTerm}%");
                }
            });
        }
    }

    /**
     * Aplica filtros adicionales configurados
     */
    protected function applyAdditionalFilters($query, Request $request, array $config): void
    {
        foreach ($config['filters'] as $filter) {
            $field = $filter['field'] ?? null;
            $param = $filter['param'] ?? $field;
            $type = $filter['type'] ?? 'equals';
            
            if (!$field || !$request->has($param)) {
                continue;
            }

            $value = $request->input($param);
            
            if ($value === null || $value === '' || $value === 'all') {
                continue;
            }

            switch ($type) {
                case 'equals':
                    $query->where($field, $value);
                    break;
                case 'boolean':
                    $query->where($field, $request->boolean($param));
                    break;
                case 'like':
                    $query->where($field, 'like', "%{$value}%");
                    break;
                case 'date':
                    $query->whereDate($field, $value);
                    break;
                case 'between':
                    if (isset($filter['start_param'], $filter['end_param'])) {
                        $start = $request->input($filter['start_param']);
                        $end = $request->input($filter['end_param']);
                        if ($start) $query->where($field, '>=', $start);
                        if ($end) $query->where($field, '<=', $end);
                    }
                    break;
            }
        }
    }

    /**
     * Aplica ordenamiento
     */
    protected function applyOrdering($query, Request $request, array $config): void
    {
        $orderBy = $config['default_order_by'];
        $orderDir = $config['default_order_dir'];

        if ($this->isApiRequest()) {
            $orderBy = $config['api_default_order_by'];
            $orderDir = $config['api_default_order_dir'];
        }

        // Permitir ordenamiento personalizado si está habilitado
        if ($request->has('order_by') && !empty($config['order_fields'])) {
            $requestOrderBy = $request->string('order_by');
            if (in_array($requestOrderBy, $config['order_fields'])) {
                $orderBy = $requestOrderBy;
            }
        }

        if ($request->has('order_dir')) {
            $requestOrderDir = strtolower($request->string('order_dir'));
            if (in_array($requestOrderDir, ['asc', 'desc'])) {
                $orderDir = $requestOrderDir;
            }
        }

        $query->orderBy($orderBy, $orderDir);
    }

    /**
     * INDEX - Lista paginada de recursos
     */
    public function index(Request $request)
    {
        try {
            $config = $this->getCrudConfig();
            $perPage = $this->isApiRequest() ? $config['api_per_page'] : $config['per_page'];
            
            $query = $this->buildBaseQuery($request);
            $data = $query->paginate($request->integer('per_page', $perPage))->withQueryString();

            // Preparar datos adicionales para web
            $additionalData = [];
            if (!$this->isApiRequest()) {
                $additionalData = $this->getIndexAdditionalData($request);
            }

            return $this->paginatedResponse(
                $data,
                $this->isApiRequest() ? null : $this->getViewPath($config['index_view']),
                $additionalData
            );

        } catch (\Exception $e) {
            return $this->handleException($e, "obtener {$config['resource_name_plural']}");
        }
    }

    /**
     * SHOW - Mostrar un recurso específico
     */
    public function show($id)
    {
        try {
            $config = $this->getCrudConfig();
            $model = $this->getModelInstance();
            
            $resource = $model->findOrFail($id);
            
            // Cargar relaciones adicionales para API
            if ($this->isApiRequest() && !empty($config['api_with_relations'])) {
                $resource->load($config['api_with_relations']);
            }

            if ($this->isApiRequest()) {
                return $this->successResponse('Recurso obtenido exitosamente', $resource);
            }

            return $this->dataResponse(
                $this->getViewPath($config['show_view']),
                [$config['resource_name'] => $resource]
            );

        } catch (\Exception $e) {
            $config = $this->getCrudConfig();
            return $this->handleException($e, "obtener {$config['resource_name']}");
        }
    }

    /**
     * CREATE - Mostrar formulario de creación
     */
    public function create()
    {
        try {
            $config = $this->getCrudConfig();
            $data = $this->getCreateFormData();

            return $this->dataResponse(
                $this->getViewPath($config['form_view']),
                $data
            );

        } catch (\Exception $e) {
            $config = $this->getCrudConfig();
            return $this->handleException($e, "cargar formulario de creación");
        }
    }

    /**
     * STORE - Crear nuevo recurso
     */
    public function store(Request $request)
    {
        try {
            $config = $this->getCrudConfig();
            
            // Validar datos
            $validatedData = $this->validateStoreData($request);
            
            // Callback antes de crear
            if ($config['before_store']) {
                $validatedData = call_user_func($config['before_store'], $validatedData, $request);
            }

            DB::beginTransaction();

            // Crear el recurso
            $resource = $this->createResource($validatedData, $request);

            // Callback después de crear
            if ($config['after_store']) {
                call_user_func($config['after_store'], $resource, $request);
            }

            DB::commit();

            // Preparar respuesta
            $message = ucfirst($config['resource_name']) . ' creado exitosamente';
            
            if ($this->isApiRequest()) {
                return $this->resourceResponse($resource, $message, null, [], 201);
            }

            return $this->resourceResponse(
                $resource,
                $message,
                $this->getIndexRoute()
            );

        } catch (\Exception $e) {
            DB::rollBack();
            $config = $this->getCrudConfig();
            return $this->handleException($e, "crear {$config['resource_name']}");
        }
    }

    /**
     * EDIT - Mostrar formulario de edición
     */
    public function edit($id)
    {
        try {
            $config = $this->getCrudConfig();
            $model = $this->getModelInstance();
            
            $resource = $model->findOrFail($id);
            $data = $this->getEditFormData($resource);

            return $this->dataResponse(
                $this->getViewPath($config['form_view']),
                $data
            );

        } catch (\Exception $e) {
            $config = $this->getCrudConfig();
            return $this->handleException($e, "cargar formulario de edición");
        }
    }

    /**
     * UPDATE - Actualizar recurso existente
     */
    public function update(Request $request, $id)
    {
        try {
            $config = $this->getCrudConfig();
            $model = $this->getModelInstance();
            
            $resource = $model->findOrFail($id);
            
            // Validar datos
            $validatedData = $this->validateUpdateData($request, $resource);
            
            // Callback antes de actualizar
            if ($config['before_update']) {
                $validatedData = call_user_func($config['before_update'], $validatedData, $request, $resource);
            }

            DB::beginTransaction();

            // Actualizar el recurso
            $this->updateResource($resource, $validatedData, $request);

            // Callback después de actualizar
            if ($config['after_update']) {
                call_user_func($config['after_update'], $resource, $request);
            }

            DB::commit();

            // Preparar respuesta
            $message = ucfirst($config['resource_name']) . ' actualizado exitosamente';
            
            if ($this->isApiRequest()) {
                return $this->resourceResponse($resource->fresh(), $message);
            }

            return $this->resourceResponse(
                $resource->fresh(),
                $message,
                $this->getIndexRoute()
            );

        } catch (\Exception $e) {
            DB::rollBack();
            $config = $this->getCrudConfig();
            return $this->handleException($e, "actualizar {$config['resource_name']}");
        }
    }

    /**
     * DESTROY - Eliminar recurso
     */
    public function destroy($id)
    {
        try {
            $config = $this->getCrudConfig();
            $model = $this->getModelInstance();
            
            $resource = $model->findOrFail($id);
            
            // Callback antes de eliminar
            if ($config['before_destroy']) {
                $result = call_user_func($config['before_destroy'], $resource);
                if ($result !== true) {
                    return $result; // Si retorna una respuesta, usarla
                }
            }

            DB::beginTransaction();

            // Eliminar el recurso
            $this->deleteResource($resource);

            // Callback después de eliminar
            if ($config['after_destroy']) {
                call_user_func($config['after_destroy'], $resource);
            }

            DB::commit();

            // Preparar respuesta
            $message = ucfirst($config['resource_name']) . ' eliminado exitosamente';
            
            return $this->deleteResponse(
                $message,
                $this->isApiRequest() ? null : $this->getIndexRoute()
            );

        } catch (\Exception $e) {
            DB::rollBack();
            $config = $this->getCrudConfig();
            return $this->handleException($e, "eliminar {$config['resource_name']}");
        }
    }

    /**
     * Valida datos para store
     */
    protected function validateStoreData(Request $request): array
    {
        $config = $this->getCrudConfig();
        $rules = array_merge($config['validation_rules'], $config['store_validation_rules']);
        
        return $request->validate($rules);
    }

    /**
     * Valida datos para update
     */
    protected function validateUpdateData(Request $request, Model $resource): array
    {
        $config = $this->getCrudConfig();
        $rules = array_merge($config['validation_rules'], $config['update_validation_rules']);
        
        // Convertir reglas 'required' a 'sometimes|required' para update
        foreach ($rules as $field => $rule) {
            if (is_string($rule) && str_contains($rule, 'required')) {
                $rules[$field] = str_replace('required', 'sometimes|required', $rule);
            }
        }
        
        return $request->validate($rules);
    }

    /**
     * Crea un nuevo recurso
     */
    protected function createResource(array $data, Request $request): Model
    {
        $model = $this->getModelInstance();
        return $model->create($data);
    }

    /**
     * Actualiza un recurso existente
     */
    protected function updateResource(Model $resource, array $data, Request $request): void
    {
        $resource->update($data);
    }

    /**
     * Elimina un recurso
     */
    protected function deleteResource(Model $resource): void
    {
        $config = $this->getCrudConfig();
        
        if ($config['soft_delete'] && method_exists($resource, 'delete')) {
            $resource->delete(); // Soft delete
        } else {
            $resource->forceDelete(); // Hard delete
        }
    }

    /**
     * Obtiene datos adicionales para la vista index
     */
    protected function getIndexAdditionalData(Request $request): array
    {
        return [
            'filters' => $request->only(['q', 'order_by', 'order_dir']),
        ];
    }

    /**
     * Obtiene datos para el formulario de creación
     */
    protected function getCreateFormData(): array
    {
        $config = $this->getCrudConfig();
        return [
            $config['resource_name'] => null,
        ];
    }

    /**
     * Obtiene datos para el formulario de edición
     */
    protected function getEditFormData(Model $resource): array
    {
        $config = $this->getCrudConfig();
        return [
            $config['resource_name'] => $resource,
        ];
    }

    /**
     * Construye la ruta de vista completa
     */
    protected function getViewPath(string $view): string
    {
        $config = $this->getCrudConfig();
        $prefix = $config['view_prefix'];
        
        return $prefix ? "{$prefix}{$view}" : $view;
    }

    /**
     * Obtiene la ruta del índice (debe ser sobrescrita en cada controlador)
     */
    protected function getIndexRoute(): string
    {
        // Por defecto, intenta inferir la ruta basada en el nombre del controlador
        $controllerName = class_basename(static::class);
        $resourceName = strtolower(str_replace('Controller', '', $controllerName));
        
        return "{$resourceName}.index";
    }

    /**
     * Convierte diferentes formatos de valores booleanos a boolean real
     */
    protected function convertToBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $lowerValue = strtolower($value);
            return in_array($lowerValue, ['true', '1', 'yes', 'on']);
        }

        if (is_numeric($value)) {
            return $value == 1;
        }

        return false;
    }
}
