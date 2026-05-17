import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Camera, RefreshCw } from 'lucide-react';

interface Filtros {
    search: string;
    proveedor_id: string | null;
    marca_id: string | null;
    categoria_id: string | null;
    stock_bajo: boolean;
    stock_alto: boolean;
    sin_stock: boolean;
    con_precio: boolean;
    sin_precio: boolean;
}

interface FiltrosData {
    proveedores: { id: number; nombre: string }[];
    marcas: { id: number; nombre: string }[];
    categorias: { id: number; nombre: string }[];
}

interface Props {
    filtros: Filtros;
    filtrosData: FiltrosData | null;
    onFiltrosChange: (filtros: Filtros) => void;
    onLimpiar: () => void;
    onOpenScanner: () => void;
}

export default function FiltrosProductosPanel({
    filtros,
    filtrosData,
    onFiltrosChange,
    onLimpiar,
    onOpenScanner,
}: Props) {
    const handleSearchChange = (valor: string) => {
        onFiltrosChange({ ...filtros, search: valor });
    };

    const handleSelectChange = (key: string, valor: string) => {
        onFiltrosChange({
            ...filtros,
            [key]: valor || null,
        });
    };

    const handleCheckboxChange = (key: string, checked: boolean) => {
        onFiltrosChange({
            ...filtros,
            [key]: checked,
        });
    };

    return (
        <div className="space-y-4">
            {/* Fila 1: Búsqueda */}
            <div className="relative">
                <Input
                    placeholder="🔍 Buscar por nombre, SKU o código de barras..."
                    value={filtros.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Fila 2: Selects - Proveedor, Marca, Categoría */}
            <div className="grid grid-cols-3 gap-3">
                {/* Proveedor */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Proveedor
                    </label>
                    <select
                        value={filtros.proveedor_id || ''}
                        onChange={(e) => handleSelectChange('proveedor_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="">Todos</option>
                        {filtrosData?.proveedores.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Marca */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Marca
                    </label>
                    <select
                        value={filtros.marca_id || ''}
                        onChange={(e) => handleSelectChange('marca_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="">Todos</option>
                        {filtrosData?.marcas.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Categoría */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Categoría
                    </label>
                    <select
                        value={filtros.categoria_id || ''}
                        onChange={(e) => handleSelectChange('categoria_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                        <option value="">Todos</option>
                        {filtrosData?.categorias.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Fila 3: Checkboxes - Estado de Stock */}
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Estado de Stock
                </label>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.stock_bajo}
                            onChange={(e) => handleCheckboxChange('stock_bajo', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">⚠️ Stock Bajo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.stock_alto}
                            onChange={(e) => handleCheckboxChange('stock_alto', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">✅ Stock Alto</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.sin_stock}
                            onChange={(e) => handleCheckboxChange('sin_stock', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">❌ Sin Stock</span>
                    </label>
                </div>
            </div>

            {/* Fila 4: Checkboxes - Estado de Precio */}
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Estado de Precio
                </label>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.con_precio}
                            onChange={(e) => handleCheckboxChange('con_precio', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">💰 Con Precio</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.sin_precio}
                            onChange={(e) => handleCheckboxChange('sin_precio', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">🚫 Sin Precio</span>
                    </label>
                </div>
            </div>

            {/* Fila 5: Botones de Acción */}
            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenScanner}
                    className="gap-2"
                >
                    <Camera className="h-4 w-4" />
                    Abrir Scanner
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onLimpiar}
                    className="gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Limpiar Filtros
                </Button>
            </div>
        </div>
    );
}
