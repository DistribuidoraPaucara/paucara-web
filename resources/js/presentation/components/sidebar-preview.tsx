import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Rol {
    id: number;
    name: string;
    label: string;
}

interface NavItem {
    title: string;
    href: string;
    icon?: string;
    children?: NavItem[];
}

interface SidebarPreviewProps {
    modulosTotales: number;
}

export function SidebarPreview({ modulosTotales }: SidebarPreviewProps) {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<string>('');
    const [modulos, setModulos] = useState<NavItem[]>([]);
    const [cargando, setCargando] = useState(true);
    const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    // Cargar roles disponibles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/modulos-sidebar/roles');
                if (!response.ok) throw new Error('Error al cargar roles');
                const data = await response.json();
                setRoles(data);
                if (data.length > 0) {
                    setRolSeleccionado(data[0].name);
                }
            } catch (err) {
                console.error('Error:', err);
                setError('No se pudieron cargar los roles');
            } finally {
                setCargando(false);
            }
        };

        fetchRoles();
    }, []);

    // Cargar módulos cuando cambia el rol
    useEffect(() => {
        if (!rolSeleccionado) return;

        const fetchModulos = async () => {
            setCargando(true);
            setExpandidos(new Set());
            try {
                const response = await fetch(`/api/modulos-sidebar/preview/${rolSeleccionado}`);
                if (!response.ok) throw new Error('Error al cargar módulos');
                const data = await response.json();
                setModulos(data.modulos || []);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError('No se pudieron cargar los módulos');
            } finally {
                setCargando(false);
            }
        };

        fetchModulos();
    }, [rolSeleccionado]);

    const toggleExpandido = (path: string) => {
        setExpandidos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    };

    const renderNavItem = (item: NavItem, nivel: number = 0) => {
        const tieneHijos = item.children && item.children.length > 0;
        const isExpanded = expandidos.has(item.href);

        return (
            <div key={item.href} className="w-full">
                <button
                    onClick={() => tieneHijos && toggleExpandido(item.href)}
                    className={cn(
                        'w-full text-left px-3 py-2 rounded-md transition-colors text-sm',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        nivel > 0 && 'ml-4 text-xs'
                    )}
                >
                    <div className="flex items-center gap-2">
                        {tieneHijos && (
                            <span className="text-gray-400">
                                {isExpanded ? '▼' : '▶'}
                            </span>
                        )}
                        {!tieneHijos && <span className="w-4" />}
                        <span className="flex-1 truncate font-medium text-gray-700 dark:text-gray-300">
                            {item.title}
                        </span>
                    </div>
                </button>

                {tieneHijos && isExpanded && (
                    <div className="ml-2 border-l border-gray-200 dark:border-gray-700">
                        {item.children!.map(child => renderNavItem(child, nivel + 1))}
                    </div>
                )}
            </div>
        );
    };

    const rolActual = roles.find(r => r.name === rolSeleccionado);

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Vista Previa del Sidebar por Rol
                </CardTitle>
                <CardDescription>
                    Ve exactamente qué módulos vería cada rol en el menú lateral
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Selector de rol */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Selecciona un rol para previsualizarlo
                    </label>
                    <Select value={rolSeleccionado} onValueChange={setRolSeleccionado}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(rol => (
                                <SelectItem key={rol.name} value={rol.name}>
                                    {rol.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Información del rol */}
                {rolActual && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Rol:</strong> {rolActual.label}
                            <br />
                            <strong>Módulos visibles:</strong> {modulos.length} de {modulosTotales}
                            {modulos.length === 0 && (
                                <span className="text-orange-600 dark:text-orange-400 font-semibold ml-2">
                                    (Este rol no tiene acceso a ningún módulo)
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {/* Estado de carga */}
                {cargando && (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Vista previa del sidebar */}
                {!cargando && modulos.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                Menú Lateral (como lo vería {rolActual?.label})
                            </h3>
                        </div>
                        <div className="p-3 space-y-1">
                            {modulos.map(modulo => renderNavItem(modulo))}
                        </div>
                    </div>
                )}

                {/* Sin acceso */}
                {!cargando && modulos.length === 0 && !error && (
                    <div className="p-8 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <EyeOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Este rol <strong>{rolActual?.label}</strong> no tiene acceso a ningún módulo.
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Asigna permisos en la matriz de acceso para otorgar acceso a módulos.
                        </p>
                    </div>
                )}

                {/* Información adicional */}
                {modulos.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                            <p className="font-semibold">💡 Tip:</p>
                            <p>
                                Haz cambios en los permisos y vuelve aquí para ver el impacto en tiempo real.
                                Solo los módulos activos y con permisos correctos aparecerán en el menú.
                            </p>
                        </div>
                    </div>
                )}

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {modulos.length}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Módulos visibles</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {modulosTotales}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Módulos totales</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
