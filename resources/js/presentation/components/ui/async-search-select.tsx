// Components: AsyncSearchSelect - SearchSelect con búsqueda en servidor
import { useState } from 'react';
import SearchSelect, { type SelectOption } from '@/presentation/components/ui/search-select';

interface AsyncSearchSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string | number | '';
  onChange: (value: string | number | '') => void;
  searchEndpoint: string; // URL del endpoint de búsqueda
  initialOptions?: SelectOption[];
  minSearchLength?: number;
  debounceMs?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  allowClear?: boolean;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
}

export default function AsyncSearchSelect({
  searchEndpoint,
  initialOptions = [],
  minSearchLength = 2,
  ...props
}: AsyncSearchSelectProps) {
  const [options, setOptions] = useState<SelectOption[]>(initialOptions);
  const [loading, setLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState('');

  // Función para realizar búsqueda en el servidor
  const handleSearch = async (query: string) => {
    console.log('🔍 [AsyncSearchSelect] Búsqueda iniciada:', { query, minSearchLength });

    if (query.length < minSearchLength) {
      console.log('⚠️ [AsyncSearchSelect] Query muy corta, limpiando opciones');
      setOptions(initialOptions);
      return;
    }

    if (query === lastSearch) {
      console.log('ℹ️ [AsyncSearchSelect] Misma búsqueda anterior, ignorando');
      return;
    }

    setLoading(true);
    try {
      const url = `${searchEndpoint}?q=${encodeURIComponent(query)}`;
      console.log('📡 [AsyncSearchSelect] Enviando petición a:', url);

      const response = await fetch(url);
      console.log('📥 [AsyncSearchSelect] Status HTTP:', response.status, response.statusText);

      const result = await response.json();
      console.log('📦 [AsyncSearchSelect] Respuesta del servidor:', result);

      // Manejar respuesta envuelta { success, data } o array directo
      const items = result.data || result;
      console.log('📋 [AsyncSearchSelect] Items extraídos:', items);
      console.log('✅ [AsyncSearchSelect] ¿Es array?:', Array.isArray(items));

      const searchOptions: SelectOption[] = (Array.isArray(items) ? items : []).map((item: { id: string | number; nombre: string; descripcion?: string }) => ({
        value: item.id,
        label: item.nombre,
        description: item.descripcion || undefined,
      }));

      console.log('🎯 [AsyncSearchSelect] Opciones procesadas:', searchOptions);
      setOptions(searchOptions);
      setLastSearch(query);
    } catch (error) {
      console.error('❌ [AsyncSearchSelect] Error en búsqueda:', error);
      console.error('📍 Stack:', (error as Error).stack);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchSelect
      {...props}
      options={options}
      onSearch={handleSearch}
      loading={loading}
      emptyText={loading ? "Buscando..." : "No se encontraron resultados"}
    />
  );
}
