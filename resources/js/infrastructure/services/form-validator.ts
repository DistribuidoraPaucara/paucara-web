/**
 * Form Validator - Validador reutilizable y composable
 *
 * Propósito: Centralizar reglas de validación para evitar duplicación
 * en servicios y componentes
 *
 * Uso:
 * const validator = new FormValidator();
 * validator.addRule('email', emailValidator)
 *          .addRule('minLength', minLengthValidator)
 *          .validate(data);
 */

export type ValidationRule<T = any> = (value: T, fieldName?: string) => string | null;
export type AsyncValidationRule<T = any> = (value: T, fieldName?: string) => Promise<string | null>;

export class FormValidator {
  private rules: Map<string, ValidationRule[]> = new Map();
  private asyncRules: Map<string, AsyncValidationRule[]> = new Map();

  /**
   * Agregar regla de validación sincrónica a un campo
   */
  addRule(fieldName: string, rule: ValidationRule): this {
    if (!this.rules.has(fieldName)) {
      this.rules.set(fieldName, []);
    }
    this.rules.get(fieldName)!.push(rule);
    return this;
  }

  /**
   * Agregar regla de validación asincrónica a un campo
   */
  addAsyncRule(fieldName: string, rule: AsyncValidationRule): this {
    if (!this.asyncRules.has(fieldName)) {
      this.asyncRules.set(fieldName, []);
    }
    this.asyncRules.get(fieldName)!.push(rule);
    return this;
  }

  /**
   * Validar datos de forma sincrónica
   */
  validate(data: Record<string, any>): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const [fieldName, fieldRules] of this.rules.entries()) {
      const value = data[fieldName];
      for (const rule of fieldRules) {
        const error = rule(value, fieldName);
        if (error) {
          errors[fieldName] = error;
          break; // Parar en el primer error del campo
        }
      }
    }

    return errors;
  }

  /**
   * Validar datos de forma asincrónica
   */
  async validateAsync(data: Record<string, any>): Promise<Record<string, string>> {
    const syncErrors = this.validate(data);

    // Si hay errores sincronos, retornarlos inmediatamente
    if (Object.keys(syncErrors).length > 0) {
      return syncErrors;
    }

    const asyncErrors: Record<string, string> = {};

    for (const [fieldName, fieldRules] of this.asyncRules.entries()) {
      const value = data[fieldName];
      for (const rule of fieldRules) {
        const error = await rule(value, fieldName);
        if (error) {
          asyncErrors[fieldName] = error;
          break;
        }
      }
    }

    return asyncErrors;
  }
}

// ========================================
// VALIDADORES COMUNES PREDEFINIDOS
// ========================================

