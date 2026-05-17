// Configuration: Localidades module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Localidad, LocalidadFormData } from '@/domain/entities/localidades';

export const localidadesConfig: ModuleConfig<Localidad, LocalidadFormData> = {
    // Module identification
    moduleName: 'localidades',
    singularName: 'localidad',
    pluralName: 'localidades',

    // Display configuration
    displayName: 'Localidades',
    description: 'Gestiona las localidades del sistema',

    // Table configuration
    tableColumns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'nombre', label: 'Nombre', type: 'text' },
        { key: 'codigo', label: 'Código', type: 'text' },
        { key: 'activo', label: 'Estado', type: 'boolean' },
    ],

    // Form configuration
    formFields: [
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true,
            placeholder: 'Ingrese el nombre de la localidad',
            validation: { maxLength: 255 }
        },
        {
            key: 'codigo',
            label: 'Código',
            type: 'text',
            required: true,
            placeholder: 'Ingrese el código de la localidad (ej: LP, SC, CB)',
            validation: { maxLength: 10 }
        },
        {
            key: 'activo',
            label: 'Localidad activa',
            type: 'boolean'
        }
    ],

    // Search configuration
    searchableFields: ['nombre', 'codigo'],
    searchPlaceholder: 'Buscar localidades...',

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
            { value: 'codigo', label: 'Código' },
            { value: 'created_at', label: 'Fecha creación' },
            { value: 'updated_at', label: 'Última actualización' }
        ],
        defaultSort: { field: 'nombre', direction: 'asc' },
        layout: 'inline'
    },
};
