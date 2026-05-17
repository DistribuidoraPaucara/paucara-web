/**
 * Infrastructure: ExtendableService - Servicio base mejorado con hooks de extensión
 *
 * Mejoras respecto a GenericService:
 * - Hooks de ciclo de vida (beforeValidate, afterValidate, beforeSubmit, afterSubmit)
 * - Validadores composables
 * - Callbacks personalizables
 * - Mejor manejo de errores con contexto
 *
 * Uso:
 * class ClientesService extends ExtendableService<Cliente, ClienteFormData> {
 *   constructor() {
 *     super('clientes');
 *     // Registrar hooks personalizados
 *     this.onBeforeValidate((data) => {
 *       console.log('Antes de validar:', data);
 *       return data;
 *     });
 *   }
 * }
 */

import { router } from '@inertiajs/react';
import type { Filters, Id } from '@/domain/entities/shared';
import type { BaseEntity, BaseFormData, BaseService } from '@/domain/entities/generic';
import NotificationService from '@/infrastructure/services/notification.service';

// Tipos para hooks
type ValidationHook<F> = (data: F) => Promise<void> | void;
type TransformHook<F> = (data: F) => F;
type ErrorHandler = (error: unknown, context: string) => void;

export abstract class ExtendableService<T extends BaseEntity, F extends BaseFormData>
  implements BaseService<T, F> {
  protected controllerName: string;

  // Hooks registrados
  private beforeValidateHooks: ValidationHook<F>[] = [];
  private afterValidateHooks: ValidationHook<F>[] = [];
  private beforeTransformHooks: TransformHook<F>[] = [];
  private afterTransformHooks: TransformHook<F>[] = [];
  private errorHandlers: ErrorHandler[] = [];

  constructor(controllerName: string) {
    this.controllerName = controllerName;
  }

  // ========================================
  // MÉTODOS ABSTRACTOS (implementar en subclases)
  // ========================================

  abstract indexUrl(params?: { query?: Filters }): string;
  abstract createUrl(): string;
  abstract editUrl(id: Id): string;
  abstract storeUrl(): string;
  abstract updateUrl(id: Id): string;
  abstract destroyUrl(id: Id): string;

  // ========================================
  // REGISTRO DE HOOKS
  // ========================================

  /**
   * Registrar hook que se ejecuta ANTES de validar
   * Útil para transformar datos o setup
   */
  onBeforeValidate(hook: ValidationHook<F>) {
    this.beforeValidateHooks.push(hook);
    return this;
  }

  /**
   * Registrar hook que se ejecuta DESPUÉS de validar
   * Útil para validaciones adicionales o logging
   */
  onAfterValidate(hook: ValidationHook<F>) {
    this.afterValidateHooks.push(hook);
    return this;
  }

  /**
   * Registrar hook para transformar datos ANTES de guardar
   * Útil para normalizar, formatear datos
   */
  onBeforeTransform(hook: TransformHook<F>) {
    this.beforeTransformHooks.push(hook);
    return this;
  }

  /**
   * Registrar hook para transformar datos DESPUÉS de procesar
   * Útil para post-procesamiento
   */
  onAfterTransform(hook: TransformHook<F>) {
    this.afterTransformHooks.push(hook);
    return this;
  }

  /**
   * Registrar manejador de errores personalizado
   */
  onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler);
    return this;
  }

  // ========================================
  // MÉTODOS DE CICLO DE VIDA
  // ========================================

  /**
   * Ejecutar hooks antes de validar
   */
  protected async runBeforeValidateHooks(data: F) {
    for (const hook of this.beforeValidateHooks) {
      try {
        await hook(data);
      } catch (error) {
        this.handleError(error, 'beforeValidateHook');
      }
    }
  }

  /**
   * Ejecutar hooks después de validar
   */
  protected async runAfterValidateHooks(data: F) {
    for (const hook of this.afterValidateHooks) {
      try {
        await hook(data);
      } catch (error) {
        this.handleError(error, 'afterValidateHook');
      }
    }
  }

  /**
   * Transformar datos ANTES de guardar
   */
  protected transformBeforeSave(data: F): F {
    let transformed = data;
    for (const hook of this.beforeTransformHooks) {
      transformed = hook(transformed);
    }
    return transformed;
  }

  /**
   * Transformar datos DESPUÉS de procesar
   */
  protected transformAfterProcess(data: F): F {
    let transformed = data;
    for (const hook of this.afterTransformHooks) {
      transformed = hook(transformed);
    }
    return transformed;
  }

  /**
   * Manejar errores con contexto
   */
  protected handleError(error: unknown, context: string) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error(`[${context}]`, errorObj);

    // Ejecutar manejadores registrados
    for (const handler of this.errorHandlers) {
      try {
        handler(error, context);
      } catch (e) {
        console.error('Error en manejador de errores:', e);
      }
    }
  }

  // ========================================
  // MÉTODOS CONCRETOS (herencia de GenericService)
  // ========================================

  /**
   * Búsqueda con filtros
   */
  search(filters: Filters) {
    router.get(this.indexUrl({ query: filters }), {}, {
      preserveState: true,
      preserveScroll: true,
      onError: (errors) => {
        NotificationService.error('Error al realizar la búsqueda');
        this.handleError(errors, 'search');
      }
    });
  }

  /**
   * Eliminar recurso con confirmación
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
        this.handleError(errors, 'destroy');
      }
    });
  }

  // ========================================
  // VALIDACIÓN (puede ser sobrescrita)
  // ========================================

  /**
   * Validar datos del formulario
   * Sobrescribible en subclases
   */
  validateData(data: F): string[] {
    const errors: string[] = [];

    if ('nombre' in data && (!data.nombre || String(data.nombre).trim().length === 0)) {
      errors.push('El nombre es requerido');
    }

    if ('nombre' in data && String(data.nombre).length > 255) {
      errors.push('El nombre no puede tener más de 255 caracteres');
    }

    return errors;
  }

  /**
   * Ejecutar validación completa con hooks
   */
  async validateWithHooks(data: F): Promise<string[]> {
    await this.runBeforeValidateHooks(data);
    const errors = this.validateData(data);
    await this.runAfterValidateHooks(data);
    return errors;
  }

  // ========================================
  // UTILIDADES
  // ========================================

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
