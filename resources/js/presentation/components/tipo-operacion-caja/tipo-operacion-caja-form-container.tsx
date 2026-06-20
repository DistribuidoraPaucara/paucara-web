// Presentation Layer: Contenedor para el formulario de tipo de operación de caja
import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { TipoOperacionCajaFormData } from '@/domain/entities/tipo-operacion-caja';

interface TipoOperacionCajaFormContainerProps {
  initialData?: TipoOperacionCajaFormData;
  onSubmit?: (data: TipoOperacionCajaFormData) => void;
  children: ReactNode;
}

export default function TipoOperacionCajaFormContainer({
  initialData,
  onSubmit,
  children
}: TipoOperacionCajaFormContainerProps) {
  const { data, setData, errors, processing, recentlySuccessful, post, put } = useForm<TipoOperacionCajaFormData>({
    codigo: initialData?.codigo ?? '',
    nombre: initialData?.nombre ?? '',
    descripcion: initialData?.descripcion ?? null,
    direccion: initialData?.direccion ?? null,
    activo: initialData?.activo ?? true,
    ...(initialData?.id && { id: initialData.id }),
  });

  const handleChange = (field: keyof TipoOperacionCajaFormData, value: string | boolean | null) => {
    setData(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData?.id) {
      put(`/tipo-operacion-caja/${initialData.id}`, {
        onSuccess: () => {
          if (onSubmit) onSubmit(data);
        },
      });
    } else {
      post('/tipo-operacion-caja', {
        onSuccess: () => {
          if (onSubmit) onSubmit(data);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children && typeof children === 'function'
        ? (children as any)({
            data,
            errors,
            onChange: handleChange,
            disabled: processing,
          })
        : children}

      <div className="flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          type="submit"
          disabled={processing}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {recentlySuccessful && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-4 text-sm text-green-700 dark:text-green-400">
          Guardado correctamente.
        </div>
      )}
    </form>
  );
}
