import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';
import type { Entrega } from '@/domain/entities/entregas';

interface EntregaHistorialCambiosProps {
    entrega: Entrega;
    title?: string;
    showIcon?: boolean;
}

/**
 * EntregaHistorialCambios Component
 *
 * Muestra el historial de cambios de estado de una entrega
 * Incluye estado anterior, estado nuevo, usuario y timestamp
 *
 * @example
 * <EntregaHistorialCambios entrega={entrega} />
 */
export default function EntregaHistorialCambios({
    entrega,
    title = '📜 Historial de Cambios',
    showIcon = true,
}: EntregaHistorialCambiosProps) {
    // No mostrar si no hay historial
    if (!entrega.historialEstados || entrega.historialEstados.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sin cambios de estado registrados
                </p>
            </div>
        );
    }

    // Ordenar por fecha descendente (más reciente primero)
    const historialOrdenado = [...entrega.historialEstados].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">
                        {historialOrdenado.length} cambios
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {historialOrdenado.map((cambio, index) => (
                    <div
                        key={cambio.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        {/* Timeline line */}
                        {index < historialOrdenado.length - 1 && (
                            <div className="absolute left-7 top-0 w-0.5 h-full bg-blue-200 dark:bg-blue-900/50" />
                        )}

                        <div className="flex gap-4">
                            {/* Timeline dot */}
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                {/* Estado cambio */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
                                        {cambio.estado_anterior}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                                        {cambio.estado_nuevo}
                                    </span>
                                </div>

                                {/* Usuario y fecha */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                    {/* Usuario */}
                                    {cambio.usuario && (
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                {cambio.usuario.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {new Date(cambio.created_at).toLocaleString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>

                                {/* Notas o descripción adicional */}
                                {cambio.descripcion && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {cambio.descripcion}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
