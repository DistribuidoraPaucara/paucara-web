import React from 'react';
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { vehiculosConfig } from '@/config/modules/vehiculos.config';
import vehiculosService from '@/infrastructure/services/vehiculos.service';
import type { Vehiculo, VehiculoFormData } from '@/domain/entities/vehiculos';

interface VehiculoFormProps {
    entity?: Vehiculo | null;
    choferes?: Array<{ value: number; label: string }>;
}

export default function VehiculoForm({ entity, choferes }: VehiculoFormProps) {
    console.log('=== DEBUG VehiculoForm ===');
    console.log('Entity:', entity);
    console.log('Choferes recibidos:', choferes?.length, choferes);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: vehiculosService.indexUrl() },
            { title: 'Vehículos', href: vehiculosService.indexUrl() }
        ]}>
            <GenericFormContainer<Vehiculo, VehiculoFormData>
                config={vehiculosConfig}
                service={vehiculosService}
                initialData={{} as VehiculoFormData}
                entity={entity}
                extraData={{ choferes: choferes || [] }}
            />
        </AppLayout>
    );
}
