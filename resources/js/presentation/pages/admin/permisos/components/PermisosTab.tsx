import { useState, type FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { Pencil, Trash2, Plus, Search, Shield, Grid3x3, Table2 } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { permissionsService } from '@/infrastructure/services/permissions.service';
import type { Permission } from '@/domain/entities/admin-permisos';

interface PermisosTabProps {
    permisos: Permission[];
    cargando: boolean;
    modulos: string[];
    onLoadData: (search: string, modulo: string) => void;
}

export function PermisosTab({ permisos, cargando, modulos, onLoadData }: PermisosTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onLoadData(searchTerm, selectedModule);
    };

    const handleModuleChange = (module: string) => {
        setSelectedModule(module);
        onLoadData(searchTerm, module === 'all' ? '' : module);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedModule('');
        onLoadData('', '');
    };

    const handleDelete = (permission: Permission) => {
        if (permission.roles_count && permission.roles_count > 0) {
            NotificationService.error(`No se puede eliminar "${permission.name}" porque está asignado a ${permission.roles_count} rol(es)`);
            return;
        }

        if (confirm(`¿Estás seguro de que quieres eliminar el permiso "${permission.name}"?`)) {
            router.delete(permissionsService.destroyUrl(permission.id), {
                onSuccess: () => {
                    NotificationService.success('Permiso eliminado exitosamente');
                    onLoadData(searchTerm, selectedModule);
                },
                onError: () => {
                    NotificationService.error('Error al eliminar el permiso');
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Información importante */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                ℹ️ Gestión de Permisos
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Los permisos se gestionan mediante <strong>seeders</strong> o <strong>comandos artisan</strong>.
                                La creación, edición y eliminación desde la UI no está habilitada.
                                Puedes visualizar y buscar permisos existentes.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Gestión de Permisos
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total: {permisos.length} permisos
                    </p>
                </div>

                {/* Vista Toggle */}
                <div className="flex gap-2 border border-gray-300 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-800">
                    <button
                        type="button"
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'card'
                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        title="Vista Cards"
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'table'
                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        title="Vista Tabla"
                    >
                        <Table2 className="h-4 w-4" />
                    </button>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2" disabled title="Los permisos se gestionan mediante seeders">
                            <Plus className="w-4 h-4" />
                            Nuevo Permiso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Permiso</DialogTitle>
                            <DialogDescription>
                                Redirigiendo a la página de creación
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Se abrirá una nueva página para crear el permiso.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsCreateDialogOpen(false);
                                        router.visit(permissionsService.createUrl());
                                    }}
                                >
                                    Ir a Crear
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Filtros de Búsqueda
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="search">Buscar por nombre</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Nombre del permiso..."
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="module">Módulo</Label>
                                <Select
                                    value={selectedModule || 'all'}
                                    onValueChange={handleModuleChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los módulos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los módulos</SelectItem>
                                        {modulos?.map((module) => (
                                            <SelectItem key={module} value={module}>
                                                {module.charAt(0).toUpperCase() + module.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end gap-2">
                                <Button type="submit" className="flex-1">
                                    <Search className="w-4 h-4 mr-2" />
                                    Buscar
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="flex-1"
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de Permisos */}
            {cargando ? (
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="text-gray-400 mb-2">Cargando permisos...</div>
                    </div>
                </div>
            ) : permisos && permisos.length > 0 ? (
                viewMode === 'card' ? (
                    // ==================== VISTA CARDS ====================
                    <div className="space-y-3">
                        {permisos.map((permission, idx) => (
                            <Card key={permission.id || `permission-${idx}`} className="hover:shadow-md transition-shadow bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        {permission.name}
                                                    </p>
                                                    {permission.id && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            ID: {permission.id}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {permission.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                    {permission.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>
                                                    Roles: <span className="font-semibold">{permission.roles_count || 0}</span>
                                                </span>
                                                <span>
                                                    Usuarios: <span className="font-semibold">{permission.users_count || 0}</span>
                                                </span>
                                                {permission.created_at && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                                        {new Date(permission.created_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                title="Los permisos se gestionan mediante seeders o comandos artisan"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                                                title="Los permisos se gestionan mediante seeders o comandos artisan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // ==================== VISTA TABLA ====================
                    <Card className="bg-white dark:bg-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">ID</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Permiso</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Roles</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Usuarios</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Creado</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permisos.map((permission, idx) => (
                                        <tr key={permission.id || `permission-${idx}`} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {permission.id || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                                    <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                                                        {permission.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                {permission.description || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                                    {permission.roles_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                    {permission.users_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {permission.created_at
                                                    ? new Date(permission.created_at).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
                                                        className="h-8 w-8 p-0"
                                                        title="Los permisos se gestionan mediante seeders o comandos artisan"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
                                                        title="Los permisos se gestionan mediante seeders o comandos artisan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )
            ) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No se encontraron permisos
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            No hay permisos que coincidan con los filtros aplicados.
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                            Limpiar filtros
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
