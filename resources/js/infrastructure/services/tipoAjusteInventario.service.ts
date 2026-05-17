// Data Layer: Tipos de Ajuste de Inventario service
// Patrón consolidado: Extiende GenericService para Inertia.js
// Añade métodos HTTP directo para modales y componentes que no usan Inertia.js
import axios from 'axios';
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { TipoAjusteInventario, TipoAjusteInventarioFormData } from '@/domain/entities/tipos-ajuste-inventario';

export class TipoAjusteInventarioService extends GenericService<TipoAjusteInventario, TipoAjusteInventarioFormData> {
  constructor() {
    super('tipos-ajuste-inventario');
  }

  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoAjusteInventarioController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoAjusteInventarioController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoAjusteInventarioController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoAjusteInventarioController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoAjusteInventarioController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoAjusteInventarioController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: TipoAjusteInventarioFormData): string[] {
    const errors = super.validateData(data);

    if (!data.clave || data.clave.trim().length === 0) {
      errors.push('La clave es requerida');
    }

    if (!data.label || data.label.trim().length === 0) {
      errors.push('El nombre visible es requerido');
    }

    return errors;
  }

  // ========================================
  // Métodos HTTP directo para modales/componentes
  // ========================================

  async getAll() {
    const { data } = await axios.get('/api/tipos-ajuste-inventario');
    return data.data as TipoAjusteInventario[];
  }

  async create(payload: TipoAjusteInventarioFormData) {
    const { data } = await axios.post('/api/tipos-ajuste-inventario', payload);
    return data.data as TipoAjusteInventario;
  }

  async update(id: number, payload: Partial<TipoAjusteInventarioFormData>) {
    const { data } = await axios.put(`/api/tipos-ajuste-inventario/${id}`, payload);
    return data.data as TipoAjusteInventario;
  }

  async remove(id: number) {
    await axios.delete(`/api/tipos-ajuste-inventario/${id}`);
  }
}

const tipoAjusteInventarioService = new TipoAjusteInventarioService();
export default tipoAjusteInventarioService;