export const Validators = {
  /**
   * Validar que no esté vacío
   */
  required: (fieldName = 'Campo'): ValidationRule =>
    (value) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} es requerido`;
      }
      return null;
    },

  /**
   * Validar email
   */
  email: (fieldName = 'Email'): ValidationRule =>
    (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return `${fieldName} no es válido`;
      }
      return null;
    },

  /**
   * Validar longitud mínima
   */
  minLength: (min: number, fieldName = 'Campo'): ValidationRule =>
    (value) => {
      if (!value || String(value).length < min) {
        return `${fieldName} debe tener al menos ${min} caracteres`;
      }
      return null;
    },

  /**
   * Validar longitud máxima
   */
  maxLength: (max: number, fieldName = 'Campo'): ValidationRule =>
    (value) => {
      if (value && String(value).length > max) {
        return `${fieldName} no puede exceder ${max} caracteres`;
      }
      return null;
    },

  /**
   * Validar número mínimo
   */
  minNumber: (min: number, fieldName = 'Número'): ValidationRule =>
    (value) => {
      if (value !== null && value !== undefined && Number(value) < min) {
        return `${fieldName} debe ser mayor o igual a ${min}`;
      }
      return null;
    },

  /**
   * Validar número máximo
   */
  maxNumber: (max: number, fieldName = 'Número'): ValidationRule =>
    (value) => {
      if (value !== null && value !== undefined && Number(value) > max) {
        return `${fieldName} no puede exceder ${max}`;
      }
      return null;
    },

  /**
   * Validar que sea número
   */
  number: (fieldName = 'Número'): ValidationRule =>
    (value) => {
      if (value && isNaN(Number(value))) {
        return `${fieldName} debe ser un número`;
      }
      return null;
    },

  /**
   * Validar que sea entero
   */
  integer: (fieldName = 'Número'): ValidationRule =>
    (value) => {
      if (value && !Number.isInteger(Number(value))) {
        return `${fieldName} debe ser un número entero`;
      }
      return null;
    },

  /**
   * Validar URL
   */
  url: (fieldName = 'URL'): ValidationRule =>
    (value) => {
      if (!value) return null;
      try {
        new URL(String(value));
        return null;
      } catch {
        return `${fieldName} no es una URL válida`;
      }
    },

  /**
   * Validar que cumpla patrón regex
   */
  pattern: (regex: RegExp, fieldName = 'Campo'): ValidationRule =>
    (value) => {
      if (!value || !regex.test(String(value))) {
        return `${fieldName} no cumple el formato requerido`;
      }
      return null;
    },

  /**
   * Validar que sea igual a otro campo
   */
  matches: (otherFieldValue: any, fieldName = 'Campo'): ValidationRule =>
    (value) => {
      if (value !== otherFieldValue) {
        return `${fieldName} no coincide`;
      }
      return null;
    },

  /**
   * Validador personalizado con función
   */
  custom: (fn: (value: any) => boolean, message: string): ValidationRule =>
    (value) => {
      if (!fn(value)) {
        return message;
      }
      return null;
    },

  /**
   * Validar que NO esté vacío (inverso de required)
   */
  notEmpty: (): ValidationRule =>
    (value) => {
      if (!value) {
        return 'Este campo no puede estar vacío';
      }
      return null;
    },

  /**
   * Validar NIT argentino (formato simple)
   */
  nitArgentino: (): ValidationRule =>
    (value) => {
      if (!value) return null;
      // Formato simple: puede ser 7-11 dígitos o con guión
      const nitRegex = /^\d{7,11}$|^\d{7,8}-\d{1,4}$/;
      if (!nitRegex.test(String(value).trim())) {
        return 'NIT no es válido. Debe tener 7-11 dígitos';
      }
      return null;
    },

  /**
   * Validar fecha en formato DD/MM/YYYY o YYYY-MM-DD
   */
  date: (): ValidationRule =>
    (value) => {
      if (!value) return null;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(String(value))) {
        return 'Formato de fecha no válido (use DD/MM/YYYY o YYYY-MM-DD)';
      }
      return null;
    },

  /**
   * Validar que la fecha sea en el futuro
   */
  futureDate: (): ValidationRule =>
    (value) => {
      if (!value) return null;
      const date = new Date(String(value));
      if (date <= new Date()) {
        return 'La fecha debe ser en el futuro';
      }
      return null;
    },

  /**
   * Validar que la fecha sea en el pasado
   */
  pastDate: (): ValidationRule =>
    (value) => {
      if (!value) return null;
      const date = new Date(String(value));
      if (date >= new Date()) {
        return 'La fecha debe ser en el pasado';
      }
      return null;
    },
};

// ========================================
// VALIDADORES ASINCRONOS COMUNES
// ========================================

export const AsyncValidators = {
  /**
   * Validar que un email único (requiere función de chequeo)
   */
  uniqueEmail: (checkFn: (email: string) => Promise<boolean>): AsyncValidationRule =>
    async (value) => {
      if (!value) return null;
      const isUnique = await checkFn(String(value));
      return isUnique ? null : 'Este email ya está registrado';
    },

  /**
   * Validador personalizado asincrónico
   */
  custom: (fn: (value: any) => Promise<boolean>, message: string): AsyncValidationRule =>
    async (value) => {
      const isValid = await fn(value);
      return isValid ? null : message;
    },
};
