import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Check, X, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Modulo {
    id: number;
    titulo: string;
    ruta: string;
    categoria?: string;
    permisos_requeridos: string[];
    roles_acceso: string[];
    submodulos: Modulo[];
}

interface MatrizAccesoProps {
    modulos?: Modulo[];
    roles?: string[];
}

export function MatrizAccesoRol({ modulos = [], roles = [] }: MatrizAccesoProps) {
    const [data, setData] = useState<{
        modulos: Modulo[];
        roles: string[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedModulos, setExpandedModulos] = useState<Set<number>>(new Set());
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatriz = async () => {
            try {
                const response = await fetch('/api/modulos-sidebar/matriz-acceso');
                if (!response.ok) throw new Error('Error al cargar matriz');
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Error fetching matriz:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatriz();
    }, []);

    const toggleExpanded = (moduloId: number) => {
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

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Matriz de Acceso Rol-Módulo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Matriz de Acceso Rol-Módulo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No se pudo cargar la matriz de acceso
                    </p>
                </CardContent>
            </Card>
        );
    }

    const rolesOrdenados = data.roles.sort();

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Matriz de Acceso Rol-Módulo</CardTitle>
                <CardDescription>
                    Vista general de qué roles tienen acceso a cada módulo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    {/* Tabla */}
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-gray-900 min-w-[250px]">
                                    Módulo
                                </th>
                                {rolesOrdenados.map(rol => (
                                    <th
                                        key={rol}
                                        className="text-center py-3 px-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <Badge variant="outline" className="text-xs">
                                                {rol.length > 15 ? rol.substring(0, 12) + '...' : rol}
                                            </Badge>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.modulos.map((modulo, idx) => (
                                <React.Fragment key={modulo.id}>
                                    {/* Fila del módulo principal */}
                                    <tr
                                        className={cn(
                                            'border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                                            idx % 2 === 0 && 'bg-white dark:bg-gray-950'
                                        )}
                                    >
                                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-inherit">
                                            <div className="flex items-center gap-2">
                                                {modulo.submodulos.length > 0 && (
                                                    <button
                                                        onClick={() => toggleExpanded(modulo.id)}
                                                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                    >
                                                        <ChevronRight
                                                            className={cn(
                                                                'h-4 w-4 transition-transform',
                                                                expandedModulos.has(modulo.id) && 'rotate-90'
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                                {modulo.submodulos.length === 0 && (
                                                    <div className="w-5" />
                                                )}
                                                <div>
                                                    <div>{modulo.titulo}</div>
                                                    {modulo.categoria && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {modulo.categoria}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {rolesOrdenados.map(rol => {
                                            const tieneAcceso = modulo.roles_acceso.includes(rol);
                                            const cellKey = `${modulo.id}-${rol}`;

                                            return (
                                                <td
                                                    key={rol}
                                                    className={cn(
                                                        'text-center py-3 px-3 relative',
                                                        tieneAcceso
                                                            ? 'bg-green-50 dark:bg-green-900/20'
                                                            : 'bg-red-50 dark:bg-red-900/10'
                                                    )}
                                                    onMouseEnter={() => setHoveredCell(cellKey)}
                                                    onMouseLeave={() => setHoveredCell(null)}
                                                >
                                                    {tieneAcceso ? (
                                                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-red-500 dark:text-red-400 mx-auto" />
                                                    )}

                                                    {/* Tooltip con permisos requeridos */}
                                                    {hoveredCell === cellKey &&
                                                        modulo.permisos_requeridos.length > 0 && (
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs py-2 px-3 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                                                                <div className="font-semibold mb-1">
                                                                    Permisos requeridos:
                                                                </div>
                                                                <div className="max-w-xs max-h-40 overflow-y-auto">
                                                                    {modulo.permisos_requeridos.map(
                                                                        perm => (
                                                                            <div
                                                                                key={perm}
                                                                                className="text-xs break-words"
                                                                            >
                                                                                • {perm}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* Filas de submódulos */}
                                    {expandedModulos.has(modulo.id) &&
                                        modulo.submodulos.map(submodulo => (
                                            <tr
                                                key={submodulo.id}
                                                className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <td className="py-2 px-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-inherit">
                                                    <div className="flex items-center gap-2 ml-6">
                                                        <span className="text-gray-400">└</span>
                                                        <span className="text-sm">{submodulo.titulo}</span>
                                                    </div>
                                                </td>

                                                {rolesOrdenados.map(rol => {
                                                    const tieneAcceso =
                                                        submodulo.roles_acceso.includes(rol);
                                                    const cellKey = `${submodulo.id}-${rol}`;

                                                    return (
                                                        <td
                                                            key={rol}
                                                            className={cn(
                                                                'text-center py-2 px-3',
                                                                tieneAcceso
                                                                    ? 'bg-green-50 dark:bg-green-900/20'
                                                                    : 'bg-red-50 dark:bg-red-900/10'
                                                            )}
                                                            onMouseEnter={() => setHoveredCell(cellKey)}
                                                            onMouseLeave={() => setHoveredCell(null)}
                                                        >
                                                            {tieneAcceso ? (
                                                                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
                                                            ) : (
                                                                <X className="h-4 w-4 text-red-500 dark:text-red-400 mx-auto" />
                                                            )}

                                                            {hoveredCell === cellKey &&
                                                                submodulo.permisos_requeridos
                                                                    .length > 0 && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs py-2 px-3 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                                                                        <div className="font-semibold mb-1">
                                                                            Permisos requeridos:
                                                                        </div>
                                                                        <div className="max-w-xs max-h-40 overflow-y-auto">
                                                                            {submodulo.permisos_requeridos.map(
                                                                                perm => (
                                                                                    <div
                                                                                        key={perm}
                                                                                        className="text-xs break-words"
                                                                                    >
                                                                                        • {perm}
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Leyenda */}
                <div className="mt-6 flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300">Rol tiene acceso</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500 dark:text-red-400" />
                        <span className="text-gray-700 dark:text-gray-300">Rol NO tiene acceso</span>
                    </div>
                </div>

                {/* Advertencias */}
                {data.modulos.some(m => m.permisos_requeridos.length === 0) && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md flex gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            Algunos módulos no tienen permisos requeridos configurados. Estos serán visibles
                            para todos los usuarios.
                        </div>
                    </div>
                )}

                {/* Indicador de inconsistencias */}
                {data.modulos.some(
                    m =>
                        m.submodulos.length > 0 &&
                        JSON.stringify(m.roles_acceso.sort()) !==
                            JSON.stringify(
                                m.submodulos
                                    .flatMap(s => s.roles_acceso)
                                    .filter((v, i, a) => a.indexOf(v) === i)
                                    .sort()
                            )
                ) && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md flex gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                            Algunos módulos tienen permisos inconsistentes con sus submódulos. Considera
                            alinear los permisos.
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
