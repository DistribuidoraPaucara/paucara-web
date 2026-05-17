// domain/export.ts
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print';

export type ExportOptions = {
    format: ExportFormat;
    filename?: string;
    title?: string;
    includeHeader?: boolean;
    includeFooter?: boolean;
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'a4' | 'a3' | 'letter' | 'legal';
    customStyles?: Record<string, string | number | boolean>;
};

export type ExportData = {
    headers: string[];
    rows: (string | number | Date)[][];
    metadata?: {
        title?: string;
        subtitle?: string;
        generatedAt?: Date;
        generatedBy?: string;
        filters?: Record<string, string | number | boolean | Date>;
    };
};

export type ExportTemplate = {
    id: string;
    name: string;
    description: string;
    module: string;
    format: ExportFormat;
    defaultOptions: ExportOptions;
    template: (data: Record<string, unknown>) => ExportData;
};

export interface ExportService {
    export(data: ExportData, options: ExportOptions): Promise<void>;
    print(elementId: string, options?: Partial<ExportOptions>): Promise<void>;
    generatePDF(data: ExportData, options: ExportOptions): Promise<Blob>;
    generateExcel(data: ExportData, options: ExportOptions): Promise<Blob>;
    generateCSV(data: ExportData, options: ExportOptions): Promise<Blob>;
}

export interface ExportableEntity {
    toExportData(): ExportData;
    getExportTemplates(): ExportTemplate[];
}
