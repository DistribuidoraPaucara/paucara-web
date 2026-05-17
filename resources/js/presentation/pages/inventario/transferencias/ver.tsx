import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';
import { Button } from '@/presentation/components/ui/button';
import type { TransferenciaInventario } from '@/domain/entities/transferencias-inventario';
import { ESTADOS_TRANSFERENCIA } from '@/presentation/config/inventory.config';
import EstadoBadge from '@/presentation/components/Inventario/EstadoBadge';
import {
    Package,
    Truck,
    User,
    Calendar,
    FileText,
    Send,
    CheckCircle,
    XCircle,
    ArrowRight,
    Edit,
    X
} from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface PageProps extends InertiaPageProps {
    transferencia: TransferenciaInventario;
}

export default function VerTransferencia() {
    const { props } = usePage<PageProps>();
    const { transferencia } = props;
    const { can } = useAuth();

    const [mostrarModalCancelacion, setMostrarModalCancelacion] = useState(false);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');
    const [cancelando, setCancelando] = useState(false);

    const [mostrarModalRecepcion, setMostrarModalRecepcion] = useState(false);
    const [cantidadesRecibidas, setCantidadesRecibidas] = useState<{ [key: number]: number }>({});
    const [recibiendo, setRecibiendo] = useState(false);

    const breadcrumbs = [
        {
            title: 'Inventario',
            href: '/inventario',
        },
        {
            title: 'Transferencias',
            href: '/inventario/transferencias',
        },
        {
            title: `Transferencia ${transferencia.numero}`,
            href: `/inventario/transferencias/${transferencia.id}`,
        },
    ];

    const enviarTransferencia = async () => {
        if (!confirm('¿Confirmas el envío de esta transferencia?')) return;

        try {
            const response = await fetch(`/inventario/transferencias/${transferencia.id}/enviar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                NotificationService.success('Transferencia enviada exitosamente');
                router.reload();
            } else {
                NotificationService.error(result.message || 'Error al enviar transferencia');
            }
        } catch {
            NotificationService.error('Error al procesar la solicitud');
        }
    };

    const recibirTransferencia = () => {
        // Inicializar cantidades recibidas con las cantidades enviadas
        const cantidadesIniciales: { [key: number]: number } = {};
        transferencia.detalles.forEach((detalle, index) => {
            cantidadesIniciales[index] = detalle.cantidad;
        });
        setCantidadesRecibidas(cantidadesIniciales);
        setMostrarModalRecepcion(true);
    };

    const confirmarRecepcion = async () => {
        setRecibiendo(true);
        try {
            const response = await fetch(`/inventario/transferencias/${transferencia.id}/recibir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ cantidades_recibidas: cantidadesRecibidas }),
            });

            const result = await response.json();

            if (result.success) {
                NotificationService.success('Transferencia recibida exitosamente');
                setMostrarModalRecepcion(false);
                router.reload();
            } else {
                NotificationService.error(result.message || 'Error al recibir transferencia');
            }
        } catch {
            NotificationService.error('Error al procesar la solicitud');
        } finally {
            setRecibiendo(false);
        }
    };

    const cancelarTransferencia = () => {
        setMostrarModalCancelacion(true);
    };

    const confirmarCancelacion = async () => {
        if (!motivoCancelacion.trim()) {
            NotificationService.error('Debe ingresar un motivo de cancelación');
            return;
        }

        if (motivoCancelacion.length > 500) {
            NotificationService.error('El motivo no puede exceder 500 caracteres');
            return;
        }

        setCancelando(true);
        try {
            const response = await fetch(`/inventario/transferencias/${transferencia.id}/cancelar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo_cancelacion: motivoCancelacion }),
            });

            const result = await response.json();

            if (result.success) {
                NotificationService.success('Transferencia cancelada exitosamente');
                setMostrarModalCancelacion(false);
                setMotivoCancelacion('');
                router.reload();
            } else {
                NotificationService.error(result.message || 'Error al cancelar transferencia');
            }
        } catch {
            NotificationService.error('Error al procesar la solicitud');
        } finally {
            setCancelando(false);
        }
    };

    const getAccionIcon = (accion: string) => {
        switch (accion) {
            case 'enviar': return <Send className="w-4 h-4" />;
            case 'recibir': return <CheckCircle className="w-4 h-4" />;
            case 'cancelar': return <XCircle className="w-4 h-4" />;
            case 'edit': return <Edit className="w-4 h-4" />;
            default: return null;
        }
    };

    const ejecutarAccion = (accion: string) => {
        switch (accion) {
            case 'enviar': return enviarTransferencia();
            case 'recibir': return recibirTransferencia();
            case 'cancelar': return cancelarTransferencia();
            default: return;
        }
    };

    const puedeEjecutarAccion = (accion: string): boolean => {
        switch (accion) {
            case 'enviar': return can('inventario.transferencias.enviar');
            case 'recibir': return can('inventario.transferencias.recibir');
            case 'cancelar': return can('inventario.transferencias.cancelar');
            case 'edit': return can('inventario.transferencias.edit');
            default: return false;
        }
    };

    const acciones = ESTADOS_TRANSFERENCIA[transferencia.estado]?.actions || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transferencia ${transferencia.numero}`} />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                {transferencia.numero}
                            </h2>
                            <EstadoBadge estado={transferencia.estado} />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Transferencia de inventario entre almacenes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {acciones.map((accion) => (
                            puedeEjecutarAccion(accion) && (
                                <Button
                                    key={accion}
                                    variant={accion === 'cancelar' ? 'outline' : 'default'}
                                    onClick={() => ejecutarAccion(accion)}
                                    className={accion === 'cancelar' ? 'text-red-600 border-red-600 hover:bg-red-50' : ''}
                                >
                                    {getAccionIcon(accion)}
                                    <span className="ml-2 capitalize">{accion}</span>
                                </Button>
                            )
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Datos Generales */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Información General
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Almacén de Origen</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {transferencia.almacen_origen.nombre}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <ArrowRight className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Almacén de Destino</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {transferencia.almacen_destino.nombre}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Creado por</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {transferencia.creado_por.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Creación</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {new Date(transferencia.fecha).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {transferencia.fecha_envio && (
                                        <div className="flex items-center gap-3">
                                            <Send className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Envío</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {new Date(transferencia.fecha_envio).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {transferencia.fecha_recepcion && (
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Recepción</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {new Date(transferencia.fecha_recepcion).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {transferencia.vehiculo && (
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Vehículo</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {transferencia.vehiculo.placa} - {transferencia.vehiculo.modelo}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {transferencia.chofer && (
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Chofer</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {transferencia.chofer.user.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {transferencia.observaciones && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Observaciones</p>
                                    </div>
                                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        {transferencia.observaciones}
                                    </p>
                                </div>
                            )}

                            {transferencia.motivo_cancelacion && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                        <p className="text-sm text-red-600 dark:text-red-400">Motivo de Cancelación</p>
                                    </div>
                                    <p className="text-gray-900 dark:text-gray-100 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                                        {transferencia.motivo_cancelacion}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Productos */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Productos Transferidos
                            </h3>

                            {transferencia.detalles.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No hay productos en esta transferencia
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                                    Producto
                                                </th>
                                                <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                                    Cantidad Enviada
                                                </th>
                                                {transferencia.estado === 'RECIBIDO' && (
                                                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                                        Cantidad Recibida
                                                    </th>
                                                )}
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                                    Lote
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                                                    F. Vencimiento
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transferencia.detalles.map((detalle, index) => (
                                                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {detalle.producto.nombre}
                                                        </div>
                                                        {detalle.observaciones && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {detalle.observaciones}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="font-medium">{detalle.cantidad}</span>
                                                    </td>
                                                    {transferencia.estado === 'RECIBIDO' && (
                                                        <td className="py-3 px-4 text-center">
                                                            <span className={`font-medium ${detalle.cantidad_recibida === detalle.cantidad
                                                                ? 'text-green-600'
                                                                : 'text-orange-600'
                                                                }`}>
                                                                {detalle.cantidad_recibida || 0}
                                                            </span>
                                                        </td>
                                                    )}
                                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                        {detalle.lote || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                        {detalle.fecha_vencimiento
                                                            ? new Date(detalle.fecha_vencimiento).toLocaleDateString()
                                                            : '-'
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel Lateral - Resumen */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Resumen
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                                    <EstadoBadge estado={transferencia.estado} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total productos:</span>
                                    <span className="font-medium">{transferencia.total_productos}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total unidades:</span>
                                    <span className="font-medium">{transferencia.total_cantidad}</span>
                                </div>
                            </div>
                        </div>

                        {/* Historial de Estados */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Historial
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Creada</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(transferencia.fecha).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {transferencia.fecha_envio && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Enviada</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(transferencia.fecha_envio).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {transferencia.fecha_recepcion && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Recibida</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(transferencia.fecha_recepcion).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {transferencia.estado === 'CANCELADO' && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Cancelada</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Por motivo específico
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Recepción - Confirmar Cantidades */}
            {mostrarModalRecepcion && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Confirmar Recepción de Transferencia
                            </h2>
                            <button
                                onClick={() => {
                                    setMostrarModalRecepcion(false);
                                    setCantidadesRecibidas({});
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    ℹ️ Verifica las cantidades recibidas. Si hay diferencias con lo enviado, ajusta los valores.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Producto</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Enviado</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Recibido</th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Diferencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transferencia.detalles.map((detalle, index) => {
                                            const recibido = cantidadesRecibidas[index] || detalle.cantidad;
                                            const diferencia = recibido - detalle.cantidad;
                                            return (
                                                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                                        <div className="font-medium">{detalle.producto?.nombre}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{detalle.producto?.codigo}</div>
                                                    </td>
                                                    <td className="text-center py-3 px-4 text-gray-900 dark:text-gray-100">
                                                        {detalle.cantidad}
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={recibido}
                                                            onChange={(e) => {
                                                                const nuevoValor = parseInt(e.target.value) || 0;
                                                                setCantidadesRecibidas(prev => ({
                                                                    ...prev,
                                                                    [index]: nuevoValor
                                                                }));
                                                            }}
                                                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
                                                        />
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                            diferencia === 0
                                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                                                                : diferencia < 0
                                                                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                                                                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                                                        }`}>
                                                            {diferencia > 0 ? '+' : ''}{diferencia}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setMostrarModalRecepcion(false);
                                    setCantidadesRecibidas({});
                                }}
                                disabled={recibiendo}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={confirmarRecepcion}
                                disabled={recibiendo}
                            >
                                {recibiendo ? 'Confirmando...' : 'Confirmar Recepción'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cancelación */}
            {mostrarModalCancelacion && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Cancelar Transferencia
                            </h2>
                            <button
                                onClick={() => {
                                    setMostrarModalCancelacion(false);
                                    setMotivoCancelacion('');
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Motivo de cancelación *
                                </label>
                                <textarea
                                    value={motivoCancelacion}
                                    onChange={(e) => setMotivoCancelacion(e.target.value)}
                                    placeholder="Describe el motivo por el cual cancelas esta transferencia..."
                                    maxLength={500}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {motivoCancelacion.length}/500 caracteres
                                </p>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    ⚠️ Esta acción cancelará la transferencia. Si ya fue enviada, el stock será restaurado al almacén origen.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setMostrarModalCancelacion(false);
                                    setMotivoCancelacion('');
                                }}
                                disabled={cancelando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmarCancelacion}
                                disabled={cancelando || !motivoCancelacion.trim()}
                            >
                                {cancelando ? 'Cancelando...' : 'Confirmar Cancelación'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
