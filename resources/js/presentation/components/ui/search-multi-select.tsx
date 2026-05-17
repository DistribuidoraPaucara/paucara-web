// Components: SearchMultiSelect - Componente de select múltiple con búsqueda
import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Badge } from '@/presentation/components/ui/badge';
import { X } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SearchMultiSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: Array<string | number>;
  options: SelectOption[];
  onChange: (value: Array<string | number>) => void;
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
  maxSelections?: number;
}

export default function SearchMultiSelect({
  id,
  label,
  placeholder = "Seleccione opciones",
  value = [],
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
  maxHeight = 200,
  maxSelections
}: SearchMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones basado en la búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Encontrar las opciones seleccionadas
  const selectedOptions = useMemo(() => {
    return options.filter(option =>
      value.includes(String(option.value)) || value.includes(Number(option.value))
    );
  }, [options, value]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
      }
    }
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    const stringValue = String(option.value);
    const isSelected = value.some(v => String(v) === stringValue);

    if (isSelected) {
      // Deseleccionar
      onChange(value.filter(v => String(v) !== stringValue));
    } else {
      // Seleccionar si no se ha alcanzado el límite
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, option.value]);
      }
    }
  };

  const handleRemove = (optionValue: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const stringValue = String(optionValue);
    onChange(value.filter(v => String(v) !== stringValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const isSelected = (option: SelectOption): boolean => {
    return value.some(v => String(v) === String(option.value));
  };

  const defaultRenderOption = (option: SelectOption, selected: boolean) => (
    <div className={`flex items-center gap-3 py-2 px-3 ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      {/* Checkbox */}
      <div className={`
        flex items-center justify-center h-4 w-4 border-2 rounded
        ${selected
          ? 'bg-primary border-primary'
          : 'border-input bg-background'
        }
      `}>
        {selected && (
          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Label y descripción */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-medium text-sm text-foreground truncate">{option.label}</span>
        {option.description && (
          <span className="text-xs text-muted-foreground truncate">{option.description}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <Label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Trigger Button */}
      <div
        className={`
          relative flex flex-wrap items-center gap-1 w-full px-3 py-2 text-sm border rounded-md cursor-pointer
          transition-colors duration-200 min-h-[38px]
          ${disabled
            ? 'bg-muted text-muted-foreground/70 cursor-not-allowed border-border'
            : isOpen
              ? 'border-ring ring-2 ring-ring/30'
              : error
                ? 'border-destructive hover:border-destructive'
                : 'border-input hover:border-ring bg-background'
          }
        `}
        onClick={handleToggle}
      >
        {/* Selected Items as Badges */}
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="pl-2 pr-1 py-0 h-6 text-xs flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate max-w-[150px]">{option.label}</span>
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                    onClick={(e) => handleRemove(option.value, e)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground flex-1">
            {placeholder}
          </span>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {allowClear && selectedOptions.length > 0 && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-muted rounded-full"
              onClick={handleClearAll}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}

          <svg
            className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <Input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
            />
          </div>

          {/* Selection Counter */}
          {(selectedOptions.length > 0 || maxSelections) && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30">
              {selectedOptions.length} seleccionado{selectedOptions.length !== 1 ? 's' : ''}
              {maxSelections && ` de ${maxSelections} máximo`}
            </div>
          )}

          {/* Options List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Cargando...</span>
                </div>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground text-sm">
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
                    ${maxSelections && value.length >= maxSelections && !isSelected(option)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }
                  `}
                  onClick={() => handleSelect(option)}
                >
                  {renderOption
                    ? renderOption(option, isSelected(option))
                    : defaultRenderOption(option, isSelected(option))
                  }
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
