import { useAuth } from '@/application/hooks/use-auth';
import { ComprasService } from '@/infrastructure/services/compras.service';
import { formatCurrency } from '@/lib/utils';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Link } from '@inertiajs/react';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Edit, Eye, Printer } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AnularCompraModal, { type ErrorAnulacion } from './AnularCompraModal';
import EliminarCompraDialog from './eliminar-compra-dialog';

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

// Columnas ordenables (deben coincidir con sort_by aceptado en CompraController@index).
// Al hacer clic por primera vez: los textos ordenan A→Z; números y fechas, del más reciente/mayor al menor.
type CampoOrden = 'id' | 'numero' | 'estado' | 'proveedor' | 'total' | 'created_at';
const PRIMERA_DIRECCION: Record<CampoOrden, 'asc' | 'desc'> = {
    id: 'desc',
    numero: 'desc',
    estado: 'asc',
    proveedor: 'asc',
    total: 'desc',
    created_at: 'desc',
};

function EncabezadoOrdenable({
    campo,
    sortBy,
    sortDir,
    onSort,
    children,
}: {
    campo: CampoOrden;
    sortBy: string;
    sortDir: string;
    onSort: (campo: CampoOrden) => void;
    children: React.ReactNode;
}) {
    const activo = sortBy === campo;
    const Icono = !activo ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown;

    return (
        <th
            scope="col"
            aria-sort={activo ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="px-2 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
        >
            <button
                type="button"
                onClick={() => onSort(campo)}
                title={activo ? `Ordenado ${sortDir === 'asc' ? 'ascendente' : 'descendente'}. Clic para invertir` : 'Clic para ordenar'}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 uppercase transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    activo ? 'font-semibold text-gray-900 dark:text-white' : ''
                }`}
            >
                {children}
                <Icono className={`h-3.5 w-3.5 ${activo ? 'text-blue-600 dark:text-blue-400' : 'opacity-40'}`} />
            </button>
        </th>
    );
}

export default function TablaCompras({ compras, sortBy = 'created_at', sortDir = 'desc', className = '' }: Props) {
    const { can } = useAuth();
    const [anularModal, setAnularModal] = useState<{ isOpen: boolean; compra?: Compra }>({ isOpen: false });
    const [errorAnulacion, setErrorAnulacion] = useState<ErrorAnulacion | null>(null);
    const [isAnulando, setIsAnulando] = useState(false);
    const [outputModal, setOutputModal] = useState<{ isOpen: boolean; compra?: Compra }>({ isOpen: false });

    // Valor por defecto para evitar errores de undefined
    const comprasSeguras = compras || [];

    // Misma columna: invierte la dirección. Columna nueva: usa su dirección natural.
    // Conserva los filtros de la URL y vuelve a la página 1.
    const handleSort = (campo: CampoOrden) => {
        const nuevaDireccion = sortBy === campo ? (sortDir === 'asc' ? 'desc' : 'asc') : PRIMERA_DIRECCION[campo];

        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sort_by', campo);
        currentParams.set('sort_dir', nuevaDireccion);
        currentParams.delete('page');

        comprasService.search(Object.fromEntries(currentParams.entries()));
    };

    const openAnularModal = (compra: Compra) => {
        setErrorAnulacion(null);
        setAnularModal({ isOpen: true, compra });
    };

    const closeAnularModal = () => {
        setAnularModal({ isOpen: false });
        setErrorAnulacion(null);
    };

    const handleAnularCompra = async (motivo?: string) => {
        if (!anularModal.compra) return;

        setIsAnulando(true);
        setErrorAnulacion(null);
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
                // Mostrar el motivo dentro del modal (sigue abierto)
                setErrorAnulacion({ message: data.message || 'Error al anular la compra', motivos: data.motivos });
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

    const orden = { sortBy, sortDir, onSort: handleSort };

    if (comprasSeguras.length === 0) {
        return (
            <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Sin compras</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron compras con los filtros aplicados.</p>
                        {can('compras.create') && (
                            <div className="mt-6">
                                <Link
                                    href="/compras/create"
                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className={`overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <EncabezadoOrdenable campo="id" {...orden}>Folio</EncabezadoOrdenable>
                            <EncabezadoOrdenable campo="numero" {...orden}>Número</EncabezadoOrdenable>
                            <EncabezadoOrdenable campo="estado" {...orden}>Estado</EncabezadoOrdenable>
                            <EncabezadoOrdenable campo="proveedor" {...orden}>Proveedor</EncabezadoOrdenable>
                            <EncabezadoOrdenable campo="total" {...orden}>Total</EncabezadoOrdenable>
                            <EncabezadoOrdenable campo="created_at" {...orden}>Fecha</EncabezadoOrdenable>
                            <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">-</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                        {comprasSeguras.map((compra) => (
                            <tr key={compra.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-2 py-4 text-center text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                    #{compra.id}
                                </td>
                                <td className="px-2 py-4 text-xs font-mono whitespace-nowrap text-gray-900 dark:text-white">
                                    {compra.numero}

                                    <p>
                                        {compra.numero_factura && (
                                            <span className="mt-2 rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
                                                Factura: #{compra.numero_factura}
                                            </span>
                                        )}
                                    </p>
                                </td>
                                <td className="px-2 py-4 text-center text-xs whitespace-nowrap text-gray-900 dark:text-white">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEstadoColor(compra.estado_documento)}`}
                                    >
                                        {compra.estado_documento?.nombre ?? 'Sin estado'}
                                    </span>
                                </td>

                                <td className="px-2 py-4 text-xs whitespace-nowrap text-gray-900 dark:text-white">
                                    <p className="text-xs font-medium">{compra.proveedor?.nombre ?? 'Sin proveedor'}</p>
                                    <p className="text-xs text-gray-400">
                                        <strong>Creador: </strong>
                                        {compra.usuario?.name}
                                    </p>
                                </td>

                                <td className="px-2 py-4 text-center text-xs whitespace-nowrap text-gray-900 dark:text-white">
                                    <div className="font-mono text-xs">
                                        <div className="font-semibold">{formatCurrency(Number(compra.total), compra.moneda?.simbolo)}</div>
                                        {compra.descuento > 0 && (
                                            <div className="text-xs text-gray-500">
                                                Desc: {formatCurrency(Number(compra.descuento), compra.moneda?.simbolo)}
                                            </div>
                                        )}
                                    </div>
                                    {compra.tipo_pago ? (
                                        <span
                                            className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                                                compra.tipo_pago.codigo === 'CONTADO'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                            }`}
                                        >
                                            {compra.tipo_pago.nombre}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Sin tipo</span>
                                    )}
                                </td>
                                <td className="px-2 py-4 text-center text-xs whitespace-nowrap text-gray-900 dark:text-white">
                                    <div className="font-medium">
                                        {new Date(compra.created_at).toLocaleString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                    </div>
                                </td>

                                <td className="px-2 py-4 text-right text-sm font-medium whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        {can('compras.show') && (
                                            <Link
                                                href={`/compras/${compra.id}`}
                                                className="inline-flex items-center rounded p-2 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                                                title="Ver detalle"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        )}

                                        {/* Botón Imprimir/Exportar - Disponible para todas las compras */}
                                        {can('compras.show') && (
                                            <button
                                                onClick={() => setOutputModal({ isOpen: true, compra })}
                                                className="inline-flex items-center rounded p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                                                title="Imprimir documento"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                        )}

                                        {/* Botón Editar - disponible si el usuario puede actualizar compras */}
                                        {can('compras.update') && (
                                            <Link
                                                href={`/compras/${compra.id}/edit`}
                                                className="inline-flex items-center rounded p-2 text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
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
                                                className="inline-flex items-center rounded p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                                title="Anular compra"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                            </button>
                                        )}

                                        {can('compras.delete') && <EliminarCompraDialog compra={compra} onSuccess={() => window.location.reload()} />}
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
                error={errorAnulacion}
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
