import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/application/hooks/use-auth';
import { Eye, Edit, ChevronUp, ChevronDown, CheckCircle, XCircle, Truck, CreditCard, Ban } from 'lucide-react';
import { ComprasService } from '@/infrastructure/services/compras.service';
import { NotificationService } from '@/infrastructure/services/notification.service';

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

// Acciones rápidas según el estado
const AccionesEstado = ({ compra }: { compra: Compra }) => {
    const { can } = useAuth();
    const [processing, setProcessing] = useState<string | null>(null);

    const cambiarEstado = async (nuevoEstadoId: number, mensaje: string) => {
        if (!can('compras.update')) {
            NotificationService.error('No tiene permisos para cambiar estados');
            return;
        }

        setProcessing(nuevoEstadoId.toString());

        try {
            // Usar el servicio de compras para hacer el update
            await comprasService.update(compra.id, {
                estado_documento_id: nuevoEstadoId,
            });

            NotificationService.success(mensaje);

            // Recargar la página para ver los cambios
            window.location.reload();
        } catch (error) {
            NotificationService.error('Error al cambiar estado');
            console.error(error);
        } finally {
            setProcessing(null);
        }
    };

    const estado = compra.estadoDocumento?.nombre;

    return (
        <div className="flex space-x-1">
            {estado === 'Pendiente' && can('compras.update') && (
                <>
                    <button
                        onClick={() => cambiarEstado('3', 'Compra aprobada')} // ID 3 = Aprobado
                        disabled={processing === '3'}
                        className="p-1 text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Aprobar compra"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => cambiarEstado('4', 'Compra rechazada')} // ID 4 = Rechazado
                        disabled={processing === '4'}
                        className="p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Rechazar compra"
                    >
                        <XCircle className="h-4 w-4" />
                    </button>
                </>
            )}

            {estado === 'Aprobado' && can('compras.update') && (
                <button
                    onClick={() => cambiarEstado('8', 'Mercancía recibida')} // ID 8 = Recibido
                    disabled={processing === '8'}
                    className="p-1 text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    title="Marcar como recibido"
                >
                    <Truck className="h-4 w-4" />
                </button>
            )}

            {estado === 'Recibido' && compra.tipoPago?.codigo === 'EFECTIVO' && can('compras.update') && (
                <button
                    onClick={() => cambiarEstado('9', 'Compra pagada')} // ID 9 = Pagado
                    disabled={processing === '9'}
                    className="p-1 text-green-600 hover:text-green-900 disabled:opacity-50"
                    title="Marcar como pagado"
                >
                    <CreditCard className="h-4 w-4" />
                </button>
            )}

            {['Aprobado', 'Recibido'].includes(estado || '') && can('compras.update') && (
                <button
                    onClick={() => cambiarEstado('10', 'Compra anulada')} // ID 10 = Anulado
                    disabled={processing === '10'}
                    className="p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Anular compra"
                >
                    <Ban className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default function TablaCompras({ compras, sortBy = 'created_at', sortDir = 'desc', className = '' }: Props) {
    const { can } = useAuth();

    // Valor por defecto para evitar errores de undefined
    const comprasSeguras = compras || [];

    const handleSort = (field: string) => {
        const newSortDir = sortBy === field && sortDir === 'desc' ? 'asc' : 'desc';

        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sort_by', field);
        currentParams.set('sort_dir', newSortDir);

        comprasService.search(Object.fromEntries(currentParams.entries()));
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
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Nueva Compra
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
                            <SortableHeader field="fecha">Fecha</SortableHeader>
                            <SortableHeader field="proveedor">Proveedor</SortableHeader>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tipo Pago
                            </th>
                            <SortableHeader field="total">Total</SortableHeader>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Acciones Rápidas
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Opciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {comprasSeguras.map((compra) => (
                            <tr key={compra.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {compra.numero}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(compra.fecha).toLocaleDateString('es-ES')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div>
                                        <div className="font-medium">{compra.proveedor?.nombre}</div>
                                        {compra.numero_factura && (
                                            <div className="text-xs text-gray-500">Fact: {compra.numero_factura}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(compra.estadoDocumento)}`}>
                                        {compra.estadoDocumento?.nombre || 'Sin estado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {compra.tipoPago?.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(compra.total, compra.moneda?.simbolo)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <AccionesEstado compra={compra} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Link
                                            href={`/compras/${compra.id}`}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            title="Ver compra"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        {can('compras.edit') && !['PAGADO', 'ANULADO'].includes(compra.estadoDocumento?.nombre || '') && (
                                            <Link
                                                href={`/compras/${compra.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                title="Editar compra"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
