/**
 * Componente: PaginacionPreciosComponent
 * Controles de paginación para la tabla de precios
 */

import React from 'react';

interface PaginacionPreciosProps {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}

export const PaginacionPreciosComponent: React.FC<PaginacionPreciosProps> = ({
    currentPage,
    lastPage,
    total,
    perPage,
    loading = false,
    onPageChange,
}) => {
    if (lastPage <= 1) return null;

    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, total);

    // Calcular números de página para mostrar
    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(lastPage, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < lastPage) {
            if (endPage < lastPage - 1) pages.push('...');
            pages.push(lastPage);
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center justify-between gap-4 mt-8 px-6 py-4">
            {/* Información de registros */}
            <div className="text-sm text-gray-600 dark:text-slate-400">
                Mostrando {startItem} a {endItem} de {total} productos
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-2 text-gray-500 dark:text-slate-400">
                                    {page}
                                </span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(Number(page))}
                                    disabled={loading}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                        page === currentPage
                                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                                            : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Botón siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage || loading}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
