// Presentation Layer: Modern Generic form fields component with responsive design
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { useState, useEffect } from 'react';
import SearchSelect from '@/presentation/components/ui/search-select';
import SearchMultiSelect from '@/presentation/components/ui/search-multi-select';
import type { BaseFormData, FormField } from '@/domain/entities/generic';
import { Info, Eye, EyeOff } from 'lucide-react';

interface GenericFormFieldsProps<F extends BaseFormData> {
  data: F;
  errors: Partial<Record<keyof F, string>>;
  fields: FormField<F>[];
  onChange: (field: keyof F, value: unknown) => void;
  disabled?: boolean;
  loadOptions?: (fieldKey: string) => Promise<Array<{ value: string | number; label: string }>>;
  extraData?: Record<string, unknown>;
}

export default function GenericFormFields<F extends BaseFormData>({
  data,
  errors,
  fields,
  onChange,
  disabled = false,
  loadOptions,
  extraData
}: GenericFormFieldsProps<F>) {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Array<{ value: string | number; label: string }>>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  // 🔍 DEBUG: Mostrar extraData cuando se renderiza
  console.log('🔍 GenericFormFields - extraData recibida:', {
    has_localidades: !!extraData?.localidades,
    has_categorias: !!extraData?.categorias,
    localidades: extraData?.localidades,
    categorias: extraData?.categorias,
  });

  // Cargar opciones dinámicas cuando sea necesario
  useEffect(() => {
    const loadDynamicOptions = async () => {
      if (!loadOptions) return;

      const newOptions: Record<string, Array<{ value: string | number; label: string }>> = {};

      for (const field of fields) {
        if ((field.type === 'select' || field.type === 'multiselect') && field.options && field.options.length === 0) {
          try {
            const options = await loadOptions(String(field.key));
            newOptions[String(field.key)] = options;
          } catch (error) {
            console.error(`Error loading options for ${String(field.key)}:`, error);
            newOptions[String(field.key)] = [];
          }
        }
      }

      setDynamicOptions(newOptions);
    };

    loadDynamicOptions();
  }, [fields, loadOptions]);

  // 🆕 Verificar si un campo es visible según condiciones
  const isFieldVisible = (field: FormField<F>): boolean => {
    if (field.hidden) return false;
    if (field.visible) return field.visible(data);
    return true;
  };

  // 🆕 Verificar si un campo está deshabilitado según condiciones
  const isFieldDisabled = (field: FormField<F>): boolean => {
    if (disabled) return true;
    if (field.disabled) return field.disabled(data);
    return false;
  };

  const renderField = (field: FormField<F>) => {
    const value = data[field.key];
    const error = errors[field.key];
    const fieldDisabled = isFieldDisabled(field);

    // Si el campo tiene un render personalizado, usarlo
    if (typeof field.render === 'function') {
      return field.render({
        value,
        onChange: (v: unknown) => onChange(field.key, v),
        setFieldValue: (v: unknown) => onChange(field.key, v), // 🆕 Alias para onChange para componentes que necesiten setFieldValue
        label: field.label,
        error,
        disabled: fieldDisabled,
        field,
        formData: data, // 🆕 Pasar todo el formData para campos que lo necesiten (como MapPicker)
      });
    }

    // 🆕 Wrapper para prefix/suffix
    const withPrefixSuffix = (input: React.ReactNode) => {
      if (!field.prefix && !field.suffix) return input;

      return (
        <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {field.prefix && (
            <span className="pl-3 pr-2 text-sm text-muted-foreground font-medium">
              {field.prefix}
            </span>
          )}
          <div className="flex-1 [&>input]:border-0 [&>input]:focus-visible:ring-0 [&>input]:focus-visible:ring-offset-0">
            {input}
          </div>
          {field.suffix && (
            <span className="pr-3 pl-2 text-sm text-muted-foreground font-medium">
              {field.suffix}
            </span>
          )}
        </div>
      );
    };

    switch (field.type) {
      case 'textarea': {
        const placeholderValue = typeof field.placeholder === 'function' ? field.placeholder(data) : field.placeholder;
        return (
          <textarea
            id={String(field.key)}
            value={value ? String(value) : ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(field.key, e.target.value)}
            placeholder={placeholderValue}
            disabled={fieldDisabled}
            rows={4}
            className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${error ? 'border-2 border-red-500 focus-visible:ring-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}
          />
        );
      }

      case 'number': {
        const placeholderValue = typeof field.placeholder === 'function' ? field.placeholder(data) : field.placeholder;
        const numberInput = (
          <Input
            id={String(field.key)}
            type="number"
            value={value ? String(value) : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder={placeholderValue}
            disabled={fieldDisabled}
            className={`transition-all duration-200 ${error ? 'border-2 border-red-500 focus-visible:ring-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}
            min={field.validation?.min}
            max={field.validation?.max}
            step="any"
          />
        );
        return withPrefixSuffix(numberInput);
      }

      case 'boolean':
        return (
          <div className="flex items-center space-x-3 py-2">
            <input
              type="checkbox"
              id={String(field.key)}
              checked={Boolean(value)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.checked)}
              disabled={fieldDisabled}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            />
            <Label htmlFor={String(field.key)} className="text-sm font-medium cursor-pointer">
              {field.label}
            </Label>
          </div>
        );

      case 'date':
        return (
          <Input
            id={String(field.key)}
            type="date"
            value={value ? String(value) : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
            disabled={fieldDisabled}
            className={`transition-all duration-200 ${error ? 'border-2 border-red-500 focus-visible:ring-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}
          />
        );

      case 'select': {
        const fieldKey = String(field.key);
        const options = dynamicOptions[fieldKey] || field.options || [];

        // Use SearchSelect if field has extraDataKey (for dynamic data like localidades)
        if (field.extraDataKey && extraData?.[field.extraDataKey]) {
          const rawExtraData = extraData[field.extraDataKey] as Array<any>;

          // Check if data is already in the correct format (has 'value' and 'label')
          const isAlreadyFormatted = rawExtraData.length > 0 &&
            'value' in rawExtraData[0] &&
            'label' in rawExtraData[0];

          const searchSelectOptions = isAlreadyFormatted
            ? rawExtraData.map(opt => ({
                value: opt.value,
                label: opt.label
              }))
            : rawExtraData.map(opt => ({
                value: opt.id,
                label: opt.codigo ? `${opt.nombre} (${opt.codigo})` : opt.nombre
              }));

          return (
            <SearchSelect
              id={fieldKey}
              placeholder={field.placeholder || 'Seleccionar...'}
              value={value ? String(value) : ''}
              options={searchSelectOptions}
              onChange={(val) => onChange(field.key, val === '' ? null : Number(val))}
              disabled={fieldDisabled}
              required={field.required}
              error={error}
              allowClear={!field.required}
            />
          );
        }

        // Use SearchSelect for dynamic options loaded via loadOptions
        if (field.extraDataKey && options.length > 0) {
          return (
            <SearchSelect
              id={fieldKey}
              placeholder={field.placeholder || 'Seleccionar...'}
              value={value ? String(value) : ''}
              options={options.map(opt => ({
                value: String(opt.value),
                label: opt.label
              }))}
              onChange={(val) => onChange(field.key, val === '' ? null : val)}
              disabled={fieldDisabled}
              required={field.required}
              error={error}
              allowClear={!field.required}
            />
          );
        }

        // Use regular select for static options
        return (
          <select
            id={fieldKey}
            value={value ? String(value) : ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(field.key, e.target.value === '' ? null : e.target.value)}
            disabled={fieldDisabled}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${error ? 'border-2 border-red-500 focus-visible:ring-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}
          >
            <option value="">Seleccionar...</option>
            {options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      case 'multiselect': {
        const fieldKey = String(field.key);
        const options = dynamicOptions[fieldKey] || field.options || [];

        // Ensure value is always an array for multiselect
        const multiValue = Array.isArray(value) ? value : (value ? [value] : []);

        return (
          <SearchMultiSelect
            id={fieldKey}
            placeholder={field.placeholder || 'Seleccionar opciones...'}
            value={multiValue}
            options={options.map(opt => ({
              value: String(opt.value),
              label: opt.label,
              description: (opt as any).description
            }))}
            onChange={(values) => onChange(field.key, values)}
            disabled={fieldDisabled}
            required={field.required}
            error={error}
            allowClear={!field.required}
            maxSelections={field.maxSelections}
          />
        );
      }

      case 'file':
        {
          const fileValue = value as File | string | null | undefined;
          const previewValue = (data as any)[`${String(field.key)}_preview`];
          let previewSrc: string | null = null;

          if (fileValue instanceof File) {
            previewSrc = URL.createObjectURL(fileValue);
          } else if (previewValue && typeof previewValue === 'string' && previewValue.length > 0) {
            previewSrc = previewValue.startsWith('http') || previewValue.startsWith('data:') ? previewValue : previewValue.startsWith('/storage/') ? previewValue : `/storage/${previewValue}`;
          } else if (typeof fileValue === 'string' && fileValue.length > 0) {
            previewSrc = fileValue.startsWith('http') || fileValue.startsWith('data:') ? fileValue : `/storage/${fileValue}`;
          }

          return (
            <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700 p-6 bg-gray-50/60 dark:bg-neutral-900/40 transition-all duration-200 hover:border-primary/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label htmlFor={String(field.key)} className="flex-1 w-full">
                  <input
                    id={String(field.key)}
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    disabled={fieldDisabled}
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''}`}
                  />
                </label>
                {fileValue && (
                  <button
                    type="button"
                    onClick={() => onChange(field.key, null)}
                    disabled={fieldDisabled}
                    className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950/20 transition-all duration-200 whitespace-nowrap"
                  >
                    Quitar archivo
                  </button>
                )}
              </div>

              {previewSrc && (
                <div className="mt-4 flex items-center gap-4 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md ring-2 ring-gray-200 dark:ring-neutral-700 bg-white dark:bg-neutral-800">
                    <img src={previewSrc} alt="Vista previa" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {fileValue instanceof File ? fileValue.name : 'Imagen actual'}
                    </p>
                    {fileValue instanceof File && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {(fileValue.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!previewSrc && (
                <p className="mt-3 text-xs text-center text-muted-foreground">
                  📁 Formatos: JPG, PNG, GIF • Tamaño máx: 5MB
                </p>
              )}
            </div>
          );
        }

      case 'password': {
        const placeholderValue = typeof field.placeholder === 'function' ? field.placeholder(data) : field.placeholder;
        const fieldKey = String(field.key);
        const isPasswordVisible = showPassword[fieldKey] || false;

        const passwordInput = (
          <div className="relative">
            <Input
              id={fieldKey}
              type={isPasswordVisible ? 'text' : 'password'}
              value={value ? String(value) : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
              placeholder={placeholderValue}
              disabled={fieldDisabled}
              autoComplete="new-password"
              className={`pr-10 transition-all duration-200 ${error ? 'border-2 border-red-500 focus-visible:ring-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }))}
              disabled={fieldDisabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        );
        return withPrefixSuffix(passwordInput);
      }

      default: { // text
        const placeholderValue = typeof field.placeholder === 'function' ? field.placeholder(data) : field.placeholder;
        const textInput = (
          <Input
            id={String(field.key)}
            value={value ? String(value) : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, e.target.value)}
            placeholder={placeholderValue}
            disabled={fieldDisabled}
            className={`transition-all duration-200 ${error ? 'border-2 border-red-500 focus-visible:ring-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/30' : ''}`}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );
        return withPrefixSuffix(textInput);
      }
    }
  };

  // 🆕 Renderizar un campo completo con label, descripción y error
  const renderFieldBlock = (field: FormField<F>, isFullWidth: boolean = false) => {
    if (!isFieldVisible(field)) return null;

    const error = errors[field.key];
    const colSpanClass = field.colSpan
      ? `col-span-${field.colSpan}`
      : 'col-span-1';

    // Evaluar descripción si es función, sino usar como string
    const descriptionValue = typeof field.description === 'function'
      ? field.description(data)
      : field.description;

    // Evaluar required si es función, sino usar como booleano
    const isRequired = typeof field.required === 'function'
      ? field.required(data)
      : field.required;

    return (
      <div
        className={`${!isFullWidth ? colSpanClass : 'w-full'} space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}
      >
        {(!field.render && field.type !== 'boolean') && (
          <div className="flex items-center justify-between">
            <Label
              htmlFor={String(field.key)}
              className="text-sm font-medium flex items-center gap-2"
            >
              {field.icon && <span className={field.icon}></span>}
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            {descriptionValue && (
              <div className="group relative">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                <div className="absolute right-0 top-6 z-10 hidden group-hover:block w-64 p-2 text-xs bg-gray-900 dark:bg-neutral-100 text-white dark:text-gray-900 rounded-lg shadow-lg">
                  {descriptionValue}
                </div>
              </div>
            )}
          </div>
        )}

        {renderField(field)}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-1">
            <span className="text-base">⚠️</span>
            {error}
          </p>
        )}

        {!error && descriptionValue && field.type !== 'boolean' && (
          <p className="text-xs text-muted-foreground">
            {descriptionValue}
          </p>
        )}
      </div>
    );
  };

  // 🆕 Agrupar campos por sección (solo campos visibles)
  const groupedFields = fields.reduce((acc, field) => {
    // Solo agrupar campos que sean visibles
    if (!isFieldVisible(field)) return acc;

    const section = field.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, FormField<F>[]>);

  // 🆕 Renderizar secciones
  const sections = Object.keys(groupedFields);
  const hasMultipleSections = sections.length > 1;

  return (
    <div className="space-y-8">
      {sections.map((sectionKey) => {
        const sectionFields = groupedFields[sectionKey];

        // 🆕 Separar campos normales de campos de ancho completo
        const normalFields = sectionFields.filter(field => !field.fullWidth);
        const fullWidthFields = sectionFields.filter(field => field.fullWidth);

        return (
          <div key={sectionKey} className="space-y-6">
            {hasMultipleSections && sectionKey !== 'default' && (
              <div className="border-b border-gray-200 dark:border-neutral-800 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sectionKey}
                </h3>
              </div>
            )}

            {/* Campos normales en grid */}
            {normalFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {normalFields.map((field) => (
                  <div key={String(field.key)}>
                    {renderFieldBlock(field, false)}
                  </div>
                ))}
              </div>
            )}

            {/* Campos de ancho completo */}
            {fullWidthFields.length > 0 && (
              <div className="space-y-6">
                {fullWidthFields.map((field) => (
                  <div key={String(field.key)}>
                    {renderFieldBlock(field, true)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="text-red-500">*</span> Campos obligatorios
        </p>
      </div>
    </div>
  );
}
