/**
 * DateFormatter - Utilidad para estandarizar formatos de fecha
 *
 * Propósito: Centralizar formatos de fecha en toda la app
 * Eliminar duplicación de lógica de formateo de fechas
 *
 * Beneficio: -30 líneas de formateo de fecha duplicado
 *
 * Ejemplo:
 * DateFormatter.format('2024-01-15', 'DD/MM/YYYY') // "15/01/2024"
 * DateFormatter.formatDate(new Date()) // "15 de enero de 2024"
 */

export class DateFormatter {
  /**
   * Formatos predefinidos
   */
  static readonly FORMATS = {
    DATE: 'DD/MM/YYYY', // 15/01/2024
    TIME: 'HH:mm:ss', // 14:30:00
    DATETIME: 'DD/MM/YYYY HH:mm', // 15/01/2024 14:30
    ISO: 'YYYY-MM-DD', // 2024-01-15
    YEAR_MONTH: 'MM/YYYY', // 01/2024
    MONTH_DAY: 'DD/MM', // 15/01
    LONG: 'DD [de] MMMM [de] YYYY', // 15 de enero de 2024
    SHORT: 'D MMM YYYY', // 15 ene 2024
  };

  /**
   * Nombres de meses en español
   */
  private static readonly MONTHS_SPANISH = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  /**
   * Nombres de días en español
   */
  private static readonly DAYS_SPANISH = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  /**
   * Convertir string a Date
   * @param dateString String en formato YYYY-MM-DD o DD/MM/YYYY
   * @returns Date object o null si no es válido
   */
  static parse(dateString: string): Date | null {
    if (!dateString) return null;

    try {
      // Intentar formato ISO (2024-01-15)
      if (dateString.includes('-') && !dateString.includes('/')) {
        return new Date(dateString);
      }

      // Intentar formato DD/MM/YYYY (15/01/2024)
      if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          return new Date(year, month - 1, day);
        }
      }

      // Fallback: Date() parser nativo
      return new Date(dateString);
    } catch {
      return null;
    }
  }

  /**
   * Formatear fecha a string
   * @param date String o Date
   * @param format Formato deseado (ej: 'DD/MM/YYYY')
   * @returns String formateado
   *
   * Ejemplos:
   * format('2024-01-15', 'DD/MM/YYYY') => '15/01/2024'
   * format(new Date(), 'DD [de] MMMM') => '15 de enero'
   */
  static format(date: string | Date, format: string = this.FORMATS.DATE): string {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;

    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();
    const dayOfWeek = dateObj.getDay();

    let result = format;

    // Año
    result = result.replace('YYYY', String(year));
    result = result.replace('YY', String(year).slice(-2));

    // Mes
    result = result.replace('MMMM', this.MONTHS_SPANISH[month - 1]);
    result = result.replace('MMM', this.MONTHS_SPANISH[month - 1].slice(0, 3));
    result = result.replace('MM', String(month).padStart(2, '0'));
    result = result.replace('M', String(month));

    // Día
    result = result.replace('DD', String(day).padStart(2, '0'));
    result = result.replace('D', String(day));
    result = result.replace('dddd', this.DAYS_SPANISH[dayOfWeek]);
    result = result.replace('ddd', this.DAYS_SPANISH[dayOfWeek].slice(0, 3));

    // Hora
    result = result.replace('HH', String(hour).padStart(2, '0'));
    result = result.replace('H', String(hour));
    result = result.replace('hh', String(hour % 12 || 12).padStart(2, '0'));
    result = result.replace('h', String(hour % 12 || 12));

    // Minutos
    result = result.replace('mm', String(minute).padStart(2, '0'));
    result = result.replace('m', String(minute));

    // Segundos
    result = result.replace('ss', String(second).padStart(2, '0'));
    result = result.replace('s', String(second));

    // AM/PM
    result = result.replace('A', hour < 12 ? 'AM' : 'PM');
    result = result.replace('a', hour < 12 ? 'am' : 'pm');

    // Remover corchetes
    result = result.replace(/\[|\]/g, '');

    return result;
  }

  /**
   * Formatear como fecha corta (DD/MM/YYYY)
   * Ejemplo: 15/01/2024
   */
  static formatDate(date: string | Date): string {
    return this.format(date, this.FORMATS.DATE);
  }

  /**
   * Formatear como fecha larga en español (15 de enero de 2024)
   * Ejemplo: 15 de enero de 2024
   */
  static formatDateLong(date: string | Date): string {
    return this.format(date, this.FORMATS.LONG);
  }

  /**
   * Formatear como fecha y hora (DD/MM/YYYY HH:mm)
   * Ejemplo: 15/01/2024 14:30
   */
  static formatDateTime(date: string | Date): string {
    return this.format(date, this.FORMATS.DATETIME);
  }

  /**
   * Formatear como ISO (YYYY-MM-DD)
   * Ejemplo: 2024-01-15
   */
  static formatISO(date: string | Date): string {
    return this.format(date, this.FORMATS.ISO);
  }

  /**
   * Formatear como hora (HH:mm)
   * Ejemplo: 14:30
   */
  static formatTime(date: string | Date): string {
    return this.format(date, 'HH:mm');
  }

  /**
   * Obtener nombre del mes
   * Ejemplo: 'enero' para mes 1
   */
  static getMonthName(month: number): string {
    return this.MONTHS_SPANISH[Math.max(0, Math.min(11, month - 1))];
  }

  /**
   * Obtener nombre del día de semana
   * Ejemplo: 'lunes' para dayOfWeek 1
   */
  static getDayName(dayOfWeek: number): string {
    return this.DAYS_SPANISH[Math.max(0, Math.min(6, dayOfWeek))];
  }

  /**
   * Obtener tiempo relativo (ej: "hace 2 horas")
   * @param date String o Date
   * @returns String describiendo tiempo relativo
   */
  static getRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;

    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'hace unos segundos';
    if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }

    return this.formatDate(dateObj);
  }

  /**
   * Verificar si fecha es hoy
   */
  static isToday(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;
    const today = new Date();

    return (
      dateObj &&
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Verificar si fecha es en el pasado
   */
  static isPast(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;
    return dateObj ? dateObj.getTime() < new Date().getTime() : false;
  }

  /**
   * Verificar si fecha es en el futuro
   */
  static isFuture(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;
    return dateObj ? dateObj.getTime() > new Date().getTime() : false;
  }

  /**
   * Diferencia en días entre dos fechas
   */
  static diffInDays(date1: string | Date, date2: string | Date): number {
    const d1 = typeof date1 === 'string' ? this.parse(date1) : date1;
    const d2 = typeof date2 === 'string' ? this.parse(date2) : date2;

    if (!d1 || !d2) return 0;

    const diffMs = d2.getTime() - d1.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Agregar días a una fecha
   */
  static addDays(date: string | Date, days: number): Date {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;

    if (!dateObj) return new Date();

    const result = new Date(dateObj);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Obtener inicio de mes
   */
  static getMonthStart(date: string | Date): Date {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;

    if (!dateObj) return new Date();

    return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
  }

  /**
   * Obtener fin de mes
   */
  static getMonthEnd(date: string | Date): Date {
    const dateObj = typeof date === 'string' ? this.parse(date) : date;

    if (!dateObj) return new Date();

    return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
  }
}
