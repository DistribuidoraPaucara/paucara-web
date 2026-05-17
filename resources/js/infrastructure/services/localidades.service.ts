// Data Layer: Localidades service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Localidad, LocalidadFormData } from '@/domain/entities/localidades';

export class LocalidadesService extends GenericService<Localidad, LocalidadFormData> {
    constructor() {
        super('localidades');
    }

    // URL generators using the Controllers actions
    indexUrl(params?: { query?: Filters }) {
        return Controllers.LocalidadController.index(params).url;
    }

    createUrl() {
        return Controllers.LocalidadController.create().url;
    }

    editUrl(id: Id) {
        return Controllers.LocalidadController.edit(Number(id)).url;
    }

    storeUrl() {
        return Controllers.LocalidadController.store().url;
    }

    updateUrl(id: Id) {
        return Controllers.LocalidadController.update(Number(id)).url;
    }

    destroyUrl(id: Id) {
        return Controllers.LocalidadController.destroy(Number(id)).url;
    }

    // Método específico para obtener localidades activas para selects
    async getActiveLocalidades() {
        try {
            // Usar la ruta web que no requiere autenticación adicional
            const response = await fetch('/localidades/api/active', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (!response.ok) {
                throw new Error('Error al cargar localidades');
            }
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error loading localidades:', error);
            return [];
        }
    }
}

const localidadesService = new LocalidadesService();
export default localidadesService;
