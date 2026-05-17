// lib/export-helpers.ts
import { formatCurrency } from '@/lib/utils';
import type { ExportData, ExportOptions } from '@/domain/entities/export';
import type { Compra } from '@/domain/entities/compras';

/**
 * Convierte los datos de una compra al formato de exportación
 */
export const compraToExportData = (compra: Compra): ExportData => {
    const headers = [
        'Producto',
        'Código',
        'Cantidad',
        'Precio Unitario',
        'Subtotal',
        'Lote',
        'Fecha Vencimiento'
    ];

    const rows = (compra.detalles || []).map(detalle => [
        detalle.producto.nombre,
        detalle.producto.codigo || '',
        detalle.cantidad.toString(),
        formatCurrency(Number(detalle.precio_unitario), compra.moneda?.simbolo || '$'),
        formatCurrency(Number(detalle.subtotal), compra.moneda?.simbolo || '$'),
        detalle.lote || '',
        detalle.fecha_vencimiento
            ? new Date(detalle.fecha_vencimiento).toLocaleDateString('es-ES')
            : ''
    ]);

    return {
        headers,
        rows,
        metadata: {
            title: `Compra ${compra.numero}`,
            subtitle: `Proveedor: ${compra.proveedor?.nombre || 'No especificado'}`,
            generatedAt: new Date(),
            generatedBy: compra.usuario?.name || 'Sistema',
            filters: {
                fecha: new Date(compra.fecha).toLocaleDateString('es-ES'),
                estado: compra.estado_documento?.nombre || 'Sin estado',
                moneda: compra.moneda?.codigo || 'No especificada'
            }
        }
    };
};

/**
 * Opciones por defecto para exportar compras
 */
export const getDefaultCompraExportOptions = (compra: Compra): ExportOptions => ({
    format: 'pdf',
    filename: `compra_${compra.numero}_${new Date().toISOString().split('T')[0]}`,
    title: `Compra ${compra.numero}`,
    includeHeader: true,
    includeFooter: true,
    orientation: 'portrait',
    pageSize: 'a4'
});

/**
 * Convierte datos genéricos de tabla al formato de exportación
 */
export const tableDataToExportData = (
    headers: string[],
    rows: (string | number | Date)[][],
    metadata?: ExportData['metadata']
): ExportData => ({
    headers,
    rows,
    metadata
});

/**
 * Helper para crear opciones de exportación personalizadas
 */
export const createExportOptions = (
    format: ExportOptions['format'],
    filename: string,
    overrides: Partial<ExportOptions> = {}
): ExportOptions => ({
    format,
    filename,
    includeHeader: true,
    includeFooter: true,
    orientation: 'portrait',
    pageSize: 'a4',
    ...overrides
});
