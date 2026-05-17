// Domain: Proveedores
import type { BaseEntity, BaseFormData } from './generic';
import type { Id } from './shared';

export interface Proveedor extends BaseEntity {
    id: Id;
    codigo_proveedor?: string | null;
    nombre: string;
    razon_social: string;
    nit?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    contacto?: string | null;
    foto_perfil?: string | null;
    ci_anverso?: string | null;
    ci_reverso?: string | null;
    activo: boolean;
}

export interface ProveedorFormData extends BaseFormData {
    id?: Id;
    codigo_proveedor?: string | null;
    nombre: string;
    razon_social: string;
    nit?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    coordenadas?: { latitud: number; longitud: number; address?: string } | null; // Campo temporal para MapPicker
    contacto?: string | null;
    foto_perfil?: File | string | null;
    ci_anverso?: File | string | null;
    ci_reverso?: File | string | null;
    activo?: boolean;
}
