<?php

namespace App\Http\Traits;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * Trait para controladores CRUD simple (Categorías, Marcas, Almacenes, etc.)
 *
 * Propósito: Centralizar la lógica repetitiva de CRUD para catálogos simples.
 * Elimina ~400 líneas de código duplicado en 5 controladores.
 *
 * Usado en:
 * - CategoriaController
 * - MarcaController
 * - AlmacenController
 * - UnidadMedidaController
 * - TipoPagoController
 *
 * Métodos CRUD implementados:
 * - index() : Listar con búsqueda y paginación
 * - create() : Mostrar formulario de creación
 * - store() : Guardar nuevo recurso
 * - edit() : Mostrar formulario de edición
 * - update() : Actualizar recurso
 * - destroy() : Eliminar recurso
 *
 * Métodos abstractos que DEBEN ser implementados por el controlador:
 * - getModel() : Retorna la clase del modelo (ej: Categoria::class)
 * - getRouteName() : Retorna el nombre de la ruta (ej: 'categorias')
 * - getViewPath() : Retorna el path de las vistas (ej: 'categorias')
 * - getResourceName() : Retorna el nombre del recurso (ej: 'categorias')
 * - getValidationRules() : Retorna las reglas de validación
 *
 * Ejemplo de uso:
 *
 * class CategoriaController extends Controller {
 *     use SimpleCrudController;
 *
 *     protected function getModel(): string {
 *         return Categoria::class;
 *     }
 *
 *     protected function getRouteName(): string {
 *         return 'categorias';
 *     }
 *
 *     protected function getViewPath(): string {
 *         return 'categorias';
 *     }
 *
 *     protected function getResourceName(): string {
 *         return 'categorias';
 *     }
 *
 *     protected function getValidationRules(): array {
 *         return [
 *             'nombre' => ['required', 'string', 'max:255'],
 *             'descripcion' => ['nullable', 'string'],
 *             'activo' => ['boolean'],
 *         ];
 *     }
 * }
 */
trait SimpleCrudController
{
    /**
     * MÉTODOS ABSTRACTOS - Implementar en el controlador
     */

    /**
     * Retorna la clase del modelo a usar
     *
     * Ejemplo: return Categoria::class;
     */
    abstract protected function getModel(): string;

    /**
     * Retorna el nombre base de las rutas
     *
     * Ejemplo: return 'categorias';
     * Usa: categorias.index, categorias.show, categorias.create, etc.
     */
    abstract protected function getRouteName(): string;

    /**
     * Retorna el path de las vistas
     *
     * Ejemplo: return 'categorias';
     * Usa: categorias/index, categorias/form, etc.
     */
    abstract protected function getViewPath(): string;

    /**
     * Retorna el nombre del recurso (variable en las vistas)
     *
     * Ejemplo: return 'categorias';
     * Usa: ['categorias' => $items, ...]
     */
    abstract protected function getResourceName(): string;

    /**
     * Retorna las reglas de validación
     *
     * Ejemplo:
     * return [
     *     'nombre' => ['required', 'string', 'max:255'],
     *     'descripcion' => ['nullable', 'string'],
     *     'activo' => ['boolean'],
     * ];
     */
    abstract protected function getValidationRules(): array;

    /**
     * =====================================================
     * MÉTODOS CRUD - Implementación genérica
     * =====================================================
     */

    /**
     * Listar recursos con búsqueda y paginación
     *
     * GET /categorias?q=busqueda
     *
     * @param Request $request
     * @return Response Vista de índice con recursos paginados
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = $request->string('q');

        // Construir query con búsqueda opcional
        $items = $modelClass::query()
            ->when($q, function ($query) use ($q, $modelClass) {
                // Usar searchByName scope si el modelo lo tiene
                if (method_exists($modelClass, 'searchByName')) {
                    return $query->searchByName($q);
                }
                // Fallback: búsqueda manual
                return $query->whereRaw('LOWER(nombre) like ?', ['%' . strtolower($q) . '%']);
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
     * Mostrar formulario de creación
     *
     * GET /categorias/create
     *
     * @return Response Vista del formulario vacío
     */
    public function create(): Response
    {
        return inertia($this->getViewPath() . '/form', [
            $this->getSingularResourceName() => null,
        ]);
    }

    /**
     * Guardar nuevo recurso
     *
     * POST /categorias
     *
     * @param Request $request Datos validados del formulario
     * @return RedirectResponse Redirección a índice con mensaje
     */
    public function store(Request $request): RedirectResponse
    {
        // Validar datos
        $data = $request->validate($this->getValidationRules());

        // Establecer campos booleanos por defecto
        if (isset($this->getValidationRules()['activo'])) {
            $data['activo'] = $data['activo'] ?? true;
        }

        // Crear recurso
        $modelClass = $this->getModel();
        $modelClass::create($data);

        // Redirigir con mensaje de éxito
        return $this->redirectToIndexWithSuccess('creada');
    }

