import { Link } from '@inertiajs/react';
import { differenceInDays, parseISO } from 'date-fns';

interface Prestamo {
    id: number;
    tipo: 'cliente' | 'evento' | 'proveedor';
    nombre: string;
    encargado?: string;
    estado: string;
    cantidad_items: number;
    monto_garantia: number;
    observaciones: string;
    fecha?: string;
}

interface PrestamoCardProps {
    prestamo: Prestamo;
    compact?: boolean;
}

const tipoIconos = {
    cliente: '👥',
    evento: '🎉',
    proveedor: '🏭',
};

const estadoColores: Record<string, string> = {
    activo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    devuelto: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    vencido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    parcial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const obtenerUrlPrestamo = (tipo: 'cliente' | 'evento' | 'proveedor', id: number): string => {
    const rutas = {
        cliente: `/prestamos/clientes/${id}`,
        evento: `/prestamos/eventos/${id}`,
        proveedor: `/prestamos/proveedores/${id}`,
    };
    return rutas[tipo];
};

// Calcular color según proximidad a fecha de vencimiento
const obtenerColorProximidad = (fecha?: string, estado?: string): string => {
    if (!fecha) return 'border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800';

    // Si está devuelto, color azul
    if (estado === 'devuelto') {
        return 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900';
    }

    try {
        const fechaVencimiento = parseISO(fecha);
        const hoy = new Date();
        const diasRestantes = differenceInDays(fechaVencimiento, hoy);

        if (diasRestantes < 0) {
            // Vencido
            return 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-900';
        } else if (diasRestantes <= 3) {
            // Crítico (vence en 3 días o menos)
            return 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900';
        } else if (diasRestantes <= 7) {
            // Urgente (vence en una semana)
            return 'border-orange-400 bg-orange-50 dark:border-orange-600 dark:bg-orange-900';
        } else if (diasRestantes <= 14) {
            // Próximo (vence en dos semanas)
            return 'border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900';
        } else if (diasRestantes <= 30) {
            // Normal
            return 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900';
        } else {
            // Tranquilo (más de un mes)
            return 'border-green-200 bg-white dark:border-green-800 dark:bg-zinc-800';
        }
    } catch {
        return 'border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800';
    }
};

// Obtener badge de días restantes
const obtenerBadgeDiasRestantes = (fecha?: string): { texto: string; color: string } => {
    if (!fecha) return { texto: '', color: '' };

    try {
        const fechaVencimiento = parseISO(fecha);
        const hoy = new Date();
        const diasRestantes = differenceInDays(fechaVencimiento, hoy);

        if (diasRestantes < 0) {
            return {
                texto: `⚠️ Vencido hace ${Math.abs(diasRestantes)} días`,
                color: 'bg-red-600 text-white',
            };
        } else if (diasRestantes === 0) {
            return {
                texto: '🔴 Vence HOY',
                color: 'bg-red-600 text-white',
            };
        } else if (diasRestantes === 1) {
            return {
                texto: '⚠️ Vence mañana',
                color: 'bg-red-500 text-white',
            };
        } else if (diasRestantes <= 7) {
            return {
                texto: `⏰ ${diasRestantes} días`,
                color: 'bg-orange-500 text-white',
            };
        } else if (diasRestantes <= 30) {
            return {
                texto: `📅 ${diasRestantes} días`,
                color: 'bg-yellow-600 text-white',
            };
        }
        return { texto: '', color: '' };
    } catch {
        return { texto: '', color: '' };
    }
};

export default function PrestamoCard({ prestamo, compact = false }: PrestamoCardProps) {
    const tipoLabel = {
        cliente: 'Cliente',
        evento: 'Evento',
        proveedor: 'Proveedor',
    }[prestamo.tipo];

    if (compact) {
        const colorClase = obtenerColorProximidad(prestamo.fecha, prestamo.estado);
        const badge = obtenerBadgeDiasRestantes(prestamo.fecha);

        return (
            <Link href={obtenerUrlPrestamo(prestamo.tipo, prestamo.id)}>
                <div className={`rounded border-2 p-1.5 text-xs transition-all cursor-pointer hover:shadow-md ${colorClase}`}>
                {/* Badge de días restantes */}
                {badge.texto && (
                    <div className={`${badge.color} rounded px-2 py-1 text-xs font-bold mb-1 text-center`}>
                        {badge.texto}
                    </div>
                )}

                <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {tipoIconos[prestamo.tipo]} {tipoLabel}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 truncate text-xs">
                            {prestamo.nombre}
                        </p>
                    </div>
                    <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                            estadoColores[prestamo.estado] ||
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                    >
                        {prestamo.estado}
                    </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {prestamo.cantidad_items} items • Bs {Number(prestamo.monto_garantia).toFixed(2)}
                </p>
                </div>
            </Link>
        );
    }

    // Vista expandida
    const colorClaseExpanded = obtenerColorProximidad(prestamo.fecha, prestamo.estado);
    const badgeExpanded = obtenerBadgeDiasRestantes(prestamo.fecha);

    return (
        <Link href={obtenerUrlPrestamo(prestamo.tipo, prestamo.id)}>
            <div className={`rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${colorClaseExpanded}`}>
            {/* Badge de días restantes */}
            {badgeExpanded.texto && (
                <div className={`${badgeExpanded.color} rounded px-3 py-2 text-sm font-bold mb-3 text-center`}>
                    {badgeExpanded.texto}
                </div>
            )}

            {/* Encabezado */}
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {tipoIconos[prestamo.tipo]} {prestamo.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tipoLabel}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        estadoColores[prestamo.estado] ||
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                >
                    {prestamo.estado}
                </span>
            </div>

            {/* Detalles */}
            <div className="space-y-2 text-sm">
                {prestamo.encargado && (
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Encargado:</span> {prestamo.encargado}
                    </p>
                )}
                <div className="flex gap-4">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Cantidad de items</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {prestamo.cantidad_items}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Monto garantía</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            Bs {Number(prestamo.monto_garantia).toFixed(2)}
                        </p>
                    </div>
                </div>
                {prestamo.observaciones && (
                    <p className="text-gray-600 dark:text-gray-400 italic">
                        "{prestamo.observaciones}"
                    </p>
                )}
            </div>
            </div>
        </Link>
    );
}
