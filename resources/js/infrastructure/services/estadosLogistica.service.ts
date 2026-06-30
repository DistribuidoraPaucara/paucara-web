// Data Layer: EstadosLogistica service - Updated to use generic architecture
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { EstadoLogistica, EstadoLogisticaFormData } from '@/domain/entities/estadosLogistica';

export class EstadosLogisticaService extends GenericService<EstadoLogistica, EstadoLogisticaFormData> {
  constructor() {
    super('estadosLogistica');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.EstadosLogisticaController.index(params).url;
  }

  createUrl() {
    return Controllers.EstadosLogisticaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.EstadosLogisticaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.EstadosLogisticaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.EstadosLogisticaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.EstadosLogisticaController.destroy(Number(id)).url;
  }

  // Override validation if needed (using parent's generic validation)
  validateData(data: EstadoLogisticaFormData): string[] {
    return super.validateData(data);
  }

  // Keep existing utility methods for backward compatibility
  formatEstadoStatus(estado: EstadoLogistica): string {
    return this.formatStatus(estado);
  }

  getEstadoDisplayName(estado: EstadoLogistica): string {
    return this.getDisplayName(estado);
  }
}

const estadosLogisticaService = new EstadosLogisticaService();
export default estadosLogisticaService;
