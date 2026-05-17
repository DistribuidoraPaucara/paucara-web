// Application Use Cases
// Business logic and application-specific operations

import type { IRepository } from '@/domain/contracts';
import type { Id, Filters, Pagination } from '@/domain/entities/shared';

export class GenericUseCase<TEntity, TFormData> {
    constructor(private repository: IRepository<TEntity, TFormData>) { }

    async getAllEntities(filters?: Filters): Promise<Pagination<TEntity>> {
        return this.repository.index({ query: filters });
    }

    async getEntityById(id: Id): Promise<TEntity> {
        return this.repository.show(id);
    }

    async createEntity(data: TFormData): Promise<TEntity> {
        // Add any business validation here
        return this.repository.store(data);
    }

    async updateEntity(id: Id, data: TFormData): Promise<TEntity> {
        // Add any business validation here  
        return this.repository.update(id, data);
    }

    async deleteEntity(id: Id): Promise<void> {
        // Add any business rules for deletion
        return this.repository.destroy(id);
    }

    // Navigation helpers
    getIndexUrl(filters?: Filters): string {
        return this.repository.indexUrl({ query: filters });
    }

    getCreateUrl(): string {
        return this.repository.createUrl();
    }

    getShowUrl(id: Id): string {
        return this.repository.showUrl(id);
    }

    getEditUrl(id: Id): string {
        return this.repository.editUrl(id);
    }
}