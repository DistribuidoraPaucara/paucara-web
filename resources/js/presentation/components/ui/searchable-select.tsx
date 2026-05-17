import React, { useState, useMemo } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { X, Search } from 'lucide-react';

interface SearchableSelectProps<T extends { id: number | string; [key: string]: any }> {
    value: string;
    onValueChange: (value: string) => void;
    items: T[];
    placeholder?: string;
    searchPlaceholder?: string;
    renderOption: (item: T) => React.ReactNode;
    searchFields?: (keyof T)[];
    disabled?: boolean;
}

/**
 * SelectSearch - Componente Select con búsqueda integrada
 *
 * Permite buscar/filtrar opciones escribiendo mientras está abierto
 *
 * @example
 * <SearchableSelect
 *   value={entregaId}
 *   onValueChange={setEntregaId}
 *   items={entregas}
 *   placeholder="Selecciona entrega..."
 *   searchFields={['numero_entrega', 'chofer']}
 *   renderOption={(entrega) => (
 *     <>{entrega.numero_entrega} - {entrega.chofer?.nombre}</>
 *   )}
 * />
 */
export function SearchableSelect<T extends { id: number | string; [key: string]: any }>({
    value,
    onValueChange,
    items,
    placeholder = 'Selecciona...',
    searchPlaceholder = 'Buscar...',
    renderOption,
    searchFields = ['id', 'nombre'],
    disabled = false,
}: SearchableSelectProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Filtrar items basado en el término de búsqueda
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return items;

        const lowerSearch = searchTerm.toLowerCase();

        return items.filter((item) => {
            // Buscar en todos los campos especificados
            return searchFields.some((field) => {
                const fieldValue = item[field];
                if (fieldValue === null || fieldValue === undefined) return false;

                // Si es un objeto, convertir a string
                const stringValue =
                    typeof fieldValue === 'object'
                        ? JSON.stringify(fieldValue).toLowerCase()
                        : String(fieldValue).toLowerCase();

                return stringValue.includes(lowerSearch);
            });
        });
    }, [searchTerm, items, searchFields]);

    const selectedItem = items.find((item) => String(item.id) === value);

    return (
        <div className="w-full space-y-2">
            <Select value={value} onValueChange={onValueChange} open={isOpen} onOpenChange={setIsOpen} disabled={disabled}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="w-full min-w-fit">
                    {/* Campo de búsqueda */}
                    <div className="p-2 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-950 z-50">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 h-8 text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Items filtrados */}
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                                {renderOption(item)}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            {items.length === 0 ? (
                                <span>No hay opciones disponibles</span>
                            ) : (
                                <span>No se encontraron resultados para "{searchTerm}"</span>
                            )}
                        </div>
                    )}
                </SelectContent>
            </Select>

            {/* Info adicional del item seleccionado */}
            {selectedItem && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    ✓ Seleccionado: <span className="font-medium">{renderOption(selectedItem)}</span>
                </div>
            )}
        </div>
    );
}
