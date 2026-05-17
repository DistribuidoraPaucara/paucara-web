// components/Export/ExportButtons.tsx
import React from 'react';
import { Download, Printer, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { exportService } from '@/infrastructure/services/export.service';
import type { ExportData, ExportOptions, ExportFormat } from '@/domain/entities/export';

interface ExportButtonsProps {
    data: ExportData;
    options?: Partial<ExportOptions>;
    className?: string;
    showPrint?: boolean;
    showPDF?: boolean;
    showExcel?: boolean;
    showCSV?: boolean;
    disabled?: boolean;
    onExportStart?: () => void;
    onExportEnd?: () => void;
    onExportError?: (error: Error) => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
    data,
    options = {},
    className = '',
    showPrint = true,
    showPDF = true,
    showExcel = true,
    showCSV = true,
    disabled = false,
    onExportStart,
    onExportEnd,
    onExportError
}) => {
    const handleExport = async (format: ExportFormat) => {
        try {
            onExportStart?.();

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
            onExportEnd?.();
        } catch (error) {
            console.error(`Error exportando a ${format}:`, error);
            onExportError?.(error as Error);
        }
    };

    const handlePrint = async () => {
        try {
            onExportStart?.();
            // Para imprimir, necesitamos un elemento HTML con ID
            // Por ahora usamos la función nativa del navegador
            window.print();
            onExportEnd?.();
        } catch (error) {
            console.error('Error imprimiendo:', error);
            onExportError?.(error as Error);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            {showPrint && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    disabled={disabled}
                    className="flex items-center gap-2"
                >
                    <Printer className="h-4 w-4" />
                    Imprimir
                </Button>
            )}

            {showPDF && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('pdf')}
                    disabled={disabled}
                    className="flex items-center gap-2"
                >
                    <FileText className="h-4 w-4" />
                    PDF
                </Button>
            )}

            {showExcel && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('excel')}
                    disabled={disabled}
                    className="flex items-center gap-2"
                >
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                </Button>
            )}

            {showCSV && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('csv')}
                    disabled={disabled}
                    className="flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    CSV
                </Button>
            )}
        </div>
    );
};
