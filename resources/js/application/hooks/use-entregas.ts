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
    handleIrAPagina: (pageNumber: number) => void;
    handleCrearEntrega: () => void;
}

/**
 * Hook para manejo de entregas
 * Encapsula la lógica de navegación y acciones
 */
export const useEntregas = (): UseEntregasReturn => {
    /**
     * Obtener parámetros actuales de la URL
     */
    const obtenerParametrosActuales = (): string => {
        if (typeof window === 'undefined') return '';
        const searchParams = new URLSearchParams(window.location.search);
        // Remover el parámetro 'page' para que sea reemplazado
        searchParams.delete('page');
        return searchParams.toString();
    };

    /**
     * Construir URL con parámetros preservados
     */
    const construirUrlConParametros = (pageNumber: number): string => {
        const params = obtenerParametrosActuales();
        const pageParam = `page=${pageNumber}`;
        return params ? `/logistica/entregas?${params}&${pageParam}` : `/logistica/entregas?${pageParam}`;
    };

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
        if (currentPage <= 1) return;
        router.get(construirUrlConParametros(currentPage - 1), {}, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Navegar a página siguiente
     */
    const handlePaginaSiguiente = (currentPage: number) => {
        router.get(construirUrlConParametros(currentPage + 1), {}, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * ✅ NUEVO: Navegar a página específica
     */
    const handleIrAPagina = (pageNumber: number) => {
        if (pageNumber < 1) return;
        router.get(construirUrlConParametros(pageNumber), {}, {
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
        handleIrAPagina,
        handleCrearEntrega,
    };
};
