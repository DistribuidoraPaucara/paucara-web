// Domain: Localidades
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Localidad extends BaseEntity {
    id: Id;
    nombre: string;
    codigo: string;
    activo: boolean;
}

export interface LocalidadFormData extends BaseFormData {
    id?: Id;
    nombre: string;
    codigo: string;
    activo?: boolean;
}
