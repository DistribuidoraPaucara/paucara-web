import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Eye, EyeOff, Search, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { BreadcrumbItem } from '@/types';
import type { ModuloSidebar } from '@/domain/entities/admin-permisos';
import { modulosService } from '@/infrastructure/services/modulos.service';

interface Props {
  modulos: ModuloSidebar[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Centro de Permisos',
    href: '/admin/permisos',
  },
  {
    title: 'Módulos del Sidebar',
    href: '/admin/permisos/modulos',
  },
];

export default function Index({ modulos }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modulosList, setModulosList] = useState<ModuloSidebar[]>(modulos);
  const [loading, setLoading] = useState(false);

  // Filtrar módulos por búsqueda
  const modulosFiltrados = modulosList.filter((modulo) =>
    modulo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    modulo.ruta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle activo/inactivo
  const handleToggleActivo = async (modulo: ModuloSidebar) => {
    setLoading(true);
    try {
      await modulosService.toggleActivo(modulo.id);
      // Actualizar la lista local
      setModulosList(
        modulosList.map((m) =>
          m.id === modulo.id ? { ...m, activo: !m.activo } : m
        )
      );
      toast.success(`Módulo ${modulo.titulo} ${!modulo.activo ? 'activado' : 'desactivado'}`);
    } catch (error) {
      toast.error('Error al cambiar el estado del módulo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Navegar a edición
  const handleEdit = (modulo: ModuloSidebar) => {
    router.visit(modulosService.editUrl(modulo.id));
  };

  // Eliminar módulo con confirmación
  const handleDelete = async (modulo: ModuloSidebar) => {
    if (confirm(`¿Está seguro de que desea eliminar el módulo "${modulo.titulo}"? Esta acción no se puede deshacer.`)) {
      setLoading(true);
      try {
        await modulosService.delete(modulo.id);
        // Actualizar la lista local
        setModulosList(modulosList.filter((m) => m.id !== modulo.id));
        toast.success(`Módulo ${modulo.titulo} eliminado exitosamente`);
      } catch (error) {
        toast.error('Error al eliminar el módulo');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Módulos del Sidebar" />

      <div className="py-2">
        <div className="sm:px-2 lg:px-4">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Módulos del Sidebar
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestiona los módulos y menús disponibles en el sidebar de la aplicación
              </p>
            </div>
            <Button
              onClick={() => router.visit(modulosService.createUrl())}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Módulo
            </Button>
          </div>

          {/* Card con tabla */}
          <Card>
            <CardHeader>
              <CardTitle>Listado de Módulos</CardTitle>
              <CardDescription>
                Total de módulos: {modulosList.length} | Mostrando: {modulosFiltrados.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Búsqueda */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar módulo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Buscar por título o ruta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Ícono</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Orden</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modulosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                          {modulosList.length === 0
                            ? 'No hay módulos registrados'
                            : 'No se encontraron módulos que coincidan con la búsqueda'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      modulosFiltrados.map((modulo) => (
                        <TableRow key={modulo.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {modulo.es_submenu && (
                                <span className="text-gray-400">└</span>
                              )}
                              {modulo.titulo}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {modulo.ruta}
                          </TableCell>
                          <TableCell>
                            <Badge variant={modulo.es_submenu ? 'secondary' : 'default'}>
                              {modulo.es_submenu ? 'Submódulo' : 'Principal'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {modulo.icono ? (
                              <Badge variant="outline">{modulo.icono}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {modulo.categoria ? (
                              <Badge variant="outline">{modulo.categoria}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-center">
                            {modulo.orden}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActivo(modulo)}
                              disabled={loading}
                              className={modulo.activo ? 'text-green-600' : 'text-red-600'}
                            >
                              {modulo.activo ? (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  <Badge variant="secondary">Inactivo</Badge>
                                </>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(modulo)}
                                disabled={loading}
                                title="Editar módulo"
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(modulo)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-700"
                                title="Eliminar módulo"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Info Box */}
              <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-900">
                  <strong>✅ Implementado:</strong> CRUD completo de módulos del sidebar (crear, leer, actualizar, eliminar).
                  Puedes gestionar todos los módulos desde esta interfaz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
