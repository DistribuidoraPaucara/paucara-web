import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/infrastructure/services/generic.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Vehiculo, VehiculoFormData } from '@/domain/entities/vehiculos';

export class VehiculosService extends GenericService<Vehiculo, VehiculoFormData> {
    constructor() {
        super('vehiculos');
    }

    indexUrl(params?: { query?: Filters }) {
        return Controllers.VehiculoController.index(params).url;
    }

    createUrl() {
        return Controllers.VehiculoController.create().url;
    }

    editUrl(id: Id) {
        return Controllers.VehiculoController.edit(Number(id)).url;
    }

    storeUrl() {
        return Controllers.VehiculoController.store().url;
    }

    updateUrl(id: Id) {
        return Controllers.VehiculoController.update(Number(id)).url;
    }

    destroyUrl(id: Id) {
        return Controllers.VehiculoController.destroy(Number(id)).url;
    }
}

const vehiculosService = new VehiculosService();
export default vehiculosService;
