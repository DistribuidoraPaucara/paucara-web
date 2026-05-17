/**
 * useFormWithValidation - Hook para formulario con validación integrada
 *
 * Propósito: Combinar manejo de formulario + validación en un hook reutilizable
 * Elimina ~50 líneas de lógica duplicada en formularios
 *
 * Features:
 * - Manejo automático de estado del form
 * - Validación integrada con FormValidator
 * - Errores por campo
 * - Reset automático
 * - Submit con loading state
 *
 * Uso:
 * const form = useFormWithValidation(validator, initialData);
 * form.handleChange('nombre', 'Juan');
 * form.handleSubmit(onSubmit);
 */

import { useState, useCallback } from 'react';
import type { FormValidator } from '@/infrastructure/services/form-validator';
import type { BaseFormData } from '@/domain/entities/generic';

export interface UseFormWithValidationReturn<T extends BaseFormData> {
  // Estado
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;

  // Acciones
  setData: (data: Partial<T>) => void;
  setValue: (key: keyof T, value: any) => void;
  handleChange: (key: keyof T, value: any) => void;
  handleSubmit: (onSubmit: (data: T) => Promise<void> | void) => Promise<void>;
  reset: () => void;
  validate: () => Promise<boolean>;
  clearErrors: () => void;
  setError: (key: string, message: string) => void;

  // Helpers
  getFieldError: (key: keyof T) => string | undefined;
  hasError: (key: keyof T) => boolean;
  getFieldProps: (key: keyof T) => {
    value: any;
    onChange: (e: any) => void;
    error: string | undefined;
  };
}

export function useFormWithValidation<T extends BaseFormData>(
  validator: FormValidator<T>,
  initialData: T
): UseFormWithValidationReturn<T> {
  const [data, setDataState] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Validar si el formulario es válido
  const isValid = Object.keys(errors).length === 0 && isDirty;

  // Actualizar data
  const setData = useCallback((newData: Partial<T>) => {
    setDataState((prev) => ({ ...prev, ...newData }));
    setIsDirty(true);
  }, []);

  // Actualizar un campo
  const setValue = useCallback((key: keyof T, value: any) => {
    setData({ [key]: value } as Partial<T>);
  }, [setData]);

  // Manejador de cambio (compatible con eventos)
  const handleChange = useCallback((key: keyof T, value: any) => {
    const actualValue =
      value?.target?.value !== undefined ? value.target.value : value;

    setValue(key, actualValue);

    // Validar campo individual
    const error = validator['validate']?.(key as string, actualValue);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [key]: error,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [setValue, validator]);

  // Validar todo el formulario
  const validate = useCallback(async (): Promise<boolean> => {
    const newErrors = await validator.validateAsync(data);

    if (newErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      newErrors.forEach((error) => {
        // Asumir que error es "field: message"
        const [field, message] = error.split(':').map((s) => s.trim());
        errorMap[field] = message;
      });
      setErrors(errorMap);
      return false;
    }

    setErrors({});
    return true;
  }, [validator, data]);

  // Manejar submit del formulario
  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<void> | void) => {
      setIsSubmitting(true);
      try {
        // Validar antes de submit
        const isValid = await validate();
        if (!isValid) {
          setIsSubmitting(false);
          return;
        }

        // Llamar callback
        await onSubmit(data);
      } catch (error) {
        console.error('Error en submit:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, data]
  );

  // Reset al estado inicial
  const reset = useCallback(() => {
    setDataState(initialData);
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Establecer error específico
  const setError = useCallback((key: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [key]: message,
    }));
  }, []);

  // Obtener error de campo
  const getFieldError = useCallback(
    (key: keyof T): string | undefined => errors[String(key)],
    [errors]
  );

  // Verificar si campo tiene error
  const hasError = useCallback(
    (key: keyof T): boolean => !!errors[String(key)],
    [errors]
  );

  // Propiedades para usar en Input/Select
  const getFieldProps = useCallback(
    (key: keyof T) => ({
      value: data[key] ?? '',
      onChange: (e: any) => handleChange(key, e),
      error: getFieldError(key),
    }),
    [data, handleChange, getFieldError]
  );

  return {
    // Estado
    data,
    errors,
    isSubmitting,
    isDirty,
    isValid,

    // Acciones
    setData,
    setValue,
    handleChange,
    handleSubmit,
    reset,
    validate,
    clearErrors,
    setError,

    // Helpers
    getFieldError,
    hasError,
    getFieldProps,
  };
}
