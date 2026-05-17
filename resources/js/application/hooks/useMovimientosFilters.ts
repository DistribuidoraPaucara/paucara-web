import { useState } from 'react';
import type { MovimientosFilterOptions } from '@/domain/entities/reportes';

const ALL_VALUE = 'all';

interface FilterState {
  fecha_inicio: string;
  fecha_fin: string;
  tipo: string;
  almacen_id: string;
}

/**
 * Hook para manejar filtros de reportes de movimientos de inventario
 * @param initialFilters - Filtros iniciales desde el servidor
 * @param onNavigate - Callback opcional cuando se navega (para testing)
 * @returns Estado y manejadores de filtros
 */
export function useMovimientosFilters(
  initialFilters: MovimientosFilterOptions = {},
  onNavigate?: (params: Record<string, string>) => void
) {
  const [formData, setFormData] = useState<FilterState>({
    fecha_inicio: initialFilters.fecha_inicio || '',
    fecha_fin: initialFilters.fecha_fin || '',
    tipo: initialFilters.tipo || ALL_VALUE,
    almacen_id: initialFilters.almacen_id?.toString() || ALL_VALUE,
  });

  /**
   * Maneja el filtrado de datos
   * Limpia valores "all" y envía parámetros al servidor
   */
  const handleFilter = () => {
    const paramsRaw = { ...formData } as Record<string, string>;

    // Eliminar valores "all"
    if (paramsRaw.tipo === ALL_VALUE) delete paramsRaw.tipo;
    if (paramsRaw.almacen_id === ALL_VALUE) delete paramsRaw.almacen_id;

    // Eliminar valores vacíos
    const params = Object.fromEntries(
      Object.entries(paramsRaw).filter(([, v]) => v !== '')
    );

    if (onNavigate) {
      onNavigate(params);
    } else {
      window.location.href = `/reportes/inventario/movimientos?${new URLSearchParams(params).toString()}`;
    }
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    setFormData({
      fecha_inicio: '',
      fecha_fin: '',
      tipo: ALL_VALUE,
      almacen_id: ALL_VALUE,
    });

    if (onNavigate) {
      onNavigate({});
    } else {
      window.location.href = '/reportes/inventario/movimientos';
    }
  };

  /**
   * Actualiza un campo individual del formulario
   */
  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Actualiza múltiples campos a la vez
   */
  const updateFields = (updates: Partial<FilterState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    setFormData,
    handleFilter,
    clearFilters,
    updateField,
    updateFields,
    ALL_VALUE,
  };
}
