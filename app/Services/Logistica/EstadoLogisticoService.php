<?php

namespace App\Services\Logistica;

use App\Models\EstadoLogistica;
use App\Models\HistorialEstado;
use App\Models\MapeoEstado;
use App\Models\TransicionEstado;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class EstadoLogisticoService
{
    protected EstadoLogisticoCacheService $cacheService;

    public function __construct(EstadoLogisticoCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    // ===== ESTADO QUERIES =====

    /**
     * Obtener todos los estados de una categoría
     */
    public function obtenerEstadosPorCategoria(string $categoria): Collection
    {
        return $this->cacheService->obtenerEstadosCacheados($categoria);
    }

    /**
     * Obtener un estado por código y categoría
     */
    public function obtenerEstadoPorCodigo(string $codigo, string $categoria): ?EstadoLogistica
    {
        return $this->obtenerEstadosPorCategoria($categoria)
            ->firstWhere('codigo', $codigo);
    }

    /**
     * Obtener un estado por ID
     */
    public function obtenerEstadoPorId(int $id): ?EstadoLogistica
    {
        return EstadoLogistica::find($id);
    }

    /**
     * Obtener todos los estados finales de una categoría
     */
    public function obtenerEstadosFinales(string $categoria): Collection
    {
        return $this->obtenerEstadosPorCategoria($categoria)
            ->filter(fn($e) => $e->es_estado_final);
    }

    // ===== TRANSICIONES =====

    /**
     * Validar si una transición es posible
     */
    public function validarTransicion(
        EstadoLogistica $origen,
        EstadoLogistica $destino
    ): bool {
        return $origen->puedeTransicionarA($destino);
    }

    /**
     * Obtener transiciones válidas desde un estado
     */
    public function obtenerTransicionesValidas(EstadoLogistica $estado): Collection
    {
        return $estado->obtenerTransicionesValidas();
    }

    /**
     * Obtener información detallada de transiciones
     */
    public function obtenerDetalleTransiciones(string $categoria, string $codigo): array
    {
        $estado = $this->obtenerEstadoPorCodigo($codigo, $categoria);

        if (!$estado) {
            return [];
        }

        return [
            'estado_actual' => [
                'id' => $estado->id,
                'codigo' => $estado->codigo,
                'nombre' => $estado->nombre,
            ],
            'transiciones_validas' => $estado->transicionesDesde()
                ->where('activa', true)
                ->with('estadoDestino')
                ->get()
                ->map(fn($t) => [
                    'id' => $t->estadoDestino->id,
                    'codigo' => $t->estadoDestino->codigo,
                    'nombre' => $t->estadoDestino->nombre,
                    'requiere_permiso' => $t->requiere_permiso,
                    'automatica' => $t->automatica,
                ]),
        ];
    }

    // ===== MAPPINGS =====

    /**
     * Mapear estado desde una categoría a otra
     * Retorna el estado destino equivalente
     */
    public function mapearEstado(
        string $categoriaOrigen,
        string $codigoOrigen,
        string $categoriaDestino
    ): ?EstadoLogistica {
        $estadoOrigen = $this->obtenerEstadoPorCodigo($codigoOrigen, $categoriaOrigen);

        if (!$estadoOrigen) {
            return null;
        }

        return MapeoEstado::mapear($estadoOrigen, $categoriaDestino);
    }

    /**
     * Obtener todos los mapeos desde un estado
     */
    public function obtenerMapeos(string $categoria, string $codigo, string $categoriaDestino): Collection
    {
        $estado = $this->obtenerEstadoPorCodigo($codigo, $categoria);

        if (!$estado) {
            return collect();
        }

        return MapeoEstado::obtenerMapeos($estado, $categoriaDestino)
            ->map(fn($m) => [
                'origen' => [
                    'codigo' => $m->estadoOrigen->codigo,
                    'nombre' => $m->estadoOrigen->nombre,
                ],
                'destino' => [
                    'codigo' => $m->estadoDestino->codigo,
                    'nombre' => $m->estadoDestino->nombre,
                ],
                'prioridad' => $m->prioridad,
            ]);
    }

    // ===== HISTORIAL & AUDITORÍA =====

    /**
     * Registrar cambio de estado
     */
    public function registrarCambioEstado(
        string $entidadTipo,
        int $entidadId,
        EstadoLogistica $estadoNuevo,
        ?int $usuarioId = null,
        ?string $motivo = null,
        ?array $metadatos = null
    ): HistorialEstado {
        // Obtener estado anterior (para auditoría)
        $estadoAnterior = $this->obtenerEstadoActual($entidadTipo, $entidadId);

        // Registrar en historial
        $historial = HistorialEstado::registrar(
            $entidadTipo,
            $entidadId,
            $estadoNuevo,
            $estadoAnterior,
            $usuarioId,
            $motivo,
            $metadatos
        );

        // Invalidar cache si es necesario
        $this->cacheService->invalidarCache($estadoNuevo->categoria);

        return $historial;
    }

    /**
     * Obtener el estado actual de una entidad
     */
    public function obtenerEstadoActual(string $entidadTipo, int $entidadId): ?EstadoLogistica
    {
        $table = match($entidadTipo) {
            'proforma' => 'proformas',
            'venta' => 'ventas',
            'entrega' => 'entregas',
            default => null,
        };

        if (!$table) {
            return null;
        }

        $estadoCodigo = DB::table($table)
            ->where('id', $entidadId)
            ->value('estado'); // Para proforma y entrega

        if (!$estadoCodigo) {
            $estadoCodigo = DB::table($table)
                ->where('id', $entidadId)
                ->value('estado_logistico'); // Para venta
        }

        if (!$estadoCodigo) {
            return null;
        }

        // Determinar categoría según tipo
        $categoria = match($entidadTipo) {
            'proforma' => 'proforma',
            'venta' => 'venta_logistica',
            'entrega' => 'entrega',
            default => null,
        };

        return $categoria ? $this->obtenerEstadoPorCodigo($estadoCodigo, $categoria) : null;
    }

    /**
     * Obtener historial de cambios de una entidad
     */
    public function obtenerHistorial(string $entidadTipo, int $entidadId, int $limite = 50): Collection
    {
        return HistorialEstado::obtenerHistorial($entidadTipo, $entidadId, $limite);
    }

    /**
     * Obtener estadísticas de uso de estados
     */
    public function obtenerEstadisticas(string $entidadTipo, string $categoria): array
    {
        $estados = $this->obtenerEstadosPorCategoria($categoria);

        return [
            'categoria' => $categoria,
            'total_estados' => $estados->count(),
            'estados_finales' => $estados->filter(fn($e) => $e->es_estado_final)->count(),
            'estados_editables' => $estados->filter(fn($e) => $e->permite_edicion)->count(),
            'estados' => $estados->map(fn($e) => [
                'codigo' => $e->codigo,
                'nombre' => $e->nombre,
                'es_final' => $e->es_estado_final,
                'permite_edicion' => $e->permite_edicion,
                'transiciones_validas' => $e->transicionesDesde()
                    ->where('activa', true)
                    ->count(),
            ]),
        ];
    }

    // ===== SINCRONIZACIÓN MULTI-ENTIDAD =====

    /**
     * Sincronizar múltiples estados relacionados (ej: entrega → venta)
     *
     * Se usa para mantener estados sincronizados cuando una entidad depende de otra
     */
    public function sincronizarEstadoRelacionado(
        string $entidadTipoOrigen,
        int $entidadIdOrigen,
        string $entidadTipoDestino,
        int $entidadIdDestino
    ): bool {
        try {
            // Obtener estado actual del origen
            $estadoActual = $this->obtenerEstadoActual($entidadTipoOrigen, $entidadIdOrigen);

            if (!$estadoActual) {
                return false;
            }

            // Determinar categoría destino
            $categoriaDestino = match($entidadTipoDestino) {
                'venta' => 'venta_logistica',
                'entrega' => 'entrega',
                'proforma' => 'proforma',
                default => null,
            };

            if (!$categoriaDestino) {
                return false;
            }

            // Mapear estado
            $estadoMapeado = $this->mapearEstado(
                $estadoActual->categoria,
                $estadoActual->codigo,
                $categoriaDestino
            );

            if (!$estadoMapeado) {
                return false;
            }

            // Actualizar en BD
            $table = match($entidadTipoDestino) {
                'venta' => 'ventas',
                'entrega' => 'entregas',
                'proforma' => 'proformas',
                default => null,
            };

            if (!$table) {
                return false;
            }

            $column = $entidadTipoDestino === 'venta' ? 'estado_logistico' : 'estado';

            return DB::table($table)
                ->where('id', $entidadIdDestino)
                ->update([$column => $estadoMapeado->codigo]);
        } catch (\Exception $e) {
            \Log::error("Error sincronizando estado: {$e->getMessage()}");

            return false;
        }
    }

    // ===== UTILITIES =====

    /**
     * Verificar si un código de estado es válido
     */
    public function esCodigoValido(string $codigo, string $categoria): bool
    {
        return $this->obtenerEstadoPorCodigo($codigo, $categoria) !== null;
    }

    /**
     * Obtener categorías disponibles
     */
    public function obtenerCategorias(): array
    {
        return EstadoLogistica::select('categoria')
            ->distinct()
            ->where('activo', true)
            ->pluck('categoria')
            ->toArray();
    }

    /**
     * Búsqueda fuzzy de estados
     */
    public function buscar(string $termino, ?string $categoria = null): Collection
    {
        $query = EstadoLogistica::where('activo', true)
            ->where(function ($q) use ($termino) {
                $q->where('codigo', 'ilike', "%{$termino}%")
                    ->orWhere('nombre', 'ilike', "%{$termino}%")
                    ->orWhere('descripcion', 'ilike', "%{$termino}%");
            });

        if ($categoria) {
            $query->where('categoria', $categoria);
        }

        return $query->orderBy('orden')->get();
    }
}
