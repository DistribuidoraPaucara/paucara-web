import { Head } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import type { Entrega } from '@/domain/entities/entregas';
import type { Pagination } from '@/domain/entities/shared';
import { useState } from 'react';

// Componentes unificados
import { EntregasHeader } from './components/EntregasHeader';
import { EntregasTableView } from './components/EntregasTableView';
import { EntregasDashboardView } from './components/EntregasDashboardView';

interface Props extends PageProps {
    entregas: Pagination<Entrega>;
    filtros?: {
        estado?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        search?: string;
        view?: 'simple' | 'dashboard';
    };
    vehiculos?: Array<{ id: number; placa: string; marca: string; modelo: string; capacidad_kg: number }>;
    choferes?: Array<{ id: number; nombre: string }>;
    localidades?: Array<{ id: number; nombre: string; codigo: string }>;
    estadosLogisticos?: Array<{ id: number; codigo: string; nombre: string; color?: string; icono?: string }>;
}

/**
 * Página unificada de entregas con toggle entre vista simple y dashboard
 *
 * FUNCIONALIDADES:
 * ✅ Vista simple: tabla de entregas con filtros y batch actions
 * ✅ Vista dashboard: estadísticas y gráficos en tiempo real
 * ✅ Cambio instantáneo sin recargar página
 * ✅ URL persistence: ?view=simple|dashboard
 * ✅ Lazy load: stats solo se cargan en vista dashboard
 * ✅ Filtros compartidos entre vistas
 */
export default function EntregasIndex({ entregas, filtros, vehiculos = [], choferes = [], localidades = [], estadosLogisticos = [] }: Props) {
    // Estado de vista (inicializado desde filtros o 'simple' por defecto)
    const [view, setView] = useState<'simple' | 'dashboard'>(
        (filtros?.view as 'simple' | 'dashboard') || 'simple'
    );

    // Sincronizar vista con URL
    const handleChangeView = (newView: 'simple' | 'dashboard') => {
        setView(newView);

        // Actualizar URL sin recargar página
        const url = new URL(window.location.href);
        url.searchParams.set('view', newView);
        window.history.pushState({}, '', url);
    };

    return (
        <AppLayout>
            <Head title={view === 'simple' ? 'Entregas' : 'Dashboard de Entregas'} />

            <div className="space-y-6 p-4">
                {/* Header con toggle */}
                <EntregasHeader
                    view={view}
                    onChangeView={handleChangeView}
                />

                {/* Contenido condicional según vista */}
                {view === 'simple' ? (
                    <EntregasTableView
                        entregas={entregas}
                        vehiculos={vehiculos}
                        choferes={choferes}
                        localidades={localidades}
                        estadosLogisticos={estadosLogisticos}
                    />
                ) : (
                    <EntregasDashboardView
                        autoRefresh={view === 'dashboard'} // Solo refrescar si está activa
                    />
                )}
            </div>
        </AppLayout>
    );
}
