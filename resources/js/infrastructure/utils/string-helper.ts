/**
 * StringHelper - Utilidades para manipulación de strings
 *
 * Propósito: Centralizar funciones comunes de string
 * Eliminar duplicación de lógica de string en componentes
 *
 * Beneficio: -20 líneas de lógica de string duplicada
 *
 * Ejemplo:
 * StringHelper.truncate('Nombre muy largo', 10) // "Nombre ..."
 * StringHelper.slug('Nombre del Producto') // "nombre-del-producto"
 */

export class StringHelper {
  /**
   * Convertir a slug (URL-friendly)
   * @param str String a convertir
   * @param separator Separador (default: '-')
   * @returns String en formato slug
   *
   * Ejemplo: slug('Nombre del Producto') => 'nombre-del-producto'
   */
  static slug(str: string, separator: string = '-'): string {
    if (!str) return '';

    return str
      .toLowerCase() // Minúsculas
      .trim() // Remover espacios
      .replace(/[áàäâ]/g, 'a') // Reemplazar caracteres acentuados
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]+/g, separator) // Reemplazar no-alfanuméricos
      .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // Remover separadores al inicio/fin
  }

  /**
   * Truncar string a longitud máxima
   * @param str String a truncar
   * @param maxLength Longitud máxima
   * @param suffix Sufijo (default: '...')
   * @returns String truncado
   *
   * Ejemplo: truncate('Nombre muy largo', 10) => 'Nombre ...'
   */
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (!str || str.length <= maxLength) return str;

    return str.slice(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Capitalizar primera letra
   * @param str String a capitalizar
   * @returns String capitalizado
   *
   * Ejemplo: capitalize('nombre') => 'Nombre'
   */
  static capitalize(str: string): string {
    if (!str) return '';

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Capitalizar cada palabra
   * @param str String a capitalizar
   * @returns String con cada palabra capitalizada
   *
   * Ejemplo: titleCase('nombre del producto') => 'Nombre Del Producto'
   */
  static titleCase(str: string): string {
    if (!str) return '';

    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Trim de espacios en blanco
   * @param str String a limpiar
   * @returns String sin espacios al inicio/fin
   *
   * Ejemplo: trim('  nombre  ') => 'nombre'
   */
  static trim(str: string): string {
    return str?.trim?.() ?? '';
  }

  /**
   * Remover acentos de string
   * @param str String con posibles acentos
   * @returns String sin acentos
   *
   * Ejemplo: removeAccents('José María') => 'Jose Maria'
   */
  static removeAccents(str: string): string {
    if (!str) return '';

    return str
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c');
  }

  /**
   * Verificar si string es vacío o solo espacios
   * @param str String a verificar
   * @returns true si está vacío
   *
   * Ejemplo: isEmpty('  ') => true
   */
  static isEmpty(str: string): boolean {
    return !str || !str.trim();
  }

  /**
   * Verificar si string es visible (no vacío)
   * @param str String a verificar
   * @returns true si tiene contenido
   */
  static isVisible(str: string): boolean {
    return !this.isEmpty(str);
  }

  /**
   * Contar palabras en string
   * @param str String a contar
   * @returns Número de palabras
   *
   * Ejemplo: countWords('Hola mundo') => 2
   */
  static countWords(str: string): number {
    if (!str) return 0;

    return str.trim().split(/\s+/).length;
  }

  /**
   * Remover caracteres especiales
   * @param str String a limpiar
   * @returns String sin caracteres especiales
   *
   * Ejemplo: removeSpecialChars('abc@123!') => 'abc123'
   */
  static removeSpecialChars(str: string): string {
    if (!str) return '';

    return str.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Remover números
   * @param str String a limpiar
   * @returns String sin números
   *
   * Ejemplo: removeNumbers('abc123') => 'abc'
   */
  static removeNumbers(str: string): string {
    if (!str) return '';

    return str.replace(/[0-9]/g, '');
  }

  /**
   * Remover letras
   * @param str String a limpiar
   * @returns String sin letras
   *
   * Ejemplo: removeLetters('abc123') => '123'
   */
  static removeLetters(str: string): string {
    if (!str) return '';

    return str.replace(/[a-zA-Z]/g, '');
  }

  /**
   * Reemplazar múltiples espacios con uno solo
   * @param str String a limpiar
   * @returns String con espacios normalizados
   *
   * Ejemplo: normalizeSpaces('texto  con    espacios') => 'texto con espacios'
   */
  static normalizeSpaces(str: string): string {
    if (!str) return '';

    return str.trim().replace(/\s+/g, ' ');
  }

  /**
   * Invertir string
   * @param str String a invertir
   * @returns String invertido
   *
   * Ejemplo: reverse('hola') => 'aloh'
   */
  static reverse(str: string): string {
    if (!str) return '';

    return str.split('').reverse().join('');
  }

  /**
   * Verificar si string es palíndromo
   * @param str String a verificar
   * @returns true si es palíndromo
   *
   * Ejemplo: isPalindrome('ama') => true
   */
  static isPalindrome(str: string): boolean {
    if (!str) return false;

    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === this.reverse(cleaned);
  }

  /**
   * Repetir string
   * @param str String a repetir
   * @param count Número de repeticiones
   * @returns String repetido
   *
   * Ejemplo: repeat('ab', 3) => 'ababab'
   */
  static repeat(str: string, count: number): string {
    return str.repeat(Math.max(0, count));
  }

  /**
   * Verificar si string contiene substring (case-insensitive)
   * @param str String a buscar en
   * @param substring Substring a buscar
   * @returns true si contiene
   *
   * Ejemplo: contains('Hola Mundo', 'hola') => true
   */
  static contains(str: string, substring: string): boolean {
    if (!str || !substring) return false;

    return str.toLowerCase().includes(substring.toLowerCase());
  }

  /**
   * Verificar si string comienza con substring (case-insensitive)
   * @param str String a verificar
   * @param prefix Prefijo a buscar
   * @returns true si comienza con
   *
   * Ejemplo: startsWith('Hola', 'hol') => true
   */
  static startsWith(str: string, prefix: string): boolean {
    if (!str || !prefix) return false;

    return str.toLowerCase().startsWith(prefix.toLowerCase());
  }

  /**
   * Verificar si string termina con substring (case-insensitive)
   * @param str String a verificar
   * @param suffix Sufijo a buscar
   * @returns true si termina con
   *
   * Ejemplo: endsWith('Hola', 'ola') => true
   */
  static endsWith(str: string, suffix: string): boolean {
    if (!str || !suffix) return false;

    return str.toLowerCase().endsWith(suffix.toLowerCase());
  }

  /**
   * Extraer números de string
   * @param str String a procesar
   * @returns Array de números encontrados
   *
   * Ejemplo: extractNumbers('abc123def456') => [123, 456]
   */
  static extractNumbers(str: string): number[] {
    if (!str) return [];

    const matches = str.match(/\d+/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Formatear string como líneas (quebrar en múltiples líneas)
   * @param str String a formatear
   * @param maxLength Longitud máxima por línea
   * @returns Array de líneas
   *
   * Ejemplo: toLines('texto muy largo', 5) => ['texto', 'muy', 'largo']
   */
  static toLines(str: string, maxLength: number = 80): string[] {
    if (!str) return [];

    const words = str.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxLength) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  }
}
