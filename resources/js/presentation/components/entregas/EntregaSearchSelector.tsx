import { Loader, Search, X } from 'lucide-react';
import { useState } from 'react';

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
    placeholder = 'Busca por ID, chofer, vehículo, estado...',
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
            const response = await fetch(`/logistica/entregas/search?q=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Error en búsqueda de entregas');
            }

            const data = await response.json();
            const resultados = data.data || [];
            setEntregas(resultados);

            // ✅ NUEVO (2026-08-26): Auto-seleccionar si hay un único resultado
            if (resultados.length === 1) {
                console.log('✅ [EntregaSearchSelector] Auto-seleccionando único resultado:', resultados[0]);
                setSelectedEntrega(resultados[0]);
                onValueChange(resultados[0].id);
                setSearchTerm('');
                setEntregas([]);
                setIsOpen(false);
            } else if (resultados.length > 1) {
                setIsOpen(true);
            }
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
            <div className="flex gap-1">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && buscarEntregas()}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
                />
                <button
                    onClick={buscarEntregas}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-2 py-2 text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
                >
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </button>
            </div>

            {/* Entrega seleccionada */}
            {selectedEntrega && (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center gap-2">
                        <span className="font-small text-xs text-green-900 dark:text-green-200">
                            #{selectedEntrega.id} - {selectedEntrega.estado || 'N/A'}
                        </span>
                        <span className="text-xs text-green-700 dark:text-green-300">
                            {selectedEntrega.chofer?.name || 'Sin chofer'} / {selectedEntrega.vehiculo?.placa || 'Sin vehículo'}
                        </span>
                    </div>
                    <button onClick={handleClear} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Resultados de búsqueda */}
            {isOpen && entregas.length > 0 && (
                <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-zinc-800">
                    {entregas.map((entrega) => (
                        <button
                            key={entrega.id}
                            onClick={() => handleSelectEntrega(entrega)}
                            className="flex w-full items-center gap-2 border-b px-2 py-2 text-left transition-colors last:border-b-0 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-zinc-700"
                        >
                            <span className="text-xs text-gray-900 dark:text-white">
                                #{entrega.id} -{entrega.estado || 'N/A'}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {entrega.chofer?.name || 'Sin chofer'} / {entrega.vehiculo?.placa || 'Sin vehículo'}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Sin resultados */}
            {isOpen && entregas.length === 0 && searchTerm && !isLoading && (
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    ℹ️ No se encontraron entregas con esa búsqueda
                </div>
            )}

            {/* Mensaje de ayuda */}
            {/* {!selectedEntrega && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 Ingresa el número de entrega, chofer, vehículo o estado y presiona "Buscar"
                </p>
            )} */}
        </div>
    );
}
