// Configuration: EstadosLogistica module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { EstadoLogistica, EstadoLogisticaFormData } from '@/domain/entities/estadosLogistica';

export const estadosLogisticaConfig: ModuleConfig<EstadoLogistica, EstadoLogisticaFormData> = {
  // Module identification
  moduleName: 'estadosLogistica',
  singularName: 'estado de logística',
  pluralName: 'estados de logística',

  // Display configuration
  displayName: 'Estados de Logística',
  description: 'Gestiona los estados de logística, categorías y transiciones',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'categoria', label: 'Categoría', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    // { key: 'orden', label: 'Orden', type: 'number' },
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
      placeholder: 'ej: PENDIENTE, EN_TRANSITO, ENTREGADO',
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
      key: 'categoria',
      label: 'Categoría',
      type: 'select',
      required: true,
      placeholder: 'Seleccione una categoría',
      options: [
        { value: 'proforma', label: 'Proforma' },
        { value: 'venta_logistica', label: 'Venta Logística' },
        { value: 'entrega', label: 'Entrega' },
        { value: 'vehiculo', label: 'Vehículo' },
        { value: 'pago', label: 'Pago' },
      ]
    },
    
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingrese una descripción opcional'
    },
    {
      key: 'orden',
      label: 'Orden',
      type: 'number',
      placeholder: 'Ingrese el orden de visualización'
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
      placeholder: 'ej: clock, check-circle',
      validation: { maxLength: 50 }
    },
    {
      key: 'activo',
      label: 'Estado activo',
      type: 'boolean'
    },
    {
      key: 'es_estado_final',
      label: 'Es estado final',
      type: 'boolean'
    },
    {
      key: 'permite_edicion',
      label: 'Permite edición',
      type: 'boolean'
    },
    {
      key: 'requiere_aprobacion',
      label: 'Requiere aprobación',
      type: 'boolean'
    },
  ],

  // Search configuration
  searchableFields: ['codigo', 'nombre', 'categoria'],
  searchPlaceholder: 'Buscar estados de logística...',

  // Modern Index filters configuration
  indexFilters: {
    filters: [
      {
        key: 'categoria',
        label: 'Categoría',
        type: 'select',
        placeholder: 'Todas',
        options: [
          { value: 'proforma', label: 'Proforma' },
          { value: 'venta_logistica', label: 'Venta Logística' },
          { value: 'entrega', label: 'Entrega' },
          { value: 'vehiculo', label: 'Vehículo' },
          { value: 'pago', label: 'Pago' },
        ],
        width: 'md'
      },
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
      { value: 'categoria', label: 'Categoría' },
      { value: 'orden', label: 'Orden' },
      { value: 'created_at', label: 'Fecha creación' },
      { value: 'updated_at', label: 'Última actualización' }
    ],
    defaultSort: { field: 'categoria', direction: 'asc' },
    layout: 'inline'
  },
};
