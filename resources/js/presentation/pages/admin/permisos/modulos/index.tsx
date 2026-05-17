import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Eye, EyeOff, Search } from 'lucide-react';
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

  // Navegar a edición (Fase 2)
  const handleEdit = (modulo: ModuloSidebar) => {
    toast(`Edición disponible en Fase 2`, { icon: 'ℹ️' });
    // router.visit(modulosService.editUrl(modulo.id));
  };

  const handleDelete = (modulo: ModuloSidebar) => {
    toast(`Eliminación disponible en Fase 2`, { icon: 'ℹ️' });
    // if (confirm(`¿Está seguro de eliminar el módulo "${modulo.titulo}"?`)) {
    //   modulosService.destroy(modulo.id);
    // }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Módulos del Sidebar" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Módulos del Sidebar
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestiona los módulos y menús disponibles en el sidebar de la aplicación
              </p>
            </div>
            <Link href="/admin/permisos">
              <Button variant="outline">
                ← Volver al Centro de Permisos
              </Button>
            </Link>
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
                                disabled
                                title="Disponible en Fase 2"
                              >
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(modulo)}
                                disabled
                                className="text-red-600 hover:text-red-700"
                                title="Disponible en Fase 2"
                              >
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
              <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-900">
                  <strong>ℹ️ Fase 1:</strong> Visualización de módulos y cambio de estado (activo/inactivo).
                  Las funciones de crear, editar y eliminar estarán disponibles en las próximas fases.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
