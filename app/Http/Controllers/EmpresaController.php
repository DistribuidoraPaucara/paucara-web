<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmpresaRequest;
use App\Http\Requests\UpdateEmpresaRequest;
use App\Http\Traits\SimpleCrudController;
use App\Models\Empresa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

/**
 * EmpresaController - CRUD de Empresas
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait + manejo personalizado de uploads
 * Gestiona: Datos básicos, logos (principal, compacto, footer), configuración de impresión
 */
class EmpresaController extends Controller
{
    use SimpleCrudController;

    /**
     * Retorna el modelo a usar
     */
    protected function getModel(): string
    {
        return Empresa::class;
    }

    /**
     * Retorna el nombre de las rutas
     */
    protected function getRouteName(): string
    {
        return 'empresas';
    }

    /**
     * Retorna el path de las vistas
     */
    protected function getViewPath(): string
    {
        return 'empresas';
    }

    /**
     * Retorna el nombre del recurso
     */
    protected function getResourceName(): string
    {
        return 'empresas';
    }

    /**
     * Retorna las reglas de validación
     */
    protected function getValidationRules(): array
    {
        return [
            'nombre_comercial' => ['required', 'string', 'max:255'],
            'razon_social' => ['required', 'string', 'max:255'],
            'nit' => ['nullable', 'string', 'max:20'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'sitio_web' => ['nullable', 'string', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:500'],
            'ciudad' => ['nullable', 'string', 'max:100'],
            'pais' => ['nullable', 'string', 'max:100'],
            'logo_principal' => ['nullable', 'file', 'image', 'max:4096', 'mimes:jpeg,png,jpg,gif'],
            'logo_compacto' => ['nullable', 'file', 'image', 'max:4096', 'mimes:jpeg,png,jpg,gif'],
            'logo_footer' => ['nullable', 'file', 'image', 'max:4096', 'mimes:jpeg,png,jpg,gif'],
            'mensaje_footer' => ['nullable', 'string', 'max:500'],
            'mensaje_legal' => ['nullable', 'string'],
            'activo' => ['nullable', 'boolean'],
            'es_principal' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Listar recursos con búsqueda y paginación
     *
     * GET /empresas?q=busqueda
     *
     * @param Request $request
     * @return Response Vista de índice con recursos paginados
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = $request->string('q');

        // Construir query con búsqueda por campos específicos de empresa
        $items = $modelClass::query()
            ->when($q, function ($query) use ($q) {
                return $query->where(function ($subQuery) use ($q) {
                    $searchTerm = '%' . strtolower($q) . '%';
                    $subQuery->whereRaw('LOWER(nombre_comercial) like ?', [$searchTerm])
                             ->orWhereRaw('LOWER(razon_social) like ?', [$searchTerm])
                             ->orWhereRaw('LOWER(nit) like ?', [$searchTerm])
                             ->orWhereRaw('LOWER(email) like ?', [$searchTerm]);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return inertia($this->getViewPath() . '/index', [
            $this->getResourceName() => $items,
            'filters' => ['q' => $q],
        ]);
    }

    /**
     * Mostrar formulario de edición
     *
     * GET /empresas/{id}/edit
     *
     * @param int|string $id ID del recurso a editar
     * @return Response Vista del formulario con datos
     */
    public function edit($id): Response
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);

        return inertia($this->getViewPath() . '/form', [
            $this->getSingularResourceName() => $item,
        ]);
    }

    /**
     * Guardar nuevo recurso con manejo de imágenes
     *
     * POST /empresas
     *
     * @param StoreEmpresaRequest $request Datos validados del formulario
     * @return RedirectResponse Redirección a índice con mensaje
     */
    public function store(StoreEmpresaRequest $request): RedirectResponse
    {
        // Validar datos mediante StoreEmpresaRequest
        $data = $request->validated();

        // Establecer campos booleanos por defecto
        $data['activo'] = $data['activo'] ?? true;
        $data['es_principal'] = $data['es_principal'] ?? false;

        // Procesar uploads de logos
        $data = $this->procesarLogos($request, $data);

        // Crear recurso
        $modelClass = $this->getModel();
        $modelClass::create($data);

        // Redirigir con mensaje de éxito
        return $this->redirectToIndexWithSuccess('creada');
    }

    /**
     * Actualizar recurso con manejo de imágenes
     *
     * PATCH /empresas/{id}
     * POST /empresas/{id} (FormData multipart)
     *
     * @param UpdateEmpresaRequest $request Datos validados del formulario
     * @param int|string $id ID del recurso a actualizar
     * @return RedirectResponse Redirección a índice con mensaje
     */
    public function update(UpdateEmpresaRequest $request, $id): RedirectResponse
    {
        // Validar datos mediante UpdateEmpresaRequest
        $data = $request->validated();

        // Obtener empresa existente
        $modelClass = $this->getModel();
        $empresa = $modelClass::findOrFail($id);

        // Procesar uploads de logos
        $data = $this->procesarLogos($request, $data, $empresa);

        // Actualizar recurso
        $empresa->update($data);

        // Limpiar cache si es empresa principal
        if ($empresa->es_principal) {
            \Illuminate\Support\Facades\Cache::forget('empresa_principal');
        }

        // Redirigir con mensaje de éxito
        return $this->redirectToIndexWithSuccess('actualizada');
    }

    /**
     * Procesar y guardar logos
     *
     * @param Request $request
     * @param array $data
     * @param Empresa|null $empresa Empresa existente (para borrar logos viejos)
     * @return array Datos con URLs de logos
     */
    private function procesarLogos(Request $request, array $data, ?Empresa $empresa = null): array
    {
        $tipos = ['principal', 'compacto', 'footer'];

        foreach ($tipos as $tipo) {
            $field = "logo_{$tipo}";

            if ($request->hasFile($field)) {
                // Eliminar logo anterior si existe
                if ($empresa && $empresa->$field) {
                    // Extraer la ruta relativa del logo anterior
                    $logoAnterior = $empresa->$field;
                    // Si es URL, extraer la parte relativa; si ya es relativa, usarla directa
                    if (strpos($logoAnterior, 'http') === 0) {
                        $path = str_replace(Storage::disk('public')->url(''), '', $logoAnterior);
                    } else {
                        $path = $logoAnterior;
                    }
                    // Limpiar la ruta
                    $path = ltrim($path, '/');
                    Storage::disk('public')->delete($path);
                }

                // Guardar nuevo logo
                $file = $request->file($field);
                $storagePath = $file->store('empresas', 'public');

                // Guardar solo la ruta relativa (sin dominio)
                // Formato: storage/empresas/nombre-archivo.png
                $data[$field] = '/storage/' . $storagePath;
            } else {
                // Si no hay archivo nuevo, mantener el anterior
                if ($empresa && isset($data[$field])) {
                    unset($data[$field]);
                }
            }
        }

        return $data;
    }
}
