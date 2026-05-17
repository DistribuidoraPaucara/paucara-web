// Domain Contracts - Service Interfaces
// Define contracts that infrastructure services must implement

import type { Id, Filters, Pagination } from '../entities/shared';

/**
 * Interfaz para servicios que usan Inertia.js
 *
 * Estos servicios NO hacen llamadas HTTP directas, sino que proporcionan URLs
 * para que Inertia.js maneje la navegación y las operaciones CRUD.
 *
 * @example
 * // Uso en un componente:
 * router.get(service.indexUrl({ query: filters }));
 * router.post(service.storeUrl(), data);
 * router.put(service.updateUrl(id), data);
 */
export interface IInertiaService<TFormData> {
    // URL generators for Inertia.js navigation
    indexUrl(params?: { query?: Filters }): string;
    createUrl(): string;
    showUrl(id: Id): string;
    editUrl(id: Id): string;
    storeUrl(): string;
    updateUrl(id: Id): string;
    destroyUrl(id: Id): string;

    // Validation (client-side)
    validateData(data: TFormData): string[];
}

/**
 * Interfaz para servicios con API REST tradicional
 *
 * Estos servicios hacen llamadas HTTP directas usando fetch/axios.
 * Útil para APIs externas o cuando no se usa Inertia.js.
 *
 * @deprecated Para nuevos módulos, usar IInertiaService con Inertia.js
 */
export interface IRepository<TEntity, TFormData> extends IInertiaService<TFormData> {
    // HTTP operations (direct API calls)
    index(params?: { query?: Filters }): Promise<Pagination<TEntity>>;
    show(id: Id): Promise<TEntity>;
    store(data: TFormData): Promise<TEntity>;
    update(id: Id, data: TFormData): Promise<TEntity>;
    destroy(id: Id): Promise<void>;
}

// Service contract for external API calls
export interface IApiService<TEntity, TFormData> extends IRepository<TEntity, TFormData> {
    // Additional service methods
    bulkDelete?(ids: Id[]): Promise<void>;
    export?(params?: { query?: Filters }): Promise<Blob>;
}

// Image service contract
export interface IImageService {
    upload(file: File): Promise<string>;
    delete(url: string): Promise<void>;
    getUrl(path: string): string;
}

// Notification service contract
export interface INotificationService {
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    info(message: string): void;
}