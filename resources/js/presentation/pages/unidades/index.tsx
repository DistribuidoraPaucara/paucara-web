// Pages: Unidades index page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { unidadesConfig } from '@/config/modules/unidades.config';
import unidadesService from '@/infrastructure/services/unidades.service';
import type { Pagination } from '@/domain/entities/shared';
import type { UnidadMedida, UnidadMedidaFormData } from '@/domain/entities/unidades';

interface UnidadesIndexProps {
  unidades: Pagination<UnidadMedida>;
  filters: { q?: string };
}

export default function UnidadesIndex({ unidades, filters }: UnidadesIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: unidadesService.indexUrl() },
      { title: 'Unidades de Medida', href: unidadesService.indexUrl() }
    ]}>
      <GenericContainer<UnidadMedida, UnidadMedidaFormData>
        entities={unidades}
        filters={filters}
        config={unidadesConfig}
        service={unidadesService}
      />
    </AppLayout>
  );
}
