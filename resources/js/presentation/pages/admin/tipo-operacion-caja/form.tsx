// Presentation: Página de formulario para crear/editar Tipo de Operación de Caja
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { TipoOperacionCajaFormContainer, TipoOperacionCajaFormFields } from '@/presentation/components/tipo-operacion-caja';
import { useTipoOperacionCajaForm } from '@/application/hooks/use-tipo-operacion-caja-form';
import type { TipoOperacionCaja } from '@/domain/entities/tipo-operacion-caja';

interface Props {
  'tipo-operacion-caja'?: TipoOperacionCaja;
  errors?: Record<string, string>;
}

export default function TipoOperacionCajaFormPage({
  'tipo-operacion-caja': tipoOperacionCaja,
  errors = {}
}: Props) {
  const { formData, handleChange, setFieldErrors } = useTipoOperacionCajaForm(
    tipoOperacionCaja || undefined
  );

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      setFieldErrors(errors as any);
    }
  }, [errors, setFieldErrors]);

  const pageTitle = tipoOperacionCaja
    ? `Editar: ${tipoOperacionCaja.nombre}`
    : 'Nuevo Tipo de Operación';

  return (
    <AppLayout>
      <Head title={pageTitle} />
      <div className="p-8">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {tipoOperacionCaja
              ? 'Actualice los datos del tipo de operación'
              : 'Complete el formulario para crear un nuevo tipo de operación'}
          </p>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 shadow dark:shadow-lg">
          <div className="px-6 py-8">
            <TipoOperacionCajaFormContainer initialData={formData}>
              {({ data, errors: formErrors, onChange, disabled }) => (
                <TipoOperacionCajaFormFields
                  data={data}
                  errors={formErrors}
                  onChange={onChange}
                  disabled={disabled}
                />
              )}
            </TipoOperacionCajaFormContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
