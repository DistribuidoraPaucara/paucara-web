import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import {
    RefreshCw,
    Package,
    CheckCircle2,
    Truck,
    MapPin,
    AlertCircle,
    Clock,
    LucideIcon,
} from 'lucide-react';
import type { EntregaEstado } from '@/application/hooks/use-entregas-dashboard-stats';
import { useEstadosEntregas } from '@/application/hooks';

interface DashboardEntregasStatsProps {
    estados: EntregaEstado;
    estadosTotal: number;
    loading: boolean;
    lastUpdate: Date | null;
    onRefresh: () => void;
}

interface EstadoConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    orden: number;
}

// Mapeo de nombres de iconos a componentes de Lucide
const iconoNombreMap: Record<string, LucideIcon> = {
    'hourglass': Clock,
    'assignment': Package,
    'inventory': Package,
    'local-shipping': Truck,
    'check-circle': CheckCircle2,
    'directions-car': Truck,
    'near-me': MapPin,
    'location-on': MapPin,
    'error': AlertCircle,
    'cancel': AlertCircle,
    'ban': AlertCircle,
};

// Helper para obtener el ícono basado en el nombre del icono de BD
const getIconoComponent = (iconoNombre: string | undefined): LucideIcon => {
    if (!iconoNombre) return AlertCircle;
    return iconoNombreMap[iconoNombre.toLowerCase()] || AlertCircle;
};

// Helper para ajustar brillo del color hex
const adjustColorBrightness = (hexColor: string, percent: number): string => {
    const num = parseInt(hexColor.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
};

export function DashboardEntregasStats({
    estados,
    estadosTotal,
    loading,
    lastUpdate,
    onRefresh,
}: DashboardEntregasStatsProps) {
    // Obtener estados centralizados de la BD
    const { estados: estadosAPI } = useEstadosEntregas();

    // Generar configuración dinámica desde el API y ordenar por el campo `orden`
    const estadoConfig = useMemo(() => {
        const config: Record<string, EstadoConfig> = {};

        // Ordenar estados por el campo `orden` de la BD
        const estadosOrdenados = [...estadosAPI].sort((a, b) => a.orden - b.orden);

        estadosOrdenados.forEach(estado => {
            const Icon = getIconoComponent(estado.icono);
            const bgColor = adjustColorBrightness(estado.color, -20); // Oscurecer para fondo

            config[estado.codigo] = {
                label: estado.nombre,
                icon: Icon,
                color: estado.color,
                bgColor: bgColor,
                orden: estado.orden,
            };
        });

        return config;
    }, [estadosAPI]);

    // Convertir a array y ordenar por el campo orden
    const estadoEntries = useMemo(() => {
        return Object.entries(estados)
            .filter(([codigo]) => codigo in estadoConfig) // Solo mostrar estados que están en config
            .map(([codigo, cantidad]) => ({
                codigo,
                cantidad,
                orden: estadoConfig[codigo]?.orden || 999,
            }))
            .sort((a, b) => a.orden - b.orden);
    }, [estados, estadoConfig]);

    return (
        <>
            {/* Header con refresh */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Estadísticas de Entregas</h2>
                <div className="flex items-center gap-2">
                    {lastUpdate && (
                        <span className="text-xs text-muted-foreground">
                            Actualizado: {lastUpdate.toLocaleTimeString()}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                        />
                    </Button>
                </div>
            </div>

            {/* Cards de estados */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
                {estadoEntries.map(({ codigo, cantidad }) => {
                    const config = estadoConfig[codigo];

                    if (!config) {
                        return null;
                    }

                    const IconComponent = config.icon;
                    const porcentaje = Math.round((cantidad / (estadosTotal || 1)) * 100);

                    return (
                        <Card
                            key={codigo}
                            className="border transition-all hover:shadow-md"
                            style={{
                                backgroundColor: `${config.bgColor}20`, // Agregar transparencia
                                borderColor: config.color,
                                borderWidth: '1px',
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium">
                                    {config.label}
                                </CardTitle>
                                <IconComponent
                                    className="h-4 w-4"
                                    style={{ color: config.color }}
                                />
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: config.color }}
                                >
                                    {loading ? '...' : cantidad}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {porcentaje}% del total
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Card de total */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Total de Entregas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {loading ? '...' : estadosTotal}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Distribución completa de entregas por estado
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
