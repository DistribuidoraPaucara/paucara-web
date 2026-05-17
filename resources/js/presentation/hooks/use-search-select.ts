// Hooks: useSearchSelect - Hook para manejar la lógica de búsqueda en selects
import { useState, useMemo } from 'react';
import type { SelectOption } from '@/presentation/components/ui/search-select';

interface UseSearchSelectOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  valueField: keyof T;
  labelField: keyof T;
  descriptionField?: keyof T;
  initialSearch?: string;
  minSearchLength?: number;
}

export function useSearchSelect<T extends Record<string, unknown>>({
  data,
  searchFields,
  valueField,
  labelField,
  descriptionField,
  initialSearch = '',
  minSearchLength = 0
}: UseSearchSelectOptions<T>) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);

  // Convertir datos a opciones de select
  const options: SelectOption[] = useMemo(() => {
    return data.map(item => ({
      value: item[valueField] as string | number,
      label: String(item[labelField] || ''),
      description: descriptionField ? String(item[descriptionField] || '') : undefined,
    }));
  }, [data, valueField, labelField, descriptionField]);

  // Filtrar opciones basado en la búsqueda local
  const filteredOptions: SelectOption[] = useMemo(() => {
    if (!searchQuery || searchQuery.length < minSearchLength) {
      return options;
    }

    const query = searchQuery.toLowerCase();
    return options.filter(option => {
      // Buscar en label
      if (option.label.toLowerCase().includes(query)) {
        return true;
      }

      // Buscar en description si existe
      if (option.description && option.description.toLowerCase().includes(query)) {
        return true;
      }

      // Buscar en campos específicos del objeto original
      const originalItem = data.find(item => item[valueField] === option.value);
      if (originalItem) {
        return searchFields.some(field => {
          const fieldValue = String(originalItem[field] || '').toLowerCase();
          return fieldValue.includes(query);
        });
      }

      return false;
    });
  }, [options, searchQuery, minSearchLength, data, searchFields, valueField]);

  // Función para búsqueda externa (API)
  const handleExternalSearch = async (query: string, searchFn: (query: string) => Promise<T[]>) => {
    if (query.length < minSearchLength) return;

    setIsLoading(true);
    try {
      const results = await searchFn(query);
      // Los resultados se manejarían actualizando el prop `data` desde el componente padre
      return results;
    } catch (error) {
      console.error('Error en búsqueda externa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    options,
    filteredOptions,
    isLoading,
    setIsLoading,
    handleExternalSearch,
  };
}

// Hook específico para las entidades comunes del sistema
export function useEntitySelect<T extends { id: number; nombre: string }>(
  entities: T[],
  options?: Partial<UseSearchSelectOptions<T>>
) {
  return useSearchSelect({
    data: entities,
    searchFields: ['nombre' as keyof T],
    valueField: 'id' as keyof T,
    labelField: 'nombre' as keyof T,
    minSearchLength: 0,
    ...options,
  });
}
