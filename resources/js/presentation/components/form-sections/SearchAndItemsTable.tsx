import React, { useRef, useEffect, useState } from 'react';
import { Search, Trash2, AlertCircle } from 'lucide-react';

interface SearchAndItemsTableProps<T> {
    label: string;
    placeholder: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    isSearching: boolean;
    searchResults: T[];
    onSelectItem: (item: T) => void;
    items: any[];
    columns: Array<{
        key: string;
        label: string;
        render?: (item: any) => React.ReactNode;
        className?: string;
        align?: 'left' | 'right' | 'center';
    }>;
    onUpdateItem?: (itemId: string, field: string, value: any) => void;
    onDeleteItem: (itemId: string) => void;
    getItemId: (item: T) => string | number;
    renderSearchItem: (item: T) => React.ReactNode;
    emptyMessage?: string;
    totalLabel?: string;
    totalValue?: string | number;
}

export default function SearchAndItemsTable<T>({
    label,
    placeholder,
    searchValue,
    onSearchChange,
    isSearching,
    searchResults,
    onSelectItem,
    items,
    columns,
    onUpdateItem,
    onDeleteItem,
    getItemId,
    renderSearchItem,
    emptyMessage = 'Busca arriba para agregar items',
    totalLabel,
    totalValue,
}: SearchAndItemsTableProps<T>) {
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

    const handleSearchChange = (query: string) => {
        onSearchChange(query);
        setShowSuggestions(query.trim().length > 0);
    };

    const handleSelectItem = (item: T) => {
        onSelectItem(item);
        setShowSuggestions(false);
        onSearchChange('');
    };

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
                    {isSearching && (
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
                        {searchResults.map((item) => (
                            <button
                                key={getItemId(item)}
                                onClick={() => handleSelectItem(item)}
                                className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                                <div className="flex-1">{renderSearchItem(item)}</div>
                                <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    +
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabla de items */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 ${
                                        column.align === 'right'
                                            ? 'text-right'
                                            : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-left'
                                    }`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={`${item.id}-${column.key}`}
                                            className={`px-4 py-3 ${column.className || ''} ${
                                                column.align === 'right'
                                                    ? 'text-right'
                                                    : column.align === 'center'
                                                      ? 'text-center'
                                                      : 'text-left'
                                            }`}
                                        >
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => onDeleteItem(item.id)}
                                            className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <AlertCircle size={24} />
                                        <p>{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {items.length > 0 && totalLabel && (
                        <tfoot>
                            <tr className="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                <td
                                    colSpan={columns.length - 1}
                                    className="px-4 py-4 text-right"
                                />
                                <td className="px-4 py-4">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        {totalLabel}
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {totalValue}
                                    </p>
                                </td>
                                <td />
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
