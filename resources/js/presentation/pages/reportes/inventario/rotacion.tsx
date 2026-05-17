import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { TrendingUp, TrendingDown, Package, RotateCcw } from 'lucide-react';
import type { RotacionPageProps } from '@/domain/entities/reportes';
import { formatNumber, formatDecimal, getRotacionBadge } from '@/lib/inventario.utils';
import { ExportButtons } from './stock-actual/components/ExportButtons';

export default function RotacionInventario({
    rotacion,
    estadisticas,
    filtros,
    almacenes,
    categorias,
}: RotacionPageProps) {

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Reportes', href: '#' },
            { title: 'Rotación', href: '#' }
        ]}>
            <Head title="Reporte de Rotación de Inventario" />

            <div className="space-y-6 p-4">
                {/* Header con Botones de Descarga */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Rotación de Inventario
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Análisis de movimiento y rotación de productos
                        </p>
                    </div>
                    {/* ✅ NUEVO: Botones de descarga */}
                    <ExportButtons
                        reportType="rotacion"
                        filters={filtros}
                    />
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RotateCcw className="h-5 w-5" />
                            Filtros de Búsqueda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                                    <Input
                                        id="fecha_inicio"
                                        name="fecha_inicio"
                                        type="date"
                                        defaultValue={filtros.fecha_inicio}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_fin">Fecha Fin</Label>
                                    <Input
                                        id="fecha_fin"
                                        name="fecha_fin"
                                        type="date"
                                        defaultValue={filtros.fecha_fin}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="almacen_id">Almacén</Label>
                                    <Select name="almacen_id" defaultValue={filtros.almacen_id || "all"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos los almacenes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los almacenes</SelectItem>
                                            {almacenes.map((almacen) => (
                                                <SelectItem key={almacen.id} value={almacen.id.toString()}>
                                                    {almacen.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoria_id">Categoría</Label>
                                    <Select name="categoria_id" defaultValue={filtros.categoria_id || "all"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas las categorías" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las categorías</SelectItem>
                                            {categorias.map((categoria) => (
                                                <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                    {categoria.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button type="submit">
                                    Aplicar Filtros
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.location.href = '/reportes/inventario/rotacion'}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Productos con Movimiento
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatNumber(estadisticas.productos_con_movimiento)}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Productos sin Movimiento
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatNumber(estadisticas.productos_sin_movimiento)}
                                    </p>
                                </div>
                                <TrendingDown className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Rotación Promedio
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatDecimal(estadisticas.rotacion_promedio)}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de Rotación */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Rotación de Productos</span>
                            <Badge variant="outline">
                                {formatNumber(rotacion.total)} productos
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Total Salidas</TableHead>
                                        <TableHead className="text-center">Cantidad Vendida</TableHead>
                                        <TableHead className="text-center">Stock Promedio</TableHead>
                                        <TableHead className="text-center">Índice Rotación</TableHead>
                                        <TableHead className="text-center">Nivel</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rotacion.data.length > 0 ? (
                                        rotacion.data.map((item) => {
                                            const badgeInfo = getRotacionBadge(item.indice_rotacion);
                                            return (
                                                <TableRow key={item.producto_id}>
                                                    <TableCell className="font-medium">
                                                        {item.producto?.nombre || 'Producto no encontrado'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {formatNumber(item.total_salidas)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {formatNumber(item.cantidad_vendida)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {formatDecimal(item.stock_promedio)}
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">
                                                        {formatDecimal(item.indice_rotacion)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={badgeInfo.badge}>
                                                            {badgeInfo.label}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                    <p className="text-gray-500">
                                                        No se encontraron productos con movimientos
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginación */}
                        {rotacion.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-500">
                                    Mostrando {((rotacion.current_page - 1) * rotacion.per_page) + 1} a{' '}
                                    {Math.min(rotacion.current_page * rotacion.per_page, rotacion.total)} de{' '}
                                    {formatNumber(rotacion.total)} resultados
                                </div>
                                <div className="flex gap-2">
                                    {rotacion.links.map((link, index) => {
                                        if (!link.url) return null;

                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => window.location.href = link.url!}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
