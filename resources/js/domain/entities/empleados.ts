// Domain: Empleados
import type { BaseEntity, BaseFormData } from './generic';
import type { Id } from './shared';

export interface Empleado extends BaseEntity {
    id: Id;
    codigo_empleado: string;
    numero_empleado: string;
    ci: string;
    telefono?: string | null;
    direccion?: string | null;
    fecha_ingreso: string;
    estado: string;
    puede_acceder_sistema: boolean;
    created_at: string;
    updated_at: string;

    // Atributos virtuales (accessors desde el modelo Laravel)
    nombre: string; // Viene de user.name
    email?: string | null; // Viene de user.email
    usernick?: string | null; // Viene de user.usernick
    roles?: string[]; // Array de nombres de roles del usuario

    // Relaciones
    user?: {
        id: Id;
        name: string;
        email: string;
        usernick?: string | null;
        roles: Array<{
            id: Id;
            name: string;
        }>;
    } | null;
}

export interface EmpleadoFormData extends BaseFormData {
    id?: Id;
    // Información personal
    nombre: string;
    ci: string;
    telefono?: string | null;
    direccion?: string | null;

    // Información laboral
    codigo_empleado?: string | null;
    fecha_ingreso: string;
    estado: string;
    observaciones?: string | null;

    // Información del sistema
    crear_usuario?: boolean;
    puede_acceder_sistema?: boolean;
    usernick?: string | null;
    email?: string | null;
    roles?: (string | number)[];

    // Cambio de contraseña (solo para edición)
    password?: string | null;
    password_confirmation?: string | null;

    // Campos específicos por rol funcional (dinámicos)
    [key: string]: unknown;
}

// Tipos para los selects y opciones
export interface DepartamentoOption {
    value: string;
    label: string;
}

export interface TipoContratoOption {
    value: string;
    label: string;
}

export interface EstadoEmpleadoOption {
    value: string;
    label: string;
}

export interface SupervisorOption {
    value: Id;
    label: string;
}

export interface RolOption {
    value: Id;
    label: string;
}

// Estados de empleado disponibles
export const ESTADOS_EMPLEADO = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
    VACACIONES: 'vacaciones',
    LICENCIA: 'licencia'
} as const;

export type EstadoEmpleado = typeof ESTADOS_EMPLEADO[keyof typeof ESTADOS_EMPLEADO];

// Tipos de contrato disponibles
export const TIPOS_CONTRATO = {
    INDEFINIDO: 'indefinido',
    TEMPORAL: 'temporal',
    PRACTICANTE: 'practicante'
} as const;

export type TipoContrato = typeof TIPOS_CONTRATO[keyof typeof TIPOS_CONTRATO];

// Departamentos predefinidos
export const DEPARTAMENTOS = {
    VENTAS: 'Ventas',
    COMPRAS: 'Compras',
    ALMACEN: 'Almacén',
    LOGISTICA: 'Logística',
    ADMINISTRACION: 'Administración',
    SISTEMAS: 'Sistemas',
    RECURSOS_HUMANOS: 'Recursos Humanos'
} as const;

export type Departamento = typeof DEPARTAMENTOS[keyof typeof DEPARTAMENTOS];