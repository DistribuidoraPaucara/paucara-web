import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Eye, Edit, Trash2, MoreHorizontal, FileText, Truck, Store, ChevronDown, ChevronUp, MapPin, Package, Calendar, Printer, DollarSign, Loader2, RotateCcw } from 'lucide-react';
import { formatCurrency, formatCurrencyWith2Decimals, formatDate } from '@/lib/utils';
import type { Venta, FiltrosVentas } from '@/domain/entities/ventas';
import type { Pagination } from '@/domain/entities/shared';
import ventasService from '@/infrastructure/services/ventas.service';
import AnularVentaModal from './AnularVentaModal';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import EstadoVentaBadge from './EstadoVentaBadge';
import ReversionStockIndicador from './ReversionStockIndicador';
import DetalleReversionModal from './DetalleReversionModal';
import ConfirmacionEntregaModal from './confirmacion-entrega-modal';
import { toast } from 'react-toastify';

interface TablaVentasProps {
    ventas: Pagination<Venta>;
    filtros?: FiltrosVentas;
    onVentaDeleted?: (ventaId: number | string) => void;
}

export default function TablaVentas({ ventas, filtros }: TablaVentasProps) {
    console.log('🚀 ~ file: tabla-ventas.tsx:22 ~ TablaVentas ~ ventas:', ventas);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [anularModal, setAnularModal] = useState<{ isOpen: boolean; venta?: Venta }>({ isOpen: false });
    const [isAnulando, setIsAnulando] = useState(false);
    const [outputModal, setOutputModal] = useState<{ isOpen: boolean; venta?: Venta }>({ isOpen: false });
    const [registrandoEnCaja, setRegistrandoEnCaja] = useState<number | null>(null);
    // ✅ NUEVO (2026-02-10): Estado para modal de verificación de reversión de stock
    const [detalleReversionData, setDetalleReversionData] = useState<any>(null);
    const [isDetalleReversionOpen, setIsDetalleReversionOpen] = useState(false);
    // ✅ NUEVO: Estado para modal de confirmación de entrega
    const [confirmacionEntregaModal, setConfirmacionEntregaModal] = useState<{ isOpen: boolean; venta?: Venta }>({ isOpen: false });

    // ✅ DEBUG: Verificar datos de dirección en consola
    React.useEffect(() => {
        if (ventas.data && ventas.data.length > 0) {
            const ventaConDelivery = ventas.data.find(v => v.requiere_envio);
            if (ventaConDelivery) {
                console.log('📦 Venta con delivery - DEBUG:', {
                    id: ventaConDelivery.id,
                    numero: ventaConDelivery.numero,
                    requiere_envio: ventaConDelivery.requiere_envio,
                    direccionCliente: ventaConDelivery.direccionCliente,
                    estado_logistico: ventaConDelivery.estado_logistico,
                    estado_logistico_id: ventaConDelivery.estado_logistico_id,
                });
            }
        }
    }, [ventas]);

    const toggleRowExpanded = (ventaId: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(ventaId)) {
            newExpanded.delete(ventaId);
        } else {
            newExpanded.add(ventaId);
        }
        setExpandedRows(newExpanded);
    };

    const openAnularModal = (venta: Venta) => {
        setAnularModal({ isOpen: true, venta });
    };

    const closeAnularModal = () => {
        setAnularModal({ isOpen: false });
    };

    const handleAnularVenta = async (motivo?: string) => {
        if (!anularModal.venta) return;

        console.log('🔴 [ANULAR VENTA FRONTEND] INICIANDO', {
            venta_id: anularModal.venta.id,
            venta_numero: anularModal.venta.numero,
            motivo: motivo,
        });

        setIsAnulando(true);
        try {
            console.log('🔴 [ANULAR VENTA FRONTEND] Enviando request al backend...');

            const response = await fetch(`/ventas/${anularModal.venta.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo }),
            });

            console.log('🔴 [ANULAR VENTA FRONTEND] Response recibido', {
                status: response.status,
                ok: response.ok,
            });

            const data = await response.json();

            console.log('🔴 [ANULAR VENTA FRONTEND] Data del response', {
                success: data.success,
                message: data.message,
                data: data.data,
            });

            if (!response.ok) {
                console.error('🔴 [ANULAR VENTA FRONTEND] Error en respuesta', data.message);
                toast.error(data.message || 'Error al anular la venta');
                return;
            }

            console.log('🟢 [ANULAR VENTA FRONTEND] Anulación exitosa, mostrando toast y recargando...');
            toast.success('Venta anulada exitosamente');
            closeAnularModal();

            // Recargar la página
            console.log('🟢 [ANULAR VENTA FRONTEND] Recargando página en 1 segundo...');
            setTimeout(() => {
                console.log('🟢 [ANULAR VENTA FRONTEND] Ejecutando reload...');
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('🔴 [ANULAR VENTA FRONTEND] ERROR DE EXCEPCIÓN', error);
            toast.error('Error al anular la venta');
        } finally {
            setIsAnulando(false);
        }
    };

    const handleRegistrarEnCaja = async (venta: Venta) => {
        // Pedir confirmación
        if (!window.confirm(`¿Registrar la venta #${venta.numero} en movimientos de caja?`)) {
            return;
        }

        setRegistrandoEnCaja(venta.id);
        try {
            const response = await fetch(`/api/ventas/${venta.id}/registrar-en-caja`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            console.log('📋 Respuesta de registrar en caja:', {
                status: response.status,
                ok: response.ok,
                data: data,
            });

            if (!response.ok) {
                console.error('❌ Error al registrar:', data.message);
                toast.error(data.message || 'Error al registrar en caja');

                // Mostrar detalles específicos
                if (data.estado_actual) {
                    console.log('Estado actual de venta:', data.estado_actual);
                }
                return;
            }

            toast.success(`✅ Venta #${venta.numero} registrada en caja`);

            // Recargar página después de 1 segundo
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('❌ Error de excepción:', error);
            toast.error('Error al registrar en caja');
        } finally {
            setRegistrandoEnCaja(null);
        }
    };

    const getEstadoLogisticoLabel = (estado: string): string => {
        // ✅ ACTUALIZADO: Incluir todos los estados posibles desde BD
        const labelMap: { [key: string]: string } = {
            'SIN_ENTREGA': 'Sin Entrega',
            'PENDIENTE_ENVIO': 'Pendiente de Envío',   // ✅ NUEVO
            'PROGRAMADO': 'Programado',
            'EN_PREPARACION': 'En Preparación',
            'PREPARANDO': 'Preparando',                 // ✅ NUEVO
            'EN_TRANSITO': 'En Tránsito',
            'ENVIADO': 'Enviado',                       // ✅ NUEVO
            'ENTREGADA': 'Entregada',
            'ENTREGADO': 'Entregado',                   // ✅ NUEVO
            'PROBLEMAS': 'Con Problemas',
            'CANCELADA': 'Cancelada',
            'CANCELADO': 'Cancelado',                   // ✅ NUEVO
            'PENDIENTE_RETIRO': 'Pendiente de Retiro', // ✅ NUEVO
            'RETIRADO': 'Retirado'                      // ✅ NUEVO
        };
        return labelMap[estado] || 'Desconocido';
    };

    const getEstadoPagoBadgeStyles = (estado: string): { bg: string; text: string; label: string } => {
        // ✅ NUEVO: Estilos para estado de pago
        const styleMap: { [key: string]: { bg: string; text: string; label: string } } = {
            'PENDIENTE': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', label: 'Pendiente' },
            'PAGADO': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Pagado' },
            'PARCIALMENTE_PAGADO': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', label: 'Parcialmente Pagado' },
            'VENCIDO': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Vencido' },
        };
        return styleMap[estado] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-800 dark:text-gray-300', label: estado || 'Desconocido' };
    };

    const getPoliticaPagoBadgeStyles = (politica: string): { bg: string; text: string; label: string } => {
        // ✅ NUEVO: Estilos para política de pago
        const styleMap: { [key: string]: { bg: string; text: string; label: string } } = {
            'CONTRA_ENTREGA': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: 'Contra Entrega' },
            'ANTICIPADO_100': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', label: 'Anticipado 100%' },
            'MEDIO_MEDIO': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300', label: 'Medio - Medio' },
            'CREDITO': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-800 dark:text-cyan-300', label: 'Crédito' },
        };
        return styleMap[politica] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-800 dark:text-gray-300', label: politica || 'Desconocida' };
    };

    const handleSort = (field: string) => {
        const currentSortDir = filtros?.sort_by === field && filtros?.sort_dir === 'asc' ? 'desc' : 'asc';
        ventasService.sort(field, currentSortDir);
    };

    const getSortIcon = (field: string) => {
        if (filtros?.sort_by !== field) {
            return '↕️';
        }
        return filtros?.sort_dir === 'asc' ? '↑' : '↓';
    };

    // ✅ NUEVO: Icono diferencial para tipo de pago
    const getTipoPagoIcon = (codigo?: string): string => {
        const iconMap: { [key: string]: string } = {
            'EFECTIVO': '💵',
            'TRANSFERENCIA': '🏦',
            'QR': '📱',
            'TARJETA': '💳',
            'CHEQUE': '📄',
            'DEPOSITO': '🏧',
        };
        return iconMap[codigo || ''] || '💳';
    };

    /* const handleDelete = (venta: Venta) => {
        ventasService.destroy(venta.id, {
            onSuccess: () => {
                if (onVentaDeleted) {
                    onVentaDeleted(venta.id);
                }
            }
        });
    }; */

    if (!ventas.data || ventas.data.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                <div className="p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No hay ventas
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                        {Object.keys(filtros || {}).length > 0
                            ? 'No se encontraron ventas con los filtros aplicados.'
                            : 'Comienza creando tu primera venta.'
                        }
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/ventas/create"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Nueva venta
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
            {/* Header con información de paginación */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrando{' '}
                        <span className="font-medium">{ventas.from}</span>
                        {' '}-{' '}
                        <span className="font-medium">{ventas.to}</span>
                        {' '}de{' '}
                        <span className="font-medium">{ventas.total}</span>
                        {' '}ventas
                    </div>

                    <div className="flex items-center space-x-2">
                        <select
                            value={filtros?.per_page || 15}
                            onChange={(e) => ventasService.changePerPage(Number(e.target.value))}
                            className="text-sm border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value={10}>10 por página</option>
                            <option value={15}>15 por página</option>
                            <option value={25}>25 por página</option>
                            <option value={50}>50 por página</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto max-h-[calc(100vh-300px)] flex flex-col">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                    <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-zinc-800">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('numero')}
                            >
                                Número {getSortIcon('numero')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('cliente_id')}
                            >
                                Cliente {getSortIcon('cliente_id')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('total')}
                            >
                                Total {getSortIcon('total')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('requiere_envio')}
                            >
                                🚚 Tipo Entrega {getSortIcon('requiere_envio')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                🕐 Creada
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                        {ventas.data.map((venta) => (
                            <React.Fragment key={venta.id}>
                                <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            <p>Folio: {venta.id}</p>
                                            <p>{venta.numero}</p>
                                        </div>
                                        <EstadoVentaBadge
                                            estado={venta.estado_documento?.codigo || 'PENDIENTE'}
                                            tamaño="sm"
                                            conIcono={true}
                                            mostrarLabel={true}
                                        />
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {venta.proforma?.numero && (
                                                <Link
                                                    href={`/proformas/${venta.proforma.id}`}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                                    title="Ver proforma"
                                                >
                                                    Folio Proforma: {venta.proforma.id}
                                                </Link>
                                            )}
                                        </div>
                                        {venta.preventista && (
                                            <div className="flex items-center space-x-2">
                                                Prev.:
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    <strong>{venta.preventista.name}</strong>
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {venta.cliente?.nombre || 'Sin cliente'}
                                        </div>
                                        {venta.cliente?.nit && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                NIT: {venta.cliente.nit}
                                            </div>
                                        )}
                                        {/* ✅ NUEVO (2026-03-03): Mostrar observaciones de la dirección */}
                                        {venta.requiere_envio && venta.direccionCliente?.observaciones && (
                                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                📍 {venta.direccionCliente.observaciones}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {typeof venta.total === 'string'
                                                ? formatCurrencyWith2Decimals(parseFloat(venta.total), venta.moneda?.codigo)
                                                : formatCurrencyWith2Decimals(venta.total, venta.moneda?.codigo)
                                            }
                                        </div>
                                        {/* {venta.moneda && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {venta.moneda.codigo}
                                            </div>
                                        )} */}
                                        {/* <div className="space-y-2">
                                            {venta.estado_pago ? (
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEstadoPagoBadgeStyles(venta.estado_pago).bg} ${getEstadoPagoBadgeStyles(venta.estado_pago).text}`}>
                                                    {getEstadoPagoBadgeStyles(venta.estado_pago).label}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Sin datos</span>
                                            )}
                                        </div> */}
                                        <div className="text-sm">
                                            {venta.tipoPago ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                                        <span className="text-lg">{getTipoPagoIcon(venta.tipoPago.codigo)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {venta.tipoPago.nombre}
                                                        </p>
                                                        {/* {venta.politica_pago && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {venta.politica_pago === 'CONTRA_ENTREGA' && 'Contra Entrega'}
                                                                {venta.politica_pago === 'ANTICIPADO_100' && 'Anticipado 100%'}
                                                                {venta.politica_pago === 'MEDIO_MEDIO' && 'Medio Medio'}
                                                                {venta.politica_pago === 'CREDITO' && 'Crédito'}
                                                            </p>
                                                        )} */}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Sin datos</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {venta.requiere_envio ? (
                                                <>
                                                    <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    <div className="flex-1">
                                                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                            🚚 Delivery
                                                        </span>
                                                        {venta.entrega ? (
                                                            <div className="text-xs mt-1 space-y-0.5">
                                                                <div className="text-blue-700 dark:text-blue-300 font-medium">
                                                                    📦 Entrega: {venta.entrega.numero_entrega || `#${venta.entrega.id}`}
                                                                </div>
                                                                {venta.entrega.chofer && (
                                                                    <div className="text-gray-600 dark:text-gray-400">
                                                                        🚗 {venta.entrega.chofer.name || venta.entrega.chofer.nombre}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : venta.estado_logistico ? (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {venta.estado_logistico}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                                                Sin asignar
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => toggleRowExpanded(Number(venta.id))}
                                                        className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex-shrink-0"
                                                        title="Ver detalles de entrega"
                                                    >
                                                        {expandedRows.has(Number(venta.id)) ? (
                                                            <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Store className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                        🏪 Presencial
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {/* <p>
                                            {venta.politica_pago ? (
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPoliticaPagoBadgeStyles(venta.politica_pago).bg} ${getPoliticaPagoBadgeStyles(venta.politica_pago).text}`}>
                                                    {getPoliticaPagoBadgeStyles(venta.politica_pago).label}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Sin datos</span>
                                            )}
                                        </p> */}
                                    </td>

                                    {/* ✅ NUEVO: Fecha de Creación */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            {venta.created_at ? (
                                                <>
                                                    <div>{new Date(venta.created_at).toLocaleDateString('es-BO', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(venta.created_at).toLocaleTimeString('es-BO', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            creador: <span className="font-medium text-gray-900 dark:text-white">
                                                {venta.usuario?.name || 'Sin usuario'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* Ver */}
                                            <Link
                                                href={ventasService.showUrl(venta.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                title="Ver venta"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>

                                            {/* Editar - Deshabilitado por ahora */}
                                            {/* <button
                                                disabled
                                                className="text-gray-300 dark:text-gray-600 p-1 rounded cursor-not-allowed"
                                                title="Editar venta (próximamente)"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button> */}

                                            {/* Anular - Solo si está APROBADO */}
                                            {venta.estado_documento?.codigo === 'APROBADO' && (
                                                <button
                                                    onClick={() => openAnularModal(venta)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Anular venta"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Devolución - Solo si está APROBADO */}
                                            {/* {venta.estado_documento?.codigo === 'APROBADO' && (
                                                <Link
                                                    href={`/ventas/${venta.id}/devoluciones/create`}
                                                    className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                                    title="Crear devolución"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </Link>
                                            )} */}

                                            {/* ✅ NUEVO (2026-02-10): Indicador de reversión de stock para ventas anuladas */}
                                            {/* <ReversionStockIndicador
                                                ventaId={venta.id}
                                                ventaNumero={venta.numero}
                                                estadoVenta={venta.estado_documento?.codigo || 'ANULADO'}
                                                onVerDetalles={(data) => {
                                                    setDetalleReversionData(data);
                                                    setIsDetalleReversionOpen(true);
                                                }}
                                            /> */}

                                            {/* ✅ Descargar en formato - Usar OutputSelectionModal */}
                                            <button
                                                onClick={() => setOutputModal({ isOpen: true, venta })}
                                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                title="Exportar documento"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>

                                            {/* ✅ Registrar en caja */}
                                            {/* {venta.estado_documento?.codigo === 'APROBADO' && (
                                                <button
                                                    onClick={() => handleRegistrarEnCaja(venta)}
                                                    disabled={registrandoEnCaja === venta.id}
                                                    className={`p-1 rounded transition-colors ${registrandoEnCaja === venta.id
                                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                        : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                        }`}
                                                    title="Registrar en movimientos de caja"
                                                >
                                                    {registrandoEnCaja === venta.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <DollarSign className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )} */}
                                        </div>
                                    </td>
                                </tr>

                                {/* Fila expandible para detalles de delivery */}
                                {venta.requiere_envio && expandedRows.has(Number(venta.id)) && (
                                    <tr className="bg-blue-50 dark:bg-blue-900/10 border-t-2 border-blue-200 dark:border-blue-800">
                                        <td colSpan={12} className="px-6 py-4">
                                            <div className="space-y-4">
                                                {/* ✅ NUEVO: Información de Entrega Asignada */}
                                                {venta.entrega && (
                                                    <div className="flex items-start space-x-3 p-3 bg-blue-100 dark:bg-blue-900/20 rounded border border-blue-300 dark:border-blue-700">
                                                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                                📦 Entrega Asignada
                                                            </h4>
                                                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                                                <div>
                                                                    <span className="font-medium">Número:</span> {venta.entrega.numero_entrega || `#${venta.entrega.id}`}
                                                                </div>
                                                                {venta.entrega.chofer && (
                                                                    <div>
                                                                        <span className="font-medium">Chofer:</span> {venta.entrega.chofer.name || venta.entrega.chofer.nombre}
                                                                    </div>
                                                                )}
                                                                {venta.entrega.vehiculo && (
                                                                    <div>
                                                                        <span className="font-medium">Vehículo:</span> {venta.entrega.vehiculo.placa} ({venta.entrega.vehiculo.marca})
                                                                    </div>
                                                                )}
                                                                {venta.entrega.fecha_programada && (
                                                                    <div>
                                                                        <span className="font-medium">Fecha Programada:</span> {formatDate(String(venta.entrega.fecha_programada))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Dirección de entrega */}
                                                <div className="flex items-start space-x-3">
                                                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                            Dirección de Entrega
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {/* Dirección principal */}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {venta.direccionCliente?.direccion || 'No especificada'}
                                                                </p>
                                                            </div>

                                                            {/* Referencias */}
                                                            {venta.direccionCliente?.referencias && (
                                                                <div>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        📌 Referencias: {venta.direccionCliente.referencias}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Localidad */}
                                                            {venta.direccionCliente?.localidad && (
                                                                <div>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        🏘️ Localidad: {venta.direccionCliente.localidad}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Coordenadas para mapas */}
                                                            {venta.direccionCliente?.latitud && venta.direccionCliente?.longitud && (
                                                                <div className="mt-2 p-2 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700">
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                                                        📍 Coordenadas: {Number(venta.direccionCliente.latitud).toFixed(4)}, {Number(venta.direccionCliente.longitud).toFixed(4)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Estado logístico */}
                                                <div className="flex items-start space-x-3">
                                                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                            Estado Logístico
                                                        </h4>
                                                        <div className="flex items-center space-x-3">
                                                            {/* Badge mejorado del estado */}
                                                            <EstadoVentaBadge
                                                                estado={venta.estado_logistico || 'SIN_ENTREGA'}
                                                                tamaño="md"
                                                                conIcono={true}
                                                                mostrarLabel={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fecha de entrega prometida */}
                                                {venta.fecha_entrega_comprometida && (
                                                    <div className="flex items-start space-x-3">
                                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                                Fecha Prometida de Entrega
                                                            </h4>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                {formatDate(String(venta.fecha_entrega_comprometida))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Peso de la venta */}
                                                {venta.peso_total_estimado && (
                                                    <div className="flex items-start space-x-3">
                                                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                                Peso Total Estimado
                                                            </h4>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                {Number(venta.peso_total_estimado).toFixed(2)} kg
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ✅ NUEVO: Botón para ver detalles de confirmación de entrega */}
                                                {venta.entregaConfirmacion && (
                                                    <div className="flex items-start space-x-3 pt-4 border-t border-blue-200 dark:border-blue-800">
                                                        <div className="flex-1">
                                                            <button
                                                                onClick={() => setConfirmacionEntregaModal({ isOpen: true, venta })}
                                                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
                                                            >
                                                                ✓ Ver Confirmación de Entrega
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {ventas.last_page > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => ventasService.goToPage(ventas.current_page - 1)}
                                disabled={ventas.current_page <= 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>

                            <div className="flex items-center space-x-1">
                                {/* Renderizar números de página */}
                                {(() => {
                                    const maxButtons = 5;
                                    let startPage = Math.max(1, ventas.current_page - Math.floor(maxButtons / 2));
                                    const endPage = Math.min(ventas.last_page, startPage + maxButtons - 1);

                                    // Ajustar si estamos cerca del final
                                    if (endPage - startPage < maxButtons - 1) {
                                        startPage = Math.max(1, endPage - maxButtons + 1);
                                    }

                                    const pages = [];
                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(i);
                                    }

                                    return pages.map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => ventasService.goToPage(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pageNum === ventas.current_page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ));
                                })()}
                            </div>

                            <button
                                onClick={() => ventasService.goToPage(ventas.current_page + 1)}
                                disabled={ventas.current_page >= ventas.last_page}
                                className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Página {ventas.current_page} de {ventas.last_page}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de anulación */}
            <AnularVentaModal
                isOpen={anularModal.isOpen}
                onClose={closeAnularModal}
                ventaNumero={anularModal.venta?.numero || ''}
                onConfirm={handleAnularVenta}
                isLoading={isAnulando}
            />

            {/* Modal de exportación/impresión */}
            <OutputSelectionModal
                isOpen={outputModal.isOpen}
                onClose={() => setOutputModal({ isOpen: false })}
                documentoId={outputModal.venta?.id || ''}
                tipoDocumento="venta"
                documentoInfo={{
                    numero: outputModal.venta?.numero,
                    fecha: outputModal.venta?.fecha ? new Date(outputModal.venta.fecha).toLocaleDateString('es-ES') : undefined,
                    monto: outputModal.venta?.total,
                }}
            />

            {/* ✅ NUEVO (2026-02-10): Modal de detalles de reversión de stock */}
            <DetalleReversionModal
                isOpen={isDetalleReversionOpen}
                onClose={() => setIsDetalleReversionOpen(false)}
                data={detalleReversionData}
                onReversionExecuted={() => {
                    // Cerrar modal y el usuario verá el indicador actualizado en el siguiente click
                    setIsDetalleReversionOpen(false);
                    // Limpiar datos del modal
                    setDetalleReversionData(null);
                }}
            />

            {/* ✅ NUEVO: Modal de Confirmación de Entrega */}
            <ConfirmacionEntregaModal
                isOpen={confirmacionEntregaModal.isOpen}
                entrega={confirmacionEntregaModal.venta?.entregaConfirmacion}
                ventaNumero={confirmacionEntregaModal.venta?.numero}
                onClose={() => setConfirmacionEntregaModal({ isOpen: false })}
            />
        </div>
    );
}
