import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Almacen } from '@/domain/entities/almacenes';
import type { StockProducto } from '@/domain/entities/movimientos-inventario';
import { Id, Pagination } from '@/domain/entities/shared';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import { Button } from '@/presentation/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';

interface MermaMovimiento {
    id: number;
    cantidad: number;
    numero_documento: string;
    producto?: {
        id: number;
        nombre: string;
        sku: string;
    };
}

interface MermaInventario {
    id: number;
    numero: string;
    almacen_id: number;
    user_id: number;
    tipo_merma: string;
    cantidad_productos: number;
    costo_total: number;
    observacion?: string;
    estado: 'pendiente' | 'procesado';
    created_at: string;
    updated_at: string;
    almacen?: {
        id: number;
        nombre: string;
    };
    user?: {
        id: number;
        name: string;
    };
    movimientos?: MermaMovimiento[];
}

interface PageProps extends InertiaPageProps {
    almacenes: Almacen[];
    stock_productos: StockProducto[];
    almacen_seleccionado?: number;
    tipo_merma_filtro?: string;
    mermas_inventario?: Pagination<MermaInventario>;
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Mermas',
        href: '/inventario/merma',
    },
];

export default function MermaPage({
    almacenes,
    almacen_seleccionado = 0,
    tipo_merma_filtro = '',
    mermas_inventario = { data: [], current_page: 1, last_page: 1, total: 0, per_page: 15 },
}: PageProps) {
    const [mermaSeleccionada, setMermaSeleccionada] = useState<MermaInventario | null>(null);
    const [showDetalles, setShowDetalles] = useState(false);

    const handleFiltroAlmacen = (almacen_id: string) => {
        router.get('/inventario/merma', {
            almacen_id: almacen_id ? parseInt(almacen_id) : undefined,
            tipo_merma: tipo_merma_filtro || undefined,
        });
    };

    const handleFiltroTipoMerma = (tipo: string) => {
        router.get('/inventario/merma', {
            almacen_id: almacen_seleccionado || undefined,
            tipo_merma: tipo || undefined,
        });
    };

    const handlePaginacion = (page: number) => {
        router.get('/inventario/merma', {
            page,
            almacen_id: almacen_seleccionado || undefined,
            tipo_merma: tipo_merma_filtro || undefined,
        });
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatCosto = (costo: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'BOB',
        }).format(costo);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mermas de Inventario" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">📦 Mermas de Inventario</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Historial de mermas registradas en el sistema
                    </p>
                </div>

                {/* Filtros */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Almacén</label>
                        <Select value={almacen_seleccionado?.toString() || ''} onValueChange={handleFiltroAlmacen}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los almacenes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Todos los almacenes</SelectItem>
                                {almacenes.map((almacen) => (
                                    <SelectItem key={almacen.id} value={almacen.id.toString()}>
                                        {almacen.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Merma</label>
                        <Select value={tipo_merma_filtro || ''} onValueChange={handleFiltroTipoMerma}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los tipos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Todos los tipos</SelectItem>
                                <SelectItem value="ROTURA">Rotura</SelectItem>
                                <SelectItem value="VENCIMIENTO">Vencimiento</SelectItem>
                                <SelectItem value="MERMA_GENERAL">Merma General</SelectItem>
                                <SelectItem value="OTRO">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tabla de Mermas */}
                <div className="rounded-lg border bg-white dark:bg-gray-900">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Número</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Almacén</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Productos</TableHead>
                                <TableHead className="text-right">Costo Total</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mermas_inventario.data && mermas_inventario.data.length > 0 ? (
                                mermas_inventario.data.filter(m => m !== null && m !== undefined).map((merma) => (
                                    <TableRow key={merma?.id}>
                                        <TableCell className="font-medium">{merma?.numero || '-'}</TableCell>
                                        <TableCell>{merma?.created_at ? formatFecha(merma.created_at) : '-'}</TableCell>
                                        <TableCell>{merma?.almacen?.nombre || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{merma?.tipo_merma || 'Sin tipo'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{merma?.cantidad_productos || 0}</TableCell>
                                        <TableCell className="text-right font-medium text-red-600">
                                            {merma?.costo_total ? formatCosto(merma.costo_total) : 'Bs 0.00'}
                                        </TableCell>
                                        <TableCell>{merma?.user?.name || '-'}</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setMermaSeleccionada(merma);
                                                    setShowDetalles(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        No hay mermas registradas
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación */}
                {mermas_inventario.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrando {(mermas_inventario.current_page - 1) * mermas_inventario.per_page + 1} a{' '}
                            {Math.min(mermas_inventario.current_page * mermas_inventario.per_page, mermas_inventario.total)}{' '}
                            de {mermas_inventario.total} mermas
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={mermas_inventario.current_page === 1}
                                onClick={() => handlePaginacion(mermas_inventario.current_page - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: mermas_inventario.last_page }).map((_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={mermas_inventario.current_page === i + 1 ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePaginacion(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={mermas_inventario.current_page === mermas_inventario.last_page}
                                onClick={() => handlePaginacion(mermas_inventario.current_page + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Modal de Detalles */}
                <Dialog open={showDetalles} onOpenChange={setShowDetalles}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detalle de Merma</DialogTitle>
                            <DialogDescription>
                                {mermaSeleccionada?.numero || 'Sin número'} - {mermaSeleccionada?.created_at ? formatFecha(mermaSeleccionada.created_at) : 'Sin fecha'}
                            </DialogDescription>
                        </DialogHeader>

                        {mermaSeleccionada && (
                            <div className="space-y-4">
                                {/* Información General */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Almacén</p>
                                        <p className="font-medium">{mermaSeleccionada?.almacen?.nombre || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Merma</p>
                                        <p className="font-medium">{mermaSeleccionada?.tipo_merma || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Usuario</p>
                                        <p className="font-medium">{mermaSeleccionada?.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Costo Total</p>
                                        <p className="font-medium text-red-600">
                                            {mermaSeleccionada?.costo_total ? formatCosto(mermaSeleccionada.costo_total) : 'Bs 0.00'}
                                        </p>
                                    </div>
                                </div>

                                {/* Observación */}
                                {mermaSeleccionada?.observacion && (
                                    <div className="py-4 border-b">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Observación</p>
                                        <p className="font-medium">{mermaSeleccionada?.observacion}</p>
                                    </div>
                                )}

                                {/* Productos */}
                                <div className="py-4">
                                    <h4 className="font-medium mb-3">Productos Mermas ({mermaSeleccionada?.movimientos?.length || 0})</h4>
                                    <div className="space-y-2">
                                        {mermaSeleccionada?.movimientos && mermaSeleccionada.movimientos.length > 0 ? (
                                            mermaSeleccionada.movimientos.map((mov) => (
                                                <div
                                                    key={mov?.id}
                                                    className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-800 rounded"
                                                >
                                                    <div>
                                                        <p className="font-medium">{mov?.producto?.nombre || 'Producto desconocido'}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            SKU: {mov?.producto?.sku || '-'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-red-600">
                                                            {mov?.cantidad ? Math.abs(mov.cantidad) : 0} unidades
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Sin productos registrados</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
