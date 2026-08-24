import { useMemo } from 'react';
import { parse, eachDayOfInterval, startOfMonth, endOfMonth, format, isSameMonth, isToday } from 'date-fns';
import VencimientoCard from './vencimiento-card';

interface Vencimiento {
    id: number;
    tipo: 'prestamo_cliente' | 'prestamo_evento' | 'prestamo_proveedor' | 'cuenta_por_cobrar';
    categoria: string;
    fecha: string;
    nombre: string;
    estado: string;
    monto: number;
    cantidad_items: number;
    referencia: string;
    observaciones?: string;
    link: string;
}

interface CalendarioVencimientosGridProps {
    vencimientos: Vencimiento[];
    mes: string;
}

export default function CalendarioVencimientosGrid({ vencimientos, mes }: CalendarioVencimientosGridProps) {
    const mesActualObj = parse(mes, 'yyyy-MM', new Date());
    const inicio = startOfMonth(mesActualObj);
    const fin = endOfMonth(mesActualObj);
    const diasDelMes = eachDayOfInterval({ start: inicio, end: fin });

    const vencimientosPorFecha = useMemo(() => {
        const map = new Map<string, Vencimiento[]>();
        vencimientos.forEach((v) => {
            const fecha = v.fecha;
            if (!map.has(fecha)) {
                map.set(fecha, []);
            }
            map.get(fecha)!.push(v);
        });
        return map;
    }, [vencimientos]);

    const primerDia = inicio;
    const diasAnteriores = primerDia.getDay();

    const diasPadre = [];
    for (let i = diasAnteriores - 1; i >= 0; i--) {
        const fecha = new Date(inicio);
        fecha.setDate(fecha.getDate() - (i + 1));
        diasPadre.push(fecha);
    }

    const diasCompletos = [...diasPadre, ...diasDelMes];
    const ultimoDia = diasCompletos[diasCompletos.length - 1];
    const diasDesdeUltimo = ultimoDia.getDay();
    const diasFaltantes = diasDesdeUltimo === 0 ? 0 : 7 - diasDesdeUltimo - 1;

    for (let i = 1; i <= diasFaltantes; i++) {
        const fecha = new Date(ultimoDia);
        fecha.setDate(fecha.getDate() + i);
        diasCompletos.push(fecha);
    }

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <div className="space-y-4">
            {/* Encabezado */}
            <div className="grid grid-cols-7 gap-2">
                {diasSemana.map((dia) => (
                    <div
                        key={dia}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-center font-semibold text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
                    >
                        {dia.substring(0, 3)}
                    </div>
                ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-2 auto-rows-max">
                {diasCompletos.map((dia, idx) => {
                    const esDelMes = isSameMonth(dia, mesActualObj);
                    const esHoy = isToday(dia);
                    const fechaStr = format(dia, 'yyyy-MM-dd');
                    const vencimientosDelDia = vencimientosPorFecha.get(fechaStr) || [];

                    return (
                        <div
                            key={fechaStr}
                            className={`rounded-lg border-2 p-2 min-h-[220px] overflow-y-auto ${
                                esDelMes
                                    ? esHoy
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                        : 'border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
                                    : 'border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950'
                            }`}
                        >
                            {/* Número del día */}
                            <p
                                className={`text-sm font-semibold mb-2 ${
                                    esDelMes
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-400 dark:text-gray-600'
                                } ${esHoy ? 'text-blue-600 dark:text-blue-400 text-base' : ''}`}
                            >
                                {format(dia, 'd')}
                            </p>

                            {/* Vencimientos del día */}
                            <div className="space-y-1">
                                {vencimientosDelDia.map((vencimiento) => (
                                    <VencimientoCard key={`${vencimiento.tipo}-${vencimiento.id}`} vencimiento={vencimiento} compact />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
