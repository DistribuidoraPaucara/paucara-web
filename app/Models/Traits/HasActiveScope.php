<?php

namespace App\Models\Traits;

/**
 * HasActiveScope Trait - ÚNICA FUENTE DE VERDAD para scopes de estado activo
 *
 * Consolida el patrón repetido en 13+ modelos.
 * Proporciona scopes estándar para filtrar registros activos/inactivos.
 *
 * MODELOS QUE USAN ESTE TRAIT:
 * - Chofer, CodigoBarra, ConfiguracionGlobal, Empleado, Impuesto
 * - ModuloSidebar, PrecioProducto, Producto, TipoAjusteInventario
 * - TipoDocumento, TipoOperacion, TipoPrecio, Vehiculo
 *
 * USO:
 * ```php
 * use HasActiveScope;
 *
 * $modelos = Modelo::activos()->get();
 * $inactivos = Modelo::inactivos()->get();
 * ```
 */
trait HasActiveScope
{
    /**
     * Obtener el nombre del campo activo (soporta 'activo', 'activa' y 'estado')
     * Detecta automáticamente el campo correcto
     */
    protected function getActiveField(): string
    {
        // Detectar dinámicamente cuál campo se usa para "activo"
        $fillable = $this->getFillable();

        // Detectar si usa 'estado' (para Empleado y modelos similares que usan texto)
        if (in_array('estado', $fillable)) {
            return 'estado';
        }

        // Detectar si usa 'activa' (para modelos con genero femenino)
        if (in_array('activa', $fillable)) {
            return 'activa';
        }

        // Por defecto usar 'activo' (para modelos con genero masculino o neutro)
        return 'activo';
    }

    /**
     * Scope para obtener solo registros activos
     * Soporta campos: activo (boolean), activa (boolean), estado (text)
     *
     * Uso: Model::activos()->get()
     */
    public function scopeActivos($query)
    {
        $field = $this->getActiveField();

        // Si es campo 'estado', buscar valor 'activo'
        if ($field === 'estado') {
            return $query->where($this->getTable() . '.' . $field, 'activo');
        }

        // Si es 'activo' o 'activa', buscar boolean true
        return $query->where($this->getTable() . '.' . $field, true);
    }

    /**
     * Scope para obtener solo registros inactivos
     *
     * Uso: Model::inactivos()->get()
     */
    public function scopeInactivos($query)
    {
        $field = $this->getActiveField();

        // Si es campo 'estado', buscar valores que NO sean 'activo'
        if ($field === 'estado') {
            return $query->where($this->getTable() . '.' . $field, '!=', 'activo');
        }

        // Si es 'activo' o 'activa', buscar boolean false
        return $query->where($this->getTable() . '.' . $field, false);
    }

    /**
     * Alias para scopeActivos (compatibilidad con campo 'activa')
     */
    public function scopeActivas($query)
    {
        return $this->scopeActivos($query);
    }

    /**
     * Scope alternativo (alias de activos para compatibilidad)
     * Algunos modelos pueden usar 'estado' en lugar de 'activo'
     *
     * Uso: Model::donde_estado_es('activo')->get()
     */
    public function scopeConEstatoActivo($query)
    {
        return $this->scopeActivos($query);
    }

    /**
     * Verificar si el modelo está activo
     */
    public function estaActivo(): bool
    {
        $field = $this->getActiveField();

        if ($field === 'estado') {
            return $this->{$field} === 'activo';
        }

        return $this->{$field} === true;
    }

    /**
     * Verificar si el modelo está inactivo
     */
    public function estaInactivo(): bool
    {
        return !$this->estaActivo();
    }

    /**
     * Activar modelo
     */
    public function activar(): bool
    {
        $field = $this->getActiveField();

        if ($field === 'estado') {
            $this->{$field} = 'activo';
        } else {
            $this->{$field} = true;
        }

        return $this->save();
    }

    /**
     * Desactivar modelo
     */
    public function desactivar(): bool
    {
        $field = $this->getActiveField();

        if ($field === 'estado') {
            $this->{$field} = 'inactivo';
        } else {
            $this->{$field} = false;
        }

        return $this->save();
    }

    /**
     * Alternar estado activo/inactivo
     */
    public function alternarEstado(): bool
    {
        if ($this->estaActivo()) {
            return $this->desactivar();
        }

        return $this->activar();
    }
}
