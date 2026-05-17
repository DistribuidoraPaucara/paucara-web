import React from 'react';
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { vehiculosConfig } from '@/config/modules/vehiculos.config';
import vehiculosService from '@/infrastructure/services/vehiculos.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Vehiculo, VehiculoFormData } from '@/domain/entities/vehiculos';

interface VehiculosIndexProps {
    vehiculos: Pagination<Vehiculo>;
    filters: { q?: string };
}

export default function VehiculosIndex({ vehiculos, filters }: VehiculosIndexProps) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: vehiculosService.indexUrl() },
            { title: 'Vehículos', href: vehiculosService.indexUrl() }
        ]}>
            <GenericContainer<Vehiculo, VehiculoFormData>
                entities={vehiculos}
                filters={filters}
                config={vehiculosConfig}
                service={vehiculosService}
            />
        </AppLayout>
    );
}
