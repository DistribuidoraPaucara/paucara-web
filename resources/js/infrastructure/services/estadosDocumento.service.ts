// Infrastructure: EstadosDocumento service for API communication
import { GenericService } from './generic.service';
import type { EstadoDocumento, EstadoDocumentoFormData } from '@/domain/entities/estadosDocumento';

class EstadosDocumentoService extends GenericService<EstadoDocumento, EstadoDocumentoFormData> {
  constructor() {
    super('estados-documento');
  }

  indexUrl(): string {
    return '/estados-documento';
  }

  createUrl(): string {
    return '/estados-documento/create';
  }

  storeUrl(): string {
    return '/estados-documento';
  }

  editUrl(id: number | string): string {
    return `/estados-documento/${id}/edit`;
  }

  updateUrl(id: number | string): string {
    return `/estados-documento/${id}`;
  }

  destroyUrl(id: number | string): string {
    return `/estados-documento/${id}`;
  }

  showUrl(id: number | string): string {
    return `/estados-documento/${id}`;
  }
}

export default new EstadosDocumentoService();
