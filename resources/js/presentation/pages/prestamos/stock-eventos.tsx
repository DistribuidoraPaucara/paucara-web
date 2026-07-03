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
    cantidad_cliente_deudor?: number;
    cantidad_cliente_devuelto?: number;
    cantidad_cliente_dañada?: number;
    cantidad_cliente_total?: number;
    cantidad_evento_deudor: number;
    cantidad_evento_devuelto: number;
    cantidad_evento_dañada: number;
    cantidad_evento_total: number;
    cantidad_con_liquido: number;
    cantidad_total: number;
    almacenes_prestables_id: number;
}

interface StockItemWithGroupIndex extends StockItem {
    isEmbaseRelacionado?: boolean;
    canastillaId?: number;
    groupIndex?: number;
}

interface ResumenTipo {
    disponible: number;
    deudor: number;
    dañada: number;
    total: number;
}

interface StockPageProps {
    items: StockItem[];
    resumen: {
        clientes: {
            total: ResumenTipo;
            canastillas: ResumenTipo;
            embases: ResumenTipo;
        };
        eventos: {
            total: ResumenTipo;
            canastillas: ResumenTipo;
            embases: ResumenTipo;
        };
    };
    almacenes: Array<{ id: number; nombre: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Préstamos',
        href: '/prestamos/stock/eventos',
    },
    {
        title: 'Stock Eventos',
        href: '/prestamos/stock/eventos',
    },
];

