/**
 * Utilidades para Notificaciones Recurrentes
 */

export const TIPOS_NOTIFICACION = [
    { value: 'promocion', label: '🎁 Promoción', color: 'bg-blue-100 text-blue-800' },
    { value: 'evento', label: '🎉 Evento', color: 'bg-purple-100 text-purple-800' },
    { value: 'informativo', label: 'ℹ️ Informativo', color: 'bg-gray-100 text-gray-800' },
    { value: 'oferta', label: '🏷️ Oferta', color: 'bg-red-100 text-red-800' },
] as const;

export const FRECUENCIAS_NOTIFICACION = [
    { value: 'una_vez', label: '🔄 Una sola vez' },
    { value: 'diario', label: '📅 Diario' },
    { value: 'semanal', label: '📆 Semanal' },
    { value: 'mensual', label: '📋 Mensual' },
] as const;

export const DIAS_SEMANA_ES = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo',
] as const;

/**
 * Obtener etiqueta del tipo de notificación
 */
export function getTipoLabel(tipo: string): string {
    const tipoEncontrado = TIPOS_NOTIFICACION.find((t) => t.value === tipo);
    return tipoEncontrado?.label || tipo;
}

/**
 * Obtener clase de color para el tipo
 */
export function getTipoColor(tipo: string): string {
    const tipoEncontrado = TIPOS_NOTIFICACION.find((t) => t.value === tipo);
    return tipoEncontrado?.color || '';
}

/**
 * Obtener etiqueta de frecuencia
 */
export function getFrecuenciaLabel(frecuencia: string): string {
    const frecEncontrada = FRECUENCIAS_NOTIFICACION.find((f) => f.value === frecuencia);
    return frecEncontrada?.label || frecuencia;
}

/**
 * Formatear hora a HH:mm
 */
export function formatearHora(hora: string): string {
    return hora.substring(0, 5);
}

/**
 * Formatear días de la semana
 */
export function formatearDiasSemana(dias: string[] | undefined): string {
    if (!dias || dias.length === 0) return '-';
    if (dias.length === 7) return 'Todos los días';
    if (dias.length === 5 && dias.includes('lunes') && !dias.includes('sábado')) {
        return 'Lunes a Viernes';
    }
    return dias.map((d) => d.charAt(0).toUpperCase()).join(', ');
}

/**
 * Validaciones comunes
 */
export const VALIDACIONES = {
    titulo: {
        minLength: 3,
        maxLength: 255,
        required: true,
    },
    descripcion: {
        minLength: 10,
        maxLength: 5000,
        required: true,
    },
    horaEnvio: {
        pattern: /^\d{2}:\d{2}$/,
        required: true,
    },
    diasMes: {
        minValue: 1,
        maxValue: 31,
    },
} as const;

/**
 * Mensajes de error comunes
 */
export const MENSAJES_ERROR = {
    TITULO_REQUERIDO: 'El título es requerido',
    TITULO_CORTO: `El título debe tener al menos ${VALIDACIONES.titulo.minLength} caracteres`,
    DESCRIPCION_REQUERIDA: 'La descripción es requerida',
    DESCRIPCION_CORTA: `La descripción debe tener al menos ${VALIDACIONES.descripcion.minLength} caracteres`,
    HORA_INVALIDA: 'La hora debe estar en formato HH:mm',
    DIAS_REQUERIDOS: 'Selecciona al menos un día para frecuencia semanal',
    DIA_MES_INVALIDO: `El día debe estar entre ${VALIDACIONES.diasMes.minValue} y ${VALIDACIONES.diasMes.maxValue}`,
} as const;

/**
 * Calcular próximo envío
 */
export function calcularProximoEnvio(
    frecuencia: string,
    horaEnvio: string,
    diasSemana?: string[],
    diaMes?: number
): string {
    const ahora = new Date();
    const [hora, minutos] = horaEnvio.split(':').map(Number);

    const proximoEnvio = new Date(ahora);
    proximoEnvio.setHours(hora, minutos, 0, 0);

    // Si la hora ya pasó hoy, calcular el próximo envío
    if (proximoEnvio <= ahora) {
        proximoEnvio.setDate(proximoEnvio.getDate() + 1);
    }

    switch (frecuencia) {
        case 'diario':
            return proximoEnvio.toLocaleDateString() + ` a las ${horaEnvio}`;

        case 'semanal':
            // Encontrar el próximo día de la semana
            if (diasSemana && diasSemana.length > 0) {
                const diasNumeros = diasSemana.map((d) => DIAS_SEMANA_ES.indexOf(d));
                while (!diasNumeros.includes(proximoEnvio.getDay())) {
                    proximoEnvio.setDate(proximoEnvio.getDate() + 1);
                }
                return proximoEnvio.toLocaleDateString() + ` a las ${horaEnvio}`;
            }
            return '-';

        case 'mensual':
            if (diaMes) {
                proximoEnvio.setDate(diaMes);
                if (proximoEnvio <= ahora) {
                    proximoEnvio.setMonth(proximoEnvio.getMonth() + 1);
                }
                return proximoEnvio.toLocaleDateString() + ` a las ${horaEnvio}`;
            }
            return '-';

        case 'una_vez':
            return proximoEnvio.toLocaleDateString() + ` a las ${horaEnvio}`;

        default:
            return '-';
    }
}

/**
 * Validar si una notificación es válida
 */
export function validarNotificacion(datos: {
    titulo?: string;
    descripcion?: string;
    horaEnvio?: string;
    frecuencia?: string;
    diasSemana?: string[];
    diaMes?: number;
}): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!datos.titulo) {
        errores.push(MENSAJES_ERROR.TITULO_REQUERIDO);
    }

    if (!datos.descripcion) {
        errores.push(MENSAJES_ERROR.DESCRIPCION_REQUERIDA);
    }

    if (!datos.horaEnvio || !VALIDACIONES.horaEnvio.pattern.test(datos.horaEnvio)) {
        errores.push(MENSAJES_ERROR.HORA_INVALIDA);
    }

    if (
        datos.frecuencia === 'semanal' &&
        (!datos.diasSemana || datos.diasSemana.length === 0)
    ) {
        errores.push(MENSAJES_ERROR.DIAS_REQUERIDOS);
    }

    if (
        datos.frecuencia === 'mensual' &&
        (!datos.diaMes ||
            datos.diaMes < VALIDACIONES.diasMes.minValue ||
            datos.diaMes > VALIDACIONES.diasMes.maxValue)
    ) {
        errores.push(MENSAJES_ERROR.DIA_MES_INVALIDO);
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}
