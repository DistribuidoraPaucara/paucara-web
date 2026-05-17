// Application Layer: Hook para lógica de formulario de categorías
import { useForm } from '@inertiajs/react';
import { useCallback } from 'react';
import type { Categoria, CategoriaFormData } from '@/domain/entities/categorias';
import categoriasService from '@/infrastructure/services/categorias.service';

export function useCategoriaForm(categoria?: Categoria | null) {
  const { data, setData, post, put, processing, errors, reset } = useForm<CategoriaFormData>({
    nombre: categoria?.nombre ?? '',
    descripcion: categoria?.descripcion ?? '',
    activo: categoria?.activo ?? true,
  });

  // Validar datos del formulario
  const validateForm = useCallback(() => {
    const newErrors: Partial<CategoriaFormData> = {};

    if (!data.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    return Object.keys(newErrors).length === 0;
  }, [data.nombre]);

  // Enviar formulario
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (categoria) {
      // Actualizar categoría existente
      put(categoriasService.updateUrl(Number(categoria.id)), {
        onSuccess: () => {
          // La redirección se maneja en el servidor
        },
        onError: (errors) => {
          console.error('Error al actualizar categoría:', errors);
        },
      });
    } else {
      // Crear nueva categoría
      post(categoriasService.storeUrl(), {
        onSuccess: () => {
          // La redirección se maneja en el servidor
        },
        onError: (errors) => {
          console.error('Error al crear categoría:', errors);
        },
      });
    }
  }, [categoria, validateForm, post, put]);

  // Manejar cambios en los campos
  const handleFieldChange = useCallback((field: keyof CategoriaFormData, value: string | boolean) => {
    setData(field as unknown as string, value as unknown as CategoriaFormData[keyof CategoriaFormData]);
  }, [setData]);

  // Resetear formulario
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return {
    // Estado del formulario
    data,
    errors,
    processing,

    // Acciones
    handleSubmit,
    handleFieldChange,
    handleReset,

    // Utilidades
    isEditing: !!categoria,
  };
}
