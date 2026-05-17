import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { PreciosFilterOptions } from '@/domain/entities/reportes';

const ALL_VALUE = 'all';

interface FilterState {
  fecha_desde: string;
  fecha_hasta: string;
  tipo_precio_id: string;
  categoria_id: string;
}

/**
 * Hook para manejar filtros del reporte de precios
 * @param initialFilters - Filtros iniciales desde el servidor
 * @param onNavigate - Callback opcional cuando se navega (para testing)
 * @returns Estado y manejadores de filtros
 */
export function usePreciosFilters(
  initialFilters: PreciosFilterOptions = {},
  onNavigate?: (params: Record<string, string>) => void
) {
  const [formData, setFormData] = useState<FilterState>({
    fecha_desde: initialFilters.fecha_desde || '',
    fecha_hasta: initialFilters.fecha_hasta || '',
    tipo_precio_id: initialFilters.tipo_precio_id?.toString() || ALL_VALUE,
    categoria_id: initialFilters.categoria_id?.toString() || ALL_VALUE,
  });

  /**
   * Maneja el filtrado de datos
   * Limpia valores "all" y envía parámetros al servidor
   */
  const handleFilter = () => {
    const paramsRaw = { ...formData } as Record<string, string>;

    // Eliminar valores "all"
    if (paramsRaw.tipo_precio_id === ALL_VALUE) delete paramsRaw.tipo_precio_id;
    if (paramsRaw.categoria_id === ALL_VALUE) delete paramsRaw.categoria_id;

    // Eliminar valores vacíos
    const params = Object.fromEntries(
      Object.entries(paramsRaw).filter(([, v]) => v !== '')
    );

    if (onNavigate) {
      onNavigate(params);
    } else {
      router.get('/reportes/precios', params);
    }
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    setFormData({
      fecha_desde: '',
      fecha_hasta: '',
      tipo_precio_id: ALL_VALUE,
      categoria_id: ALL_VALUE,
    });

    if (onNavigate) {
      onNavigate({});
    } else {
      router.get('/reportes/precios');
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

  /**
   * Obtiene los parámetros de URL para exportar
   */
  const getExportParams = (): Record<string, string> => {
    const paramsRaw = { ...formData } as Record<string, string>;
    if (paramsRaw.tipo_precio_id === ALL_VALUE) delete paramsRaw.tipo_precio_id;
    if (paramsRaw.categoria_id === ALL_VALUE) delete paramsRaw.categoria_id;
    return Object.fromEntries(
      Object.entries(paramsRaw).filter(([, v]) => v !== '')
    );
  };

  return {
    formData,
    setFormData,
    handleFilter,
    clearFilters,
    updateField,
    updateFields,
    getExportParams,
    ALL_VALUE,
  };
}
