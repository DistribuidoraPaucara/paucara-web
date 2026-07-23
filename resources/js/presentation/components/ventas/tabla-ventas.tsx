import type { Pagination } from '@/domain/entities/shared';
import type { FiltrosVentas, Venta } from '@/domain/entities/ventas';
import ventasService from '@/infrastructure/services/ventas.service';
import { formatCurrencyWith2Decimals, formatDate } from '@/lib/utils';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Link } from '@inertiajs/react';
import { Calendar, ChevronDown, ChevronUp, Eye, FileText, MapPin, Package, Printer, Store, Trash2, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AnularVentaModal from './AnularVentaModal';
import DetalleReversionModal from './DetalleReversionModal';
import EstadoVentaBadge from './EstadoVentaBadge';
import ConfirmacionEntregaModal from './confirmacion-entrega-modal';
import { ConfirmacionesModal } from './ConfirmacionesModal';
import { Tab } from '@headlessui/react';

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
    // ✅ NUEVO: Estado para modal de confirmaciones (ver todas)
    const [showConfirmacionesModal, setShowConfirmacionesModal] = useState(false);
    const [selectedVentaForConfirmaciones, setSelectedVentaForConfirmaciones] = useState<Venta | null>(null);

    // ✅ DEBUG: Verificar datos de dirección en consola
    React.useEffect(() => {
        if (ventas.data && ventas.data.length > 0) {
            const ventaConDelivery = ventas.data.find((v) => v.requiere_envio);
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
            EFECTIVO: '💵',
            TRANSFERENCIA: '🏦',
            QR: '📱',
            TARJETA: '💳',
            CHEQUE: '📄',
            DEPOSITO: '🏧',
        };
        return iconMap[codigo || ''] || '💳';
    };

    if (!ventas.data || ventas.data.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <div className="p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay ventas</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                        {Object.keys(filtros || {}).length > 0
                            ? 'No se encontraron ventas con los filtros aplicados.'
                            : 'Comienza creando tu primera venta.'}
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/ventas/create"
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Nueva venta
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            {/* Header con información de paginación */}
            <div className="border-b border-gray-200 px-2 py-3 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrando <span className="font-medium">{ventas.from}</span> - <span className="font-medium">{ventas.to}</span> de{' '}
                        <span className="font-medium">{ventas.total}</span> ventas
                    </div>

                    <div className="flex items-center space-x-2">
                        <select
                            value={filtros?.per_page || 15}
                            onChange={(e) => ventasService.changePerPage(Number(e.target.value))}
                            className="rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
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
            <div className="overflow-x-auto">
                <Table className="divide-y divide-gray-200 dark:divide-zinc-700">
                    <TableHeader className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <TableRow className="border-gray-200 dark:border-gray-700">
                            <TableHead className="px-2 py-2 text-center text-xs tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                Folio
                            </TableHead>
                            <TableHead
                                className="cursor-pointer px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('numero')}
                            >
                                Estado {getSortIcon('estado_documento.codigo')}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('cliente_id')}
                            >
                                Cliente {getSortIcon('cliente_id')}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('total')}
                            >
                                Total {getSortIcon('total')}
                            </TableHead>
                            
                            {/* preventista */}
                            {/* <TableHead className="cursor-pointer px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700">
                                Preventista {getSortIcon('preventista_id')}
                            </TableHead> */}
                            {/* creada por */}
                            <TableHead className="cursor-pointer px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700">
                                Creada por {getSortIcon('usuario_id')}
                            </TableHead>

                            <TableHead className="px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                🕐 Creada
                            </TableHead>
                            <TableHead
                                className="cursor-pointer px-2 py-2 text-left text-xs tracking-wider text-gray-500 uppercase hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('requiere_envio')}
                            >
                                🚚 Tipo Entrega {getSortIcon('requiere_envio')}
                            </TableHead>
                            <TableHead className="px-2 py-2 text-center">-</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ventas.data.map((venta) => (
                            <React.Fragment key={venta.id}>
                                <TableRow className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800">
                                    <TableCell className="text-center text-xs">
                                        #{venta.id}
                                    </TableCell>
                                    <TableCell className="px-2 py-2">
                                        <EstadoVentaBadge
                                            estado={venta.estado_documento?.codigo || 'PENDIENTE'}
                                            tamaño="xs"
                                            conIcono={true}
                                            mostrarLabel={true}
                                        />
                                    </TableCell>

                                    <TableCell className="px-2 py-2">
                                        <div className="text-xs text-gray-900 dark:text-white">{venta.cliente?.nombre || 'Sin cliente'}</div>
                                    </TableCell>

                                    <TableCell className="px-2 py-2">
                                        <div className="text-xs text-gray-900 dark:text-white">
                                            {typeof venta.total === 'string'
                                                ? formatCurrencyWith2Decimals(parseFloat(venta.total), venta.moneda?.codigo)
                                                : formatCurrencyWith2Decimals(venta.total, venta.moneda?.codigo)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {venta.tipoPago ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                                        <span className="text-xs">{getTipoPagoIcon(venta.tipoPago.codigo)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-small text-xs text-gray-900 dark:text-white">{venta.tipoPago.nombre}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Sin datos</span>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* <TableCell className="px-2 py-2">
                                        <div
                                            className="text-xs text-gray-900 dark:text-white truncate"
                                            title={venta.preventista?.name || 'Sin preventista'}
                                        >
                                            {(venta.preventista?.name || 'Sin preventista').substring(0, 10)}
                                        </div>
                                    </TableCell> */}
                                    <TableCell className="px-2 py-2">
                                        <div
                                            className="text-xs text-gray-900 dark:text-white truncate"
                                            title={venta.usuario?.name || 'Sin usuario'}
                                        >
                                            {(venta.usuario?.name || 'Sin usuario').substring(0, 10)}
                                        </div>
                                    </TableCell>

                                    {/* ✅ NUEVO: Fecha de Creación */}
                                    <TableCell className="px-2 py-2">
                                        <div className="text-xs text-gray-700 dark:text-gray-300">
                                            {venta.created_at ? (
                                                <>
                                                    <div>
                                                        {new Date(venta.created_at).toLocaleDateString('es-BO', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(venta.created_at).toLocaleTimeString('es-BO', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-2 py-2">
                                        <div className="flex flex-wrap items-start">
                                            {venta.requiere_envio ? (
                                                <>
                                                    <div>
                                                        {venta.estadoLogistica ? (
                                                            <div
                                                                className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white"
                                                                style={{
                                                                    backgroundColor: venta.estadoLogistica.color || '#6B7280',
                                                                }}
                                                            >
                                                                {venta.estadoLogistica.icono && (
                                                                    <span>{venta.estadoLogistica.icono}</span>
                                                                )}
                                                                <span>{venta.estadoLogistica.nombre}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">Sin asignar</div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                        🏪 Presencial
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-2 py-2 text-center text-xs">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* Ver */}
                                            <Link
                                                href={ventasService.showUrl(venta.id)}
                                                className="rounded p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                                                title="Ver venta"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>

                                            {/* Anular - Solo si está APROBADO */}
                                            {venta.estado_documento?.codigo === 'APROBADO' && (
                                                <button
                                                    onClick={() => openAnularModal(venta)}
                                                    className="rounded p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                                    title="Anular venta"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* ✅ Descargar en formato - Usar OutputSelectionModal */}
                                            <button
                                                onClick={() => setOutputModal({ isOpen: true, venta })}
                                                className="rounded p-1 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                                title="Exportar documento"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>

                                            {/* Expandir detalles de entrega - Solo si requiere envío */}
                                            {venta.requiere_envio && (
                                                <button
                                                    onClick={() => toggleRowExpanded(Number(venta.id))}
                                                    className="rounded p-1 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    title="Ver detalles de entrega"
                                                >
                                                    {expandedRows.has(Number(venta.id)) ? (
                                                        <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Fila expandible para detalles de delivery */}
                                {venta.requiere_envio && expandedRows.has(Number(venta.id)) && (
                                    <tr className="border-t-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10">
                                        <td colSpan={12} className="px-2 py-2">
                                            <div className="space-y-4">
                                                {/* ✅ NUEVO: Información de Entrega Asignada */}
                                                {venta.entrega && (
                                                    <div className="flex items-start space-x-3 rounded border border-blue-300 bg-blue-100 p-3 dark:border-blue-700 dark:bg-blue-900/20">
                                                        <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                        <div className="flex-1">
                                                            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                                📦 Entrega Asignada
                                                            </h4>
                                                            <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 flex flex-wrap gap-4">
                                                                <div>
                                                                    <span className="font-medium">Folio:</span>{' #'}
                                                                    {venta.entrega.id}
                                                                </div>
                                                                {venta.entrega.chofer && (
                                                                    <div>
                                                                        <span className="font-medium">Chofer:</span>{' '}
                                                                        {venta.entrega.chofer.name || venta.entrega.chofer.nombre}
                                                                    </div>
                                                                )}
                                                                {/* entregador */}
                                                                {venta.entrega.entregador && (
                                                                    <div>
                                                                        <span className="font-medium">Entregador:</span>{' '}
                                                                        {venta.entrega.entregador.name || venta.entrega.entregador.nombre}
                                                                    </div>
                                                                )}
                                                                {venta.entrega.vehiculo && (
                                                                    <div>
                                                                        <span className="font-medium">Vehículo:</span> {venta.entrega.vehiculo.placa}{' '}
                                                                        ({venta.entrega.vehiculo.marca})
                                                                    </div>
                                                                )}
                                                                {venta.entrega.fecha_programada && (
                                                                    <div>
                                                                        <span className="font-medium">Fecha Programada:</span>{' '}
                                                                        {formatDate(String(venta.entrega.fecha_programada))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-start gap-4">
                                                    {/* Dirección de entrega */}
                                                    <div className="flex items-start space-x-3">
                                                        <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                        <div className="flex-1">
                                                            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                                Dirección de Entrega
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {/* Dirección */}
                                                                {venta.direccionCliente?.direccion && (
                                                                    <div>
                                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                            📍 {venta.direccionCliente.direccion}
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

                                                                {/* Referencias */}
                                                                {venta.direccionCliente?.referencias && (
                                                                    <div>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                            🏷️ Referencias: {venta.direccionCliente.referencias}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* Observaciones */}
                                                                {venta.direccionCliente?.observaciones && (
                                                                    <div>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                            📝 Observaciones: {venta.direccionCliente.observaciones}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Estado logístico */}
                                                    <div className="flex items-start space-x-3">
                                                        <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                        <div>
                                                            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Estado Logístico</h4>
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
                                                            <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                            <div>
                                                                <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
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
                                                            <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                                            <div>
                                                                <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                                                    Peso Total Estimado
                                                                </h4>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                    {Number(venta.peso_total_estimado).toFixed(2)} kg
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* ✅ Botón para ver todas las confirmaciones de entrega */}
                                                    {venta.entregaConfirmacion && (
                                                        <div className="flex items-start space-x-3 border-t border-blue-200 pt-4 dark:border-blue-800">
                                                            <div className="flex-1">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedVentaForConfirmaciones(venta);
                                                                        setShowConfirmacionesModal(true);
                                                                    }}
                                                                    className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                                                >
                                                                    ✓ Ver Confirmaciones
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            {ventas.last_page > 1 && (
                <div className="border-t border-gray-200 px-4 py-3 dark:border-zinc-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => ventasService.goToPage(ventas.current_page - 1)}
                                disabled={ventas.current_page <= 1}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
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
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                pageNum === ventas.current_page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700'
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
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
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

            {/* ✅ Modal de Confirmaciones (Ver todas) */}
            {selectedVentaForConfirmaciones && (
                <ConfirmacionesModal
                    open={showConfirmacionesModal}
                    onOpenChange={setShowConfirmacionesModal}
                    confirmaciones={selectedVentaForConfirmaciones.entregaConfirmacion ? [selectedVentaForConfirmaciones.entregaConfirmacion] : []}
                />
            )}
        </div>
    );
}
