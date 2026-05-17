import { useEffect, useState } from 'react';
import { dashboard as defaultDashboard } from '@/routes';

/**
 * Hook para obtener la ruta del dashboard correcto según el rol del usuario
 * Consulta al backend qué dashboard debería ver este usuario
 *
 * Uso:
 * const dashboardRoute = useDashboardRoute();
 * <Link href={dashboardRoute}>Dashboard</Link>
 */
export function useDashboardRoute(): string {
    const [route, setRoute] = useState<string>(defaultDashboard());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardRoute = async () => {
            try {
                const response = await fetch('/api/dashboard-redirect', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.warn('Error obteniendo ruta del dashboard, usando default');
                    return;
                }

                const data = await response.json();

                if (data.redirect_url) {
                    setRoute(data.redirect_url);
                }
            } catch (error) {
                console.error('Error al obtener ruta del dashboard:', error);
                // Mantener el default si hay error
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardRoute();
    }, []);

    return route;
}
