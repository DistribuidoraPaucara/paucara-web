import { ReactNode } from 'react';

interface TooltipVencimientoProps {
    children: ReactNode;
    nombre: string;
    monto: number;
    referencia: string;
    estado: string;
    fecha: string;
    observaciones?: string;
}

export default function TooltipVencimiento({
    children,
    nombre,
    monto,
    referencia,
    estado,
    fecha,
    observaciones,
}: TooltipVencimientoProps) {
    return (
        <div className="group relative inline-block w-full">
            {children}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform group-hover:block z-50">
                <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-gray-800 whitespace-nowrap">
                    <div className="font-semibold text-blue-300 mb-1">
                        {nombre}
                    </div>
                    <div className="text-gray-300 space-y-0.5">
                        <div>💰 Bs. {Number(monto).toFixed(2)}</div>
                        <div>📋 Ref: {referencia}</div>
                        <div>📅 {new Date(fecha).toLocaleDateString('es-ES')}</div>
                        <div>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${
                                estado === 'activo'
                                    ? 'bg-green-600 text-white'
                                    : estado === 'vencido'
                                        ? 'bg-red-600 text-white'
                                        : estado === 'devuelto'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-yellow-600 text-white'
                            }`}>
                                {estado.toUpperCase()}
                            </span>
                        </div>
                        {observaciones && (
                            <div className="mt-1 text-gray-400 italic">
                                📝 {observaciones.substring(0, 40)}
                                {observaciones.length > 40 ? '...' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* Flecha del tooltip */}
                <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
        </div>
    );
}
