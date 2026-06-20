// Application Layer: Hook para el formulario de tipo de operación de caja
import { useState, useCallback } from 'react';
import type { TipoOperacionCajaFormData } from '@/domain/entities/tipo-operacion-caja';

const initialFormState: TipoOperacionCajaFormData = {
  codigo: '',
  nombre: '',
  descripcion: null,
  direccion: null,
  activo: true,
};

export function useTipoOperacionCajaForm(initial?: TipoOperacionCajaFormData) {
  const [formData, setFormData] = useState<TipoOperacionCajaFormData>(
    initial || initialFormState
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TipoOperacionCajaFormData, string>>>({});

  const handleChange = useCallback(
    (field: keyof TipoOperacionCajaFormData, value: string | boolean | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Limpiar error del campo cuando se modifica
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setFieldError = useCallback((field: keyof TipoOperacionCajaFormData, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const setFieldErrors = useCallback((newErrors: Partial<Record<keyof TipoOperacionCajaFormData, string>>) => {
    setErrors(newErrors);
  }, []);

  const reset = useCallback(() => {
    setFormData(initial || initialFormState);
    setErrors({});
  }, [initial]);

  const isValid = useCallback((): boolean => {
    return formData.codigo.trim() !== '' && formData.nombre.trim() !== '';
  }, [formData.codigo, formData.nombre]);

  return {
    formData,
    errors,
    handleChange,
    setFieldError,
    setFieldErrors,
    reset,
    isValid,
    setFormData,
  };
}
