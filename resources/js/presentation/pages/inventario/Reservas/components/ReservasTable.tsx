import { useState } from 'react';
import { formatearFecha } from '@/lib/proformas.utils';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Trash2, Clock } from 'lucide-react';

interface Reserva {
    id: number;
    proforma_id: number;
    stock_producto_id: number;
    cantidad_reservada: number;
    fecha_reserva: string;
    fecha_expiracion: string;
    estado: string;
    proforma: {
        id: number;
        numero: string;
        estadoLogistica: {
            nombre: string;
        };
        cliente: {
            id: number;
            nombre: string;
        };
    };
    stockProducto: {
        producto: {
            id: number;
            sku: string;
            nombre: string;
        };
        almacen: {
            id: number;
            nombre: string;
        };
    };
}

interface ReservasTableProps {
    reservas: Reserva[];
    seleccionados: number[];
    onSeleccionar: (id: number) => void;
    onSeleccionarTodos: () => void;
    todosSeleccionados: boolean;
    algunoSeleccionado: boolean;
}

export default function ReservasTable({
    reservas,
    seleccionados,
    onSeleccionar,
    onSeleccionarTodos,
    todosSeleccionados,
    algunoSeleccionado,
}: ReservasTableProps) {
    const [liberando, setLiberando] = useState<number | null>(null);
    const [extendiendo, setExtendiendo] = useState<number | null>(null);

    const esInconsistente = (reserva: Reserva) => {
        const estadoProforma = reserva.proforma.estadoLogistica.nombre;
        return (
            reserva.estado === 'ACTIVA' &&
            ['CONVERTIDA', 'RECHAZADA', 'VENCIDA'].includes(estadoProforma)
        );
    };

    const proximaAExpirar = (reserva: Reserva) => {
        const ahora = new Date();
        const expiracion = new Date(reserva.fecha_expiracion);
        const horasRestantes = (expiracion.getTime() - ahora.getTime()) / (1000 * 60 * 60);
        return reserva.estado === 'ACTIVA' && horasRestantes < 24 && horasRestantes > 0;
    };

    const handleLiberar = async (id: number) => {
        if (!confirm('¿Liberar esta reserva?')) return;

        setLiberando(id);
        try {
            const response = await fetch(`/inventario/reservas/${id}/liberar`, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al liberar la reserva');
            }
        } finally {
            setLiberando(null);
        }
    };

    const handleExtender = async (id: number) => {
        if (!confirm('¿Extender esta reserva por 7 días?')) return;

        setExtendiendo(id);
        try {
            const response = await fetch(`/inventario/reservas/${id}/extender`, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al extender la reserva');
            }
        } finally {
            setExtendiendo(null);
        }
    };

    const getEstadoBadgeColor = (estado: string, esInconsist: boolean) => {
        if (esInconsist) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        if (estado === 'ACTIVA') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        if (estado === 'EXPIRADA') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        if (estado === 'LIBERADA') return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    };

    const getProformaEstadoBadgeColor = (estado: string) => {
        switch (estado) {
            case 'CONVERTIDA':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'RECHAZADA':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'VENCIDA':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'PENDIENTE':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    if (reservas.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron reservas</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">
                            <button
                                onClick={onSeleccionarTodos}
                                className="p-1 hover:bg-muted rounded"
                            >
                                <Checkbox
                                    checked={todosSeleccionados}
                                    onCheckedChange={() => {}}
                                />
                            </button>
                        </th>
                        <th className="text-left py-3 px-4 font-medium">ID</th>
                        <th className="text-left py-3 px-4 font-medium">Producto</th>
                        <th className="text-left py-3 px-4 font-medium">Cantidad</th>
                        <th className="text-left py-3 px-4 font-medium">Proforma</th>
                        <th className="text-left py-3 px-4 font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium">Expiración</th>
                        <th className="text-left py-3 px-4 font-medium">Estado</th>
                        <th className="text-left py-3 px-4 font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => {
                        const inconsistent = esInconsistente(reserva);
                        const expiringSoon = proximaAExpirar(reserva);

                        return (
                            <tr
                                key={reserva.id}
                                className={`border-b transition-colors ${
                                    inconsistent
                                        ? 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20 border-l-4 border-l-red-500'
                                        : expiringSoon
                                        ? 'bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20 border-l-4 border-l-yellow-500'
                                        : 'hover:bg-muted/50'
                                }`}
                            >
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => onSeleccionar(reserva.id)}
                                        className="p-1 hover:bg-muted rounded"
                                    >
                                        <Checkbox
                                            checked={seleccionados.includes(reserva.id)}
                                            onCheckedChange={() => {}}
                                        />
                                    </button>
                                </td>
                                <td className="py-3 px-4 font-mono text-xs">#{reserva.id}</td>
                                <td className="py-3 px-4">
                                    <div className="space-y-1">
                                        <div className="font-medium text-sm">{reserva.stockProducto.producto.nombre}</div>
                                        <div className="text-xs text-muted-foreground">{reserva.stockProducto.producto.sku}</div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="font-semibold">{reserva.cantidad_reservada}</div>
                                    <div className="text-xs text-muted-foreground">{reserva.stockProducto.almacen.nombre}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="space-y-1">
                                        <div className="font-medium text-sm">{reserva.proforma.numero}</div>
                                        <Badge className={`${getProformaEstadoBadgeColor(reserva.proforma.estadoLogistica.nombre)} text-xs`}>
                                            {reserva.proforma.estadoLogistica.nombre}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm">{reserva.proforma.cliente.nombre}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="space-y-1">
                                        <div className="text-sm">{formatearFecha(reserva.fecha_expiracion)}</div>
                                        {expiringSoon && (
                                            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                                                <Clock className="w-3 h-3" />
                                                Próxima a expirar
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <Badge className={getEstadoBadgeColor(reserva.estado, inconsistent)}>
                                        {inconsistent ? 'INCONSISTENTE' : reserva.estado}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        {reserva.estado === 'ACTIVA' && (
                                            <>
                                                <Button
                                                    onClick={() => handleExtender(reserva.id)}
                                                    disabled={extendiendo === reserva.id}
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8"
                                                >
                                                    {extendiendo === reserva.id ? 'Extendiendo...' : '+7 días'}
                                                </Button>
                                                <Button
                                                    onClick={() => handleLiberar(reserva.id)}
                                                    disabled={liberando === reserva.id}
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                >
                                                    {liberando === reserva.id ? '...' : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
