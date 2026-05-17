// Configuration: Empresas module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Empresa, EmpresaFormData } from '@/domain/entities/empresas';

export const empresasConfig: ModuleConfig<Empresa, EmpresaFormData> = {
  // Module identification
  moduleName: 'empresas',
  singularName: 'empresa',
  pluralName: 'empresas',

  // Display configuration
  displayName: 'Empresas',
  description: 'Gestiona la información de las empresas',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'nombre_comercial', label: 'Nombre Comercial', type: 'text' },
    { key: 'razon_social', label: 'Razón Social', type: 'text' },
    { key: 'nit', label: 'NIT', type: 'text' },
    { key: 'email', label: 'Correo', type: 'text' },
    { key: 'telefono', label: 'Teléfono', type: 'text' },
    { key: 'es_principal', label: 'Principal', type: 'boolean' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    // Datos básicos
    {
      key: 'nombre_comercial',
      label: 'Nombre Comercial',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre comercial',
      validation: { maxLength: 255 }
    },
    {
      key: 'razon_social',
      label: 'Razón Social',
      type: 'text',
      required: true,
      placeholder: 'Ingrese la razón social',
      validation: { maxLength: 255 }
    },
    {
      key: 'nit',
      label: 'NIT',
      type: 'text',
      placeholder: 'Ingrese el NIT',
      validation: { maxLength: 20 }
    },
    {
      key: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'correo@empresa.com',
      validation: { maxLength: 255 }
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      type: 'text',
      placeholder: '1234567890',
      validation: { maxLength: 20 }
    },
    {
      key: 'sitio_web',
      label: 'Sitio Web',
      type: 'text',
      placeholder: 'https://www.ejemplo.com',
      validation: { maxLength: 255 }
    },
    {
      key: 'direccion',
      label: 'Dirección',
      type: 'textarea',
      placeholder: 'Ingrese la dirección completa',
      validation: { maxLength: 500 }
    },
    {
      key: 'ciudad',
      label: 'Ciudad',
      type: 'text',
      placeholder: 'Ingrese la ciudad',
      validation: { maxLength: 100 }
    },
    {
      key: 'pais',
      label: 'País',
      type: 'text',
      placeholder: 'Ingrese el país',
      validation: { maxLength: 100 }
    },

    // Logos
    {
      key: 'logo_principal',
      label: 'Logo Principal',
      type: 'file',
      description: 'Sube el logo principal (JPEG, PNG, JPG, GIF - máx 4MB)',
      validation: { maxSize: 4096 }
    },
    {
      key: 'logo_compacto',
      label: 'Logo Compacto',
      type: 'file',
      description: 'Sube el logo compacto (JPEG, PNG, JPG, GIF - máx 4MB)',
      validation: { maxSize: 4096 }
    },
    {
      key: 'logo_footer',
      label: 'Logo Footer',
      type: 'file',
      description: 'Sube el logo para footer (JPEG, PNG, JPG, GIF - máx 4MB)',
      validation: { maxSize: 4096 }
    },

    // Mensajes
    {
      key: 'mensaje_footer',
      label: 'Mensaje Footer',
      type: 'textarea',
      placeholder: 'Ingrese el mensaje para el footer',
      validation: { maxLength: 500 }
    },
    {
      key: 'mensaje_legal',
      label: 'Mensaje Legal',
      type: 'textarea',
      placeholder: 'Ingrese el mensaje legal'
    },

    // Características
    {
      key: 'permite_productos_fraccionados',
      label: 'Permitir Productos Fraccionados',
      type: 'boolean',
      description: 'Habilita la opción de conversiones de unidades en productos'
    },
    {
      key: 'es_farmacia',
      label: 'Es Farmacia',
      type: 'boolean',
      description: 'Habilita campos de medicamentos (principio activo, uso de medicación)'
    },

    // Estado
    {
      key: 'es_principal',
      label: 'Empresa Principal',
      type: 'boolean',
      description: 'Solo una empresa puede ser principal'
    },
    {
      key: 'activo',
      label: 'Empresa Activa',
      type: 'boolean'
    }
  ],

  // Search configuration
  searchableFields: ['nombre_comercial', 'razon_social', 'nit', 'email'],
  searchPlaceholder: 'Buscar empresas...',

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
        key: 'es_principal',
        label: 'Principal',
        type: 'boolean',
        placeholder: 'Todas',
        width: 'sm'
      }
    ],
    sortOptions: [
      { value: 'id', label: 'ID' },
      { value: 'nombre_comercial', label: 'Nombre Comercial' },
      { value: 'razon_social', label: 'Razón Social' },
      { value: 'created_at', label: 'Fecha creación' },
      { value: 'updated_at', label: 'Última actualización' }
    ],
    defaultSort: { field: 'nombre_comercial', direction: 'asc' },
    layout: 'inline'
  },
};