    /**
     * Mostrar formulario de edición
     *
     * GET /categorias/{id}/edit
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
     * Actualizar recurso
     *
     * PATCH /categorias/{id}
     *
     * @param Request $request Datos validados del formulario
     * @param int|string $id ID del recurso a actualizar
     * @return RedirectResponse Redirección a índice con mensaje
     */
    public function update(Request $request, $id): RedirectResponse
    {
        // Validar datos
        $data = $request->validate($this->getValidationRules());

        // Actualizar recurso
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);
        $item->update($data);

        // Redirigir con mensaje de éxito
        return $this->redirectToIndexWithSuccess('actualizada');
    }

    /**
     * Eliminar recurso
     *
     * DELETE /categorias/{id}
     *
     * @param int|string $id ID del recurso a eliminar
     * @return RedirectResponse Redirección a índice con mensaje
     */
    public function destroy($id): RedirectResponse
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);
        $itemName = isset($item->nombre) ? $item->nombre : "#$id";

        try {
            $item->delete();

            // Redirigir con mensaje de éxito
            return $this->redirectToIndexWithSuccess('eliminada');
        } catch (\Illuminate\Database\QueryException $e) {
            // Detectar si es una violación de clave foránea
            if (strpos($e->getMessage(), 'FOREIGN KEY') !== false ||
                strpos($e->getMessage(), 'foreign key') !== false ||
                $e->getCode() == '23503') {

                $errorMessage = "{$this->getSingularResourceNameText()} \"{$itemName}\" está siendo usado en otras partes del sistema y no puede ser eliminado.";

                // Extraer información de qué tabla tiene la relación (si es posible)
                if (strpos($e->getMessage(), 'transferencia_inventarios') !== false) {
                    $errorMessage .= " Aún hay transferencias vinculadas.";
                } elseif (strpos($e->getMessage(), 'movimientos_inventario') !== false) {
                    $errorMessage .= " Aún hay movimientos de inventario vinculados.";
                } elseif (strpos($e->getMessage(), 'stock_productos') !== false) {
                    $errorMessage .= " Aún hay stock de productos en este almacén.";
                }

                return redirect()
                    ->back()
                    ->with('error', $errorMessage);
            }

            // Si es otro tipo de error, lanzarlo
            throw $e;
        }
    }

    /**
     * =====================================================
     * HELPERS INTERNOS
     * =====================================================
     */

    /**
     * Obtener el nombre singular del recurso
     *
     * 'categorias' → 'categoria'
     * 'almacenes' → 'almacen'
     * 'unidades' → 'unidad'
     *
     * @return string Nombre singular
     */
    protected function getSingularResourceName(): string
    {
        $plural = $this->getResourceName();

        // Mapa de plurales a singulares en español
        $singularMap = [
            'almacenes' => 'almacen',
            'categorias' => 'categoria',
            'marcas' => 'marca',
            'unidades' => 'unidad',
            'tipos_pago' => 'tipo_pago',
            'tipos_documento' => 'tipo_documento',
            'clientes' => 'cliente',
            'empleados' => 'empleado',
            'proveedores' => 'proveedor',
            'productos' => 'producto',
            'ventas' => 'venta',
            'compras' => 'compra',
            'sectores' => 'sector',
        ];

        // Si está en el mapa, usar el singular correspondiente
        if (isset($singularMap[$plural])) {
            return $singularMap[$plural];
        }

        // Fallback: quitar 's' final si no está en el mapa
        return rtrim($plural, 's');
    }

    /**
     * Obtener el nombre singular del recurso en formato texto legible
     *
     * 'categoria' → 'Categoría'
     * 'almacen' → 'Almacén'
     * 'unidad' → 'Unidad'
     *
     * @return string Nombre singular capitalizado
     */
    protected function getSingularResourceNameText(): string
    {
        $singular = $this->getSingularResourceName();
        return ucfirst(strtolower($singular));
    }

    /**
     * Redirigir al índice con mensaje de éxito
     *
     * @param string $action Acción realizada ('creada', 'actualizada', 'eliminada')
     * @return RedirectResponse
     */
    protected function redirectToIndexWithSuccess(string $action): RedirectResponse
    {
        return redirect()
            ->route($this->getRouteName() . '.index')
            ->with('success', "{$this->getSingularResourceNameText()} {$action} exitosamente");
    }
}
