/**
 * SimpleCrudForm - Formulario genérico para CRUD en GenericCrudModal
 *
 * NOTA: Este componente fue recreado minimalista porque es requerido por GenericCrudModal
 * que se usa en modales de inventario (EstadoMerma, TipoMerma, TipoAjuste, etc)
 */

import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Label } from '@/presentation/components/ui/label';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'checkbox' | 'select';
  required?: boolean;
  placeholder?: string;
  description?: string;
  maxLength?: number;
  validation?: { maxLength?: number; minLength?: number };
  options?: Array<{ value: any; label: string }>;
}

interface SimpleCrudFormProps<T> {
  fields: FormField[];
  onSubmit: (data: T) => void | Promise<void>;
  onReset?: () => void;
  initialData?: Partial<T>;
  isLoading?: boolean;
  submitButtonText?: string;
}

export default function SimpleCrudForm<T extends Record<string, any>>({
  fields,
  onSubmit,
  onReset,
  initialData = {},
  isLoading = false,
  submitButtonText = 'Guardar',
}: SimpleCrudFormProps<T>) {
  const [formData, setFormData] = React.useState<Partial<T>>(initialData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(formData as T));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          {field.type === 'checkbox' ? (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.key}
                name={field.key}
                checked={formData[field.key as keyof T] || false}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <Label htmlFor={field.key}>{field.label}</Label>
            </div>
          ) : field.type === 'textarea' ? (
            <>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Textarea
                id={field.key}
                name={field.key}
                placeholder={field.placeholder}
                value={formData[field.key as keyof T] || ''}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="min-h-24"
              />
            </>
          ) : field.type === 'select' ? (
            <>
              <Label htmlFor={field.key}>{field.label}</Label>
              <select
                id={field.key}
                name={field.key}
                value={formData[field.key as keyof T] || ''}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="">{field.placeholder || `Seleccione ${field.label.toLowerCase()}`}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                name={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key as keyof T] || ''}
                onChange={handleChange}
                disabled={isFormDisabled}
                required={field.required}
                maxLength={field.validation?.maxLength || field.maxLength}
              />
            </>
          )}
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      ))}

      <div className="flex gap-2 justify-end pt-4">
        {onReset && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isFormDisabled}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isFormDisabled}
        >
          {isFormDisabled ? 'Guardando...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
