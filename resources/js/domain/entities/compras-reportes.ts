/**
 * Domain: Reportes de Compras
 *
 * Entidades de dominio para reportes y análisis de compras
 * Single source of truth para datos de reportes
 */

import type { Id } from './shared';
import type { Proveedor } from './proveedores';

/**
 * Resumen de compras para un período específico
 */
export interface ResumenComprasPorPeriodo {
    periodo: string;
    total_compras: number;
    cantidad_compras: number;
    promedio_compra: number;
    variacion_anterior: number;
}

/**
 * Análisis de compras agrupadas por proveedor
 */
export interface ComprasPorProveedor {
    proveedor: Proveedor;
    total_compras: number;
    cantidad_compras: number;
    promedio_compra: number;
    porcentaje_total: number;
    ultima_compra: string;
}

/**
 * Análisis de compras agrupadas por categoría
 */
export interface ComprasPorCategoria {
    categoria: string;
    total_compras: number;
    cantidad_compras: number;
    porcentaje_total: number;
}

/**
 * Estadísticas generales del período reportado
 */
export interface EstadisticasGenerales {
    total_compras_periodo: number;
    cantidad_compras_periodo: number;
    promedio_compra_periodo: number;
    variacion_mes_anterior: number;
    proveedor_principal: Proveedor;
    categoria_principal: string;
    mes_mayor_compra: string;
}

/**
 * Tendencias mensuales de compras
 */
export interface TendenciasCompras {
    mes: string;
    total: number;
    cantidad: number;
    promedio: number;
}

/**
 * Filtros aplicables a los reportes de compras
 */
export interface FiltrosReportesCompras {
    fecha_inicio?: string;
    fecha_fin?: string;
    proveedor_id?: string;
    moneda_id?: string;
    tipo_reporte?: string;
}

/**
 * Props de la página de reportes de compras
 * (Server-side rendered data)
 */
export interface ReportesComprasPageProps {
    estadisticas_generales: EstadisticasGenerales;
    resumen_por_periodo: ResumenComprasPorPeriodo[];
    compras_por_proveedor: ComprasPorProveedor[];
    compras_por_categoria: ComprasPorCategoria[];
    tendencias_mensuales: TendenciasCompras[];
    proveedores: Proveedor[];
    monedas: Array<{
        id: Id;
        nombre: string;
        codigo: string;
    }>;
    filtros: FiltrosReportesCompras;
}

/**
 * Formato de exportación soportado
 */
export type FormatoExportacion = 'pdf' | 'excel';

/**
 * Estado de carga del reporte
 */
export interface EstadoCargaReporte {
    cargando: boolean;
    error?: string;
}
