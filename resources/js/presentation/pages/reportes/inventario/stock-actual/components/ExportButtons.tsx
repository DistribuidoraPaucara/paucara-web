import { Button } from '@/presentation/components/ui/button';
import { Download, FileText, Sheet, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';

interface ExportButtonsProps {
    reportType: 'stock-actual' | 'vencimientos' | 'rotacion' | 'movimientos';
    filters?: Record<string, any>;
}

export function ExportButtons({ reportType, filters = {} }: ExportButtonsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExportPdf = async () => {
        try {
            setIsLoading(true);
            // Limpiar filtros: solo incluir los que tienen valor
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== undefined && v !== false && v !== '')
            );
            const params = new URLSearchParams({
                tipo: reportType,
                ...cleanFilters,
            });

            const response = await fetch(`/reportes/inventario/export-pdf?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Descargar el PDF
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte_inventario_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('📄 PDF descargado exitosamente');
        } catch (error) {
            console.error('Error descargando PDF:', error);
            toast.error('❌ Error al descargar el PDF');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setIsLoading(true);
            // Limpiar filtros: solo incluir los que tienen valor
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== undefined && v !== false && v !== '')
            );
            const params = new URLSearchParams({
                tipo: reportType,
                ...cleanFilters,
            });

            const response = await fetch(`/reportes/inventario/export?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { data, filename } = await response.json();

            // Crear workbook y worksheet con ExcelJS
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(reportType);

            if (data.length === 0) {
                toast.error('❌ No hay datos para exportar');
                setIsLoading(false);
                return;
            }

            // Obtener headers
            const headers = Object.keys(data[0]);
            worksheet.columns = headers.map(header => ({
                header: header.toUpperCase(),
                key: header,
                width: Math.max(header.length + 2, 20),
            }));

            // Aplicar estilos a la cabecera
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4472C4' }, // Azul
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FFFFFFFF' }, // Blanco
                    size: 12,
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'center',
                    wrapText: true,
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } },
                };
            });

            // Agregar datos y aplicar estilos a las filas
            data.forEach((row, index) => {
                worksheet.addRow(row);
                const excelRow = worksheet.getRow(index + 2);

                // Alternar colores de fondo
                const bgColor = index % 2 === 0 ? 'FFF2F2F2' : 'FFFFFFFF';
                excelRow.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: bgColor },
                    };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    };
                    cell.alignment = {
                        horizontal: 'left',
                        vertical: 'center',
                    };
                });
            });

            // Congelar la primera fila
            worksheet.views = [{ state: 'frozen', ySplit: 1 }];

            // Orientación horizontal para stock-actual
            if (reportType === 'stock-actual') {
                worksheet.pageSetup = {
                    paperSize: worksheet.pageSetup?.paperSize || 1, // A4
                    orientation: 'landscape'
                };
            }

            // Generar archivo y descargar
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('📊 Excel descargado exitosamente');
        } catch (error) {
            console.error('Error exportando Excel:', error);
            toast.error('❌ Error al exportar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={handleExportPdf}
                disabled={isLoading}
                variant="default"
                size="sm"
                className="gap-2"
            >
                <FileText className="w-4 h-4" />
                PDF A4
                <Download className="w-4 h-4 ml-1" />
            </Button>
            <Button
                onClick={handleExportExcel}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <Sheet className="w-4 h-4" />
                        Excel
                        <Download className="w-4 h-4 ml-1" />
                    </>
                )}
            </Button>
        </div>
    );
}