export default function StockEventosPage({
    items: initialItems,
    resumen,
    almacenes,
}: StockPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [almacenFilter, setAlmacenFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<'nombre' | 'disponible' | 'prestamo'>('nombre');

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

    // Función para agrupar embases con sus canastillas usando prestable_relacionado_id
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
        // DEBUG: Ver datos del backend
        console.log('📊 DEBUG stock-eventos - Items recibidos:', {
            total: initialItems.length,
            canastillas: initialItems.filter(i => i.prestable_tipo === 'CANASTILLA').map(i => ({
                id: i.prestable_id,
                nombre: i.prestable_nombre,
                embase_asociado_id: i.embase_asociado_id,
            })),
            embases: initialItems.filter(i => i.prestable_tipo === 'EMBASES').map(i => ({
                id: i.prestable_id,
                nombre: i.prestable_nombre,
                prestable_relacionado_id: i.prestable_relacionado_id,
                embase_asociado_id: i.embase_asociado_id,
            })),
        });

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
                        return b.cantidad_evento_total - a.cantidad_evento_total;
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
        const headers = ['Código', 'Nombre', 'Almacén', 'Disponible', 'Con Líquido', 'Deudor (Activo)', 'Devuelto', 'Dañada', 'Total Préstamo Evento', 'Total General'];
        const rows = filteredItems.map((item) => [
            item.prestable_codigo,
            item.prestable_nombre,
            item.almacen_nombre,
            item.cantidad_disponible,
            item.cantidad_con_liquido,
            item.cantidad_evento_deudor,
            item.cantidad_evento_devuelto,
            item.cantidad_evento_dañada,
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
        link.download = `stock-eventos-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Eventos" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            📦 Stock de Eventos
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Visualiza la distribución de stock: disponible, préstamos y deuda
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="gap-2"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Actualizar
                        </Button> */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="gap-2"
                        >
                            <Download size={16} />
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                {/* Resumen de Totales - Card Contenedor */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                    {/* <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">📊 Resumen de Stock</h2> */}

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                        {/* Totales Clientes */}
                        <div className="space-y-2">
                            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                👥 Totales Préstamos Clientes
                            </h2>

                            {/* Canastillas + Embases lado a lado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                {/* Canastillas */}
                                <div className="rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10 p-3">
                                    <h3 className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">📦 Canastillas</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Disponible</span>
                                            <span className="font-bold text-sm text-green-700 dark:text-green-300">{resumen.clientes.canastillas.disponible.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Préstado</span>
                                            <span className="font-bold text-sm text-red-700 dark:text-red-300">{resumen.clientes.canastillas.deudor.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Dañada</span>
                                            <span className="font-bold text-sm text-orange-700 dark:text-orange-300">{resumen.clientes.canastillas.dañada.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-red-200 dark:border-red-700">
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total</span>
                                            <span className="font-bold text-base text-violet-700 dark:text-violet-300">{resumen.clientes.canastillas.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Embases */}
                                <div className="rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-3">
                                    <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">🔖 Embases</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Disponible</span>
                                            <span className="font-bold text-sm text-green-700 dark:text-green-300">{resumen.clientes.embases.disponible.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Préstado</span>
                                            <span className="font-bold text-sm text-red-700 dark:text-red-300">{resumen.clientes.embases.deudor.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Dañada</span>
                                            <span className="font-bold text-sm text-orange-700 dark:text-orange-300">{resumen.clientes.embases.dañada.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-blue-200 dark:border-blue-700">
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total</span>
                                            <span className="font-bold text-base text-violet-700 dark:text-violet-300">{resumen.clientes.embases.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Totales Eventos */}
                        <div className="space-y-2">
                            {/* <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                🎉 Totales Préstamos Eventos
                            </h2> */}

                            {/* Canastillas + Embases lado a lado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                {/* Canastillas */}
                                {/* <div className="rounded-lg border border-cyan-200 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/10 p-3">
                                    <h3 className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 mb-2">📦 Canastillas</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Disponible</span>
                                            <span className="font-bold text-sm text-green-700 dark:text-green-300">{resumen.eventos.canastillas.disponible.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Préstado</span>
                                            <span className="font-bold text-sm text-cyan-700 dark:text-cyan-300">{resumen.eventos.canastillas.deudor.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Dañada</span>
                                            <span className="font-bold text-sm text-pink-700 dark:text-pink-300">{resumen.eventos.canastillas.dañada.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-cyan-200 dark:border-cyan-700">
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total</span>
                                            <span className="font-bold text-base text-blue-700 dark:text-blue-300">{resumen.eventos.canastillas.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Embases */}
                                {/* <div className="rounded-lg border border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/10 p-3">
                                    <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-2">🔖 Embases</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Disponible</span>
                                            <span className="font-bold text-sm text-green-700 dark:text-green-300">{resumen.eventos.embases.disponible.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Préstado</span>
                                            <span className="font-bold text-sm text-cyan-700 dark:text-cyan-300">{resumen.eventos.embases.deudor.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Dañada</span>
                                            <span className="font-bold text-sm text-pink-700 dark:text-pink-300">{resumen.eventos.embases.dañada.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-teal-200 dark:border-teal-700">
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total</span>
                                            <span className="font-bold text-base text-blue-700 dark:text-blue-300">{resumen.eventos.embases.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
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
                            Filtrar por almacén
                        </label>
                        <Select value={almacenFilter} onValueChange={setAlmacenFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los almacenes</SelectItem>
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
                            Filtrar por tipo
                        </label>
                        <Select value={tipoFilter} onValueChange={setTipoFilter}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="CANASTILLA">📦 Canastilla</SelectItem>
                                <SelectItem value="EMBASES">🔖 Embase</SelectItem>
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
                                    <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        🏷️ Tipo
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                        Almacén
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        Disponible
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200">
                                        💧 Con Líquido
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        Prestado (Activo)
                                    </th>
                                    {/* <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        Devuelto
                                    </th> */}
                                    <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                        🔴 Dañada
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
                                                        className={`border-b border-slate-200 dark:border-slate-700 ${isEmbaseRelacionado
                                                            ? 'bg-slate-50 dark:bg-slate-800/50'
                                                            : getRowColor(item.prestable_tipo)
                                                            } transition-colors`}
                                                    >
                                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
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
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.prestable_tipo === 'EMBASES' || item.prestable_tipo === 'EMBASE'
                                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                                                                }`}>
                                                                {item.prestable_tipo === 'EMBASES' || item.prestable_tipo === 'EMBASE' ? '🔖 Embase' : '📦 Canastilla'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                            {item.almacen_nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 font-semibold">
                                                                {item.cantidad_disponible}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center bg-green-50 dark:bg-green-900/10">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-200 font-semibold">
                                                                {item.cantidad_con_liquido}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 font-semibold">
                                                                {item.cantidad_evento_deudor}
                                                            </span>
                                                        </td>
                                                        {/* <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-900 dark:text-teal-200 font-semibold">
                                                                {item.cantidad_evento_devuelto}
                                                            </span>
                                                        </td> */}
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 font-semibold">
                                                                {item.cantidad_evento_dañada}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.visit(`/prestamos/stock/eventos/ajuste/${item.prestable_id}/${item.almacenes_prestables_id}`)}
                                                                className="gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                                            >
                                                                Ajustar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    {debeAgregarSeparador && (
                                                        <tr className="border-b-2 border-slate-300 dark:border-slate-600 h-1 bg-slate-100 dark:bg-slate-800">
                                                            <td colSpan={9} className="px-0 py-0"></td>
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
        </AppLayout>
    );
}
