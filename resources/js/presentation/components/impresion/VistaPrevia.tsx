import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { Printer, Download, X } from 'lucide-react';

interface FormatoImpresion {
    formato: string;
    nombre: string;
}

interface VistaPreviaProps {
    documentoId: number | string;
    tipoDocumento: 'venta' | 'proforma' | 'envio';
    formatos: FormatoImpresion[];
    open: boolean;
    onClose: () => void;
    formatoInicial?: string;
}

export function VistaPrevia({
    documentoId,
    tipoDocumento,
    formatos,
    open,
    onClose,
    formatoInicial = 'A4',
}: VistaPreviaProps) {
    const [formatoActual, setFormatoActual] = useState(formatoInicial);

    const getPreviewUrl = (formato: string) => {
        return `/${tipoDocumento}s/${documentoId}/preview?formato=${formato}`;
    };

    const getImprimirUrl = (formato: string) => {
        return `/${tipoDocumento}s/${documentoId}/imprimir?formato=${formato}&accion=stream`;
    };

    const handleDescargar = () => {
        const url = `/${tipoDocumento}s/${documentoId}/imprimir?formato=${formatoActual}&accion=download`;
        window.location.href = url;
    };

    const handleImprimir = () => {
        window.open(getImprimirUrl(formatoActual), '_blank');
    };

    // Mapear formato a label corto para tabs
    const getFormatoLabel = (formato: string) => {
        const labels: Record<string, string> = {
            A4: 'Hoja Completa',
            TICKET_80: 'Ticket 80mm',
            TICKET_58: 'Ticket 58mm',
        };
        return labels[formato] || formato;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Vista Previa de Impresión</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDescargar}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleImprimir}
                            >
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimir
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Tabs
                    value={formatoActual}
                    onValueChange={setFormatoActual}
                    className="flex-1 flex flex-col"
                >
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${formatos.length}, 1fr)` }}>
                        {formatos.map((formato) => (
                            <TabsTrigger key={formato.formato} value={formato.formato}>
                                {getFormatoLabel(formato.formato)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {formatos.map((formato) => (
                        <TabsContent
                            key={formato.formato}
                            value={formato.formato}
                            className="flex-1 mt-4"
                        >
                            <div className="h-[600px] border rounded-md overflow-hidden bg-gray-50">
                                <iframe
                                    src={getPreviewUrl(formato.formato)}
                                    className="w-full h-full"
                                    title={`Preview ${formato.nombre}`}
                                    style={{ border: 'none' }}
                                />
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
