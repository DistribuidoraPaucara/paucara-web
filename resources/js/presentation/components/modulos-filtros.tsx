import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { cn } from '@/lib/utils';

export interface FiltrosModulo {
    busqueda: string;
    tipo: 'todos' | 'principal' | 'submenu';
    estado: 'todos' | 'activo' | 'inactivo';
    categoria: string;
    rolRequerido: string;
}

interface ModulosFiltrosProps {
    categorias: string[];
    rolesDisponibles?: string[];
    filtros: FiltrosModulo;
    onChange: (filtros: FiltrosModulo) => void;
    totalResultados: number;
    totalModulos: number;
}

export function ModulosFiltros({
    categorias,
    rolesDisponibles = [],
    filtros,
    onChange,
    totalResultados,
    totalModulos,
}: ModulosFiltrosProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleBusquedaChange = useCallback(
        (valor: string) => {
            onChange({
                ...filtros,
                busqueda: valor,
            });
        },
        [filtros, onChange]
    );

    const handleTipoChange = useCallback(
        (valor: string) => {
            onChange({
                ...filtros,
                tipo: valor as FiltrosModulo['tipo'],
            });
        },
        [filtros, onChange]
    );

    const handleEstadoChange = useCallback(
        (valor: string) => {
            onChange({
                ...filtros,
                estado: valor as FiltrosModulo['estado'],
            });
        },
        [filtros, onChange]
    );

    const handleCategoriaChange = useCallback(
        (valor: string) => {
            onChange({
                ...filtros,
                categoria: valor,
            });
        },
        [filtros, onChange]
    );

    const handleRolChange = useCallback(
        (valor: string) => {
            onChange({
                ...filtros,
                rolRequerido: valor,
            });
        },
        [filtros, onChange]
    );

    const handleLimpiar = useCallback(() => {
        onChange({
            busqueda: '',
            tipo: 'todos',
            estado: 'todos',
            categoria: '',
            rolRequerido: '',
        });
        setIsExpanded(false);
    }, [onChange]);

    const tieneActivos =
        filtros.busqueda ||
        filtros.tipo !== 'todos' ||
        filtros.estado !== 'todos' ||
        filtros.categoria ||
        filtros.rolRequerido;

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda principal */}
            <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        placeholder="Buscar módulo por título o ruta..."
                        value={filtros.busqueda}
                        onChange={(e) => handleBusquedaChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="whitespace-nowrap"
                >
                    {isExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    {tieneActivos && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                            {[
                                filtros.busqueda ? 1 : 0,
                                filtros.tipo !== 'todos' ? 1 : 0,
                                filtros.estado !== 'todos' ? 1 : 0,
                                filtros.categoria ? 1 : 0,
                                filtros.rolRequerido ? 1 : 0,
                            ].reduce((a, b) => a + b, 0)}
                        </span>
                    )}
                </Button>
            </div>

            {/* Filtros expandibles */}
            {isExpanded && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Filtro por tipo */}
                        <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                Tipo
                            </label>
                            <Select value={filtros.tipo} onValueChange={handleTipoChange}>
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="principal">Principal</SelectItem>
                                    <SelectItem value="submenu">Submódulo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por estado */}
                        <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                Estado
                            </label>
                            <Select value={filtros.estado} onValueChange={handleEstadoChange}>
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por categoría */}
                        {categorias.length > 0 && (
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                    Categoría
                                </label>
                                <Select value={filtros.categoria || ""} onValueChange={handleCategoriaChange}>
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map(cat => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Filtro por rol requerido */}
                        {rolesDisponibles.length > 0 && (
                            <div>
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                    Rol Requerido
                                </label>
                                <Select value={filtros.rolRequerido || ""} onValueChange={handleRolChange}>
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Ninguno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolesDisponibles.map(rol => (
                                            <SelectItem key={rol} value={rol}>
                                                {rol}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Botón para limpiar filtros */}
                    {tieneActivos && (
                        <div className="flex gap-2 pt-2 border-t border-gray-300 dark:border-gray-700">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLimpiar}
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpiar Filtros
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Información de resultados */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                    {totalResultados} de {totalModulos} módulos
                    {tieneActivos && (
                        <span className="ml-2 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                            Filtrado
                        </span>
                    )}
                </div>
                {totalResultados === 0 && tieneActivos && (
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                        No se encontraron módulos que coincidan
                    </span>
                )}
            </div>
        </div>
    );
}
