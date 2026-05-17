import React, { useState, Fragment } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Plus, Eye, CreditCard, AlertTriangle, ChevronDown, ChevronUp, Trash2, Printer } from 'lucide-react';
import RegistrarPagoModal from '@/presentation/components/clientes/RegistrarPagoModal';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { toast } from 'react-toastify';
import type { CuentasPorPagarIndexResponse, CuentaPorPagar, FiltrosCuentasPorPagar } from '@/domain/entities/compras';

// Helper functions
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-BO');
};

interface Props extends InertiaPageProps {
    cuentasPorPagar: CuentasPorPagarIndexResponse;
}

const CuentasPorPagarIndex: React.FC<Props> = ({ cuentasPorPagar }) => {
    // Inicializar hooks con valores por defecto seguros
    const filtrosDefault: FiltrosCuentasPorPagar = {};
    const [filtros, setFiltros] = useState<FiltrosCuentasPorPagar>(cuentasPorPagar?.filtros || filtrosDefault);
    const [modalDetalle, setModalDetalle] = useState<{ isOpen: boolean; cuenta?: CuentaPorPagar }>({ isOpen: false });

    // Estados para expandir/contraer filas de pagos
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    // Estados para el modal de impresión
    const [modalImpresionOpen, setModalImpresionOpen] = useState(false);
    const [cuentaAImprimir, setCuentaAImprimir] = useState<CuentaPorPagar | null>(null);

    const toggleRowExpanded = (cuentaId: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(cuentaId)) {
            newExpandedRows.delete(cuentaId);
        } else {
            newExpandedRows.add(cuentaId);
        }
        setExpandedRows(newExpandedRows);
    };

    // Estados para el modal de pago
    const [mostrarModalPago, setMostrarModalPago] = useState(false);
    const [cuentaSeleccionadaPago, setCuentaSeleccionadaPago] = useState<CuentaPorPagar | null>(null);
    const [cuentasDelProveedor, setCuentasDelProveedor] = useState<any[]>([]);

    const handleAbrirModalPago = (cuenta: CuentaPorPagar) => {
        // Cargar cuentas del proveedor ANTES de abrir el modal
        cargarCuentasDelProveedor(cuenta.compra?.proveedor?.id);

        // Esperar un tick para asegurar que cuentasDelProveedor se actualice antes de abrir
        setTimeout(() => {
            setCuentaSeleccionadaPago(cuenta);
            setMostrarModalPago(true);
            console.log('✅ Modal de pago abierto con cuenta preseleccionada:', {
                cuenta_id: cuenta.id,
                proveedor_id: cuenta.compra?.proveedor?.id,
                saldo: cuenta.saldo_pendiente
            });
        }, 50);
    };

    const cargarCuentasDelProveedor = async (proveedorId?: number) => {
        if (!proveedorId) return;
        try {
            // Filtrar cuentas pendientes del proveedor actual de los datos que ya tenemos
            const cuentasPendientes = cuentasPorPagar.cuentas_por_pagar.data.filter(
                (c) => c.compra?.proveedor?.id === proveedorId
            );
            const cuentasFormateadas = cuentasPendientes.map((c) => ({
                id: c.id,
                venta_id: c.compra_id, // Para compras, usamos compra_id como venta_id
                numero_venta: c.compra?.numero || `#${c.compra_id}`,
                referencia_documento: '',
                fecha_venta: c.compra?.fecha || '',
                monto_original: c.monto_original,
                saldo_pendiente: c.saldo_pendiente,
                fecha_vencimiento: c.fecha_vencimiento,
                dias_vencido: c.dias_vencido,
                estado: c.estado,
            }));
            setCuentasDelProveedor(cuentasFormateadas);
            console.log('✅ Cuentas cargadas para proveedor:', { proveedorId, cantidad: cuentasFormateadas.length, cuentas: cuentasFormateadas });
        } catch (error) {
            console.error('Error cargando cuentas del proveedor:', error);
        }
    };

    const handlePagoRegistrado = () => {
        // Recargar la página para actualizar los datos
        router.get('/compras/cuentas-por-pagar');
    };

    // Estados para anular pagos
    const [pagoAAnular, setPagoAAnular] = useState<{ id: number; monto: number; cuenta_id: number } | null>(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [anulandoPago, setAnulandoPago] = useState(false);

    const handleAnularPago = async () => {
        if (!pagoAAnular) return;

        try {
            setAnulandoPago(true);
            const response = await fetch(`/compras/cuentas-por-pagar/${pagoAAnular.cuenta_id}/anular-pago/${pagoAAnular.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    motivo: motivoAnulacion,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`✅ Pago de ${formatCurrency(pagoAAnular.monto)} anulado exitosamente`);
                setPagoAAnular(null);
                setMotivoAnulacion('');
                router.get('/compras/cuentas-por-pagar');
            } else {
                toast.error(data.message || 'Error al anular el pago');
            }
        } catch (error) {
            console.error('Error anulando pago:', error);
            toast.error('Error al anular el pago');
        } finally {
            setAnulandoPago(false);
        }
    };

    // Validación defensiva para evitar errores si cuentasPorPagar es undefined
    if (!cuentasPorPagar || !cuentasPorPagar.filtros) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cargando...</h2>
                        <p className="text-gray-600 dark:text-gray-400">Por favor espere mientras se cargan los datos.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const handleFiltroChange = (field: keyof FiltrosCuentasPorPagar, value: string | boolean) => {
        const nuevosFiltros = { ...filtros, [field]: value };
        setFiltros(nuevosFiltros);

        // Aplicar filtros inmediatamente  
        router.get('/compras/cuentas-por-pagar', nuevosFiltros as Record<string, string | boolean | undefined>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios: FiltrosCuentasPorPagar = {};
        setFiltros(filtrosVacios);
        router.get('/compras/cuentas-por-pagar');
    };

    const getEstadoBadge = (estado: string) => {
        const colores = {
            'PENDIENTE': 'default',
            'PAGADO': 'secondary',
            'VENCIDO': 'destructive',
            'PARCIAL': 'outline'
        };
        return colores[estado as keyof typeof colores] || 'default';
    };

    const getUrgenciaBadge = (diasVencido: number) => {
        if (diasVencido > 30) return 'destructive';
        if (diasVencido > 15) return 'secondary';
        if (diasVencido > 0) return 'default';
        return 'outline';
    };

    const getEstadoPagoBadge = (estado: string) => {
        const colores = {
            'REGISTRADO': 'secondary',
            'CONFIRMADO': 'secondary',
            'PENDIENTE': 'default',
            'PROCESANDO': 'default',
            'RECHAZADO': 'destructive',
            'ANULADO': 'destructive',
        };
        return colores[estado as keyof typeof colores] || 'default';
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Compras', href: '/compras' },
            { title: 'Cuentas por Pagar', href: '/compras/cuentas-por-pagar' }
        ]}>
            <Head title="Cuentas por Pagar" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cuentas por Pagar</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gestión de deudas con proveedores</p>
                    </div>
                    {/* <Button
                        onClick={() => router.get('/compras/cuentas-por-pagar/create')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Cuenta por Pagar
                    </Button> */}
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pendiente</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(cuentasPorPagar.estadisticas.monto_total_pendiente)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vencidas</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(cuentasPorPagar.estadisticas.monto_total_vencido)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cuentas Vencidas</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {cuentasPorPagar.estadisticas.cuentas_vencidas}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio Días</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {cuentasPorPagar.estadisticas.promedio_dias_pago}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Buscar</label>
                                <Input
                                    value={filtros.q || ''}
                                    onChange={(e) => handleFiltroChange('q', e.target.value)}
                                    placeholder="Buscar por proveedor, número..."
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                                <select
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    value={filtros.proveedor_id || ''}
                                    onChange={(e) => handleFiltroChange('proveedor_id', e.target.value)}
                                >
                                    <option value="">Todos los proveedores</option>
                                    {cuentasPorPagar.datosParaFiltros.proveedores.map((proveedor) => (
                                        <option key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                <select
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    value={filtros.estado || ''}
                                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="PAGADO">Pagado</option>
                                    <option value="VENCIDO">Vencido</option>
                                    <option value="PARCIAL">Parcial</option>
                                </select>
                            </div>

                            <div className="flex items-end space-x-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={filtros.solo_vencidas || false}
                                        onChange={(e) => handleFiltroChange('solo_vencidas', e.target.checked)}
                                        className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Solo vencidas</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha vencimiento desde</label>
                                <Input
                                    type="date"
                                    value={filtros.fecha_vencimiento_desde || ''}
                                    onChange={(e) => handleFiltroChange('fecha_vencimiento_desde', e.target.value)}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha vencimiento hasta</label>
                                <Input
                                    type="date"
                                    value={filtros.fecha_vencimiento_hasta || ''}
                                    onChange={(e) => handleFiltroChange('fecha_vencimiento_hasta', e.target.value)}
                                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={limpiarFiltros}
                                variant="outline"
                            >
                                Limpiar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de Cuentas por Pagar */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Compra
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Proveedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Monto Original
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Vencimiento
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {cuentasPorPagar.cuentas_por_pagar.data.map((cuenta) => (
                                    <React.Fragment key={cuenta.id}>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {cuenta.compra?.numero || `#${cuenta.compra_id}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {cuenta.compra?.proveedor?.nombre || 'Sin proveedor'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Mont. Orig.: {formatCurrency(cuenta.monto_original)}
                                                </p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Saldo: {formatCurrency(cuenta.saldo_pendiente)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(cuenta.fecha_vencimiento)}
                                                </p>
                                                <p>
                                                    <Badge variant={getEstadoBadge(cuenta.estado) as "default" | "secondary" | "destructive" | "outline"}>
                                                        {cuenta.estado}
                                                    </Badge>
                                                </p>
                                                <p>
                                                    <Badge variant={getUrgenciaBadge(cuenta.dias_vencido) as "default" | "secondary" | "destructive" | "outline"}>
                                                        {cuenta.dias_vencido > 0 ? `${cuenta.dias_vencido} días` : 'Al día'}
                                                    </Badge>
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {cuenta.pagos && cuenta.pagos.length > 0 && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => toggleRowExpanded(cuenta.id)}
                                                            title={expandedRows.has(cuenta.id) ? 'Ocultar pagos' : 'Mostrar pagos'}
                                                        >
                                                            {expandedRows.has(cuenta.id) ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setModalDetalle({ isOpen: true, cuenta })}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {cuenta.estado !== 'PAGADO' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAbrirModalPago(cuenta)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Pagar
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setCuentaAImprimir(cuenta);
                                                            setModalImpresionOpen(true);
                                                        }}
                                                        title="Imprimir"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(cuenta.id) && cuenta.pagos && cuenta.pagos.length > 0 && (
                                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                <td colSpan={8} className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Historial de Pagos</h4>
                                                        <div className="space-y-2">
                                                            {cuenta.pagos.map((pago) => (
                                                                <div
                                                                    key={pago.id}
                                                                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                                                >
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {formatCurrency(pago.monto)}
                                                                            </p>
                                                                            {pago.estado && (
                                                                                <Badge variant={getEstadoPagoBadge(pago.estado) as "default" | "secondary" | "destructive" | "outline"}>
                                                                                    {pago.estado}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {formatDate(pago.fecha_pago)} - {pago.tipo_pago?.nombre || 'Sin tipo'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {pago.observaciones && (
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                                {pago.observaciones}
                                                                            </p>
                                                                        )}
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => setPagoAAnular({ id: pago.id, monto: pago.monto, cuenta_id: cuenta.id })}
                                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                            title="Anular pago"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {cuentasPorPagar.cuentas_por_pagar.data.length === 0 && (
                        <div className="text-center py-12">
                            <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay cuentas por pagar</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron cuentas con los filtros aplicados.</p>
                        </div>
                    )}
                </Card>

                {/* Modal de Detalle */}
                <Dialog
                    open={modalDetalle.isOpen}
                    onOpenChange={() => setModalDetalle({ isOpen: false })}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detalle de Cuenta por Pagar</DialogTitle>
                        </DialogHeader>
                        {modalDetalle.cuenta && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compra</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {modalDetalle.cuenta.compra?.numero || `#${modalDetalle.cuenta.compra_id}`}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {modalDetalle.cuenta.compra?.proveedor?.nombre || 'Sin proveedor'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto Original</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(modalDetalle.cuenta.monto_original)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Saldo Pendiente</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(modalDetalle.cuenta.saldo_pendiente)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Vencimiento</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {formatDate(modalDetalle.cuenta.fecha_vencimiento)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                        <Badge variant={getEstadoBadge(modalDetalle.cuenta.estado) as "default" | "secondary" | "destructive" | "outline"}>
                                            {modalDetalle.cuenta.estado}
                                        </Badge>
                                    </div>
                                </div>

                                {modalDetalle.cuenta.observaciones && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {modalDetalle.cuenta.observaciones}
                                        </p>
                                    </div>
                                )}

                                {modalDetalle.cuenta.pagos && modalDetalle.cuenta.pagos.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Historial de Pagos</label>
                                        <div className="space-y-2">
                                            {modalDetalle.cuenta.pagos.map((pago) => (
                                                <div key={pago.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatCurrency(pago.monto)}
                                                            </p>
                                                            {pago.estado && (
                                                                <Badge variant={getEstadoPagoBadge(pago.estado) as "default" | "secondary" | "destructive" | "outline"}>
                                                                    {pago.estado}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatDate(pago.fecha_pago)} - {pago.tipo_pago?.nombre}
                                                        </p>
                                                    </div>
                                                    {pago.observaciones && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                            {pago.observaciones}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setModalDetalle({ isOpen: false })}
                                    >
                                        Cerrar
                                    </Button>
                                    {modalDetalle.cuenta.estado !== 'PAGADO' && (
                                        <Button
                                            onClick={() => {
                                                setModalDetalle({ isOpen: false });
                                                handleAbrirModalPago(modalDetalle.cuenta!);
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Registrar Pago
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Modal para Registrar Pago */}
                <RegistrarPagoModal
                    show={mostrarModalPago}
                    onHide={() => {
                        setMostrarModalPago(false);
                        setCuentaSeleccionadaPago(null);
                    }}
                    clienteId={0}
                    cuentasPendientes={cuentasDelProveedor}
                    onPagoRegistrado={handlePagoRegistrado}
                    cuentaIdPreseleccionada={cuentaSeleccionadaPago?.id}
                    tipo="compras"
                    verificarCaja={false}
                    tipos_pago={cuentasPorPagar?.datosParaFiltros?.tipos_pago || []}
                />

                {/* Modal de confirmación para anular pago */}
                {pagoAAnular && (
                    <Dialog open={!!pagoAAnular} onOpenChange={() => {
                        setPagoAAnular(null);
                        setMotivoAnulacion('');
                    }}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                    ⚠️ Anular Pago
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        ¿Está seguro de que desea anular este pago de <strong>{formatCurrency(pagoAAnular.monto)}</strong>?
                                        <p className="text-xs mt-2">
                                            Esta acción no puede deshacerse. Se revertirán todos los movimientos asociados.
                                        </p>
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                                        Motivo de anulación (opcional)
                                    </label>
                                    <textarea
                                        value={motivoAnulacion}
                                        onChange={(e) => setMotivoAnulacion(e.target.value)}
                                        placeholder="Ej: Pago registrado erróneamente, proveedor no confirma..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                                        rows={3}
                                        disabled={anulandoPago}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setPagoAAnular(null);
                                        setMotivoAnulacion('');
                                    }}
                                    disabled={anulandoPago}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleAnularPago}
                                    disabled={anulandoPago}
                                    className="flex-1"
                                >
                                    {anulandoPago ? '⏳ Anulando...' : '❌ Anular Pago'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Modal de Impresión */}
                {cuentaAImprimir && (
                    <OutputSelectionModal
                        isOpen={modalImpresionOpen}
                        onClose={() => {
                            setModalImpresionOpen(false);
                            setCuentaAImprimir(null);
                        }}
                        documentoId={cuentaAImprimir.id}
                        tipoDocumento="cuenta-por-pagar"
                        documentoInfo={{
                            numero: `#${cuentaAImprimir.id}`,
                            fecha: cuentaAImprimir.fecha_vencimiento,
                            monto: cuentaAImprimir.saldo_pendiente,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default CuentasPorPagarIndex;
