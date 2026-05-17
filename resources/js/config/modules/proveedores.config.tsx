// Configuration: Proveedores module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Proveedor, ProveedorFormData } from '@/domain/entities/proveedores';
import FileUploadPreview from '@/presentation/components/generic/FileUploadPreview';
import MapPicker from '@/presentation/components/maps/MapPicker';
import { createElement } from 'react';

export const proveedoresConfig: ModuleConfig<Proveedor, ProveedorFormData> = {
    // Module identification
    moduleName: 'proveedores',
    singularName: 'proveedor',
    pluralName: 'proveedores',

    // Display configuration
    displayName: 'Proveedores',
    description: 'Gestiona los proveedores de productos',

    // 🆕 Form sections (organizar campos en secciones)
    formSections: [
        {
            id: 'Información Personal',
            title: 'Información Personal',
            description: 'Datos básicos del proveedor',
            order: 1,
        },
        {
            id: 'Ubicación',
            title: 'Ubicación',
            description: 'Dirección y ubicación en el mapa',
            order: 2,
        },
        {
            id: 'Fotos',
            title: 'Fotos',
            description: 'Imágenes y documentos del proveedor',
            order: 3,
        },
    ],

    // 🆕 Form layout (controla el diseño del formulario)
    formLayout: 'auto', // Responsive automático

    // Table configuration
    tableColumns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'codigo_proveedor', label: 'Código', type: 'text' },
        { key: 'nombre', label: 'Nombre', type: 'text' },
        { key: 'razon_social', label: 'Razon Social', type: 'text' },
        { key: 'nit', label: 'N° Documento', type: 'text' },
        { key: 'telefono', label: 'Teléfono', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'activo', label: 'Estado', type: 'boolean' },
    ],

    // Form configuration
    formFields: [
        // 📋 Código de proveedor - Solo visible en modo EDICIÓN
        {
            key: 'codigo_proveedor',
            label: 'Código de Proveedor',
            type: 'text',
            visible: (data) => !!data.id, // Solo visible si tiene ID (modo edición)
            placeholder: 'Se genera automáticamente',
            colSpan: 1,
            section: 'Información Personal',
            description: 'Código único generado automáticamente (PRV + ID)',
            prefix: '#',
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true,
            placeholder: 'Nombre del proveedor',
            validation: { maxLength: 255 },
            colSpan: 2, // 🆕 Ocupa 2 columnas
            section: 'Información Personal',
            description: 'Nombre comercial del proveedor',
        },
        {
            key: 'razon_social',
            label: 'Razón Social',
            type: 'text',
            placeholder: 'Razón social',
            validation: { maxLength: 255 },
            colSpan: 1,
            section: 'Información Personal',
        },
        {
            key: 'nit',
            label: 'NIT / N° Documento',
            type: 'text',
            required: false,
            placeholder: '20123456789',
            validation: { maxLength: 255 },
            colSpan: 1,
            section: 'Información Personal',
            prefix: '🆔',
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            type: 'text',
            placeholder: '(01) 234-5678',
            colSpan: 1,
            section: 'Información Personal',
            prefix: '📱',
        },
        {
            key: 'email',
            label: 'Email',
            type: 'text',
            placeholder: 'proveedor@empresa.com',
            colSpan: 1,
            section: 'Información Personal',
            prefix: '✉️',
        },
        {
            key: 'contacto',
            label: 'Persona de Contacto',
            type: 'text',
            placeholder: 'Nombre del contacto principal',
            colSpan: 1,
            section: 'Información Personal',
            prefix: '👤',
        },
        {
            key: 'activo',
            label: 'Proveedor activo',
            type: 'boolean',
            colSpan: 3,
            section: 'Información Personal',
            description: 'Marcar como activo para poder realizar compras',
            defaultValue: true, // 🆕 Por defecto activo al crear
            hidden: true, // 🆕 Oculto en el formulario
        },
        // 📍 SECCIÓN DE UBICACIÓN
        {
            key: 'direccion',
            label: 'Dirección / Observaciones del lugar',
            type: 'textarea',
            placeholder: 'Dirección completa del proveedor y observaciones sobre el lugar',
            colSpan: 3, // 🆕 Ocupa todo el ancho
            section: 'Ubicación',
            description: 'Describe la dirección y cualquier observación útil para llegar al lugar',
        },
        // Campo para habilitar/deshabilitar el mapa
        {
            key: 'mostrar_ubicacion',
            label: 'Mostrar ubicación en mapa',
            type: 'boolean',
            colSpan: 3,
            section: 'Ubicación',
            visible: false, // No renderizar normalmente
            defaultValue: false,
        },
        // Campo personalizado para ubicación en mapa (con botón integrado)
        {
            key: 'ubicacion_mapa',
            label: '',
            type: 'custom',
            colSpan: 3,
            fullWidth: true,
            section: 'Ubicación',
            render: ({ formData, onChange }) => {
                const mostrarMapa = (formData as any)?.mostrar_ubicacion === true;
                const latitud = (formData as any)?.latitud;
                const longitud = (formData as any)?.longitud;

                // Si el mapa está oculto, mostrar botón
                if (!mostrarMapa) {
                    return createElement('div', { className: 'flex gap-2' },
                        createElement('button', {
                            type: 'button',
                            className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2',
                            onClick: (e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Actualizar el campo mostrar_ubicacion
                                onChange({ mostrar_ubicacion: true });
                            },
                        },
                            createElement('span', null, '📍'),
                            createElement('span', null, 'Mostrar mapa')
                        )
                    );
                }

                // Si el mapa está habilitado, mostrar el MapPicker
                return createElement('div', { className: 'space-y-3' },
                    createElement('div', { className: 'flex gap-2' },
                        createElement('button', {
                            type: 'button',
                            className: 'px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors flex items-center gap-2',
                            onClick: (e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Ocultar el mapa
                                onChange({ mostrar_ubicacion: false });
                            },
                        },
                            createElement('span', null, '❌'),
                            createElement('span', null, 'Ocultar mapa')
                        )
                    ),
                    createElement(MapPicker, {
                        latitude: latitud,
                        longitude: longitud,
                        onLocationSelect: (lat: number, lng: number, address?: string) => {
                            // Actualizar los campos latitud y longitud
                            onChange({ latitud: lat, longitud: lng, address });
                        },
                        label: 'Ubicación del proveedor',
                        description: 'Selecciona la ubicación del proveedor en el mapa',
                        disabled: false,
                        height: '350px'
                    })
                );
            }
        },
        // 📷 SECCIÓN DE FOTOS
        {
            key: 'foto_perfil',
            label: 'Foto de perfil (opcional)',
            type: 'file',
            colSpan: 3,
            section: 'Fotos',
            description: 'Foto del proveedor o logo de la empresa',
            render: ({ value, onChange, label, disabled }) =>
                createElement(FileUploadPreview, {
                    label,
                    name: 'foto_perfil',
                    value: value as File | string | null,
                    onChange: onChange as (file: File | null) => void,
                    previewType: 'circle',
                    disabled,
                }),
        },
        {
            key: 'ci_anverso',
            label: 'CI - Anverso (opcional)',
            type: 'file',
            colSpan: 1,
            section: 'Fotos',
            description: 'Anverso del carnet de identidad',
            render: ({ value, onChange, label, disabled }) =>
                createElement(FileUploadPreview, {
                    label,
                    name: 'ci_anverso',
                    value: value as File | string | null,
                    onChange: onChange as (file: File | null) => void,
                    previewType: 'rect',
                    disabled,
                }),
        },
        {
            key: 'ci_reverso',
            label: 'CI - Reverso (opcional)',
            type: 'file',
            colSpan: 1,
            section: 'Fotos',
            description: 'Reverso del carnet de identidad',
            render: ({ value, onChange, label, disabled }) =>
                createElement(FileUploadPreview, {
                    label,
                    name: 'ci_reverso',
                    value: value as File | string | null,
                    onChange: onChange as (file: File | null) => void,
                    previewType: 'rect',
                    disabled,
                }),
        },
    ],

    // Search configuration
    searchableFields: ['nombre', 'razon_social', 'nit', 'email', 'telefono'],
    searchPlaceholder: 'Buscar proveedores...',

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
                key: 'tipo_proveedor',
                label: 'Tipo de proveedor',
                type: 'select',
                placeholder: 'Todos los tipos',
                options: [
                    { value: 'local', label: 'Local' },
                    { value: 'nacional', label: 'Nacional' },
                    { value: 'internacional', label: 'Internacional' }
                ],
                width: 'md'
            },
            {
                key: 'tiene_contacto',
                label: 'Con contacto',
                type: 'boolean',
                placeholder: 'Todos',
                width: 'sm'
            }
        ],
        sortOptions: [
            { value: 'id', label: 'ID' },
            { value: 'nombre', label: 'Nombre' },
            { value: 'razon_social', label: 'Razón Social' },
            { value: 'created_at', label: 'Fecha registro' },
            { value: 'updated_at', label: 'Última actualización' }
        ],
        defaultSort: { field: 'nombre', direction: 'asc' },
        layout: 'grid'
    },

    // Legacy support (deprecated)
    showIndexFilters: true,
};
