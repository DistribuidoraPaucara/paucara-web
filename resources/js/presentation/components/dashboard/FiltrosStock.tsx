/**
 * Componente: Filtros de Stock
 *
 * Permite filtrar la tabla de stock por producto, almacén, rango de cantidad y ordenamiento
 */

import { useState } from 'react';

interface Almacen {
    id: number;
    nombre: string;
}

interface FiltrosStockProps {
    almacenes: Almacen[];
    onFiltrosChange: (filtros: FiltrosState) => void;
}

export interface FiltrosState {
    busqueda: string;
    almacenId: string;
    rangoStock: string; // 'todos', 'bajo', 'normal', 'alto'
    ordenamiento: string; // 'cantidad-asc', 'cantidad-desc', 'producto', 'almacen'
    soloConStock: boolean; // Mostrar solo productos con stock >= 1
}

const RANGOS_STOCK = {
    todos: { label: 'Todos', min: 0, max: Infinity },
    cero: { label: 'Sin Stock (0)', min: 0, max: 0 },
    bajo: { label: 'Stock Bajo (< 10)', min: 0, max: 10 },
    normal: { label: 'Stock Normal (10-100)', min: 10, max: 100 },
    alto: { label: 'Stock Alto (> 100)', min: 100, max: Infinity },
};

export default function FiltrosStock({ almacenes, onFiltrosChange }: FiltrosStockProps) {
    // Estado local para edición (no envía al padre inmediatamente)
    const [busquedaLocal, setBusquedaLocal] = useState('');

    // Estado de filtros aplicados (se envía al padre)
    const [filtros, setFiltros] = useState<FiltrosState>({
        busqueda: '',
        almacenId: '',
        rangoStock: 'todos',
        ordenamiento: 'cantidad-desc',
        soloConStock: false,
    });

    // Aplica los filtros cuando se presiona Buscar o Enter
    const aplicarBusqueda = () => {
        const filtrosActualizados = { ...filtros, busqueda: busquedaLocal };
        setFiltros(filtrosActualizados);
        onFiltrosChange(filtrosActualizados);
    };

    // Aplica cambios en select inmediatamente (almacén, rango, ordenamiento)
    const handleFiltroChange = (nuevos: Partial<FiltrosState>) => {
        const filtrosActualizados = { ...filtros, ...nuevos };
        setFiltros(filtrosActualizados);
        onFiltrosChange(filtrosActualizados);
    };

    // Maneja Enter en el input de búsqueda
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            aplicarBusqueda();
        }
    };

    const limpiarFiltros = () => {
        const filtrosLimpios: FiltrosState = {
            busqueda: '',
            almacenId: '',
            rangoStock: 'todos',
            ordenamiento: 'cantidad-desc',
            soloConStock: false,
        };
        setBusquedaLocal('');
        setFiltros(filtrosLimpios);
        onFiltrosChange(filtrosLimpios);
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-lg mb-6 border border-blue-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Filtros
                </h3>
                {(filtros.busqueda || filtros.almacenId || filtros.rangoStock !== 'todos' || filtros.ordenamiento !== 'cantidad-desc' || filtros.soloConStock) && (
                    <button
                        onClick={limpiarFiltros}
                        className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


                {/* Filtro por Almacén */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Almacén
                    </label>
                    <select
                        value={filtros.almacenId}
                        onChange={(e) => handleFiltroChange({ almacenId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                        <option value="">Todos los almacenes</option>
                        {almacenes.map((almacen) => (
                            <option key={almacen.id} value={String(almacen.id)}>
                                {almacen.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rango de Stock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rango de Stock
                    </label>
                    <select
                        value={filtros.rangoStock}
                        onChange={(e) => handleFiltroChange({ rangoStock: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                        {Object.entries(RANGOS_STOCK).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ordenamiento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ordenar por
                    </label>
                    <select
                        value={filtros.ordenamiento}
                        onChange={(e) => handleFiltroChange({ ordenamiento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                        <option value="cantidad-desc">Cantidad (Mayor a Menor)</option>
                        <option value="cantidad-asc">Cantidad (Menor a Mayor)</option>
                        <option value="producto">Producto (A-Z)</option>
                        <option value="almacen">Almacén (A-Z)</option>
                    </select>
                </div>

                {/* Toggle: Solo con Stock */}
                <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex-1">
                        <input
                            type="checkbox"
                            checked={filtros.soloConStock}
                            onChange={(e) => handleFiltroChange({ soloConStock: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Solo con stock
                        </span>
                    </label>
                </div>

                {/* Búsqueda por Producto */}
                <div className="lg:col-span-2 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Buscar Producto (ID, SKU o Nombre)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Presiona Enter para buscar..."
                            value={busquedaLocal}
                            onChange={(e) => setBusquedaLocal(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                        <button
                            onClick={aplicarBusqueda}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition whitespace-nowrap"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { RANGOS_STOCK };
