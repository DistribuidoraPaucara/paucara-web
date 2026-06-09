import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
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
    prestable_relacionado_id?: number | null;
    embase_asociado_id?: number | null;
    almacen_nombre: string;
    cantidad_disponible: number;
    cantidad_cliente_deudor: number;
    cantidad_proveedor_acreedor: number;
    cantidad_proveedor_devuelto: number;
    cantidad_proveedor_dañada: number;
    cantidad_proveedor_total: number;
    cantidad_total: number;
    almacenes_prestables_id: number;
}

interface StockItemWithGroupIndex extends StockItem {
    isEmbaseRelacionado?: boolean;
    canastillaId?: number;
    groupIndex?: number;
}

interface StockPageProps {
    items: StockItem[];
    resumen: {
        total_disponible: number;
        total_proveedor_acreedor: number;
        total_proveedor_devuelto: number;
        total_proveedor: number;
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
        title: 'Stock Proveedores',
        href: '#',
    },
];

export default function StockProveedoresPage({
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
        cantidad_proveedor_acreedor: 0,
        cantidad_proveedor_devuelto: 0,
        motivo: '',
    });

    // Función para obtener color según tipo de prestable
    const getRowColor = (tipo: string) => {
        switch (tipo) {
            case 'EMBASE':
                return 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20';
            case 'EMBASES':
                return 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20';
            case 'CANASTILLA':
                return 'bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20';
            default:
                return 'hover:bg-gray-50 dark:hover:bg-gray-800';
        }
    };

    // Función para agrupar embases con sus canastillas usando embase_asociado_id
    const agruparConRelaciones = (items: StockItem[]): StockItemWithGroupIndex[] => {
        const itemsAgrupados: StockItemWithGroupIndex[] = [];
        const procesados = new Set<string>();
        let groupIndex = 0;

        // Ordenar por almacén, luego por tipo (canastillas primero) y luego por nombre
        const itemsOrdenados = [...items].sort((a, b) => {
            // Primero ordenar por almacén
            if (a.almacen_nombre !== b.almacen_nombre) {
                return a.almacen_nombre.localeCompare(b.almacen_nombre);
            }
            // Luego por tipo
            if (a.prestable_tipo !== b.prestable_tipo) {
                return a.prestable_tipo === 'CANASTILLA' ? -1 : 1;
            }
            // Finalmente por nombre
            return a.prestable_nombre.localeCompare(b.prestable_nombre);
        });

        itemsOrdenados.forEach((item) => {
            // Clave única: prestable_id + almacén
            const itemKey = `${item.prestable_id}_${item.almacen_nombre}`;

            // Si ya fue procesado, saltar
            if (procesados.has(itemKey)) return;

            // Si es una canastilla
            if (item.prestable_tipo === 'CANASTILLA') {
                itemsAgrupados.push({
                    ...item,
                    groupIndex,
                });
                procesados.add(itemKey);

                // Buscar embases relacionados en el mismo almacén
                // Usa embase_asociado_id de la canastilla como referencia
                const embasesRelacionados = itemsOrdenados.filter(
                    (e) => {
                        const embaseKey = `${e.prestable_id}_${e.almacen_nombre}`;
                        return (
                            (e.prestable_tipo === 'EMBASES' || e.prestable_tipo === 'EMBASE') &&
                            (
                                e.prestable_relacionado_id === item.prestable_id ||  // Búsqueda por prestable_relacionado_id
                                item.embase_asociado_id === e.prestable_id  // O búsqueda por embase_asociado_id de canastilla
                            ) &&
                            e.almacen_nombre === item.almacen_nombre &&
                            !procesados.has(embaseKey)
                        );
                    }
                );

                // Agregar embases relacionados indentados (mismo groupIndex)
                embasesRelacionados.forEach((embase) => {
                    const embaseKey = `${embase.prestable_id}_${embase.almacen_nombre}`;
                    itemsAgrupados.push({
                        ...embase,
                        isEmbaseRelacionado: true,
                        canastillaId: item.prestable_id,
                        groupIndex,
                    });
                    procesados.add(embaseKey);
                });

                groupIndex++;
            } else if (item.prestable_tipo === 'EMBASES' || item.prestable_tipo === 'EMBASE') {
                // Si es un embase sin canastilla relacionada (prestable_relacionado_id es null)
                if (!item.prestable_relacionado_id) {
                    itemsAgrupados.push({
                        ...item,
                        groupIndex,
                    });
                    procesados.add(itemKey);
                    groupIndex++;
                }
            }
        });

        return itemsAgrupados;
    };

    // Filtrado y búsqueda
    const filteredItems = useMemo(() => {
        // 1. PRIMERO: Agrupar con TODOS los items para mantener relaciones
        const agrupado = agruparConRelaciones(initialItems);

        // 2. LUEGO: Aplicar filtros al resultado agrupado, manteniendo la jerarquía
        let filtered = agrupado;

        // Filtro por almacén
        if (almacenFilter && almacenFilter !== 'all') {
            filtered = filtered.filter((item) =>
                item.almacen_nombre === almacenFilter
            );
        }

        // Filtro por tipo de prestable
        if (tipoFilter && tipoFilter !== 'all') {
            if (tipoFilter === 'CANASTILLA') {
                // Mostrar canastillas + sus embases relacionados
                filtered = filtered.filter((item) => {
                    const isEmbaseRelacionado = (item as any).isEmbaseRelacionado || false;
                    if (isEmbaseRelacionado) return true;
                    return item.prestable_tipo === 'CANASTILLA';
                });
            } else if (tipoFilter === 'EMBASES') {
                // Mostrar solo embases (con o sin canastilla relacionada)
                filtered = filtered.filter((item) => item.prestable_tipo === 'EMBASES' || item.prestable_tipo === 'EMBASE');
            }
        }

        // Búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.prestable_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.prestable_codigo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenamiento: primero por groupIndex para mantener la estructura jerárquica
        filtered.sort((a, b) => {
            const groupIndexA = (a as any).groupIndex || 0;
            const groupIndexB = (b as any).groupIndex || 0;

            // Primero: respetar el groupIndex (mantiene canastilla + embases juntos)
            if (groupIndexA !== groupIndexB) {
                return groupIndexA - groupIndexB;
            }

            // Segundo: dentro del mismo grupo, canastillas primero
            const isEmbaseA = (a.isEmbaseRelacionado || false);
            const isEmbaseB = (b.isEmbaseRelacionado || false);
            if (isEmbaseA !== isEmbaseB) {
                return isEmbaseA ? 1 : -1;
            }

            // Tercero: aplicar criterio de ordenamiento elegido (solo a canastillas)
            if (!isEmbaseA) {
                switch (sortBy) {
                    case 'nombre':
                        return a.prestable_nombre.localeCompare(b.prestable_nombre);
                    case 'disponible':
                        return b.cantidad_disponible - a.cantidad_disponible;
                    case 'prestamo':
                        return b.cantidad_proveedor_total - a.cantidad_proveedor_total;
                    default:
                        return 0;
                }
            }

            return 0;
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
        const headers = ['Código', 'Nombre', 'Almacén', 'Disponible', 'Por Devolver', 'Devuelto', 'Dañada', 'Total Préstamo Proveedor', 'Total General'];
        const rows = filteredItems.map((item) => [
            item.prestable_codigo,
            item.prestable_nombre,
            item.almacen_nombre,
            item.cantidad_disponible,
            item.cantidad_proveedor_acreedor,
            item.cantidad_proveedor_devuelto,
            item.cantidad_proveedor_dañada,
            item.cantidad_proveedor_total,
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
            cantidad_proveedor_acreedor: item.cantidad_proveedor_acreedor,
            cantidad_proveedor_devuelto: item.cantidad_proveedor_devuelto,
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
            <Head title="Stock Proveedores" />

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
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Código
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Nombre
                                    </th>
                                    {/* Almacen */}
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Almacén
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        🏷️ Tipo
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        Disponible
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        🟠 Por Devolver
                                    </th>
                                    {/* <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        ✅ Devuelto
                                    </th> */}
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        🔴 Dañada
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        🧑‍💼Cliente
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                        📅 Evento
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
                                            colSpan={10}
                                            className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            No hay resultados
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {filteredItems.map((item, idx) => {
                                            const isEmbaseRelacionado = (item as any).isEmbaseRelacionado || false;
                                            const proximoEsEmbase = idx < filteredItems.length - 1
                                                ? (filteredItems[idx + 1] as any).isEmbaseRelacionado
                                                : false;
                                            const debeAgregarSeparador = !proximoEsEmbase && isEmbaseRelacionado;

                                            return (
                                                <React.Fragment key={`${item.prestable_id}-${item.almacen_nombre}`}>
                                                    <tr
                                                        className={`border-b border-slate-200 dark:border-slate-700 ${
                                                            isEmbaseRelacionado
                                                                ? 'bg-slate-50 dark:bg-slate-800/50'
                                                                : getRowColor(item.prestable_tipo)
                                                        } transition-colors`}
                                                    >
                                                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                                                            {item.id}
                                                        </td>
                                                        <td className={`px-4 py-3 font-mono text-slate-600 dark:text-slate-400 ${isEmbaseRelacionado ? 'pl-8' : ''}`}>
                                                            {isEmbaseRelacionado && <span className="text-slate-400">↳ </span>}
                                                            {item.prestable_codigo}
                                                        </td>
                                                        <td className={`px-4 py-3 font-medium text-slate-900 dark:text-slate-100 ${isEmbaseRelacionado ? 'text-slate-700 dark:text-slate-300' : ''}`}>
                                                            {item.prestable_nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                                item.prestable_tipo === 'EMBASES' || item.prestable_tipo === 'EMBASE'
                                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                                                            }`}>
                                                                {item.prestable_tipo === 'EMBASES' || item.prestable_tipo === 'EMBASE' ? '🔖 Embase' : '📦 Canastilla'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                            <p>{item.almacen_nombre}</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 font-semibold">
                                                                {item.cantidad_disponible}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 font-semibold">
                                                                {item.cantidad_proveedor_acreedor}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 font-semibold">
                                                                {item.cantidad_proveedor_dañada}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200">
                                                                {item.cantidad_cliente_deudor}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200">
                                                                {item.cantidad_evento_deudor}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center flex gap-2 justify-center flex-wrap">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.visit(`/prestamos/stock/proveedores/ajuste/${item.prestable_id}/${item.almacenes_prestables_id}`)}
                                                                className="gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                                            >
                                                                Ajustar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    {debeAgregarSeparador && (
                                                        <tr className="border-b-2 border-slate-300 dark:border-slate-600 h-1 bg-slate-100 dark:bg-slate-800">
                                                            <td colSpan={10} className="px-0 py-0"></td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </>
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

            {/* Modal: Editar Stock (Valores Absolutos) */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent
                    style={{ width: '90vw', maxWidth: '90vw' }}
                    className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-4"
                >
                    <DialogHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-4">
                        <DialogTitle className="text-lg sm:text-xl dark:text-white break-words">
                            📊 Editar Stock - {selectedItem?.prestable_nombre}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-4 sm:px-6 space-y-4">
                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-xs sm:text-sm">
                            <p className="text-blue-700 dark:text-blue-300">
                                <strong>ℹ️ Nota:</strong> Puedes editar cada categoría o el TOTAL directamente. Si editas el total, la diferencia se suma automáticamente al stock <strong>Disponible</strong>.
                            </p>
                        </div>

                        {/* Almacén (readonly) */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                🏭 Almacén
                            </label>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold break-words">
                                {selectedItem?.almacen_nombre}
                            </p>
                        </div>

                        {/* Embase Relacionado - Con cálculos en tiempo real */}
                        {prestableDetails?.embases_relacionados && prestableDetails.embases_relacionados.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                                <h3 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                    🔖 Embase Relacionado - Cambios en Tiempo Real
                                </h3>
                                <div className="space-y-2">
                                    {prestableDetails.embases_relacionados.map((embase: any) => {
                                        // Encontrar el stock del embase en el mismo almacén
                                        const embaseStock = initialItems.find(
                                            item => item.prestable_id === embase.id && item.almacen_nombre === selectedItem?.almacen_nombre
                                        );

                                        // Calcular diferencias en la canastilla
                                        const diffDisponible = editData.cantidad_disponible - (selectedItem?.cantidad_disponible || 0);
                                        const diffClienteLoans = editData.cantidad_en_prestamo_cliente - (selectedItem?.cantidad_en_prestamo_cliente || 0);
                                        const diffProveedorLoans = editData.cantidad_en_prestamo_proveedor - (selectedItem?.cantidad_en_prestamo_proveedor || 0);
                                        const diffVendida = editData.cantidad_vendida - (selectedItem?.cantidad_vendida || 0);

                                        // Stock resultante después de los cambios
                                        const embaseDisponibleDespues = embaseStock ? embaseStock.cantidad_disponible + diffDisponible : 0;
                                        const embaseClienteDespues = embaseStock ? embaseStock.cantidad_en_prestamo_cliente + diffClienteLoans : 0;
                                        const embaseProveedorDespues = embaseStock ? embaseStock.cantidad_en_prestamo_proveedor + diffProveedorLoans : 0;
                                        const embaseVendidaDespues = embaseStock ? embaseStock.cantidad_vendida + diffVendida : 0;
                                        const embastTotalDespues = embaseDisponibleDespues + embaseClienteDespues + embaseProveedorDespues + embaseVendidaDespues;

                                        return (
                                            <div key={embase.id} className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                    {embase.nombre} ({embase.codigo})
                                                </p>
                                                {embaseStock ? (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                        {/* Disponible */}
                                                        <div className="flex justify-between">
                                                            <span>📦 Disponible:</span>
                                                            <span className="font-semibold">
                                                                <span className="text-green-600 dark:text-green-400">{embaseStock.cantidad_disponible}</span>
                                                                {diffDisponible !== 0 && (
                                                                    <>
                                                                        {' → '}
                                                                        <span className={diffDisponible > 0 ? 'text-green-500' : 'text-red-500'}>
                                                                            {embaseDisponibleDespues} {diffDisponible > 0 ? `(+${diffDisponible})` : `(${diffDisponible})`}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Préstamo Cliente */}
                                                        <div className="flex justify-between">
                                                            <span>🔵 Préstamo (Cliente):</span>
                                                            <span className="font-semibold">
                                                                <span className="text-blue-600 dark:text-blue-400">{embaseStock.cantidad_en_prestamo_cliente}</span>
                                                                {diffClienteLoans !== 0 && (
                                                                    <>
                                                                        {' → '}
                                                                        <span className={diffClienteLoans > 0 ? 'text-blue-500' : 'text-red-500'}>
                                                                            {embaseClienteDespues} {diffClienteLoans > 0 ? `(+${diffClienteLoans})` : `(${diffClienteLoans})`}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Préstamo Proveedor */}
                                                        <div className="flex justify-between">
                                                            <span>🟠 Préstamo (Proveedor):</span>
                                                            <span className="font-semibold">
                                                                <span className="text-orange-600 dark:text-orange-400">{embaseStock.cantidad_en_prestamo_proveedor}</span>
                                                                {diffProveedorLoans !== 0 && (
                                                                    <>
                                                                        {' → '}
                                                                        <span className={diffProveedorLoans > 0 ? 'text-orange-500' : 'text-red-500'}>
                                                                            {embaseProveedorDespues} {diffProveedorLoans > 0 ? `(+${diffProveedorLoans})` : `(${diffProveedorLoans})`}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Vendida */}
                                                        <div className="flex justify-between">
                                                            <span>🔴 Vendida:</span>
                                                            <span className="font-semibold">
                                                                <span className="text-red-600 dark:text-red-400">{embaseStock.cantidad_vendida}</span>
                                                                {diffVendida !== 0 && (
                                                                    <>
                                                                        {' → '}
                                                                        <span className={diffVendida > 0 ? 'text-red-500' : 'text-green-500'}>
                                                                            {embaseVendidaDespues} {diffVendida > 0 ? `(+${diffVendida})` : `(${diffVendida})`}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Total */}
                                                        <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-1 mt-1">
                                                            <span className="font-bold">📊 Total:</span>
                                                            <span className="font-bold text-gray-900 dark:text-white">
                                                                {embaseStock.cantidad_total}
                                                                {embastTotalDespues !== embaseStock.cantidad_total && (
                                                                    <>
                                                                        {' → '}
                                                                        <span className={embastTotalDespues > embaseStock.cantidad_total ? 'text-green-500' : 'text-red-500'}>
                                                                            {embastTotalDespues}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sin stock registrado en este almacén</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Resumen de Cambios - Canastilla Actual */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                            <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 mb-3">
                                📊 Resumen de Cambios - {selectedItem?.prestable_nombre}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                {/* Disponible */}
                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">📦 Disponible</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedItem?.cantidad_disponible}
                                        {editData.cantidad_disponible !== (selectedItem?.cantidad_disponible || 0) && (
                                            <>
                                                {' → '}
                                                <span className={editData.cantidad_disponible > (selectedItem?.cantidad_disponible || 0) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                    {editData.cantidad_disponible}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* Préstamo Cliente */}
                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">🔵 P. Cliente</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedItem?.cantidad_en_prestamo_cliente}
                                        {editData.cantidad_en_prestamo_cliente !== (selectedItem?.cantidad_en_prestamo_cliente || 0) && (
                                            <>
                                                {' → '}
                                                <span className={editData.cantidad_en_prestamo_cliente > (selectedItem?.cantidad_en_prestamo_cliente || 0) ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
                                                    {editData.cantidad_en_prestamo_cliente}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* Préstamo Proveedor */}
                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">🟠 P. Prov.</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedItem?.cantidad_en_prestamo_proveedor}
                                        {editData.cantidad_en_prestamo_proveedor !== (selectedItem?.cantidad_en_prestamo_proveedor || 0) && (
                                            <>
                                                {' → '}
                                                <span className={editData.cantidad_en_prestamo_proveedor > (selectedItem?.cantidad_en_prestamo_proveedor || 0) ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}>
                                                    {editData.cantidad_en_prestamo_proveedor}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* Vendida */}
                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">🔴 Vendida</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedItem?.cantidad_vendida}
                                        {editData.cantidad_vendida !== (selectedItem?.cantidad_vendida || 0) && (
                                            <>
                                                {' → '}
                                                <span className={editData.cantidad_vendida > (selectedItem?.cantidad_vendida || 0) ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                                    {editData.cantidad_vendida}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                                <p className="text-xs text-center font-bold text-amber-900 dark:text-amber-200">
                                    ⚪ TOTAL: {selectedItem ? (selectedItem.cantidad_disponible + selectedItem.cantidad_en_prestamo_cliente + selectedItem.cantidad_en_prestamo_proveedor + selectedItem.cantidad_vendida) : 0}
                                    {
                                        (editData.cantidad_disponible + editData.cantidad_en_prestamo_cliente + editData.cantidad_en_prestamo_proveedor + editData.cantidad_vendida) !==
                                        (selectedItem ? (selectedItem.cantidad_disponible + selectedItem.cantidad_en_prestamo_cliente + selectedItem.cantidad_en_prestamo_proveedor + selectedItem.cantidad_vendida) : 0)
                                        && (
                                            <>
                                                {' → '}
                                                <span className={
                                                    (editData.cantidad_disponible + editData.cantidad_en_prestamo_cliente + editData.cantidad_en_prestamo_proveedor + editData.cantidad_vendida) >
                                                    (selectedItem ? (selectedItem.cantidad_disponible + selectedItem.cantidad_en_prestamo_cliente + selectedItem.cantidad_en_prestamo_proveedor + selectedItem.cantidad_vendida) : 0)
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                                }>
                                                    {editData.cantidad_disponible + editData.cantidad_en_prestamo_cliente + editData.cantidad_en_prestamo_proveedor + editData.cantidad_vendida}
                                                </span>
                                            </>
                                        )
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Tabla de Stock Editable - Formato Horizontal */}
                        <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                            <table className="w-full text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                                        <th className="text-center px-1 sm:px-2 py-2 font-semibold text-gray-700 dark:text-gray-300">🟢 Disponible</th>
                                        <th className="text-center px-1 sm:px-2 py-2 font-semibold text-gray-700 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600">🔵 Préstamo Cliente</th>
                                        <th className="text-center px-1 sm:px-2 py-2 font-semibold text-gray-700 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600">🟠 Préstamo Proveedor</th>
                                        <th className="text-center px-1 sm:px-2 py-2 font-semibold text-gray-700 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600">🔴 Vendida</th>
                                        <th className="text-center px-1 sm:px-2 py-2 font-semibold text-gray-700 dark:text-gray-300 border-l border-gray-300 dark:border-gray-600 bg-amber-50 dark:bg-amber-900/20">⚪ TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-200 dark:border-gray-700">
                                        {/* Disponible */}
                                        <td className="px-1 sm:px-2 py-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <input
                                                type="number"
                                                value={editData.cantidad_disponible}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        cantidad_disponible: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-16 sm:w-20 px-2 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>

                                        {/* Préstamo Cliente */}
                                        <td className="px-1 sm:px-2 py-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l border-gray-300 dark:border-gray-600">
                                            <input
                                                type="number"
                                                value={editData.cantidad_en_prestamo_cliente}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        cantidad_en_prestamo_cliente: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-16 sm:w-20 px-2 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>

                                        {/* Préstamo Proveedor */}
                                        <td className="px-1 sm:px-2 py-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l border-gray-300 dark:border-gray-600">
                                            <input
                                                type="number"
                                                value={editData.cantidad_en_prestamo_proveedor}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        cantidad_en_prestamo_proveedor: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-16 sm:w-20 px-2 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>

                                        {/* Vendida */}
                                        <td className="px-1 sm:px-2 py-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l border-gray-300 dark:border-gray-600">
                                            <input
                                                type="number"
                                                value={editData.cantidad_vendida}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        cantidad_vendida: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-16 sm:w-20 px-2 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>

                                        {/* Total (editable - distribuye el cambio al Disponible) */}
                                        <td className="px-1 sm:px-2 py-3 text-center border-l-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                                            <input
                                                type="number"
                                                value={
                                                    editData.cantidad_disponible +
                                                    editData.cantidad_en_prestamo_cliente +
                                                    editData.cantidad_en_prestamo_proveedor +
                                                    editData.cantidad_vendida
                                                }
                                                onChange={(e) => {
                                                    const nuevoTotal = parseInt(e.target.value) || 0;
                                                    const totalActual =
                                                        editData.cantidad_disponible +
                                                        editData.cantidad_en_prestamo_cliente +
                                                        editData.cantidad_en_prestamo_proveedor +
                                                        editData.cantidad_vendida;
                                                    const diferencia = nuevoTotal - totalActual;

                                                    setEditData({
                                                        ...editData,
                                                        cantidad_disponible: editData.cantidad_disponible + diferencia,
                                                    });
                                                }}
                                                className="w-16 sm:w-20 px-2 py-2 text-xs sm:text-sm border-2 border-amber-400 dark:border-amber-600 rounded bg-amber-100 dark:bg-amber-900/30 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-amber-500"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Motivo */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                🏷️ Motivo (Opcional)
                            </label>
                            <input
                                type="text"
                                value={editData.motivo}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        motivo: e.target.value,
                                    })
                                }
                                placeholder="Ej: Discrepancia, Daño, Pérdida, Error de conteo..."
                                className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Comentarios */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                💬 Comentarios (Opcional)
                            </label>
                            <textarea
                                value={editData.comentarios}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        comentarios: e.target.value,
                                    })
                                }
                                placeholder="Detalles adicionales..."
                                rows={2}
                                className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveEdit} className="gap-2 bg-blue-600 hover:bg-blue-700">
                            ✅ Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

