// Configuration: Clientes module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Cliente, ClienteFormData } from '@/domain/entities/clientes';
import FileUploadPreview from '@/presentation/components/generic/FileUploadPreview';
import MapPickerWithLocations from '@/presentation/components/maps/MapPickerWithLocations';
import VentanasEntregaSelector from '@/presentation/components/clientes/VentanasEntregaSelector';
import React, { createElement } from 'react';

export const clientesConfig: ModuleConfig<Cliente, ClienteFormData> = {
    // Module identification
    moduleName: 'clientes',
    singularName: 'cliente',
    pluralName: 'clientes',

    // Display configuration
    displayName: 'Clientes',
    description: 'Gestiona los clientes',

    // 🆕 Form sections (organizar campos en secciones)
    formSections: [
        {
            id: 'Información Personal',
            title: 'Información Personal',
            description: 'Datos básicos del cliente',
            order: 1,
        },
        {
            id: 'Configuración de Crédito',
            title: 'Configuración de Crédito',
            description: 'Control de crédito y límites',
            order: 2,
        },
        {
            id: 'Direcciones',
            title: 'Direcciones',
            description: 'Localidad y dirección de entrega',
            order: 3,
        },
        {
            id: 'Dias de visitas',
            title: 'Días de Visita',
            description: 'Días y horarios en que el cliente prefiere recibir visitas',
            order: 4,
        },
        {
            id: 'Fotos',
            title: 'Fotos',
            description: 'Imágenes y documentos del cliente',
            order: 5,
        },
    ],

    // 🆕 Form layout (controla el diseño del formulario)
    formLayout: 'auto', // Responsive automático

    // Table configuration
    tableColumns: [
        { key: 'id', label: 'ID', type: 'number' },
        {
            key: 'foto_perfil_url',
            label: 'Foto',
            type: 'text',
            render: (value: unknown) => {
                const imageUrl = (value as string | null) || null;
                return createElement('div', { className: 'flex items-center justify-center' },
                    createElement('div', {
                        className: 'w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative'
                    },
                        imageUrl
                            ? [
                                createElement('img', {
                                    key: 'image',
                                    src: imageUrl,
                                    alt: 'Perfil',
                                    className: 'w-full h-full object-cover',
                                    onError: (e: any) => {
                                        // Ocultar la imagen y mostrar el icono cuando falle la carga
                                        e.target.style.display = 'none';
                                        const icon = e.target.nextElementSibling;
                                        if (icon) icon.style.display = 'block';
                                    }
                                }),
                                createElement('svg', {
                                    key: 'icon',
                                    className: 'w-6 h-6 text-gray-400',
                                    fill: 'currentColor',
                                    viewBox: '0 0 24 24',
                                    style: { display: 'none' }
                                },
                                    createElement('path', {
                                        d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                                    })
                                )
                            ]
                            : createElement('svg', {
                                className: 'w-6 h-6 text-gray-400',
                                fill: 'currentColor',
                                viewBox: '0 0 24 24'
                            },
                                createElement('path', {
                                    d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                                })
                            )
                    )
                );
            }
        },
        { key: 'codigo_cliente', label: 'Código', type: 'text' },
        { key: 'nombre', label: 'Nombre', type: 'text' },
        { key: 'razon_social', label: 'Razon Social', type: 'text' },
        { key: 'nit', label: 'N° Documento', type: 'text' },
        { key: 'telefono', label: 'Teléfono', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'localidad.nombre', label: 'Localidad', type: 'text' },
        {
            key: 'puede_tener_credito',
            label: 'Crédito',
            type: 'boolean',
            render: (value: unknown, row: any) => {
                if (!value) return createElement('span', { className: 'text-gray-400 text-sm' }, '❌ Deshabilitado');
                return createElement('div', { className: 'flex items-center space-x-1' },
                    createElement('span', { className: 'text-green-600 text-sm' }, '✅ Habilitado'),
                    row.limite_credito ? createElement('span', { className: 'text-blue-600 text-xs' }, `(${row.limite_credito})`) : null
                );
            }
        },
        { key: 'activo', label: 'Estado', type: 'boolean' },
    ],

    // Form configuration
    formFields: [
        // 📋 Código de cliente - Solo visible en modo EDICIÓN
        {
            key: 'codigo_cliente',
            label: 'Código de Cliente',
            type: 'text',
            visible: (data) => !!data.id, // Solo visible si tiene ID (modo edición)
            //disabled: () => true, // Siempre deshabilitado (solo lectura)
            placeholder: 'Se genera automáticamente',
            colSpan: 1,
            section: 'Información Personal',
            description: 'Código único generado automáticamente basado en la localidad',
            prefix: '#',
        },
        {
            key: 'nombre',
            label: 'Nombre',
            type: 'text',
            required: true,
            placeholder: 'Nombre del cliente',
            validation: { maxLength: 255 },
            colSpan: 2, // 🆕 Ocupa 2 columnas
            section: 'Información Personal',
            description: 'Nombre completo o razón social del cliente',
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
            placeholder: 'cliente@empresa.com',
            colSpan: 1,
            section: 'Información Personal',
            prefix: '✉️',
        },
        // ✅ Estado activo - Solo visible en modo EDICIÓN
        {
            key: 'activo',
            label: 'Cliente activo',
            type: 'boolean',
            visible: (data) => !!data.id, // Solo visible si tiene ID (modo edición)
            defaultValue: true,
            colSpan: 1,
            section: 'Información Personal',
            description: 'Marcar como activo para poder realizar ventas',
        },
        // 💳 SECCIÓN DE CONFIGURACIÓN DE CRÉDITO
        {
            key: 'puede_tener_credito',
            label: 'Habilitar crédito',
            type: 'boolean',
            defaultValue: false,
            colSpan: 1,
            section: 'Configuración de Crédito',
            description: 'Marca esta opción para permitir que el cliente realice compras a crédito',
        },
        {
            key: 'limite_credito',
            label: 'Límite de crédito',
            type: 'number',
            placeholder: 'Ej: 10000',
            colSpan: 2,
            section: 'Configuración de Crédito',
            description: 'Monto máximo que el cliente puede comprar a crédito',
            visible: (data) => data.puede_tener_credito === true,
            validation: {
                minValue: 0,
                step: '0.01'
            },
            prefix: '💰',
        },
        // 📍 SECCIÓN DE DIRECCIONES
        {
            key: 'localidad_id',
            label: 'Localidad',
            type: 'select',
            required: true,
            placeholder: 'Seleccione una localidad',
            extraDataKey: 'localidades',
            options: [], // Se cargarán dinámicamente
            colSpan: 3,
            section: 'Direcciones',
            description: 'Selecciona la localidad donde reside el cliente',
        },
        // Campo personalizado para ubicaciones en el mapa con modal
        {
            key: 'direcciones',
            label: 'Ubicaciones del cliente',
            type: 'custom',
            fullWidth: true, // Ocupa TODO el ancho de la pantalla
            section: 'Direcciones',
            render: ({ value, onChange, disabled, formData, setFieldValue }) => {
                // value es un array de DireccionData
                const addresses = Array.isArray(value) ? value : [];
                // Obtener localidad_id del formulario actual
                const localidadId = formData?.localidad_id || null;

                return createElement(MapPickerWithLocations, {
                    addresses: addresses,
                    onAddressesChange: (newAddresses: any[]) => {
                        onChange(newAddresses);
                    },
                    label: 'Ubicaciones del cliente',
                    description: 'Haz clic en el mapa para agregar una nueva ubicación o en un marcador para editarla',
                    disabled: Boolean(disabled),
                    height: '450px',
                    localidadId: localidadId,
                    // ✨ NUEVO: Callback para auto-rellenar localidad cuando se detecta
                    onLocalidadDetected: (id: number, nombre: string) => {
                        if (setFieldValue) {
                            setFieldValue('localidad_id', id);
                            console.log(`✅ Localidad auto-detectada: ${nombre} (ID: ${id})`);
                        }
                    }
                });
            }
        },
        // 📅 SECCIÓN DE VENTANAS DE ENTREGA
        {
            key: 'ventanas_entrega',
            label: 'Días y horarios de visita',
            type: 'custom',
            fullWidth: true,
            section: 'Dias de visitas',
            render: ({ value, onChange, disabled }) => {
                const ventanas = Array.isArray(value) ? value : [];

                return createElement(VentanasEntregaSelector, {
                    value: ventanas,
                    onChange: onChange,
                    disabled: Boolean(disabled)
                });
            }
        },
        // 📷 SECCIÓN DE FOTOS
        {
            key: 'foto_perfil',
            label: 'Foto de perfil (opcional)',
            type: 'file',
            colSpan: 3,
            section: 'Fotos',
            description: 'Foto del cliente o logo de la empresa',
            render: ({ value, onChange, label, disabled, formData }) => {
                // Buscar el campo _preview si existe (para modo edición)
                const previewUrl = (formData as any)?.foto_perfil_preview || null;
                return createElement(FileUploadPreview, {
                    label,
                    name: 'foto_perfil',
                    value: value as File | string | null,
                    previewUrl: previewUrl as string | null,
                    onChange: onChange as (file: File | null) => void,
                    previewType: 'circle',
                    disabled,
                });
            },
        },
        {
            key: 'ci_anverso',
            label: 'CI - Anverso (opcional)',
            type: 'file',
            colSpan: 1,
            section: 'Fotos',
            description: 'Anverso del carnet de identidad',
            render: ({ value, onChange, label, disabled, formData }) => {
                // Buscar el campo _preview si existe (para modo edición)
                const previewUrl = (formData as any)?.ci_anverso_preview || null;
                return createElement(FileUploadPreview, {
                    label,
                    name: 'ci_anverso',
                    value: value as File | string | null,
                    previewUrl: previewUrl as string | null,
                    onChange: onChange as (file: File | null) => void,
                    previewType: 'rect',
                    disabled,
                });
            },
        },
        {
            key: 'ci_reverso',
            label: 'CI - Reverso (opcional)',
            type: 'file',
            colSpan: 1,
            section: 'Fotos',
            description: 'Reverso del carnet de identidad',
            render: ({ value, onChange, label, disabled, formData }) => {
                // Buscar el campo _preview si existe (para modo edición)
                const previewUrl = (formData as any)?.ci_reverso_preview || null;
                return createElement(FileUploadPreview, {
                    label,
                    name: 'ci_reverso',
                    value: value as File | string | null,
                    previewUrl: previewUrl as string | null,
                    onChange: onChange as (file: File | null) => void,
                    previewType: 'rect',
                    disabled,
                });
            },
        },
    ],

    // Search configuration
    searchableFields: ['codigo_cliente', 'nombre', 'razon_social', 'nit', 'email', 'telefono'],
    searchPlaceholder: 'Buscar clientes...',

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
                key: 'puede_tener_credito',
                label: 'Habilitación de crédito',
                type: 'boolean',
                placeholder: 'Todos los tipos',
                width: 'sm'
            },
            {
                key: 'localidad_id',
                label: 'Localidad del cliente',
                type: 'select',
                placeholder: 'Todas las localidades',
                extraDataKey: 'localidades',
                width: 'md'
            }
        ],
        sortOptions: [
            { value: 'id', label: 'ID' },
            { value: 'nombre', label: 'Nombre' },
            { value: 'razon_social', label: 'Razón Social' },
            { value: 'puede_tener_credito', label: 'Habilitación de crédito' },
            { value: 'limite_credito', label: 'Límite de crédito' },
            { value: 'created_at', label: 'Fecha registro' },
            { value: 'updated_at', label: 'Última actualización' }
        ],
        defaultSort: { field: 'nombre', direction: 'asc' },
        layout: 'grid'
    },

    // Legacy support (deprecated)
    showIndexFilters: true,
};
