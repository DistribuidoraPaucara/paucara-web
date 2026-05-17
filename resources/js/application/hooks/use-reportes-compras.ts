/**
 * Application Layer Hook: useReportesCompras
 *
 * Encapsula la lógica de negocio para reportes de compras:
 * - Manejo de filtros
 * - Exportación de reportes
 * - Navegación
 */

import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import type { FiltrosReportesCompras, FormatoExportacion } from '@/domain/entities/compras-reportes';
import { construirUrlFiltros, esRangoFechasValido } from '@/lib/compras.utils';

interface UseReportesComprasReturn {
    filtroLocal: FiltrosReportesCompras;
    setFiltroLocal: (filtros: FiltrosReportesCompras) => void;
    actualizarFiltro: (key: keyof FiltrosReportesCompras, value: string) => void;
    cargando: boolean;
    error: string | null;
    aplicarFiltros: () => void;
    exportarReporte: (formato: FormatoExportacion) => void;
    limpiarFiltros: () => void;
}

/**
 * Hook para manejar lógica de reportes de compras
 *
 * Encapsula:
 * - Estado de filtros
 * - Aplicación de filtros con navegación Inertia
 * - Exportación de reportes
 * - Validación de datos
 */
export const useReportesCompras = (
    filtrosIniciales: FiltrosReportesCompras = {}
): UseReportesComprasReturn => {
    const [filtroLocal, setFiltroLocal] = useState<FiltrosReportesCompras>(filtrosIniciales);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Actualiza un filtro individual
     */
    const actualizarFiltro = useCallback(
        (key: keyof FiltrosReportesCompras, value: string) => {
            setFiltroLocal((prev) => ({
                ...prev,
                [key]: value === 'all' || value === '' ? undefined : value,
            }));
        },
        []
    );

    /**
     * Aplica los filtros y navega usando Inertia router
     */
    const aplicarFiltros = useCallback(() => {
        // Validar rango de fechas
        if (
            filtroLocal.fecha_inicio &&
            filtroLocal.fecha_fin &&
            !esRangoFechasValido(filtroLocal.fecha_inicio, filtroLocal.fecha_fin)
        ) {
            setError('La fecha de inicio debe ser anterior a la fecha de fin');
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const queryString = construirUrlFiltros(filtroLocal);
            const url = queryString ? `/compras/reportes?${queryString}` : '/compras/reportes';

            router.visit(url, {
                method: 'get',
                preserveScroll: true,
                onFinish: () => {
                    setCargando(false);
                },
                onError: () => {
                    setCargando(false);
                    setError('Error al cargar el reporte');
                },
            });
        } catch (err) {
            setCargando(false);
            setError('Error procesando los filtros');
        }
    }, [filtroLocal]);

    /**
     * Exporta el reporte en el formato especificado
     */
    const exportarReporte = useCallback(
        async (formato: FormatoExportacion) => {
            // Validar rango de fechas
            if (
                filtroLocal.fecha_inicio &&
                filtroLocal.fecha_fin &&
                !esRangoFechasValido(filtroLocal.fecha_inicio, filtroLocal.fecha_fin)
            ) {
                setError('La fecha de inicio debe ser anterior a la fecha de fin');
                return;
            }

            setCargando(true);
            setError(null);

            try {
                const queryString = construirUrlFiltros(filtroLocal);

                // Determinar ruta según formato
                const endpoint = formato === 'pdf'
                    ? `/compras/reportes/export-pdf?${queryString}`
                    : `/compras/reportes/export?${queryString}`;

                // Usar fetch en lugar de Inertia router para descargas
                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                // Determinar nombre y tipo de archivo
                const timestamp = new Date().toISOString().split('T')[0];
                if (formato === 'pdf') {
                    link.download = `reporte-compras-${timestamp}.pdf`;
                } else {
                    link.download = `reporte-compras-${timestamp}.xlsx`;
                }

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                setCargando(false);
            } catch (err) {
                setCargando(false);
                setError('Error al exportar el reporte');
                console.error('Error en exportación:', err);
            }
        },
        [filtroLocal]
    );

    /**
     * Limpia todos los filtros
     */
    const limpiarFiltros = useCallback(() => {
        setFiltroLocal({});
        setError(null);
        router.visit('/compras/reportes', {
            method: 'get',
            preserveScroll: true,
        });
    }, []);

    return {
        filtroLocal,
        setFiltroLocal,
        actualizarFiltro,
        cargando,
        error,
        aplicarFiltros,
        exportarReporte,
        limpiarFiltros,
    };
};
