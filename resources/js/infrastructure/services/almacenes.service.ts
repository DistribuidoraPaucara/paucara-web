// Data Layer: Almacenes service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Almacen, AlmacenFormData } from '@/domain/entities/almacenes';

export class AlmacenesService extends GenericService<Almacen, AlmacenFormData> {
  constructor() {
    super('almacenes');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.AlmacenController.index(params).url;
  }

  createUrl() {
    return Controllers.AlmacenController.create().url;
  }

  editUrl(id: Id) {
      console.log(id);
    return Controllers.AlmacenController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.AlmacenController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.AlmacenController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.AlmacenController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: AlmacenFormData): string[] {
    const errors = super.validateData(data);
    if (!data.nombre || data.nombre.trim().length === 0) {
        errors.push('El nombre es requerido');
    }

    return errors;
  }
}

const almacenesService = new AlmacenesService();
export default almacenesService;
