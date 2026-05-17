// Infrastructure: Roles Service
// Este servicio proporciona URLs y validación para el módulo de roles
// Las operaciones CRUD se manejan directamente con Inertia.js, no con llamadas API
import { GenericService } from './generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Role, RoleFormData } from '@/domain/entities/admin-permisos';

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
 * Servicio de Roles - Arquitectura actualizada
 *
 * Proporciona URLs para navegación y validación de datos.
 * NO implementa métodos HTTP directos porque usamos Inertia.js para navegación.
 *
 * Flujo de operaciones:
 * - CREATE: form → useGenericForm → Inertia.post(service.storeUrl())
 * - UPDATE: form → useGenericForm → Inertia.put(service.updateUrl(id))
 * - DELETE: table → service.destroy(id) → Inertia.delete() [heredado de GenericService]
 * - LIST: filters → service.search(filters) → Inertia.get() [heredado de GenericService]
 * - SHOW: link → href={service.showUrl(id)} [navegación directa]
 * - EDIT: link → href={service.editUrl(id)} [formulario de edición]
 */
export class RolesService extends GenericService<Role, RoleFormData> {
  constructor() {
    super('roles');
  }

  /**
   * URL para ver los detalles de un rol
   */
  showUrl(id: Id): string {
    return `/roles/${id}`;
  }

  /**
   * URL para listar todos los roles con filtros opcionales
   */
  indexUrl(params?: { query?: Filters }) {
    return `/admin/permisos/roles${buildQuery(params)}`;
  }

  /**
   * URL para mostrar el formulario de crear un nuevo rol
   */
  createUrl() {
    return '/admin/permisos/roles/create';
  }

  /**
   * URL para mostrar el formulario de editar un rol
   */
  editUrl(id: Id) {
    return `/roles/${id}/edit`;
  }

  /**
   * URL para guardar un nuevo rol (POST)
   */
  storeUrl() {
    return '/roles';
  }

  /**
   * URL para actualizar un rol (PUT/PATCH)
   */
  updateUrl(id: Id) {
    return `/roles/${id}`;
  }

  /**
   * URL para eliminar un rol (DELETE)
   */
  destroyUrl(id: Id) {
    return `/roles/${id}`;
  }

  /**
   * URLs para acciones específicas de roles
   */
  assignPermissionUrl(id: Id) {
    return `/roles/${id}/assign-permission`;
  }

  removePermissionUrl(id: Id) {
    return `/roles/${id}/remove-permission`;
  }

  applyTemplateUrl(id: Id) {
    return `/roles/${id}/apply-template`;
  }

  copyFromUrl(id: Id) {
    return `/roles/${id}/copy-from`;
  }

  createFunctionalityUrl(id: Id) {
    return `/roles/${id}/crear-funcionalidad`;
  }

  auditUrl(id: Id) {
    return `/roles/${id}/audit`;
  }

  /**
   * URLs para vistas avanzadas
   */
  templatesUrl() {
    return '/roles/templates';
  }

  compareUrl() {
    return '/roles/compare';
  }

  /**
   * Validación específica para roles
   */
  validateData(data: RoleFormData): string[] {
    const errors = super.validateData(data);

    // Validar nombre
    if (!data.name || String(data.name).trim().length === 0) {
      errors.push('El nombre del rol es requerido');
    }

    if (data.name && String(data.name).length < 3) {
      errors.push('El nombre del rol debe tener al menos 3 caracteres');
    }

    // Validar guard_name
    if (!data.guard_name || String(data.guard_name).trim().length === 0) {
      errors.push('El guard name es requerido');
    }

    return errors;
  }

  /**
   * Método de utilidad para obtener el nombre de visualización del rol
   */
  getRoleDisplayName(role: Role): string {
    return role.display_name || role.name;
  }

  /**
   * Método de utilidad para formatear el estado del rol
   */
  formatRoleStatus(role: Role): string {
    return this.formatStatus(role);
  }
}

// Instancia singleton
export const rolesService = new RolesService();
export default rolesService;
