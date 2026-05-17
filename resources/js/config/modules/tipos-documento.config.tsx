// Configuration: Tipos de Documento module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { TipoDocumento, TipoDocumentoFormData } from '@/domain/entities/tipos-documento';

export const tiposDocumentoConfig: ModuleConfig<TipoDocumento, TipoDocumentoFormData> = {
  // Module identification
  moduleName: 'tipos-documento',
  singularName: 'tipoDocumento',
  pluralName: 'tiposDocumento',

  // Display configuration
  displayName: 'Tipos de Documento',
  description: 'Gestiona los tipos de documento disponibles (Factura, Boleta, Recibo, etc.)',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'genera_inventario', label: 'Genera Inventario', type: 'boolean' },
    { key: 'requiere_autorizacion', label: 'Requiere Autorización', type: 'boolean' },
    { key: 'activo', label: 'Activo', type: 'boolean' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el código (p. ej. FAC, BOL, REC)',
      validation: { maxLength: 10 },
      description: 'Código único identificador del tipo de documento',
    },
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre del tipo de documento',
      validation: { maxLength: 100 },
      description: 'Nombre descriptivo (p. ej. Factura, Boleta, Recibo)',
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Descripción detallada del tipo de documento',
      validation: { maxLength: 255 },
    },
    {
      key: 'genera_inventario',
      label: 'Genera Movimiento de Inventario',
      type: 'boolean',
      required: false,
      description: 'Marque si este documento afecta el inventario',
    },
    {
      key: 'requiere_autorizacion',
      label: 'Requiere Autorización',
      type: 'boolean',
      required: false,
      description: 'Marque si requiere autorización especial (ej: facturación electrónica)',
    },
    {
      key: 'formato_numeracion',
      label: 'Formato de Numeración',
      type: 'text',
      required: false,
      placeholder: 'Ej: FAC-{YYYY}-{####}',
      validation: { maxLength: 50 },
      description: 'Formato para auto-numeración (opcional)',
    },
    {
      key: 'siguiente_numero',
      label: 'Siguiente Número',
      type: 'number',
      required: false,
      placeholder: '1',
      validation: { min: 1 },
      description: 'Próximo número de secuencia para este documento',
    },
    {
      key: 'activo',
      label: 'Activo',
      type: 'boolean',
      required: false,
      description: 'Marque para mantener este tipo de documento disponible',
    },
  ],

  // Search configuration
  searchableFields: ['codigo', 'nombre', 'descripcion'],
  searchPlaceholder: 'Buscar tipos de documento...',
};
