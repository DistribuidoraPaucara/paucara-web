import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { AlertCircle, Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

interface Permission {
    id: number;
    name: string;
    description?: string | null;
}

interface PermissionGroup {
    [module: string]: Permission[];
}

type PermissionView = 'all' | 'selected' | 'unselected';

interface AdvancedPermissionSelectorProps {
    selectedPermissions: number[];
    onChange: (permissions: number[]) => void;
    disabled?: boolean;
    showStats?: boolean;
}

const normalize = (value: string) =>
    value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function AdvancedPermissionSelector({
    selectedPermissions,
    onChange,
    disabled = false,
    showStats = true,
}: AdvancedPermissionSelectorProps) {
    const [permissions, setPermissions] = useState<PermissionGroup>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<PermissionView>('all');
    const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Cargar permisos agrupados
    useEffect(() => {
        const cargarPermisos = async () => {
            try {
                const response = await axios.get('/roles-data/permissions-grouped');
                setPermissions(response.data);
            } catch (error) {
                console.error('Error cargando permisos:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarPermisos();
    }, []);

    const selectedSet = useMemo(() => new Set(selectedPermissions), [selectedPermissions]);

    // Filtrar por búsqueda (módulo, nombre o descripción, sin tildes) y por vista
    const filteredPermissions = useMemo(() => {
        const term = normalize(searchTerm.trim());
        const filtered: PermissionGroup = {};
        Object.entries(permissions).forEach(([module, perms]) => {
            const moduleMatches = term !== '' && normalize(module).includes(term);
            const filteredPerms = perms.filter((p) => {
                if (view === 'selected' && !selectedSet.has(p.id)) return false;
                if (view === 'unselected' && selectedSet.has(p.id)) return false;
                if (term === '' || moduleMatches) return true;
                return normalize(p.name).includes(term) || normalize(p.description ?? '').includes(term);
            });
            if (filteredPerms.length > 0) {
                filtered[module] = filteredPerms;
            }
        });
        return filtered;
    }, [permissions, searchTerm, view, selectedSet]);

    const visiblePermissions = useMemo(() => Object.values(filteredPermissions).flat(), [filteredPermissions]);
    const isFiltering = searchTerm.trim() !== '' || view !== 'all';

    // Calcular estadísticas
    const stats = useMemo(() => {
        const total = Object.values(permissions).reduce((sum, perms) => sum + perms.length, 0);
        const selected = Object.values(permissions).flat().filter((p) => selectedSet.has(p.id)).length;
        const percentage = total > 0 ? Math.round((selected / total) * 100) : 0;
        return { total, selected, percentage };
    }, [permissions, selectedSet]);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            onChange([...selectedPermissions, permissionId]);
        } else {
            onChange(selectedPermissions.filter((id) => id !== permissionId));
        }
    };

    // Marca/desmarca un conjunto de permisos sin tocar el resto de la selección
    const setPermissionsChecked = (perms: Permission[], checked: boolean) => {
        const ids = perms.map((p) => p.id);
        if (checked) {
            onChange(Array.from(new Set([...selectedPermissions, ...ids])));
        } else {
            const remove = new Set(ids);
            onChange(selectedPermissions.filter((id) => !remove.has(id)));
        }
    };

    const checkedState = (perms: Permission[]): boolean | 'indeterminate' => {
        const count = perms.filter((p) => selectedSet.has(p.id)).length;
        if (count === 0) return false;
        return count === perms.length ? true : 'indeterminate';
    };

    const toggleModule = (module: string) => {
        const next = new Set(collapsedModules);
        if (next.has(module)) {
            next.delete(module);
        } else {
            next.add(module);
        }
        setCollapsedModules(next);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-8">
                    <div className="text-center">Cargando permisos...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header con búsqueda y acciones masivas */}
            <Card>
                <CardHeader>
                    <CardTitle>Gestión Avanzada de Permisos</CardTitle>
                    <CardDescription>
                        Selecciona los permisos que deseas asignar a este rol
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Buscar por módulo, permiso o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') e.preventDefault();
                                    if (e.key === 'Escape') setSearchTerm('');
                                }}
                                className="pl-10 pr-8"
                                disabled={disabled}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label="Limpiar búsqueda"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <select
                            value={view}
                            onChange={(e) => setView(e.target.value as PermissionView)}
                            className="h-9 rounded-md border border-input bg-input-background px-2 text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value="selected">Solo seleccionados</option>
                            <option value="unselected">Solo sin seleccionar</option>
                        </select>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPermissionsChecked(visiblePermissions, true)}
                                disabled={disabled || visiblePermissions.length === 0}
                            >
                                {isFiltering ? 'Marcar visibles' : 'Marcar todos'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPermissionsChecked(visiblePermissions, false)}
                                disabled={disabled || visiblePermissions.length === 0}
                            >
                                {isFiltering ? 'Desmarcar visibles' : 'Desmarcar todos'}
                            </Button>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    {showStats && (
                        <div className="space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold text-blue-600">{stats.selected}</span> de {stats.total} permisos seleccionados
                                </span>
                                <span className="font-semibold text-green-600">{stats.percentage}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                <div className="h-full bg-blue-600 transition-all" style={{ width: `${stats.percentage}%` }} />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 text-xs">
                        <button
                            type="button"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                            onClick={() => setCollapsedModules(new Set())}
                        >
                            Expandir todo
                        </button>
                        <button
                            type="button"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                            onClick={() => setCollapsedModules(new Set(Object.keys(permissions)))}
                        >
                            Colapsar todo
                        </button>
                    </div>

                    {Object.keys(filteredPermissions).length === 0 && (
                        <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                            <AlertCircle className="mr-2 inline h-4 w-4" />
                            No se encontraron permisos con los filtros actuales.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Módulos de permisos */}
            <div className="space-y-2">
                {Object.entries(filteredPermissions).map(([module, modulePerms]) => {
                    const moduleTotal = permissions[module];
                    const selected = moduleTotal.filter((p) => selectedSet.has(p.id)).length;
                    // Con búsqueda activa los módulos se muestran siempre abiertos
                    const isExpanded = searchTerm.trim() !== '' || !collapsedModules.has(module);
                    const state = checkedState(modulePerms);

                    return (
                        <Card key={module} className="gap-0 py-0">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Checkbox
                                    checked={state}
                                    disabled={disabled}
                                    onCheckedChange={() => setPermissionsChecked(modulePerms, state !== true)}
                                    aria-label={`Seleccionar todos los permisos de ${module}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleModule(module)}
                                    className="flex flex-1 items-center justify-between text-left"
                                >
                                    <span className="text-sm font-semibold capitalize">{module}</span>
                                    <span className="flex items-center gap-2">
                                        <Badge variant={selected > 0 ? 'secondary' : 'outline'}>
                                            {selected}/{moduleTotal.length}
                                        </Badge>
                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </span>
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="grid gap-1 border-t p-3 md:grid-cols-2 lg:grid-cols-3">
                                    {modulePerms.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-start space-x-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                                        >
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={selectedSet.has(permission.id)}
                                                onCheckedChange={(checked) =>
                                                    handlePermissionChange(permission.id, checked === true)
                                                }
                                                disabled={disabled}
                                                className="mt-0.5"
                                            />
                                            <label
                                                htmlFor={`permission-${permission.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <div className="break-all text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {permission.name.replace(`${module}.`, '')}
                                                </div>
                                                {permission.description && (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {permission.description}
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
