// Modern Filters Component for Generic Tables
import React, { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchSelect from '@/presentation/components/ui/search-select';
import { useEntitySelect } from '@/presentation/hooks/use-search-select';
import type { FilterField, IndexFiltersConfig } from '@/domain/entities/generic';
import type { Filters } from '@/domain/entities/shared';

interface ModernFiltersProps {
    config: IndexFiltersConfig;
    currentFilters: Filters;
    onApplyFilters: (filters: Filters) => void;
    onResetFilters: () => void;
    extraData?: Record<string, unknown>;
    isLoading?: boolean;
    className?: string;
}

export default function ModernFilters({
    config,
    currentFilters,
    onApplyFilters,
    onResetFilters,
    extraData,
    className
}: ModernFiltersProps) {
    const [filters, setFilters] = React.useState<Filters>(currentFilters);
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = React.useState(false); // 🆕 Siempre empiezan cerrados
    const [searchQuery, setSearchQuery] = React.useState<string>(String(currentFilters.q || ''));

    // ✅ Debounce para búsqueda en tiempo real
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Prepare SearchSelect data for specific filters
    const categoriasData = React.useMemo(() => {
        return (extraData?.categorias as { id: number; nombre: string }[]) || [];
    }, [extraData?.categorias]);

    const marcasData = React.useMemo(() => {
        return (extraData?.marcas as { id: number; nombre: string }[]) || [];
    }, [extraData?.marcas]);

    const localidadesData = React.useMemo(() => {
        return (extraData?.localidades as { id: number; nombre: string; codigo: string }[]) || [];
    }, [extraData?.localidades]);

    const categoriasSelect = useEntitySelect(categoriasData);
    const marcasSelect = useEntitySelect(marcasData);
    const localidadesSelect = useEntitySelect(localidadesData);

    // Sync local state with external filters
    React.useEffect(() => {
        setFilters(currentFilters);
        setSearchQuery(String(currentFilters.q || ''));
    }, [currentFilters]);

    const handleFilterChange = useCallback((key: string, value: string | number | boolean | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' || value === '' ? undefined : value
        }));
    }, []);

    // ✅ Búsqueda en tiempo real con debounce
    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);

        // Limpiar timeout anterior
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Nuevo timeout con debounce de 300ms
        searchTimeoutRef.current = setTimeout(() => {
            console.log('🔍 [ModernFilters] Búsqueda en tiempo real:', {
                query,
                filtros_activos: Object.keys(filters).filter(k => filters[k] && k !== 'order_by' && k !== 'order_dir')
            });

            const filtrosParaBusqueda = {
                ...Object.fromEntries(
                    Object.entries(filters).filter(([key, value]) =>
                        key !== 'q' && value !== '' && value != null
                    )
                ),
                q: query
            };
            onApplyFilters(filtrosParaBusqueda);
        }, 300); // Debounce de 300ms
    }, [filters, onApplyFilters]);

    // Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const aplicarFiltros = useCallback(() => {
        const filtrosLimpios = Object.fromEntries(
            Object.entries({ ...filters, q: searchQuery }).filter(([, value]) => value !== '' && value != null)
        );
        onApplyFilters(filtrosLimpios);
    }, [filters, searchQuery, onApplyFilters]);

    const limpiarFiltros = useCallback(() => {
        setFilters({});
        setSearchQuery('');
        onResetFilters();
    }, [onResetFilters]);

    const busquedaRapida = (e: React.FormEvent) => {
        e.preventDefault();
        const filtrosParaBusqueda = {
            ...Object.fromEntries(
                Object.entries(filters).filter(([key, value]) =>
                    key !== 'q' && value !== '' && value != null
                )
            ),
            q: searchQuery
        };
        onApplyFilters(filtrosParaBusqueda);
    };

    const hayFiltrosActivos = Object.values({ ...filters, q: searchQuery }).some(value =>
        value !== '' && value != null
    );

    // Contar filtros activos (sin incluir búsqueda rápida)
    const contadorFiltrosActivos = Object.entries(filters).filter(([key, value]) =>
        key !== 'q' && key !== 'order_by' && key !== 'order_dir' && value !== '' && value != null
    ).length;

    const renderFilterField = (field: FilterField) => {
        const value = filters[field.key];
        const fieldId = `filter-${field.key}`;

        switch (field.type) {
            case 'select': {
                const options = field.extraDataKey
                    ? (extraData?.[field.extraDataKey] as { id: number; nombre: string }[]) || []
                    : field.options || [];

                // Use SearchSelect for categoria_id, marca_id, and localidad_id
                const shouldUseSearchSelect = field.extraDataKey &&
                    (field.key === 'categoria_id' || field.key === 'marca_id' || field.key === 'localidad_id') &&
                    Array.isArray(options) && options.length > 0;

                if (shouldUseSearchSelect) {
                    let searchSelectOptions: Array<{ value: string | number; label: string; description?: string }>;

                    if (field.key === 'categoria_id') {
                        searchSelectOptions = categoriasSelect.filteredOptions;
                    } else if (field.key === 'marca_id') {
                        searchSelectOptions = marcasSelect.filteredOptions;
                    } else if (field.key === 'localidad_id') {
                        searchSelectOptions = localidadesSelect.filteredOptions;
                    } else {
                        searchSelectOptions = [];
                    }

                    return (
                        <div key={field.key}>
                            <Label htmlFor={fieldId} className="text-sm font-medium">
                                {field.label}
                            </Label>
                            <SearchSelect
                                id={fieldId}
                                placeholder={field.placeholder}
                                value={value ? String(value) : ''}
                                options={searchSelectOptions}
                                onChange={(val) => handleFilterChange(field.key, val)}
                                allowClear={true}
                                emptyText={`No hay ${field.label.toLowerCase()} disponibles`}
                            />
                        </div>
                    );
                }

                // Standard Select for other cases
                return (
                    <div key={field.key}>
                        <Label htmlFor={fieldId} className="text-sm font-medium">
                            {field.label}
                        </Label>
                        <SearchSelect
                            id={fieldId}
                            placeholder={field.placeholder}
                            value={value ? String(value) : ''}
                            options={field.extraDataKey ?
                                (options as { id: number; nombre: string }[]).map(opt => ({
                                    value: opt.id,
                                    label: opt.nombre
                                })) :
                                field.options?.map(opt => ({
                                    value: opt.value,
                                    label: opt.label
                                })) || []
                            }
                            onChange={(val) => handleFilterChange(field.key, val)}
                            allowClear={true}
                            emptyText={`No hay ${field.label.toLowerCase()} disponibles`}
                        />
                    </div>
                );
            }

            case 'boolean': {
                return (
                    <div key={field.key}>
                        <Label htmlFor={fieldId} className="text-sm font-medium">
                            {field.label}
                        </Label>
                        <SearchSelect
                            id={fieldId}
                            placeholder={field.placeholder}
                            value={value !== undefined ? String(value) : ''}
                            options={[
                                { value: '1', label: 'Activos' },
                                { value: '0', label: 'Inactivos' },
                            ]}
                            onChange={(val) => handleFilterChange(field.key, val)}
                            allowClear={true}
                            emptyText="No hay estados disponibles"
                        />
                    </div>
                );
            }

            case 'text':
            case 'number': {
                return (
                    <div key={field.key}>
                        <Label htmlFor={fieldId} className="text-sm font-medium">
                            {field.label}
                        </Label>
                        <Input
                            id={fieldId}
                            type={field.type}
                            value={String(value || '')}
                            onChange={(e) => handleFilterChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            min={field.type === 'number' ? '0' : undefined}
                        />
                    </div>
                );
            }

            case 'date': {
                return (
                    <div key={field.key}>
                        <Label htmlFor={fieldId} className="text-sm font-medium">
                            {field.label}
                        </Label>
                        <Input
                            id={fieldId}
                            type="date"
                            value={String(value || '')}
                            onChange={(e) => handleFilterChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                        />
                    </div>
                );
            }

            default:
                return null;
        }
    };

    // Opciones de ordenamiento
    const opcionesOrden = config.sortOptions || [
        { value: 'created_at', label: 'Fecha de creación' },
        { value: 'id', label: 'ID' },
    ];

    return (
        <div className={cn('bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4 shadow-sm', className)}>
            {/* Búsqueda en tiempo real */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 h-4 w-4 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Buscar en tiempo real..."
                            value={searchQuery}
                            onChange={e => handleSearchChange(e.target.value)}
                            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => handleSearchChange('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                    className={cn(
                        'relative transition-all duration-200',
                        mostrarFiltrosAvanzados
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-md'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                >
                    <Filter className={cn(
                        "h-4 w-4 mr-2 transition-transform duration-200",
                        mostrarFiltrosAvanzados && "rotate-180"
                    )} />
                    Filtros
                    {contadorFiltrosActivos > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg animate-pulse">
                            {contadorFiltrosActivos}
                        </span>
                    )}
                </Button>
                {hayFiltrosActivos && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={limpiarFiltros}
                        className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Filtros avanzados */}
            {mostrarFiltrosAvanzados && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {config.filters.map(field => renderFilterField(field))}
                    </div>

                    {/* Ordenamiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="sort_by" className="text-sm font-medium">
                                Ordenar por
                            </Label>
                            <SearchSelect
                                id="sort_by"
                                placeholder="Campo de ordenamiento"
                                value={String(filters.order_by || opcionesOrden[0]?.value || 'id')}
                                options={opcionesOrden}
                                onChange={value => handleFilterChange('order_by', String(value))}
                                allowClear={false}
                            />
                        </div>

                        <div>
                            <Label htmlFor="sort_dir" className="text-sm font-medium">
                                Dirección
                            </Label>
                            <SearchSelect
                                id="sort_dir"
                                placeholder="Dirección"
                                value={String(filters.order_dir || 'desc')}
                                options={[
                                    { value: 'asc', label: 'Ascendente' },
                                    { value: 'desc', label: 'Descendente' },
                                ]}
                                onChange={value => handleFilterChange('order_dir', String(value))}
                                allowClear={false}
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setMostrarFiltrosAvanzados(false)}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            onClick={aplicarFiltros}
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            )}

            {/* Indicadores de filtros activos */}
            {hayFiltrosActivos && !mostrarFiltrosAvanzados && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Filter className="h-3.5 w-3.5" />
                        Activos:
                    </div>
                    {searchQuery && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm">
                            <Search className="h-3 w-3" />
                            <span className="font-semibold">Búsqueda:</span>
                            <span className="font-normal">{searchQuery}</span>
                        </span>
                    )}
                    {Object.entries(filters).map(([key, value]) => {
                        if (value === undefined || value === null || value === '' || key === 'order_by' || key === 'order_dir') return null;
                        const field = config.filters.find(f => f.key === key);
                        if (!field) return null;

                        let displayValue = String(value);
                        let badgeColor = 'from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-200 dark:border-emerald-700';

                        // Mostrar nombres en lugar de IDs para selects
                        if (field.type === 'select' && field.extraDataKey) {
                            const options = extraData?.[field.extraDataKey] as { id: number; nombre: string }[];
                            const option = options?.find(opt => opt.id === Number(value));
                            displayValue = option?.nombre || displayValue;
                            badgeColor = 'from-purple-100 to-purple-200 text-purple-800 border-purple-300 dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-200 dark:border-purple-700';
                        } else if (field.type === 'boolean') {
                            displayValue = value === '1' ? 'Activos' : 'Inactivos';
                            badgeColor = value === '1'
                                ? 'from-green-100 to-green-200 text-green-800 border-green-300 dark:from-green-900/40 dark:to-green-800/40 dark:text-green-200 dark:border-green-700'
                                : 'from-red-100 to-red-200 text-red-800 border-red-300 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-200 dark:border-red-700';
                        } else if (field.type === 'date') {
                            badgeColor = 'from-amber-100 to-amber-200 text-amber-800 border-amber-300 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-200 dark:border-amber-700';
                        } else if (field.type === 'number') {
                            badgeColor = 'from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300 dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-200 dark:border-cyan-700';
                        }

                        return (
                            <span
                                key={key}
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r border shadow-sm transition-all hover:shadow-md",
                                    badgeColor
                                )}
                            >
                                <span className="font-semibold">{field.label}:</span>
                                <span className="font-normal">{displayValue}</span>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
