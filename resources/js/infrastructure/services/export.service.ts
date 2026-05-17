// services/export.service.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type {
    ExportData,
    ExportOptions,
    ExportService
} from '@/domain/entities/export';

export class ExportServiceImpl implements ExportService {
    private static instance: ExportServiceImpl;

    public static getInstance(): ExportServiceImpl {
        if (!ExportServiceImpl.instance) {
            ExportServiceImpl.instance = new ExportServiceImpl();
        }
        return ExportServiceImpl.instance;
    }

    async export(data: ExportData, options: ExportOptions): Promise<void> {
        const filename = options.filename || `export_${new Date().toISOString().split('T')[0]}`;

        switch (options.format) {
            case 'pdf':
                await this.exportToPDF(data, options, filename);
                break;
            case 'excel':
                await this.exportToExcel(data, options, filename);
                break;
            case 'csv':
                await this.exportToCSV(data, options, filename);
                break;
            default:
                throw new Error(`Formato no soportado: ${options.format}`);
        }
    }

    async print(elementId: string, options: Partial<ExportOptions> = {}): Promise<void> {
        console.log('Buscando elemento con ID:', elementId);
        const element = document.getElementById(elementId);
        console.log('Elemento encontrado:', element);

        if (!element) {
            console.error(`Elemento con ID '${elementId}' no encontrado. Elementos disponibles:`, document.querySelectorAll('[id]'));
            throw new Error(`Elemento con ID '${elementId}' no encontrado`);
        }

        // Aplicar estilos de impresión si es necesario
        if (options.customStyles) {
            Object.assign(element.style, options.customStyles);
        }

        // Usar la API nativa de impresión del navegador
        window.print();
    }

    async generatePDF(data: ExportData, options: ExportOptions): Promise<Blob> {
        const pdf = new jsPDF({
            orientation: options.orientation || 'portrait',
            unit: 'mm',
            format: options.pageSize || 'a4'
        });

        // Configurar fuente y estilos
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);

        let yPosition = 20;

        // Título
        if (options.title) {
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(options.title, 20, yPosition);
            yPosition += 15;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
        }

        // Metadata
        if (data.metadata) {
            if (data.metadata.subtitle) {
                pdf.text(data.metadata.subtitle, 20, yPosition);
                yPosition += 10;
            }

            if (data.metadata.generatedAt) {
                pdf.setFontSize(8);
                pdf.text(`Generado: ${data.metadata.generatedAt.toLocaleString('es-ES')}`, 20, yPosition);
                yPosition += 5;
            }

            if (data.metadata.generatedBy) {
                pdf.text(`Por: ${data.metadata.generatedBy}`, 20, yPosition);
                yPosition += 10;
            }
        }

        // Headers
        if (options.includeHeader !== false && data.headers.length > 0) {
            pdf.setFont('helvetica', 'bold');
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPosition - 5, 170, 8, 'F');

            data.headers.forEach((header, index) => {
                const xPos = 20 + (index * (170 / data.headers.length));
                pdf.text(header.toString(), xPos, yPosition);
            });

            yPosition += 10;
            pdf.setFont('helvetica', 'normal');
        }

        // Data rows
        data.rows.forEach((row, rowIndex) => {
            // Verificar si necesitamos una nueva página
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }

            row.forEach((cell, cellIndex) => {
                const xPos = 20 + (cellIndex * (170 / data.headers.length));
                const cellValue = cell?.toString() || '';
                pdf.text(cellValue, xPos, yPosition);
            });

            yPosition += 8;

            // Línea divisoria cada 5 filas
            if ((rowIndex + 1) % 5 === 0) {
                pdf.setDrawColor(200, 200, 200);
                pdf.line(20, yPosition, 190, yPosition);
                yPosition += 2;
            }
        });

        // Footer
        if (options.includeFooter !== false) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Página 1 de 1 - Generado con Distribuidora Paucará`, 20, 285);
        }

        return pdf.output('blob');
    }

    async generateExcel(data: ExportData, options: ExportOptions): Promise<Blob> {
        // Crear contenido CSV para Excel
        const csvContent = this.generateCSVContent(data, options);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        return blob;
    }

    async generateCSV(data: ExportData, options: ExportOptions): Promise<Blob> {
        const csvContent = this.generateCSVContent(data, options);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        return blob;
    }

    private generateCSVContent(data: ExportData, options: ExportOptions): string {
        let csv = '';

        // Headers
        if (options.includeHeader !== false && data.headers.length > 0) {
            csv += data.headers.join(',') + '\n';
        }

        // Data rows
        data.rows.forEach(row => {
            const csvRow = row.map(cell => {
                const value = cell?.toString() || '';
                // Escapar comillas y envolver en comillas si contiene comas
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csv += csvRow.join(',') + '\n';
        });

        return csv;
    }

    private async exportToPDF(data: ExportData, options: ExportOptions, filename: string): Promise<void> {
        try {
            const blob = await this.generatePDF(data, options);
            this.downloadBlob(blob, `${filename}.pdf`);
        } catch (error) {
            console.error('Error generando PDF:', error);
            throw new Error('Error al generar el PDF');
        }
    }

    private async exportToExcel(data: ExportData, options: ExportOptions, filename: string): Promise<void> {
        try {
            const blob = await this.generateExcel(data, options);
            this.downloadBlob(blob, `${filename}.xlsx`);
        } catch (error) {
            console.error('Error generando Excel:', error);
            throw new Error('Error al generar el archivo Excel');
        }
    }

    private async exportToCSV(data: ExportData, options: ExportOptions, filename: string): Promise<void> {
        try {
            const blob = await this.generateCSV(data, options);
            this.downloadBlob(blob, `${filename}.csv`);
        } catch (error) {
            console.error('Error generando CSV:', error);
            throw new Error('Error al generar el archivo CSV');
        }
    }

    private downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Método para exportar desde HTML usando html2canvas
    async exportFromHTML(elementId: string, options: ExportOptions): Promise<void> {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Elemento con ID '${elementId}' no encontrado`);
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: options.orientation || 'portrait',
                unit: 'mm',
                format: options.pageSize || 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const filename = options.filename || `export_${new Date().toISOString().split('T')[0]}`;
            pdf.save(`${filename}.pdf`);
        } catch (error) {
            console.error('Error exportando desde HTML:', error);
            throw new Error('Error al exportar desde HTML');
        }
    }
}

// Exportar instancia singleton
export const exportService = ExportServiceImpl.getInstance();
