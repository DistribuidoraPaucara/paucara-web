import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';

interface StockItem {
    id: number;
    prestable_id: number;
    prestable_nombre: string;
    prestable_codigo: string;
    almacen_nombre: string;
    cantidad_disponible: number;
    cantidad_cliente_deudor?: number;
    cantidad_cliente_devuelto?: number;
    cantidad_evento_deudor?: number;
    cantidad_evento_devuelto?: number;
    cantidad_proveedor_acreedor?: number;
    cantidad_proveedor_devuelto?: number;
}

interface PrestableDetails {
    id: number;
    nombre: string;
    capacidad: number;
    embases_relacionados?: any[];
}

interface AjustePageProps {
    prestable_id: number;
    almacen_id: number;
    tipo: 'clientes' | 'proveedores';
    item: StockItem;
}

export default function AjustePage({
    prestable_id,
    almacen_id,
    tipo,
    item: initialItem,
}: AjustePageProps) {
    const [item, setItem] = useState(initialItem);
    const [prestableDetails, setPrestableDetails] = useState<PrestableDetails | null>(null);
    const [loading, setLoading] = useState(false);

    const [adjustData, setAdjustData] = useState({
        tipo_ajuste: 'disponible' as 'disponible' | 'cliente_deudor' | 'evento_deudor' | 'proveedor_acreedor' | 'total',
        es_incremento: true,
        cantidad: 0,
        motivo: '',
        comentarios: '',
        actualizar_embase: true,
    });

    // Determinar cuáles opciones mostrar según el tipo
    const getOpcionesAjuste = () => {
        if (tipo === 'clientes') {
            return [
                { value: 'total', label: '⚪ TOTAL (todos los estados)' },
                { value: 'disponible', label: '🟢 Disponible' },
                { value: 'cliente_deudor', label: '🔵 Deuda Cliente' },
                { value: 'evento_deudor', label: '🟣 Deuda Evento' },
            ];
        } else {
            return [
                { value: 'total', label: '⚪ TOTAL (todos los estados)' },
                { value: 'disponible', label: '🟢 Disponible' },
                { value: 'proveedor_acreedor', label: '🟠 Deuda Proveedor' },
            ];
        }
    };

    useEffect(() => {
        const loadPrestableDetails = async () => {
            try {
                const response = await fetch(`/api/prestables/${prestable_id}`, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
                const result = await response.json();
                if (result.success) {
                    setPrestableDetails(result.data);
                }
            } catch (error) {
                console.error('Error cargando detalles del prestable:', error);
            }
        };

        loadPrestableDetails();
    }, [prestable_id]);

    const handleSave = async () => {
        if (adjustData.cantidad === 0) {
            alert('Por favor ingresa una cantidad');
            return;
        }

        setLoading(true);

        try {
            const cantidadFinal = adjustData.es_incremento ? adjustData.cantidad : -adjustData.cantidad;
            const tipoAjuste = adjustData.tipo_ajuste === 'total' ? 'disponible' : adjustData.tipo_ajuste;

            // Construir payload dinámico según el tipo
            const body: any = {
                almacen_id,
                cantidad_disponible: item.cantidad_disponible,
            };

            if (tipo === 'clientes') {
                body.cantidad_cliente_deudor = item.cantidad_cliente_deudor || 0;
                body.cantidad_cliente_devuelto = item.cantidad_cliente_devuelto || 0;
                body.cantidad_evento_deudor = item.cantidad_evento_deudor || 0;
                body.cantidad_evento_devuelto = item.cantidad_evento_devuelto || 0;

                // Aplicar cambios según tipo de ajuste
                if (tipoAjuste === 'disponible') {
                    body.cantidad_disponible += cantidadFinal;
                } else if (tipoAjuste === 'cliente_deudor') {
                    body.cantidad_cliente_deudor += cantidadFinal;
                } else if (tipoAjuste === 'evento_deudor') {
                    body.cantidad_evento_deudor += cantidadFinal;
                }
            } else {
                body.cantidad_proveedor_acreedor = item.cantidad_proveedor_acreedor || 0;
                body.cantidad_proveedor_devuelto = item.cantidad_proveedor_devuelto || 0;

                if (tipoAjuste === 'disponible') {
                    body.cantidad_disponible += cantidadFinal;
                } else if (tipoAjuste === 'proveedor_acreedor') {
                    body.cantidad_proveedor_acreedor += cantidadFinal;
                }
            }

            body.motivo = adjustData.motivo;
            body.comentarios = adjustData.comentarios;

            const response = await fetch(
                `/api/prestables/${prestable_id}/stock/ajustar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(body),
                }
            );

            const result = await response.json();
            if (result.success) {
                // Generar documento
                const documentoUrl = new URL(
                    `/api/prestables/${prestable_id}/ajuste-documento`,
                    window.location.origin
                );
                documentoUrl.searchParams.append('fecha', new Date().toLocaleString('es-ES'));
                documentoUrl.searchParams.append('almacen', item.almacen_nombre);

                // Valores antes
                documentoUrl.searchParams.append('disponible_antes', item.cantidad_disponible);

                if (tipo === 'clientes') {
                    documentoUrl.searchParams.append('cliente_deudor_antes', item.cantidad_cliente_deudor || 0);
                    documentoUrl.searchParams.append('evento_deudor_antes', item.cantidad_evento_deudor || 0);

                    const cantidadFinal = adjustData.es_incremento ? adjustData.cantidad : -adjustData.cantidad;
                    const tipoAjuste = adjustData.tipo_ajuste === 'total' ? 'disponible' : adjustData.tipo_ajuste;

                    const disponibleDespues = tipoAjuste === 'disponible' ? item.cantidad_disponible + cantidadFinal : item.cantidad_disponible;
                    const clienteDespues = tipoAjuste === 'cliente_deudor' ? (item.cantidad_cliente_deudor || 0) + cantidadFinal : (item.cantidad_cliente_deudor || 0);
                    const eventoDespues = tipoAjuste === 'evento_deudor' ? (item.cantidad_evento_deudor || 0) + cantidadFinal : (item.cantidad_evento_deudor || 0);

                    documentoUrl.searchParams.append('disponible_despues', disponibleDespues);
                    documentoUrl.searchParams.append('cliente_deudor_despues', clienteDespues);
                    documentoUrl.searchParams.append('evento_deudor_despues', eventoDespues);
                } else {
                    documentoUrl.searchParams.append('proveedor_acreedor_antes', item.cantidad_proveedor_acreedor || 0);

                    const cantidadFinal = adjustData.es_incremento ? adjustData.cantidad : -adjustData.cantidad;
                    const tipoAjuste = adjustData.tipo_ajuste === 'total' ? 'disponible' : adjustData.tipo_ajuste;

                    const disponibleDespues = tipoAjuste === 'disponible' ? item.cantidad_disponible + cantidadFinal : item.cantidad_disponible;
                    const proveedorDespues = tipoAjuste === 'proveedor_acreedor' ? (item.cantidad_proveedor_acreedor || 0) + cantidadFinal : (item.cantidad_proveedor_acreedor || 0);

                    documentoUrl.searchParams.append('disponible_despues', disponibleDespues);
                    documentoUrl.searchParams.append('proveedor_acreedor_despues', proveedorDespues);
                }

                documentoUrl.searchParams.append('motivo', adjustData.motivo);
                documentoUrl.searchParams.append('comentarios', adjustData.comentarios);

                window.open(documentoUrl.toString(), '_blank');

                alert('✅ Stock ajustado exitosamente');
                router.visit(`/prestamos/stock/${tipo}`);
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error ajustando stock:', error);
            alert('Error al ajustar el stock');
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Préstamos',
            href: '/prestamos',
        },
        {
            title: tipo === 'clientes' ? 'Stock Clientes' : 'Stock Proveedores',
            href: `/prestamos/stock/${tipo}`,
        },
        {
            title: 'Ajustar Stock',
            href: '#',
        },
    ];

    const cantidadFinal = adjustData.es_incremento ? adjustData.cantidad : -adjustData.cantidad;
    const tipoAjuste = adjustData.tipo_ajuste === 'total' ? 'disponible' : adjustData.tipo_ajuste;

    const getValorActual = () => {
        switch (tipoAjuste) {
            case 'disponible':
                return item.cantidad_disponible;
            case 'cliente_deudor':
                return item.cantidad_cliente_deudor || 0;
            case 'evento_deudor':
                return item.cantidad_evento_deudor || 0;
            case 'proveedor_acreedor':
                return item.cantidad_proveedor_acreedor || 0;
            default:
                return 0;
        }
    };

    const getEtiqueta = () => {
        switch (tipoAjuste) {
            case 'disponible':
                return 'Disponible';
            case 'cliente_deudor':
                return 'Deuda Cliente';
            case 'evento_deudor':
                return 'Deuda Evento';
            case 'proveedor_acreedor':
                return 'Deuda Proveedor';
            default:
                return '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ajustar Stock - ${item.prestable_nombre}`} />

            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        ➕➖ Ajustar Stock - {item.prestable_nombre}
                    </h1>

                    {/* Info Box */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6">
                        <p className="text-amber-700 dark:text-amber-300">
                            <strong>ℹ️ Nota:</strong> Ingresa una cantidad positiva para aumentar o negativa para disminuir el stock en la categoría seleccionada.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Prestable Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    🏷️ Código
                                </label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.prestable_codigo}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    🏭 Almacén
                                </label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.almacen_nombre}
                                </p>
                            </div>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                🎯 Categoría *
                            </label>
                            <select
                                value={adjustData.tipo_ajuste}
                                onChange={(e) =>
                                    setAdjustData({
                                        ...adjustData,
                                        tipo_ajuste: e.target.value as any,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                {getOpcionesAjuste().map((op) => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de Ajuste */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                ➕➖ Tipo de Ajuste *
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="ajuste_tipo"
                                        checked={adjustData.es_incremento === true}
                                        onChange={() =>
                                            setAdjustData({
                                                ...adjustData,
                                                es_incremento: true,
                                            })
                                        }
                                        className="w-4 h-4 text-green-600 dark:text-green-400"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">➕ Incrementar</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="ajuste_tipo"
                                        checked={adjustData.es_incremento === false}
                                        onChange={() =>
                                            setAdjustData({
                                                ...adjustData,
                                                es_incremento: false,
                                            })
                                        }
                                        className="w-4 h-4 text-red-600 dark:text-red-400"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">➖ Decrementar</span>
                                </label>
                            </div>
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                📦 Cantidad *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={adjustData.cantidad}
                                onChange={(e) =>
                                    setAdjustData({
                                        ...adjustData,
                                        cantidad: Math.max(0, parseInt(e.target.value) || 0),
                                    })
                                }
                                placeholder="Ej: 5"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-semibold"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {adjustData.es_incremento ? '✅ Se sumará' : '✅ Se restará'}
                            </p>
                        </div>

                        {/* Resumen de Cambios */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                📊 Resumen de Cambios
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {getEtiqueta()}
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {getValorActual()}
                                        {adjustData.cantidad !== 0 && (
                                            <>
                                                {' → '}
                                                <span className={adjustData.es_incremento ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                    {getValorActual() + cantidadFinal}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Total General
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {item.cantidad_disponible +
                                            (item.cantidad_cliente_deudor || 0) +
                                            (item.cantidad_cliente_devuelto || 0) +
                                            (item.cantidad_evento_deudor || 0) +
                                            (item.cantidad_evento_devuelto || 0) +
                                            (item.cantidad_proveedor_acreedor || 0) +
                                            (item.cantidad_proveedor_devuelto || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Motivo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                🏷️ Motivo (Opcional)
                            </label>
                            <input
                                type="text"
                                value={adjustData.motivo}
                                onChange={(e) =>
                                    setAdjustData({
                                        ...adjustData,
                                        motivo: e.target.value,
                                    })
                                }
                                placeholder="Discrepancia, Daño, Pérdida..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Comentarios */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                💬 Comentarios (Opcional)
                            </label>
                            <textarea
                                value={adjustData.comentarios}
                                onChange={(e) =>
                                    setAdjustData({
                                        ...adjustData,
                                        comentarios: e.target.value,
                                    })
                                }
                                placeholder="Detalles adicionales..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 resize-none"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit(`/prestamos/stock/${tipo}`)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="gap-2 bg-amber-600 hover:bg-amber-700"
                        >
                            {loading ? 'Guardando...' : '✅ Guardar Ajuste'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
