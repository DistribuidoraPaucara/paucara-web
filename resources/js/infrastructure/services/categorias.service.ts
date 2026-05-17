// Data Layer: Categorias service - Updated to use generic architecture
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Categoria, CategoriaFormData } from '@/domain/entities/categorias';

export class CategoriasService extends GenericService<Categoria, CategoriaFormData> {
  constructor() {
    super('categorias');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.CategoriaController.index(params).url;
  }

  createUrl() {
    return Controllers.CategoriaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.CategoriaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.CategoriaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.CategoriaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.CategoriaController.destroy(Number(id)).url;
  }

  // Override validation if needed (using parent's generic validation)
  validateData(data: CategoriaFormData): string[] {
    return super.validateData(data);
  }

  // Keep existing utility methods for backward compatibility
  formatCategoriaStatus(categoria: Categoria): string {
    return this.formatStatus(categoria);
  }

  getCategoriaDisplayName(categoria: Categoria): string {
    return this.getDisplayName(categoria);
  }
}

const categoriasService = new CategoriasService();
export default categoriasService;
