import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import SearchSelect from '@/presentation/components/ui/search-select';
import ToggleGroup from '@/presentation/components/ui/toggle-group';
import CustomCheckbox from '@/presentation/components/ui/custom-checkbox';
import { useToastNotifications } from '@/application/hooks/use-toast-notifications';
import prestableService from '@/infrastructure/services/prestable.service';
import type { Prestable, NuevoPrestable, TipoPrestable } from '@/domain/entities/prestamos';
import { Plus, Trash2 } from 'lucide-react';

interface PrestableFormProps {
    prestable?: Prestable;
    isEdit?: boolean;
}

export default function PrestableForm({ prestable, isEdit = false }: PrestableFormProps) {
    const { showNotification } = useToastNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productos, setProductos] = useState<Array<{ id: number; nombre: string; sku?: string }>>([]);
    const [canastillas, setCanastillas] = useState<Array<{ id: number; nombre: string; codigo: string }>>([]);

    const [formData, setFormData] = useState<Partial<NuevoPrestable & {
        activo?: boolean;
        prestable_relacionado_id?: number;
        crear_embase_asociado?: boolean;
        precios_embase?: Array<{ tipo_precio: string; valor: number }>;
        productos_relacionados?: Array<{ producto_id: number; es_principal?: boolean }>;
    }>>({
        nombre: '',
        codigo: '',
        tipo: 'CANASTILLA' as TipoPrestable,
        capacidad: undefined,
        producto_id: undefined,
        prestable_relacionado_id: undefined,
        activo: true,
        crear_embase_asociado: false,
        productos_relacionados: [],
        precios: [
            { tipo_precio: 'COMPRA', valor: 0 },
            { tipo_precio: 'PRESTAMO', valor: 0 },
            { tipo_precio: 'VENTA', valor: 0 },
            { tipo_precio: 'DAÑO_TOTAL', valor: 0 },
        ],
        precios_embase: [
            { tipo_precio: 'COMPRA', valor: 0 },
            { tipo_precio: 'PRESTAMO', valor: 0 },
            { tipo_precio: 'VENTA', valor: 0 },
            { tipo_precio: 'DAÑO_TOTAL', valor: 0 },
        ],
        condiciones: {
            monto_garantia: 0,
            monto_daño_total: 0,
        },
    });

    useEffect(() => {
        fetchProductos();
        fetchCanastillas();
        if (prestable && isEdit) {
            setFormData({
                id: prestable.id,
                nombre: prestable.nombre,
                codigo: prestable.codigo,
                tipo: prestable.tipo,
                capacidad: prestable.capacidad,
                producto_id: prestable.producto_id,
                prestable_relacionado_id: prestable.prestable_relacionado_id,
                activo: prestable.activo,
                precios: prestable.precios || [],
                productos_relacionados: (prestable as any).productos?.map((p: any) => ({
                    producto_id: p.id,
                    es_principal: p.pivot?.es_principal || false,
                })) || [],
                condiciones: {
                    monto_garantia: prestable.condiciones?.[0]?.monto_garantia || 0,
                    monto_daño_total: prestable.condiciones?.[0]?.monto_daño_total || 0,
                },
            });
        }
    }, [prestable, isEdit]);

    const fetchProductos = async () => {
        try {
            const response = await fetch('/api/productos?per_page=1000');
            const data = await response.json();
            setProductos(data.data?.data || data.data || []);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const fetchCanastillas = async () => {
        try {
            const response = await fetch('/api/prestables?tipo=CANASTILLA&per_page=1000');
            const data = await response.json();
            setCanastillas(data.data?.data || data.data || []);
        } catch (error) {
            console.error('Error cargando canastillas:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEdit && (formData as any).id) {
                await prestableService.update((formData as any).id, formData as NuevoPrestable);
                showNotification({
                    title: 'Éxito',
                    message: 'Prestable actualizado correctamente',
                    type: 'success',
                });
                router.visit('/prestamos/prestables');
            } else {
                await prestableService.create(formData as NuevoPrestable);
                showNotification({
                    title: 'Éxito',
                    message: 'Prestable creado correctamente',
                    type: 'success',
                });
                router.visit('/prestamos/prestables');
            }
        } catch (error: any) {
            showNotification({
                title: 'Error',
                message: error.message || 'Ocurrió un error',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = isEdit ? 'Editar Embase o Canastilla' : 'Crear Embase o Canastilla';
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Préstamos', href: '/prestamos' },
        { title: 'Prestables', href: '/prestamos/prestables' },
        { title, href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div>
                <div className="bg-white dark:bg-gray-900 shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        {title}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Primera fila: Código, Nombre, Tipo */}
                        <div className="flex items-start gap-5">
                            <div className="w-1/5">
                                <ToggleGroup
                                    label={`Tipo ${isEdit ? '(no editable)' : ''}`}
                                    required
                                    value={formData.tipo || 'CANASTILLA'}
                                    onChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            tipo: value as TipoPrestable,
                                        })
                                    }
                                    disabled={isEdit}
                                    options={[
                                        { value: 'CANASTILLA', label: 'Canastilla', icon: '📦' },
                                        { value: 'EMBASES', label: 'Embases', icon: '🔖' },
                                    ]}
                                />

                                {formData.tipo === 'CANASTILLA' && !isEdit && (
                                    <div className="mt-2">
                                        <CustomCheckbox
                                            id="crear-embase"
                                            checked={formData.crear_embase_asociado || false}
                                            onChange={(checked) =>
                                                setFormData({
                                                    ...formData,
                                                    crear_embase_asociado: checked,
                                                })
                                            }
                                            label="Crear embase asociado"
                                            icon="🔗"
                                            description=""
                                            variant="highlight"
                                        />
                                    </div>
                                )}
                            </div>

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

                            {formData.tipo === 'CANASTILLA' && (
                                <div className="w-1/5">
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        📦 Capacidad canastilla
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
                        </div>

                        {/* Grid de campos adicionales */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">                            

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
                                            description: `Código: ${c.codigo}`,
                                        }))}
                                        onChange={(id) =>
                                            setFormData({
                                                ...formData,
                                                prestable_relacionado_id: id ? Number(id) : undefined,
                                            })
                                        }
                                        allowClear
                                    />
                                    {(formData as any).prestable_relacionado_id && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                            <p>
                                                <span className="font-medium">📦 Canastilla relacionada:</span>{' '}
                                                <span className="font-mono">
                                                    {canastillas.find(c => c.id === (formData as any).prestable_relacionado_id)?.codigo}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isEdit && (
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
                                    {formData.productos_relacionados.map((pr: any, idx: number) => {
                                        const productoSeleccionado = productos.find(p => p.id === pr.producto_id);
                                        return (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex-1">
                                                <SearchSelect
                                                    placeholder="Buscar producto..."
                                                    value={pr.producto_id || ''}
                                                    options={productos.map((p) => ({
                                                        value: p.id,
                                                        label: p.nombre,
                                                        description: `ID: ${p.id} | SKU: ${p.sku || 'N/A'}`,
                                                    }))}
                                                    onChange={(id) => {
                                                        const newPR = [...(formData.productos_relacionados || [])];
                                                        newPR[idx].producto_id = Number(id || 0);
                                                        setFormData({ ...formData, productos_relacionados: newPR });
                                                    }}
                                                    allowClear
                                                />
                                                {productoSeleccionado && (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                                                        <p>
                                                            <span className="font-medium">ID:</span> <span className="font-mono">{productoSeleccionado.id} | </span>
                                                            <span className="font-medium">SKU:</span> <span className="font-mono">{productoSeleccionado.sku || 'N/A'}</span>
                                                        </p>
                                                        <p>
                                                            
                                                        </p>
                                                    </div>
                                                )}
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
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    Haz click en "Agregar" para relacionar productos.
                                </p>
                            )}
                        </div>

                        {/* Precios */}
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

                        {/* Precios Embase */}
                        {formData.tipo === 'CANASTILLA' && formData.crear_embase_asociado && !isEdit && (
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

                        {/* Botones */}
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-6 flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/prestamos/prestables')}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? '⏳ Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
