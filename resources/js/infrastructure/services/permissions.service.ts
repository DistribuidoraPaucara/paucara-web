// Infrastructure: Permissions Service
// Este servicio proporciona URLs y validación para el módulo de permisos
// Las operaciones CRUD se manejan directamente con Inertia.js, no con llamadas API
import { GenericService } from './generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Permission } from '@/domain/entities/admin-permisos';

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

interface PermissionFormData {
  id?: Id;
  name: string;
  guard_name: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Servicio de Permissions - Arquitectura actualizada
 *
 * Proporciona URLs para navegación y validación de datos.
 * NO implementa métodos HTTP directos porque usamos Inertia.js para navegación.
 *
 * NOTA: Las rutas para CRUD de permisos individuales no están definidas en web.php/api.php.
 * Si necesitas gestionar permisos individuales, debes crear las rutas en el backend:
 * - GET /admin/permisos/permisos - Listar permisos
 * - GET /admin/permisos/permisos/crear - Formulario crear
 * - POST /admin/permisos/permisos - Guardar permiso
 * - GET /admin/permisos/permisos/{id} - Ver permiso
 * - GET /admin/permisos/permisos/{id}/editar - Formulario editar
 * - PUT/PATCH /admin/permisos/permisos/{id} - Actualizar
 * - DELETE /admin/permisos/permisos/{id} - Eliminar
 *
 * Flujo de operaciones:
 * - CREATE: form → useGenericForm → Inertia.post(service.storeUrl())
 * - UPDATE: form → useGenericForm → Inertia.put(service.updateUrl(id))
 * - DELETE: table → service.destroy(id) → Inertia.delete() [heredado de GenericService]
 * - LIST: filters → service.search(filters) → Inertia.get() [heredado de GenericService]
 * - SHOW: link → href={service.showUrl(id)} [navegación directa]
 * - EDIT: link → href={service.editUrl(id)} [formulario de edición]
 */
export class PermissionsService extends GenericService<Permission, PermissionFormData> {
  constructor() {
    super('permissions');
  }

  /**
   * URL para ver los detalles de un permiso
   */
  showUrl(id: Id): string {
    return `/admin/permisos/permisos/${id}`;
  }

  /**
   * URL para listar todos los permisos con filtros opcionales
   */
  indexUrl(params?: { query?: Filters }) {
    return `/admin/permisos/permisos${buildQuery(params)}`;
  }

  /**
   * URL para mostrar el formulario de crear un nuevo permiso
   */
  createUrl() {
    return '/admin/permisos/permisos/crear';
  }

  /**
   * URL para mostrar el formulario de editar un permiso
   */
  editUrl(id: Id) {
    return `/admin/permisos/permisos/${id}/editar`;
  }

  /**
   * URL para guardar un nuevo permiso (POST)
   */
  storeUrl() {
    return '/admin/permisos/permisos';
  }

  /**
   * URL para actualizar un permiso (PUT/PATCH)
   */
  updateUrl(id: Id) {
    return `/admin/permisos/permisos/${id}`;
  }

  /**
   * URL para eliminar un permiso (DELETE)
   */
  destroyUrl(id: Id) {
    return `/admin/permisos/permisos/${id}`;
  }

  /**
   * Validación específica para permisos
   */
  validateData(data: PermissionFormData): string[] {
    const errors = super.validateData(data);

    // Validar nombre
    if (!data.name || String(data.name).trim().length === 0) {
      errors.push('El nombre del permiso es requerido');
    }

    if (data.name && String(data.name).length < 3) {
      errors.push('El nombre del permiso debe tener al menos 3 caracteres');
    }

    // Validar guard_name
    if (!data.guard_name || String(data.guard_name).trim().length === 0) {
      errors.push('El guard name es requerido');
    }

    return errors;
  }

  /**
   * Método de utilidad para obtener el nombre de visualización del permiso
   */
  getPermissionDisplayName(permission: Permission): string {
    return permission.description || permission.name;
  }

  /**
   * Método de utilidad para formatear el estado del permiso
   */
  formatPermissionStatus(permission: Permission): string {
    return this.formatStatus(permission);
  }
}

// Instancia singleton
export const permissionsService = new PermissionsService();
export default permissionsService;
