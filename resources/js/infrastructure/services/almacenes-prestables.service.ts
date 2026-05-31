// Data Layer: Almacenes Prestables service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { AlmacenPrestable, AlmacenPrestableFormData } from '@/config/modules/almacenes-prestables.config';

export class AlmacenesPrestablesService extends GenericService<AlmacenPrestable, AlmacenPrestableFormData> {
  constructor() {
    super('almacenes-prestables');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.AlmacenPrestableController.index(params).url;
  }

  createUrl() {
    return Controllers.AlmacenPrestableController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.AlmacenPrestableController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.AlmacenPrestableController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.AlmacenPrestableController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.AlmacenPrestableController.destroy(Number(id)).url;
  }

  // Procesar datos booleanos antes de enviar al backend
  prepareDataForBackend(data: AlmacenPrestableFormData): AlmacenPrestableFormData {
    return {
      ...data,
      es_proveedor: data.es_proveedor === true || data.es_proveedor === 'true',
      requiere_transporte_externo: data.requiere_transporte_externo === true || data.requiere_transporte_externo === 'true',
      activo: data.activo === true || data.activo === 'true',
    } as AlmacenPrestableFormData;
  }

  // Override validation for specific fields
  validateData(data: AlmacenPrestableFormData): string[] {
    const errors = super.validateData(data);
    if (!data.nombre || data.nombre.trim().length === 0) {
      errors.push('El nombre es requerido');
    }

    return errors;
  }
}

const almacenesPrestablesService = new AlmacenesPrestablesService();
export default almacenesPrestablesService;
