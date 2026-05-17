// Data Layer: Tipo de Merma service
// Patrón consolidado: Extiende GenericService para Inertia.js
// Añade métodos HTTP directo para modales y componentes que no usan Inertia.js
import axios from 'axios';
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { TipoMerma, TipoMermaFormData } from '@/domain/entities/tipo-merma';

export class TipoMermaService extends GenericService<TipoMerma, TipoMermaFormData> {
  constructor() {
    super('tipo-mermas');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoMermaController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoMermaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoMermaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoMermaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoMermaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoMermaController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: TipoMermaFormData): string[] {
    const errors = super.validateData(data);

    if (!data.nombre || data.nombre.trim().length === 0) {
      errors.push('El nombre es requerido');
    }

    return errors;
  }

  // ========================================
  // Métodos HTTP directo para modales/componentes
  // ========================================

  async getAll() {
    const { data } = await axios.get('/api/tipo-mermas');
    return data.data as TipoMerma[];
  }

  async create(payload: TipoMermaFormData) {
    const { data } = await axios.post('/api/tipo-mermas', payload);
    return data.data as TipoMerma;
  }

  async update(id: number, payload: Partial<TipoMermaFormData>) {
    const { data } = await axios.put(`/api/tipo-mermas/${id}`, payload);
    return data.data as TipoMerma;
  }

  async remove(id: number) {
    await axios.delete(`/api/tipo-mermas/${id}`);
  }
}

const tipoMermaService = new TipoMermaService();
export default tipoMermaService;
