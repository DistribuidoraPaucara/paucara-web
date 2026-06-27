import React, { useRef, useEffect, useState } from 'react';
import { Search, Trash2, AlertCircle } from 'lucide-react';
import type { Prestable } from '@/domain/entities/prestamos';

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    almacenes_ids: number[];
    almacenes?: Array<{
        almacenes_prestables_id: number;
        cantidad: number;
    }>;
    prestable?: Prestable;
    isAutomaticEmbase?: boolean;
}

interface PrestablesSelectionTableProps {
    label?: string;
    placeholder?: string;
    prestables: Prestable[];
    items: PrestamoItem[];
    almacenes?: Array<{ id: number; nombre: string; es_proveedor?: boolean }>;
    onSelectItem: (prestable: Prestable) => void;
    onDeleteItem: (prestableId: number) => void;
    onUpdateCantidad?: (itemIndex: number, cantidad: number) => void;
    onEditAlmacenes?: (item: PrestamoItem, index: number) => void;
    getStockDisponibleTotal: (prestable: Prestable) => number;
    loading?: boolean;
    emptyMessage?: string;
    almacen_prestable_id?: number;
    esPrestamoProveedor?: boolean;
}

export default function PrestablesSelectionTable({
    label = '🔍 Buscar Prestables',
    placeholder = 'Busca por nombre o código...',
    prestables,
    items,
    almacenes = [],
    onSelectItem,
    onDeleteItem,
    onUpdateCantidad,
    onEditAlmacenes,
    getStockDisponibleTotal,
    loading = false,
    emptyMessage = 'Busca arriba para agregar prestables',
    almacen_prestable_id,
    esPrestamoProveedor = false,
}: PrestablesSelectionTableProps) {
    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
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

    // Helper: obtener nombres de almacenes
    const getAlmacenesDisplay = (item: PrestamoItem) => {
        const almacenesAMostrar = (item.almacenes && item.almacenes.length > 0)
            ? item.almacenes
            : (item.almacenes_ids || []).map(id => ({ almacenes_prestables_id: id, cantidad: item.cantidad }));

        if (almacenesAMostrar.length === 0) {
            return <span className="text-gray-500 text-xs">—</span>;
        }

        return (
            <div className="flex flex-col gap-1">
                {almacenesAMostrar.map((almData, idx) => {
                    const almacenInfo = almacenes.find(a => a.id === almData.almacenes_prestables_id);
                    const almacenNombre = almacenInfo?.nombre || `Almacén #${almData.almacenes_prestables_id}`;
                    return (
                        <div key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">
                            {almacenNombre} ({almData.cantidad})
                        </div>
                    );
                })}
            </div>
        );
    };

    // Helper: Obtener stock total de almacenes seleccionados en el item
    const getStockDisponibleDelItem = (prestable: Prestable, item: PrestamoItem) => {
        // Si el item tiene almacenes seleccionados, calcular stock de esos almacenes
        const almacenesDelItem = (item.almacenes && item.almacenes.length > 0)
            ? item.almacenes
            : [];

        if (almacenesDelItem.length > 0) {
            // Calcular stock total de los almacenes seleccionados
            let stockTotal = 0;
            almacenesDelItem.forEach(almData => {
                const stock = prestable.stocks?.find(
                    s => Number(s.almacenes_prestables_id) === almData.almacenes_prestables_id
                );
                stockTotal += stock ? Number(stock.cantidad_disponible || 0) : 0;
            });
            return stockTotal;
        }

        // Si no hay almacenes en el item y hay almacén de cabecera, usar ese
        if (almacen_prestable_id) {
            const stock = prestable.stocks?.find(
                s => Number(s.almacenes_prestables_id) === almacen_prestable_id
            );
            return stock ? Number(stock.cantidad_disponible || 0) : 0;
        }

        // Si no hay nada, retornar 0
        return 0;
    };

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
                                Tipo
                            </th>
                            <th className="px-2 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Cantidad
                            </th>
                            {!esPrestamoProveedor && (
                                <th className="px-2 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    🏭 Almacenes
                                </th>
                            )}
                            {almacen_prestable_id && (
                                <th className="px-2 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    📦 Disponibilidad
                                </th>
                            )}
                            <th className="px-2 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {items.length > 0 ? (
                            (() => {
                                // Agrupar canastillas solo con sus embases automáticos relacionados
                                const processedItems = new Set<string>();
                                const rows: React.ReactNode[] = [];

                                console.log('📊 PrestablesSelectionTable - Items recibidos:', items.length);
                                console.log('   Detalle:', items.map(i => ({
                                    id: i.prestable_id,
                                    tipo: prestables.find(p => p.id === i.prestable_id)?.tipo,
                                    isAutomaticEmbase: i.isAutomaticEmbase
                                })));

                                items.forEach((item) => {
                                    // Usar clave única que incluya si es automático o no
                                    const itemKey = `${item.prestable_id}-${item.isAutomaticEmbase === true ? 'auto' : 'manual'}`;
                                    if (processedItems.has(itemKey)) {
                                        console.log('⚠️  Item ya procesado:', itemKey);
                                        return;
                                    }

                                    const prestable = prestables.find((p) => Number(p.id) === item.prestable_id);
                                    if (!prestable) {
                                        console.log('❌ Prestable no encontrado:', item.prestable_id);
                                        return;
                                    }

                                    console.log(`\n🔷 Procesando: ${prestable.nombre} (${prestable.tipo}) - isAutomatic: ${item.isAutomaticEmbase}`);

                                    // Si es canastilla, buscar sus embases automáticos relacionados
                                    if (prestable.tipo === 'CANASTILLA') {
                                        console.log('  → Es CANASTILLA');
                                        const embasesRelacionados = items.filter(embaseItem => {
                                            const embasePrestable = prestables.find(p => Number(p.id) === embaseItem.prestable_id);
                                            // Solo agrupar si: es embase + es automático + pertenece a esta canastilla
                                            return embasePrestable?.tipo === 'EMBASES' &&
                                                embaseItem.isAutomaticEmbase === true &&
                                                (embasePrestable as any).prestable_relacionado_id === prestable.id;
                                        });
                                        const icon = '📦';
                                        const typeLabel = 'Canastilla';
                                        const typeBgColor = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
                                        const bgColor = 'bg-blue-50 dark:bg-blue-900/20';

                                        rows.push(
                                            <tr key={`canastilla-${item.prestable_id}`} className={`transition ${bgColor} border-b-2 border-blue-200 dark:border-blue-800`}>
                                                <td className="px-2 py-2 text-center">
                                                    <span className="text-lg">{icon}</span>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">{prestable.nombre}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{prestable.codigo}</p>
                                                        {embasesRelacionados.length > 0 && (
                                                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                + {embasesRelacionados.length} embase(s) relacionado(s)
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeBgColor}`}>
                                                        {typeLabel}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={item.cantidad}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '' || /^\d+$/.test(val)) {
                                                                const itemIndex = items.findIndex(i => i === item);
                                                                onUpdateCantidad?.(itemIndex, val === '' ? 0 : parseInt(val));
                                                            }
                                                        }}
                                                        onFocus={(e) => e.target.select()}
                                                        className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium"
                                                    />
                                                </td>
                                                {!esPrestamoProveedor && (
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const idx = items.findIndex(i => i.prestable_id === item.prestable_id && i.isAutomaticEmbase === item.isAutomaticEmbase);
                                                                onEditAlmacenes?.(item, idx);
                                                            }}
                                                            className="w-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition whitespace-normal"
                                                        >
                                                            {getAlmacenesDisplay(item)}
                                                        </button>
                                                    </td>
                                                )}
                                                {almacen_prestable_id && (
                                                    <td className="px-2 py-2 text-right">
                                                        <div className="space-y-1">
                                                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                                {(() => {
                                                                    const stockDisponible = getStockDisponibleDelItem(prestable, item);
                                                                    const disponibleFinal = esPrestamoProveedor
                                                                        ? stockDisponible + item.cantidad
                                                                        : stockDisponible - item.cantidad;
                                                                    const isValido = esPrestamoProveedor ? true : disponibleFinal >= 0;
                                                                    const label = esPrestamoProveedor
                                                                        ? `Después de recibir: ${disponibleFinal.toLocaleString('es-BO')}`
                                                                        : `${stockDisponible.toLocaleString('es-BO')} (${disponibleFinal >= 0 ? 'Disponible' : 'Insuficiente'})`;
                                                                    return (
                                                                        <span className={isValido ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                                            {label} {isValido ? '✓' : '✕'}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {(() => {
                                                                    const stockDisponible = getStockDisponibleDelItem(prestable, item);
                                                                    const restante = esPrestamoProveedor
                                                                        ? stockDisponible + item.cantidad
                                                                        : stockDisponible - item.cantidad;
                                                                    const labelRestante = esPrestamoProveedor
                                                                        ? `Después de recibir: ${restante.toLocaleString('es-BO')}`
                                                                        : `Restante: ${restante.toLocaleString('es-BO')}`;
                                                                    return labelRestante;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
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

                                        processedItems.add(`${item.prestable_id}-auto`);

                                        // Renderizar embases como sub-filas
                                        embasesRelacionados.forEach((embaseItem) => {
                                            const embasePrestable = prestables.find(p => Number(p.id) === embaseItem.prestable_id);
                                            if (!embasePrestable) return;

                                            const icon = '🔖';
                                            const typeLabel = 'Embase';
                                            const typeBgColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
                                            const bgColor = 'bg-green-50 dark:bg-green-900/10';

                                            rows.push(
                                                <tr key={`embase-${embaseItem.prestable_id}`} className={`transition ${bgColor} border-l-4 border-green-300 dark:border-green-700`}>
                                                    <td className="px-2 py-2 text-center pl-6">
                                                        <span className="text-lg">{icon}</span>
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <div className="ml-2">
                                                            <p className="font-medium text-slate-900 dark:text-slate-100">{embasePrestable.nombre}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{embasePrestable.codigo}</p>
                                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">↳ Vinculado con canastilla</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeBgColor}`}>
                                                            {typeLabel}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={embaseItem.cantidad}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === '' || /^\d+$/.test(val)) {
                                                                    onUpdateCantidad?.(Number(embasePrestable.id), val === '' ? 0 : parseInt(val));
                                                                }
                                                            }}
                                                            onFocus={(e) => e.target.select()}
                                                            className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium"
                                                        />
                                                    </td>
                                                    {!esPrestamoProveedor && (
                                                        <td></td>
                                                    )}
                                                    {almacen_prestable_id && (
                                                        <td className="px-2 py-2 text-right">
                                                            <div className="space-y-1">
                                                                <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                                    {(() => {
                                                                        const stockDisponible = getStockDisponibleDelItem(embasePrestable, embaseItem);
                                                                        const disponibleFinal = esPrestamoProveedor
                                                                            ? stockDisponible + embaseItem.cantidad
                                                                            : stockDisponible - embaseItem.cantidad;
                                                                        const isValido = esPrestamoProveedor ? true : disponibleFinal >= 0;
                                                                        const label = esPrestamoProveedor
                                                                            ? `Después de recibir: ${disponibleFinal.toLocaleString('es-BO')}`
                                                                            : `${stockDisponible.toLocaleString('es-BO')} (${disponibleFinal >= 0 ? 'Disponible' : 'Insuficiente'})`;
                                                                        return (
                                                                            <span className={isValido ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                                                {label} {isValido ? '✓' : '✕'}
                                                                            </span>
                                                                        );
                                                                    })()}
                                                                </div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {(() => {
                                                                        const stockDisponible = getStockDisponibleDelItem(embasePrestable, embaseItem);
                                                                        const restante = esPrestamoProveedor
                                                                            ? stockDisponible + embaseItem.cantidad
                                                                            : stockDisponible - embaseItem.cantidad;
                                                                        const labelRestante = esPrestamoProveedor
                                                                            ? `Después de recibir: ${restante.toLocaleString('es-BO')}`
                                                                            : `Restante: ${restante.toLocaleString('es-BO')}`;
                                                                        return labelRestante;
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            onClick={() => onDeleteItem(embaseItem.prestable_id)}
                                                            className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );

                                            processedItems.add(`${embaseItem.prestable_id}-auto`);
                                        });
                                    } else if (prestable.tipo === 'EMBASES' && !item.isAutomaticEmbase) {
                                        // Renderizar embases sueltos (no automáticos)
                                        console.log('  → Es EMBASE SUELTO (NO automático)');
                                        const icon = '🔖';
                                        const typeLabel = 'Embase';
                                        const typeBgColor = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
                                        const bgColor = 'bg-orange-50 dark:bg-orange-900/20';

                                        rows.push(
                                            <tr key={`embase-suelto-${item.prestable_id}`} className={`transition ${bgColor}`}>
                                                <td className="px-2 py-2 text-center">
                                                    <span className="text-lg">{icon}</span>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">{prestable.nombre}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{prestable.codigo}</p>
                                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Embase suelto</p>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeBgColor}`}>
                                                        {typeLabel}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={item.cantidad}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '' || /^\d+$/.test(val)) {
                                                                const itemIndex = items.findIndex(i => i === item);
                                                                onUpdateCantidad?.(itemIndex, val === '' ? 0 : parseInt(val));
                                                            }
                                                        }}
                                                        onFocus={(e) => e.target.select()}
                                                        className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium"
                                                    />
                                                </td>
                                                {!esPrestamoProveedor && (
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const idx = items.findIndex(i => i.prestable_id === item.prestable_id && i.isAutomaticEmbase === item.isAutomaticEmbase);
                                                                onEditAlmacenes?.(item, idx);
                                                            }}
                                                            className="w-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition whitespace-normal"
                                                        >
                                                            {getAlmacenesDisplay(item)}
                                                        </button>
                                                    </td>
                                                )}
                                                {almacen_prestable_id && (
                                                    <td className="px-2 py-2 text-right">
                                                        <div className="space-y-1">
                                                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                                {(() => {
                                                                    const stockDisponible = getStockDisponibleDelItem(prestable, item);
                                                                    const disponibleFinal = esPrestamoProveedor
                                                                        ? stockDisponible + item.cantidad
                                                                        : stockDisponible - item.cantidad;
                                                                    const isValido = esPrestamoProveedor ? true : disponibleFinal >= 0;
                                                                    const label = esPrestamoProveedor
                                                                        ? `Después de recibir: ${disponibleFinal.toLocaleString('es-BO')}`
                                                                        : `${stockDisponible.toLocaleString('es-BO')} (${disponibleFinal >= 0 ? 'Disponible' : 'Insuficiente'})`;
                                                                    return (
                                                                        <span className={isValido ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                                            {label} {isValido ? '✓' : '✕'}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {(() => {
                                                                    const stockDisponible = getStockDisponibleDelItem(prestable, item);
                                                                    const restante = esPrestamoProveedor
                                                                        ? stockDisponible + item.cantidad
                                                                        : stockDisponible - item.cantidad;
                                                                    const labelRestante = esPrestamoProveedor
                                                                        ? `Después de recibir: ${restante.toLocaleString('es-BO')}`
                                                                        : `Restante: ${restante.toLocaleString('es-BO')}`;
                                                                    return labelRestante;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
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

                                        processedItems.add(`${item.prestable_id}-manual`);
                                    } else if (prestable.tipo !== 'EMBASES') {
                                        // Renderizar otros prestables (no canastilla ni embase ya procesados)
                                        console.log('  → Es OTRO TIPO:', prestable.tipo);
                                        const icon = '📦';
                                        const typeLabel = prestable.tipo;
                                        const typeBgColor = 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300';
                                        const bgColor = 'bg-slate-50 dark:bg-slate-900/20';

                                        rows.push(
                                            <tr key={`item-${item.prestable_id}`} className={`transition ${bgColor}`}>
                                                <td className="px-2 py-2 text-center">
                                                    <span className="text-lg">{icon}</span>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-slate-100">{prestable.nombre}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{prestable.codigo}</p>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeBgColor}`}>
                                                        {typeLabel}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={item.cantidad}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '' || /^\d+$/.test(val)) {
                                                                const itemIndex = items.findIndex(i => i === item);
                                                                onUpdateCantidad?.(itemIndex, val === '' ? 0 : parseInt(val));
                                                            }
                                                        }}
                                                        onFocus={(e) => e.target.select()}
                                                        className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium"
                                                    />
                                                </td>
                                                {!esPrestamoProveedor && (
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const idx = items.findIndex(i => i.prestable_id === item.prestable_id && i.isAutomaticEmbase === item.isAutomaticEmbase);
                                                                onEditAlmacenes?.(item, idx);
                                                            }}
                                                            className="w-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition whitespace-normal"
                                                        >
                                                            {getAlmacenesDisplay(item)}
                                                        </button>
                                                    </td>
                                                )}
                                                {almacen_prestable_id && (
                                                    <td className="px-2 py-2 text-right">
                                                        <div className="space-y-1">
                                                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                                {(() => {
                                                                    const stockDisponible = getStockDisponibleDelItem(prestable, item);
                                                                    const disponibleFinal = esPrestamoProveedor
                                                                        ? stockDisponible + item.cantidad
                                                                        : stockDisponible - item.cantidad;
                                                                    const isValido = esPrestamoProveedor ? true : disponibleFinal >= 0;
                                                                    const label = esPrestamoProveedor
                                                                        ? `Después de recibir: ${disponibleFinal.toLocaleString('es-BO')}`
                                                                        : `${stockDisponible.toLocaleString('es-BO')} (${disponibleFinal >= 0 ? 'Disponible' : 'Insuficiente'})`;
                                                                    return (
                                                                        <span className={isValido ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                                            {label} {isValido ? '✓' : '✕'}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {(() => {
                                                                    const stockDisponible = getStockDisponibleDelItem(prestable, item);
                                                                    const restante = esPrestamoProveedor
                                                                        ? stockDisponible + item.cantidad
                                                                        : stockDisponible - item.cantidad;
                                                                    const labelRestante = esPrestamoProveedor
                                                                        ? `Después de recibir: ${restante.toLocaleString('es-BO')}`
                                                                        : `Restante: ${restante.toLocaleString('es-BO')}`;
                                                                    return labelRestante;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
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

                                        processedItems.add(`${item.prestable_id}-manual`);
                                    }
                                });

                                return rows;
                            })()
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
