// Data Layer: Unidades service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { UnidadMedida, UnidadMedidaFormData } from '@/domain/entities/unidades';

export class UnidadesService extends GenericService<UnidadMedida, UnidadMedidaFormData> {
  constructor() {
    super('unidades');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.UnidadMedidaController.index(params).url;
  }

  createUrl() {
    return Controllers.UnidadMedidaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.UnidadMedidaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.UnidadMedidaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.UnidadMedidaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.UnidadMedidaController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: UnidadMedidaFormData): string[] {
    const errors = super.validateData(data);

    if (!data.codigo || data.codigo.trim().length === 0) {
      errors.push('El código es requerido');
    }

    return errors;
  }
}

const unidadesService = new UnidadesService();
export default unidadesService;
