/**
 * Application Layer Hook: useEntregas
 *
 * Maneja la lógica de negocio para la gestión de entregas
 * Incluye navegación, filtrado y acciones comunes
 *
 * MIGRATED FROM: use-envios.ts
 */

import { router } from '@inertiajs/react';
import type { Id } from '@/domain/entities/shared';

interface UseEntregasReturn {
    handleVerEntrega: (entregaId: Id) => void;
    handlePaginaAnterior: (currentPage: number) => void;
    handlePaginaSiguiente: (currentPage: number) => void;
    handleCrearEntrega: () => void;
}

/**
 * Hook para manejo de entregas
 * Encapsula la lógica de navegación y acciones
 */
export const useEntregas = (): UseEntregasReturn => {
    /**
     * Navegar a detalle de entrega
     */
    const handleVerEntrega = (entregaId: Id) => {
        router.visit(`/logistica/entregas/${entregaId}`, { method: 'get' });
    };

    /**
     * Navegar a página anterior
     */
    const handlePaginaAnterior = (currentPage: number) => {
        router.get(`/logistica/entregas?page=${currentPage - 1}`, {}, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Navegar a página siguiente
     */
    const handlePaginaSiguiente = (currentPage: number) => {
        router.get(`/logistica/entregas?page=${currentPage + 1}`, {}, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Navegar a crear entrega
     */
    const handleCrearEntrega = () => {
        router.visit('/logistica/entregas/create', { method: 'get' });
    };

    return {
        handleVerEntrega,
        handlePaginaAnterior,
        handlePaginaSiguiente,
        handleCrearEntrega,
    };
};
