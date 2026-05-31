// Configuration: Almacenes Prestables module configuration
import type { ModuleConfig } from '@/domain/entities/generic';

export interface AlmacenPrestable {
  id: number;
  nombre: string;
  direccion: string;
  ubicacion_fisica: string;
  requiere_transporte_externo: boolean;
  responsable: string;
  telefono: string;
  es_proveedor: boolean;
  activo: boolean;
}

export interface AlmacenPrestableFormData {
  nombre: string;
  direccion: string;
  ubicacion_fisica: string;
  requiere_transporte_externo: boolean;
  responsable: string;
  telefono: string;
  es_proveedor: boolean;
  activo: boolean;
}

export const almacenesPrestablesConfig: ModuleConfig<AlmacenPrestable, AlmacenPrestableFormData> = {
  // Module identification
  moduleName: 'almacenes-prestables',
  singularName: 'almacén prestable',
  pluralName: 'almacenes prestables',

  // Display configuration
  displayName: 'Almacenes Prestables',
  description: 'Gestiona los almacenes de productos prestables',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    {
      key: 'es_proveedor',
      label: 'Tipo',
      type: 'text',
      render: (value: boolean) => {
        const isProveedor = value === true || value === 1 || value === 'true';
        return (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all ${
            isProveedor
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-2 border-blue-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-200 dark:border-blue-600'
              : 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-2 border-purple-300 dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-200 dark:border-purple-600'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${isProveedor ? 'bg-blue-500 shadow-blue-400/50' : 'bg-purple-500 shadow-purple-400/50'} shadow-md`}></span>
            {isProveedor ? '📦 Proveedor' : '🏢 Distribuidora'}
          </span>
        );
      }
    },
    { key: 'activo', label: 'Estado', type: 'boolean' },
    // { key: 'direccion', label: 'Dirección', type: 'text' },
    // { key: 'ubicacion_fisica', label: 'Ubicación', type: 'text' },
    // { key: 'responsable', label: 'Responsable', type: 'text' },
    // { key: 'requiere_transporte_externo', label: 'Transporte Ext.', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Nombre del almacén',
      validation: { maxLength: 255 }
    },
    {
      key: 'es_proveedor',
      label: 'Tipo de Almacén',
      type: 'select',
      placeholder: 'Seleccionar tipo',
      options: [
        { value: false, label: '🏢 Distribuidora' },
        { value: true, label: '📦 Proveedor' },
      ]
    },
    /* {
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
      key: 'requiere_transporte_externo',
      label: 'Siempre Requiere Transporte',
      type: 'boolean'
    },*/
    {
      key: 'activo',
      label: 'Almacén activo',
      type: 'boolean'
    }
  ],

  // Search configuration
  searchableFields: ['id', 'nombre'],
  searchPlaceholder: 'Buscar almacenes prestables...',
};
