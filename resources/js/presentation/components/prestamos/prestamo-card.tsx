import { Link } from '@inertiajs/react';

interface Prestamo {
    id: number;
    tipo: 'cliente' | 'evento' | 'proveedor';
    nombre: string;
    encargado?: string;
    estado: string;
    cantidad_items: number;
    monto_garantia: number;
    observaciones: string;
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

export default function PrestamoCard({ prestamo, compact = false }: PrestamoCardProps) {
    const tipoLabel = {
        cliente: 'Cliente',
        evento: 'Evento',
        proveedor: 'Proveedor',
    }[prestamo.tipo];

    if (compact) {
        return (
            <Link href={obtenerUrlPrestamo(prestamo.tipo, prestamo.id)}>
                <div className="rounded border border-gray-300 bg-white p-1.5 text-xs dark:border-zinc-600 dark:bg-zinc-800 hover:shadow-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all cursor-pointer">
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
    return (
        <Link href={obtenerUrlPrestamo(prestamo.tipo, prestamo.id)}>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all cursor-pointer dark:border-zinc-700 dark:bg-zinc-800">
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
