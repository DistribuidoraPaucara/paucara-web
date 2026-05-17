// Configuration: Almacenes module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Almacen, AlmacenFormData } from '@/domain/entities/almacenes';

export const almacenesConfig: ModuleConfig<Almacen, AlmacenFormData> = {
  // Module identification
  moduleName: 'almacenes',
  singularName: 'almacén',
  pluralName: 'almacenes',

  // Display configuration
  displayName: 'Almacenes',
  description: 'Gestiona los almacenes de la empresa',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    // { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'direccion', label: 'Dirección', type: 'text' },
    { key: 'ubicacion_fisica', label: 'Ubicación', type: 'text' },
    { key: 'sectores_count', label: 'Sectores', type: 'number' },
    { key: 'requiere_transporte_externo', label: 'Transporte Ext.', type: 'boolean' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    /*{
      key: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'Código único del almacén',
      validation: { maxLength: 10 }
    },*/
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Nombre del almacén',
      validation: { maxLength: 255 }
    },
    {
      key: 'direccion',
      label: 'Dirección',
      type: 'textarea',
      placeholder: 'Dirección física del almacén'
    },
    {
      key: 'ubicacion_fisica',
      label: 'Ubicación Física',
      type: 'select',
      placeholder: 'Seleccionar ubicación física',
      options: [
        { value: '', label: 'Sin ubicación definida' },
        { value: 'SEDE_PRINCIPAL', label: '🏢 Sede Principal' },
        { value: 'SUCURSAL_NORTE', label: '🏪 Sucursal Norte' },
        { value: 'SUCURSAL_SUR', label: '🏪 Sucursal Sur' },
        { value: 'SUCURSAL_ESTE', label: '🏪 Sucursal Este' },
        { value: 'SUCURSAL_OESTE', label: '🏪 Sucursal Oeste' },
        { value: 'BODEGA_REMOTA', label: '📦 Bodega Remota' },
        { value: 'CENTRO_DISTRIBUCION', label: '🚛 Centro de Distribución' },
      ]
    },
    {
      key: 'requiere_transporte_externo',
      label: 'Siempre Requiere Transporte',
      type: 'boolean'
    },
    {
      key: 'responsable',
      label: 'Responsable',
      type: 'text',
      placeholder: 'Nombre del responsable del almacén',
      validation: { maxLength: 255 }
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      type: 'text',
      placeholder: 'Teléfono de contacto',
      validation: { maxLength: 20 }
    },
    {
      key: 'activo',
      label: 'Almacén activo',
      type: 'boolean'
    }
  ],

  // Search configuration
  searchableFields: ['id', 'nombre', 'direccion', 'ubicacion_fisica', 'responsable'],
  searchPlaceholder: 'Buscar almacenes...',
};
