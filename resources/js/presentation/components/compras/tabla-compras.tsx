import { Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/application/hooks/use-auth';
import { Eye, Edit, ChevronUp, ChevronDown, AlertCircle, Printer } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import EliminarCompraDialog from './eliminar-compra-dialog';
import AnularCompraModal from './AnularCompraModal';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { ComprasService } from '@/infrastructure/services/compras.service';

// Importar tipos del domain
import type { Compra, EstadoDocumento } from '@/domain/entities/compras';

// Instanciar el service
const comprasService = new ComprasService();

interface Props {
    compras?: Compra[];
    sortBy?: string;
    sortDir?: string;
    className?: string;
}

const getEstadoColor = (estado?: EstadoDocumento) => {
    if (!estado) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

    switch (estado.nombre.toUpperCase()) {
        case 'BORRADOR':
            return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
        case 'PENDIENTE':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'APROBADO':
        case 'APROBADA':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'RECIBIDO':
        case 'RECIBIDA':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
        case 'PAGADO':
        case 'PAGADA':
        case 'COMPLETADA':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'RECHAZADO':
        case 'RECHAZADA':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'ANULADO':
        case 'ANULADA':
        case 'CANCELADA':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
};

export default function TablaCompras({ compras, sortBy = 'created_at', sortDir = 'desc', className = '' }: Props) {
    console.log('Renderizando TablaCompras con compras:', compras);
    const { can } = useAuth();
    const [anularModal, setAnularModal] = useState<{ isOpen: boolean; compra?: Compra }>({ isOpen: false });
    const [isAnulando, setIsAnulando] = useState(false);
    const [outputModal, setOutputModal] = useState<{ isOpen: boolean; compra?: Compra }>({ isOpen: false });

    // Valor por defecto para evitar errores de undefined
    const comprasSeguras = compras || [];

    const handleSort = (field: string) => {
        const newSortDir = sortBy === field && sortDir === 'desc' ? 'asc' : 'desc';

        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sort_by', field);
        currentParams.set('sort_dir', newSortDir);

        comprasService.search(Object.fromEntries(currentParams.entries()));
    };

    const openAnularModal = (compra: Compra) => {
        setAnularModal({ isOpen: true, compra });
    };

    const closeAnularModal = () => {
        setAnularModal({ isOpen: false });
    };

    const handleAnularCompra = async (motivo?: string) => {
        if (!anularModal.compra) return;

        setIsAnulando(true);
        try {
            const response = await fetch(`/compras/${anularModal.compra.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Error al anular la compra');
                return;
            }

            toast.success('Compra anulada exitosamente');
            closeAnularModal();

            // Recargar la página
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Error al anular compra:', error);
            toast.error('Error al anular la compra');
        } finally {
            setIsAnulando(false);
        }
    };

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return null;
        return sortDir === 'asc'
            ? <ChevronUp className="h-4 w-4 ml-1" />
            : <ChevronDown className="h-4 w-4 ml-1" />;
    };

    const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center">
                {children}
                {getSortIcon(field)}
            </div>
        </th>
    );

    if (comprasSeguras.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Sin compras</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            No se encontraron compras con los filtros aplicados.
                        </p>
                        {can('compras.create') && (
                            <div className="mt-6">
                                <Link
                                    href="/compras/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Nueva compra
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <SortableHeader field="numero">Número</SortableHeader>
                            <SortableHeader field="proveedor">Proveedor</SortableHeader>
                            <SortableHeader field="total">Total</SortableHeader>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {comprasSeguras.map((compra) => (
                            <tr key={compra.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    Folio: {compra.id} | {compra.numero}
                                    <div className="font-medium">
                                        {new Date(compra.created_at).toLocaleString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(compra.estado_documento)}`}>
                                        {compra.estado_documento?.nombre ?? 'Sin estado'}
                                    </span>
                                    <p>
                                        {compra.numero_factura ? (
                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                            {compra.numero_factura}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Sin factura</span>
                                    )}
                                    </p>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="font-medium">
                                                {compra.proveedor?.nombre ?? 'Sin proveedor'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                <strong>Creador: </strong>{compra.usuario?.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                                    <div className="font-mono">
                                        <div className="font-semibold">
                                            {formatCurrency(Number(compra.total), compra.moneda?.simbolo)}
                                        </div>
                                        {compra.descuento > 0 && (
                                            <div className="text-xs text-gray-500">
                                                Desc: {formatCurrency(Number(compra.descuento), compra.moneda?.simbolo)}
                                            </div>
                                        )}
                                    </div>
                                    {compra.tipo_pago ? (
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${compra.tipo_pago.codigo === 'CONTADO'
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                            : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                                            }`}>
                                            {compra.tipo_pago.nombre}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Sin tipo</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {can('compras.show') && (
                                            <Link
                                                href={`/compras/${compra.id}`}
                                                className="inline-flex items-center p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        )}

                                        {/* Botón Imprimir/Exportar - Disponible para todas las compras */}
                                        {can('compras.show') && (
                                            <button
                                                onClick={() => setOutputModal({ isOpen: true, compra })}
                                                className="inline-flex items-center p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                title="Imprimir documento"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                        )}

                                        {/* Botón Editar - disponible si el usuario puede actualizar compras */}
                                        {can('compras.update') && (
                                            <Link
                                                href={`/compras/${compra.id}/edit`}
                                                className="inline-flex items-center p-2 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        )}

                                        {/* Botón Anular - Solo si está APROBADO */}
                                        {can('compras.update') && compra.estado_documento?.codigo === 'APROBADO' && (
                                            <button
                                                onClick={() => openAnularModal(compra)}
                                                disabled={isAnulando}
                                                className="inline-flex items-center p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Anular compra"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                            </button>
                                        )}

                                        {can('compras.delete') && (
                                            <EliminarCompraDialog
                                                compra={compra}
                                                onSuccess={() => window.location.reload()}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de anulación */}
            <AnularCompraModal
                isOpen={anularModal.isOpen}
                onClose={closeAnularModal}
                compraNumero={anularModal.compra?.numero || ''}
                onConfirm={handleAnularCompra}
                isLoading={isAnulando}
            />

            {/* Modal de exportación/impresión */}
            <OutputSelectionModal
                isOpen={outputModal.isOpen}
                onClose={() => setOutputModal({ isOpen: false })}
                documentoId={outputModal.compra?.id || ''}
                tipoDocumento="compra"
                documentoInfo={{
                    numero: outputModal.compra?.numero,
                    fecha: outputModal.compra?.fecha ? new Date(outputModal.compra.fecha).toLocaleDateString('es-ES') : undefined,
                    monto: outputModal.compra?.total,
                }}
            />
        </div>
    );
}
