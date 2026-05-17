import { ModuleConfig, FormField, TableColumn } from '@/domain/entities/generic';
import { PrecioRango, PrecioRangoFormData } from '@/domain/entities/precio-rango';

export const precioRangoConfig: ModuleConfig<PrecioRango, PrecioRangoFormData> = {
  moduleName: 'precio-rangos',
  singularName: 'rango de precio',
  pluralName: 'rangos de precios',

  // ============================================================================
  // COLUMNAS DE TABLA
  // ============================================================================
  tableColumns: [
    {
      key: 'producto',
      label: 'Producto',
      type: 'custom',
      width: 'w-40',
      render: (row: PrecioRango) => row.producto?.nombre || 'N/A'
    } as any,
    {
      key: 'rango_cantidad',
      label: 'Rango de Cantidad',
      type: 'custom',
      width: 'w-32',
      render: (row: PrecioRango) => {
        const desde = row.cantidad_minima;
        const hasta = row.cantidad_maxima ? row.cantidad_maxima : '∞';
        return `${desde}-${hasta}`;
      }
    } as any,
    {
      key: 'tipo_precio',
      label: 'Tipo de Precio',
      type: 'custom',
      width: 'w-32',
      render: (row: PrecioRango) => (
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
          {row.tipoPrecio?.nombre || 'N/A'}
        </span>
      )
    } as any,
    {
      key: 'vigencia',
      label: 'Vigencia',
      type: 'custom',
      width: 'w-40',
      render: (row: PrecioRango) => {
        if (!row.fecha_vigencia_inicio && !row.fecha_vigencia_fin) {
          return <span className="text-green-600 text-sm">Siempre activo</span>;
        }
        const desde = row.fecha_vigencia_inicio ? new Date(row.fecha_vigencia_inicio).toLocaleDateString() : '-';
        const hasta = row.fecha_vigencia_fin ? new Date(row.fecha_vigencia_fin).toLocaleDateString() : '-';
        return <span className="text-xs">{desde} a {hasta}</span>;
      }
    } as any,
    {
      key: 'activo',
      label: 'Estado',
      type: 'boolean',
      width: 'w-20'
    },
  ] as TableColumn<PrecioRango>[] as any,

  // ============================================================================
  // CAMPOS DEL FORMULARIO
  // ============================================================================
  formFields: [
    {
      key: 'producto_id',
      label: 'Producto',
      type: 'select',
      required: true,
      placeholder: 'Seleccione un producto...',
      helpText: 'El producto al que se aplicará este rango de precio',
      loadOptions: async () => {
        // Se llena dinamicamente desde el servicio
        return [];
      },
      validation: {
        min: 1
      }
    } as FormField<PrecioRangoFormData> as any,

    {
      key: 'cantidad_minima',
      label: 'Cantidad Mínima',
      type: 'number',
      required: true,
      placeholder: '1',
      helpText: 'La cantidad mínima para aplicar este rango',
      validation: {
        min: 1
      }
    },

    {
      key: 'cantidad_maxima',
      label: 'Cantidad Máxima',
      type: 'number',
      required: false,
      placeholder: 'Dejar vacío para sin límite',
      helpText: 'Dejar en blanco para indicar "desde X en adelante"',
      validation: {
        min: 1
      }
    },

    {
      key: 'tipo_precio_id',
      label: 'Tipo de Precio',
      type: 'select',
      required: true,
      placeholder: 'Seleccione el tipo de precio...',
      helpText: 'El tipo de precio que se aplicará en este rango',
      loadOptions: async () => {
        // Se llena dinamicamente desde el servicio
        return [];
      },
      validation: {
        min: 1
      }
    } as FormField<PrecioRangoFormData> as any,

    {
      key: 'fecha_vigencia_inicio',
      label: 'Fecha de Vigencia Inicio',
      type: 'date',
      required: false,
      placeholder: 'Opcional - Dejar vacío para inmediato',
      helpText: 'Fecha desde cuando es válido este rango'
    },

    {
      key: 'fecha_vigencia_fin',
      label: 'Fecha de Vigencia Fin',
      type: 'date',
      required: false,
      placeholder: 'Opcional - Dejar vacío para sin vencimiento',
      helpText: 'Fecha hasta cuando es válido este rango'
    },

    {
      key: 'orden',
      label: 'Orden',
      type: 'number',
      required: false,
      placeholder: '0',
      helpText: 'Orden de aplicación (menor = mayor prioridad)',
      validation: {
        min: 0
      }
    },

    {
      key: 'activo',
      label: 'Rango Activo',
      type: 'boolean',
      required: false,
      helpText: 'Desactiva el rango sin eliminarlo'
    },
  ],

  // ============================================================================
  // BÚSQUEDA Y FILTROS
  // ============================================================================
  searchableFields: ['producto.nombre', 'tipoPrecio.nombre'],
  searchPlaceholder: 'Buscar por producto o tipo de precio...',

  indexFilters: {
    filters: [
      {
        key: 'producto_id',
        label: 'Producto',
        type: 'select',
        width: 'sm'
      } as any,
      {
        key: 'tipo_precio_id',
        label: 'Tipo de Precio',
        type: 'select',
        width: 'sm'
      } as any,
      {
        key: 'activo',
        label: 'Estado',
        type: 'boolean',
        width: 'xs'
      }
    ],
    sortOptions: [
      { value: 'producto.nombre', label: 'Producto (A-Z)' },
      { value: 'cantidad_minima', label: 'Cantidad Mínima' },
      { value: 'created_at', label: 'Más Recientes' },
    ]
  }
};
