import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/presentation/components/ui/dropdown-menu';
import { Printer } from 'lucide-react';

interface ImprimirPagoButtonProps {
    clienteId: number;
    pagoId: number;
    montoFormato?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function ImprimirPagoButton({
    clienteId,
    pagoId,
    montoFormato = 'Pago',
    size = 'sm',
    className = '',
}: ImprimirPagoButtonProps) {
    const [loading, setLoading] = useState(false);

    const formatos = [
        { formato: 'A4', nombre: 'A4 (Completo)' },
        { formato: 'TICKET_80', nombre: '80mm' },
        { formato: 'TICKET_58', nombre: '58mm' },
    ];

    const handleImprimir = (formato: string) => {
        setLoading(true);
        const url = `/api/clientes/${clienteId}/pagos/${pagoId}/imprimir?formato=${formato}&accion=download`;

        // Descargar PDF
        window.location.href = url;

        setTimeout(() => setLoading(false), 1500);
    };

    const handlePreview = (formato: string) => {
        const url = `/api/clientes/${clienteId}/pagos/${pagoId}/preview?formato=${formato}`;
        window.open(url, '_blank');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={size}
                    disabled={loading}
                    className={`h-8 w-8 p-0 ${className}`}
                    title={`Imprimir ${montoFormato}`}
                >
                    <Printer className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Pago #{pagoId}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs font-normal text-gray-600">
                    Descargar
                </DropdownMenuLabel>
                {formatos.map((fmt) => (
                    <DropdownMenuItem
                        key={`download-${fmt.formato}`}
                        onClick={() => handleImprimir(fmt.formato)}
                        className="text-xs cursor-pointer"
                    >
                        📥 {fmt.nombre}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs font-normal text-gray-600">
                    Vista Previa
                </DropdownMenuLabel>
                {formatos.map((fmt) => (
                    <DropdownMenuItem
                        key={`preview-${fmt.formato}`}
                        onClick={() => handlePreview(fmt.formato)}
                        className="text-xs cursor-pointer"
                    >
                        👁️ {fmt.nombre}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
