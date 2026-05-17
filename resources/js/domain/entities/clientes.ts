// Domain: Clientes
import type { BaseEntity, BaseFormData } from './generic';
import type { Id } from './shared';

export interface VentanaEntregaCliente {
    id?: Id;
    cliente_id?: Id;
    dia_semana: number; // 0 = domingo, 1 = lunes ... 6 = sábado
    hora_inicio: string; // Format: HH:mm
    hora_fin: string; // Format: HH:mm
    activo?: boolean;
}

export interface Cliente extends BaseEntity {
    id: Id;
    nombre: string;
    razon_social?: string | null;
    nit?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null; // ✅ Dirección principal (usado en Show de proforma)
    foto_perfil?: string | null;
    foto_perfil_url?: string | null; // URL generada para mostrar en el listado
    ci_anverso?: string | null;
    ci_reverso?: string | null;
    localidad_id?: Id | null;
    codigo_cliente?: string | null;
    activo: boolean;
    limite_credito?: number | null;
    puede_tener_credito?: boolean;
    credito_utilizado?: number | null;  // ✅ NUEVO: Crédito ya consumido
    saldo_credito?: number | null;      // ✅ NUEVO: Crédito disponible (límite - utilizado)
    categorias?: Array<{ id: Id; nombre: string; clave: string }>;  // ✅ Categorías del cliente
    localidad?: {
        id: Id;
        nombre: string;
        codigo: string;
    } | null;
    direcciones?: Array<{
        id?: Id;
        direccion: string;
        latitud: number;
        longitud: number;
        observaciones?: string | null;
        es_principal?: boolean;
        activa?: boolean;
    }>;
    ventanas_entrega?: VentanaEntregaCliente[];
    user_id?: Id | null;
    user?: {
        id: Id;
        name: string;
        email?: string | null;
        usernick: string;
        activo: boolean;
    } | null;
    empresa?: {
        id: Id;
        nombre_comercial: string;
        logistica_envios: boolean;
    } | null;
}

export interface ClienteFormData extends BaseFormData {
    id?: Id;
    nombre: string;
    razon_social?: string | null;
    nit?: string | null;
    telefono?: string | null;
    email?: string | null;
    foto_perfil?: File | string | null;
    ci_anverso?: File | string | null;
    ci_reverso?: File | string | null;
    localidad_id?: Id | null;
    activo?: boolean;
    limite_credito?: number | null;
    puede_tener_credito?: boolean;
    categorias_ids?: Id[];  // ✅ Categorías del cliente (array de IDs)
    // Direcciones anidadas del cliente
    direcciones?: Array<{
        id?: Id;
        direccion: string;
        latitud: number;
        longitud: number;
        observaciones?: string | null;
        es_principal?: boolean;
        activa?: boolean;
    }>;
    // Ventanas de entrega del cliente
    ventanas_entrega?: VentanaEntregaCliente[];
    // Campos para gestión de usuario
    crear_usuario?: boolean;
    password?: string | null;
    password_confirmation?: string | null;
}

// ✅ PageProps para el formulario de clientes
export interface ClientesFormPageProps {
    cliente?: Cliente | null;
    localidades?: Array<{ id: number; nombre: string; codigo: string }>;
    categorias?: Array<{ id: number; nombre: string; clave: string }>;
}
