// Application Layer: Modern Generic form container with improved design
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import GenericFormFields from '@/presentation/components/generic/generic-form-fields';
import { useGenericForm } from '@/application/hooks/use-generic-form';
import type { BaseEntity, BaseFormData, BaseService, ModuleConfig } from '@/domain/entities/generic';
import { ArrowLeft, Save, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';

interface GenericFormContainerProps<T extends BaseEntity, F extends BaseFormData> {
  entity?: T | null;
  config: ModuleConfig<T, F>;
  service: BaseService<T, F>;
  initialData: F;
  loadOptions?: (fieldKey: string) => Promise<Array<{ value: string | number; label: string }>>;
  extraData?: Record<string, unknown>;
}

export default function GenericFormContainer<T extends BaseEntity, F extends BaseFormData>({
  entity,
  config,
  service,
  initialData,
  loadOptions,
  extraData
}: GenericFormContainerProps<T, F>) {
  // Logs para debuggear
  console.log('===== GENERIC FORM CONTAINER DEBUG =====');
  console.log('entity recibida:', entity);
  console.log('initialData recibida:', initialData);
  console.log('extraData recibida:', {
    has_localidades: !!extraData?.localidades,
    localidades_count: Array.isArray(extraData?.localidades) ? extraData.localidades.length : 0,
    has_categorias: !!extraData?.categorias,
    categorias_count: Array.isArray(extraData?.categorias) ? extraData.categorias.length : 0,
    localidades: extraData?.localidades,
    categorias: extraData?.categorias,
  });

  // 🆕 Aplicar valores por defecto solo en modo creación (cuando no hay entity)
  const dataWithDefaults = !entity
    ? config.formFields.reduce((acc, field) => {
        // Solo aplicar defaultValue si el campo no tiene ya un valor en initialData
        if (field.defaultValue !== undefined && (acc[field.key] === undefined || acc[field.key] === null)) {
          acc[field.key] = field.defaultValue;
        }
        return acc;
      }, { ...initialData } as F)
    : initialData;

  console.log('dataWithDefaults:', dataWithDefaults);

  const {
    data,
    errors,
    processing,
    handleSubmit,
    handleFieldChange,
    handleReset,
    isEditing
  } = useGenericForm(entity, service, dataWithDefaults);

  console.log('data del formulario (hook):', data);
  console.log('========================================');

  // 🎯 Escuchar evento de detección automática de localidad desde el mapa
  useEffect(() => {
    const handleLocalidadDetected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { localidadId } = customEvent.detail;

      if (localidadId) {
        // Actualizar el campo localidad_id cuando se detecta automáticamente
        handleFieldChange('localidad_id', localidadId);
        console.log('🔄 Localidad seleccionada automáticamente:', localidadId);
      }
    };

    window.addEventListener('localidadDetected', handleLocalidadDetected);

    return () => {
      window.removeEventListener('localidadDetected', handleLocalidadDetected);
    };
  }, [handleFieldChange]);

  const pageTitle = isEditing ? `Editar ${config.singularName}` : `Nuevo ${config.singularName}`;
  const submitButtonText = isEditing ? 'Actualizar' : 'Crear';

  // Verificar si hay errores
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <Head title={pageTitle} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Error Alert */}
          {hasErrors && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-300">
                    Hay {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 'es' : ''} en el formulario
                  </h3>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                    Por favor, revisa los campos marcados en rojo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <Card className="shadow-xl border-0 ring-1 ring-gray-200/50 dark:ring-neutral-800/50 backdrop-blur-sm bg-white/95 dark:bg-neutral-900/95">
            <form id="generic-form" onSubmit={handleSubmit} className="space-y-0">
              <CardHeader className="border-b border-gray-100 dark:border-neutral-800 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-1 bg-primary rounded-full" />
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {config.displayName}
                    </CardTitle>
                    {config.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {config.description}
                      </p>
                    )}
                  </div>
                  {processing && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Guardando...</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="py-8 px-6 sm:px-10 space-y-8">
                <GenericFormFields<F>
                  data={data}
                  errors={errors as Partial<Record<keyof F, string>>}
                  fields={config.formFields}
                  onChange={handleFieldChange}
                  disabled={processing}
                  loadOptions={loadOptions}
                  extraData={extraData}
                />
              </CardContent>
            </form>
          </Card>

          {/* Floating Action Buttons */}
          <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4 z-40 pointer-events-none">
            {/* Clean Button (Secondary FAB) */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={processing}
              title="Limpiar formulario"
              className="h-12 w-12 p-0 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 pointer-events-auto"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            {/* Save/Submit Button (Primary FAB) */}
            <Button
              type="submit"
              form="generic-form"
              disabled={processing}
              size="lg"
              title={submitButtonText}
              className="h-16 w-16 p-0 rounded-full shadow-2xl hover:shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 pointer-events-auto"
            >
              {processing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Save className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Back to List Link */}
          <div className="flex justify-center">
            <Link
              href={service.indexUrl()}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al listado de {config.pluralName}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
