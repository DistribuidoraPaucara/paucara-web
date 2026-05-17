// Components: MultiSelect - Componente de select múltiple con búsqueda
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

interface MultiSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: (string | number)[];
  options: SelectOption[];
  onChange: (values: (string | number)[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  loading?: boolean;
  maxHeight?: number;
  maxSelected?: number;
}

export default function MultiSelect({
  id,
  label,
  placeholder = "Seleccione opciones",
  value = [],
  options = [],
  onChange,
  disabled = false,
  required = false,
  error,
  emptyText = "No se encontraron opciones",
  searchPlaceholder = "Buscar...",
  className = "",
  loading = false,
  maxHeight = 200,
  maxSelected
}: MultiSelectProps) {
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

  // Obtener opciones seleccionadas
  const selectedOptions = useMemo(() => {
    return options.filter(option => value.includes(option.value));
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

    const isSelected = value.includes(option.value);
    let newValue: (string | number)[];

    if (isSelected) {
      // Deseleccionar
      newValue = value.filter(v => v !== option.value);
    } else {
      // Seleccionar (verificar límite)
      if (maxSelected && value.length >= maxSelected) {
        return; // No permitir más selecciones
      }
      newValue = [...value, option.value];
    }

    onChange(newValue);
  };

  const handleRemove = (valueToRemove: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== valueToRemove);
    onChange(newValue);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

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
          relative flex items-start justify-between w-full px-3 py-2 text-sm border rounded-md cursor-pointer
          transition-colors duration-200 min-h-[42px]
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
        <div className="flex-1 flex flex-wrap gap-1 items-center min-h-[20px]">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="px-2 py-0.5 text-xs flex items-center gap-1"
              >
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))
          )}
        </div>

        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {selectedOptions.length > 0 && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-muted rounded-full"
              onClick={handleClearAll}
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <svg
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
              filteredOptions.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isDisabled = option.disabled || (maxSelected !== undefined && value.length >= maxSelected && !isSelected);

                return (
                  <div
                    key={`${option.value}-${index}`}
                    className={`
                      flex items-center gap-2 py-2 px-3 transition-colors duration-150
                      ${isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-muted'
                      }
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                    onClick={() => handleSelect(option)}
                  >
                    {/* Checkbox */}
                    <div className={`
                      w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                      ${isSelected
                        ? 'bg-primary border-primary'
                        : 'border-input bg-background'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {/* Option Content */}
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm text-foreground">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground mt-0.5">{option.description}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer con contador */}
          {selectedOptions.length > 0 && (
            <div className="p-2 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {selectedOptions.length} seleccionado{selectedOptions.length !== 1 ? 's' : ''}
                {maxSelected && ` de ${maxSelected} máximo`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
