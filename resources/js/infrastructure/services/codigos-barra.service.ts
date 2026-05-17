// Infrastructure: Códigos de Barra Service
import { router } from '@inertiajs/react';
import type { CodigoBarra, CodigoBarraFormData, ValidacionCodigoResponse, BusquedaCodigoResponse, GeneracionCodigoResponse, ListadoCodigosResponse } from '@/domain/entities/codigos-barra';
import type { Filters, Id, Pagination } from '@/domain/entities/shared';

export class CodigosBarraService {
  private baseUrl = '/codigos-barra';
  private apiUrl = '/api/codigos-barra';

  /**
   * URL para listar códigos de barra de un producto
   */
  indexUrl(productoId: Id, params?: { query?: Filters }): string {
    let url = this.baseUrl;
    if (params?.query) {
      const queryStr = new URLSearchParams(
        Object.entries(params.query).map(([k, v]) => [k, String(v)])
      ).toString();
      url += queryStr ? `?${queryStr}` : '';
    }
    return url;
  }

  /**
   * URL para crear nuevo código de barra
   */
  createUrl(): string {
    return `${this.baseUrl}/create`;
  }

  /**
   * URL para editar código de barra
   */
  editUrl(id: Id): string {
    return `${this.baseUrl}/${id}/edit`;
  }

  /**
   * URL para guardar nuevo código
   */
  storeUrl(): string {
    return this.baseUrl;
  }

  /**
   * URL para actualizar código
   */
  updateUrl(id: Id): string {
    return `${this.baseUrl}/${id}`;
  }

  /**
   * URL para eliminar código
   */
  destroyUrl(id: Id): string {
    return `${this.baseUrl}/${id}`;
  }

  /**
   * Navegar a índice de códigos
   */
  async search(filters: Filters): Promise<void> {
    router.visit(this.indexUrl(filters.producto_id || 0, { query: filters }), {
      method: 'get',
    });
  }

  /**
   * Eliminar código de barra
   */
  async destroy(id: Id): Promise<void> {
    router.delete(this.destroyUrl(id), {
      onSuccess: () => {
        console.log('Código eliminado exitosamente');
      },
      onError: (error) => {
        console.error('Error al eliminar código:', error);
      },
    });
  }

  /**
   * Navegar a crear código
   */
  navigateToCreate(productoId: Id): void {
    router.visit(`${this.baseUrl}/create?producto_id=${productoId}`);
  }

  /**
   * Navegar a editar código
   */
  navigateToEdit(id: Id): void {
    router.visit(this.editUrl(id));
  }

  /**
   * API: Buscar producto por código de barra
   */
  async buscarProducto(codigo: string): Promise<BusquedaCodigoResponse | null> {
    try {
      const response = await fetch(`${this.apiUrl}/buscar/${encodeURIComponent(codigo)}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error al buscar producto');
      }
      return response.json();
    } catch (error) {
      console.error('Error en buscarProducto:', error);
      throw error;
    }
  }

  /**
   * API: Validar código de barra
   */
  async validarCodigo(codigo: string, tipo: string = 'EAN'): Promise<ValidacionCodigoResponse> {
    try {
      const response = await fetch(
        `${this.apiUrl}/validar/${encodeURIComponent(codigo)}?tipo=${encodeURIComponent(tipo)}`
      );
      if (!response.ok) {
        throw new Error('Error al validar código');
      }
      return response.json();
    } catch (error) {
      console.error('Error en validarCodigo:', error);
      throw error;
    }
  }

  /**
   * API: Generar código EAN-13 automático
   */
  async generarCodigo(): Promise<GeneracionCodigoResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Error al generar código');
      }

      return response.json();
    } catch (error) {
      console.error('Error en generarCodigo:', error);
      throw error;
    }
  }

  /**
   * API: Obtener códigos de un producto
   */
  async obtenerCodigos(productoId: Id): Promise<ListadoCodigosResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/producto/${productoId}`);
      if (!response.ok) {
        throw new Error('Error al obtener códigos');
      }
      return response.json();
    } catch (error) {
      console.error('Error en obtenerCodigos:', error);
      throw error;
    }
  }

  /**
   * API: Marcar código como principal
   */
  async marcarPrincipal(codigoId: Id): Promise<{ mensaje: string; codigo: CodigoBarra }> {
    try {
      const response = await fetch(`${this.baseUrl}/${codigoId}/principal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Error al marcar como principal');
      }

      return response.json();
    } catch (error) {
      console.error('Error en marcarPrincipal:', error);
      throw error;
    }
  }

  /**
   * Formato de estado
   */
  formatStatus(codigo: CodigoBarra): string {
    return codigo.activo ? 'Activo' : 'Inactivo';
  }

  /**
   * Obtener nombre para mostrar
   */
  getDisplayName(codigo: CodigoBarra): string {
    const principal = codigo.es_principal ? '(Principal) ' : '';
    return `${principal}${codigo.codigo}`;
  }

  /**
   * Validar datos del formulario
   */
  validateData(data: CodigoBarraFormData): string[] {
    const errors: string[] = [];

    if (!data.producto_id) {
      errors.push('El producto es requerido');
    }

    if (!data.auto_generar && !data.codigo) {
      errors.push('El código de barra es requerido');
    }

    if (!data.tipo) {
      errors.push('El tipo de código es requerido');
    }

    return errors;
  }
}

const codigosBarraService = new CodigosBarraService();
export default codigosBarraService;
