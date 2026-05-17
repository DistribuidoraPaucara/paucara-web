/**
 * Componente: Botón de Impresión para Listado de Compras
 *
 * Similar a ImprimirVentasButton pero adaptado para compras.
 * Soporta formatos: A4 (Carta), TICKET_80, TICKET_58
 */

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/presentation/components/ui/button';
import { Printer, Download, ChevronLeft, X } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface Compra {
    id: number;
    numero: string;
    fecha: string;
    [key: string]: any;
}

interface FiltrosCompras {
    proveedor_id?: string | number;
    estado_documento_id?: string | number;
    fecha_desde?: string;
    fecha_hasta?: string;
    [key: string]: any;
}

interface ImprimirComprasButtonProps {
    compras: Compra[];
    filtros?: FiltrosCompras;
    className?: string;
    iconOnly?: boolean;
}

const FORMATOS_COMPRAS = [
    { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar carta' },
    { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
];

export function ImprimirComprasButton({
    compras,
    filtros = {},
    className = '',
    iconOnly = false,
}: ImprimirComprasButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accion, setAccion] = useState<'imprimir' | 'pdf' | null>(null);
    const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('A4');

    const prepararImpresion = async (formato: string, accionURL: 'download' | 'stream' = 'stream') => {
        console.log('Preparando impresión de compras:', { formato, filtros, accion: accionURL });
        setLoading(true);

        try {
            // Primero, obtener las compras filtradas del API
            const params = new URLSearchParams();

            // Agregar filtros como parámetros de query
            if (filtros) {
                if (filtros.proveedor_id) params.append('proveedor_id', String(filtros.proveedor_id));
                if (filtros.estado_documento_id) params.append('estado_documento_id', String(filtros.estado_documento_id));
                if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
                if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
                if (filtros.q) params.append('q', filtros.q);
            }

            console.log('Obteniendo compras con parámetros:', params.toString());

            // Usar endpoint específico para impresión que retorna TODOS los registros sin paginación
            const apiResponse = await fetch(`/api/compras/para-impresion?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!apiResponse.ok) {
                throw new Error('Error al obtener compras filtradas');
            }

            const apiData = await apiResponse.json();

            console.log('📊 Respuesta API completa:', JSON.stringify(apiData, null, 2));
            console.log('📊 apiData.data tipo:', typeof apiData.data, 'isArray:', Array.isArray(apiData.data), 'keys:', apiData.data ? Object.keys(apiData.data).slice(0, 10) : 'null');

            // Extraer el array de datos
            let comprasFiltradas: any[] = [];

            if (!apiData.data) {
                console.warn('⚠️ apiData.data es null o undefined');
                comprasFiltradas = compras;
            } else if (Array.isArray(apiData.data)) {
                console.log('✅ apiData.data es un array');
                comprasFiltradas = apiData.data;
            } else if (typeof apiData.data === 'object' && apiData.data.data && Array.isArray(apiData.data.data)) {
                // Caso: respuesta paginada { data: [...], ...pagination }
                console.log('✅ apiData.data es un objeto paginado, extrayendo .data');
                comprasFiltradas = apiData.data.data;
            } else if (typeof apiData.data === 'object' && Object.keys(apiData.data).length > 0) {
                // Caso: objeto con propiedades numéricas (Collection convertida)
                console.log('✅ apiData.data es un objeto, convirtiendo a array');
                comprasFiltradas = Object.values(apiData.data);
            } else {
                console.warn('⚠️ No se pudo extraer array, usando compras fallback');
                comprasFiltradas = compras;
            }

            console.log('✅ Compras filtradas obtenidas:', { cantidad: comprasFiltradas.length, tipo: typeof comprasFiltradas, es_array: Array.isArray(comprasFiltradas) });

            // Realizar petición POST para guardar datos en sesión
            const response = await fetch('/api/stock/preparar-impresion-compras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    compras: comprasFiltradas,
                    filtros: filtros || {},
                }),
            });

            if (!response.ok) {
                throw new Error('Error al preparar la impresión');
            }

            // Construir URL de impresión
            const url = `/compras/imprimir?formato=${formato}&accion=${accionURL}`;

            console.log('URL de impresión generada:', url);

            // Abrir en nueva ventana para preview, o descargar
            if (accionURL === 'stream') {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }

            NotificationService.success('Reporte de compras enviado');
            handleClose();
        } catch (error) {
            console.error('Error al imprimir:', error);
            NotificationService.error('Error al preparar la impresión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleImprimir = async () => {
        const formato = formatoSeleccionado || 'A4';
        await prepararImpresion(formato, 'stream');
    };

    const handleDescargar = async () => {
        const formato = formatoSeleccionado || 'A4';
        await prepararImpresion(formato, 'download');
    };

    const handleClose = () => {
        setAccion(null);
        setFormatoSeleccionado('A4');
        setIsModalOpen(false);
    };

    const handleVolver = () => {
        setAccion(null);
    };

    // No mostrar si no hay compras
    if (compras.length === 0) {
        return null;
    }

    return (
        <>
            {iconOnly ? (
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={loading}
                    className={`inline-flex items-center p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                    title="Imprimir"
                >
                    <Printer className="h-4 w-4" />
                </button>
            ) : (
                <Button
                    variant="outline"
                    disabled={loading}
                    className={className}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Printer className="mr-2 h-4 w-4" />
                    {loading ? 'Generando...' : 'Imprimir'}
                </Button>
            )}

            {/* Modal de Selección de Formato */}
            <Transition appear show={isModalOpen} as={Fragment}>
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
                                                {accion ? 'Seleccionar formato' : 'Reporte de Compras'}
                                            </Dialog.Title>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition"
                                        >
                                            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Información */}
                                    <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-900 dark:text-blue-300">
                                            Registros: <span className="font-semibold">{compras.length}</span>
                                        </p>
                                    </div>

                                    {/* Pantalla principal: seleccionar acción */}
                                    {!accion ? (
                                        <div className="space-y-3">
                                            <button
                                                autoFocus
                                                onClick={() => setAccion('imprimir')}
                                                className="w-full p-4 text-left border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Printer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            Imprimir
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Ver en pantalla
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setAccion('pdf')}
                                                className="w-full p-4 text-left border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            Descargar PDF
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Guardar como archivo
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        /* Pantalla de selección de formato */
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Formato de impresión
                                                </label>
                                                <div className="space-y-2">
                                                    {FORMATOS_COMPRAS.map((formato) => (
                                                        <button
                                                            key={formato.formato}
                                                            onClick={() => setFormatoSeleccionado(formato.formato)}
                                                            className={`w-full p-3 text-left rounded-lg border transition ${formatoSeleccionado === formato.formato
                                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                    : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                                                                }`}
                                                        >
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {formato.nombre}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                                                {formato.descripcion}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
                                                <button
                                                    onClick={handleVolver}
                                                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition font-medium"
                                                >
                                                    Atrás
                                                </button>
                                                <button
                                                    onClick={handleImprimir}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                    {loading ? 'Preparando...' : 'Imprimir'}
                                                </button>
                                                <button
                                                    onClick={handleDescargar}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    {loading ? 'Preparando...' : 'Descargar'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
