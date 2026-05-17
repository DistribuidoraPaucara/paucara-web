// Data Layer: Tipos de precio service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { TipoPrecio, TipoPrecioFormData } from '@/domain/entities/tipos-precio';

export class TiposPrecioService extends GenericService<TipoPrecio, TipoPrecioFormData> {
  constructor() {
    super('tipos-precio');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoPrecioController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoPrecioController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoPrecioController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoPrecioController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoPrecioController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoPrecioController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: TipoPrecioFormData): string[] {
    const errors = super.validateData(data);

    // Validaciones específicas para tipos de precio si las hay
    // Ejemplo: validar porcentaje de ganancia
    if ('porcentaje_ganancia' in data && data.porcentaje_ganancia < 0) {
      errors.push('El porcentaje de ganancia no puede ser negativo');
    }

    return errors;
  }

  // Métodos específicos para tipos de precio
  toggleActivoUrl(id: Id): string {
    return `/tipos-precio/${id}/toggle-activo`;
  }
}

const tiposPrecioService = new TiposPrecioService();
export default tiposPrecioService;
