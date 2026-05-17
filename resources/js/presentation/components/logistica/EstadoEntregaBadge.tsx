import React from 'react';
import { Clock, CheckCircle, Truck, AlertCircle, Package, MapPin, XCircle } from 'lucide-react';

interface EstadoEntregaBadgeProps {
    estado: string;
    tamaño?: 'sm' | 'md' | 'lg';
    conIcono?: boolean;
    mostrarLabel?: boolean;
}

export const EstadoEntregaBadge: React.FC<EstadoEntregaBadgeProps> = ({
    estado,
    tamaño = 'md',
    conIcono = true,
    mostrarLabel = true
}) => {
    // Mapeo completo de estados de entregas con colores, iconos y etiquetas
    const estadoConfig: {
        [key: string]: {
            label: string;
            bgColor: string;
            textColor: string;
            borderColor: string;
            icon: React.ReactNode;
            descripcion?: string;
        }
    } = {
        'PENDIENTE': {
            label: 'Pendiente',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
            textColor: 'text-yellow-800 dark:text-yellow-300',
            borderColor: 'border-yellow-300 dark:border-yellow-700',
            icon: <Clock className="w-4 h-4" />,
            descripcion: 'Entrega pendiente de confirmación'
        },
        'PROGRAMADO': {
            label: 'Programado',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-800 dark:text-blue-300',
            borderColor: 'border-blue-300 dark:border-blue-700',
            icon: <MapPin className="w-4 h-4" />,
            descripcion: 'Entrega programada para la fecha indicada'
        },
        'EN_TRANSITO': {
            label: 'En Tránsito',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            textColor: 'text-purple-800 dark:text-purple-300',
            borderColor: 'border-purple-300 dark:border-purple-700',
            icon: <Truck className="w-4 h-4" />,
            descripcion: 'Entrega en camino hacia su destino'
        },
        'PREPARACION_CARGA': {
            label: 'Preparación',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            textColor: 'text-orange-800 dark:text-orange-300',
            borderColor: 'border-orange-300 dark:border-orange-700',
            icon: <Package className="w-4 h-4" />,
            descripcion: 'Preparando carga para envío'
        },
        'EN_PREPARACION': {
            label: 'En Preparación',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            textColor: 'text-orange-800 dark:text-orange-300',
            borderColor: 'border-orange-300 dark:border-orange-700',
            icon: <Package className="w-4 h-4" />,
            descripcion: 'Preparando carga para envío'
        },
        'ENTREGADA': {
            label: 'Entregada',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-800 dark:text-green-300',
            borderColor: 'border-green-300 dark:border-green-700',
            icon: <CheckCircle className="w-4 h-4" />,
            descripcion: 'Entrega completada exitosamente'
        },
        'ENTREGADO': {
            label: 'Entregado',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-800 dark:text-green-300',
            borderColor: 'border-green-300 dark:border-green-700',
            icon: <CheckCircle className="w-4 h-4" />,
            descripcion: 'Entrega completada exitosamente'
        },
        'CANCELADA': {
            label: 'Cancelada',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <XCircle className="w-4 h-4" />,
            descripcion: 'Entrega cancelada'
        },
        'CANCELADO': {
            label: 'Cancelado',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <XCircle className="w-4 h-4" />,
            descripcion: 'Entrega cancelada'
        },
        'PROBLEMA': {
            label: 'Problema',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <AlertCircle className="w-4 h-4" />,
            descripcion: 'Entrega con problemas'
        },
        'PROBLEMAS': {
            label: 'Problemas',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <AlertCircle className="w-4 h-4" />,
            descripcion: 'Entrega con problemas'
        },
    };

    const config = estadoConfig[estado?.toUpperCase()] || {
        label: estado || 'Desconocido',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-800 dark:text-gray-300',
        borderColor: 'border-gray-300 dark:border-gray-600',
        icon: <AlertCircle className="w-4 h-4" />,
        descripcion: 'Estado desconocido'
    };

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <div
            className={`inline-flex items-center space-x-1.5 ${sizeClasses[tamaño]} font-semibold rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} transition-all duration-200 hover:shadow-md cursor-default`}
            title={config.descripcion}
        >
            {conIcono && config.icon}
            {mostrarLabel && <span>{config.label}</span>}
        </div>
    );
};

export default EstadoEntregaBadge;
