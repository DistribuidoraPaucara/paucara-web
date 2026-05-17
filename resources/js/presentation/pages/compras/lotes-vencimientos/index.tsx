import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import type { Pagination } from '@/domain/entities/shared';
import {
    Package,
    AlertTriangle,
    Search,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Package2
} from 'lucide-react';
import type { DetalleCompra } from '@/domain/entities/compras';
import type { Producto } from '@/domain/entities/productos';
import type { Proveedor } from '@/domain/entities/proveedores';

// Interfaces específicas para lotes
interface LoteDetalle extends DetalleCompra {
    compra: {
        id: number;
        numero: string;
        fecha: string;
        proveedor: Proveedor;
    };
    dias_para_vencer: number;
    estado_vencimiento: 'VIGENTE' | 'PROXIMO_VENCER' | 'VENCIDO' | 'CRITICO';
}

interface EstadisticasLotes {
    total_lotes: number;
    lotes_vigentes: number;
    lotes_proximos_vencer: number;
    lotes_vencidos: number;
    lotes_criticos: number;
    valor_total_inventario: number;
    valor_proximos_vencer: number;
    valor_vencidos: number;
}

interface Props {
    lotes: Pagination<LoteDetalle>;
    estadisticas: EstadisticasLotes;
    productos: Producto[];
    proveedores: Proveedor[];
    filtros: {
        producto_id?: string;
        proveedor_id?: string;
        estado_vencimiento?: string;
        dias_alerta?: string;
        q?: string;
    };
}

