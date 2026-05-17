import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { AlertCircle, CheckCircle2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

interface Permission {
    id: number;
    name: string;
    description: string;
}

interface PermissionGroup {
    [module: string]: Permission[];
}

interface AdvancedPermissionSelectorProps {
    selectedPermissions: number[];
    onChange: (permissions: number[]) => void;
    disabled?: boolean;
    showStats?: boolean;
}

export default function AdvancedPermissionSelector({
    selectedPermissions,
    onChange,
    disabled = false,
    showStats = true,
}: AdvancedPermissionSelectorProps) {
    const [permissions, setPermissions] = useState<PermissionGroup>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Cargar permisos agrupados
    useEffect(() => {
        const cargarPermisos = async () => {
            try {
                const response = await axios.get('/roles-data/permissions-grouped');
                setPermissions(response.data);
                // Expandir todos los módulos por defecto
                setExpandedModules(new Set(Object.keys(response.data)));
                setLoading(false);
            } catch (error) {
                console.error('Error cargando permisos:', error);
                setLoading(false);
            }
        };

        cargarPermisos();
    }, []);

    // Filtrar permisos por búsqueda
    const filteredPermissions = useMemo(() => {
        if (!searchTerm.trim()) return permissions;

        const filtered: PermissionGroup = {};
        Object.entries(permissions).forEach(([module, perms]) => {
            const filteredPerms = perms.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filteredPerms.length > 0) {
                filtered[module] = filteredPerms;
            }
        });
        return filtered;
    }, [permissions, searchTerm]);

    // Calcular estadísticas
    const stats = useMemo(() => {
        const total = Object.values(permissions).reduce((sum, perms) => sum + perms.length, 0);
        const selected = selectedPermissions.length;
        const percentage = total > 0 ? Math.round((selected / total) * 100) : 0;
        return { total, selected, percentage };
    }, [permissions, selectedPermissions]);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            onChange([...selectedPermissions, permissionId]);
        } else {
            onChange(selectedPermissions.filter((id) => id !== permissionId));
        }
    };

    const handleSelectAll = (module: string) => {
        const modulePerms = permissions[module];
        const modulePermIds = modulePerms.map((p) => p.id);
        const allSelected = modulePermIds.every((id) => selectedPermissions.includes(id));

        if (allSelected) {
            onChange(selectedPermissions.filter((id) => !modulePermIds.includes(id)));
        } else {
            const newSelected = [...selectedPermissions];
            modulePermIds.forEach((id) => {
                if (!newSelected.includes(id)) {
                    newSelected.push(id);
                }
            });
            onChange(newSelected);
        }
    };

    const toggleModule = (module: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(module)) {
            newExpanded.delete(module);
        } else {
            newExpanded.add(module);
        }
        setExpandedModules(newExpanded);
    };

    const getModuleStats = (module: string) => {
        const modulePerms = permissions[module];
        const selected = modulePerms.filter((p) => selectedPermissions.includes(p.id)).length;
        const total = modulePerms.length;
        return { selected, total };
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
        <div className="space-y-6">
            {/* Header con búsqueda */}
            <Card>
                <CardHeader>
                    <CardTitle>Gestión Avanzada de Permisos</CardTitle>
                    <CardDescription>
                        Selecciona los permisos que deseas asignar a este rol
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Barra de búsqueda */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Buscar permisos</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Busca por nombre o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    {/* Estadísticas */}
                    {showStats && (
                        <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.selected}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Seleccionados
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {stats.total}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Total
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.percentage}%
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Cobertura
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Advertencia si no hay búsqueda */}
                    {searchTerm && Object.keys(filteredPermissions).length === 0 && (
                        <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                            <AlertCircle className="mb-2 inline h-4 w-4" />
                            No se encontraron permisos que coincidan con "{searchTerm}"
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Módulos de permisos */}
            <div className="space-y-2">
                {Object.entries(filteredPermissions).map(([module, modulePerms]) => {
                    const { selected, total } = getModuleStats(module);
                    const isExpanded = expandedModules.has(module);

                    return (
                        <Card key={module}>
                            <CardHeader
                                className="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                                onClick={() => toggleModule(module)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                        <CardTitle className="text-sm capitalize">
                                            {module}
                                        </CardTitle>
                                    </div>
                                    <Badge variant="outline">
                                        {selected}/{total}
                                    </Badge>
                                </div>
                            </CardHeader>

                            {isExpanded && (
                                <CardContent className="space-y-3 border-t pt-4">
                                    {/* Botón Seleccionar todos del módulo */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSelectAll(module)}
                                        disabled={disabled}
                                        className="w-full text-xs"
                                    >
                                        {selected === total ? 'Deseleccionar todos' : 'Seleccionar todos'}
                                    </Button>

                                    {/* Permisos del módulo */}
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {modulePerms.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-start space-x-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                                            >
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={selectedPermissions.includes(
                                                        permission.id
                                                    )}
                                                    onCheckedChange={(checked) =>
                                                        handlePermissionChange(
                                                            permission.id,
                                                            checked as boolean
                                                        )
                                                    }
                                                    disabled={disabled}
                                                    className="mt-1"
                                                />
                                                <label
                                                    htmlFor={`permission-${permission.id}`}
                                                    className="flex-1 cursor-pointer"
                                                >
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {permission.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                        {permission.description}
                                                    </div>
                                                </label>
                                                {selectedPermissions.includes(permission.id) && (
                                                    <CheckCircle2 className="mt-1 h-4 w-4 text-green-600" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Resumen final */}
            {selectedPermissions.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-900 dark:text-blue-100">
                                {stats.selected} permisos seleccionados ({stats.percentage}% del total)
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
