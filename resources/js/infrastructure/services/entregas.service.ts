/**
 * Infrastructure Layer: Entregas Service
 *
 * Encapsulates HTTP operations and URL generation for deliveries (entregas)
 * Extends GenericService for standard CRUD operations
 * Uses Inertia.js for server-side navigation
 *
 * @see app/Http/Controllers/EntregaController.php
 * @see domain/entities/entregas.ts
 */

import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Entrega, EntregaFormData } from '@/domain/entities/entregas';

export class EntregasService extends GenericService<Entrega, EntregaFormData> {
  constructor() {
    super('entregas');
  }

  // ==================== URL GENERATORS ====================

  /**
   * Generar URL del listado de entregas
   */
  indexUrl(params?: { query?: Filters }) {
    return Controllers.EntregaController.index(params).url;
  }

  /**
   * Generar URL para crear una nueva entrega (GET /logistica/entregas/create)
   */
  createUrl() {
    return Controllers.EntregaController.create['/logistica/entregas/create']().url;
  }

  /**
   * Generar URL para ver detalle de una entrega
   */
  showUrl(id: Id) {
    return Controllers.EntregaController.show(id).url;
  }

  /**
   * Generar URL para guardar una nueva entrega (POST /api/entregas)
   */
  storeUrl() {
    return Controllers.EntregaController.store['/api/entregas']().url;
  }

  /**
   * Generar URL para actualizar una entrega
   */
  updateUrl(id: Id) {
    return `/api/entregas/${id}`;
  }

  /**
   * Generar URL para eliminar una entrega
   */
  destroyUrl(id: Id) {
    return `/api/entregas/${id}`;
  }

  /**
   * Generar URL para asignar chofer y vehículo
   */
  asignarChoferVehiculoUrl(id: Id) {
    return Controllers.EntregaController.asignarChoferVehiculo(id).url;
  }

  /**
   * Generar URL para optimizar rutas de entregas
   */
  optimizarRutasUrl() {
    return Controllers.EntregaController.optimizarRutas().url;
  }

  // ==================== VALIDACIÓN ====================

  /**
   * Validar datos de formulario de entrega
   */
  validateData(data: EntregaFormData): string[] {
    const errors: string[] = [];

    if (!data.venta_id && !data.proforma_id) {
      errors.push('Debe seleccionar una venta o proforma');
    }

    if (!data.vehiculo_id) {
      errors.push('Debe seleccionar un vehículo');
    }

    if (!data.chofer_id) {
      errors.push('Debe seleccionar un chofer');
    }

    if (!data.fecha_programada) {
      errors.push('La fecha programada es requerida');
    }

    if (!data.direccion_entrega) {
      errors.push('La dirección de entrega es requerida');
    }

    if (data.peso_kg && data.peso_kg <= 0) {
      errors.push('El peso debe ser mayor a 0');
    }

    return errors;
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Formatear estado de entrega para mostrar
   */
  formatEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'PROGRAMADO': 'Programado',
      'EN_PREPARACION': 'En preparación',
      'EN_RUTA': 'En ruta',
      'EN_TRANSITO': 'En tránsito',
      'ASIGNADA': 'Asignada',
      'EN_CAMINO': 'En camino',
      'LLEGO': 'Llegó',
      'ENTREGADO': 'Entregado',
      'NOVEDAD': 'Con novedad',
      'CANCELADO': 'Cancelado',
      'FALLIDO': 'Fallido',
    };

    return estados[estado] || estado;
  }

  /**
   * Obtener clase CSS para badge de estado
   */
  getEstadoClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'PROGRAMADO': 'bg-blue-100 text-blue-800',
      'EN_PREPARACION': 'bg-yellow-100 text-yellow-800',
      'EN_RUTA': 'bg-purple-100 text-purple-800',
      'EN_TRANSITO': 'bg-indigo-100 text-indigo-800',
      'ASIGNADA': 'bg-cyan-100 text-cyan-800',
      'EN_CAMINO': 'bg-indigo-100 text-indigo-800',
      'LLEGO': 'bg-green-100 text-green-800',
      'ENTREGADO': 'bg-green-100 text-green-800',
      'NOVEDAD': 'bg-orange-100 text-orange-800',
      'CANCELADO': 'bg-red-100 text-red-800',
      'FALLIDO': 'bg-red-100 text-red-800',
    };

    return clases[estado] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtener nombre para mostrar de entrega
   */
  getDisplayName(entrega: Entrega): string {
    return entrega.numero_entrega || entrega.numero_envio || `Entrega #${entrega.id}`;
  }
}

/**
 * Singleton instance del servicio
 */
const entregasService = new EntregasService();
export default entregasService;
