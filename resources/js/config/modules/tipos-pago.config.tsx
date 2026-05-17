// Configuration: Tipos de Pago module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { TipoPago, TipoPagoFormData } from '@/domain/entities/tipos-pago';

export const tiposPagoConfig: ModuleConfig<TipoPago, TipoPagoFormData> = {
  // Module identification
  moduleName: 'tipos-pago',
  singularName: 'tipoPago',
  pluralName: 'tiposPago',

  // Display configuration
  displayName: 'Tipos de Pago',
  description: 'Gestiona los tipos de pago disponibles',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el código (p. ej. EFECTIVO, TARJETA)',
      validation: { maxLength: 255 }
    },
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre del tipo de pago',
      validation: { maxLength: 255 }
    }
  ],

  // Search configuration
  searchableFields: ['codigo', 'nombre'],
  searchPlaceholder: 'Buscar tipos de pago...',
};
