import type { Frecuencia, HorarioNotificacion } from '@/infrastructure/services/notificaciones.service';

/**
 * Cálculo de envíos en el cliente. Replica las reglas del backend:
 *  - NotificacionRecurrente::estaVigente()              fecha_inicio <= día <= fecha_fin
 *  - NotificacionRecurrente::debeEnviarsePorFrecuencia() una_vez / diario / semanal / mensual
 *  - EnviarNotificacionesRecurrentesFcm                 cada horario activo se envía una vez al día, en su minuto exacto
 * Las fechas se calculan en la hora local del navegador (se asume la misma zona que el servidor: America/La_Paz).
 */
export interface Programacion {
    frecuencia: Frecuencia;
    dias_semana?: string[] | null;
    dia_mes?: number | null;
    fecha_inicio?: string | null;
    fecha_fin?: string | null;
    horarios?: HorarioNotificacion[] | null;
}

const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d/;
// Índice = Date.getDay() (0 = domingo), igual que Carbon::dayOfWeek
const DIAS_JS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const ORDEN_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const ABREVIATURA: Record<string, string> = {
    lunes: 'Lun',
    martes: 'Mar',
    miercoles: 'Mié',
    jueves: 'Jue',
    viernes: 'Vie',
    sabado: 'Sáb',
    domingo: 'Dom',
};
// Límite de días a recorrer (evita bucles largos con fechas lejanas)
const MAX_DIAS = 3660;

const normalizarDia = (d: string) =>
    d
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');

/** 'YYYY-MM-DD' (o ISO) -> Date local a las 00:00. new Date('YYYY-MM-DD') usaría UTC. */
export const parseFecha = (fecha?: string | null): Date | null => {
    if (!fecha) return null;
    const [a, m, d] = fecha.split('T')[0].split('-').map(Number);
    if (!a || !m || !d) return null;
    return new Date(a, m - 1, d);
};

const inicioDelDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sumarDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const diasEnMes = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
const fechaCorta = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

/** Horas activas válidas (HH:mm), ordenadas y sin repetir. */
export const horasActivas = (p: Programacion): string[] =>
    [...new Set((p.horarios ?? []).filter((h) => h.activo && HORA_REGEX.test(h.hora)).map((h) => h.hora.substring(0, 5)))].sort();

const diasProgramados = (p: Programacion) => new Set((p.dias_semana ?? []).map(normalizarDia));

/** ¿Toca enviar ese día? (vigencia + frecuencia, sin mirar horas) */
export function tocaEnviarEseDia(p: Programacion, dia: Date): boolean {
    const inicio = parseFecha(p.fecha_inicio);
    const fin = parseFecha(p.fecha_fin);
    const d = inicioDelDia(dia);
    if (inicio && d < inicio) return false;
    if (fin && d > fin) return false;

    switch (p.frecuencia) {
        case 'una_vez':
            return !!inicio && d.getTime() === inicio.getTime();
        case 'diario':
            return true;
        case 'semanal':
            return diasProgramados(p).has(DIAS_JS[d.getDay()]);
        case 'mensual': {
            const objetivo = p.dia_mes ?? 0;
            const ultimo = diasEnMes(d);
            // Si el día no existe ese mes (p. ej. 31 en abril), el backend envía el último día del mes
            return d.getDate() === objetivo || (objetivo > ultimo && d.getDate() === ultimo);
        }
        default:
            return false;
    }
}

const conHora = (dia: Date, hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), h, m);
};

/** Próximos envíos a partir de `desde` (por defecto, ahora). */
export function proximosEnvios(p: Programacion, limite = 5, desde = new Date()): Date[] {
    const horas = horasActivas(p);
    if (horas.length === 0) return [];
    const inicio = parseFecha(p.fecha_inicio);
    // "Una vez" solo puede enviarse el día de inicio: ese día es también el último
    const fin = p.frecuencia === 'una_vez' ? inicio : parseFecha(p.fecha_fin);
    if (p.frecuencia === 'una_vez' && !inicio) return [];
    // Empezar desde hoy o desde la fecha de inicio, la que sea más tarde
    const primerDia = inicio && inicio > inicioDelDia(desde) ? inicio : inicioDelDia(desde);
    const resultado: Date[] = [];

    for (let i = 0; i < MAX_DIAS && resultado.length < limite; i++) {
        const dia = sumarDias(primerDia, i);
        if (fin && dia > fin) break;
        if (!tocaEnviarEseDia(p, dia)) continue;
        for (const hora of horas) {
            const envio = conHora(dia, hora);
            if (envio > desde) resultado.push(envio);
            if (resultado.length >= limite) break;
        }
    }
    return resultado;
}

