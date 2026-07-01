<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\EstadoDocumento;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

/**
 * EstadosDocumentoController - CRUD de Estados de Documento
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * ✅ FILTROS: Soporta búsqueda y otros filtros case-insensitive
 * ✅ TRANSICIONES: Soporta estado_anterior_id y estado_siguiente_id
 * Gestiona estados de documentos (proforma, venta, compra), colores e iconos
 */
class EstadosDocumentoController extends Controller
{
    use SimpleCrudController;

    /**
     * Retorna el modelo a usar
     */
    protected function getModel(): string
    {
        return EstadoDocumento::class;
    }

    /**
     * Retorna el nombre de las rutas
     */
    protected function getRouteName(): string
    {
        return 'estados-documento';
    }

    /**
     * Retorna el path de las vistas
     */
    protected function getViewPath(): string
    {
        return 'estados-documento';
    }

    /**
     * Retorna el nombre del recurso
     */
    protected function getResourceName(): string
    {
        return 'estadosDocumento';
    }

    /**
     * Retorna el nombre singular del recurso
     */
    protected function getSingularResourceName(): string
    {
        return 'estadoDocumento';
    }

    /**
     * Retorna las reglas de validación
     */
    protected function getValidationRules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:50'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'activo' => ['boolean'],
            'permite_edicion' => ['boolean'],
            'permite_anulacion' => ['boolean'],
            'es_estado_final' => ['boolean'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icono' => ['nullable', 'string', 'max:50'],
            'estado_anterior_id' => ['nullable', 'exists:estados_documento,id'],
            'estado_siguiente_id' => ['nullable', 'exists:estados_documento,id'],
        ];
    }

    /**
     * Mostrar formulario de creación
     */
    public function create(): Response
    {
        // Obtener todos los estados disponibles para los selects
        $modelClass = $this->getModel();
        $todosLosEstados = $modelClass::where('activo', true)
            ->orderBy('nombre')
            ->get();

        Log::info('EstadoDocumento Create - Cargando formulario', [
            'estados_disponibles' => $todosLosEstados->count(),
        ]);

        return inertia($this->getViewPath() . '/form', [
            'estadosDocumento' => $todosLosEstados,
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit($id): Response
    {
        $modelClass = $this->getModel();
        $item = $modelClass::findOrFail($id);

        // Obtener todos los estados disponibles para los selects
        $todosLosEstados = $modelClass::where('activo', true)
            ->orderBy('nombre')
            ->get();

        Log::info('EstadoDocumento Edit - Datos cargados:', [
            'id' => $item->id,
            'codigo' => $item->codigo,
            'nombre' => $item->nombre,
            'color' => $item->color,
            'icono' => $item->icono,
            'estado_anterior_id' => $item->estado_anterior_id,
            'estado_siguiente_id' => $item->estado_siguiente_id,
            'estados_disponibles' => $todosLosEstados->count(),
        ]);

        return inertia($this->getViewPath() . '/form', [
            $this->getSingularResourceName() => $item,
            'estadosDocumento' => $todosLosEstados,
        ]);
    }

    /**
     * Listar con filtros avanzados: búsqueda, estado, etc.
     */
    public function index(Request $request): Response
    {
        $modelClass = $this->getModel();
        $q = (string) $request->string('q', '');
        $activo = $request->input('activo');
        $esEstadoFinal = $request->input('es_estado_final');

        Log::info('EstadosDocumento Index - Parámetros recibidos:', [
            'q' => $q,
            'activo' => $activo,
            'es_estado_final' => $esEstadoFinal,
        ]);

        $query = $modelClass::query();

        // Filtro de búsqueda (case-insensitive)
        if (strlen($q) > 0) {
            $query->where(function ($sub) use ($q) {
                $sub->whereRaw('LOWER(nombre) LIKE ?', ['%' . strtolower($q) . '%'])
                    ->orWhereRaw('LOWER(codigo) LIKE ?', ['%' . strtolower($q) . '%']);
            });
        }

        // Filtro de activo
        if ($activo !== null && $activo !== '') {
            $activo = filter_var($activo, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $query->where('activo', $activo);
            }
        }

        // Filtro de estado final
        if ($esEstadoFinal !== null && $esEstadoFinal !== '') {
            $esEstadoFinal = filter_var($esEstadoFinal, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($esEstadoFinal !== null) {
                $query->where('es_estado_final', $esEstadoFinal);
            }
        }

        $items = $query
            ->orderBy('nombre', 'asc')
            ->paginate(10)
            ->withQueryString();

        Log::info('EstadosDocumento Index - Resultados:', [
            'total' => $items->total(),
            'count' => $items->count(),
        ]);

        return inertia($this->getViewPath() . '/index', [
            $this->getResourceName() => $items,
            'filters' => [
                'q' => $q,
                'activo' => $activo,
                'es_estado_final' => $esEstadoFinal,
            ],
        ]);
    }
}
