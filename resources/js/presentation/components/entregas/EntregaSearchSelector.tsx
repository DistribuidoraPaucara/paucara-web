import React, { useState } from 'react';
import { Search, X, Loader } from 'lucide-react';

interface Entrega {
    id: number;
    numero_entrega: string;
    estado: string;
    chofer?: { name: string };
    vehiculo?: { placa: string };
}

interface EntregaSearchSelectorProps {
    value: string | number | null;
    onValueChange: (value: string | number | null) => void;
    placeholder?: string;
}

export default function EntregaSearchSelector({
    value,
    onValueChange,
    placeholder = 'Busca por ID, chofer, vehículo, estado...'
}: EntregaSearchSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [entregas, setEntregas] = useState<Entrega[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);

    const buscarEntregas = async () => {
        if (!searchTerm.trim()) {
            setEntregas([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `/logistica/entregas/search?q=${encodeURIComponent(searchTerm)}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error en búsqueda de entregas');
            }

            const data = await response.json();
            setEntregas(data.data || []);
            setIsOpen(true);
        } catch (error) {
            console.error('Error buscando entregas:', error);
            setEntregas([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectEntrega = (entrega: Entrega) => {
        setSelectedEntrega(entrega);
        onValueChange(entrega.id);
        setIsOpen(false);
        setSearchTerm('');
        setEntregas([]);
    };

    const handleClear = () => {
        setSelectedEntrega(null);
        onValueChange(null);
        setSearchTerm('');
        setEntregas([]);
    };

    return (
        <div className="space-y-3">
            {/* Buscador */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && buscarEntregas()}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={buscarEntregas}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    Buscar
                </button>
            </div>

            {/* Entrega seleccionada */}
            {selectedEntrega && (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-green-900 dark:text-green-200">
                            #{selectedEntrega.numero_entrega}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                            {selectedEntrega.estado || 'N/A'}
                        </span>
                        <span className="text-sm text-green-700 dark:text-green-300">
                            {selectedEntrega.chofer?.name || 'Sin chofer'} / {selectedEntrega.vehiculo?.placa || 'Sin vehículo'}
                        </span>
                    </div>
                    <button
                        onClick={handleClear}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Resultados de búsqueda */}
            {isOpen && entregas.length > 0 && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 max-h-60 overflow-y-auto">
                    {entregas.map((entrega) => (
                        <button
                            key={entrega.id}
                            onClick={() => handleSelectEntrega(entrega)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 border-b dark:border-gray-700 last:border-b-0 transition-colors flex items-center gap-2"
                        >
                            <span className="font-medium text-gray-900 dark:text-white">
                                #{entrega.numero_entrega}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                {entrega.estado || 'N/A'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {entrega.chofer?.name || 'Sin chofer'} / {entrega.vehiculo?.placa || 'Sin vehículo'}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Sin resultados */}
            {isOpen && entregas.length === 0 && searchTerm && !isLoading && (
                <div className="text-sm text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    ℹ️ No se encontraron entregas con esa búsqueda
                </div>
            )}

            {/* Mensaje de ayuda */}
            {!selectedEntrega && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 Ingresa el número de entrega, chofer, vehículo o estado y presiona "Buscar"
                </p>
            )}
        </div>
    );
}
