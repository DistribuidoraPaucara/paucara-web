// Data Layer: Tipos de documento service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { TipoDocumento, TipoDocumentoFormData } from '@/domain/entities/tipos-documento';

export class TiposDocumentoService extends GenericService<TipoDocumento, TipoDocumentoFormData> {
  constructor() {
    super('tipos-documento');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoDocumentoController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoDocumentoController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoDocumentoController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoDocumentoController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoDocumentoController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoDocumentoController.destroy(Number(id)).url;
  }

  // Validación de códigos únicos delegada al backend (SimpleCrudController)
}

const tiposDocumentoService = new TiposDocumentoService();
export default tiposDocumentoService;
