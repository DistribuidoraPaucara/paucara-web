/**
 * ProductoValidators - Validadores reutilizables para productos
 *
 * Propósito: Centralizar reglas de validación de productos
 * para poder usarlas en múltiples lugares (service, form, etc)
 *
 * Beneficio: Validación consistente, fácil de mantener, sin duplicación
 */

import { Validators } from '@/infrastructure/services/form-validator';

export const ProductoValidators = {
  // Validador: Nombre requerido
  nombre: Validators.required('Nombre del producto es requerido'),

  // Validador: Categoría requerida
  categoria: Validators.required('Categoría es requerida'),

  // Validador: Unidad de medida requerida
  unidadMedida: Validators.required('Unidad de medida es requerida'),

  // Validador: Peso no negativo
  peso: Validators.custom((value: any) => {
    if (value && Number(value) < 0) {
      return 'Peso no puede ser negativo';
    }
    return null;
  }),

  // Validador: SKU único (máximo 100 caracteres)
  sku: Validators.custom((value: any) => {
    if (!value) return null;
    if (String(value).length > 100) {
      return 'SKU no puede exceder 100 caracteres';
    }
    return null;
  }),

  // Validador: Código de barras en array
  codigoBarras: (index: number) => Validators.custom((value: any) => {
    if (!value?.trim?.()) {
      return `Código de barras ${index + 1} no puede estar vacío`;
    }
    if (String(value).length > 255) {
      return `Código de barras ${index + 1} no puede exceder 255 caracteres`;
    }
    return null;
  }),

  // Validador: Tipo de precio en array
  tipoPrecio: (index: number) => Validators.custom((value: any) => {
    if (!value || value === '') {
      return `Tipo de precio ${index + 1} es requerido`;
    }
    return null;
  }),

  // Validador: Monto de precio en array
  montoPrecio: (index: number) => Validators.custom((value: any) => {
    if (Number(value) < 0) {
      return `Monto del precio ${index + 1} no puede ser negativo`;
    }
    if (value === undefined || value === null || value === '') {
      return `Monto del precio ${index + 1} es requerido`;
    }
    return null;
  }),

  // Validador: Descripción (máximo 1000 caracteres)
  descripcion: Validators.custom((value: any) => {
    if (!value) return null;
    if (String(value).length > 1000) {
      return 'Descripción no puede exceder 1000 caracteres';
    }
    return null;
  }),
};

/**
 * Función helper: Validar array de códigos
 *
 * Uso:
 * const errors = await validateCodigosBarra(data.codigos);
 */
export function validateCodigosBarra(codigos: any[]): string[] {
  const errors: string[] = [];
  if (!Array.isArray(codigos)) return errors;

  codigos.forEach((codigo, index) => {
    const error = ProductoValidators.codigoBarras(index).validate?.(codigo.codigo);
    if (error) errors.push(error);
  });

  return errors;
}

/**
 * Función helper: Validar array de precios
 *
 * Uso:
 * const errors = await validatePrecios(data.precios);
 */
export function validatePrecios(precios: any[]): string[] {
  const errors: string[] = [];
  if (!Array.isArray(precios)) return errors;

  precios.forEach((precio, index) => {
    const errorTipo = ProductoValidators.tipoPrecio(index).validate?.(precio.tipo_precio_id);
    const errorMonto = ProductoValidators.montoPrecio(index).validate?.(precio.monto);

    if (errorTipo) errors.push(errorTipo);
    if (errorMonto) errors.push(errorMonto);
  });

  return errors;
}
