/**
 * Componente: Botón de Impresión para Listado de Movimientos
 *
 * Reemplaza FormatoSelector con Modal Dialog para seleccionar formato de impresión.
 * Soporta formatos: A4 (Carta), TICKET_80, TICKET_58
 */

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/presentation/components/ui/button';
import { Printer, Download, ChevronLeft, X } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface Movimiento {
    id: number;
    fecha: string;
    tipo: string;
    cantidad: number;
    motivo: string;
    [key: string]: any;
}

interface FiltrosMovimientos {
    tipo?: string;
    producto_id?: string;
    almacen_id?: string;
    [key: string]: any;
}

interface ImprimirMovimientosButtonProps {
    movimientos: Movimiento[];
    filtros?: FiltrosMovimientos;
    className?: string;
    iconOnly?: boolean;
}

const FORMATOS_MOVIMIENTOS = [
    { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar carta' },
    { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
    { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
];

export function ImprimirMovimientosButton({
    movimientos,
    filtros = {},
    className = '',
    iconOnly = false,
}: ImprimirMovimientosButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accion, setAccion] = useState<'imprimir' | 'pdf' | null>(null);
    const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('A4');

    const prepararImpresion = async (formato: string, accionURL: 'download' | 'stream' = 'stream') => {
        console.log('Preparando impresión de movimientos:', { formato, filtros, accion: accionURL });
        setLoading(true);

        try {
            // ✅ NUEVO FLUJO: Enviar filtros al backend para que haga el filtrado y genere documento
            // Limpiar filtros null/undefined/empty string antes de enviar
            const filtrosLimpios = Object.fromEntries(
                Object.entries(filtros || {}).filter(([_, value]) =>
                    value !== null && value !== undefined && value !== ''
                )
            );

            console.log('🔍 Filtros para enviar al backend:', filtrosLimpios);

            // Realizar petición POST para que backend filtre y guarde en sesión
            const response = await fetch('/api/stock/preparar-impresion-movimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    filtros: filtrosLimpios,
                    formato: formato,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al preparar la impresión');
            }

            const responseData = await response.json();

            console.log('✅ Backend preparó impresión:', {
                cantidad: responseData.cantidad_movimientos,
                ids: responseData.movimiento_ids,
                mensaje: responseData.message
            });

            // ✅ MEJORADO: El backend retorna directamente la URL
            const url = `/inventario/movimientos/imprimir?formato=${formato}&accion=${accionURL}`;

            console.log('📄 URL de impresión generada:', url);

            // Abrir en nueva ventana para preview, o descargar
            if (accionURL === 'stream') {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }

            NotificationService.success('Reporte de movimientos enviado');
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

    // No mostrar si no hay movimientos
    if (movimientos.length === 0) {
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
                                                {accion ? 'Seleccionar formato' : 'Reporte de Movimientos'}
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
                                            Registros: <span className="font-semibold">{movimientos.length}</span>
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
                                                    {FORMATOS_MOVIMIENTOS.map((formato) => (
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
                                                    onClick={accion === 'imprimir' ? handleImprimir : handleDescargar}
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
        </>
    );
}
