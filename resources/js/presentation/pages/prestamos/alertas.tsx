import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { AlertCircle, Clock, CheckCircle2, Search, RefreshCw, Filter } from 'lucide-react';
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
    UrgencyBadge,
    EstadoBadge,
    VencimientoIndicator,
} from '@/presentation/components/prestamos';

interface Alerta {
    id: number;
    tipo: 'cliente' | 'proveedor';
    nombre: string;
    razon_social?: string;
    prestable_nombre?: string;
    cantidad_pendiente: number;
    fecha_esperada_devolucion: string;
    dias_vencidos: number;
    estado: 'ACTIVO' | 'PARCIALMENTE_DEVUELTO' | 'COMPLETAMENTE_DEVUELTO' | 'CANCELADO';
    chofer?: string;
    urgencia: 'critico' | 'urgente' | 'vencido' | 'normal';
}

interface AlertasPageProps {
    alertas: Alerta[];
    resumen: {
        total_alertas: number;
        criticas: number;
        urgentes: number;
        vencidas: number;
        normales: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Préstamos',
        href: '/prestamos',
    },
    {
        title: 'Alertas',
        href: '#',
    },
];

type TabType = 'all' | 'critico' | 'urgente' | 'vencido' | 'normal';

export default function AlertasPage({
    alertas: initialAlertas,
    resumen,
}: AlertasPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [loading, setLoading] = useState(false);
    const [tipoFilter, setTipoFilter] = useState<'all' | 'cliente' | 'proveedor'>('all');

    // Filtrado
    const filteredAlertas = useMemo(() => {
        let filtered = initialAlertas;

        // Filtro por tab
        if (activeTab !== 'all') {
            filtered = filtered.filter((alerta) => alerta.urgencia === activeTab);
        }

        // Filtro por tipo
        if (tipoFilter !== 'all') {
            filtered = filtered.filter((alerta) => alerta.tipo === tipoFilter);
        }

        // Búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (alerta) =>
                    alerta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    alerta.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    alerta.prestable_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenar por urgencia
        const urgencyOrder = { critico: 0, urgente: 1, vencido: 2, normal: 3 };
        filtered.sort((a, b) => urgencyOrder[a.urgencia] - urgencyOrder[b.urgencia]);

        return filtered;
    }, [initialAlertas, activeTab, tipoFilter, searchTerm]);

    const handleRefresh = () => {
        setLoading(true);
        router.reload({
            onFinish: () => setLoading(false),
        });
    };

    const tabs = [
        {
            id: 'all' as const,
            label: 'Todas',
            icon: AlertCircle,
            count: resumen.total_alertas,
        },
        {
            id: 'critico' as const,
            label: 'Críticas',
            icon: AlertCircle,
            count: resumen.criticas,
            color: 'text-red-600 dark:text-red-400',
        },
        {
            id: 'urgente' as const,
            label: 'Urgentes',
            icon: Clock,
            count: resumen.urgentes,
            color: 'text-orange-600 dark:text-orange-400',
        },
        {
            id: 'vencido' as const,
            label: 'Vencidas',
            icon: AlertCircle,
            count: resumen.vencidas,
            color: 'text-yellow-600 dark:text-yellow-400',
        },
        {
            id: 'normal' as const,
            label: 'Normales',
            icon: CheckCircle2,
            count: resumen.normales,
            color: 'text-green-600 dark:text-green-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alertas - Préstamos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Alertas de Préstamos
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Gestiona devoluciones vencidas y próximas a vencer
                        </p>
                    </div>
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

                {/* Tabs de Urgencia */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 -mb-px">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                                    isActive
                                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${tab.color || ''}`} />
                                {tab.label}
                                <span
                                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        isActive
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Search className="h-4 w-4 inline mr-2" />
                            Buscar
                        </label>
                        <Input
                            placeholder="Por nombre, razón social o prestable..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Filter className="h-4 w-4 inline mr-2" />
                            Tipo
                        </label>
                        <Select
                            value={tipoFilter}
                            onValueChange={(v: any) => setTipoFilter(v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="cliente">Clientes</SelectItem>
                                <SelectItem value="proveedor">Proveedores</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Alertas Grid */}
                <div className="space-y-4">
                    {filteredAlertas.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                ✅ No hay alertas
                            </p>
                            <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                                Todos los préstamos están al día
                            </p>
                        </div>
                    ) : (
                        filteredAlertas.map((alerta) => (
                            <div
                                key={`${alerta.tipo}-${alerta.id}`}
                                className={`p-5 rounded-lg border-2 transition-all ${
                                    alerta.urgencia === 'critico'
                                        ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                                        : alerta.urgencia === 'urgente'
                                        ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10'
                                        : alerta.urgencia === 'vencido'
                                        ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10'
                                        : 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    {/* Info Izquierda */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                                    alerta.urgencia === 'critico'
                                                        ? 'bg-red-600'
                                                        : alerta.urgencia === 'urgente'
                                                        ? 'bg-orange-600'
                                                        : alerta.urgencia === 'vencido'
                                                        ? 'bg-yellow-600'
                                                        : 'bg-green-600'
                                                }`}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                                                    {alerta.nombre}
                                                </h3>
                                                {alerta.razon_social && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        {alerta.razon_social}
                                                    </p>
                                                )}
                                                {alerta.prestable_nombre && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        📦 {alerta.prestable_nombre}
                                                    </p>
                                                )}
                                                {alerta.chofer && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        🚚 Chofer: {alerta.chofer}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm">
                                                <span className="font-semibold">
                                                    {alerta.cantidad_pendiente}
                                                </span>
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    pendientes
                                                </span>
                                            </div>
                                            <EstadoBadge
                                                estado={alerta.estado}
                                                size="sm"
                                                variant="inline"
                                            />
                                        </div>
                                    </div>

                                    {/* Info Derecha */}
                                    <div className="sm:text-right space-y-2">
                                        <div className="flex sm:flex-col-reverse gap-2">
                                            <VencimientoIndicator
                                                fechaEsperada={alerta.fecha_esperada_devolucion}
                                                showLabel={true}
                                                size="sm"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <UrgencyBadge
                                                diasVencidos={alerta.dias_vencidos}
                                                size="md"
                                                variant="badge"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600 flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="default"
                                        className="gap-2"
                                    >
                                        Registrar Devolución
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        Ver Detalles
                                    </Button>
                                    {alerta.tipo === 'cliente' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            Contactar Cliente
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Stats */}
                {filteredAlertas.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
                                Críticas
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-200 mt-1">
                                {filteredAlertas.filter((a) => a.urgencia === 'critico').length}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase">
                                Urgentes
                            </p>
                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-200 mt-1">
                                {filteredAlertas.filter((a) => a.urgencia === 'urgente').length}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase">
                                Vencidas
                            </p>
                            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200 mt-1">
                                {filteredAlertas.filter((a) => a.urgencia === 'vencido').length}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">
                                Normales
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                                {filteredAlertas.filter((a) => a.urgencia === 'normal').length}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