const GestionLotesVencimientos: React.FC<Props> = ({
    lotes,
    estadisticas,
    productos,
    proveedores,
    filtros
}) => {
    const [filtroLocal, setFiltroLocal] = useState(filtros);
    const [loteSeleccionado, setLoteSeleccionado] = useState<LoteDetalle | null>(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEstadoVencimientoColor = (estado: string) => {
        switch (estado) {
            case 'VIGENTE':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PROXIMO_VENCER':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'CRITICO':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'VENCIDO':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getEstadoVencimientoIcon = (estado: string) => {
        switch (estado) {
            case 'VIGENTE':
                return <CheckCircle className="w-4 h-4" />;
            case 'PROXIMO_VENCER':
                return <Clock className="w-4 h-4" />;
            case 'CRITICO':
                return <AlertTriangle className="w-4 h-4" />;
            case 'VENCIDO':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package2 className="w-4 h-4" />;
        }
    };

    const aplicarFiltros = () => {
        const params = new URLSearchParams();

        Object.entries(filtroLocal).forEach(([key, value]) => {
            if (value && value !== '') {
                params.set(key, value);
            }
        });

        window.location.href = `/compras/lotes-vencimientos?${params.toString()}`;
    };

    const limpiarFiltros = () => {
        setFiltroLocal({});
        window.location.href = '/compras/lotes-vencimientos';
    };

    const verDetalleLote = (lote: LoteDetalle) => {
        setLoteSeleccionado(lote);
        setMostrarDetalle(true);
    };

    return (
        <AppLayout>
            <Head title="Gestión de Lotes y Vencimientos" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gestión de Lotes y Vencimientos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Control de productos perecederos y fechas de vencimiento
                        </p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
                            <Package className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{estadisticas.total_lotes}</div>
                            <p className="text-xs text-muted-foreground">
                                Valor: {formatCurrency(estadisticas.valor_total_inventario)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {estadisticas.lotes_proximos_vencer}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Valor: {formatCurrency(estadisticas.valor_proximos_vencer)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {estadisticas.lotes_vencidos}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Valor: {formatCurrency(estadisticas.valor_vencidos)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Estado Crítico</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {estadisticas.lotes_criticos}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Requieren atención inmediata
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Filter className="w-5 h-5 mr-2" />
                            Filtros de Búsqueda
                        </CardTitle>
                        <CardDescription>
                            Utiliza los filtros para encontrar lotes específicos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Buscar
                                </label>
                                <Input
                                    placeholder="Número de lote, producto..."
                                    value={filtroLocal.q || ''}
                                    onChange={(e) => setFiltroLocal(prev => ({ ...prev, q: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Producto
                                </label>
                                <Select
                                    value={filtroLocal.producto_id || 'all'}
                                    onValueChange={(value) => setFiltroLocal(prev => ({ ...prev, producto_id: value === 'all' ? '' : value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los productos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los productos</SelectItem>
                                        {productos.map((producto) => (
                                            <SelectItem key={producto.id} value={producto.id.toString()}>
                                                {producto.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Proveedor
                                </label>
                                <Select
                                    value={filtroLocal.proveedor_id || 'all'}
                                    onValueChange={(value) => setFiltroLocal(prev => ({ ...prev, proveedor_id: value === 'all' ? '' : value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los proveedores" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los proveedores</SelectItem>
                                        {proveedores.map((proveedor) => (
                                            <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                                                {proveedor.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Estado de Vencimiento
                                </label>
                                <Select
                                    value={filtroLocal.estado_vencimiento || 'all'}
                                    onValueChange={(value) => setFiltroLocal(prev => ({ ...prev, estado_vencimiento: value === 'all' ? '' : value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="VIGENTE">Vigente</SelectItem>
                                        <SelectItem value="PROXIMO_VENCER">Próximo a Vencer</SelectItem>
                                        <SelectItem value="CRITICO">Crítico</SelectItem>
                                        <SelectItem value="VENCIDO">Vencido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                            <Button variant="outline" onClick={limpiarFiltros}>
                                Limpiar
                            </Button>
                            <Button onClick={aplicarFiltros}>
                                <Search className="w-4 h-4 mr-2" />
                                Aplicar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de Lotes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Lotes</CardTitle>
                        <CardDescription>
                            {lotes.total} lote{lotes.total !== 1 ? 's' : ''} encontrado{lotes.total !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {lotes.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    No se encontraron lotes
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    No hay lotes que coincidan con los filtros aplicados.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Lote
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Compra
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Cantidad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Fecha Vencimiento
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Valor
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {lotes.data.map((lote) => (
                                            <tr key={lote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {lote.producto.nombre}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {lote.producto.codigo}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                        {lote.lote || 'Sin lote'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {lote.compra.numero}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {lote.compra.proveedor.nombre}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {lote.cantidad}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {lote.fecha_vencimiento ? formatDate(lote.fecha_vencimiento) : 'Sin fecha'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {lote.dias_para_vencer >= 0
                                                                ? `${lote.dias_para_vencer} días`
                                                                : `Vencido hace ${Math.abs(lote.dias_para_vencer)} días`
                                                            }
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={`${getEstadoVencimientoColor(lote.estado_vencimiento)} flex items-center w-fit`}>
                                                        {getEstadoVencimientoIcon(lote.estado_vencimiento)}
                                                        <span className="ml-1">
                                                            {lote.estado_vencimiento.replace('_', ' ')}
                                                        </span>
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                                                    <div className="font-mono">
                                                        {formatCurrency(lote.subtotal)}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => verDetalleLote(lote)}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modal de Detalle */}
                <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Detalle del Lote
                            </DialogTitle>
                            <DialogDescription>
                                Información completa del lote seleccionado
                            </DialogDescription>
                        </DialogHeader>

                        {loteSeleccionado && (
                            <div className="space-y-6">
                                {/* Información del Producto */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Producto</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Nombre:</span>
                                                <span className="font-medium">{loteSeleccionado.producto.nombre}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Código:</span>
                                                <span className="font-medium">{loteSeleccionado.producto.codigo || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Lote:</span>
                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                                                    {loteSeleccionado.lote || 'Sin lote'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Compra</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Número:</span>
                                                <span className="font-medium">{loteSeleccionado.compra.numero}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Fecha:</span>
                                                <span className="font-medium">{formatDate(loteSeleccionado.compra.fecha)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Proveedor:</span>
                                                <span className="font-medium">{loteSeleccionado.compra.proveedor.nombre}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Vencimiento */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                        Estado de Vencimiento
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <span className="block text-sm text-gray-600 mb-1">Estado:</span>
                                            <Badge className={getEstadoVencimientoColor(loteSeleccionado.estado_vencimiento)}>
                                                {getEstadoVencimientoIcon(loteSeleccionado.estado_vencimiento)}
                                                <span className="ml-1">
                                                    {loteSeleccionado.estado_vencimiento.replace('_', ' ')}
                                                </span>
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="block text-sm text-gray-600 mb-1">Fecha Vencimiento:</span>
                                            <span className="font-medium">
                                                {loteSeleccionado.fecha_vencimiento
                                                    ? formatDate(loteSeleccionado.fecha_vencimiento)
                                                    : 'Sin fecha'
                                                }
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-sm text-gray-600 mb-1">Días para vencer:</span>
                                            <span className={`font-medium ${loteSeleccionado.dias_para_vencer < 0 ? 'text-red-600' :
                                                loteSeleccionado.dias_para_vencer <= 7 ? 'text-orange-600' :
                                                    loteSeleccionado.dias_para_vencer <= 30 ? 'text-yellow-600' :
                                                        'text-green-600'
                                                }`}>
                                                {loteSeleccionado.dias_para_vencer >= 0
                                                    ? `${loteSeleccionado.dias_para_vencer} días`
                                                    : `Vencido hace ${Math.abs(loteSeleccionado.dias_para_vencer)} días`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información Financiera */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="block text-sm text-gray-600 mb-1">Cantidad:</span>
                                        <span className="font-medium text-lg">{loteSeleccionado.cantidad}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-600 mb-1">Precio Unitario:</span>
                                        <span className="font-medium text-lg">
                                            {formatCurrency(loteSeleccionado.precio_unitario)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-600 mb-1">Subtotal:</span>
                                        <span className="font-medium text-lg">
                                            {formatCurrency(loteSeleccionado.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default GestionLotesVencimientos;
