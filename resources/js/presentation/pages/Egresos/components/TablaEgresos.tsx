import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TablaEgresosProps {
    egresos: any;
    cargando: boolean;
    onPageChange?: (page: number) => void;
}

export default function TablaEgresos({
    egresos,
    cargando,
    onPageChange
}: TablaEgresosProps) {
    if (!egresos || !egresos.data) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    No hay datos disponibles
                </p>
            </div>
        );
    }

    const extraerCategoria = (observaciones: string): string | null => {
        const match = observaciones.match(/^\[([^\]]+)\]/);
        return match ? match[1] : null;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            📅 Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            👤 Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            📊 Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            🏷️ Categoría
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            💰 Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            📝 Observaciones
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
                            🔒 Caja
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {egresos.data.map((egreso: any, index: number) => {
                        const categoria = extraerCategoria(egreso.observaciones);
                        const fechaFormato = egreso.fecha
                            ? format(new Date(egreso.fecha), 'dd MMM yyyy HH:mm', { locale: es })
                            : '-';

                        return (
                            <tr
                                key={egreso.id || index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    {fechaFormato}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <div>
                                        <p className="font-medium">{egreso.usuario?.name || '-'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {egreso.usuario?.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                        {egreso.tipoOperacion?.nombre || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {categoria ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {categoria.replace(/_/g, ' ')}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-600">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                        - Bs. {Math.abs(egreso.monto).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                                    <p className="truncate">
                                        {egreso.observaciones || '-'}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <p className="font-medium">{egreso.caja?.nombre || '-'}</p>
                                    {egreso.apertura?.estado && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {egreso.apertura.estado}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Paginación */}
            {egresos.links && egresos.links.length > 3 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-center gap-2">
                        {egresos.links.map((link: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => onPageChange?.(link.label)}
                                disabled={!link.url || link.active}
                                className={`px-3 py-1 text-sm rounded ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {cargando && (
                <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            )}
        </div>
    );
}
