import React from 'react';
import { CheckCircle, AlertCircle, Clock, Ban, FileText, Eye, X, Zap } from 'lucide-react';

interface EstadoVentaBadgeProps {
    estado: string;
    tamaño?: 'sm' | 'md' | 'lg';
    conIcono?: boolean;
    mostrarLabel?: boolean;
}

export const EstadoVentaBadge: React.FC<EstadoVentaBadgeProps> = ({
    estado,
    tamaño = 'md',
    conIcono = true,
    mostrarLabel = true
}) => {
    // Mapeo completo de estados con colores, iconos y etiquetas
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
        'APROBADO': {
            label: 'Aprobado',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-800 dark:text-green-300',
            borderColor: 'border-green-300 dark:border-green-700',
            icon: <CheckCircle className="w-4 h-4" />,
            descripcion: 'Venta aprobada y lista'
        },
        'PENDIENTE': {
            label: 'Pendiente',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
            textColor: 'text-yellow-800 dark:text-yellow-300',
            borderColor: 'border-yellow-300 dark:border-yellow-700',
            icon: <Clock className="w-4 h-4" />,
            descripcion: 'Esperando aprobación'
        },
        'ANULADO': {
            label: 'Anulado',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <X className="w-4 h-4" />,
            descripcion: 'Venta cancelada'
        },
        'CANCELADA': {
            label: 'Cancelada',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <Ban className="w-4 h-4" />,
            descripcion: 'Venta cancelada'
        },
        'COMPLETADA': {
            label: 'Completada',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            textColor: 'text-emerald-800 dark:text-emerald-300',
            borderColor: 'border-emerald-300 dark:border-emerald-700',
            icon: <CheckCircle className="w-4 h-4" />,
            descripcion: 'Venta completada'
        },
        'PAGADA': {
            label: 'Pagada',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-800 dark:text-blue-300',
            borderColor: 'border-blue-300 dark:border-blue-700',
            icon: <Zap className="w-4 h-4" />,
            descripcion: 'Venta pagada'
        },
        'FACTURADA': {
            label: 'Facturada',
            bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
            textColor: 'text-indigo-800 dark:text-indigo-300',
            borderColor: 'border-indigo-300 dark:border-indigo-700',
            icon: <FileText className="w-4 h-4" />,
            descripcion: 'Venta facturada'
        },
        'EN_REVISION': {
            label: 'En Revisión',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            textColor: 'text-orange-800 dark:text-orange-300',
            borderColor: 'border-orange-300 dark:border-orange-700',
            icon: <Eye className="w-4 h-4" />,
            descripcion: 'Esperando revisión'
        },
        'PROBLEMAS': {
            label: 'Con Problemas',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-700',
            icon: <AlertCircle className="w-4 h-4" />,
            descripcion: 'Venta con problemas'
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

export default EstadoVentaBadge;
