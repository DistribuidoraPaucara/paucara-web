// Data Layer: Estado de Merma service
// Patrón consolidado: Extiende GenericService para Inertia.js
// Añade métodos HTTP directo para modales y componentes que no usan Inertia.js
import axios from 'axios';
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { EstadoMerma, EstadoMermaFormData } from '@/domain/entities/estado-merma';

export class EstadoMermaService extends GenericService<EstadoMerma, EstadoMermaFormData> {
  constructor() {
    super('estado-mermas');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.EstadoMermaController.index(params).url;
  }

  createUrl() {
    return Controllers.EstadoMermaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.EstadoMermaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.EstadoMermaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.EstadoMermaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.EstadoMermaController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: EstadoMermaFormData): string[] {
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
    const { data } = await axios.get('/api/estado-mermas');
    return data.data as EstadoMerma[];
  }

  async create(payload: EstadoMermaFormData) {
    const { data } = await axios.post('/api/estado-mermas', payload);
    return data.data as EstadoMerma;
  }

  async update(id: number, payload: Partial<EstadoMermaFormData>) {
    const { data } = await axios.put(`/api/estado-mermas/${id}`, payload);
    return data.data as EstadoMerma;
  }

  async remove(id: number) {
    await axios.delete(`/api/estado-mermas/${id}`);
  }
}

const estadoMermaService = new EstadoMermaService();
export default estadoMermaService;
