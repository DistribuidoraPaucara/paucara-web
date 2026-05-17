// Application Layer: Generic form wrapper component
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import GenericFormFields from '@/presentation/components/generic/generic-form-fields';
import { useGenericForm } from '@/application/hooks/use-generic-form';
import type { BaseEntity, BaseFormData, BaseService, ModuleConfig } from '@/domain/entities/generic';

interface GenericFormProps<T extends BaseEntity, F extends BaseFormData> {
  entity?: T | null;
  config: ModuleConfig<T, F>;
  service: BaseService<T, F>;
  isEdit?: boolean;
  title?: string;
}

export default function GenericForm<T extends BaseEntity, F extends BaseFormData>({
  entity,
  config,
  service,
  title
}: GenericFormProps<T, F>) {
  // Create empty initial data based on form fields
  const initialData = config.formFields.reduce((acc, field) => {
    acc[field.key as keyof F] = '' as F[keyof F];
    return acc;
  }, {} as F);

  const {
    data,
    errors,
    processing,
    handleSubmit,
    handleFieldChange,
    handleReset,
    isEditing,
  } = useGenericForm(entity, service, initialData);

  // Use provided title or generate from config and editing state
  const pageTitle = title || (isEditing ? `Editar ${config.singularName}` : `Nuevo ${config.singularName}`);
  const submitButtonText = isEditing ? `Actualizar ${config.singularName}` : `Crear ${config.singularName}`;

  return (
    <>
      <Head title={pageTitle} />

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{pageTitle}</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href={service.indexUrl()}>
                Volver al listado
              </Link>
            </Button>
          </div>
          {isEditing && entity && (
            <p className="text-sm text-muted-foreground">
              Editando: <strong>{(entity as T & { nombre?: string }).nombre || entity.id}</strong>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <GenericFormFields<F>
              data={data}
              errors={errors as Partial<Record<keyof F, string>>}
              fields={config.formFields}
              onChange={handleFieldChange}
            />

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={processing}
              >
                Restablecer
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="min-w-[120px]"
              >
                {processing ? 'Guardando...' : submitButtonText}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
