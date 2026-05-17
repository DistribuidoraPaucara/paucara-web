// Configuration: Marcas module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Marca, MarcaFormData } from '@/domain/entities/marcas';

export const marcasConfig: ModuleConfig<Marca, MarcaFormData> = {
  // Module identification
  moduleName: 'marcas',
  singularName: 'marca',
  pluralName: 'marcas',

  // Display configuration
  displayName: 'Marcas',
  description: 'Gestiona las marcas de productos',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre de la marca',
      validation: { maxLength: 255 }
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingrese una descripción opcional'
    },
    {
      key: 'activo',
      label: 'Marca activa',
      type: 'boolean'
    }
  ],

  // Search configuration
  searchableFields: ['nombre', 'descripcion'],
  searchPlaceholder: 'Buscar marcas...',

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
      { value: 'nombre', label: 'Nombre' },
      { value: 'created_at', label: 'Fecha creación' },
      { value: 'updated_at', label: 'Última actualización' }
    ],
    defaultSort: { field: 'nombre', direction: 'asc' },
    layout: 'inline'
  },
};
