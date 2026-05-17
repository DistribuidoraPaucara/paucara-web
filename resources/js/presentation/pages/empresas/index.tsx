/**
 * Pages: Empresas index page
 *
 * FEATURES:
 * ✓ Listado completo de empresas
 * ✓ Paginación visual
 * ✓ Filtros avanzados (estado, principal)
 * ✓ Búsqueda integrada
 * ✓ Vista tabla/tarjetas
 * ✓ Crear, editar, eliminar empresas
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { empresasConfig } from '@/config/modules/empresas.config';
import empresasService from '@/infrastructure/services/empresas.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Empresa, EmpresaFormData } from '@/domain/entities/empresas';

interface EmpresasIndexProps {
  empresas: Pagination<Empresa>;
  filters: { q?: string };
}

export default function EmpresasIndex({ empresas, filters }: EmpresasIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/' },
      { title: 'Empresas', href: empresasService.indexUrl() }
    ]}>
      <GenericContainer<Empresa, EmpresaFormData>
        entities={empresas}
        filters={filters}
        config={empresasConfig}
        service={empresasService}
      />
    </AppLayout>
  );
}
