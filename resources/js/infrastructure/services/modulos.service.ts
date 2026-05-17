// Infrastructure: Modulos Service
// Este servicio proporciona URLs y operaciones para el módulo de módulos del sidebar
import { GenericService } from './generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { ModuloSidebar, ModuloFormData, BulkOperation } from '@/domain/entities/admin-permisos';
import { router } from '@inertiajs/react';

function buildQuery(params?: { query?: Filters }) {
  const qs = new URLSearchParams();
  const q = params?.query ?? {};
  Object.entries(q).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, String(value));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

/**
 * Servicio de Modulos Sidebar - Arquitectura actualizada
 *
 * Proporciona URLs para navegación y operaciones del módulo.
 * Usa Inertia.js para navegación y GenericService para operaciones CRUD.
 *
 * Rutas del backend (web.php):
 * - GET /modulos-sidebar - Listar módulos
 * - POST /modulos-sidebar - Guardar módulo
 * - GET /modulos-sidebar/create - Formulario crear
 * - GET /modulos-sidebar/{modulo_sidebar} - Ver módulo
 * - PUT/PATCH /modulos-sidebar/{modulo_sidebar} - Actualizar
 * - DELETE /modulos-sidebar/{modulo_sidebar} - Eliminar
 * - GET /modulos-sidebar/{modulo_sidebar}/edit - Formulario editar
 * - PATCH /modulos-sidebar/{id}/toggle-activo - Alternar estado
 * - POST /modulos-sidebar/actualizar-orden - Actualizar orden
 * - POST /modulos-sidebar/bulk-update - Actualización masiva
 *
 * Rutas API (api.php):
 * - GET /api/modulos-sidebar/obtenerParaSidebar - Obtener módulos para sidebar
 * - GET /api/modulos-sidebar/historial - Historial de cambios
 * - GET /api/modulos-sidebar/matriz-acceso - Matriz de acceso rol-módulo
 * - GET /api/modulos-sidebar/permisos/disponibles - Permisos disponibles
 * - GET /api/modulos-sidebar/preview/{rolName} - Vista previa para rol
 * - GET /api/modulos-sidebar/roles - Roles disponibles
 */
export class ModulosService extends GenericService<ModuloSidebar, ModuloFormData> {
  constructor() {
    super('modulos-sidebar');
  }

  /**
   * URL para ver los detalles de un módulo
   */
  showUrl(id: Id): string {
    return `/modulos-sidebar/${id}`;
  }

  /**
   * URL para listar todos los módulos con filtros opcionales
   */
  indexUrl(params?: { query?: Filters }) {
    return `/modulos-sidebar${buildQuery(params)}`;
  }

  /**
   * URL para mostrar el formulario de crear un nuevo módulo
   */
  createUrl() {
    return '/modulos-sidebar/create';
  }

  /**
   * URL para mostrar el formulario de editar un módulo
   */
  editUrl(id: Id) {
    return `/modulos-sidebar/${id}/edit`;
  }

  /**
   * URL para guardar un nuevo módulo (POST)
   */
  storeUrl() {
    return '/modulos-sidebar';
  }

  /**
   * URL para actualizar un módulo (PUT/PATCH)
   */
  updateUrl(id: Id) {
    return `/modulos-sidebar/${id}`;
  }

  /**
   * URL para eliminar un módulo (DELETE)
   */
  destroyUrl(id: Id) {
    return `/modulos-sidebar/${id}`;
  }

  /**
   * URL para alternar el estado activo/inactivo de un módulo (PATCH)
   */
  toggleActivoUrl(id: Id) {
    return `/modulos-sidebar/${id}/toggle-activo`;
  }

  /**
   * URL para actualizar el orden de los módulos (POST)
   */
  actualizarOrdenUrl() {
    return '/modulos-sidebar/actualizar-orden';
  }

  /**
   * URL para actualización masiva de módulos (POST)
   */
  bulkUpdateUrl() {
    return '/modulos-sidebar/bulk-update';
  }

  // =============== API ROUTES ===============

  /**
   * URL API para obtener módulos para el sidebar
   */
  obtenerParaSidebarUrl() {
    return '/api/modulos-sidebar/obtenerParaSidebar';
  }

