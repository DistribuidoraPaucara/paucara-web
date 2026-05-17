// Data Layer: Tipos de pago service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { TipoPago, TipoPagoFormData } from '@/domain/entities/tipos-pago';

export class TiposPagoService extends GenericService<TipoPago, TipoPagoFormData> {
  constructor() {
    super('tipos-pago');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoPagoController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoPagoController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoPagoController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoPagoController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoPagoController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoPagoController.destroy(Number(id)).url;
  }

  // Validación de códigos únicos delegada al backend (SimpleCrudController)
}

const tiposPagoService = new TiposPagoService();
export default tiposPagoService;
