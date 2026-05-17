// Configuration: Tipos de Ajuste de Inventario module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { TipoAjusteInventario, TipoAjusteInventarioFormData } from '@/domain/entities/tipos-ajuste-inventario';

export const tipoAjusteInventarioConfig: ModuleConfig<TipoAjusteInventario, TipoAjusteInventarioFormData> = {
  // Module identification
  moduleName: 'tipos-ajuste-inventario',
  singularName: 'tipo ajuste',
  pluralName: 'tipos ajuste',

  // Display configuration
  displayName: 'Tipos de Ajuste de Inventario',
  description: 'Gestiona los tipos de ajuste disponibles para los movimientos de inventario',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'clave', label: 'Clave', type: 'text' },
    { key: 'label', label: 'Nombre', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'clave',
      label: 'Clave',
      type: 'text',
      required: true,
      placeholder: 'Ej: AJUSTE_FISICO, ROTURA',
      validation: { maxLength: 50 }
    },
    {
      key: 'label',
      label: 'Nombre Visible',
      type: 'text',
      required: true,
      placeholder: 'Ej: Ajuste Físico, Rotura',
      validation: { maxLength: 100 }
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'text',
      placeholder: 'Descripción del tipo de ajuste',
      validation: { maxLength: 255 }
    },
    {
      key: 'activo',
      label: 'Tipo activo',
      type: 'boolean'
    }
  ],

  // Search configuration
  searchableFields: ['clave', 'label', 'descripcion'],
  searchPlaceholder: 'Buscar tipos de ajuste...',

  // Modern Index filters configuration
  indexFilters: {
    filters: [
      {
        key: 'activo',
        label: 'Estado',
        type: 'boolean',
        placeholder: 'Todos los estados',
        width: 'sm'
      }
    ],
    sortOptions: [
      { value: 'id', label: 'ID' },
      { value: 'clave', label: 'Clave' },
      { value: 'label', label: 'Nombre' },
      { value: 'created_at', label: 'Fecha creación' }
    ],
    defaultSort: { field: 'clave', direction: 'asc' },
    layout: 'inline'
  },
};