  /**
   * URL API para obtener historial de cambios
   */
  historialUrl() {
    return '/api/modulos-sidebar/historial';
  }

  /**
   * URL API para obtener matriz de acceso rol-módulo
   */
  matrizAccesoUrl() {
    return '/api/modulos-sidebar/matriz-acceso';
  }

  /**
   * URL API para obtener permisos disponibles
   */
  permisosDisponiblesUrl() {
    return '/api/modulos-sidebar/permisos/disponibles';
  }

  /**
   * URL API para obtener vista previa para un rol
   */
  previewUrl(rolName: string) {
    return `/api/modulos-sidebar/preview/${rolName}`;
  }

  /**
   * URL API para obtener roles disponibles
   */
  rolesUrl() {
    return '/api/modulos-sidebar/roles';
  }

  // =============== OPERATIONS ===============

  /**
   * Alterna el estado activo/inactivo de un módulo
   */
  toggleActivo(id: Id): Promise<void> {
    return new Promise((resolve, reject) => {
      router.patch(
        this.toggleActivoUrl(id),
        {},
        {
          onSuccess: () => resolve(),
          onError: () => reject(new Error('Error al cambiar el estado del módulo')),
        }
      );
    });
  }

  /**
   * Elimina un módulo
   */
  delete(id: Id): Promise<void> {
    return new Promise((resolve, reject) => {
      router.delete(
        this.destroyUrl(id),
        {
          onSuccess: () => resolve(),
          onError: () => reject(new Error('Error al eliminar el módulo')),
        }
      );
    });
  }

  /**
   * Guarda el nuevo orden de los módulos
   */
  guardarOrden(orden: Array<{ id: number; orden: number }>): Promise<void> {
    return new Promise((resolve, reject) => {
      router.post(
        this.actualizarOrdenUrl(),
        { modulos: orden },
        {
          onSuccess: () => resolve(),
          onError: () => reject(new Error('Error al guardar orden')),
        }
      );
    });
  }

  /**
   * Obtiene los permisos disponibles
   */
  async obtenerPermisosDisponibles(): Promise<string[]> {
    const response = await fetch(this.permisosDisponiblesUrl());
    if (!response.ok) throw new Error('Error al obtener permisos');
    return response.json();
  }

  /**
   * Obtiene la matriz de acceso rol-módulo
   */
  async obtenerMatrizAcceso() {
    const response = await fetch(this.matrizAccesoUrl());
    if (!response.ok) throw new Error('Error al obtener matriz de acceso');
    return response.json();
  }

  /**
   * Obtiene los roles disponibles
   */
  async obtenerRoles() {
    const response = await fetch(this.rolesUrl());
    if (!response.ok) throw new Error('Error al obtener roles');
    return response.json();
  }

  /**
   * Obtiene la vista previa del sidebar para un rol específico
   */
  async obtenerPreviewPorRol(rolName: string) {
    const response = await fetch(this.previewUrl(rolName));
    if (!response.ok) throw new Error('Error al obtener preview');
    return response.json();
  }

  /**
   * Realiza una actualización masiva de módulos
   */
  async bulkUpdate(ids: Id[], operacion: BulkOperation): Promise<void> {
    const response = await fetch(this.bulkUpdateUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        ids,
        operacion,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al aplicar cambios en lote');
    }
  }

  /**
   * Validación específica para módulos
   */
  validateData(data: ModuloFormData): string[] {
    const errors = super.validateData(data);

    // Validar título
    if (!data.titulo || String(data.titulo).trim().length === 0) {
      errors.push('El título del módulo es requerido');
    }

    if (data.titulo && String(data.titulo).length < 3) {
      errors.push('El título del módulo debe tener al menos 3 caracteres');
    }

    // Validar ruta
    if (!data.ruta || String(data.ruta).trim().length === 0) {
      errors.push('La ruta del módulo es requerida');
    }

    // Validar orden
    if (data.orden !== undefined && data.orden < 0) {
      errors.push('El orden debe ser mayor o igual a 0');
    }

    return errors;
  }

  /**
   * Método de utilidad para obtener el nombre de visualización del módulo
   */
  getModuloDisplayName(modulo: ModuloSidebar): string {
    return modulo.titulo;
  }
}

// Instancia singleton
export const modulosService = new ModulosService();
export default modulosService;
