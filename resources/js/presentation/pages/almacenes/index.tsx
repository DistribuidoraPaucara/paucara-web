/**
 * Pages: Almacenes index page - MIGRACIÓN A GenericContainer
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { almacenesConfig } from '@/config/modules/almacenes.config';
import almacenesService from '@/infrastructure/services/almacenes.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Almacen, AlmacenFormData } from '@/domain/entities/almacenes';

interface AlmacenesIndexProps {
  almacenes: Pagination<Almacen>;
  filters: { q?: string };
}

export default function AlmacenesIndex({ almacenes, filters }: AlmacenesIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: almacenesService.indexUrl() },
      { title: 'Almacenes', href: almacenesService.indexUrl() }
    ]}>
      <GenericContainer<Almacen, AlmacenFormData>
        entities={almacenes}
        filters={filters}
        config={almacenesConfig}
        service={almacenesService}
      />
    </AppLayout>
  );
}
