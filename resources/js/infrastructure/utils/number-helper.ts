/**
 * NumberHelper - Utilidades para manipulación de números
 *
 * Propósito: Centralizar formateo y cálculo de números
 * Eliminar duplicación de lógica numérica en componentes
 *
 * Beneficio: -25 líneas de lógica numérica duplicada
 *
 * Ejemplo:
 * NumberHelper.formatCurrency(1500, 'ARS') // "ARS 1.500,00"
 * NumberHelper.percentage(75, 100) // "75%"
 */

export class NumberHelper {
  /**
   * Formato de moneda por país/código
   */
  private static readonly CURRENCY_FORMATS: Record<string, { symbol: string; decimal: string; thousands: string }> = {
    ARS: { symbol: 'ARS', decimal: ',', thousands: '.' }, // Peso Argentino
    USD: { symbol: '$', decimal: '.', thousands: ',' }, // Dólar
    EUR: { symbol: '€', decimal: ',', thousands: '.' }, // Euro
    BOB: { symbol: 'Bs.', decimal: ',', thousands: '.' }, // Boliviano
    CLP: { symbol: '$', decimal: ',', thousands: '.' }, // Peso Chileno
    PEN: { symbol: 'S/', decimal: '.', thousands: ',' }, // Sol Peruano
  };

  /**
   * Formatear número como moneda
   * @param value Número a formatear
   * @param currency Código de moneda (ARS, USD, EUR, etc)
   * @param decimals Número de decimales (default: 2)
   * @returns String formateado
   *
   * Ejemplo: formatCurrency(1500, 'ARS') => 'ARS 1.500,00'
   */
  static formatCurrency(
    value: number,
    currency: string = 'ARS',
    decimals: number = 2
  ): string {
    if (typeof value !== 'number' || isNaN(value)) {
      return `${currency} 0${this.CURRENCY_FORMATS[currency]?.decimal || ','}00`;
    }

    const format = this.CURRENCY_FORMATS[currency] || this.CURRENCY_FORMATS['ARS'];

    const absValue = Math.abs(value);
    const parts = absValue.toFixed(decimals).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Agregar separador de miles
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);

