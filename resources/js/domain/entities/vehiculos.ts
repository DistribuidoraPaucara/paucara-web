// Domain: Vehiculos
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Vehiculo extends BaseEntity {
  id: Id;
  placa: string;
  modelo: string;
  marca?: string | null;
  anho?: string | null;
  capacidad_kg?: number | null;
  capacidad_volumen?: number | null;
  estado?: string;
  activo: boolean;
  chofer_asignado_id?: Id | null;
  observaciones?: string | null;

  // Relaciones
  choferAsignado?: {
    id: Id;
    name: string;
  };
}

export interface Chofer extends BaseEntity {
  id: Id;
  user_id: Id;
  telefono?: string | null;
  licencia?: string | null;
  tipo_licencia?: string | null;
  fecha_vencimiento_licencia?: string | null;

  // Relaciones
  user: {
    id: Id;
    name: string;
    email?: string;
  };
}

export interface VehiculoFormData extends BaseFormData {
  id?: Id;
  placa: string;
  modelo: string;
  marca?: string | null;
  anho?: string | null;
  capacidad_kg?: number | null;
  capacidad_volumen?: number | null;
  estado?: string;
  activo?: boolean;
  chofer_asignado_id?: Id | null;
  observaciones?: string | null;
}

export interface ChoferFormData extends BaseFormData {
  id?: Id;
  user_id: Id | '';
  telefono?: string | null;
  licencia?: string | null;
  tipo_licencia?: string | null;
  fecha_vencimiento_licencia?: string | null;
}

/**
 * Recomendación de Vehículo basada en Peso Total
 */
export interface VehiculoRecomendado {
  id: Id;
  placa: string;
  marca: string;
  modelo: string;
  anho?: string;
  capacidad_kg: string | number;
  // ✅ ACTUALIZADO: Incluyendo porcentajes de uso
  porcentaje_uso?: number; // Backward compatibility: 0-100%
  porcentaje_uso_actual?: number; // Uso actual del vehículo: 0-100%
  porcentaje_uso_con_nuevas_cargas?: number; // Uso proyectado con nuevas cargas: 0-100%
  // Capacidades disponibles
  capacidad_disponible?: number; // kg disponibles
  peso_cargado_actual?: number; // kg cargados actualmente
  estado: 'recomendado' | 'disponible' | 'excede_capacidad';
  choferAsignado?: {
    id: Id;
    name: string;
    nombre?: string;
    telefono?: string | null;
  } | null;
}

export interface VehicleRecommendationResponse {
  success: boolean;
  message: string;
  data: {
    recomendado: VehiculoRecomendado | null;
    peso_total: number;
    disponibles: VehiculoRecomendado[];
    alerta?: string;
  };
}
