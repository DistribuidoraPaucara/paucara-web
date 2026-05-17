/**
 * Componente: Enlaces Rápidos del Dashboard
 *
 * Renderiza botones de acceso rápido a diferentes secciones del inventario
 */

import { Link } from '@inertiajs/react';

interface EnlacesRapidosProps {
    canViewStockBajo: boolean;
    canViewMovimientos: boolean;
    canAdjust: boolean;
    canViewReportes: boolean;
}

export default function EnlacesRapidos({
    canViewStockBajo,
    canViewMovimientos,
    canAdjust,
    canViewReportes,
}: EnlacesRapidosProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Enlaces Rápidos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {canViewStockBajo && (
                        <Link
                            href="/inventario/stock-bajo"
                            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                        >
                            <div className="text-center">
                                <svg
                                    className="w-8 h-8 text-red-600 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Stock Bajo</p>
                            </div>
                        </Link>
                    )}

                    {canViewMovimientos && (
                        <Link
                            href="/inventario/movimientos"
                            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                        >
                            <div className="text-center">
                                <svg
                                    className="w-8 h-8 text-purple-600 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Movimientos</p>
                            </div>
                        </Link>
                    )}

                    {canAdjust && (
                        <Link
                            href="/inventario/ajuste"
                            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        >
                            <div className="text-center">
                                <svg
                                    className="w-8 h-8 text-blue-600 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Ajustar</p>
                            </div>
                        </Link>
                    )}

                    {canViewReportes && (
                        <Link
                            href="/inventario/reportes"
                            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                        >
                            <div className="text-center">
                                <svg
                                    className="w-8 h-8 text-green-600 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Reportes</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
