import React, { useRef, useEffect, useState } from 'react';
import { Search, Trash2, AlertCircle } from 'lucide-react';
import type { Prestable } from '@/domain/entities/prestamos';

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    almacenes_ids: number[];
    prestable?: Prestable;
}

interface PrestablesSelectionTableProps {
    label?: string;
    placeholder?: string;
    prestables: Prestable[];
    items: PrestamoItem[];
    onSelectItem: (prestable: Prestable) => void;
    onDeleteItem: (prestableId: number) => void;
    onUpdateCantidad?: (prestableId: number, cantidad: number) => void;
    onToggleAlmacen?: (prestableId: number, almacenId: number, checked: boolean) => void;
    getStockDisponibleTotal: (prestable: Prestable) => number;
    getAlmacenesConStock: (prestable: Prestable) => Array<{ id: number; nombre: string; stock: number }>;
    getStockDisponibleEnAlmacenes: (prestable: Prestable, almacenesIds: number[]) => number;
    loading?: boolean;
    emptyMessage?: string;
    hideAlmacenesSelection?: boolean;
    almacen_prestable_id?: number;
}

export default function PrestablesSelectionTable({
    label = '🔍 Buscar Prestables',
    placeholder = 'Busca por nombre o código...',
    prestables,
    items,
    onSelectItem,
    onDeleteItem,
    onUpdateCantidad,
    onToggleAlmacen,
    getStockDisponibleTotal,
    getAlmacenesConStock,
    getStockDisponibleEnAlmacenes,
    loading = false,
    emptyMessage = 'Busca arriba para agregar prestables',
    hideAlmacenesSelection = false,
    almacen_prestable_id,
}: PrestablesSelectionTableProps) {
    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAlmacenes, setShowAlmacenes] = useState<Record<number, boolean>>({});
    const searchRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(e.target as Node) &&
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (query: string) => {
        setSearchValue(query);
        setShowSuggestions(query.trim().length > 0);
    };

    const handleSelectItem = (prestable: Prestable) => {
        onSelectItem(prestable);
        setShowSuggestions(false);
        setSearchValue('');
    };

    const availablePrestables = prestables.filter(
        (p) => p.activo && getStockDisponibleTotal(p) > 0
    );

    const searchResults = searchValue.trim()
        ? availablePrestables.filter(
            (p) =>
                p.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                p.codigo.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

    return (
        <div className="flex flex-col gap-4">
            {/* Buscador */}
            <div className="relative">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    {loading && (
                        <div className="absolute right-3 top-2.5">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></div>
                        </div>
                    )}
                </div>

                {/* Sugerencias */}
                {showSuggestions && searchResults.length > 0 && (
                    <div
                        ref={suggestionsRef}
                        className="absolute top-full left-0 right-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                    >
                        {searchResults.map((item) => {
                            const isCanastilla = item.tipo === 'CANASTILLA';
                            const icon = isCanastilla ? '📦' : '🔖';
                            const typeLabel = isCanastilla ? 'Canastilla' : 'Embase';
                            const typeBgColor = isCanastilla ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectItem(item)}
                                    className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{icon} {item.nombre}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.codigo}</p>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeBgColor}`}>
                                                {typeLabel}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        +
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        <tr>
                            <th className="px-2 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100 w-12">
                                —
                            </th>
                            <th className="px-2 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Prestable
                            </th>
                            <th className="px-2 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Cantidad
                            </th>
                            {almacen_prestable_id && (
                                <th className="px-2 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    📦 En Almacén
                                </th>
                            )}
                            <th className="px-2 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Stock Total
                            </th>
                            <th className="px-2 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {items.length > 0 ? (
                            items.map((item) => {
                                const prestable = prestables.find((p) => Number(p.id) === item.prestable_id);
                                if (!prestable) return null;

                                const almacenesDisponibles = getAlmacenesConStock(prestable);
                                const stockSeleccionado = getStockDisponibleEnAlmacenes(prestable, item.almacenes_ids);
                                const tieneStock = item.cantidad <= stockSeleccionado;

                                const isCanastilla = prestable.tipo === 'CANASTILLA';
                                const icon = isCanastilla ? '📦' : '🔖';
                                const bgColor = isCanastilla
                                    ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
                                    : 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30';

                                return (
                                    <tr
                                        key={item.prestable_id}
                                        className={`transition ${bgColor}`}
                                    >
                                        <td className="px-2 py-2 text-center">
                                            <span className="text-lg">{icon}</span>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{prestable.nombre}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{prestable.codigo}</p>
                                            </div>
                                            {!hideAlmacenesSelection && almacenesDisponibles.length > 0 && (
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAlmacenes(prev => ({ ...prev, [prestable.id]: !prev[prestable.id] }))}
                                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2 flex items-center gap-1"
                                                    >
                                                        {showAlmacenes[prestable.id] ? '▼' : '▶'} Almacenes ({almacenesDisponibles.length})
                                                    </button>
                                                    {showAlmacenes[prestable.id] && (
                                                        <div className="space-y-1.5">
                                                    {(() => {
                                                        const almacenesClientes = almacenesDisponibles.filter(a => !(a as any).es_proveedor);
                                                        const almacenesProveedor = almacenesDisponibles.filter(a => (a as any).es_proveedor);
                                                        const stockClientes = almacenesClientes.reduce((sum, a) => sum + a.stock, 0);
                                                        const necesitaProveedor = item.cantidad > stockClientes;

                                                        return (
                                                            <>
                                                                {almacenesClientes.length > 0 && (
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">👥 Clientes</p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {almacenesClientes.map((almacen) => {
                                                                                const checked = item.almacenes_ids?.includes(almacen.id) || false;
                                                                                return (
                                                                                    <label
                                                                                        key={`${prestable.id}-${almacen.id}`}
                                                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs cursor-pointer ${
                                                                                            checked
                                                                                                ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                                                                                                : 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300'
                                                                                        }`}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={checked}
                                                                                            onChange={(e) =>
                                                                                                onToggleAlmacen?.(Number(prestable.id), almacen.id, e.target.checked)
                                                                                            }
                                                                                            className="cursor-pointer"
                                                                                        />
                                                                                        <span>{almacen.nombre} • {almacen.stock.toLocaleString('es-BO')}</span>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {almacenesProveedor.length > 0 && (
                                                                    <div>
                                                                        <div className={`flex items-center gap-2 ${necesitaProveedor ? '' : 'opacity-50'}`}>
                                                                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">📦 Proveedores</p>
                                                                            {necesitaProveedor && (
                                                                                <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                                                    Requerido
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {almacenesProveedor.map((almacen) => {
                                                                                const checked = item.almacenes_ids?.includes(almacen.id) || false;
                                                                                return (
                                                                                    <label
                                                                                        key={`${prestable.id}-${almacen.id}`}
                                                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs cursor-pointer ${
                                                                                            checked
                                                                                                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300'
                                                                                                : `${necesitaProveedor ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300'}`
                                                                                        }`}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={checked}
                                                                                            onChange={(e) =>
                                                                                                onToggleAlmacen?.(Number(prestable.id), almacen.id, e.target.checked)
                                                                                            }
                                                                                            className="cursor-pointer"
                                                                                        />
                                                                                        <span>{almacen.nombre} • {almacen.stock.toLocaleString('es-BO')}</span>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={item.cantidad}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || /^\d+$/.test(val)) {
                                                        onUpdateCantidad?.(Number(prestable.id), val === '' ? 0 : parseInt(val));
                                                    }
                                                }}
                                                onFocus={(e) => e.target.select()}
                                                className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium"
                                            />
                                        </td>
                                        {almacen_prestable_id && (
                                            <td className="px-2 py-2 text-right">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                        {(() => {
                                                            const stockEnAlmacen = prestable.stocks?.find(
                                                                (s: any) => Number(s.almacenes_prestables_id) === almacen_prestable_id
                                                            )?.cantidad_disponible || 0;
                                                            return stockEnAlmacen.toLocaleString('es-BO');
                                                        })()}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Disp: {(() => {
                                                            const stockEnAlmacen = prestable.stocks?.find(
                                                                (s: any) => Number(s.almacenes_prestables_id) === almacen_prestable_id
                                                            )?.cantidad_disponible || 0;
                                                            const restante = stockEnAlmacen - item.cantidad;
                                                            return restante.toLocaleString('es-BO');
                                                        })()}
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-2 py-2 text-right">
                                            <div className="space-y-1">
                                                <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                    {getStockDisponibleTotal(prestable).toLocaleString('es-BO')}
                                                </div>
                                                <div className={`text-xs ${getStockDisponibleTotal(prestable) >= item.cantidad ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {getStockDisponibleTotal(prestable) >= item.cantidad ? '✓' : '✕'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <button
                                                onClick={() => onDeleteItem(item.prestable_id)}
                                                className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={almacen_prestable_id ? 6 : 5} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <AlertCircle size={24} />
                                        <p>{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
