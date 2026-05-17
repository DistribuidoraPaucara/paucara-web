// Domain: Estados de Documento
import type { BaseEntity } from './generic';
import type { Id } from './shared';

export interface EstadoDocumento extends BaseEntity {
    id: Id;
    nombre: string;
    codigo: string;
    descripcion?: string | null;
    activo: boolean;
    permite_edicion: boolean;
    permite_anulacion: boolean;
    es_estado_final: boolean;
    color?: string | null;
}