/**
 * Total de envíos pendientes desde ahora hasta el fin de la vigencia.
 * Devuelve null si no hay límite (sin fecha de fin y frecuencia repetitiva).
 */
export function contarEnviosPendientes(p: Programacion, desde = new Date()): number | null {
    if (p.frecuencia !== 'una_vez' && !parseFecha(p.fecha_fin)) return null;
    return proximosEnvios(p, Number.MAX_SAFE_INTEGER, desde).length;
}

/** Ritmo de envío para vigencias sin límite: "21 por semana", "2 por mes"... */
export function describirRitmo(p: Programacion): string {
    const h = horasActivas(p).length;
    switch (p.frecuencia) {
        case 'diario':
            return `${h * 7} por semana`;
        case 'semanal':
            return `${diasProgramados(p).size * h} por semana`;
        case 'mensual':
            return `${h} por mes`;
        default:
            return `${h} en total`;
    }
}

/** Texto corto de los días: "Lun a Vie", "Día 15 de cada mes", "Solo el 12/11/2026"... */
export function describirDias(p: Programacion): string {
    switch (p.frecuencia) {
        case 'una_vez': {
            const inicio = parseFecha(p.fecha_inicio);
            return inicio ? `Solo el ${fechaCorta(inicio)}` : 'Una sola vez';
        }
        case 'diario':
            return 'Todos los días';
        case 'mensual':
            return p.dia_mes ? `Día ${p.dia_mes} de cada mes` : 'Una vez al mes';
        case 'semanal': {
            const dias = diasProgramados(p);
            const ordenados = ORDEN_SEMANA.filter((d) => dias.has(d));
            const clave = ordenados.join(',');
            if (ordenados.length === 0) return 'Sin días elegidos';
            if (ordenados.length === 7) return 'Todos los días';
            if (clave === ORDEN_SEMANA.slice(0, 5).join(',')) return 'Lun a Vie';
            if (clave === ORDEN_SEMANA.slice(0, 6).join(',')) return 'Lun a Sáb';
            if (clave === 'sabado,domingo') return 'Fin de semana';
            return ordenados.map((d) => ABREVIATURA[d]).join(', ');
        }
        default:
            return '';
    }
}

/** "hoy 18:00", "mañana 08:00", "lun 11/11 08:00" */
export function formatearEnvio(fecha: Date, ahora = new Date()): string {
    const hora = `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
    const dias = Math.round((inicioDelDia(fecha).getTime() - inicioDelDia(ahora).getTime()) / 86_400_000);
    if (dias === 0) return `hoy ${hora}`;
    if (dias === 1) return `mañana ${hora}`;
    const diaSemana = fecha.toLocaleDateString('es-BO', { weekday: 'short' }).replace('.', '');
    const dm = `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const anio = fecha.getFullYear() !== ahora.getFullYear() ? `/${fecha.getFullYear()}` : '';
    return `${diaSemana} ${dm}${anio} ${hora}`;
}

/** Explica por qué no hay envíos pendientes (o null si sí los hay). */
export function motivoSinEnvios(p: Programacion, ahora = new Date()): string | null {
    if (proximosEnvios(p, 1, ahora).length > 0) return null;
    const hoy = inicioDelDia(ahora);
    const inicio = parseFecha(p.fecha_inicio);
    const fin = parseFecha(p.fecha_fin);
    if (horasActivas(p).length === 0) return 'No hay horarios activos';
    if (fin && fin < hoy) return `La vigencia terminó el ${fechaCorta(fin)}`;
    if (p.frecuencia === 'una_vez' && inicio && inicio < hoy) return `Era para el ${fechaCorta(inicio)}, que ya pasó`;
    if (p.frecuencia === 'una_vez' && inicio && inicio.getTime() === hoy.getTime()) return 'Todos los horarios de hoy ya pasaron';
    if (p.frecuencia === 'semanal' && diasProgramados(p).size === 0) return 'No hay días de la semana elegidos';
    return 'Ningún día dentro de la vigencia coincide con la frecuencia';
}
