import { useMemo } from 'react';
import { parse, eachDayOfInterval, startOfMonth, endOfMonth, format, isSameMonth, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import PrestamoCard from './prestamo-card';

interface Prestamo {
    id: number;
    tipo: 'cliente' | 'evento' | 'proveedor';
    fecha: string;
    nombre: string;
    encargado?: string;
    estado: string;
    cantidad_items: number;
    monto_garantia: number;
    observaciones: string;
}

interface CalendarGridProps {
    prestamos: Prestamo[];
    mes: string;
}

export default function CalendarGrid({ prestamos, mes }: CalendarGridProps) {
    const mesActualObj = parse(mes, 'yyyy-MM', new Date());
    const inicio = startOfMonth(mesActualObj);
    const fin = endOfMonth(mesActualObj);
    const diasDelMes = eachDayOfInterval({ start: inicio, end: fin });

    // Agrupar préstamos por fecha
    const prestamosPorFecha = useMemo(() => {
        const map = new Map<string, Prestamo[]>();
        prestamos.forEach((prestamo) => {
            const fecha = prestamo.fecha;
            if (!map.has(fecha)) {
                map.set(fecha, []);
            }
            map.get(fecha)!.push(prestamo);
        });
        return map;
    }, [prestamos]);

    // Calcular cuántos días de la semana anterior se muestran
    const primerDia = inicio;
    const diasAnteriores = primerDia.getDay(); // 0 = domingo, 6 = sábado

    const diasPadre = [];
    for (let i = diasAnteriores - 1; i >= 0; i--) {
        const fecha = new Date(inicio);
        fecha.setDate(fecha.getDate() - (i + 1));
        diasPadre.push(fecha);
    }

    const diasCompletos = [...diasPadre, ...diasDelMes];

    // Calcular cuántos días de la siguiente semana se muestran
    const ultimoDia = diasCompletos[diasCompletos.length - 1];
    const diasDesdeUltimo = ultimoDia.getDay(); // 0 = domingo
    const diasFaltantes = diasDesdeUltimo === 0 ? 0 : 7 - diasDesdeUltimo - 1;

    for (let i = 1; i <= diasFaltantes; i++) {
        const fecha = new Date(ultimoDia);
        fecha.setDate(fecha.getDate() + i);
        diasCompletos.push(fecha);
    }

    // Nombres de los días de la semana
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <div className="space-y-4">
            {/* Encabezado con días de la semana */}
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
                    const prestamosDelDia = prestamosPorFecha.get(fechaStr) || [];

                    return (
                        <div
                            key={idx}
                            className={`rounded-lg border-2 p-2 min-h-[200px] overflow-y-auto ${
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

                            {/* Préstamos del día */}
                            <div className="space-y-1">
                                {prestamosDelDia.map((prestamo) => (
                                    <PrestamoCard key={prestamo.id} prestamo={prestamo} compact />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
