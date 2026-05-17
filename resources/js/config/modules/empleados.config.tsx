// Configuration: Empleados module configuration
import type { ModuleConfig } from '@/domain/entities/generic';
import type { Empleado, EmpleadoFormData } from '@/domain/entities/empleados';
import RolesSelector from '@/presentation/components/empleados/RolesSelector';
import { createElement } from 'react';
import { Badge } from '@/presentation/components/ui/badge';

export const empleadosConfig: ModuleConfig<Empleado, EmpleadoFormData> = {
    // Module identification
    moduleName: 'empleados',
    singularName: 'empleado',
    pluralName: 'empleados',

    // Display configuration
    displayName: 'Empleados',
    description: 'Gestiona los empleados de la empresa',

    // 🆕 Form sections (organizar campos en secciones)
    formSections: [
        {
            id: 'Información Personal',
            title: 'Información Personal',
            description: 'Datos personales del empleado',
            order: 1,
        },
        {
            id: 'Acceso al Sistema',
            title: 'Acceso al Sistema',
            description: 'Configuración de acceso',
            order: 4,
        },
    ],

    // 🆕 Form layout (controla el diseño del formulario)
    formLayout: 'auto', // Responsive automático

    // Table configuration
    tableColumns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'codigo_empleado', label: 'Código', type: 'text' },
        { key: 'nombre', label: 'Nombre Completo', type: 'text' },
        { key: 'ci', label: 'CI', type: 'text' },
        { key: 'telefono', label: 'Teléfono', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        {
            key: 'user.roles',
            label: 'Roles',
            type: 'text',
            render: (value: unknown, entity: Empleado) => {
                const roles = entity?.user?.roles || [];

                if (!roles.length) {
                    return createElement('span', { className: 'text-xs text-muted-foreground italic' }, 'Sin roles');
                }

                return createElement('div', { className: 'flex flex-wrap gap-1' },
                    roles.map((role: unknown, idx: number) => {
                        const roleName = typeof role === 'string' ? role : (role as Record<string, string>).name;

                        // Color de badge según el rol - ✅ Solo 5 roles principales (minúsculas)
                        const roleColors: Record<string, string> = {
                            'admin': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-300 dark:border-red-700',
                            'manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-300 dark:border-purple-700',
                            'preventista': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
                            'cajero': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border-green-300 dark:border-green-700',
                            'chofer': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
                        };

                        const colorClass = roleColors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200 border-gray-300 dark:border-gray-700';

                        return createElement(Badge, {
                            key: idx,
                            className: `${colorClass} border text-xs font-semibold`,
                            variant: 'outline'
                        }, roleName);
                    })
                );
            }
        },
        { key: 'estado', label: 'Estado', type: 'text' },
        { key: 'puede_acceder_sistema', label: 'Acceso Sistema', type: 'boolean' },
    ],

    // Form configuration
    formFields: [
        {
            key: 'codigo_empleado',
            label: 'Código de Empleado',
            type: 'text',
            placeholder: 'Se genera automáticamente si se deja vacío',
            visible: (data) => !!data.id, // Solo visible si tiene ID (modo edición)
            section: 'Información Personal',
        },
        {
            key: 'nombre',
            label: 'Nombre Completo',
            type: 'text',
            required: true,
            placeholder: 'Nombre completo del empleado',
            validation: { maxLength: 255 },
            colSpan: 2, // 🆕 Ocupa 2 columnas
            section: 'Información Personal',
            description: 'Nombre completo como aparece en su CI',
        },
        {
            key: 'ci',
            label: 'Cédula de Identidad',
            type: 'text',
            required: true,
            placeholder: 'Número de cédula de identidad',
            validation: { minLength: 6, maxLength: 15 },
            colSpan: 1,
            section: 'Información Personal',
        },
        {
            key: 'fecha_ingreso',
            label: 'Fecha de Ingreso',
            type: 'date',
            required: true,
            colSpan: 1,
            section: 'Información Personal',
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            type: 'text',
            placeholder: 'Número de teléfono',
            validation: { maxLength: 20 },
            colSpan: 1,
            section: 'Información Personal',
            prefix: '📱', // 🆕 Icono de teléfono
        },
        {
            key: 'email',
            label: 'Email',
            type: 'text',
            required: false, // 🆕 Email es opcional (se puede usar nick o teléfono para login)
            placeholder: 'Correo electrónico (opcional)',
            validation: { maxLength: 255 },
            colSpan: 1,
            section: 'Información Personal',
            prefix: '✉️', // 🆕 Icono de email
            description: 'Opcional - Se puede usar nick o teléfono para acceder',
        },
        {
            key: 'direccion',
            label: 'Dirección',
            type: 'textarea',
            placeholder: 'Dirección completa',
            validation: { maxLength: 500 },
            colSpan: 3, // 🆕 Ocupa todo el ancho
            section: 'Información Personal',
        },
        // Campo personalizado para ubicación en mapa (DESHABILITADO - Las columnas latitud y longitud no existen en la tabla empleados)
        // {
        //     key: 'coordenadas',
        //     hidden: true, // Campo oculto, se maneja internamente
        //     label: 'Ubicación en el mapa',
        //     type: 'custom',
        //     colSpan: 3,
        //     fullWidth: true, // 🆕 Ocupa TODO el ancho de la pantalla
        //     section: 'Información Personal',
        //     render: ({ value, onChange, disabled, formData }) => {
        //         // formData contiene latitud y longitud separados
        //         const latitud = (formData as any)?.latitud;
        //         const longitud = (formData as any)?.longitud;
        //
        //         return createElement(MapPicker, {
        //             latitude: latitud,
        //             longitude: longitud,
        //             onLocationSelect: (lat: number, lng: number, address?: string) => {
        //                 // Actualizar los campos latitud y longitud
        //                 onChange({ latitud: lat, longitud: lng, address });
        //             },
        //             label: 'Ubicación del empleado',
        //             description: 'Selecciona la ubicación del empleado en el mapa',
        //             disabled: Boolean(disabled),
        //             height: '350px'
        //         });
        //     }
        // },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            required: true,
            options: [
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
                { value: 'vacaciones', label: 'Vacaciones' },
                { value: 'licencia', label: 'Licencia' },
                { value: 'suspendido', label: 'Suspendido' },
            ],
            colSpan: 1,
            section: 'Información Laboral',
            hidden: true, // 🆕 OCULTO - Se maneja internamente
            defaultValue: 'activo', // 🆕 Por defecto activo al crear
        },
        // Campos de acceso al sistema
        {
            key: 'puede_acceder_sistema',
            label: 'Puede Acceder al Sistema',
            type: 'boolean',
            colSpan: 3,
            section: 'Acceso al Sistema',
            description: 'Habilitar para crear un usuario de sistema',
        },
        {
            key: 'usernick',
            label: 'Nombre de Usuario (Nick)',
            type: 'text',
            required: true, // 🆕 Requerido cuando puede acceder al sistema
            placeholder: 'Nick para iniciar sesión',
            validation: { maxLength: 50 },
            colSpan: 1,
            section: 'Acceso al Sistema',
            visible: (data) => !!data.puede_acceder_sistema, // 🆕 Solo visible si puede_acceder_sistema es true
            description: 'Requerido para login - Se puede usar nick o teléfono',
        },
        {
            key: 'roles',
            label: 'Roles de Sistema',
            type: 'custom',
            colSpan: 3,
            section: 'Acceso al Sistema',
            visible: (data) => !!data.puede_acceder_sistema,
            description: 'Selecciona uno o más roles que tendrá el empleado',
            fullWidth: true,
            render: ({ value, onChange, disabled, formData }) => {
                return createElement(RolesSelector, {
                    value: value as string[] || [],
                    onChange: onChange as (roles: string[]) => void,
                    disabled: Boolean(disabled),
                    puedeAccederSistema: (formData as EmpleadoFormData)?.puede_acceder_sistema ?? false,
                    label: 'Roles de Sistema'
                });
            }
        },
        // Campos de contraseña
        {
            key: 'password',
            label: 'Contraseña',
            type: 'password',
            required: (data) => {
                // Requerido solo cuando se crea un nuevo empleado con acceso al sistema
                return !!data.puede_acceder_sistema && !data.id;
            },
            placeholder: (data) => {
                // Placeholder diferente según si es creación o edición
                return data.id
                    ? 'Dejar vacío para mantener la contraseña actual'
                    : 'Mínimo 8 caracteres';
            },
            validation: { minLength: 8 },
            colSpan: 1,
            section: 'Acceso al Sistema',
            visible: (data) => {
                // Visible si puede acceder al sistema
                return !!data.puede_acceder_sistema;
            },
            description: (data) => {
                return data.id
                    ? 'Mínimo 8 caracteres. Dejar vacío para no cambiar'
                    : 'Mínimo 8 caracteres';
            },
        },
        {
            key: 'password_confirmation',
            label: 'Confirmar Contraseña',
            type: 'password',
            required: (data) => {
                // Requerido solo si se está creando un nuevo empleado con acceso al sistema
                // O si se está cambiando la contraseña en edición
                return !!data.puede_acceder_sistema && (!data.id || !!data.password);
            },
            placeholder: 'Repetir la contraseña',
            colSpan: 1,
            section: 'Acceso al Sistema',
            visible: (data) => {
                // Visible si puede acceder al sistema
                return !!data.puede_acceder_sistema;
            },
            description: 'Debe coincidir con la contraseña',
        },
    ],

    // Search configuration
    searchableFields: ['nombre', 'ci', 'codigo_empleado', 'cargo', 'email'],
    searchPlaceholder: 'Buscar empleados por nombre, CI, código...',

    // 🆕 Modern index filters configuration (like productos)
    indexFilters: {
        filters: [
            {
                key: 'puede_acceder_sistema',
                label: 'Acceso al Sistema',
                type: 'boolean' as const,
                placeholder: 'Todos',
                width: 'md' as const,
            },
            {
                key: 'estado',
                label: 'Estado',
                type: 'select' as const,
                placeholder: 'Todos los estados',
                options: [
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
                    { value: 'vacaciones', label: 'Vacaciones' },
                    { value: 'licencia', label: 'Licencia' },
                    { value: 'suspendido', label: 'Suspendido' },
                ],
                width: 'md' as const,
            },
        ],
        sortOptions: [
            { value: 'id', label: 'ID' },
            { value: 'nombre', label: 'Nombre' },
            { value: 'codigo_empleado', label: 'Código de Empleado' },
            { value: 'ci', label: 'Cédula de Identidad' },
            { value: 'fecha_ingreso', label: 'Fecha de Ingreso' },
            { value: 'created_at', label: 'Fecha de Registro' },
        ],
        defaultSort: { field: 'nombre', direction: 'asc' as const },
        layout: 'grid' as const,
    },
};