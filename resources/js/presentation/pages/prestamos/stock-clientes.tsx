import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { DistributionChart } from '@/presentation/components/prestamos';

interface StockItem {
    id: number;
    prestable_id: number;
    prestable_nombre: string;
    prestable_codigo: string;
    prestable_tipo: string;
    almacen_nombre: string;
    cantidad_disponible: number;
    cantidad_cliente_deudor: number;
    cantidad_cliente_devuelto: number;
    cantidad_cliente_total: number;
    cantidad_evento_deudor: number;
    cantidad_evento_devuelto: number;
    cantidad_evento_total: number;
    cantidad_total: number;
    almacenes_prestables_id: number;
}

interface StockPageProps {
    items: StockItem[];
    resumen: {
        total_disponible: number;
        total_cliente_deudor: number;
        total_cliente_devuelto: number;
        total_cliente: number;
        total_evento_deudor: number;
        total_evento_devuelto: number;
        total_evento: number;
        total_general: number;
    };
    almacenes: Array<{ id: number; nombre: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Préstamos',
        href: '/prestamos',
    },
    {
        title: 'Stock Clientes',
        href: '#',
    },
];

export default function StockClientesPage({
    items: initialItems,
    resumen: initialResumen,
    almacenes,
}: StockPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [almacenFilter, setAlmacenFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<'nombre' | 'disponible' | 'prestamo'>('nombre');
    const [resumen, setResumen] = useState(initialResumen);

    // Estados para el modal de edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
    const [prestableDetails, setPrestableDetails] = useState<any>(null);

    // Estado para editar valores absolutos (tabla)
    const [editData, setEditData] = useState({
        cantidad_disponible: 0,
        cantidad_cliente_deudor: 0,
        cantidad_cliente_devuelto: 0,
        cantidad_evento_deudor: 0,
        cantidad_evento_devuelto: 0,
        motivo: '',
    });

    // Función para obtener color según tipo de prestable
    const getRowColor = (tipo: string) => {
        switch (tipo) {
            case 'EMBASE':
                return 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20';
            case 'CANASTILLA':
                return 'bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20';
            default:
                return 'hover:bg-gray-50 dark:hover:bg-gray-800';
        }
    };

    // Filtrado y búsqueda
    const filteredItems = useMemo(() => {
        let filtered = initialItems;

        // Filtro por almacén
        if (almacenFilter && almacenFilter !== 'all') {
            filtered = filtered.filter((item) =>
                item.almacen_nombre === almacenFilter
            );
        }

        // Filtro por tipo de prestable
        if (tipoFilter && tipoFilter !== 'all') {
            filtered = filtered.filter((item) =>
                item.prestable_tipo === tipoFilter
            );
        }

        // Búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.prestable_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.prestable_codigo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'nombre':
                    return a.prestable_nombre.localeCompare(b.prestable_nombre);
                case 'disponible':
                    return b.cantidad_disponible - a.cantidad_disponible;
                case 'prestamo':
                    return (b.cantidad_cliente_total + b.cantidad_evento_total) -
                        (a.cantidad_cliente_total + a.cantidad_evento_total);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [initialItems, searchTerm, almacenFilter, tipoFilter, sortBy]);

    const handleRefresh = () => {
        setLoading(true);
        router.reload({
            onFinish: () => setLoading(false),
        });
    };

    const handleExport = () => {
        // Preparar CSV
        const headers = ['Código', 'Nombre', 'Almacén', 'Disponible', 'Préstamo Cliente', 'Préstamo Evento', 'Total'];
        const rows = filteredItems.map((item) => [
            item.prestable_codigo,
            item.prestable_nombre,
            item.almacen_nombre,
            item.cantidad_disponible,
            item.cantidad_cliente_total,
            item.cantidad_evento_total,
            item.cantidad_total,
        ]);

        const csv = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stock-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleOpenEditModal = async (item: StockItem) => {
        setSelectedItem(item);
        setEditData({
            cantidad_disponible: item.cantidad_disponible,
            cantidad_cliente_deudor: item.cantidad_cliente_deudor,
            cantidad_cliente_devuelto: item.cantidad_cliente_devuelto,
            cantidad_evento_deudor: item.cantidad_evento_deudor,
            cantidad_evento_devuelto: item.cantidad_evento_devuelto,
            motivo: '',
        });

        // Cargar detalles del prestable incluyendo embases relacionados
        try {
            const response = await fetch(`/api/prestables/${item.prestable_id}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const result = await response.json();
            console.log('📊 API Response (Edit Modal):', result);
            console.log('🔖 embases_relacionados:', result.data?.embases_relacionados);
            if (result.success) {
                setPrestableDetails(result.data);
            }
        } catch (error) {
            console.error('Error cargando detalles del prestable:', error);
        }

        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedItem) return;

        try {
            const response = await fetch(
                `/api/prestables/${selectedItem.prestable_id}/stock/ajustar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        almacen_id: almacenes.find(a => a.nombre === selectedItem.almacen_nombre)?.id || 3,
                        cantidad_disponible: editData.cantidad_disponible,
                        cantidad_en_prestamo_cliente: editData.cantidad_en_prestamo_cliente,
                        cantidad_en_prestamo_proveedor: editData.cantidad_en_prestamo_proveedor,
                        cantidad_vendida: editData.cantidad_vendida,
                        motivo: editData.motivo,
                        comentarios: editData.comentarios,
                    }),
                }
            );

            const result = await response.json();
            if (result.success) {
                // Calcular diferencias
                const diffDisponible = editData.cantidad_disponible - (selectedItem?.cantidad_disponible || 0);
                const diffClienteLoans = editData.cantidad_en_prestamo_cliente - (selectedItem?.cantidad_en_prestamo_cliente || 0);
                const diffProveedorLoans = editData.cantidad_en_prestamo_proveedor - (selectedItem?.cantidad_en_prestamo_proveedor || 0);
                const diffVendida = editData.cantidad_vendida - (selectedItem?.cantidad_vendida || 0);
                const totalDiff = diffDisponible + diffClienteLoans + diffProveedorLoans + diffVendida;

                // Actualizar los totales localmente
                setResumen((prev) => ({
                    ...prev,
                    total_disponible: prev.total_disponible + diffDisponible,
                    total_en_prestamo_cliente: prev.total_en_prestamo_cliente + diffClienteLoans,
                    total_en_prestamo_proveedor: prev.total_en_prestamo_proveedor + diffProveedorLoans,
                    total_vendido: prev.total_vendido + diffVendida,
                    total_general: prev.total_general + totalDiff,
                }));

                // 🔗 Sincronizar embases relacionados si es una canastilla
                const almacenId = almacenes.find(a => a.nombre === selectedItem.almacen_nombre)?.id || 3;
                await syncRelatedEmbases(selectedItem.prestable_id, almacenId, diffDisponible, diffClienteLoans, diffProveedorLoans, diffVendida);

                setShowEditModal(false);

                // 🖨️ Generar y descargar documento
                const documentoUrl = new URL(
                    `/api/prestables/${selectedItem.prestable_id}/ajuste-documento`,
                    window.location.origin
                );

                // Agregar parámetros
                documentoUrl.searchParams.append('fecha', new Date().toLocaleString('es-ES'));
                documentoUrl.searchParams.append('almacen', almacenes.find(a => a.nombre === selectedItem.almacen_nombre)?.nombre || 'N/A');

                // Valores antes
                documentoUrl.searchParams.append('disponible_antes', selectedItem?.cantidad_disponible || 0);
                documentoUrl.searchParams.append('prestamo_cliente_antes', selectedItem?.cantidad_en_prestamo_cliente || 0);
                documentoUrl.searchParams.append('prestamo_proveedor_antes', selectedItem?.cantidad_en_prestamo_proveedor || 0);
                documentoUrl.searchParams.append('vendida_antes', selectedItem?.cantidad_vendida || 0);

                // Valores después
                documentoUrl.searchParams.append('disponible_despues', editData.cantidad_disponible);
                documentoUrl.searchParams.append('prestamo_cliente_despues', editData.cantidad_en_prestamo_cliente);
                documentoUrl.searchParams.append('prestamo_proveedor_despues', editData.cantidad_en_prestamo_proveedor);
                documentoUrl.searchParams.append('vendida_despues', editData.cantidad_vendida);
                documentoUrl.searchParams.append('motivo', editData.motivo);
                documentoUrl.searchParams.append('comentarios', editData.comentarios);

                // Abrir documento en nueva pestaña para descargar
                window.open(documentoUrl.toString(), '_blank');

                handleRefresh();
                alert('✅ Stock editado exitosamente\n📄 Se abrirá el documento para imprimir...');
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error editando stock:', error);
            alert('Error al editar el stock');
        }
    };

    /**
     * Sincronizar ajustes de embases relacionados cuando se ajusta una canastilla
     */
    const syncRelatedEmbases = async (prestableId: number, almacenId: number, diffDisponible: number, diffClienteLoans: number, diffProveedorLoans: number, diffVendida: number) => {
        try {
            console.log('📡 Iniciando sincronización de embases');

            // Obtener información del prestable para ver si tiene embases relacionados
            const response = await fetch(`/api/prestables/${prestableId}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            console.log('📦 Datos del prestable obtenidos:', result.data);
            const prestable = result.data;

            // Si es una canastilla y tiene embases relacionados
            if (prestable?.tipo === 'CANASTILLA' && prestable?.embases_relacionados && prestable.embases_relacionados.length > 0) {
                console.log(`🔗 Se encontraron ${prestable.embases_relacionados.length} embases relacionados`);

                // Ajustar cada embase relacionado
                for (const embase of prestable.embases_relacionados) {
                    console.log(`Procesando embase: ${embase.nombre} (ID: ${embase.id})`);

                    // Encontrar el stock del embase en el mismo almacén
                    const embaseItem = initialItems.find(
                        item => item.prestable_id === embase.id && item.almacen_nombre === selectedItem?.almacen_nombre
                    );

                    if (embaseItem) {
                        // Aplicar los mismos cambios al embase
                        const embaseNewValues = {
                            cantidad_disponible: Math.max(0, (embaseItem.cantidad_disponible || 0) + diffDisponible),
                            cantidad_en_prestamo_cliente: Math.max(0, (embaseItem.cantidad_en_prestamo_cliente || 0) + diffClienteLoans),
                            cantidad_en_prestamo_proveedor: Math.max(0, (embaseItem.cantidad_en_prestamo_proveedor || 0) + diffProveedorLoans),
                            cantidad_vendida: Math.max(0, (embaseItem.cantidad_vendida || 0) + diffVendida),
                        };

                        console.log(`Nuevos valores para embase ${embase.nombre}:`, embaseNewValues);

                        // Ajustar embase
                        const embaseResponse = await fetch(
                            `/api/prestables/${embase.id}/stock/ajustar`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                },
                                body: JSON.stringify({
                                    almacen_id: almacenId,
                                    ...embaseNewValues,
                                    motivo: `Sincronización automática con canastilla ${prestable.nombre}`,
                                    comentarios: 'Ajuste automático',
                                }),
                            }
                        );

                        console.log(`Response status para embase ${embase.nombre}:`, embaseResponse.status);

                        if (!embaseResponse.ok) {
                            const errorText = await embaseResponse.text();
                            console.error(`❌ HTTP Error ${embaseResponse.status} para embase ${embase.nombre}:`, errorText);
                            throw new Error(`HTTP ${embaseResponse.status}: ${errorText}`);
                        }

                        const embaseResult = await embaseResponse.json();
                        console.log(`Respuesta JSON embase ${embase.nombre}:`, embaseResult);

                        if (embaseResult.success) {
                            console.log(`✅ Embase ${embase.nombre} sincronizado correctamente`);
                        } else {
                            console.error(`❌ Error sincronizando embase ${embase.nombre}:`, embaseResult);
                            throw new Error(`Fallo al sincronizar embase ${embase.nombre}: ${embaseResult.message}`);
                        }
                    } else {
                        console.warn(`⚠️ No se encontró stock para el embase ${embase.nombre} en el almacén ${selectedItem?.almacen_nombre}`);
                    }
                }
            } else {
                console.log('ℹ️ No hay embases relacionados para sincronizar');
            }
        } catch (error) {
            console.error('❌ Error sincronizando embases:', error);
            throw error; // Relanzar el error para que se maneje en el caller
        }
    };

    const handleSaveRelativeAdjust = async () => {
        if (!selectedItem) return;

        if (adjustData.cantidad === 0) {
            alert('Por favor ingresa una cantidad');
            return;
        }

        // Calcular la cantidad final con signo (+ o -)
        const cantidadFinal = adjustData.es_incremento ? adjustData.cantidad : -adjustData.cantidad;

        // Determinar qué categoría afectar (total afecta disponible)
        const tipoAjuste = adjustData.tipo_ajuste === 'total' ? 'disponible' : adjustData.tipo_ajuste;

        try {
            const response = await fetch(
                `/api/prestables/${selectedItem.prestable_id}/stock/ajustar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        almacen_id: almacenes.find(a => a.nombre === selectedItem.almacen_nombre)?.id || 3,
                        cantidad_disponible: tipoAjuste === 'disponible' ? (selectedItem?.cantidad_disponible || 0) + cantidadFinal : selectedItem?.cantidad_disponible || 0,
                        cantidad_en_prestamo_cliente: tipoAjuste === 'prestamo_cliente' ? (selectedItem?.cantidad_en_prestamo_cliente || 0) + cantidadFinal : selectedItem?.cantidad_en_prestamo_cliente || 0,
                        cantidad_en_prestamo_proveedor: tipoAjuste === 'prestamo_proveedor' ? (selectedItem?.cantidad_en_prestamo_proveedor || 0) + cantidadFinal : selectedItem?.cantidad_en_prestamo_proveedor || 0,
                        cantidad_vendida: tipoAjuste === 'vendida' ? (selectedItem?.cantidad_vendida || 0) + cantidadFinal : selectedItem?.cantidad_vendida || 0,
                        motivo: adjustData.motivo,
                        comentarios: adjustData.comentarios,
                    }),
                }
            );

            const result = await response.json();
            if (result.success) {
                // Actualizar los totales localmente
                setResumen((prev) => ({
                    ...prev,
                    total_disponible: tipoAjuste === 'disponible' ? prev.total_disponible + cantidadFinal : prev.total_disponible,
                    total_en_prestamo_cliente: tipoAjuste === 'prestamo_cliente' ? prev.total_en_prestamo_cliente + cantidadFinal : prev.total_en_prestamo_cliente,
                    total_en_prestamo_proveedor: tipoAjuste === 'prestamo_proveedor' ? prev.total_en_prestamo_proveedor + cantidadFinal : prev.total_en_prestamo_proveedor,
                    total_vendido: tipoAjuste === 'vendida' ? prev.total_vendido + cantidadFinal : prev.total_vendido,
                    total_general: prev.total_general + cantidadFinal,
                }));

                // 🔗 Sincronizar embases relacionados si el usuario lo autoriza
                if (adjustData.actualizar_embase) {
                    const almacenId = almacenes.find(a => a.nombre === selectedItem.almacen_nombre)?.id || 3;
                    const multiplicador = prestableDetails?.capacidad || 1;
                    const diffDisponible = tipoAjuste === 'disponible' ? cantidadFinal * multiplicador : 0;
                    const diffClienteLoans = tipoAjuste === 'prestamo_cliente' ? cantidadFinal * multiplicador : 0;
                    const diffProveedorLoans = tipoAjuste === 'prestamo_proveedor' ? cantidadFinal * multiplicador : 0;
                    const diffVendida = tipoAjuste === 'vendida' ? cantidadFinal * multiplicador : 0;

                    console.log('🔗 SINCRONIZANDO EMBASES:', {
                        prestableId: selectedItem.prestable_id,
                        almacenId,
                        multiplicador,
                        diffDisponible,
                        diffClienteLoans,
                        diffProveedorLoans,
                        diffVendida,
                    });

                    try {
                        await syncRelatedEmbases(selectedItem.prestable_id, almacenId, diffDisponible, diffClienteLoans, diffProveedorLoans, diffVendida);
                        console.log('✅ Embases sincronizados correctamente');
                    } catch (error) {
                        const errorMsg = error instanceof Error ? error.message : String(error);
                        console.error('❌ Error sincronizando embases:', errorMsg);
                        alert(`⚠️ Advertencia: El stock de la canastilla fue actualizado, pero hubo un error al sincronizar los embases relacionados.\n\nError: ${errorMsg}`);
                    }
                }

                setShowRelativeAdjustModal(false);

                // 🖨️ Generar y descargar documento
                const documentoUrl = new URL(
                    `/api/prestables/${selectedItem.prestable_id}/ajuste-documento`,
                    window.location.origin
                );

                // Agregar parámetros con valores antes/después
                documentoUrl.searchParams.append('fecha', new Date().toLocaleString('es-ES'));
                documentoUrl.searchParams.append('almacen', almacenes.find(a => a.nombre === selectedItem.almacen_nombre)?.nombre || 'N/A');

                // Valores antes
                documentoUrl.searchParams.append('disponible_antes', selectedItem?.cantidad_disponible || 0);
                documentoUrl.searchParams.append('prestamo_cliente_antes', selectedItem?.cantidad_en_prestamo_cliente || 0);
                documentoUrl.searchParams.append('prestamo_proveedor_antes', selectedItem?.cantidad_en_prestamo_proveedor || 0);
                documentoUrl.searchParams.append('vendida_antes', selectedItem?.cantidad_vendida || 0);

                // Valores después (usando las variables ya declaradas tipoAjuste y cantidadFinal)
                const disponibleDespues = tipoAjuste === 'disponible' ? (selectedItem?.cantidad_disponible || 0) + cantidadFinal : selectedItem?.cantidad_disponible || 0;
                const prestamoCDespues = tipoAjuste === 'prestamo_cliente' ? (selectedItem?.cantidad_en_prestamo_cliente || 0) + cantidadFinal : selectedItem?.cantidad_en_prestamo_cliente || 0;
                const prestamoProvDespues = tipoAjuste === 'prestamo_proveedor' ? (selectedItem?.cantidad_en_prestamo_proveedor || 0) + cantidadFinal : selectedItem?.cantidad_en_prestamo_proveedor || 0;
                const vendidaDespues = tipoAjuste === 'vendida' ? (selectedItem?.cantidad_vendida || 0) + cantidadFinal : selectedItem?.cantidad_vendida || 0;

                documentoUrl.searchParams.append('disponible_despues', disponibleDespues);
                documentoUrl.searchParams.append('prestamo_cliente_despues', prestamoCDespues);
                documentoUrl.searchParams.append('prestamo_proveedor_despues', prestamoProvDespues);
                documentoUrl.searchParams.append('vendida_despues', vendidaDespues);
                documentoUrl.searchParams.append('motivo', adjustData.motivo);
                documentoUrl.searchParams.append('comentarios', adjustData.comentarios);

                // 🔗 Si se actualizó el embase, agregar sus parámetros al documento
                if (adjustData.actualizar_embase && prestableDetails?.embases_relacionados && prestableDetails.embases_relacionados.length > 0) {
                    const embase = prestableDetails.embases_relacionados[0]; // Primer embase relacionado
                    const embaseStock = initialItems.find(
                        item => item.prestable_id === embase.id && item.almacen_nombre === selectedItem?.almacen_nombre
                    );

                    if (embaseStock) {
                        const multiplicador = prestableDetails?.capacidad || 1;
                        const diffEmbase = cantidadFinal * multiplicador;

                        documentoUrl.searchParams.append('embase_nombre', embase.nombre);
                        documentoUrl.searchParams.append('embase_codigo', embase.codigo);

                        // Valores del embase antes
                        documentoUrl.searchParams.append('embase_disponible_antes', embaseStock.cantidad_disponible);
                        documentoUrl.searchParams.append('embase_prestamo_cliente_antes', embaseStock.cantidad_en_prestamo_cliente);
                        documentoUrl.searchParams.append('embase_prestamo_proveedor_antes', embaseStock.cantidad_en_prestamo_proveedor);
                        documentoUrl.searchParams.append('embase_vendida_antes', embaseStock.cantidad_vendida);

                        // Valores del embase después
                        const embaseDisponibleDespues = tipoAjuste === 'disponible' ? embaseStock.cantidad_disponible + diffEmbase : embaseStock.cantidad_disponible;
                        const embaseClienteDespues = tipoAjuste === 'prestamo_cliente' ? embaseStock.cantidad_en_prestamo_cliente + diffEmbase : embaseStock.cantidad_en_prestamo_cliente;
                        const embaseProveedorDespues = tipoAjuste === 'prestamo_proveedor' ? embaseStock.cantidad_en_prestamo_proveedor + diffEmbase : embaseStock.cantidad_en_prestamo_proveedor;
                        const embaseVendidaDespues = tipoAjuste === 'vendida' ? embaseStock.cantidad_vendida + diffEmbase : embaseStock.cantidad_vendida;

                        documentoUrl.searchParams.append('embase_disponible_despues', embaseDisponibleDespues);
                        documentoUrl.searchParams.append('embase_prestamo_cliente_despues', embaseClienteDespues);
                        documentoUrl.searchParams.append('embase_prestamo_proveedor_despues', embaseProveedorDespues);
                        documentoUrl.searchParams.append('embase_vendida_despues', embaseVendidaDespues);
                        documentoUrl.searchParams.append('multiplicador', multiplicador);
                    }
                }

                // Abrir documento en nueva pestaña para descargar
                window.open(documentoUrl.toString(), '_blank');

                handleRefresh();
                alert('✅ Stock ajustado exitosamente\n📄 Se abrirá el documento para imprimir...');
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error('❌ Error ajustando stock:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            alert(`❌ Error al ajustar el stock: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock - Préstamos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Stock y Distribución
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Visualiza la distribución de stock: disponible, préstamos y deuda
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/prestamos/ajustes/movimientos')}
                            className="gap-2"
                        >
                            📋 Movimientos
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/prestamos/ajustes/historial')}
                            className="gap-2"
                        >
                            📜 Historial Ajustes
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                    </div>
                </div>

                {/* Gráfico de Distribución */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <DistributionChart
                            disponible={resumen.total_disponible}
                            enPrestamo={resumen.total_cliente + resumen.total_evento}
                            vendido={0}
                            deuda={0}
                            title="Distribución General de Stock - Clientes"
                            size="lg"
                        />
                    </div>

                    {/* Cards de Totales */}
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">
                                Disponible
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                                {resumen.total_disponible}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                                En Préstamo a Clientes
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                                {resumen.total_cliente}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
                                Total
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-200 mt-1">
                                {resumen.total_general}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Search className="h-4 w-4 inline mr-2" />
                            Buscar prestable
                        </label>
                        <Input
                            placeholder="Por nombre o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Filter className="h-4 w-4 inline mr-2" />
                            Almacén
                        </label>
                        <Select value={almacenFilter} onValueChange={setAlmacenFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {almacenes.map((almacen) => (
                                    <SelectItem key={almacen.id} value={almacen.nombre}>
                                        {almacen.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Filter className="h-4 w-4 inline mr-2" />
                            Tipo
                        </label>
                        <Select value={tipoFilter} onValueChange={setTipoFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="EMBASES">🔵 Embase</SelectItem>
                                <SelectItem value="CANASTILLA">🟡 Canastilla</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Ordenar por
                        </label>
                        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nombre">Nombre</SelectItem>
                                <SelectItem value="disponible">Disponible (Mayor)</SelectItem>
                                <SelectItem value="prestamo">Préstamos (Mayor)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Código
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Almacén
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        Disponible
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        Cliente
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        Evento
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            No hay resultados
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr
                                            key={`${item.prestable_id}-${item.almacen_nombre}`}
                                            className={`border-b border-slate-200 dark:border-slate-700 ${getRowColor(item.prestable_tipo)} transition-colors`}
                                        >
                                            <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                                                {item.prestable_codigo}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                {item.prestable_nombre}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                {item.almacen_nombre}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="inline-block px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 font-semibold">
                                                    {item.cantidad_disponible}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="inline-block px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 font-semibold">
                                                    {item.cantidad_cliente_total}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="inline-block px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 font-semibold">
                                                    {item.cantidad_evento_total}
                                                </span>
                                            </td>
                                            {/* <td className="px-4 py-3 text-right">
                                                <span className="inline-block px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 font-semibold">
                                                    {item.cantidad_vendida}
                                                </span>
                                            </td> */}
                                            <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                {item.cantidad_total}
                                            </td>
                                            <td className="px-4 py-3 text-center flex gap-2 justify-center flex-wrap">
                                                {/* <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenEditModal(item)}
                                                    className="gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                                >
                                                    📊 Editar
                                                </Button> */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(`/prestamos/stock/clientes/ajuste/${item.prestable_id}/${item.almacenes_prestables_id}`)}
                                                    className="gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                                >
                                                    ➕➖ Ajustar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Mostrando {filteredItems.length} de {initialItems.length} registros
                </div>
            </div>
        </AppLayout>
    );
}
