/**
 * Hook: Manejo de Movimientos de Inventario
 *
 * Responsabilidades:
 * - Encapsular lógica de servicio
 * - Manejar navegación
 * - Proporcionar callbacks para acciones del usuario
 */

import { useCallback } from 'react';
import { MovimientosInventarioService } from '@/infrastructure/services/movimientos-inventario.service';

interface UseMovimientosInventarioReturn {
    handleCreateAjuste: () => void;
    handleGoToReportes: () => void;
}

export function useMovimientosInventario(): UseMovimientosInventarioReturn {
    const service = new MovimientosInventarioService();

    // ✅ Navegar a crear ajuste
    const handleCreateAjuste = useCallback(() => {
        service.goToCreate();
    }, []);

    // ✅ Navegar a reportes
    const handleGoToReportes = useCallback(() => {
        service.goToReportes();
    }, []);

    return {
        handleCreateAjuste,
        handleGoToReportes,
    };
}
