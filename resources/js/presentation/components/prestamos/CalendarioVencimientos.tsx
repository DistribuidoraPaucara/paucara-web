import React, { useMemo, useState } from 'react';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { ChevronLeft, ChevronRight, Grid3x3, List } from 'lucide-react';

export interface PrestamoParaCalendario {
    id: string | number;
    cliente?: { nombre: string };
    evento?: { nombre_evento: string };
    proveedor?: { nombre: string };
    fecha_esperada_devolucion: string | null;
    estado: string;
    monto_garantia: number;
    detalles?: any[];
    deleted_at?: string | null;  // Para mostrar lotes dados de baja
}

interface CalendarioVencimientosProps {
    prestamos: PrestamoParaCalendario[];
    onFechaChange?: (desde: string, hasta: string) => void;
    tipo?: 'cliente' | 'evento' | 'proveedor';
    titulo?: string;
}

const CalendarioVencimientos: React.FC<CalendarioVencimientosProps> = ({
    prestamos,
    onFechaChange,
    tipo = 'cliente',
    titulo = 'Calendario de Vencimientos',
}) => {
    const [vistaActual, setVistaActual] = useState<'tabla' | 'calendario'>('calendario');
    const [mesActual, setMesActual] = useState<Date>(new Date());
    const [prestamosSeleccionadosPorDia, setPrestamosSeleccionadosPorDia] = useState<PrestamoParaCalendario[]>([]);

    // ✅ Función para parsear fecha en zona horaria local
    const parsearFechaLocal = (dateString: string): Date => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const obtenerRangoMes = (fecha: Date) => {
        const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
        return {
            desde: primerDia.toISOString().split('T')[0],
            hasta: ultimoDia.toISOString().split('T')[0],
        };
    };

    const obtenerNombreEntidad = (prestamo: PrestamoParaCalendario): string => {
        if (tipo === 'cliente' && prestamo.cliente) return prestamo.cliente.nombre;
        if (tipo === 'evento' && prestamo.evento) return prestamo.evento.nombre_evento;
        if (tipo === 'proveedor' && prestamo.proveedor) return prestamo.proveedor.nombre;
        return 'Préstamo #' + prestamo.id;
    };

    // ✅ Calcular días para vencer
    const calcularDiasParaVencer = (fechaVencimiento: string | null): number | null => {
        if (!fechaVencimiento) return null;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fecha = new Date(fechaVencimiento);
        fecha.setHours(0, 0, 0, 0);
        const diferencia = fecha.getTime() - hoy.getTime();
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    };

    // ✅ Determinar estado de vencimiento basado en fecha
    const getEstadoVencimiento = (fechaVencimiento: string | null): string => {
        const dias = calcularDiasParaVencer(fechaVencimiento);
        if (dias === null) return 'SIN_FECHA';
        if (dias < 0) return 'VENCIDO';
        if (dias <= 7) return 'CRITICO';
        if (dias <= 30) return 'PROXIMO_VENCER';
        return 'VIGENTE';
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'ACTIVO':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'PARCIALMENTE_DEVUELTO':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'COMPLETAMENTE_DEVUELTO':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'ANULADO':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getColorPorVencimiento = (estado: string, fechaVencimiento: string | null, deletedAt?: string | null) => {
        // Si está dado de baja (soft delete), mostrar gris oscuro
        if (deletedAt) {
            return 'bg-gray-300 dark:bg-gray-700 border-2 border-gray-500 dark:border-gray-600 opacity-50';
        }

        const estadoVencimiento = getEstadoVencimiento(fechaVencimiento);

        // Si ya está devuelto, mostrar verde
        if (estado === 'COMPLETAMENTE_DEVUELTO') {
            return 'bg-green-50 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600';
        }

        // Si está anulado, mostrar gris
        if (estado === 'ANULADO') {
            return 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600';
        }

        // Colores basados en vencimiento
        switch (estadoVencimiento) {
            case 'VENCIDO':
                return 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600';
            case 'CRITICO':
                return 'bg-orange-50 dark:bg-orange-900/30 border-2 border-orange-400 dark:border-orange-600';
            case 'PROXIMO_VENCER':
                return 'bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600';
            case 'VIGENTE':
                return 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600';
            default:
                return 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700';
        }
    };

    const obtenerPrestamosDelMes = () => {
        const prestamosMap = new Map<number, PrestamoParaCalendario[]>();

        prestamos.forEach((prestamo) => {
            if (prestamo.fecha_esperada_devolucion) {
                const fecha = new Date(prestamo.fecha_esperada_devolucion);
                const mes = fecha.getMonth();
                const año = fecha.getFullYear();
                const mesActualNum = mesActual.getMonth();
                const añoActual = mesActual.getFullYear();

                if (mes === mesActualNum && año === añoActual) {
                    const dia = fecha.getDate();
                    if (!prestamosMap.has(dia)) {
                        prestamosMap.set(dia, []);
                    }
                    prestamosMap.get(dia)!.push(prestamo);
                }
            }
        });

        return prestamosMap;
    };

    const diasDelMes = useMemo(() => {
        const año = mesActual.getFullYear();
        const mes = mesActual.getMonth();
        const primerDia = new Date(año, mes, 1);
        const ultimoDia = new Date(año, mes + 1, 0);
        const diasEnMes = ultimoDia.getDate();
        const diaInicio = primerDia.getDay();

        return { diasEnMes, diaInicio };
    }, [mesActual]);

    const prestamosDelMes = useMemo(() => obtenerPrestamosDelMes(), [prestamos, mesActual]);

    const handleDiaClick = (dia: number) => {
        const prestamosDelDia = prestamosDelMes.get(dia) || [];
        setPrestamosSeleccionadosPorDia(prestamosDelDia);
    };

    const mesAnterior = () => {
        const nuevoMes = new Date(mesActual.getFullYear(), mesActual.getMonth() - 1);
        setMesActual(nuevoMes);
        const { desde, hasta } = obtenerRangoMes(nuevoMes);
        onFechaChange?.(desde, hasta);
    };

    const mesSiguiente = () => {
        const nuevoMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1);
        setMesActual(nuevoMes);
        const { desde, hasta } = obtenerRangoMes(nuevoMes);
        onFechaChange?.(desde, hasta);
    };

    const nombreMes = mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-4">
            {/* Toggle de Vista */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{titulo}</h2>
                {/* <div className="flex gap-2">
                    <Button
                        variant={vistaActual === 'calendario' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setVistaActual('calendario')}
                        className="flex items-center gap-2"
                    >
                        <Grid3x3 className="w-4 h-4" />
                        Calendario
                    </Button>
                    <Button
                        variant={vistaActual === 'tabla' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setVistaActual('tabla')}
                        className="flex items-center gap-2"
                    >
                        <List className="w-4 h-4" />
                        Tabla
                    </Button>
                </div> */}
            </div>

            {/* VISTA CALENDARIO */}
            {vistaActual === 'calendario' && (
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="capitalize">{nombreMes}</CardTitle>
                                <CardDescription>
                                    Visualiza qué préstamos vencen en cada día del mes
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={mesAnterior}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={mesSiguiente}>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Encabezado de días */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((dia) => (
                                <div key={dia} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400">
                                    {dia}
                                </div>
                            ))}
                        </div>

                        {/* Calendario */}
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: diasDelMes.diaInicio }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square"></div>
                            ))}

                            {Array.from({ length: diasDelMes.diasEnMes }).map((_, i) => {
                                const dia = i + 1;
                                const prestamosDelDia = prestamosDelMes.get(dia) || [];

                                // Determinar el color basado en el préstamo más urgente del día
                                let colorFondo = 'bg-gray-50 dark:bg-gray-800';

                                if (prestamosDelDia.length > 0) {
                                    // Priorizar por: VENCIDO > CRITICO > PROXIMO_VENCER > VIGENTE > DEVUELTO
                                    const prestamoPrioritario = prestamosDelDia.reduce((prev, current) => {
                                        const diasPrev = calcularDiasParaVencer(prev.fecha_esperada_devolucion);
                                        const diasCurrent = calcularDiasParaVencer(current.fecha_esperada_devolucion);

                                        // Si uno está devuelto y otro no, el no devuelto es prioritario
                                        if (prev.estado === 'COMPLETAMENTE_DEVUELTO' && current.estado !== 'COMPLETAMENTE_DEVUELTO') return current;
                                        if (current.estado === 'COMPLETAMENTE_DEVUELTO' && prev.estado !== 'COMPLETAMENTE_DEVUELTO') return prev;

                                        // Comparar por días (menor = más urgente)
                                        if ((diasCurrent ?? 999) < (diasPrev ?? 999)) return current;
                                        return prev;
                                    });

                                    colorFondo = getColorPorVencimiento(prestamoPrioritario.estado, prestamoPrioritario.fecha_esperada_devolucion, prestamoPrioritario.deleted_at);
                                }

                                return (
                                    <div
                                        key={dia}
                                        onClick={() => handleDiaClick(dia)}
                                        className={`rounded-lg p-1.5 cursor-pointer transition-all hover:shadow-lg hover:scale-105 min-h-24 ${colorFondo}`}
                                        title={prestamosDelDia.length > 0 ? `${prestamosDelDia.length} préstamo(s)` : 'Sin préstamos'}
                                    >
                                        <div className="flex flex-col h-full gap-1">
                                            <span className="font-bold text-xs text-gray-900 dark:text-white leading-none">
                                                {dia}
                                            </span>

                                            {prestamosDelDia.length > 0 && (
                                                <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                                                    {prestamosDelDia.slice(0, 1).map((prestamo) => (
                                                        <div
                                                            key={prestamo.id}
                                                            className="flex gap-1 bg-white dark:bg-gray-700 rounded p-1 text-[10px] leading-tight"
                                                            title={obtenerNombreEntidad(prestamo)}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-semibold text-gray-900 dark:text-white truncate">
                                                                    P#{prestamo.id}
                                                                </div>
                                                                <div className="text-[9px] text-gray-600 dark:text-gray-400 truncate">
                                                                    {obtenerNombreEntidad(prestamo).substring(0, 12)}
                                                                </div>
                                                                <div className="text-[9px] text-gray-600 dark:text-gray-400">
                                                                    Bs {prestamo.monto_garantia}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {prestamosDelDia.length > 1 && (
                                                        <div className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold text-center py-0.5">
                                                            +{prestamosDelDia.length - 1} más
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Detalle del día seleccionado */}
                        {prestamosSeleccionadosPorDia.length > 0 && (
                            <div className="border-t dark:border-gray-700 pt-6 mt-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Préstamos que vencen este día ({prestamosSeleccionadosPorDia.length})
                                </h3>
                                <div className="space-y-3">
                                    {prestamosSeleccionadosPorDia.map((prestamo) => (
                                        <a
                                            key={prestamo.id}
                                            href={`/prestamos/${tipo}s/${prestamo.id}`}
                                            className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                                                    Préstamo #{prestamo.id}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {obtenerNombreEntidad(prestamo)}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Garantía: Bs {prestamo.monto_garantia}
                                                </div>
                                            </div>
                                            <Badge className={getEstadoColor(prestamo.estado)}>
                                                {prestamo.estado.replace('_', ' ')}
                                            </Badge>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* VISTA TABLA */}
            {vistaActual === 'tabla' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Próximos a Vencer</CardTitle>
                        <CardDescription>
                            {prestamos.length} préstamo{prestamos.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {prestamos.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No hay préstamos para mostrar
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Entidad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Fecha Devolución
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Garantía
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {prestamos.map((prestamo) => (
                                            <tr key={prestamo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    #{prestamo.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {obtenerNombreEntidad(prestamo)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {prestamo.fecha_esperada_devolucion || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    Bs {prestamo.monto_garantia}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <Badge className={getEstadoColor(prestamo.estado)}>
                                                        {prestamo.estado.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CalendarioVencimientos;
