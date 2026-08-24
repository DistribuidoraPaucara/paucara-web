import { useState } from 'react';
import { X } from 'lucide-react';

interface Filtros {
    tipo: string[];
    estado: string[];
    busqueda: string;
}

interface PrestamosFiltersProps {
    filtros: Filtros;
    onFiltrosChange: (filtros: Filtros) => void;
}

const tiposDisponibles = [
    { value: 'cliente', label: '👥 Cliente' },
    { value: 'evento', label: '🎉 Evento' },
    { value: 'proveedor', label: '🏭 Proveedor' },
];

const estadosDisponibles = [
    { value: 'activo', label: '✅ Activo' },
    { value: 'devuelto', label: '✔️ Devuelto' },
    { value: 'vencido', label: '⚠️ Vencido' },
    { value: 'parcial', label: '📦 Parcial' },
];

export default function PrestamosFilters({ filtros, onFiltrosChange }: PrestamosFiltersProps) {
    const [busqueda, setBusqueda] = useState(filtros.busqueda);

    const toggleTipo = (tipo: string) => {
        const nuevosTipos = filtros.tipo.includes(tipo)
            ? filtros.tipo.filter((t) => t !== tipo)
            : [...filtros.tipo, tipo];
        onFiltrosChange({ ...filtros, tipo: nuevosTipos });
    };

    const toggleEstado = (estado: string) => {
        const nuevosEstados = filtros.estado.includes(estado)
            ? filtros.estado.filter((e) => e !== estado)
            : [...filtros.estado, estado];
        onFiltrosChange({ ...filtros, estado: nuevosEstados });
    };

    const handleBusqueda = (valor: string) => {
        setBusqueda(valor);
        onFiltrosChange({ ...filtros, busqueda: valor });
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        onFiltrosChange({
            tipo: ['cliente', 'evento', 'proveedor'],
            estado: [],
            busqueda: '',
        });
    };

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            {/* Búsqueda */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🔍 Buscar por nombre
                </label>
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => handleBusqueda(e.target.value)}
                    placeholder="Cliente, evento, proveedor..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
            </div>

            {/* Tipos de préstamo */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Préstamo
                </label>
                <div className="flex flex-wrap gap-2">
                    {tiposDisponibles.map((tipo) => (
                        <button
                            key={tipo.value}
                            onClick={() => toggleTipo(tipo.value)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                filtros.tipo.includes(tipo.value)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                            }`}
                        >
                            {tipo.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Estados */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                </label>
                <div className="flex flex-wrap gap-2">
                    {estadosDisponibles.map((estado) => (
                        <button
                            key={estado.value}
                            onClick={() => toggleEstado(estado.value)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                filtros.estado.includes(estado.value)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                            }`}
                        >
                            {estado.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Botón Limpiar */}
            {(busqueda || filtros.tipo.length < 3 || filtros.estado.length > 0) && (
                <button
                    onClick={limpiarFiltros}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                    <X className="h-4 w-4" />
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}
