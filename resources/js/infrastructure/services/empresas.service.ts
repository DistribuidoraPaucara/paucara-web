// Data Layer: Empresas service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Empresa, EmpresaFormData } from '@/domain/entities/empresas';

export class EmpresasService extends GenericService<Empresa, EmpresaFormData> {
  constructor() {
    super('empresas');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.EmpresaController.index(params).url;
  }

  createUrl() {
    return Controllers.EmpresaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.EmpresaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.EmpresaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.EmpresaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.EmpresaController.destroy(Number(id)).url;
  }

  // Override validation if needed (using parent's generic validation)
  validateData(data: EmpresaFormData): string[] {
    return super.validateData(data);
  }

  // Utility methods
  formatEmpresaStatus(empresa: Empresa): string {
    return this.formatStatus(empresa);
  }

  getEmpresaDisplayName(empresa: Empresa): string {
    return empresa.nombre_comercial;
  }

  // Get logo URL helper
  getLogoUrl(empresa: Empresa, type: 'principal' | 'compacto' | 'footer' = 'principal'): string | null {
    const field = `logo_${type}` as keyof Empresa;
    return (empresa[field] as string) || null;
  }
}

const empresasService = new EmpresasService();
export default empresasService;
