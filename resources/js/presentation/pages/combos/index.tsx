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
import { Badge } from '@/presentation/components/ui/badge';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { router } from '@inertiajs/react';
import * as routes from '@/routes/combos';
import ComboCapacity from './components/ComboCapacity';

interface ComboItem {
  id: number;
  nombre: string;
  sku: string;
  precio_venta: number;
  subtotal_costo: number;
  cantidad_items: number;
  activo: boolean;
}

interface CombosIndexProps {
  combos: {
    data: ComboItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function CombosIndex({ combos }: CombosIndexProps) {
  const { errors } = usePage().props;
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (errors?.delete) {
      toast.error(errors.delete as string, {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  }, [errors?.delete]);

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
              {combos.total} combo{combos.total !== 1 ? 's' : ''} registrado{combos.total !== 1 ? 's' : ''}
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
            {combos.data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-center">Capacidad</TableHead>
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
                          <ComboCapacity comboId={combo.id} compact={true} />
                        </TableCell>
                        <TableCell className="text-right">
                          Bs {combo.precio_venta.toFixed(2)}
                        </TableCell>
                        {/* <TableCell className="text-right">
                          Bs {combo.subtotal_costo.toFixed(2)}
                        </TableCell> */}
                        <TableCell className="text-center">
                          <Badge variant={combo.activo ? 'default' : 'secondary'}>
                            {combo.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
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
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No hay combos registrados</p>
                <Link href={routes.create().url}>
                  <Button>Crear primer combo</Button>
                </Link>
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
