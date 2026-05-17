// Domain: Admin - Gestión de Permisos
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface AdminUsuario {
    id: Id;
    name: string;
    email: string;
    roles?: string[];
    permissions_count?: number;
}

// Entidad Role (Rol)
export interface Role extends BaseEntity {
    id: Id;
    name: string;
    guard_name: string;
    display_name?: string;
    description?: string;
    created_at: string;
    updated_at?: string;
    users_count?: number;
    permissions_count?: number;
    permissions?: Permission[];
    users?: RoleUser[];
}

// Usuario asociado a un rol
export interface RoleUser {
    id: Id;
    name: string;
    email: string;
}

// Formulario de Role
export interface RoleFormData extends BaseFormData {
    id?: Id;
    name: string;
    guard_name: string;
    permissions: number[];
}

// Legacy interface para compatibilidad
export interface AdminRol {
    id: Id;
    name: string;
    display_name: string;
    description?: string;
    permissions_count?: number;
}

export interface PermisoAudit extends BaseEntity {
    id: Id;
    admin: {
        id: Id;
        name: string;
        email: string;
    };
    target_type: string;
    target_id: Id;
    target_name: string;
    action: string;
    descripcion: string;
    permisos_changed: number;
    ip_address: string;
    created_at: string;
}

export interface Permission extends BaseEntity {
    id: Id;
    name: string;
    description?: string;
    guard_name: string;
    roles_count?: number;
    users_count?: number;
    created_at?: string;
    roles?: Array<{
        id: Id;
        name: string;
    }>;
}

export interface PermissionGroup {
    module: string;
    permissions: Permission[];
}

// =============== MODULOS SIDEBAR ===============

export interface ModuloSidebar extends BaseEntity {
    id: Id;
    titulo: string;
    ruta: string;
    icono?: string;
    descripcion?: string;
    orden: number;
    activo: boolean;
    es_submenu: boolean;
    modulo_padre_id?: Id;
    padre_id?: Id; // Alias para compatibilidad con el backend
    categoria?: string;
    color?: string;
    visible_dashboard?: boolean;
    permisos?: string[];
    submodulos_count?: number;
    padre?: {
        id: Id;
        titulo: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface ModuloFormData {
    id?: Id;
    titulo: string;
    ruta: string;
    icono: string;
    descripcion: string;
    orden: number;
    activo: boolean;
    es_submenu: boolean;
    modulo_padre_id: string;
    categoria: string;
    visible_dashboard: boolean;
    permisos: string[];
    color: string;
}

// Tipos auxiliares para filtros y vistas de módulos
export interface FiltrosModulo {
    busqueda: string;
    tipo: 'todos' | 'principal' | 'submenu';
    estado: 'todos' | 'activo' | 'inactivo';
    categoria: string;
    rolRequerido: string;
}

export type VistaActual = 'tabla' | 'agrupada' | 'lista';

// Tipo para operaciones en lote de módulos
export type BulkOperation =
  | { tipo: 'estado'; valor: boolean }
  | { tipo: 'categoria'; valor: string }
  | { tipo: 'permisos'; permisos: string[]; accion: 'agregar' | 'reemplazar' | 'eliminar' }
  | { tipo: 'visible_dashboard'; valor: boolean };

export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    children?: NavItem[];
}

// =============== PAGE PROPS ===============

export interface AdminPermisosIndexPageProps {
    [key: string]: unknown;
}

export interface AdminPermisosUsuarioPageProps {
    usuario: AdminUsuario;
    permissions: Array<{
        id: Id;
        name: string;
        checked: boolean;
        category?: string;
    }>;
    [key: string]: unknown;
}

export interface AdminPermisosRolPageProps {
    rol: AdminRol;
    permissions: Array<{
        id: Id;
        name: string;
        checked: boolean;
        category?: string;
    }>;
    [key: string]: unknown;
}
