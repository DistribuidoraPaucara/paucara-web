/**
 * Pages: Unidades de Medida index page - MIGRACIÓN A GenericContainer
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { unidadesConfig } from '@/config/modules/unidades.config';
import unidadesMedidaService from '@/infrastructure/services/unidades.service';
import type { Pagination } from '@/domain/entities/shared';
import type { UnidadMedida, UnidadMedidaFormData } from '@/domain/entities/unidades-medida';

interface UnidadesMedidaIndexProps {
  unidades_medida: Pagination<UnidadMedida>;
  filters: { q?: string };
}

export default function UnidadesMedidaIndex({ unidades_medida, filters }: UnidadesMedidaIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: unidadesMedidaService.indexUrl() },
      { title: 'Unidades de Medida', href: unidadesMedidaService.indexUrl() }
    ]}>
      <GenericContainer<UnidadMedida, UnidadMedidaFormData>
        entities={unidades_medida}
        filters={filters}
        config={unidadesConfig}
        service={unidadesMedidaService}
      />
    </AppLayout>
  );
}
