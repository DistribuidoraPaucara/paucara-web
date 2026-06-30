<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\EstadoLogistica;
use Illuminate\Http\Request;
use Inertia\Response;

/**
 * EstadosLogisticaController - CRUD de Estados de Logística
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * ✅ FILTROS: Soporta categoría y otros filtros case-insensitive
 * Gestiona estados de logística, categorías, transiciones y visualización
 */
class EstadosLogisticaController extends Controller
{
    use SimpleCrudController;

    /**
     * Retorna el modelo a usar
     */
    protected function getModel(): string
    {
        return EstadoLogistica::class;
    }

    /**
     * Retorna el nombre de las rutas
     */
    protected function getRouteName(): string
    {
        return 'estados-logistica';
    }

    /**
     * Retorna el path de las vistas
     */
    protected function getViewPath(): string
    {
        return 'estados-logistica';
    }

    /**
     * Retorna el nombre del recurso
     */
    protected function getResourceName(): string
    {
        return 'estadosLogistica';
    }

    /**
     * Retorna las reglas de validación
     */
    protected function getValidationRules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:50'],
            'categoria' => ['required', 'string', 'max:50'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'activo' => ['boolean'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icono' => ['nullable', 'string', 'max:50'],
            'es_estado_final' => ['boolean'],
            'permite_edicion' => ['boolean'],
            'requiere_aprobacion' => ['boolean'],
            'metadatos' => ['nullable', 'json'],
        ];
    }

    /**
     * Listar con filtros avanzados: búsqueda, categoría, estado, etc.
     * Soporta: ?q=busqueda&categoria=venta_logistica&activo=true&es_estado_final=false
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = $request->string('q');
        $categoria = $request->string('categoria');
        $activo = $request->input('activo'); // puede ser true, false, o null
        $esEstadoFinal = $request->input('es_estado_final');

        $items = $modelClass::query()
            // Filtro de búsqueda (case-insensitive)
            ->when($q, function ($query) use ($q) {
                return $query->whereRaw('LOWER(nombre) like ?', ['%' . strtolower($q) . '%'])
                            ->orWhereRaw('LOWER(codigo) like ?', ['%' . strtolower($q) . '%']);
            })
            // Filtro de categoría (case-insensitive)
            ->when($categoria, function ($query) use ($categoria) {
                return $query->whereRaw('LOWER(categoria) = ?', [strtolower($categoria)]);
            })
            // Filtro de activo
            ->when($activo !== null && $activo !== '', function ($query) use ($activo) {
                $activo = filter_var($activo, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                return $query->where('activo', $activo);
            })
            // Filtro de estado final
            ->when($esEstadoFinal !== null && $esEstadoFinal !== '', function ($query) use ($esEstadoFinal) {
                $esEstadoFinal = filter_var($esEstadoFinal, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                return $query->where('es_estado_final', $esEstadoFinal);
            })
            ->orderBy('categoria', 'asc')
            ->orderBy('orden', 'asc')
            ->paginate(10)
            ->withQueryString();

        return inertia($this->getViewPath() . '/index', [
            $this->getResourceName() => $items,
            'filters' => [
                'q' => $q,
                'categoria' => $categoria,
                'activo' => $activo,
                'es_estado_final' => $esEstadoFinal,
            ],
        ]);
    }
}
