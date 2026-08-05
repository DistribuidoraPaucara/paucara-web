// Application Layer: Modern Generic form container with improved design
import { useGenericForm } from '@/application/hooks/use-generic-form';
import type { BaseEntity, BaseFormData, BaseService, ModuleConfig } from '@/domain/entities/generic';
import GenericFormFields from '@/presentation/components/generic/generic-form-fields';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { Head, Link } from '@inertiajs/react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  HelpCircle,
  Image,
  Loader2,
  Lock,
  MapPin,
  RotateCcw,
  Save,
  User,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface GenericFormContainerProps<T extends BaseEntity, F extends BaseFormData> {
    entity?: T | null;
    config: ModuleConfig<T, F>;
    service: BaseService<T, F>;
    initialData: F;
    loadOptions?: (fieldKey: string) => Promise<Array<{ value: string | number; label: string }>>;
    extraData?: Record<string, unknown>;
}

// Componente para tabs verticales
interface TabsVerticalProps<F extends BaseFormData> {
    sections: Array<{ id: string; title: string; description?: string; icon?: string }>;
    groupedFields: Record<string, any[]>;
    data: F;
    errors: Partial<Record<keyof F, string>>;
    onChange: (key: keyof F, value: any) => void;
    disabled: boolean;
    loadOptions?: (fieldKey: string) => Promise<Array<{ value: string | number; label: string }>>;
    extraData?: Record<string, unknown>;
}

// Map icon names to lucide-react components
const iconMap: Record<string, React.ReactNode> = {
    User: <User className="h-4 w-4" />,
    Lock: <Lock className="h-4 w-4" />,
    CreditCard: <CreditCard className="h-4 w-4" />,
    MapPin: <MapPin className="h-4 w-4" />,
    Calendar: <Calendar className="h-4 w-4" />,
    Image: <Image className="h-4 w-4" />,
};

