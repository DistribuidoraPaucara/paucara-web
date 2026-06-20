// Data Layer: TipoOperacionCaja service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { TipoOperacionCaja, TipoOperacionCajaFormData } from '@/domain/entities/tipo-operacion-caja';

export class TipoOperacionCajaService extends GenericService<TipoOperacionCaja, TipoOperacionCajaFormData> {
  constructor() {
    super('tipo-operacion-caja');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoOperacionCajaController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoOperacionCajaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoOperacionCajaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoOperacionCajaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoOperacionCajaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoOperacionCajaController.destroy(Number(id)).url;
  }

  // Override validation if needed (using parent's generic validation)
  validateData(data: TipoOperacionCajaFormData): string[] {
    return super.validateData(data);
  }

  // Utility methods
  formatTipoOperacionCajaStatus(tipoOperacionCaja: TipoOperacionCaja): string {
    return this.formatStatus(tipoOperacionCaja);
  }

  getTipoOperacionCajaDisplayName(tipoOperacionCaja: TipoOperacionCaja): string {
    return this.getDisplayName(tipoOperacionCaja);
  }
}

const tipoOperacionCajaService = new TipoOperacionCajaService();
export default tipoOperacionCajaService;
