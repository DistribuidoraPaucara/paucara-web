// Components: SearchSelect - Componente de select con búsqueda reutilizable
import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SearchSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string | number | '';
  options: SelectOption[];
  onChange: (value: string | number | '') => void;
  onSearch?: (query: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  allowClear?: boolean;
  loading?: boolean;
  maxHeight?: number;
}

export default function SearchSelect({
  id,
  label,
  placeholder = "Seleccione una opción",
  value,
  options = [],
  onChange,
  onSearch,
  disabled = false,
  required = false,
  error,
  emptyText = "No se encontraron opciones",
  searchPlaceholder = "Buscar...",
  className = "",
  renderOption,
  allowClear = true,
  loading = false,
  maxHeight = 200
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones basado en la búsqueda
  // IMPORTANTE: Si onSearch está presente, el servidor ya filtra las opciones
  // No hacer filtrado local para evitar duplicar la lógica
  const filteredOptions = useMemo(() => {
    // Si hay búsqueda en servidor, NO filtrar localmente
    if (onSearch) {
      console.log('🌐 [SearchSelect] Búsqueda en servidor activa, NO filtrar localmente:', { totalOpciones: options.length });
      return options;
    }

    // Filtrado local solo si NO hay búsqueda en servidor
    if (!searchQuery.trim()) {
      console.log('🔓 [SearchSelect] searchQuery vacío, retornando todas las opciones:', options);
      return options;
    }

    const query = searchQuery.toLowerCase();
    const filtered = options.filter(option =>
      (option.label?.toLowerCase() ?? '').includes(query) ||
      (option.description?.toLowerCase() ?? '').includes(query)
    );
    console.log('🔎 [SearchSelect] Filtrando localmente:', { searchQuery, totalOpciones: options.length, filtradas: filtered.length });
    console.log('   Opciones originales:', options);
    console.log('   Opciones filtradas:', filtered);
    return filtered;
  }, [options, searchQuery, onSearch]);

  // Encontrar la opción seleccionada
  const selectedOption = useMemo(() => {
    // console.log('SearchSelect Debug:', { value, options: options.slice(0, 3), valueType: typeof value });
    const found = options.find(option => String(option.value) === String(value));
    // console.log('Selected option found:', found);
    return found;
  }, [options, value]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    // Usar mousedown para detectar clicks más rápidamente
    document.addEventListener('mousedown', handleClickOutside);
    // También agregar touchstart para dispositivos móviles
    document.addEventListener('touchstart', handleClickOutside as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, []);

  // Manejar búsqueda externa (para casos de búsqueda en servidor)
  useEffect(() => {
    if (onSearch && searchQuery) {
      const timeoutId = setTimeout(() => {
        onSearch(searchQuery);
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, onSearch]);

  // Enfocar input cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      console.log('🔘 [SearchSelect] Toggle:', { currentIsOpen: isOpen, willBe: !isOpen, totalOpciones: options.length });
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
      }
    }
  };

  const handleSelect = (option: SelectOption) => {
    console.log('✅ [SearchSelect] Seleccionando:', option);
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1 && !filteredOptions[0].disabled) {
        handleSelect(filteredOptions[0]);
      }
    }
  };

  const defaultRenderOption = (option: SelectOption, isSelected: boolean) => (
    <div className={`flex flex-col py-1.5 px-3 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''}`}>
      <span className="font-medium text-xs text-foreground">{option.label}</span>
      {option.description && (
        <span className="text-xs text-muted-foreground">{option.description}</span>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <div
        className={`
          relative flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md cursor-pointer
          transition-colors duration-200 min-h-[36px]
          ${disabled
            ? 'bg-muted text-muted-foreground/70 cursor-not-allowed border-border'
            : isOpen
              ? 'border-ring ring-2 ring-ring/30'
              : error
                ? 'border-destructive hover:border-destructive'
                : 'border-input hover:border-ring bg-background'
          }
          ${label ? 'pt-3' : ''}
        `}
        onClick={handleToggle}
      >
        {label && (
          <label
            htmlFor={id}
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${selectedOption || isOpen
                ? 'top-[-6px] text-xs font-medium text-primary'
                : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
              }`}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}

        <span className={`${label ? 'w-full' : ''} ${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
          {selectedOption ? selectedOption.label : label ? '' : placeholder}
        </span>

        <div className="flex items-center gap-0.5">
          {allowClear && selectedOption && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-muted rounded-full"
              onClick={handleClear}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}

          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          {console.log('📂 [SearchSelect] Renderizando dropdown abierto:', { filteredOptions, loading })}
          <div className="absolute z-50 w-full mt-0.5 bg-popover text-popover-foreground border border-border rounded-md shadow-lg">
            {/* Search Input with Close Button */}
            <div className="p-1.5 border-b border-border flex gap-1.5 items-center">
              <Input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 text-xs flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-muted rounded-md flex-shrink-0"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                title="Cerrar"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Options List */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs">Cargando...</span>
                  </div>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-2 text-center text-muted-foreground text-xs">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    className={`
                    cursor-pointer transition-colors duration-150
                    ${option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-muted'
                      }
                  `}
                    onClick={() => handleSelect(option)}
                  >
                    {renderOption
                      ? renderOption(option, option.value === value)
                      : defaultRenderOption(option, option.value === value)
                    }
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-0.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
