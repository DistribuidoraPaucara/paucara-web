// Configuration: Sectores module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Sector, SectorFormData } from '@/domain/entities/sectores';
import { createElement } from 'react';

export const sectoresConfig: ModuleConfig<Sector, SectorFormData> = {
  // Module identification
  moduleName: 'sectores',
  singularName: 'sector',
  pluralName: 'sectores',

  // Display configuration
  displayName: 'Sectores de Almacén',
  description: 'Gestiona los sectores de clasificación dentro de cada almacén',

  // Table configuration
  tableColumns: [
    { key: 'id', label: 'ID', type: 'number' },
    {
      key: 'almacen.nombre',
      label: 'Almacén',
      type: 'text',
      render: (value: unknown, sector: Sector) => {
        const almacenNombre = (sector as any)?.almacen?.nombre || '-';
        return createElement('span', { className: 'font-medium text-blue-600 dark:text-blue-400' }, almacenNombre);
      }
    },
    { key: 'nombre', label: 'Sigla', type: 'text' },
    /* {
      key: 'es_generico',
      label: 'Tipo',
      type: 'boolean',
      render: (value: boolean) => value ? '✅ General' : '📁 Clasificado'
    }, */
    { key: 'stock_minimo', label: 'Stock Mín', type: 'number' },
    { key: 'stock_maximo', label: 'Stock Máx', type: 'number' },
    { key: 'descripcion', label: 'Nombre', type: 'text' },
  ],

  // Form configuration
  formFields: [
    {
      key: 'almacen_id',
      label: 'Almacén',
      type: 'select',
      required: true,
      placeholder: 'Seleccionar almacén',
      extraDataKey: 'almacenes', // ✅ Carga desde extraData del controlador
      options: [], // Se cargarán desde extraData
    },
    {
      key: 'nombre',
      label: 'Sigla',
      type: 'text',
      required: true,
      placeholder: 'Ej: BEB, REF, LAC',
      validation: { maxLength: 100 }
    },
    {
      key: 'descripcion',
      label: 'Nombre del Sector',
      type: 'text',
      placeholder: 'Ej: Bebidas, Refrigeración, Lácteos',
      validation: { maxLength: 500 }
    },
    {
      key: 'stock_minimo',
      label: 'Stock Mínimo del Sector',
      type: 'number',
      placeholder: 'Cantidad mínima permitida',
      validation: { min: 0 }
    },
    {
      key: 'stock_maximo',
      label: 'Stock Máximo del Sector',
      type: 'number',
      placeholder: 'Capacidad máxima del sector',
      validation: { min: 0 }
    },
  ],

  // Search configuration
  searchableFields: ['id', 'nombre', 'descripcion'],
  searchPlaceholder: 'Buscar sectores...',

  // Custom messages
  messages: {
    createSuccess: 'Sector creado correctamente',
    updateSuccess: 'Sector actualizado correctamente',
    deleteSuccess: 'Sector eliminado correctamente',
    deleteConfirm: '¿Está seguro de que desea eliminar este sector? Esta acción no se puede deshacer.',
  },

  // Permissions
  permissions: {
    create: 'sectores.create',
    read: 'sectores.read',
    update: 'sectores.update',
    delete: 'sectores.delete',
  },
};
