import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Edit, Trash2, Plus, Package, Search, X } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { useDebouncedValue } from '@/application/hooks/use-debounce';
import { router } from '@inertiajs/react';
import * as routes from '@/routes/combos';

interface ComboItem {
  id: number;
  nombre: string;
  sku: string;
  precio_venta: number;
  subtotal_costo: number;
  cantidad_items: number;
  capacidad: number;
  limitantes: Array<{ nombre: string; stock: number; requerida: number }>;
  activo: boolean;
}

interface FiltrosCombos {
  q: string;
  estado: string;
  stock: string;
  orden: string;
}

interface CombosIndexProps {
  filtros: FiltrosCombos;
  combos: {
    data: ComboItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function CombosIndex({ combos, filtros }: CombosIndexProps) {
  const { errors } = usePage().props;
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cambiandoEstadoId, setCambiandoEstadoId] = useState<number | null>(null);

  useEffect(() => {
    if (errors?.delete) {
      toast.error(errors.delete as string, {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  }, [errors?.delete]);

  const [busqueda, setBusqueda] = useState(filtros.q);
  const busquedaDebounced = useDebouncedValue(busqueda, 400);
  const hayFiltros = Boolean(filtros.q || filtros.estado || filtros.stock);

  // Cambiar un filtro vuelve a la página 1; page solo se envía al paginar
  const aplicar = (cambios: Partial<FiltrosCombos> & { page?: number }) => {
    const parametros = Object.fromEntries(Object.entries({ ...filtros, ...cambios }).filter(([, valor]) => valor));
    router.get(routes.index().url, parametros, { preserveState: true, preserveScroll: true, replace: true });
  };

  useEffect(() => {
    if (busquedaDebounced.trim() !== filtros.q) {
      aplicar({ q: busquedaDebounced.trim() });
    }
  }, [busquedaDebounced]);

  const irAPagina = (page: number) => aplicar({ page });

  const limpiarFiltros = () => {
    setBusqueda('');
    router.get(routes.index().url, filtros.orden ? { orden: filtros.orden } : {}, { preserveState: true, preserveScroll: true, replace: true });
  };

  // Sin orden → menor capacidad primero → mayor capacidad primero → sin orden
  const alternarOrdenCapacidad = () =>
    aplicar({ orden: filtros.orden === '' ? 'capacidad_asc' : filtros.orden === 'capacidad_asc' ? 'capacidad_desc' : '' });
  const IconoOrden = filtros.orden === 'capacidad_asc' ? ArrowUp : filtros.orden === 'capacidad_desc' ? ArrowDown : ArrowUpDown;

  const cambiarEstado = (combo: ComboItem) => {
    setCambiandoEstadoId(combo.id);
    router.patch(
      `/combos/${combo.id}/estado`,
      { activo: !combo.activo },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => toast.success(`Combo ${combo.activo ? 'desactivado' : 'activado'}`),
        onError: () => toast.error('No se pudo cambiar el estado del combo'),
        onFinish: () => setCambiandoEstadoId(null),
      },
    );
  };

  const handleDelete = (id: number) => {
    setIsDeleting(true);
    router.delete(routes.destroy(id).url, {
      onSuccess: () => {
        toast.success('Combo eliminado exitosamente', {
          position: 'top-right',
          autoClose: 3000,
        });
        setDeleteConfirm(null);
      },
      onError: () => {
        // Los errores se manejan a través del useEffect de arriba
      },
      onFinish: () => {
        setIsDeleting(false);
      },
    });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '#' },
        { title: 'Combos', href: routes.index().url },
      ]}
    >
      <div className="space-y-4 p-6">
        {/* Header con botón crear */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Combos de Productos</h1>
            <p className="text-sm text-gray-500 mt-1">
              {combos.total} combo{combos.total !== 1 ? 's' : ''} {hayFiltros ? 'encontrado' : 'registrado'}{combos.total !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href={routes.create().url}>
            <Button className="gap-2">
              <Plus size={18} />
              Nuevo Combo
            </Button>
          </Link>
        </div>

        {/* Tabla de combos */}
        <Card>
          <CardHeader>
            <CardTitle>Listado de Combos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre, SKU o ID…"
                  aria-label="Buscar combo"
                  className="pl-9"
                />
              </div>
              <select
                value={filtros.estado}
                onChange={(e) => aplicar({ estado: e.target.value })}
                aria-label="Filtrar por estado"
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
              <select
                value={filtros.stock}
                onChange={(e) => aplicar({ stock: e.target.value })}
                aria-label="Filtrar por stock"
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">Todo el stock</option>
                <option value="con">Se pueden armar</option>
                <option value="sin">Sin stock</option>
              </select>
              {hayFiltros && (
                <Button type="button" variant="ghost" size="sm" onClick={limpiarFiltros} className="gap-1">
                  <X size={16} />
                  Limpiar
                </Button>
              )}
            </div>

            {combos.data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-center" aria-sort={filtros.orden === 'capacidad_asc' ? 'ascending' : filtros.orden === 'capacidad_desc' ? 'descending' : 'none'}>
                        <button type="button" onClick={alternarOrdenCapacidad} title="Ordenar por capacidad" className="inline-flex items-center gap-1 hover:underline">
                          Capacidad
                          <IconoOrden size={14} className={filtros.orden ? 'text-blue-600 dark:text-blue-400' : 'opacity-40'} />
                        </button>
                      </TableHead>
                      <TableHead className="text-center">Precio Venta</TableHead>
                      {/* <TableHead className="text-center">Costo Calculado</TableHead> */}
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combos.data.map((combo) => (
                      <TableRow key={combo.id}>
                        <TableCell className="font-medium">{combo.id} | {combo.nombre}</TableCell>
                        <TableCell>{combo.sku}</TableCell>
                        <TableCell className="text-center">{combo.cantidad_items}</TableCell>
                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span tabIndex={0} className="inline-flex cursor-help items-center justify-center gap-2">
                                <Package size={16} className={combo.capacidad > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'} />
                                <span className={`font-semibold ${combo.capacidad > 0 ? 'dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>{combo.capacidad}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">combos</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-left">
                              {combo.limitantes.length > 0 ? (
                                <>
                                  <p className="font-semibold">Limita el combo:</p>
                                  {combo.limitantes.map((l) => (
                                    <p key={l.nombre}>
                                      {l.nombre}: stock {l.stock}, requiere {l.requerida}
                                    </p>
                                  ))}
                                </>
                              ) : (
                                <p>Sin componentes obligatorios</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-right">
                          Bs {combo.precio_venta.toFixed(2)}
                        </TableCell>
                        {/* <TableCell className="text-right">
                          Bs {combo.subtotal_costo.toFixed(2)}
                        </TableCell> */}
                        <TableCell className="text-center">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={combo.activo}
                            aria-label={`${combo.activo ? 'Desactivar' : 'Activar'} ${combo.nombre}`}
                            title={combo.activo ? 'Activo: clic para desactivar' : 'Inactivo: clic para activar'}
                            disabled={cambiandoEstadoId === combo.id}
                            onClick={() => cambiarEstado(combo)}
                            className="inline-flex items-center gap-2 disabled:opacity-50"
                          >
                            <span className={`relative h-5 w-9 rounded-full transition-colors ${combo.activo ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${combo.activo ? 'translate-x-4' : ''}`} />
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">{combo.activo ? 'Activo' : 'Inactivo'}</span>
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/productos/${combo.id}/edit`} title="Editar producto">
                              <Button variant="ghost" size="sm">
                                <Package size={18} />
                              </Button>
                            </Link>
                            <Link href={routes.edit(combo.id).url} title="Editar combo">
                              <Button variant="ghost" size="sm">
                                <Edit size={18} />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(combo.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar combo"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {combos.last_page > 1 && (
                  <div className="flex items-center justify-end gap-2 pt-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-2">
                      Página {combos.current_page} de {combos.last_page}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={combos.current_page <= 1}
                      onClick={() => irAPagina(combos.current_page - 1)}
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={combos.current_page >= combos.last_page}
                      onClick={() => irAPagina(combos.current_page + 1)}
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                {hayFiltros ? (
                  <>
                    <p className="text-gray-500 mb-4">Ningún combo coincide con la búsqueda</p>
                    <Button type="button" variant="outline" onClick={limpiarFiltros}>Limpiar filtros</Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">No hay combos registrados</p>
                    <Link href={routes.create().url}>
                      <Button>Crear primer combo</Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo de confirmación para eliminar */}
        <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogTitle>¿Eliminar combo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El combo será eliminado permanentemente.
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end mt-4">
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirm) {
                    handleDelete(deleteConfirm);
                  }
                }}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
