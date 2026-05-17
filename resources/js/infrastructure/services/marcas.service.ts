// Data Layer: Marcas service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Marca, MarcaFormData } from '@/domain/entities/marcas';

export class MarcasService extends GenericService<Marca, MarcaFormData> {
  constructor() {
    super('marcas');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.MarcaController.index(params).url;
  }

  createUrl() {
    return Controllers.MarcaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.MarcaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.MarcaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.MarcaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.MarcaController.destroy(Number(id)).url;
  }
}

const marcasService = new MarcasService();
export default marcasService;
