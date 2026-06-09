import React, { useRef, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface DynamicSearchSelectProps<T> {
    label: string;
    placeholder: string;
    selectedItem: T | null;
    items: T[];
    isLoading: boolean;
    searchValue: string;
    onSearch: (query: string) => void;
    onSelect: (item: T) => void;
    onClear: () => void;
    renderItem: (item: T) => React.ReactNode;
    getItemId: (item: T) => string | number;
    getDisplayValue: (item: T) => string;
}

export default function DynamicSearchSelect<T>({
    label,
    placeholder,
    selectedItem,
    items,
    isLoading,
    searchValue,
    onSearch,
    onSelect,
    onClear,
    renderItem,
    getItemId,
    getDisplayValue,
}: DynamicSearchSelectProps<T>) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item: T) => {
        onSelect(item);
        setShowDropdown(false);
    };

    const handleClear = () => {
        onClear();
        inputRef.current?.focus();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>

            {selectedItem && (
                <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                    <span className="text-sm text-blue-900 dark:text-blue-200">
                        {getDisplayValue(selectedItem)}
                    </span>
                    <button
                        onClick={handleClear}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                        ✕
                    </button>
                </div>
            )}

            {!selectedItem && (
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => {
                            onSearch(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-2.5">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></div>
                        </div>
                    )}
                    {showDropdown && !isLoading && (
                        <button
                            type="button"
                            onClick={() => {
                                setShowDropdown(false);
                                onSearch('');
                            }}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            title="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Sugerencias */}
            {!selectedItem && showDropdown && items.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
                    {items.map((item) => (
                        <button
                            key={getItemId(item)}
                            onClick={() => handleSelect(item)}
                            className="w-full border-b border-slate-200 px-4 py-2 text-left text-sm hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-blue-900/20"
                        >
                            {renderItem(item)}
                        </button>
                    ))}
                </div>
            )}

            {!selectedItem && showDropdown && items.length === 0 && !isLoading && searchValue.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-slate-300 bg-white p-3 text-center text-sm text-slate-600 shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    No se encontraron resultados
                </div>
            )}
        </div>
    );
}
