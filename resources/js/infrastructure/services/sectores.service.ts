// Data Layer: Sectores service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Sector, SectorFormData } from '@/domain/entities/sectores';

export class SectoresService extends GenericService<Sector, SectorFormData> {
  constructor() {
    super('sectores');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.SectorController.index(params).url;
  }

  createUrl() {
    return Controllers.SectorController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.SectorController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.SectorController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.SectorController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.SectorController.destroy(Number(id)).url;
  }

  /**
   * Obtener sector genérico de un almacén
   * GET /api/almacenes/{almacenId}/sector-generico
   */
  async obtenerGenerico(almacenId: Id): Promise<Sector> {
    const url = `/api/almacenes/${almacenId}/sector-generico`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener sector genérico');
    const data = await response.json();
    return data.data;
  }

  /**
   * Listar sectores de un almacén específico
   * GET /api/sectores?almacen_id=2
   */
  async listarPorAlmacen(almacenId: Id): Promise<Sector[]> {
    const url = `/api/sectores?almacen_id=${almacenId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener sectores');
    const data = await response.json();
    return data.data;
  }

  // Override validation for specific fields
  validateData(data: SectorFormData): string[] {
    const errors = super.validateData(data);

    if (!data.almacen_id) {
      errors.push('El almacén es requerido');
    }

    if (!data.nombre || data.nombre.trim().length === 0) {
      errors.push('El nombre del sector es requerido');
    }

    if (data.nombre && data.nombre.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }

    if (data.descripcion && data.descripcion.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }

    return errors;
  }
}

const sectoresService = new SectoresService();
export default sectoresService;
