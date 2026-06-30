<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\EstadoLogistica;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

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
     * Retorna el nombre singular del recurso
     */
    protected function getSingularResourceName(): string
    {
        return 'estadoLogistica';
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
     * Mostrar formulario de edición con todos los datos
     */
    public function edit($id): Response
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);

        Log::info('EstadoLogistica Edit - Datos cargados:', [
            'id' => $item->id,
            'codigo' => $item->codigo,
            'nombre' => $item->nombre,
            'categoria' => $item->categoria,
            'orden' => $item->orden,
            'descripcion' => $item->descripcion,
            'activo' => $item->activo,
            'es_estado_final' => $item->es_estado_final,
            'permite_edicion' => $item->permite_edicion,
            'requiere_aprobacion' => $item->requiere_aprobacion,
            'color' => $item->color,
            'icono' => $item->icono,
            'todos_los_datos' => $item->toArray(),
        ]);

        return inertia($this->getViewPath() . '/form', [
            $this->getSingularResourceName() => $item,
        ]);
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
        $activo = $request->input('activo');
        $esEstadoFinal = $request->input('es_estado_final');

        $items = $modelClass::query()
            // Filtro de búsqueda (case-insensitive)
            ->when($q !== '', function ($query) use ($q) {
                return $query->where(function ($q_inner) use ($q) {
                    $q_inner->whereRaw('LOWER(nombre) LIKE ?', ['%' . strtolower($q) . '%'])
                           ->orWhereRaw('LOWER(codigo) LIKE ?', ['%' . strtolower($q) . '%']);
                });
            })
            // Filtro de categoría (case-insensitive) - CRÍTICO
            ->when($categoria !== '', function ($query) use ($categoria) {
                // Usar where en lugar de whereRaw para mejor compatibilidad
                return $query->whereRaw('LOWER("categoria") = LOWER(?)', [$categoria]);
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
