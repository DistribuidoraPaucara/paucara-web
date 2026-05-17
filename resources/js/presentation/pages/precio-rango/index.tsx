import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import { AlertCircle, Plus, Edit2, Trash2, CheckCircle, Upload } from 'lucide-react';
import { PrecioRango } from '@/domain/entities/precio-rango';
import precioRangoService from '@/infrastructure/services/precio-rango.service';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface PrecioRangoIndexProps {
  productos: Array<{ id: number; nombre: string; sku: string }>;
  productoSeleccionadoId?: number;
  rangos: Array<PrecioRango & { rango_texto: string; precio_unitario: number; vigente: boolean }>;
  integridad: {
    es_valido: boolean;
    problemas: string[];
    cantidad_rangos: number;
  };
}

export default function PrecioRangoIndex({
  productos,
  productoSeleccionadoId,
  rangos,
  integridad,
}: PrecioRangoIndexProps) {
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(
    productoSeleccionadoId || (productos.length > 0 ? productos[0].id : null)
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; rangoId?: number }>({
    open: false,
  });

  // Debug: Mostrar datos en consola
  useEffect(() => {
    console.log('=== DATOS DEL BACKEND (PrecioRangoIndex) ===');
    console.log('Producto seleccionado ID:', productoSeleccionadoId);
    console.log('Total rangos:', rangos?.length);
    console.log('Rangos completos:', rangos);
    console.log('Integridad:', integridad);

    if (rangos && rangos.length > 0) {
      console.log('--- DETALLES DE CADA RANGO ---');
      rangos.forEach((rango, idx) => {
        console.log(`Rango ${idx}:`, {
          id: rango.id,
          producto_id: rango.producto_id,
          tipo_precio_id: rango.tipo_precio_id,
          cantidad_minima: rango.cantidad_minima,
          cantidad_maxima: rango.cantidad_maxima,
          tipo_precio: rango.tipo_precio,
          tipoPrecioNombre: rango.tipo_precio?.nombre,
          precio_unitario: rango.precio_unitario,
          rango_texto: rango.rango_texto,
          vigente: rango.vigente,
        });
      });
    }
  }, [productoSeleccionadoId, rangos, integridad]);

  const handleProductoChange = (productoId: string) => {
    const id = parseInt(productoId);
    setSelectedProductoId(id);
    // Navegar a este producto
    router.get(`/precio-rango?producto_id=${id}`, {}, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = (rangoId: number) => {
    setDeleteConfirm({ open: true, rangoId });
  };

  const confirmDelete = async () => {
    if (!selectedProductoId || !deleteConfirm.rangoId) return;

    const loadingToast = NotificationService.loading('Eliminando rango...');

    router.delete(
      precioRangoService.destroyParaProductoUrl(selectedProductoId, deleteConfirm.rangoId),
      {
        preserveState: true,
        onSuccess: () => {
          NotificationService.dismiss(loadingToast);
          NotificationService.success('Rango eliminado correctamente');
          setDeleteConfirm({ open: false });
        },
        onError: () => {
          NotificationService.dismiss(loadingToast);
          NotificationService.error('Error al eliminar el rango');
        },
      }
    );
  };

  const productoSeleccionado = productos.find((p) => p.id === selectedProductoId);

  return (
    <>
      <Head title="Rangos de Precios" />
      <AppLayout
        breadcrumbs={[
          { title: 'Dashboard', href: '/' },
          { title: 'Configuración', href: '#' },
          { title: 'Rangos de Precios', href: '/precio-rango', active: true },
        ]}
      >
        <div className="space-y-6 p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">Rangos de Precios</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Gestiona precios dinámicos basados en rangos de cantidad
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/precio-rango/import-csv">
                <Button size="lg" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </Button>
              </Link>
              {selectedProductoId && (
                <Link href={`/precio-rango/create?producto_id=${selectedProductoId}`}>
                  <Button size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Rango
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* SELECTOR DE PRODUCTO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Seleccionar Producto</CardTitle>
              <CardDescription className="dark:text-gray-400">Elige el producto para ver y gestionar sus rangos</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchSelect
                label="Producto"
                placeholder="Selecciona un producto..."
                value={selectedProductoId || ''}
                options={productos.map((producto) => ({
                  value: producto.id,
                  label: producto.nombre,
                  description: `SKU: ${producto.sku}`,
                } as SelectOption))}
                onChange={(value) => handleProductoChange(String(value))}
                searchPlaceholder="Buscar por nombre o SKU..."
                emptyText="No se encontraron productos"
              />
            </CardContent>
          </Card>

          {/* ALERTA DE INTEGRIDAD */}
          {!integridad.es_valido && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/40 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">Problemas de integridad detectados</h3>
                <ul className="mt-2 space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  {integridad.problemas.map((problema, idx) => (
                    <li key={idx}>• {problema}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ALERTA DE VALIDACIÓN EXITOSA */}
          {integridad.es_valido && integridad.cantidad_rangos > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/40 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-300">Rangos configurados correctamente</h3>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  {integridad.cantidad_rangos} rango(s) activo(s) sin solapamientos
                </p>
              </div>
            </div>
          )}

          {/* TABLA DE RANGOS */}
          {selectedProductoId && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-white">Rangos de {productoSeleccionado?.nombre}</CardTitle>
                    <CardDescription className="dark:text-gray-400">SKU: {productoSeleccionado?.sku}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant={integridad.cantidad_rangos > 0 ? 'default' : 'secondary'}>
                      {integridad.cantidad_rangos} rango(s)
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {rangos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No hay rangos configurados para este producto</p>
                    <Link href={`/precio-rango/create?producto_id=${selectedProductoId}`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear primer rango
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rango</TableHead>
                          <TableHead>Tipo de Precio</TableHead>
                          <TableHead className="text-right">Precio Unitario</TableHead>
                          <TableHead>Vigencia</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rangos.map((rango) => (
                          <TableRow key={rango.id}>
                            <TableCell className="font-medium">
                              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 px-3 py-1 rounded text-sm font-semibold">
                                {rango.rango_texto}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{rango.tipo_precio?.nombre}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              Bs. {rango.precio_unitario ? parseFloat(String(rango.precio_unitario)).toFixed(2) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {rango.vigente ? (
                                <span className="text-green-600 dark:text-green-400">Vigente</span>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">Vencido</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {rango.activo ? (
                                <Badge variant="default" className="bg-green-600">
                                  Activo
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Inactivo</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Link href={`/precio-rango/${rango.id}/edit?producto_id=${selectedProductoId}`}>
                                <Button size="sm" variant="outline">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(rango.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* GUÍA DE RANGO */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40">
            <CardHeader>
              <CardTitle className="text-base dark:text-blue-200">Información sobre Rangos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Rango:</strong> Define rangos de cantidad (ej: 1-9, 10-49, 50+)
              </p>
              <p>
                <strong>Tipo de Precio:</strong> Selecciona qué precio aplicar en cada rango
              </p>
              <p>
                <strong>Vigencia:</strong> Opcional - define fechas de validez del rango
              </p>
              <p>
                <strong>Nota:</strong> Los rangos NO deben solaparse. Sistema validará automáticamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open })}>
        <AlertDialogContent>
          <AlertDialogTitle>Eliminar Rango</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres eliminar este rango de precio? Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
