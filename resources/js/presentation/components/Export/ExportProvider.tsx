// components/Export/ExportProvider.tsx
import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { useReactToPrint } from 'react-to-print';
import { exportService } from '@/infrastructure/services/export.service';
import type { ExportOptions } from '@/domain/entities/export';

interface ExportContextType {
    printRef: React.RefObject<HTMLDivElement | null>;
    handlePrint: () => void;
    handleExportFromHTML: (elementId: string, options: ExportOptions) => Promise<void>;
    isExporting: boolean;
    setIsExporting: (loading: boolean) => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

interface ExportProviderProps {
    children: ReactNode;
    printOptions?: {
        pageStyle?: string;
        documentTitle?: string;
        onBeforeGetContent?: () => Promise<void> | void;
        onAfterPrint?: () => void;
        removeAfterPrint?: boolean;
    };
}

export const ExportProvider: React.FC<ExportProviderProps> = ({
    children,
    printOptions = {}
}) => {
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: printOptions.documentTitle || 'Documento',
    });

    const handleExportFromHTML = async (elementId: string, options: ExportOptions) => {
        setIsExporting(true);
        try {
            await exportService.exportFromHTML(elementId, options);
        } finally {
            setIsExporting(false);
        }
    };

    const value: ExportContextType = {
        printRef,
        handlePrint,
        handleExportFromHTML,
        isExporting,
        setIsExporting,
    };

    return (
        <ExportContext.Provider value={value}>
            {children}
        </ExportContext.Provider>
    );
};

export const useExport = (): ExportContextType => {
    const context = useContext(ExportContext);
    if (!context) {
        throw new Error('useExport must be used within an ExportProvider');
    }
    return context;
};
