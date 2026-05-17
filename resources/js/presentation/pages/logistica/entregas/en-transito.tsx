import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import {
    Truck,
    MapPin,
    Clock,
    Navigation,
    List,
    Map as MapIcon,
    AlertCircle,
    Wifi,
    WifiOff,
    Loader
} from 'lucide-react';
import { PageHeader } from '@/presentation/components/entrega/PageHeader';
import { EntregaListFilters } from '@/presentation/components/entrega/EntregaListFilters';
import { EntregaEstadoBadge } from '@/presentation/components/entrega/EntregaEstadoBadge';

// Service types (re-exported from domain)
import type { Entrega, FiltrosEntregas } from '@/infrastructure/services/logistica.service';

// Application hooks
import { useEntregasEnTransito } from '@/application/hooks/use-entregas-transito';
import { useRealtimeNotifications } from '@/application/hooks/use-realtime-notifications';
import { useGeolocation } from '@/application/hooks/use-geolocation';

// Components
import LiveTrackingMap from '@/presentation/components/logistica/LiveTrackingMap';
import { TrackingPanel } from '@/presentation/components/logistica/TrackingPanel';

interface Props {
    entregas?: Entrega[];
}

export default function EntregasEnTransito({ entregas: initialEntregas = [] }: Props) {
    // ✅ Encapsulación de lógica de negocio en hooks de Application
    const {
        entregas,
        ubicaciones,
        loading,
        wsConnected,
        filtros,
        setFiltros,
    } = useEntregasEnTransito({
        initialEntregas,
        autoConnect: true,
    });

    // ✅ Notificaciones en tiempo real
    const { unreadCount } = useRealtimeNotifications({ enableAutoNotify: true });

    // ✅ Geolocalización del dispositivo del usuario
    const { location: userLocation, loading: geoLoading, error: geoError } = useGeolocation({
        autoRequest: true,
        enableHighAccuracy: true,
        timeout: 10000,
    });

    // Estado local solo para UI
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEntregaId, setSelectedEntregaId] = useState<number | null>(null);
    const [followingEntregaId, setFollowingEntregaId] = useState<number | null>(null);

    const handleFiltroChange = (key: keyof FiltrosEntregas, value: string) => {
        const nuevosFiltros = { ...filtros, [key]: value || undefined };
        setFiltros(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFiltros({});
        setShowFilters(false);
    };

    return (
        <AppLayout>
            <Head title="Entregas en Tránsito" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <PageHeader
                    title="Entregas en Tránsito"
                    description={
                        <>
                            Seguimiento de entregas en tiempo real
                            {wsConnected && (
                                <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                                    ✓ WebSocket conectado
                                </span>
                            )}
                            {userLocation && (
                                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                    ✓ Ubicación detectada
                                </span>
                            )}
                        </>
                    }
                    actions={
                        <>
                            {geoError && (
                                <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {geoError}
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                title={wsConnected ? 'WebSocket conectado' : 'WebSocket desconectado'}
                            >
                                {wsConnected ? (
                                    <>
                                        <Wifi className="h-4 w-4 text-green-600 animate-pulse" />
                                        En vivo
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-4 w-4 text-red-600" />
                                        Fuera de línea
                                    </>
                                )}
                            </Button>
                            {unreadCount > 0 && (
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        🔔 Notificaciones
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                            {unreadCount}
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </>
                    }
                />

                {/* Filtros */}
                {/* Fase 3.7: Usar hook dinámico en EntregaListFilters para estado options */}
                <EntregaListFilters
                    filtros={filtros}
                    onFiltroChange={handleFiltroChange}
                    onLimpiar={limpiarFiltros}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                />

                {/* Vista Tabs: Mapa y Lista */}
                <Tabs defaultValue="mapa" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="mapa" className="gap-2">
                            <MapIcon className="h-4 w-4" />
                            Mapa
                        </TabsTrigger>
                        <TabsTrigger value="lista" className="gap-2">
                            <List className="h-4 w-4" />
                            Lista
                        </TabsTrigger>
                    </TabsList>

                    {/* Mapa */}
                    <TabsContent value="mapa">
                        <Card>
                            <CardContent className="pt-6 p-0">
                                {geoLoading && !userLocation && (
                                    <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                        <div className="text-center">
                                            <Loader className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-spin" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Obteniendo tu ubicación...
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {!geoLoading && (
                                    <LiveTrackingMap
                                        entregas={entregas}
                                        ubicaciones={ubicaciones}
                                        onMarkerClick={(entregaId) => setSelectedEntregaId(entregaId)}
                                        followingEntregaId={followingEntregaId}
                                        showPolylines={true}
                                        height="600px"
                                        userLocation={userLocation ? {
                                            latitude: userLocation.latitude,
                                            longitude: userLocation.longitude,
                                        } : null}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Lista - TrackingPanel */}
                    <TabsContent value="lista">
                        <TrackingPanel
                            entregas={entregas}
                            ubicaciones={ubicaciones}
                            onEntregaClick={(entregaId) => setSelectedEntregaId(entregaId)}
                            onFollowClick={(entregaId) => setFollowingEntregaId(entregaId)}
                            followingId={followingEntregaId}
                            height="600px"
                        />
                    </TabsContent>
                </Tabs>

            </div>
        </AppLayout>
    );
}