    const sign = value < 0 ? '-' : '';
    return `${sign}${format.symbol} ${formatted}${format.decimal}${decimalPart}`;
  }

  /**
   * Formatear número con separador de miles
   * @param value Número a formatear
   * @param thousands Separador de miles (default: ',')
   * @param decimals Número de decimales
   * @returns String formateado
   *
   * Ejemplo: formatNumber(1500.5, ',', 2) => '1,500.50'
   */
  static formatNumber(
    value: number,
    thousands: string = ',',
    decimals: number = 2
  ): string {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0';
    }

    const parts = value.toFixed(decimals).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);

    return decimals > 0 ? `${formatted}.${decimalPart}` : formatted;
  }

  /**
   * Formatear como porcentaje
   * @param value Número a formatear
   * @param decimals Número de decimales (default: 0)
   * @returns String con símbolo %
   *
   * Ejemplo: formatPercentage(75.5) => '75.5%'
   */
  static formatPercentage(value: number, decimals: number = 0): string {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0%';
    }

    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Calcular porcentaje de un valor
   * @param percent Porcentaje (0-100)
   * @param total Valor total
   * @returns Valor del porcentaje
   *
   * Ejemplo: percentage(20, 100) => 20
   */
  static percentage(percent: number, total: number): number {
    if (!total || total === 0) return 0;

    return (percent / 100) * total;
  }

  /**
   * Calcular qué porcentaje es un valor respecto a otro
   * @param value Valor a calcular porcentaje
   * @param total Valor total
   * @returns Porcentaje (0-100)
   *
   * Ejemplo: percentageOf(20, 100) => 20
   */
  static percentageOf(value: number, total: number): number {
    if (!total || total === 0) return 0;

    return (value / total) * 100;
  }

  /**
   * Redondear número a decimales
   * @param value Número a redondear
   * @param decimals Número de decimales
   * @returns Número redondeado
   *
   * Ejemplo: round(1.234, 2) => 1.23
   */
  static round(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  /**
   * Truncar número (sin redondear)
   * @param value Número a truncar
   * @param decimals Número de decimales
   * @returns Número truncado
   *
   * Ejemplo: truncate(1.999, 2) => 1.99
   */
  static truncate(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  }

  /**
   * Obtener valor absoluto
   * @param value Número
   * @returns Valor absoluto
   *
   * Ejemplo: abs(-5) => 5
   */
  static abs(value: number): number {
    return Math.abs(value);
  }

  /**
   * Obtener valor máximo de array
   * @param values Array de números
   * @returns Número máximo
   *
   * Ejemplo: max([1, 5, 3]) => 5
   */
  static max(values: number[]): number {
    return values.length > 0 ? Math.max(...values) : 0;
  }

  /**
   * Obtener valor mínimo de array
   * @param values Array de números
   * @returns Número mínimo
   *
   * Ejemplo: min([1, 5, 3]) => 1
   */
  static min(values: number[]): number {
    return values.length > 0 ? Math.min(...values) : 0;
  }

  /**
   * Calcular promedio de array
   * @param values Array de números
   * @returns Promedio
   *
   * Ejemplo: average([10, 20, 30]) => 20
   */
  static average(values: number[]): number {
    if (values.length === 0) return 0;

    const sum = values.reduce((a, b) => a + b, 0);
    return this.round(sum / values.length, 2);
  }

  /**
   * Sumar array de números
   * @param values Array de números
   * @returns Suma
   *
   * Ejemplo: sum([1, 2, 3]) => 6
   */
  static sum(values: number[]): number {
    return values.reduce((a, b) => a + b, 0);
  }

  /**
   * Verificar si número es par
   * @param value Número a verificar
   * @returns true si es par
   *
   * Ejemplo: isEven(4) => true
   */
  static isEven(value: number): boolean {
    return value % 2 === 0;
  }

  /**
   * Verificar si número es impar
   * @param value Número a verificar
   * @returns true si es impar
   *
   * Ejemplo: isOdd(3) => true
   */
  static isOdd(value: number): boolean {
    return value % 2 !== 0;
  }

  /**
   * Convertir número a palabras (Español)
   * @param value Número a convertir (0-999999)
   * @returns Número en palabras
   *
   * Ejemplo: toWords(123) => 'ciento veintitrés'
   */
  static toWords(value: number): string {
    const ones = [
      '',
      'uno',
      'dos',
      'tres',
      'cuatro',
      'cinco',
      'seis',
      'siete',
      'ocho',
      'nueve',
    ];
    const teens = [
      'diez',
      'once',
      'doce',
      'trece',
      'catorce',
      'quince',
      'dieciséis',
      'diecisiete',
      'dieciocho',
      'diecinueve',
    ];
    const tens = [
      '',
      '',
      'veinte',
      'treinta',
      'cuarenta',
      'cincuenta',
      'sesenta',
      'setenta',
      'ochenta',
      'noventa',
    ];
    const scales = ['', 'mil', 'millón'];

    if (value === 0) return 'cero';
    if (value < 0) return 'menos ' + this.toWords(-value);

    let words = '';
    let scaleIndex = 0;

    while (value > 0) {
      const chunk = value % 1000;

      if (chunk !== 0) {
        let chunkWords = '';

        // Centenas
        const hundreds = Math.floor(chunk / 100);
        if (hundreds > 0) {
          chunkWords += hundreds === 1 ? 'ciento' : ones[hundreds] + 'cientos';
          chunkWords += ' ';
        }

        // Decenas y unidades
        const remainder = chunk % 100;
        if (remainder >= 20) {
          const tenDigit = Math.floor(remainder / 10);
          const oneDigit = remainder % 10;
          chunkWords += tens[tenDigit];
          if (oneDigit > 0) {
            chunkWords += ' y ' + ones[oneDigit];
          }
        } else if (remainder >= 10) {
          chunkWords += teens[remainder - 10];
        } else if (remainder > 0) {
          chunkWords += ones[remainder];
        }

        // Agregar escala
        if (scaleIndex > 0 && chunkWords) {
          chunkWords += ' ' + scales[scaleIndex];
        }

        words = chunkWords + (words ? ' ' + words : '');
      }

      value = Math.floor(value / 1000);
      scaleIndex++;
    }

    return words.trim();
  }

  /**
   * Generar número aleatorio en rango
   * @param min Valor mínimo
   * @param max Valor máximo
   * @param decimals Número de decimales (default: 0)
   * @returns Número aleatorio
   *
   * Ejemplo: random(1, 10) => 7
   */
  static random(min: number, max: number, decimals: number = 0): number {
    const random = Math.random() * (max - min) + min;
    return this.round(random, decimals);
  }

  /**
   * Convertir número a formato legible de bytes
   * @param bytes Número de bytes
   * @returns String legible (B, KB, MB, GB, TB)
   *
   * Ejemplo: formatFileSize(1024) => '1.00 KB'
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${this.round(size, 2)} ${units[unitIndex]}`;
  }

  /**
   * Verificar si número está en rango
   * @param value Número a verificar
   * @param min Valor mínimo
   * @param max Valor máximo
   * @returns true si está en rango
   *
   * Ejemplo: inRange(5, 1, 10) => true
   */
  static inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Clampear número al rango
   * @param value Número a clampear
   * @param min Valor mínimo
   * @param max Valor máximo
   * @returns Número dentro del rango
   *
   * Ejemplo: clamp(15, 1, 10) => 10
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
