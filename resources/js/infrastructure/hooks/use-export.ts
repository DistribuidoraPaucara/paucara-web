// hooks/use-export.ts
import { useState, useCallback } from 'react';
import { exportService } from '@/infrastructure/services/export.service';
import type { ExportData, ExportOptions, ExportFormat } from '@/domain/entities/export';

export const useExport = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportData = useCallback(async (
        data: ExportData,
        options: Partial<ExportOptions> = {},
        format: ExportFormat = 'pdf'
    ) => {
        setIsExporting(true);
        setError(null);

        try {
            const exportOptions: ExportOptions = {
                format,
                filename: options.filename || `export_${new Date().toISOString().split('T')[0]}`,
                title: options.title,
                includeHeader: options.includeHeader ?? true,
                includeFooter: options.includeFooter ?? true,
                orientation: options.orientation || 'portrait',
                pageSize: options.pageSize || 'a4',
                customStyles: options.customStyles
            };

            await exportService.export(data, exportOptions);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al exportar';
            setError(errorMessage);
            throw err;
        } finally {
            setIsExporting(false);
        }
    }, []);

    const exportToPDF = useCallback(async (
        data: ExportData,
        options: Partial<ExportOptions> = {}
    ) => {
        return exportData(data, options, 'pdf');
    }, [exportData]);

    const exportToExcel = useCallback(async (
        data: ExportData,
        options: Partial<ExportOptions> = {}
    ) => {
        return exportData(data, options, 'excel');
    }, [exportData]);

    const exportToCSV = useCallback(async (
        data: ExportData,
        options: Partial<ExportOptions> = {}
    ) => {
        return exportData(data, options, 'csv');
    }, [exportData]);

    const exportFromHTML = useCallback(async (
        elementId: string,
        options: ExportOptions
    ) => {
        setIsExporting(true);
        setError(null);

        try {
            await exportService.exportFromHTML(elementId, options);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al exportar desde HTML';
            setError(errorMessage);
            throw err;
        } finally {
            setIsExporting(false);
        }
    }, []);

    const print = useCallback(async (
        elementId?: string,
        options: Partial<ExportOptions> = {}
    ) => {
        setIsExporting(true);
        setError(null);

        try {
            if (elementId) {
                await exportService.print(elementId, options);
            } else {
                // Imprimir página completa
                window.print();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al imprimir';
            setError(errorMessage);
            throw err;
        } finally {
            setIsExporting(false);
        }
    }, []);

    return {
        isExporting,
        error,
        exportData,
        exportToPDF,
        exportToExcel,
        exportToCSV,
        exportFromHTML,
        print,
        clearError: () => setError(null)
    };
};
