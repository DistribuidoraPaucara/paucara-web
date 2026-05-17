import type { ModuleConfig } from '@/domain/entities/generic';
import type { Vehiculo, VehiculoFormData } from '@/domain/entities/vehiculos';

export const vehiculosConfig: ModuleConfig<Vehiculo, VehiculoFormData> = {
    moduleName: 'vehiculos',
    singularName: 'vehiculo',
    pluralName: 'vehiculos',
    displayName: 'Vehículos',
    description: 'Gestiona los vehículos de la flota',
    tableColumns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'placa', label: 'Placa', type: 'text' },
        { key: 'marca', label: 'Marca', type: 'text' },
        { key: 'modelo', label: 'Modelo', type: 'text' },
        { key: 'anho', label: 'Año', type: 'text' },
        { key: 'capacidad_kg', label: 'Capacidad (kg)', type: 'number' },
        { key: 'activo', label: 'Activo', type: 'boolean' },
    ],
    formFields: [
        { key: 'placa', label: 'Placa', type: 'text', required: true },
        { key: 'marca', label: 'Marca', type: 'text' },
        { key: 'modelo', label: 'Modelo', type: 'text' },
        { key: 'anho', label: 'Año', type: 'text' },
        { key: 'capacidad_kg', label: 'Capacidad (kg)', type: 'number' },
        { key: 'capacidad_volumen', label: 'Capacidad (vol)', type: 'number' },
        { key: 'chofer_asignado_id', label: 'Chofer asignado', type: 'select', extraDataKey: 'choferes' },
        { key: 'activo', label: 'Activo', type: 'boolean' },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
    ],
    searchableFields: ['placa', 'marca', 'modelo'],
    searchPlaceholder: 'Buscar vehículos...',
    indexFilters: {
        filters: [
            { key: 'activo', label: 'Activo', type: 'boolean', placeholder: 'Todos' }
        ],
        sortOptions: [
            { value: 'id', label: 'ID' },
            { value: 'placa', label: 'Placa' },
            { value: 'marca', label: 'Marca' }
        ],
        defaultSort: { field: 'placa', direction: 'asc' },
        layout: 'inline'
    }
};

export default vehiculosConfig;
