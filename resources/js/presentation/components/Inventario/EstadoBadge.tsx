import React from 'react';
import { Badge } from '@/presentation/components/ui/badge';

interface EstadoBadgeProps {
    estado: string;
}

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
    const getEstadoConfig = (estado: string) => {
        const configs = {
            'BORRADOR': {
                label: 'Borrador',
                className: 'bg-gray-100 text-gray-800 border-gray-200'
            },
            'ENVIADO': {
                label: 'Enviado',
                className: 'bg-blue-100 text-blue-800 border-blue-200'
            },
            'RECIBIDO': {
                label: 'Recibido',
                className: 'bg-green-100 text-green-800 border-green-200'
            },
            'CANCELADO': {
                label: 'Cancelado',
                className: 'bg-red-100 text-red-800 border-red-200'
            }
        };

        return configs[estado as keyof typeof configs] || {
            label: estado,
            className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    };

    const config = getEstadoConfig(estado);

    return (
        <Badge variant="outline" className={config.className}>
            {config.label}
        </Badge>
    );
};

export default EstadoBadge;
