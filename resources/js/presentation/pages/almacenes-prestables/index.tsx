/**
 * Pages: Almacenes Prestables index page
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { almacenesPrestablesConfig } from '@/config/modules/almacenes-prestables.config';
import almacenesPrestablesService from '@/infrastructure/services/almacenes-prestables.service';
import type { Pagination } from '@/domain/entities/shared';
import type { AlmacenPrestable, AlmacenPrestableFormData } from '@/config/modules/almacenes-prestables.config';

interface AlmacenesPrestablesIndexProps {
  almacenes_prestables: Pagination<AlmacenPrestable>;
  filters: { q?: string };
}

export default function AlmacenesPrestablesIndex({ almacenes_prestables, filters }: AlmacenesPrestablesIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: almacenesPrestablesService.indexUrl() },
      { title: 'Almacenes Prestables', href: almacenesPrestablesService.indexUrl() }
    ]}>
      <GenericContainer<AlmacenPrestable, AlmacenPrestableFormData>
        entities={almacenes_prestables}
        filters={filters}
        config={almacenesPrestablesConfig}
        service={almacenesPrestablesService}
      />
    </AppLayout>
  );
}
