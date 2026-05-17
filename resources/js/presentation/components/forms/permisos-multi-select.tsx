import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Permiso {
    id: number;
    value: string;
    label: string;
}

interface PermisosMultiSelectProps {
    value?: string[];
    onChange: (permisos: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

export function PermisosMultiSelect({
    value = [],
    onChange,
    placeholder = 'Seleccionar permisos...',
    disabled = false,
    error,
}: PermisosMultiSelectProps) {
    const [permisos, setPermisos] = useState<Permiso[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Cargar permisos disponibles
    useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const response = await fetch('/api/modulos-sidebar/permisos/disponibles');
                if (!response.ok) throw new Error('Error al cargar permisos');
                const data = await response.json();
                setPermisos(data);
            } catch (err) {
                console.error('Error fetching permisos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPermisos();
    }, []);

    // Filtrar permisos según búsqueda
    const filteredPermisos = permisos.filter(p =>
        p.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Manejar selección/deselección
    const handleTogglePermiso = useCallback((permisoValue: string) => {
        onChange(
            value.includes(permisoValue)
                ? value.filter(p => p !== permisoValue)
                : [...value, permisoValue]
        );
    }, [value, onChange]);

    // Manejar eliminación rápida de un permiso
    const handleRemovePermiso = (permisoValue: string) => {
        onChange(value.filter(p => p !== permisoValue));
    };

    // Obtener permisos seleccionados con su label
    const selectedPermisos = value
        .map(v => permisos.find(p => p.value === v))
        .filter(Boolean) as Permiso[];

    if (loading) {
        return <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />;
    }

    return (
        <div className="w-full relative">
            <div
                className={cn(
                    'w-full min-h-10 px-3 py-2 rounded-md border bg-white dark:bg-gray-950',
                    'transition-colors duration-200 ease-out',
                    error
                        ? 'border-red-500 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-700',
                    disabled && 'opacity-50 cursor-not-allowed',
                    !disabled && 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-600'
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {/* Permisos seleccionados como badges */}
                <div className="flex flex-wrap gap-2 mb-1">
                    {selectedPermisos.length > 0 ? (
                        selectedPermisos.map(permiso => (
                            <div
                                key={permiso.value}
                                className={cn(
                                    'inline-flex items-center gap-1 px-2 py-1 rounded-md',
                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                                    'text-xs font-medium'
                                )}
                            >
                                <span>{permiso.label}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemovePermiso(permiso.value);
                                        }}
                                        className="ml-1 hover:opacity-70 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400 py-1">
                            {placeholder}
                        </span>
                    )}
                </div>

                {/* Icono de chevron */}
                <ChevronDown
                    className={cn(
                        'absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-transform duration-300',
                        isOpen && 'rotate-180',
                        'text-gray-500 dark:text-gray-400'
                    )}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                    {/* Buscador */}
                    <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar permisos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    'w-full pl-7 pr-3 py-2 rounded-md border',
                                    'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700',
                                    'text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                )}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Lista de permisos */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredPermisos.length > 0 ? (
                            filteredPermisos.map(permiso => (
                                <button
                                    key={permiso.value}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTogglePermiso(permiso.value);
                                    }}
                                    className={cn(
                                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                                        'transition-colors duration-150 ease-out',
                                        value.includes(permiso.value)
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'h-4 w-4 rounded border flex items-center justify-center flex-shrink-0',
                                            value.includes(permiso.value)
                                                ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                        )}
                                    >
                                        {value.includes(permiso.value) && (
                                            <Check className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    <span className="flex-1">{permiso.label}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No se encontraron permisos
                            </div>
                        )}
                    </div>

                    {/* Footer con acciones */}
                    {selectedPermisos.length > 0 && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange([]);
                                }}
                                className={cn(
                                    'flex-1 px-3 py-1.5 rounded-md text-sm font-medium',
                                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                                    'hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                                )}
                            >
                                Limpiar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        </div>
    );
}
