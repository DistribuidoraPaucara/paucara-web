import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/presentation/components/ui/dropdown-menu';
import { Printer, FileText, Receipt, Eye } from 'lucide-react';

interface FormatoImpresion {
    formato: string;
    nombre: string;
    descripcion?: string;
}

interface FormatoSelectorProps {
    documentoId: number | string;
    tipoDocumento: 'venta' | 'proforma' | 'envio' | 'reportes-carga' | 'entregas' | 'cajas' | 'cajas-cierre' | 'credito' | 'compra';
    formatos?: FormatoImpresion[];
    onPreview?: (formato: string) => void;
    className?: string;
    iconOnly?: boolean;
}

const iconosPorFormato: Record<string, typeof FileText> = {
    A4: FileText,
    TICKET_80: Receipt,
    TICKET_58: Receipt,
};

export function FormatoSelector({
    documentoId,
    tipoDocumento,
    formatos,
    onPreview,
    className = '',
    iconOnly = false,
}: FormatoSelectorProps) {
    const [loading, setLoading] = useState(false);

    // Formatos por defecto si no se especifican
    const formatosDefault: FormatoImpresion[] = [
        { formato: 'A4', nombre: 'Hoja Completa (A4)', descripcion: 'Formato estándar A4' },
        { formato: 'TICKET_80', nombre: 'Ticket 80mm', descripcion: 'Impresora térmica 80mm' },
        { formato: 'TICKET_58', nombre: 'Ticket 58mm', descripcion: 'Impresora térmica 58mm' },
    ];

    const [formatosDisponibles, setFormatosDisponibles] = useState<FormatoImpresion[]>(
        formatos || formatosDefault
    );

    // Usar formatos por defecto o los proporcionados
    // Nota: El endpoint de backend es innecesario ya que los formatos por defecto
    // cubren todos los casos de uso. Si es necesario agregar formatos dinámicos
    // en el futuro, esta lógica puede ser reactivada.

    const handleImprimir = (formato: string, accion: 'download' | 'stream' = 'download') => {
        console.log('Iniciando impresión:', { formato, accion });
        setLoading(true);

        // Manejar casos especiales de API endpoints
        let url: string;

        if (tipoDocumento === 'reportes-carga') {
            url = `/api/reportes-carga/${documentoId}/descargar?formato=${formato}&accion=${accion}`;
        } else if (tipoDocumento === 'entregas') {
            url = `/api/entregas/${documentoId}/descargar?formato=${formato}&accion=${accion}`;
        } else if (tipoDocumento === 'cajas') {
            url = `/cajas/${documentoId}/movimientos/imprimir?formato=${formato}&accion=${accion}`;
        } else if (tipoDocumento === 'cajas-cierre') {
            url = `/cajas/${documentoId}/cierre/imprimir?formato=${formato}&accion=${accion}`;
        } else if (tipoDocumento === 'credito') {
            url = `/api/clientes/${documentoId}/credito/imprimir?formato=${formato}&accion=${accion}`;
        } else {
            url = `/${tipoDocumento}s/${documentoId}/imprimir?formato=${formato}&accion=${accion}`;
        }

        console.log('URL de impresión generada:', url);

        // Abrir en nueva ventana para stream, o descargar
        if (accion === 'stream') {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }

        // Pequeño delay para dar feedback visual
        setTimeout(() => setLoading(false), 1000);
    };

    const handlePreview = (formato: string) => {
        if (onPreview) {
            onPreview(formato);
        } else {
            // Abrir preview en nueva ventana
            let url: string;

            if (tipoDocumento === 'reportes-carga') {
                url = `/api/reportes-carga/${documentoId}/preview?formato=${formato}`;
            } else if (tipoDocumento === 'entregas') {
                url = `/api/entregas/${documentoId}/preview?formato=${formato}`;
            } else if (tipoDocumento === 'cajas') {
                url = `/cajas/${documentoId}/movimientos/imprimir?formato=${formato}&accion=stream`;
            } else if (tipoDocumento === 'cajas-cierre') {
                url = `/cajas/${documentoId}/cierre/imprimir?formato=${formato}&accion=stream`;
            } else if (tipoDocumento === 'credito') {
                url = `/api/clientes/${documentoId}/credito/preview?formato=${formato}`;
            } else {
                url = `/${tipoDocumento}s/${documentoId}/preview?formato=${formato}`;
            }

            window.open(url, '_blank');
        }
    };

    if (formatosDisponibles.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {iconOnly ? (
                    <button
                        disabled={loading}
                        className={`inline-flex items-center p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                        title="Imprimir"
                    >
                        <Printer className="h-4 w-4" />
                    </button>
                ) : (
                    <Button variant="outline" disabled={loading} className={className}>
                        <Printer className="mr-2 h-4 w-4" />
                        {loading ? 'Generando...' : 'Imprimir'}
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Seleccionar formato</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {formatosDisponibles.map((formato) => {
                    const Icon = iconosPorFormato[formato.formato] || FileText;

                    return (
                        <div key={formato.formato}>
                            <DropdownMenuItem
                                onClick={() => handleImprimir(formato.formato, 'download')}
                                className="cursor-pointer"
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                <div className="flex flex-col">
                                    <span>{formato.nombre}</span>
                                    {formato.descripcion && (
                                        <span className="text-xs text-muted-foreground">
                                            {formato.descripcion}
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        </div>
                    );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Vista previa
                </DropdownMenuLabel>

                {formatosDisponibles.map((formato) => (
                    <DropdownMenuItem
                        key={`preview-${formato.formato}`}
                        onClick={() => handlePreview(formato.formato)}
                        className="cursor-pointer text-xs"
                    >
                        <Eye className="mr-2 h-3 w-3" />
                        Preview {formato.formato}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
