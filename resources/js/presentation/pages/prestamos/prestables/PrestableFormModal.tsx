import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import SearchSelect from '@/presentation/components/ui/search-select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/presentation/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import type { NuevoPrestable, TipoPrestable } from '@/domain/entities/prestamos';

interface PrestableFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    formData: Partial<NuevoPrestable & {
        activo?: boolean;
        prestable_relacionado_id?: number;
        crear_embase_asociado?: boolean;
        precios_embase?: Array<{ tipo_precio: string; valor: number }>;
        productos_relacionados?: Array<{ producto_id: number; es_principal?: boolean }>;
    }>;
    setFormData: (data: any) => void;
    productos: Array<{ id: number; nombre: string; sku?: string }>;
    canastillas: Array<{ id: number; nombre: string; codigo: string }>;
}

export default function PrestableFormModal({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
    formData,
    setFormData,
    productos,
    canastillas,
}: PrestableFormModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                style={{ width: '90vw', maxWidth: '90vw' }}
                className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-0"
            >
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {(formData as any).id ? 'Editar' : 'Crear'} Canastillas/Embases
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
                    {/* Primera fila: Código, Nombre, Tipo */}
                    <div className="flex items-end gap-4">
                        {/* Código - Pequeño */}
                        <div className="w-1/5">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Código <span className="text-xs text-gray-500">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.codigo || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, codigo: e.target.value })
                                }
                                placeholder="Auto..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Nombre - Grande */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.nombre || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, nombre: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Radio Buttons - Derecha */}
                        <div className="w-2/5 pb-1">
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium mb-0 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        Tipo * {(formData as any).id && <span className="text-xs text-gray-500">(no editable)</span>}
                                    </label>
                                    {(['CANASTILLA', 'EMBASES'] as const).map((tipo) => (
                                        <div key={tipo} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                id={`tipo-${tipo}`}
                                                name="tipo"
                                                value={tipo}
                                                disabled={(formData as any).id ? true : false}
                                                checked={formData.tipo === tipo}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        tipo: e.target.value as TipoPrestable,
                                                    })
                                                }
                                                className="w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <label
                                                htmlFor={`tipo-${tipo}`}
                                                className={`text-sm font-medium cursor-pointer select-none ${(formData as any).id
                                                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                        : 'text-gray-700 dark:text-gray-300 cursor-pointer'
                                                    }`}
                                            >
                                                {tipo === 'CANASTILLA' ? '📦 Canastilla' : '🔖 Embases'}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {formData.tipo === 'CANASTILLA' && (
                                    <div className="flex items-center gap-2 pt-2 pl-2 border-l-2 border-blue-300 dark:border-blue-700">
                                        <input
                                            type="checkbox"
                                            id="crear-embase"
                                            checked={formData.crear_embase_asociado || false}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    crear_embase_asociado: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <label
                                            htmlFor="crear-embase"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                                        >
                                            🔗 Crear embase
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resto del formulario en grid */}
                    <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                        {formData.tipo === 'CANASTILLA' && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    📦 Capacidad (embases por canastilla)
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacidad || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            capacidad: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    placeholder="Ej: 24"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {formData.tipo === 'EMBASES' && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Relacionar con canastilla existente
                                </label>
                                <SearchSelect
                                    label="🔗 Relacionar con Canastilla (Opcional)"
                                    placeholder="Buscar canastilla..."
                                    value={(formData as any).prestable_relacionado_id || ''}
                                    options={canastillas.map((c) => ({
                                        value: c.id,
                                        label: c.nombre,
                                        description: c.codigo,
                                    }))}
                                    onChange={(id) =>
                                        setFormData({
                                            ...formData,
                                            prestable_relacionado_id: id ? Number(id) : undefined,
                                        })
                                    }
                                    allowClear
                                />
                            </div>
                        )}

                        {/* Estado Activo - Solo al editar */}
                        {(formData as any).id && (
                            <div className="flex items-center gap-2 p-2">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={(formData as any).activo ?? true}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            activo: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="activo" className="text-sm font-medium text-green-700 dark:text-green-300 cursor-pointer">
                                    ✅ Activo
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Productos Relacionados */}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                🔗 Productos Relacionados (Variantes)
                            </h3>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    const currentLength = (formData.productos_relacionados || []).length;
                                    setFormData({
                                        ...formData,
                                        productos_relacionados: [
                                            ...(formData.productos_relacionados || []),
                                            { producto_id: 0, es_principal: currentLength === 0 }
                                        ]
                                    });
                                }}
                                className="gap-2"
                            >
                                <Plus size={16} />
                                Agregar
                            </Button>
                        </div>

                        {formData.productos_relacionados && formData.productos_relacionados.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                {formData.productos_relacionados.map((pr: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex-1">
                                            <SearchSelect
                                                placeholder="Buscar producto..."
                                                value={pr.producto_id || ''}
                                                options={productos.map((p) => ({
                                                    value: p.id,
                                                    label: p.nombre,
                                                    description: p.sku,
                                                }))}
                                                onChange={(id) => {
                                                    const newPR = [...(formData.productos_relacionados || [])];
                                                    newPR[idx].producto_id = Number(id || 0);
                                                    setFormData({ ...formData, productos_relacionados: newPR });
                                                }}
                                                allowClear
                                            />
                                        </div>

                                        <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={pr.es_principal || false}
                                                onChange={(e) => {
                                                    const newPR = [...(formData.productos_relacionados || [])];
                                                    newPR[idx].es_principal = e.target.checked;
                                                    setFormData({ ...formData, productos_relacionados: newPR });
                                                }}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Principal</span>
                                        </label>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                const newPR = (formData.productos_relacionados || []).filter((_: any, i: number) => i !== idx);
                                                setFormData({ ...formData, productos_relacionados: newPR });
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                Haz click en "Agregar" para relacionar productos.
                            </p>
                        )}
                    </div>

                    {/* Precios - Canastilla */}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                            💰 Precios {formData.tipo === 'CANASTILLA' ? '📦 Canastilla' : '🔖 Embases'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {formData.precios?.map((precio, idx) => (
                                <div key={idx} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {precio.tipo_precio === 'COMPRA' ? '📦 Precio Compra' :
                                            precio.tipo_precio === 'PRESTAMO' ? '💰 Precio Préstamo' :
                                                precio.tipo_precio === 'VENTA' ? '🛒 Precio Venta' :
                                                    '💥 Precio por Daño Total'}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={precio.valor === 0 ? '' : precio.valor ?? ''}
                                        onChange={(e) => {
                                            const newPrecios = [...(formData.precios || [])];
                                            newPrecios[idx].valor = e.target.value === '' ? 0 : Number(e.target.value);
                                            setFormData({ ...formData, precios: newPrecios });
                                        }}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Precios - Embase (solo cuando se va a crear) */}
                    {formData.tipo === 'CANASTILLA' && formData.crear_embase_asociado && (
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                                💰 Precios 🔖 Embase Asociado
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Especifica los precios para el embase que se creará automáticamente con la canastilla.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(formData as any).precios_embase?.map((precio: any, idx: number) => (
                                    <div key={idx} className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                                            {precio.tipo_precio === 'COMPRA' ? '📦 Precio Compra' :
                                                precio.tipo_precio === 'PRESTAMO' ? '💰 Precio Préstamo' :
                                                    precio.tipo_precio === 'VENTA' ? '🛒 Precio Venta' :
                                                        '💥 Precio por Daño Total'}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={precio.valor === 0 ? '' : precio.valor ?? ''}
                                            onChange={(e) => {
                                                const newPrecios = [...((formData as any).precios_embase || [])];
                                                newPrecios[idx].valor = e.target.value === '' ? 0 : Number(e.target.value);
                                                setFormData({ ...formData, precios_embase: newPrecios });
                                            }}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '⏳ Guardando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
