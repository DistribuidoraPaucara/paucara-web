import { GenericService } from './generic.service';
import { PrecioRango, PrecioRangoFormData } from '@/domain/entities/precio-rango';
import { Filters } from '@/domain/entities/generic';

export class PrecioRangoService extends GenericService<PrecioRango, PrecioRangoFormData> {
  constructor() {
    super('precio-rangos');
  }

  /**
   * Nota: Este servicio es especial porque los endpoints están bajo /productos/{producto_id}/rangos-precio
   * Sin embargo, mantenemos la interfaz genérica compatible
   */

  /**
   * Obtener rangos para un producto específico
   */
  indexParaProductoUrl(productoId: number, params?: { query?: Filters }) {
    const baseUrl = `/api/productos/${productoId}/rangos-precio`;
    if (params?.query) {
      const queryString = new URLSearchParams(params.query as any).toString();
      return `${baseUrl}?${queryString}`;
    }
    return baseUrl;
  }

  /**
   * Crear rango para un producto
   */
  storeParaProductoUrl(productoId: number) {
    return `/api/productos/${productoId}/rangos-precio`;
  }

  /**
   * Actualizar rango de un producto
   */
  updateParaProductoUrl(productoId: number, rangoId: number) {
    return `/api/productos/${productoId}/rangos-precio/${rangoId}`;
  }

  /**
   * Eliminar rango de un producto
   */
  destroyParaProductoUrl(productoId: number, rangoId: number) {
    return `/api/productos/${productoId}/rangos-precio/${rangoId}`;
  }

  /**
   * Obtener rango específico
   */
  showParaProductoUrl(productoId: number, rangoId: number) {
    return `/api/productos/${productoId}/rangos-precio/${rangoId}`;
  }

  /**
   * Calcular precio para una cantidad
   */
  calcularPrecioUrl(productoId: number) {
    return `/api/productos/${productoId}/calcular-precio`;
  }

  /**
   * Validar integridad de rangos
   */
  validarIntegridadUrl(productoId: number) {
    return `/api/productos/${productoId}/rangos-precio/validar`;
  }

  /**
   * Copiar rangos entre productos
   */
  copiarRangosUrl(productoOrigenId: number, productoDestinoId: number) {
    return `/api/productos/${productoOrigenId}/rangos-precio/copiar/${productoDestinoId}`;
  }

  /**
   * Calcular carrito completo
   */
  calcularCarritoUrl() {
    return '/api/carrito/calcular';
  }

  // Métodos base del servicio genérico (no usados directamente, pero necesarios para compatibilidad)
  indexUrl(params?: { query?: Filters }): string {
    // Este servicio no usa índice genérico
    return '/api/precio-rangos';
  }

  createUrl(): string {
    return '/precio-rangos/create';
  }

  editUrl(id: number): string {
    return `/precio-rangos/${id}/edit`;
  }

  storeUrl(): string {
    return '/api/precio-rangos';
  }

  updateUrl(id: number): string {
    return `/api/precio-rangos/${id}`;
  }

  destroyUrl(id: number): string {
    return `/api/precio-rangos/${id}`;
  }

  showUrl(id: number): string {
    return `/api/precio-rangos/${id}`;
  }

  /**
   * Validar datos del formulario
   */
  validateData(data: PrecioRangoFormData): string[] {
    const errors: string[] = [];

    if (!data.producto_id || data.producto_id === 0) {
      errors.push('El producto es requerido');
    }

    if (!data.tipo_precio_id || data.tipo_precio_id === 0) {
      errors.push('El tipo de precio es requerido');
    }

    if (!data.cantidad_minima || data.cantidad_minima <= 0) {
      errors.push('La cantidad mínima debe ser mayor a 0');
    }

    if (data.cantidad_maxima && data.cantidad_maxima < data.cantidad_minima) {
      errors.push('La cantidad máxima debe ser mayor o igual a la mínima');
    }

    if (data.fecha_vigencia_fin && data.fecha_vigencia_inicio) {
      if (new Date(data.fecha_vigencia_fin) < new Date(data.fecha_vigencia_inicio)) {
        errors.push('La fecha de fin debe ser posterior a la de inicio');
      }
    }

    return errors;
  }
}

const precioRangoService = new PrecioRangoService();
export default precioRangoService;
