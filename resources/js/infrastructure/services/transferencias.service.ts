import { GenericService } from './generic.service';
import type {
  Transferencia,
  TransferenciaFormData,
  DetalleTransferencia,
  Almacen,
  Producto
} from '@/domain/entities/transferencias';
import type { Id, Filters } from '@/domain/entities/shared';

/**
 * Service para gestionar Transferencias de inventario
 *
 * Responsabilidades:
 * - Generar URLs para navegación con Inertia.js
 * - Validar datos de transferencia y detalles
 * - Determinar si una transferencia requiere transporte
 * - Cálculos relacionados con transferencias
 */
export class TransferenciasService extends GenericService<Transferencia, TransferenciaFormData> {
  constructor() {
    super('transferencias');
  }

  // ========================================
  // URL GENERATORS (Inertia.js navigation)
  // ========================================

  indexUrl(params?: { query?: Filters }): string {
    const query = params?.query ? '?' + new URLSearchParams(
      params.query as Record<string, string>
    ).toString() : '';
    return `/inventario/transferencias${query}`;
  }

  createUrl(): string {
    return '/inventario/transferencias/crear';
  }

  editUrl(id: Id): string {
    return `/inventario/transferencias/${id}/editar`;
  }

  storeUrl(): string {
    return '/inventario/transferencias/crear';
  }

  updateUrl(id: Id): string {
    return `/inventario/transferencias/${id}`;
  }

  destroyUrl(id: Id): string {
    return `/inventario/transferencias/${id}`;
  }

  // ========================================
  // BUSINESS LOGIC METHODS
  // ========================================

  /**
   * Determina si una transferencia requiere transporte físico entre almacenes
   *
   * Criterios:
   * 1. Si cualquier almacén requiere transporte externo
   * 2. Si tienen ubicaciones físicas diferentes
   * 3. Si uno tiene ubicación definida y el otro no
   * 4. Por defecto, almacenes diferentes requieren transporte
   */
  esTransferenciaFisica(almacenOrigen: Almacen | undefined, almacenDestino: Almacen | undefined): boolean {
    if (!almacenOrigen || !almacenDestino) return false;

    // Si cualquiera requiere transporte externo
    if (almacenOrigen.requiere_transporte_externo || almacenDestino.requiere_transporte_externo) {
      return true;
    }

    // Si tienen ubicaciones físicas diferentes
    if (almacenOrigen.ubicacion_fisica && almacenDestino.ubicacion_fisica) {
      return almacenOrigen.ubicacion_fisica !== almacenDestino.ubicacion_fisica;
    }

    // Si uno tiene ubicación y el otro no
    if (almacenOrigen.ubicacion_fisica || almacenDestino.ubicacion_fisica) {
      return true;
    }

    // Por defecto, almacenes diferentes requieren transporte
    return true;
  }

  /**
   * Valida un detalle individual de transferencia
   *
   * Verifica:
   * - Producto existe
   * - Cantidad es válida
   * - Lote cumple límite de caracteres
   * - Fecha de vencimiento es futura
   * - Stock disponible en almacén origen
   */
  validarDetalleTransferencia(
    detalle: DetalleTransferencia,
    productos: Producto[],
    almacenOrigenId: string
  ): string[] {
    const errors: string[] = [];

    // Validar producto existe
    const producto = productos.find(p => p.id === detalle.producto_id);
    if (!producto) {
      errors.push('Producto no encontrado');
      return errors;
    }

    // Validar cantidad
    if (!detalle.cantidad || detalle.cantidad <= 0) {
      errors.push('La cantidad debe ser mayor a 0');
    }

    // Validar lote
    if (detalle.lote && detalle.lote.length > 50) {
      errors.push('El lote no puede exceder 50 caracteres');
    }

    // Validar fecha de vencimiento
    if (detalle.fecha_vencimiento) {
      const fechaIngresada = new Date(detalle.fecha_vencimiento);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaIngresada < hoy) {
        errors.push('La fecha de vencimiento no puede ser una fecha pasada');
      }
    }

    // Validar stock disponible en almacén origen
    if (almacenOrigenId) {
      const stockEnOrigen = producto.stock_por_almacen?.[almacenOrigenId] || 0;
      if (detalle.cantidad > stockEnOrigen) {
        errors.push(`Stock insuficiente. Disponible en almacén origen: ${stockEnOrigen} unidades`);
      }
    }

    return errors;
  }

  /**
   * Valida los datos completos de una transferencia
   *
   * Verifica:
   * - Almacenes seleccionados
   * - Almacenes son diferentes
   * - Mínimo un producto agregado
   * - Cada detalle es válido
   * - Observaciones dentro del límite
   */
  validateData(
    data: TransferenciaFormData,
    options?: { almacenes?: Almacen[]; productos?: Producto[] }
  ): string[] {
    const errors: string[] = [];

    // Validar almacenes seleccionados
    if (!data.almacen_origen_id || !data.almacen_destino_id) {
      errors.push('Debe seleccionar almacén origen y destino');
    }

    // Validar almacenes sean diferentes
    if (data.almacen_origen_id && data.almacen_destino_id && data.almacen_origen_id === data.almacen_destino_id) {
      errors.push('Los almacenes de origen y destino deben ser diferentes');
    }

    // Validar mínimo un producto
    if (!data.detalles || data.detalles.length === 0) {
      errors.push('Debe agregar al menos un producto para transferir');
    }

    // Validar cada detalle
    data.detalles?.forEach((detalle, index) => {
      const detalleErrors = this.validarDetalleTransferencia(
        detalle,
        options?.productos || [],
        data.almacen_origen_id as string
      );
      errors.push(...detalleErrors);
    });

    // Validar observaciones
    if (data.observaciones && data.observaciones.length > 500) {
      errors.push('Las observaciones no pueden exceder 500 caracteres');
    }

    return errors;
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Calcula el total de cantidad de productos en la transferencia
   */
  calcularTotalCantidad(detalles: DetalleTransferencia[]): number {
    return detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0);
  }

  /**
   * Obtiene el nombre del producto por su ID
   */
  obtenerNombreProducto(productoId: number, productos: Producto[]): string {
    const producto = productos.find(p => p.id === productoId);
    return producto ? `${producto.codigo} - ${producto.nombre}` : 'Producto no encontrado';
  }

  /**
   * Extrae mensaje de error en caso de fallo en la API
   */
  extractErrorMessage(errors: any): string {
    if (typeof errors === 'string') {
      return errors;
    }

    if (errors && typeof errors === 'object') {
      const errorObj = errors as Record<string, unknown>;
      const message = errorObj.error || errorObj.message || Object.values(errorObj)[0];
      if (message) {
        return String(message);
      }
    }

    return 'Error al crear la transferencia';
  }
}

export default new TransferenciasService();
