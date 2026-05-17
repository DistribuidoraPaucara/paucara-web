import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { StockFilterOptions } from '@/domain/entities/reportes';

const ALL_VALUE = 'all';

interface FilterState {
  almacen_id: string;
  categoria_id: string;
  stock_bajo: boolean;
  stock_alto: boolean;
  busqueda: string;
}

/**
 * Hook para manejar filtros del reporte de stock actual
 * @param initialFilters - Filtros iniciales desde el servidor
 * @param onNavigate - Callback opcional cuando se navega (para testing)
 * @returns Estado y manejadores de filtros
 */
export function useStockActualFilters(
  initialFilters: StockFilterOptions = {},
  onNavigate?: (params: Record<string, string>) => void
) {
  const [formData, setFormData] = useState<FilterState>({
    almacen_id: initialFilters.almacen_id?.toString() || ALL_VALUE,
    categoria_id: initialFilters.categoria_id?.toString() || ALL_VALUE,
    stock_bajo: initialFilters.stock_bajo || false,
    stock_alto: initialFilters.stock_alto || false,
    busqueda: initialFilters.busqueda || '',
  });

  /**
   * Maneja el filtrado de datos
   * Limpia valores "all" y envía parámetros al servidor
   */
  const handleFilter = () => {
    const paramsRaw = { ...formData } as Record<string, string | boolean>;

    // Eliminar valores "all"
    if (paramsRaw.almacen_id === ALL_VALUE) delete paramsRaw.almacen_id;
    if (paramsRaw.categoria_id === ALL_VALUE) delete paramsRaw.categoria_id;

    // Convertir booleanos a string y filtrar valores vacíos
    const params = Object.fromEntries(
      Object.entries(paramsRaw)
        .filter(([, v]) => v !== '' && v !== false)
        .map(([k, v]) => [k, String(v)])
    );

    console.log('📊 handleFilter - formData:', formData);
    console.log('📊 handleFilter - params finales:', params);

    if (onNavigate) {
      onNavigate(params);
    } else {
      router.get('/reportes/inventario/stock-actual', params, { preserveScroll: true });
    }
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    setFormData({
      almacen_id: ALL_VALUE,
      categoria_id: ALL_VALUE,
      stock_bajo: false,
      stock_alto: false,
      busqueda: '',
    });

    if (onNavigate) {
      onNavigate({});
    } else {
      router.get('/reportes/inventario/stock-actual', {}, { preserveScroll: true });
    }
  };

  /**
   * Actualiza un campo individual del formulario
   */
  const updateField = (key: string, value: string | boolean) => {
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