function TabsVertical<F extends BaseFormData>({
    sections,
    groupedFields,
    data,
    errors,
    onChange,
    disabled,
    loadOptions,
    extraData,
}: TabsVerticalProps<F>) {
    const [activeTab, setActiveTab] = useState(sections[0]?.id || '');

    return (
        <div className="flex gap-8">
            {/* Navigation - Vertical Tabs List */}
            <div className="flex min-w-fit flex-col gap-2 rounded-lg border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 p-3 shadow-sm dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveTab(section.id)}
                        className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            activeTab === section.id
                                ? 'border-primary/50 text-yellow-500 shadow-md hover:shadow-lg'
                                : 'border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-gray-50 dark:hover:border-neutral-500 dark:hover:bg-neutral-600'
                        }`}
                    >
                        {section.icon && iconMap[section.icon]}
                        {section.title}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`space-y-8 transition-opacity duration-200 ${activeTab === section.id ? 'block opacity-100' : 'hidden opacity-0'}`}
                    >
                        {section.description && (
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{section.title}</h3>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                className="text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                                            >
                                                <HelpCircle className="h-4 w-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>{section.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                        <GenericFormFields<F>
                            data={data}
                            errors={errors}
                            fields={groupedFields[section.id] || []}
                            onChange={onChange}
                            disabled={disabled}
                            loadOptions={loadOptions}
                            extraData={extraData}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function GenericFormContainer<T extends BaseEntity, F extends BaseFormData>({
    entity,
    config,
    service,
    initialData,
    loadOptions,
    extraData,
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
        ? config.formFields.reduce(
              (acc, field) => {
                  // Solo aplicar defaultValue si el campo no tiene ya un valor en initialData
                  if (field.defaultValue !== undefined && (acc[field.key] === undefined || acc[field.key] === null)) {
                      (acc as any)[field.key] = field.defaultValue;
                  }
                  return acc;
              },
              { ...initialData } as F,
          )
        : initialData;

    console.log('dataWithDefaults:', dataWithDefaults);

    const { data, errors, processing, handleSubmit, handleFieldChange, handleReset, isEditing } = useGenericForm(entity, service, dataWithDefaults);

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

    // 🆕 Agrupar campos por sección si hay formSections en la configuración
    const shouldShowTabs = config.formSections && config.formSections.length > 0;

    const groupedFields = useMemo(() => {
        if (!shouldShowTabs) return {};

        const groups: Record<string, typeof config.formFields> = {};

        // Crear grupos para cada sección
        config.formSections?.forEach((section) => {
            groups[section.id] = [];
        });

        // Agrupar campos
        config.formFields.forEach((field) => {
            const section = field.section || 'Sin sección';
            if (!groups[section]) {
                groups[section] = [];
            }
            groups[section].push(field);
        });

        // Ordenar secciones por el orden definido en formSections
        const orderedGroups: Record<string, typeof config.formFields> = {};
        config.formSections?.forEach((section) => {
            if (groups[section.id]) {
                orderedGroups[section.id] = groups[section.id];
            }
        });

        return orderedGroups;
    }, [config, shouldShowTabs]);

    return (
        <>
            <Head title={pageTitle} />

            <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                <div>
                    {/* Error Alert */}
                    {hasErrors && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 duration-300 animate-in fade-in slide-in-from-top-2 dark:border-red-900/50 dark:bg-red-950/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-900 dark:text-red-300">
                                        Hay {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 'es' : ''} en el formulario
                                    </h3>
                                    <p className="mt-1 text-xs text-red-700 dark:text-red-400">Por favor, revisa los campos marcados en rojo.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="border-0 bg-yellow/95 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-sm dark:bg-neutral-900/95 dark:ring-neutral-800/50 rounded-lg">
                        <form id="generic-form" onSubmit={handleSubmit}>
                            {/* <CardHeader className="border-b border-gray-100 pb-6 dark:border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-1 rounded-full bg-primary" />
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{config.displayName}</CardTitle>
                                        {config.description && <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>}
                                    </div>
                                </div>
                            </CardHeader> */}

                            <div className="p-4">
                                {processing && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span>Guardando...</span>
                                    </div>
                                )}
                                {shouldShowTabs ? (
                                    // 🆕 Tabs verticales con navegación fuera del formulario
                                    <TabsVertical
                                        sections={config.formSections!}
                                        groupedFields={groupedFields}
                                        data={data}
                                        errors={errors as Partial<Record<keyof F, string>>}
                                        onChange={handleFieldChange}
                                        disabled={processing}
                                        loadOptions={loadOptions}
                                        extraData={extraData}
                                    />
                                ) : (
                                    // Renderizar sin Tabs (compatibilidad hacia atrás)
                                    <div className="space-y-8">
                                        <GenericFormFields<F>
                                            data={data}
                                            errors={errors as Partial<Record<keyof F, string>>}
                                            fields={config.formFields}
                                            onChange={handleFieldChange}
                                            disabled={processing}
                                            loadOptions={loadOptions}
                                            extraData={extraData}
                                        />
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Floating Action Buttons */}
                    <div className="pointer-events-none fixed right-8 bottom-8 z-40 flex flex-col items-center gap-4">
                        {/* Clean Button (Secondary FAB) */}
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={handleReset}
                            disabled={processing}
                            title="Limpiar formulario"
                            className="pointer-events-auto h-12 w-12 rounded-full border-2 p-0 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
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
                            className="pointer-events-auto flex h-16 w-16 items-center justify-center gap-2 rounded-full bg-primary p-0 shadow-2xl transition-all duration-200 hover:scale-110 hover:bg-primary/90 hover:shadow-2xl"
                        >
                            {processing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                        </Button>
                    </div>

                    {/* Back to List Link */}
                    {/* <div className="flex justify-center">
                        <Link
                            href={service.indexUrl()}
                            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al listado de {config.pluralName}
                        </Link>
                    </div> */}
                </div>
            </div>
        </>
    );
}
