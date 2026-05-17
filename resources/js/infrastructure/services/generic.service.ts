// Infrastructure: Generic base service class for Inertia.js applications
//
// Este servicio base proporciona funcionalidad común para todos los módulos
// que usan Inertia.js para navegación y operaciones CRUD.
//
// NO implementa llamadas HTTP directas porque Inertia.js maneja toda la
// comunicación con el backend automáticamente mediante router.get/post/put/delete.
//
import { router } from '@inertiajs/react';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseEntity, BaseFormData, BaseService } from '@/domain/entities/generic';
import NotificationService from '@/infrastructure/services/notification.service';

/**
 * Servicio genérico base para módulos con Inertia.js
 *
 * Proporciona:
 * - Métodos abstractos para generar URLs (deben implementarse en clases hijas)
 * - Métodos concretos para operaciones comunes (search, destroy)
 * - Validación de datos del lado del cliente
 * - Integración con notificaciones
 *
 * @example
 * export class EmpleadosService extends GenericService<Empleado, EmpleadoFormData> {
 *   constructor() {
 *     super('empleados');
 *   }
 *
 *   indexUrl() { return '/empleados'; }
 *   storeUrl() { return '/empleados'; }
 *   // ... otros métodos *Url()
 * }
 */
export abstract class GenericService<T extends BaseEntity, F extends BaseFormData> implements BaseService<T, F> {
  protected controllerName: string;

  constructor(controllerName: string) {
    this.controllerName = controllerName;
  }

  // ========================================
  // MÉTODOS ABSTRACTOS (deben implementarse en clases hijas)
  // ========================================

  abstract indexUrl(params?: { query?: Filters }): string;
  abstract createUrl(): string;
  abstract editUrl(id: Id): string;
  abstract storeUrl(): string;
  abstract updateUrl(id: Id): string;
  abstract destroyUrl(id: Id): string;

  // ========================================
  // MÉTODOS CONCRETOS (ya implementados, con Inertia.js)
  // ========================================

  /**
   * Realiza una búsqueda/filtrado navegando a la página index con los filtros aplicados
   * Usa Inertia.js para mantener el estado y scroll
   */
  search(filters: Filters) {
    router.get(this.indexUrl({ query: filters }), {}, {
      preserveState: true,
      preserveScroll: true,
      onError: (errors) => {
        NotificationService.error('Error al realizar la búsqueda');
        console.error('Search errors:', errors);
      }
    });
  }

  /**
   * Elimina un registro usando Inertia.js
   * Incluye notificaciones de carga, éxito y error
   */
  destroy(id: Id) {
    const loadingToast = NotificationService.loading('Eliminando registro...');

    router.delete(this.destroyUrl(id), {
      preserveState: true,
      onSuccess: () => {
        NotificationService.dismiss(loadingToast);
        NotificationService.success('Registro eliminado correctamente');
        router.reload({ only: [this.controllerName.toLowerCase()] });
      },
      onError: (errors) => {
        NotificationService.dismiss(loadingToast);
        NotificationService.error('Error al eliminar el registro');
        console.error('Delete errors:', errors);
      }
    });
  }

  // ========================================
  // VALIDACIÓN Y UTILIDADES
  // ========================================

  /**
   * Validación genérica de datos del formulario
   * Puede ser sobrescrita en clases hijas para agregar validaciones específicas
   */
  validateData(data: F): string[] {
    const errors: string[] = [];

    // Basic validation for common fields
    if ('nombre' in data && (!data.nombre || String(data.nombre).trim().length === 0)) {
      errors.push('El nombre es requerido');
    }

    if ('nombre' in data && String(data.nombre).length > 255) {
      errors.push('El nombre no puede tener más de 255 caracteres');
    }

    return errors;
  }

  // Utility methods
  formatStatus(entity: T): string {
    return 'activo' in entity && entity.activo ? 'Activo' : 'Inactivo';
  }

  getDisplayName(entity: T): string {
    if ('nombre' in entity && 'descripcion' in entity && entity.descripcion) {
      return `${entity.nombre} - ${entity.descripcion}`;
    }
    return 'nombre' in entity ? String(entity.nombre) : String(entity.id);
  }
}
