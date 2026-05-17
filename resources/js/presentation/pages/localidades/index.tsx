/**
 * Pages: Localidades index page - MIGRACIÓN A GenericContainer
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { localidadesConfig } from '@/config/modules/localidades.config';
import localidadesService from '@/infrastructure/services/localidades.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Localidad, LocalidadFormData } from '@/domain/entities/localidades';

interface LocalidadesIndexProps {
  localidades: Pagination<Localidad>;
  filters: { q?: string };
}

export default function LocalidadesIndex({ localidades, filters }: LocalidadesIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: localidadesService.indexUrl() },
      { title: 'Localidades', href: localidadesService.indexUrl() }
    ]}>
      <GenericContainer<Localidad, LocalidadFormData>
        entities={localidades}
        filters={filters}
        config={localidadesConfig}
        service={localidadesService}
      />
    </AppLayout>
  );
}
