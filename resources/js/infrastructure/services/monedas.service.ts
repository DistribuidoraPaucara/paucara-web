// Data Layer: Monedas service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Moneda, MonedaFormData, ConversionRequest, ConversionResponse } from '@/domain/entities/monedas';

export class MonedasService extends GenericService<Moneda, MonedaFormData> {
  constructor() {
    super('monedas');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.MonedaController.index(params).url;
  }

  createUrl() {
    return Controllers.MonedaController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.MonedaController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.MonedaController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.MonedaController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.MonedaController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: MonedaFormData): string[] {
    const errors = super.validateData(data);

    if (!data.codigo || data.codigo.trim().length === 0) {
      errors.push('El código es requerido');
    }

    if (!data.simbolo || data.simbolo.trim().length === 0) {
      errors.push('El símbolo es requerido');
    }

    if (data.tasa_cambio <= 0) {
      errors.push('La tasa de cambio debe ser mayor a 0');
    }

    return errors;
  }

  // Métodos específicos para monedas (mantienen la funcionalidad existente)
  async getActivas(): Promise<Moneda[]> {
    const response = await fetch('/monedas/activas');
    if (!response.ok) {
      throw new Error('Error al obtener monedas activas');
    }
    return response.json();
  }

  async convertir(data: ConversionRequest): Promise<ConversionResponse> {
    const response = await fetch('/monedas/convertir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al convertir monedas');
    }

    return response.json();
  }

  formatearMonto(monto: number, simbolo: string, decimales: number = 2): string {
    return `${simbolo} ${monto.toLocaleString('es-ES', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales
    })}`;
  }
}

const monedasService = new MonedasService();
export default monedasService;
