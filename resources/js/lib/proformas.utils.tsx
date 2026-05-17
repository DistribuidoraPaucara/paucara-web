/**
 * Utilidades centralizadas para el módulo de proformas
 * Evita duplicación de código y proporciona una única fuente de verdad
 */

// Re-exportar desde domain
export { getEstadoBadge, PROFORMA_ESTADOS, validacionesProforma, MOTIVOS_RECHAZO_PROFORMA } from '@/domain/entities/proformas';

// Función para formatear fechas a formato legible en español
export const formatearFecha = (fecha?: string): string => {
    if (!fecha) return 'No especificada';
    try {
        // Manejar formato ISO completo (2025-12-05T09:00:00.000000Z) o solo fecha (2025-12-05)
        const date = new Date(fecha);

        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }

        const opciones: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const formatted = date.toLocaleDateString('es-BO', opciones);
        // Capitalizar primera letra
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
        return 'Fecha inválida';
    }
};

// Función para formatear hora desde timestamp ISO (para mostrar)
export const formatearHora = (horaOTimestamp?: string): string => {
    if (!horaOTimestamp) return 'No especificada';

    try {
        // Si contiene 'T', es un timestamp ISO completo
        if (horaOTimestamp.includes('T')) {
            const date = new Date(horaOTimestamp);
            if (isNaN(date.getTime())) return 'Hora inválida';

            const horas = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');
            return `${horas}:${minutos}`;
        }

        // Si es formato HH:mm, devolverlo tal cual
        if (horaOTimestamp.match(/^\d{2}:\d{2}/)) {
            return horaOTimestamp;
        }

        // Si es solo hora en otros formatos, intentar parsear
        return horaOTimestamp;
    } catch {
        return 'Hora inválida';
    }
};

// Función para extraer fecha en formato YYYY-MM-DD desde timestamp ISO (para input date)
export const extraerFechaInput = (timestamp?: string): string => {
    if (!timestamp) return '';
    try {
        // Si es timestamp ISO completo, extraer la fecha
        if (timestamp.includes('T')) {
            return timestamp.split('T')[0]; // "2025-12-05T09:00:00.000000Z" → "2025-12-05"
        }
        // Si ya es formato YYYY-MM-DD, devolverlo
        if (timestamp.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return timestamp;
        }
        return '';
    } catch {
        return '';
    }
};

// Función para extraer hora en formato HH:mm desde timestamp ISO (para input time)
export const extraerHoraInput = (timestamp?: string): string => {
    if (!timestamp) return '';
    try {
        // Si contiene 'T', es timestamp ISO completo
        if (timestamp.includes('T')) {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return '';
            const horas = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');
            return `${horas}:${minutos}`;
        }
        // Si ya es formato HH:mm, devolverlo
        if (timestamp.match(/^\d{2}:\d{2}/)) {
            return timestamp;
        }
        return '';
    } catch {
        return '';
    }
};