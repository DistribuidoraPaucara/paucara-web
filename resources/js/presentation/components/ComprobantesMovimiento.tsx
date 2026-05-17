import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Comprobante {
    id: number;
    nombre_original: string;
    ruta_archivo: string;
    tipo_archivo: string;
    tamaño: number;
    created_at: string;
}

interface Props {
    comprobantes: Comprobante[] | undefined;
}

export function ComprobantesMovimiento({ comprobantes }: Props) {
    const [selectedComprobante, setSelectedComprobante] = useState<Comprobante | null>(null);

    if (!comprobantes || comprobantes.length === 0) {
        return (
            <div className="text-center py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Sin comprobantes</p>
            </div>
        );
    }

    const getIcono = (tipoArchivo: string) => {
        if (tipoArchivo.startsWith('image/')) return '🖼️';
        if (tipoArchivo.includes('pdf')) return '📄';
        return '📎';
    };

    const formatTamaño = (bytes: number) => {
        const kb = (bytes / 1024).toFixed(2);
        return kb + ' KB';
    };

    return (
        <div className="space-y-2">
            {comprobantes.map((comprobante) => (
                <div
                    key={comprobante.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-lg">{getIcono(comprobante.tipo_archivo)}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                {comprobante.nombre_original}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTamaño(comprobante.tamaño)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-2">
                        <a
                            href={comprobante.ruta_archivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-6 h-6 text-xs rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition"
                            title="Descargar"
                        >
                            ⬇️
                        </a>
                        {comprobante.tipo_archivo.startsWith('image/') && (
                            <button
                                onClick={() => setSelectedComprobante(comprobante)}
                                className="inline-flex items-center justify-center w-6 h-6 text-xs rounded hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400 transition"
                                title="Ver preview"
                            >
                                👁️
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {/* Modal de Preview */}
            {selectedComprobante && selectedComprobante.tipo_archivo.startsWith('image/') && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
                    onClick={() => setSelectedComprobante(null)}
                >
                    <div
                        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl max-h-96 overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedComprobante(null)}
                            className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={selectedComprobante.ruta_archivo}
                            alt={selectedComprobante.nombre_original}
                            className="w-full h-auto"
                        />
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {selectedComprobante.nombre_original}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTamaño(selectedComprobante.tamaño)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
