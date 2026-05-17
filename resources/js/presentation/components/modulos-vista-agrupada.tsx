import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/lib/utils';

interface Modulo {
    id: number;
    titulo: string;
    ruta: string;
    icono?: string;
    descripcion?: string;
    orden: number;
    activo: boolean;
    es_submenu: boolean;
    modulo_padre_id?: number;
    categoria?: string;
    submodulos_count: number;
    padre?: {
        id: number;
        titulo: string;
    };
    permisos?: string[];
}

interface ModulosVistaAgrupadadProps {
    modulos: Modulo[];
    categorias: string[];
    onEdit: (modulo: Modulo) => void;
    onDelete: (modulo: Modulo) => void;
    onToggleActivo: (modulo: Modulo) => void;
    procesando: boolean;
}

export function ModulosVistaAgrupada({
    modulos,
    categorias,
    onEdit,
    onDelete,
    onToggleActivo,
    procesando,
}: ModulosVistaAgrupadadProps) {
    const [expandedCategorias, setExpandedCategorias] = useState<Set<string>>(
        new Set(categorias)
    );
    const [expandedModulos, setExpandedModulos] = useState<Set<number>>(new Set());

    // Agrupar módulos por categoría
    const modulosAgrupados = useMemo(() => {
        const grupos: Record<string, Modulo[]> = {};

        // Inicializar grupos vacíos para todas las categorías
        categorias.forEach(cat => {
            grupos[cat] = [];
        });
        grupos['sin-categoria'] = [];

        // Distribuir módulos en sus categorías
        modulos.forEach(modulo => {
            if (modulo.categoria) {
                if (!grupos[modulo.categoria]) {
                    grupos[modulo.categoria] = [];
                }
                grupos[modulo.categoria].push(modulo);
            } else {
                grupos['sin-categoria'].push(modulo);
            }
        });

        // Ordenar módulos dentro de cada grupo
        Object.keys(grupos).forEach(cat => {
            grupos[cat].sort((a, b) => a.orden - b.orden);
        });

        return grupos;
    }, [modulos, categorias]);

    const toggleCategoriaExpanded = (categoria: string) => {
        setExpandedCategorias(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoria)) {
                newSet.delete(categoria);
            } else {
                newSet.add(categoria);
            }
            return newSet;
        });
    };

    const toggleModuloExpanded = (moduloId: number) => {
        setExpandedModulos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduloId)) {
                newSet.delete(moduloId);
            } else {
                newSet.add(moduloId);
            }
            return newSet;
        });
    };

    const toggleTodasCategorias = (expandir: boolean) => {
        if (expandir) {
            setExpandedCategorias(new Set(Object.keys(modulosAgrupados)));
        } else {
            setExpandedCategorias(new Set());
        }
    };

    const todasExpandidas = expandedCategorias.size === Object.keys(modulosAgrupados).length;

    return (
        <div className="space-y-4">
            {/* Barra de control */}
            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTodasCategorias(!todasExpandidas)}
                    className="text-xs"
                >
                    {todasExpandidas ? 'Colapsar Todo' : 'Expandir Todo'}
                </Button>
            </div>

            {/* Grupos de categorías */}
            <div className="space-y-3">
                {Object.entries(modulosAgrupados).map(([categoria, modulosEnCategoria]) => {
                    const isExpanded = expandedCategorias.has(categoria);
                    const tituloCategoria =
                        categoria === 'sin-categoria' ? 'Sin Categoría' : categoria;
                    const iconoCategoria = categoria === 'sin-categoria' ? '📁' : '📂';

                    // No mostrar grupos vacíos
                    if (modulosEnCategoria.length === 0) {
                        return null;
                    }

                    return (
                        <div
                            key={categoria}
                            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                        >
                            {/* Encabezado de categoría */}
                            <button
                                onClick={() => toggleCategoriaExpanded(categoria)}
                                className={cn(
                                    'w-full px-4 py-3 flex items-center justify-between transition-colors',
                                    isExpanded
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                )}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <ChevronRight
                                        className={cn(
                                            'h-5 w-5 flex-shrink-0 transition-transform text-gray-600 dark:text-gray-400',
                                            isExpanded && 'rotate-90'
                                        )}
                                    />
                                    <span className="text-lg">{iconoCategoria}</span>
                                    <div className="text-left min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {tituloCategoria}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {modulosEnCategoria.length}{' '}
                                            {modulosEnCategoria.length === 1 ? 'módulo' : 'módulos'}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="flex-shrink-0 ml-2">
                                    {modulosEnCategoria.length}
                                </Badge>
                            </button>

                            {/* Módulos dentro de la categoría */}
                            {isExpanded && (
                                <div className="divide-y divide-gray-200 dark:divide-gray-800 bg-gray-50 dark:bg-gray-900/30">
                                    {modulosEnCategoria.map(modulo => {
                                        const tieneSubmudulos = modulo.submodulos_count > 0;
                                        const isModuloExpanded = expandedModulos.has(modulo.id);

                                        return (
                                            <div
                                                key={modulo.id}
                                                className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
                                            >
                                                <div className="px-4 py-3 flex items-center justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        {/* Información del módulo */}
                                                        <div className="flex items-center gap-2">
                                                            {modulo.es_submenu && (
                                                                <span className="text-gray-400">
                                                                    └
                                                                </span>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                    {modulo.titulo}
                                                                </p>
                                                                <div className="flex gap-2 items-center flex-wrap mt-1">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {modulo.ruta}
                                                                    </p>
                                                                    <Badge
                                                                        variant={
                                                                            modulo.es_submenu
                                                                                ? 'secondary'
                                                                                : 'default'
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {modulo.es_submenu
                                                                            ? 'Submódulo'
                                                                            : 'Principal'}
                                                                    </Badge>
                                                                    {modulo.submodulos_count > 0 && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs"
                                                                        >
                                                                            {modulo.submodulos_count}{' '}
                                                                            sub
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Acciones */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onToggleActivo(modulo)}
                                                            disabled={procesando}
                                                            title={
                                                                modulo.activo
                                                                    ? 'Desactivar'
                                                                    : 'Activar'
                                                            }
                                                        >
                                                            {modulo.activo ? (
                                                                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onEdit(modulo)}
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onDelete(modulo)}
                                                            disabled={procesando}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-700"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Submódulos si existen */}
                                                {tieneSubmudulos && (
                                                    <button
                                                        onClick={() => toggleModuloExpanded(modulo.id)}
                                                        className="w-full px-4 py-2 text-left text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 bg-gray-100 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800"
                                                    >
                                                        <ChevronRight
                                                            className={cn(
                                                                'h-3 w-3 transition-transform',
                                                                isModuloExpanded && 'rotate-90'
                                                            )}
                                                        />
                                                        <span>
                                                            {isModuloExpanded
                                                                ? 'Ocultar'
                                                                : 'Ver'}{' '}
                                                            {modulo.submodulos_count} submódulos
                                                        </span>
                                                    </button>
                                                )}

                                                {/* Nota: Aquí se mostrarían los submódulos si se expanden */}
                                                {tieneSubmudulos && isModuloExpanded && (
                                                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800/30 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
                                                        <p className="italic">
                                                            {modulo.submodulos_count} submódulos (ver
                                                            en vista de tabla para más detalles)
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mensaje si no hay módulos */}
            {modulos.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No hay módulos para mostrar
                </div>
            )}
        </div>
    );
}
