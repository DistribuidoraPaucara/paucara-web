<?php

namespace App\Models\Traits;

use App\Models\EstadoLogistica;
use Illuminate\Support\Facades\Cache;

/**
 * Trait para gestionar estados logísticos en modelos
 *
 * Proporciona métodos helper para:
 * - Obtener estados por código y categoría
 * - Mapear entre códigos y IDs
 * - Cachear resultados para performance
 */
trait ManageEstadosLogisticos
{
    /**
     * Obtener un estado logístico por código y categoría
     *
     * @param string $codigo Ej: 'PENDIENTE_RETIRO'
     * @param string $categoria Ej: 'venta_logistica', 'proforma'
     * @return EstadoLogistica|null
     */
    public static function obtenerEstadoLogistico($codigo, $categoria)
    {
        return Cache::remember(
            "estado_logistico_{$codigo}_{$categoria}",
            now()->addHours(24), // Cache por 24 horas
            function () use ($codigo, $categoria) {
                return EstadoLogistica::where('codigo', $codigo)
                    ->where('categoria', $categoria)
                    ->first();
            }
        );
    }

    /**
     * Obtener ID de un estado logístico por código y categoría
     *
     * @param string $codigo
     * @param string $categoria
     * @return int|null
     */
    public static function obtenerIdEstado($codigo, $categoria)
    {
        $estado = self::obtenerEstadoLogistico($codigo, $categoria);
        return $estado?->id;
    }

    /**
     * Obtener código de estado desde su ID
     *
     * @param int $estadoId
     * @return string|null
     */
    public static function obtenerCodigoEstado($estadoId)
    {
        return Cache::remember(
            "estado_codigo_{$estadoId}",
            now()->addHours(24),
            function () use ($estadoId) {
                return EstadoLogistica::find($estadoId)?->codigo;
            }
        );
    }

    /**
     * Obtener todos los estados de una categoría
     *
     * @param string $categoria
     * @param bool $soloActivos
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function obtenerEstadosPorCategoria($categoria, $soloActivos = true)
    {
        $query = EstadoLogistica::where('categoria', $categoria);

        if ($soloActivos) {
            $query->where('activo', true);
        }

        return $query->orderBy('orden')->get();
    }

    /**
     * Validar que una transición de estado es permitida
     *
     * @param int $estadoActualId
     * @param int $estadoNuevoId
     * @param string $categoria
     * @return bool
     */
    public static function esTransicionValida($estadoActualId, $estadoNuevoId, $categoria)
    {
        // Si el estado es el mismo, es válido
        if ($estadoActualId === $estadoNuevoId) {
            return true;
        }

        // Verificar en transiciones_estado
        return \DB::table('transiciones_estado')
            ->where('estado_origen_id', $estadoActualId)
            ->where('estado_destino_id', $estadoNuevoId)
            ->where('categoria', $categoria)
            ->where('activa', true)
            ->exists();
    }

    /**
     * Obtener transiciones válidas desde un estado
     *
     * @param int $estadoId
     * @param string $categoria
     * @return \Illuminate\Support\Collection
     */
    public static function obtenerTransicionesValidas($estadoId, $categoria)
    {
        return \DB::table('transiciones_estado')
            ->where('estado_origen_id', $estadoId)
            ->where('categoria', $categoria)
            ->where('activa', true)
            ->pluck('estado_destino_id')
            ->toArray();
    }

    /**
     * Cambiar el estado y registrar en historial
     *
     * @param string $nuevoCodigoEstado
     * @param string $categoria
     * @param string|null $motivo
     * @return bool
     */
    public function cambiarEstado($nuevoCodigoEstado, $categoria, $motivo = null)
    {
        // Obtener el ID del nuevo estado
        $nuevoEstadoId = self::obtenerIdEstado($nuevoCodigoEstado, $categoria);

        if (!$nuevoEstadoId) {
            throw new \Exception("Estado no encontrado: {$nuevoCodigoEstado} ({$categoria})");
        }

        // Determinar el campo de FK según la entidad
        $campoPkActual = $this->obtenerCampoEstadoActual();
        if (!$campoPkActual) {
            throw new \Exception("No se puede determinar el campo de estado para esta entidad");
        }

        $estadoActualId = $this->{$campoPkActual};

        // ✅ Si el estado actual es null (primera vez), permitir transición
        // Si no es null, validar que sea una transición válida
        if ($estadoActualId !== null && !self::esTransicionValida($estadoActualId, $nuevoEstadoId, $categoria)) {
            throw new \Exception(
                "Transición inválida: de {$estadoActualId} a {$nuevoEstadoId} ({$categoria})"
            );
        }

        // Actualizar el estado
        $this->update([$campoPkActual => $nuevoEstadoId]);

        // Registrar en historial
        $this->registrarEnHistorialEstados(
            $estadoActualId,
            $nuevoEstadoId,
            $motivo
        );

        return true;
    }

    /**
     * Registrar cambio de estado en historial
     *
     * @param int|null $estadoAnteriorId
     * @param int $estadoNuevoId
     * @param string|null $motivo
     * @return void
     */
    protected function registrarEnHistorialEstados($estadoAnteriorId, $estadoNuevoId, $motivo = null)
    {
        // ✅ Registrar cambio de estado en historial
        // NOTA: historial_estados solo tiene 'created_at', no 'updated_at'
        \DB::table('historial_estados')->insert([
            'entidad_tipo' => $this->obtenerTipoEntidad(),
            'entidad_id' => $this->id,
            'estado_anterior_id' => $estadoAnteriorId,
            'estado_nuevo_id' => $estadoNuevoId,
            'usuario_id' => auth()->id(),
            'motivo' => $motivo,
            'observaciones' => null,
            'created_at' => now(),
            // NO incluir 'updated_at' - la tabla no la tiene
        ]);
    }

    /**
     * Obtener el tipo de entidad (para historial_estados)
     * Debe ser sobrescrito en cada modelo
     *
     * @return string
     */
    protected function obtenerTipoEntidad()
    {
        return class_basename(static::class);
    }

    /**
     * Obtener el campo de FK de estado actual
     * Debe ser sobrescrito en cada modelo según su campo FK
     *
     * @return string|null
     */
    protected function obtenerCampoEstadoActual()
    {
        // Valores por defecto, pueden ser sobrescritos
        if ($this instanceof \App\Models\Proforma) {
            return 'estado_proforma_id';
        }
        if ($this instanceof \App\Models\Venta) {
            return 'estado_logistico_id';
        }

        return null;
    }

    /**
     * Limpiar el caché de estados (útil después de cambios)
     *
     * @return void
     */
    public static function limpiarCacheEstados()
    {
        Cache::forget('estados_logistica_*');
    }
}
