// Configuration: EstadosDocumento module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { EstadoDocumento, EstadoDocumentoFormData } from '@/domain/entities/estadosDocumento';

export const estadosDocumentoConfig: ModuleConfig<EstadoDocumento, EstadoDocumentoFormData> = {
  // Module identification
  moduleName: 'estadosDocumento',
  singularName: 'estado de documento',
  pluralName: 'estados de documento',

  // Display configuration
  displayName: 'Estados de Documento',
  description: 'Gestiona los estados de documentos (proformas, ventas, compras) y transiciones',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    {
      key: 'color',
      label: 'Color',
      type: 'custom',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
            style={{ backgroundColor: value || '#E5E7EB' }}
            title={value || 'Sin color'}
          />
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {value || '-'}
          </span>
        </div>
      )
    },
    { key: 'activo', label: 'Activo', type: 'boolean' },
    { key: 'es_estado_final', label: 'Estado Final', type: 'boolean' },
    { key: 'permite_edicion', label: 'Permite Edición', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'ej: PENDIENTE, APROBADO, RECHAZADO',
      validation: { maxLength: 50 }
    },
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre del estado',
      validation: { maxLength: 100 }
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingrese una descripción opcional'
    },
    {
      key: 'color',
      label: 'Color',
      type: 'color',
      placeholder: '#6366F1',
      description: 'Selecciona el color para este estado',
    },
    {
      key: 'icono',
      label: 'Ícono',
      type: 'text',
      placeholder: 'ej: check, x-circle, clock',
      validation: { maxLength: 50 }
    },
    {
      key: 'estado_anterior_id',
      label: 'Estado Anterior',
      type: 'select',
      placeholder: 'Seleccione estado anterior (opcional)',
      description: 'Define el estado que precede a este en la cadena de transiciones',
      options: [],
    },
    {
      key: 'estado_siguiente_id',
      label: 'Estado Siguiente',
      type: 'select',
      placeholder: 'Seleccione estado siguiente (opcional)',
      description: 'Define el estado que sigue a este en la cadena de transiciones',
      options: [],
    },
    {
      key: 'activo',
      label: 'Estado activo',
      type: 'boolean'
    },
    {
      key: 'permite_edicion',
      label: 'Permite edición',
      type: 'boolean'
    },
    {
      key: 'permite_anulacion',
      label: 'Permite anulación',
      type: 'boolean'
    },
    {
      key: 'es_estado_final',
      label: 'Es estado final',
      type: 'boolean'
    },
  ],

  // Search configuration
  searchableFields: ['codigo', 'nombre'],
  searchPlaceholder: 'Buscar estados de documento...',

  // Modern Index filters configuration
  indexFilters: {
    filters: [
      {
        key: 'activo',
        label: 'Estado',
        type: 'boolean',
        placeholder: 'Todos los estados',
        width: 'sm'
      },
      {
        key: 'es_estado_final',
        label: 'Final',
        type: 'boolean',
        placeholder: 'Todos',
        width: 'sm'
      }
    ],
    sortOptions: [
      { value: 'id', label: 'ID' },
      { value: 'codigo', label: 'Código' },
      { value: 'nombre', label: 'Nombre' },
      { value: 'created_at', label: 'Fecha creación' },
      { value: 'updated_at', label: 'Última actualización' }
    ],
    defaultSort: { field: 'nombre', direction: 'asc' },
    layout: 'inline'
  },
};
