import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    Printer,
    FileText,
    Download,
    X,
    ChevronLeft,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { NotificationService } from '@/infrastructure/services/notification.service';

export type TipoDocumento =
    | 'venta'
    | 'proforma'
    | 'compra'
    | 'pago'
    | 'caja'
    | 'inventario'
    | 'entrega'
    | 'movimiento'
    | 'cuenta-por-cobrar'
    | 'cuenta-por-pagar'
    | 'stock'
    | 'ajuste'
    | 'merma'
    | 'reporte-productos-vendidos'
    | 'prestamo-cliente'
    | 'devoluciones-cliente'
    | 'prestamo-proveedor'
    | 'devoluciones-proveedor'
    | 'prestamos-vendidos'
    | 'compras-prestables';

interface FormatoConfig {
    formato: string;
    nombre: string;
    descripcion?: string;
}

interface OutputSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentoId: number | string;
    tipoDocumento: TipoDocumento;
    documentoInfo?: {
        numero?: string;
        fecha?: string;
        monto?: number;
    };
    printType?: 'cierre' | 'movimientos';
}

type Accion = 'imprimir' | 'excel' | 'pdf' | null;

// Configuración de formatos por tipo de documento (solo para impresión)
const FORMATO_CONFIG: Record<TipoDocumento, FormatoConfig[]> = {
    venta: [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    proforma: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
    ],
    compra: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar carta' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
    ],
    pago: [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    caja: [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    inventario: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
    ],
    ajuste: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    merma: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
    ],
    entrega: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
        { formato: 'B1', nombre: 'Hoja Grande (B1)', descripcion: 'Formato B1 - 707mm × 1000mm' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
    ],
    movimiento: [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'cuenta-por-cobrar': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'cuenta-por-pagar': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    stock: [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
    ],
    'reporte-productos-vendidos': [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'prestamo-cliente': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'devoluciones-cliente': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'prestamo-proveedor': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'devoluciones-proveedor': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'prestamos-vendidos': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
    'compras-prestables': [
        { formato: 'TICKET_80', nombre: 'Ticket 80mm (Default)', descripcion: 'Impresora térmica 80mm' },
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
    ],
};

interface Impresora {
    name: string;
    isDefault: boolean;
}

export function OutputSelectionModal({
    isOpen,
    onClose,
    documentoId,
    tipoDocumento,
    documentoInfo = {},
    printType = undefined,
}: OutputSelectionModalProps) {
    const [accion, setAccion] = useState<Accion>(null);
    const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('');
    const [impresoras, setImpresoras] = useState<Impresora[]>([]);
    const [impresoraSeleccionada, setImpresoraSeleccionada] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [cargarImpresoras, setCargarImpresoras] = useState(false);

    const formatosDisponibles = FORMATO_CONFIG[tipoDocumento];
    const formatoDefault = formatosDisponibles?.[0]?.formato || 'TICKET_80';

    // ✅ DEBUG: Log cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            console.log('🖨️ [OutputSelectionModal] Modal abierto:', {
                documentoId: documentoId,
                tipoDocumento: tipoDocumento,
                printType: printType,
                documentoInfo: documentoInfo,
            });
        }
    }, [isOpen, documentoId, tipoDocumento]);

    // Cargar impresoras disponibles cuando se selecciona imprimir
    useEffect(() => {
        if (accion === 'imprimir' && cargarImpresoras) {
            cargarImpresorasDisponibles();
            setCargarImpresoras(false);
        }
    }, [accion, cargarImpresoras]);

    const cargarImpresorasDisponibles = async () => {
        try {
            // Usar Print API del navegador si está disponible
            if ('getPrinters' in navigator) {
                // API propietaria de algunos navegadores (no estándar)
                const printers = await (navigator as any).getPrinters();
                setImpresoras(printers || []);
                if (printers && printers.length > 0) {
                    const defaultPrinter = printers.find((p: Impresora) => p.isDefault);
                    setImpresoraSeleccionada(defaultPrinter?.name || printers[0].name);
                }
            } else {
                // Fallback: Sin impresoras específicas, usaremos el diálogo de impresión del navegador
                /* NotificationService.info(
                    'Se abrirá el diálogo de impresión del navegador para seleccionar impresora'
                ); */
            }
        } catch (error) {
            console.error('Error cargando impresoras:', error);
            NotificationService.warning(
                'No se pudieron cargar las impresoras. Se usará el diálogo de impresión del navegador'
            );
        }
    };

    const construirURL = (formato: string, accionURL: 'download' | 'stream' = 'stream', tipo: 'imprimir' | 'excel' | 'pdf' = 'imprimir') => {
        let url: string;
        let rutaBase: string;

        if (tipoDocumento === 'caja') {
            // Para cajas, usar el tipo de impresión para determinar la ruta
            if (printType === 'cierre') {
                rutaBase = `/cajas/${documentoId}/cierre`;
            } else if (printType === 'movimientos') {
                rutaBase = `/cajas/${documentoId}/movimientos`;
            } else {
                // Por defecto usar movimientos
                rutaBase = `/cajas/${documentoId}/movimientos`;
            }
        } else if (tipoDocumento === 'movimiento') {
            // Para movimientos individuales
            rutaBase = `/cajas/movimiento/${documentoId}`;
        } else if (tipoDocumento === 'entrega') {
            // Para entregas, usar la ruta API específica
            rutaBase = `/api/entregas/${documentoId}`;
        } else if (tipoDocumento === 'pago') {
            // Para pagos
            rutaBase = `/compras/pagos/${documentoId}`;
        } else if (tipoDocumento === 'cuenta-por-cobrar') {
            // Para cuentas por cobrar
            rutaBase = `/cuentas-por-cobrar/${documentoId}`;
        } else if (tipoDocumento === 'cuenta-por-pagar') {
            // Para cuentas por pagar
            rutaBase = `/cuentas-por-pagar/${documentoId}`;
        } else if (tipoDocumento === 'stock') {
            // Para stock - no requiere documentoId
            rutaBase = '/stock';
        } else if (tipoDocumento === 'ajuste') {
            // Para ajustes - no requiere documentoId (se envían desde sesión)
            rutaBase = '/inventario/ajuste';
        } else if (tipoDocumento === 'merma') {
            // Para mermas
            rutaBase = `/inventario/mermas/${documentoId}`;
        } else if (tipoDocumento === 'prestamo-cliente') {
            // Para préstamos de cliente
            rutaBase = `/prestamos/clientes/${documentoId}`;
        } else if (tipoDocumento === 'prestamo-proveedor') {
            // Para préstamos a proveedor
            rutaBase = `/prestamos/proveedores/${documentoId}`;
        } else if (tipoDocumento === 'prestamos-vendidos') {
            // Para ventas de prestables
            rutaBase = `/api/prestamos-vendidos/${documentoId}`;
        } else if (tipoDocumento === 'compras-prestables') {
            // Para compras de prestables
            rutaBase = `/api/compras-prestables/${documentoId}`;
        } else {
            rutaBase = `/${tipoDocumento}s/${documentoId}`;
        }

        if (tipo === 'excel') {
            if (tipoDocumento === 'entrega') {
                url = `${rutaBase}/exportar-excel`;
            } else if (tipoDocumento === 'pago') {
                // Para pagos
                url = `${rutaBase}/exportar-excel`;
            } else if (tipoDocumento === 'caja') {
                // Para cajas (cierre y movimientos)
                url = `${rutaBase}/exportar-excel`;
            } else if (tipoDocumento === 'cuenta-por-cobrar' || tipoDocumento === 'cuenta-por-pagar') {
                // Para cuentas por cobrar/pagar
                url = `${rutaBase}/exportar-excel`;
            } else if (tipoDocumento === 'stock') {
                // Para stock
                url = `${rutaBase}/exportar-excel`;
            } else {
                url = `${rutaBase}/exportar-excel`;
            }
        } else if (tipo === 'pdf') {
            if (tipoDocumento === 'entrega') {
                url = `${rutaBase}/descargar?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'pago') {
                // Para pagos
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'caja') {
                // Para cajas (cierre y movimientos)
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'cuenta-por-cobrar') {
                // Para cuentas por cobrar
                url = `${rutaBase}/imprimir-ticket-80`;
            } else if (tipoDocumento === 'cuenta-por-pagar') {
                // Para cuentas por pagar
                url = `${rutaBase}/imprimir-${formato.toLowerCase().replace(/_/g, '-')}`;
            } else if (tipoDocumento === 'stock') {
                // Para stock
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'ajuste') {
                // Para ajustes - incluir ajuste_id si es positivo (impresión histórica)
                if (documentoId && documentoId > 0) {
                    url = `${rutaBase}/imprimir?formato=${formato}&accion=download&ajuste_id=${documentoId}`;
                } else {
                    url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
                }
            } else if (tipoDocumento === 'merma') {
                // Para mermas
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'proforma') {
                // ✅ Para proformas INDIVIDUALES - rutaBase ya incluye el ID
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'reporte-productos-vendidos') {
                // Para reporte de productos vendidos - obtener filtros de la URL actual
                const params = new URLSearchParams(window.location.search);
                const queryString = params.toString();
                url = `/ventas/reporte-productos-vendidos/imprimir?${queryString}&formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'prestamo-cliente') {
                // Para préstamos de cliente
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'devoluciones-cliente') {
                // Para devoluciones de cliente
                url = `/prestamos/clientes/${documentoId}/devoluciones/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'prestamo-proveedor') {
                // Para préstamos a proveedor
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'prestamos-vendidos') {
                // Para ventas de prestables
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else if (tipoDocumento === 'compras-prestables') {
                // Para compras de prestables
                url = `${rutaBase}/imprimir?formato=${formato}&accion=download`;
            } else {
                url = `${rutaBase}/exportar-pdf?formato=${formato}`;
            }
        } else {
            // Para imprimir
            if (tipoDocumento === 'entrega') {
                url = `${rutaBase}/descargar?formato=${formato}&accion=stream`;
            } else if (tipoDocumento === 'pago') {
                // Para pagos
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'venta') {
                // Para ventas
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'compra') {
                // Para compras - usar nuevo endpoint HTML-based
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'cuenta-por-cobrar') {
                // Para cuentas por cobrar - ruta específica para ticket-80
                url = `/ventas${rutaBase}/imprimir-${formato.toLowerCase().replace(/_/g, '-')}`;
            } else if (tipoDocumento === 'cuenta-por-pagar') {
                // Para cuentas por pagar - ruta específica para ticket-80
                url = `/compras${rutaBase}/imprimir-${formato.toLowerCase().replace(/_/g, '-')}`;
            } else if (tipoDocumento === 'stock') {
                // Para stock
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'ajuste') {
                // Para ajustes - incluir ajuste_id si es positivo (impresión histórica)
                if (documentoId && documentoId > 0) {
                    url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}&ajuste_id=${documentoId}`;
                } else {
                    url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
                }
            } else if (tipoDocumento === 'merma') {
                // Para mermas
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'proforma') {
                // ✅ Para proformas INDIVIDUALES - rutaBase ya incluye el ID
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'reporte-productos-vendidos') {
                // Para reporte de productos vendidos - obtener filtros de la URL actual
                const params = new URLSearchParams(window.location.search);
                const queryString = params.toString();
                url = `/ventas/reporte-productos-vendidos/imprimir?${queryString}&formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'prestamo-cliente') {
                // Para préstamos de cliente
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'devoluciones-cliente') {
                // Para devoluciones de cliente
                url = `/prestamos/clientes/${documentoId}/devoluciones/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'prestamo-proveedor') {
                // Para préstamos a proveedor
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'prestamos-vendidos') {
                // Para ventas de prestables
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else if (tipoDocumento === 'compras-prestables') {
                // Para compras de prestables
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            } else {
                url = `${rutaBase}/imprimir?formato=${formato}&accion=${accionURL}`;
            }
        }

        return url;
    };

    const handleImprimir = async () => {
        const formato = formatoSeleccionado || formatoDefault;
        setLoading(true);

        try {
            const url = construirURL(formato, 'stream', 'imprimir');
            console.log('🖨️ [OutputSelectionModal] Construyendo URL de impresión:', {
                documentoId: documentoId,
                tipoDocumento: tipoDocumento,
                formato: formato,
                urlGenerada: url,
            });
            window.open(url, '_blank');
            NotificationService.success('Documento enviado a impresión');
            handleClose();
        } catch (error) {
            NotificationService.error('Error al imprimir el documento');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExcel = async () => {
        setLoading(true);

        try {
            const url = construirURL('', 'download', 'excel');
            window.location.href = url;
            NotificationService.success('Descargando archivo Excel');
            handleClose();
        } catch (error) {
            NotificationService.error('Error al generar Excel');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePDF = async () => {
        const formato = formatoSeleccionado || formatoDefault;
        setLoading(true);

        try {
            const url = construirURL(formato, 'download', 'pdf');
            window.location.href = url;
            NotificationService.success('Descargando archivo PDF');
            handleClose();
        } catch (error) {
            NotificationService.error('Error al generar PDF');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAccion(null);
        setFormatoSeleccionado('');
        setImpresoras([]);
        setImpresoraSeleccionada('');
        onClose();
    };

    const handleVolver = () => {
        setAccion(null);
        setFormatoSeleccionado('');
        setImpresoras([]);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        {accion && (
                                            <button
                                                onClick={handleVolver}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition"
                                            >
                                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                        )}
                                        <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {accion
                                                ? accion === 'imprimir'
                                                    ? 'Configurar Impresión'
                                                    : accion === 'excel'
                                                        ? 'Descargar Excel'
                                                        : 'Descargar PDF'
                                                : 'Exportar Documento'}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition"
                                    >
                                        <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* Información del documento */}
                                {documentoInfo && (documentoInfo.numero || documentoInfo.fecha) && (
                                    <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-900 dark:text-blue-300">
                                            {documentoInfo.numero && <span>Documento: {documentoInfo.numero}</span>}
                                            {documentoInfo.numero && documentoInfo.fecha && <span> • </span>}
                                            {documentoInfo.fecha && <span>{documentoInfo.fecha}</span>}
                                        </p>
                                    </div>
                                )}

                                {/* Pantalla de selección de acción */}
                                {!accion ? (
                                    <div className="space-y-3">
                                        <button
                                            autoFocus
                                            onClick={() => {
                                                setAccion('imprimir');
                                                setCargarImpresoras(true);
                                            }}
                                            className="w-full p-4 text-left border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Printer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        Imprimir
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Enviar a la impresora seleccionada
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setAccion('excel')}
                                            className="w-full p-4 text-left border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        Descargar Excel
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Exportar con formato profesional
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setAccion('pdf')}
                                            className="w-full p-4 text-left border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        Descargar PDF
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Exportar documento en PDF
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Selector de Impresora (solo para imprimir) */}
                                        {accion === 'imprimir' && impresoras.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Seleccionar impresora
                                                </label>
                                                <select
                                                    value={impresoraSeleccionada}
                                                    onChange={(e) => setImpresoraSeleccionada(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                >
                                                    {impresoras.map((printer) => (
                                                        <option key={printer.name} value={printer.name}>
                                                            {printer.name}
                                                            {printer.isDefault ? ' (predeterminada)' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Advertencia si no hay impresoras */}
                                        {accion === 'imprimir' && impresoras.length === 0 && (
                                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex gap-2">
                                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                    Se usará el diálogo de impresión del navegador para seleccionar la impresora
                                                </p>
                                            </div>
                                        )}

                                        {/* Selector de Formato - solo para Imprimir y PDF */}
                                        {(accion === 'imprimir' || accion === 'pdf') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Formato {accion === 'imprimir' ? 'de impresión' : ''}
                                                </label>
                                                <div className="space-y-2">
                                                    {formatosDisponibles.map((formato) => (
                                                        <button
                                                            key={formato.formato}
                                                            onClick={() => setFormatoSeleccionado(formato.formato)}
                                                            className={`w-full p-3 text-left rounded-lg border transition ${(formatoSeleccionado || formatoDefault) === formato.formato
                                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                    : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                                                }`}
                                                        >
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {formato.nombre}
                                                            </p>
                                                            {formato.descripcion && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                                                    {formato.descripcion}
                                                                </p>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Confirmación para Excel */}
                                        {accion === 'excel' && (
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    Se descargará un archivo Excel con formato profesional que incluye datos de la empresa, documentos y totales.
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer con botones */}
                                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-zinc-700">
                                            <Button
                                                variant="outline"
                                                onClick={handleVolver}
                                                disabled={loading}
                                                className="flex-1"
                                            >
                                                Atrás
                                            </Button>
                                            <Button
                                                onClick={
                                                    accion === 'imprimir'
                                                        ? handleImprimir
                                                        : accion === 'excel'
                                                            ? handleExcel
                                                            : handlePDF
                                                }
                                                disabled={loading}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                            >
                                                {loading
                                                    ? 'Procesando...'
                                                    : accion === 'imprimir'
                                                        ? 'Imprimir'
                                                        : 'Descargar'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
