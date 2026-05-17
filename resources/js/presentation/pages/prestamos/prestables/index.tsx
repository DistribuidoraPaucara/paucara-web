import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import SearchSelect from '@/presentation/components/ui/search-select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/presentation/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/presentation/components/ui/dropdown-menu';
import { useToastNotifications } from '@/application/hooks/use-toast-notifications';
import prestableService from '@/infrastructure/services/prestable.service';
import type { Prestable, NuevoPrestable, TipoPrestable } from '@/domain/entities/prestamos';
import { Plus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';

export default function PrestablesIndex() {
    console.log('🔧 COMPONENT MOUNTED: PrestablesIndex');
    const { showNotification } = useToastNotifications();
    const submissionLockRef = useRef(false); // Ref para prevenir race conditions
    const submissionTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref para timer de lock
    const [prestables, setPrestables] = useState<Prestable[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [prestableToDelete, setPrestableToDelete] = useState<Prestable | null>(null);
    const [prestableToView, setPrestableToView] = useState<Prestable | null>(null);

    useEffect(() => {
        console.log('👁️ showForm cambió a:', showForm);
        if (showForm) {
            console.log('✅ MODAL DEBERÍA ESTAR VISIBLE AHORA');
        } else {
            console.log('❌ MODAL DEBERÍA ESTAR OCULTO');
        }
    }, [showForm]);
    const [productos, setProductos] = useState<Array<{ id: number; nombre: string; sku?: string }>>([]);
    const [canastillas, setCanastillas] = useState<Array<{ id: number; nombre: string; codigo: string }>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // ✨ Flag para prevenir submit duplicado
    const [formData, setFormData] = useState<Partial<NuevoPrestable & { activo?: boolean; prestable_relacionado_id?: number; crear_embase_asociado?: boolean; precios_embase?: Array<{ tipo_precio: string; valor: number }>; productos_relacionados?: Array<{ producto_id: number; es_principal?: boolean }> }>>({
        nombre: '',
        codigo: '',
        tipo: 'CANASTILLA' as TipoPrestable,
        capacidad: undefined,
        producto_id: undefined,
        prestable_relacionado_id: undefined,
        activo: true,
        crear_embase_asociado: false, // ✨ NUEVO: Flag para crear embase junto con canastilla
        productos_relacionados: [], // ✨ NUEVO: Productos relacionados
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
        fetchPrestables();
        fetchProductos();
        fetchCanastillas();
    }, []);

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
            if (data.success) {
                setCanastillas(data.data.data || []);
            }
        } catch (error) {
            console.error('Error cargando canastillas:', error);
        }
    };

    const fetchPrestables = async () => {
        try {
            console.log('⏳ Fetching prestables...');
            const data = await prestableService.getAll();
            console.log('✅ Prestables cargados:', data);
            setPrestables(data);
        } catch (error) {
            console.error('❌ Error en fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✨ Prevenir submit duplicado: usar ref para lock inmediato + timer para bloqueo posterior
        if (isSubmitting || submissionLockRef.current) {
            console.log('⏸️ Submit ya en progreso, ignorando... (isSubmitting:', isSubmitting, ', lock:', submissionLockRef.current, ')');
            return;
        }

        // Bloquear inmediatamente y mantener bloqueado por 3 segundos para prevenir resubmissions
        submissionLockRef.current = true;
        setIsSubmitting(true);
        console.log('🚀 INICIANDO CREATE/UPDATE... Bloqueando por 3 segundos para prevenir duplicados');

        // Limpiar timer anterior si existe
        if (submissionTimerRef.current) {
            clearTimeout(submissionTimerRef.current);
        }

        // Timer para liberar lock después de 3 segundos (previene doble submit incluso si hay delays)
        submissionTimerRef.current = setTimeout(() => {
            submissionLockRef.current = false;
            submissionTimerRef.current = null;
            console.log('🔓 Submission lock liberado después de timeout');
        }, 3000);

        console.log('📋 FormData completo:', formData);
        console.log('📋 FormData precios:', formData.precios);
        console.log('📋 FormData condiciones:', formData.condiciones);

        try {
            // ✨ El código se generará automáticamente en el backend basado en el ID
            const dataToSave = { ...formData };

            if ((dataToSave as any).id) {
                console.log('♻️ ACTUALIZANDO prestable...');
                await prestableService.update((dataToSave as any).id, dataToSave);
                showNotification({
                    title: '✅ Éxito',
                    description: 'Prestable actualizado correctamente',
                    type: 'success',
                });
            } else {
                console.log('✨ CREANDO prestable nuevo...');
                await prestableService.create(dataToSave as NuevoPrestable);
                showNotification({
                    title: '✅ Éxito',
                    description: 'Prestable creado correctamente (código autogenerado)',
                    type: 'success',
                });
            }
            setShowForm(false);
            setFormData({
                nombre: '',
                codigo: '',
                tipo: 'CANASTILLA',
                producto_id: undefined,
                prestable_relacionado_id: undefined,
                activo: true,
                crear_embase_asociado: false, // ✨ Reset del checkbox
                productos_relacionados: [], // ✨ Reset productos relacionados
                precios: [
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
            await fetchPrestables();
        } catch (error: any) {
            console.error('❌ ERROR COMPLETO:', error);
            console.error('❌ ERROR response:', error?.response);
            console.error('❌ ERROR data:', error?.response?.data);
            console.error('❌ ERROR message:', error?.message);
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al guardar el prestable';
            showNotification({
                title: '❌ Error',
                description: errorMessage,
                type: 'error',
            });
            console.error('Error al guardar:', error);
        } finally {
            // No limpiar el lock aquí - dejar que el timer lo haga (3 segundos)
            // Esto previene resubmissions incluso si hay timing issues
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (prestable: Prestable) => {
        console.log('✏️ EDITANDO PRESTABLE:', prestable);
        console.log('📦 Precios originales:', prestable.precios);
        console.log('📦 Cantidad de precios:', prestable.precios?.length);

        const preciosMapeados =
            prestable.precios && prestable.precios.length > 0
                ? prestable.precios.map((p) => ({
                    id: p.id,
                    tipo_precio: p.tipo_precio,
                    valor: Number(p.valor),
                }))
                : [
                    { tipo_precio: 'PRESTAMO', valor: 0 },
                    { tipo_precio: 'VENTA', valor: 0 },
                ];

        console.log('✅ Precios mapeados:', preciosMapeados);

        const condicionesData =
            prestable.condiciones && prestable.condiciones.length > 0
                ? {
                    id: prestable.condiciones[0].id,
                    monto_garantia: Number(prestable.condiciones[0].monto_garantia || 0),
                    monto_daño_total: Number(prestable.condiciones[0].monto_daño_total || 0),
                }
                : {
                    monto_garantia: 0,
                    monto_daño_total: 0,
                };

        // Mapear productos relacionados
        const productosRelacionadosMapeados = ((prestable as any).productosRelacionados || []).map((pr: any) => ({
            producto_id: pr.producto_id,
            es_principal: pr.es_principal || false,
        }));

        const nuevoFormData = {
            id: prestable.id,
            nombre: prestable.nombre,
            codigo: prestable.codigo,
            tipo: prestable.tipo as TipoPrestable,
            capacidad: prestable.capacidad,
            producto_id: prestable.producto_id,
            prestable_relacionado_id: (prestable as any).prestable_relacionado_id,
            activo: prestable.activo,
            descripcion: prestable.descripcion,
            productos_relacionados: productosRelacionadosMapeados,
            precios: preciosMapeados,
            precios_embase: [
                { tipo_precio: 'COMPRA', valor: 0 },
                { tipo_precio: 'PRESTAMO', valor: 0 },
                { tipo_precio: 'VENTA', valor: 0 },
                { tipo_precio: 'DAÑO_TOTAL', valor: 0 },
            ],
            condiciones: condicionesData,
        };

        // Si es un embase con canastilla relacionada, asegurar que esa canastilla esté en la lista
        if (prestable.tipo === 'EMBASES' && (prestable as any).prestable_relacionado_id && (prestable as any).prestablePadre) {
            const canastillaRelacionada = (prestable as any).prestablePadre;
            const existe = canastillas.some(c => c.id === canastillaRelacionada.id);
            if (!existe && canastillaRelacionada.id) {
                console.log('🔗 Agregando canastilla relacionada a la lista:', canastillaRelacionada);
                setCanastillas(prev => [canastillaRelacionada, ...prev]);
            }
        }

        console.log('🔄 Nuevo FormData:', nuevoFormData);
        setFormData(nuevoFormData);
        setShowForm(true);
    };

    const handleView = (prestable: Prestable) => {
        console.log('👁️ VER DETALLES:', prestable);
        setPrestableToView(prestable);
        setShowViewModal(true);
    };

    const handleDeleteClick = (prestable: Prestable) => {
        console.log('🗑️ ABRIR DIÁLOGO ELIMINAR:', prestable.nombre);
        setPrestableToDelete(prestable);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!prestableToDelete?.id) return;

        try {
            console.log('⚠️ ELIMINANDO PRESTABLE:', prestableToDelete.id);
            await prestableService.remove(prestableToDelete.id);

            showNotification({
                title: '✅ Eliminado',
                description: `${prestableToDelete.nombre} fue eliminado correctamente`,
                type: 'success',
            });

            setShowDeleteDialog(false);
            setPrestableToDelete(null);
            await fetchPrestables();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Error al eliminar el prestable';
            showNotification({
                title: '❌ Error',
                description: errorMessage,
                type: 'error',
            });
            console.error('Error al eliminar:', error);
        }
    };

    return (
        <AppLayout>
            <Head title="Gestión de Prestables" />
            <div className="p-4 bg-white dark:bg-gray-950 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📦 Gestión de Prestables
                    </h1>
                    <Button
                        onClick={() => {
                            console.log('🔵 BOTÓN CLICKEADO: Nuevo Prestable');
                            setShowForm(true);
                            console.log('🔵 setShowForm(true) llamado');
                        }}
                        className="gap-2"
                    >
                        <Plus size={20} />
                        Nuevo Prestable
                    </Button>
                </div>

                {/* Formulario Modal */}
                <Dialog
                    open={showForm}
                    onOpenChange={(open) => {
                        setShowForm(open);
                        if (!open) {
                            // Limpiar formulario cuando se cierra
                            setFormData({
                                nombre: '',
                                codigo: '',
                                tipo: 'CANASTILLA',
                                capacidad: undefined,
                                producto_id: undefined,
                                prestable_relacionado_id: undefined,
                                activo: true,
                                crear_embase_asociado: false, // ✨ Reset del checkbox
                                productos_relacionados: [], // ✨ Reset productos relacionados
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
                        }
                    }}
                >
                    <DialogContent
                        style={{ width: '90vw', maxWidth: '90vw' }}
                        className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-0"
                    >
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                {(formData as any).id ? 'Editar' : 'Crear'} Canastillas/Embases
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleCreateOrUpdate} className="space-y-4 px-6 pb-6">
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
                                                    { producto_id: 0, es_principal: currentLength === 0 } // Principal si es el primero
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
                                                {/* Producto */}
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

                                                {/* Principal Checkbox */}
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

                                                {/* Delete Button */}
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

                            {/* Condiciones */}
                            {/* <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                                    🔒 Condiciones Individuales
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            🔐 Garantía
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.condiciones?.monto_garantia === 0 ? '' : formData.condiciones?.monto_garantia ?? ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    condiciones: {
                                                        ...formData.condiciones,
                                                        monto_garantia: e.target.value === '' ? 0 : Number(e.target.value),
                                                    },
                                                })
                                            }
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            💥 Daño Total
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.condiciones?.monto_daño_total === 0 ? '' : formData.condiciones?.monto_daño_total ?? ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    condiciones: {
                                                        ...formData.condiciones,
                                                        monto_daño_total: e.target.value === '' ? 0 : Number(e.target.value),
                                                    },
                                                })
                                            }
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div> */}

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

                {/* Diálogo de Confirmación de Eliminación */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
                                🗑️ Eliminar Prestable
                            </DialogTitle>
                        </DialogHeader>

                        <div className="py-4">
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                ¿Estás seguro de que deseas eliminar?
                            </p>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mt-4">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {prestableToDelete?.nombre}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Código: {prestableToDelete?.codigo}
                                </p>
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                                ⚠️ Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal de Vista de Detalles */}
                <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                    <DialogContent
                        style={{ width: '90vw', maxWidth: '90vw' }}
                        className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-2"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                                👁️ Detalles del Prestable
                            </DialogTitle>
                        </DialogHeader>

                        {prestableToView && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
                                {/* Información Básica */}
                                <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                        📋 Información Básica
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">ID</p>
                                            <p className="font-semibold text-gray-900 dark:text-white font-mono">
                                                #{prestableToView.id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {prestableToView.nombre}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Código</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {prestableToView.codigo}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
                                            <span className="inline-flex px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {prestableToView.tipo}
                                            </span>
                                        </div>
                                        {prestableToView.capacidad && (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Capacidad</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {prestableToView.capacidad} unidades
                                                </p>
                                            </div>
                                        )}
                                        {prestableToView.descripcion && (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Descripción</p>
                                                <p className="text-gray-900 dark:text-white">
                                                    {prestableToView.descripcion}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Producto Vinculado */}
                                {prestableToView.producto && (
                                    <div className="col-span-1 border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                            📦 Producto Vinculado
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {prestableToView.producto.nombre}
                                                </p>
                                            </div>
                                            {prestableToView.producto.sku && (
                                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">SKU</p>
                                                    <p className="font-mono text-gray-900 dark:text-white">
                                                        {prestableToView.producto.sku}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Productos Relacionados */}
                                {(prestableToView as any).productosRelacionados && (prestableToView as any).productosRelacionados.length > 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                            🔗 Productos Relacionados (Variantes)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {(prestableToView as any).productosRelacionados.map((pr: any) => (
                                                <div
                                                    key={pr.id}
                                                    className={`p-4 rounded-lg border ${pr.es_principal
                                                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-2 mb-2">
                                                        {pr.es_principal && (
                                                            <span className="text-2xl">⭐</span>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className={`text-sm font-medium ${pr.es_principal
                                                                ? 'text-yellow-600 dark:text-yellow-400'
                                                                : 'text-gray-600 dark:text-gray-400'
                                                                }`}>
                                                                {pr.es_principal ? 'Principal' : 'Variante'}
                                                            </p>
                                                            <p className={`font-semibold text-gray-900 dark:text-white break-words`}>
                                                                {pr.producto?.nombre || `#${pr.producto_id}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {pr.producto?.sku && (
                                                        <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                                                            SKU: {pr.producto.sku}
                                                        </p>
                                                    )}
                                                    {pr.descripcion && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                                                            {pr.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Canastilla Relacionada (si es EMBASES) */}
                                {(prestableToView as any).prestable_padre && (
                                    <div className="col-span-1 border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                            🔗 Canastilla Relacionada
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Nombre</p>
                                                <p className="font-semibold text-blue-900 dark:text-blue-100">
                                                    {(prestableToView as any).prestable_padre.nombre}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Código</p>
                                                <p className="font-mono text-blue-900 dark:text-blue-100">
                                                    {(prestableToView as any).prestable_padre.codigo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Precios */}
                                {prestableToView.precios && prestableToView.precios.length > 0 && (
                                    <div className="col-span-1 border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                            💰 Precios
                                        </h3>
                                        <div className="space-y-2">
                                            {prestableToView.precios.map((precio) => (
                                                <div
                                                    key={precio.id}
                                                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                >
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {precio.tipo_precio === 'COMPRA' ? '📦 Precio Compra' :
                                                            precio.tipo_precio === 'PRESTAMO' ? '💰 Precio Préstamo' :
                                                                precio.tipo_precio === 'VENTA' ? '🛒 Precio Venta' :
                                                                    '💥 Precio por Daño Total'}
                                                    </span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        Bs {Number(precio.valor).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Condiciones */}
                                {prestableToView.condiciones && prestableToView.condiciones.length > 0 && (
                                    <div className="col-span-1 border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                            🔒 Condiciones
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="text-gray-700 dark:text-gray-300">Garantía</span>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    Bs {Number(prestableToView.condiciones[0].monto_garantia).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="text-gray-700 dark:text-gray-300">Daño Total</span>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    Bs {Number(prestableToView.condiciones[0].monto_daño_total).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Estado */}
                                <div className="col-span-1">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                                        ✨ Estado
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 dark:text-gray-300">Activo:</span>
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${prestableToView.activo
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}
                                        >
                                            {prestableToView.activo ? '✅ Sí' : '❌ No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cerrar
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={() => {
                                    setShowViewModal(false);
                                    if (prestableToView) handleEdit(prestableToView);
                                }}
                                className="gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Edit2 size={18} />
                                Editar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Tabla de Prestables */}
                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                            Cargando...
                        </div>
                    ) : prestables.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-5xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No existen productos prestables
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Crea tu primer prestable haciendo clic en el botón "Nuevo Prestable"
                                </p>
                                <Button onClick={() => setShowForm(true)} className="gap-2">
                                    <Plus size={20} />
                                    Crear Prestable
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <TableHead className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                                            ID
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Nombre
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Código/Tipo
                                        </TableHead>
                                        {/* <TableHead className="text-gray-900 dark:text-gray-100">
                                            📦 Producto
                                        </TableHead> */}
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            🔗 Relacionado
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            🔗 Productos Relacionados
                                        </TableHead>
                                        {/* <TableHead className="text-gray-900 dark:text-gray-100">
                                            Precio Préstamo
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Precio Venta
                                        </TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Garantía
                                        </TableHead> */}
                                        <TableHead className="text-gray-900 dark:text-gray-100">
                                            Estado
                                        </TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prestables.map((p) => (
                                        <TableRow
                                            key={p.id}
                                            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                                        >
                                            <TableCell className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                                                #{p.id}
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-100">
                                                {p.nombre}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-300">
                                                <p>
                                                    {p.codigo}    
                                                </p>
                                                
                                                <span className="inline-flex px-1 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {p.tipo}
                                                </span>
                                            </TableCell>
                                            {/* <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                                {p.producto ? (
                                                    <span className="flex items-center gap-1">
                                                        <span>📦</span>
                                                        <span>{p.producto.nombre}</span>
                                                        {p.producto.sku && <span className="text-gray-500 dark:text-gray-400 text-xs">({p.producto.sku})</span>}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 italic">-</span>
                                                )}
                                            </TableCell> */}
                                            <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                                {p.tipo === 'EMBASES' && (p as any).prestablePadre ? (
                                                    <span className="flex items-center gap-1">
                                                        <span>📦</span>
                                                        <span>{(p as any).prestablePadre.nombre}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">({(p as any).prestablePadre.codigo})</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 italic">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-300 text-sm">
                                                {(p as any).productosRelacionados && (p as any).productosRelacionados.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {(p as any).productosRelacionados.map((pr: any) => (
                                                            <span key={pr.id} className="flex items-center gap-1 text-xs">
                                                                {pr.es_principal && <span className="text-yellow-500">⭐</span>}
                                                                <span>{pr.producto?.nombre || `#${pr.producto_id}`}</span>
                                                                {pr.producto?.sku && <span className="text-gray-500 dark:text-gray-400">({pr.producto.sku})</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 italic">-</span>
                                                )}
                                            </TableCell>
                                            {/*<TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                                                Bs {Number(p.precios?.find((pr) => pr.tipo_precio === 'PRESTAMO')?.valor || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                                                Bs {Number(p.precios?.find((pr) => pr.tipo_precio === 'VENTA')?.valor || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-gray-100">
                                                Bs {Number(p.condiciones?.[0]?.monto_garantia || 0).toFixed(2)}
                                            </TableCell> */}
                                            <TableCell>
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${p.activo
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                        }`}
                                                >
                                                    {p.activo ? '✅ Activo' : '❌ Inactivo'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => handleView(p)} className="cursor-pointer flex items-center gap-2">
                                                            <Eye size={16} />
                                                            <span>Ver detalles</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(p)} className="cursor-pointer flex items-center gap-2">
                                                            <Edit2 size={16} />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(p)} className="cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400">
                                                            <Trash2 size={16} />
                                                            <span>Eliminar</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
